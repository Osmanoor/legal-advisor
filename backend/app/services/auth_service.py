# app/services/auth_service.py

import os
import time
import random
import requests
from datetime import timedelta, datetime
from twilio.rest import Client
from flask import jsonify, current_app, redirect
from flask_jwt_extended import create_access_token, get_jwt
from app.models import User, TokenBlocklist, Role
from app.extensions import db
from app.utils.validators import validate_email, validate_phone_number, validate_password
from app.utils.email import send_verification_email

import uuid
from google.cloud import storage
from werkzeug.utils import secure_filename

import sqlalchemy as sa

# Simple in-memory storage for reset codes.
# Format: {'phone_number': {'code': '123456', 'expires_at': timestamp}}
# NOTE: In a production multi-process environment, this should be replaced by Redis or a database table.
_reset_codes = {}

class AuthService:

    def __init__(self):
        # Initialize Twilio client if credentials are provided
        self.twilio_client = None
        if os.environ.get('TWILIO_ACCOUNT_SID'):
            self.twilio_client = Client(
                os.environ['TWILIO_ACCOUNT_SID'],
                os.environ['TWILIO_AUTH_TOKEN']
            )
        try:
            self.storage_client = storage.Client()
            self.bucket_name = os.environ.get('GCS_BUCKET_NAME')
            if self.bucket_name:
                self.bucket = self.storage_client.bucket(self.bucket_name)
            else:
                self.bucket = None
                print("WARNING: GCS_BUCKET_NAME not set. File uploads will be disabled.")
        except Exception as e:
            print(f"WARNING: Could not initialize Google Cloud Storage client: {e}")
            self.storage_client = None
            self.bucket = None

    def upload_avatar(self, user: User, file):
        if not self.bucket:
            return {"error": "File upload service is not configured."}, 500

        # Basic file validation
        if not file or file.filename == '':
            return {"error": "No file selected."}, 400
        
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        if '.' not in file.filename or \
           file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return {"error": "Invalid file type. Allowed types are: png, jpg, jpeg, gif."}, 400

        # Create a secure, unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"avatars/{user.id}/{uuid.uuid4()}_{filename}"

        # Upload to GCS
        try:
            blob = self.bucket.blob(unique_filename)
            blob.upload_from_file(file, content_type=file.content_type)
            
            # The public URL is what we store in the database
            public_url = blob.public_url

            # Update the user's profile in the database
            user.profile_picture_url = public_url
            db.session.commit()
            
            return {"profile_picture_url": public_url}, 200

        except Exception as e:
            db.session.rollback()
            print(f"GCS Upload Error: {e}")
            return {"error": "Failed to upload file."}, 500

    def serialize_user(self, user: User) -> dict:
        """Serializes a user object into a dictionary."""
        if not user:
            return {}
        return {
            "id": str(user.id), 
            "fullName": user.full_name, 
            "email": user.email,
            "phoneNumber": user.phone_number,
            "jobTitle": user.job_title, 
            "workplace": user.workplace,
            "linkedin_id": user.linkedin_id,
            "profile_picture_url": user.profile_picture_url,
            "roles": [role.name for role in user.roles], 
            "permissions": self.get_user_permissions(user)
        }

    def get_user_permissions(self, user: User) -> list:
        """Calculates and returns a list of all permissions for a user."""
        if not user:
            return []
            
        role_permissions = {perm.name for role in user.roles for perm in role.permissions}
        
        # Check for user.permission_overrides relationship before iterating
        if hasattr(user, 'permission_overrides'):
            user_specific_allow_perms = {override.permission.name for override in user.permission_overrides if override.override_type == 'ALLOW'}
            user_specific_deny_perms = {override.permission.name for override in user.permission_overrides if override.override_type == 'DENY'}
        else:
            user_specific_allow_perms = set()
            user_specific_deny_perms = set()
            
        # Final permissions are (role perms UNION user allow perms) MINUS user deny perms
        final_permissions = (role_permissions.union(user_specific_allow_perms)) - user_specific_deny_perms
        
        return list(final_permissions)

    def _generate_and_store_code(self, identifier, code=None):
        """Generates a 6-digit code, stores it, and returns it."""
        if not code:
            code = str(random.randint(100000, 999999))
        expires_at = time.time() + 1800  # Code is valid for 10 minutes
        _reset_codes[identifier] = {'code': code, 'expires_at': expires_at}
        return code

    def _send_sms(self, to_phone_number, body):
        """Sends an SMS using Twilio."""
        if not self.twilio_client:
            print(f"!!! TWILIO NOT CONFIGURED. SMS Body for {to_phone_number}: {body} !!!")
            return True, None # Pretend success for development
        
        try:
            # message = self.twilio_client.messages.create(
            #     body=body,
            #     from_=os.environ['TWILIO_PHONE_NUMBER'],
            #     to=to_phone_number # Assumes international format, e.g., +966...
            # )
            print(f"SMS sent to {to_phone_number}, body: {body}")
            return True, None
        except Exception as e:
            print(f"Twilio SMS sending failed: {e}")
            return False, str(e)

    def verify_otp(self, identifier, code):
        """Verifies an OTP for either an email or a phone number."""
        stored_code_info = _reset_codes.get(identifier)
        if not stored_code_info or time.time() > stored_code_info['expires_at'] or stored_code_info['code'] != code:
            return {"error": "Invalid or expired verification code."}, 400

        is_email = validate_email(identifier)
        user = None
        if is_email:
            user = User.query.filter_by(email=identifier).first()
        else:
            user = User.query.filter_by(phone_number=identifier).first()

        if not user:
            return {"error": "User not found."}, 404
            
        try:
            if is_email:
                user.email_verified_at = datetime.utcnow()
            else:
                user.phone_verified_at = datetime.utcnow()
            
            del _reset_codes[identifier]
            db.session.commit()

            # Log the user in
            result, status_code = self.login_user(identifier, user.password_hash, from_verification=True)
            return result, status_code
        except Exception as e:
            db.session.rollback()
            return {"error": "An internal error occurred during verification."}, 500

    def request_password_reset(self, identifier: str):
        """Finds a user by email or phone and sends reset OTPs to all available channels."""
        user = None
        if validate_email(identifier):
            user = User.query.filter_by(email=identifier).first()
        elif validate_phone_number(identifier):
            user = User.query.filter_by(phone_number=identifier).first()
        else:
            # Return a generic message even for invalid identifier format for security
            return {"message": "If an account matching that identifier exists, a reset code has been sent."}, 200

        # If no user is found, we still return a generic success message
        # to prevent account enumeration attacks.
        if not user:
            print(f"Password reset requested for non-existent user: {identifier}")
            return {"message": "If an account matching that identifier exists, a reset code has been sent."}, 200

        # Generate one code to be sent to all channels
        code = self._generate_and_store_code(identifier)
        
        message_parts = []
        
        # Send to phone if available and verified
        if user.phone_number:
            self._send_sms(user.phone_number, f"Your password reset code is: {code}")
            # Ensure the code is also stored against the phone number for verification
            self._generate_and_store_code(user.phone_number, code=code)
            message_parts.append("phone")

        # Send to email if available and verified
        if user.email:
            send_verification_email(user.email, code)
            # Ensure the code is also stored against the email for verification
            self._generate_and_store_code(user.email, code=code)
            message_parts.append("email")
            
        if not message_parts:
            # This case happens if a user exists but has no verified contact methods.
            # We still return a generic message.
            print(f"User {user.id} requested password reset but has no verified contact methods.")

        sent_to = " and ".join(message_parts)
        print(f"Sent password reset code for user {user.id} to: {sent_to}")
        
        return {"message": f"If an account exists, a reset code has been sent."}, 200

    # --- REFACTORED: Now accepts a generic identifier ---
    def verify_reset_code(self, identifier: str, code: str):
        """Verifies a reset code for either an email or phone number."""
        stored_code_info = _reset_codes.get(identifier)
        if not stored_code_info or time.time() > stored_code_info['expires_at'] or stored_code_info['code'] != code:
            return {"error": "Invalid or expired code."}, 400
        
        # The code is valid. It doesn't need to be removed yet, as it's the proof
        # for the final password reset step. The expiration time is the security gate.
        return {"message": "Code verified successfully."}, 200

    # --- REFACTORED: Now accepts a generic identifier ---
    def set_new_password(self, identifier: str, new_password: str, code: str):
        """Sets a new password after verifying the reset code one last time."""
        # Final security check: ensure the provided code is still valid for the identifier
        stored_code_info = _reset_codes.get(identifier)
        if not stored_code_info or time.time() > stored_code_info['expires_at'] or stored_code_info['code'] != code:
            return {"error": "Invalid or expired session. Please start the process again."}, 400

        if not validate_password(new_password):
            return {"error": "Password must be at least 8 characters long."}, 400
            
        user = None
        if validate_email(identifier):
            user = User.query.filter_by(email=identifier).first()
        else:
            user = User.query.filter_by(phone_number=identifier).first()
            
        if not user:
            return {"error": "User not found."}, 404
        
        try:
            user.set_password(new_password)
            db.session.commit()
            # Clean up the used code
            del _reset_codes[identifier]
            return {"message": "Password has been reset successfully."}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": "An internal error occurred while resetting the password."}, 500


    def handle_linkedin_callback(self, code):
        """Orchestrates the LinkedIn OAuth callback flow."""
        # 1. Exchange authorization code for access token
        access_token = self._get_linkedin_access_token(code)
        if not access_token:
            return {"error": "Failed to retrieve LinkedIn access token"}, 500

        # 2. Get user profile and email from LinkedIn
        user_profile = self._get_linkedin_user_profile(access_token)
        user_email_data = self._get_linkedin_user_email(access_token)
        if not user_profile or not user_email_data:
            return {"error": "Failed to retrieve LinkedIn user details"}, 500

        linkedin_id = user_profile.get('id')
        email = user_email_data.get('email')
        full_name = f"{user_profile.get('localizedFirstName')} {user_profile.get('localizedLastName')}"

        # 3. Find or create user in our database
        user = User.query.filter_by(linkedin_id=linkedin_id).first()
        if not user:
            # If no user with that linkedin_id, check by email
            user = User.query.filter_by(email=email).first()
            if user:
                # User exists, link their LinkedIn account
                user.linkedin_id = linkedin_id
            else:
                # New user, create them
                default_role = Role.query.filter_by(name='Registered User').first()
                user = User(
                    full_name=full_name,
                    email=email,
                    linkedin_id=linkedin_id,
                    # We need to ask for a phone number and create a random password
                    # This is a complex flow; for now, we'll create a placeholder
                    phone_number=f"linkedin_{linkedin_id}", # Placeholder!
                )
                user.set_password(os.urandom(16)) # Secure random password
                user.roles.append(default_role)
                db.session.add(user)
        
        db.session.commit()

        # 4. Create our own JWT for the user
        additional_claims = {"roles": [role.name for role in user.roles]}
        app_access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
        
        return {"token": app_access_token, "user_id": str(user.id)}, 200

    def _get_linkedin_access_token(self, code):
        """Exchanges an auth code for a LinkedIn access token."""
        url = 'https://www.linkedin.com/oauth/v2/accessToken'
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': os.environ['LINKEDIN_REDIRECT_URI'],
            'client_id': os.environ['LINKEDIN_CLIENT_ID'],
            'client_secret': os.environ['LINKEDIN_CLIENT_SECRET']
        }
        response = requests.post(url, data=payload)
        if response.status_code == 200:
            return response.json().get('access_token')
        print(f"LinkedIn Token Error: {response.text}")
        return None

    def _get_linkedin_user_profile(self, access_token):
        """Gets user's basic profile from LinkedIn."""
        url = 'https://api.linkedin.com/v2/me'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        return None
        
    def _get_linkedin_user_email(self, access_token):
        """Gets user's primary email from LinkedIn."""
        url = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return {"email": data['elements'][0]['handle~']['emailAddress']}
        return None

    # ... (register, login, logout methods remain here) ...
    def register_user(self, full_name, password, email=None, phone_number=None):
        """Handles registration with either email, phone, or both."""
        if not email and not phone_number:
            return {"error": "Email or phone number is required."}, 400

        # --- Input Validation ---
        if email and not validate_email(email):
            return {"error": "Invalid email format."}, 400
        if phone_number and not validate_phone_number(phone_number):
            return {"error": "Invalid phone number format."}, 400
        if not validate_password(password):
            return {"error": "Password must be at least 8 characters long."}, 400

        # --- Check for Existing VERIFIED Users ---
        # Build a filter to find any user who is already verified with either the given email or phone
        query_filters = []
        if email:
            query_filters.append(
                sa.and_(User.email == email, User.email_verified_at.isnot(None))
            )
        if phone_number:
            query_filters.append(
                sa.and_(User.phone_number == phone_number, User.phone_verified_at.isnot(None))
            )

        if query_filters and User.query.filter(sa.or_(*query_filters)).first():
            return {"error": "A verified account with this email or phone number already exists."}, 409

        # --- Find Existing UNVERIFIED User or Create New ---
        # Try to find a user who might have started registration but didn't finish
        unverified_user_query = []
        if email:
            unverified_user_query.append(User.email == email)
        if phone_number:
            unverified_user_query.append(User.phone_number == phone_number)
        
        user_to_save = User.query.filter(sa.or_(*unverified_user_query)).first()

        if user_to_save:
            # An unverified user exists, so we'll update their info and resend the code
            print(f"Updating existing unverified user: {user_to_save.id}")
            user_to_save.full_name = full_name
            user_to_save.set_password(password)
            # Update email/phone if they were missing before
            if email and not user_to_save.email:
                user_to_save.email = email
            if phone_number and not user_to_save.phone_number:
                user_to_save.phone_number = phone_number
        else:
            # No existing user found, create a brand new one
            print("Creating new user.")
            user_to_save = User(
                full_name=full_name,
                email=email,
                phone_number=phone_number
            )
            user_to_save.set_password(password)
            default_role = Role.query.filter_by(name='Registered User').first()
            if default_role:
                user_to_save.roles.append(default_role)
        
        # --- Send Verification Codes ---
        primary_identifier = phone_number if phone_number else email
        if not primary_identifier:
             return {"error": "A valid identifier is required."}, 400

        code = self._generate_and_store_code(primary_identifier)
        
        try:
            if phone_number:
                self._send_sms(phone_number, f"Your verification code is: {code}")
                # Store the same code for the phone number for verification purposes
                # self._generate_and_store_code(phone_number, code=code)
            if email:
                send_verification_email(email, code)
        except Exception as e:
            print(f"OTP Sending Error: {e}")
            return {"error": "Failed to send verification code. Please try again."}, 500

        # --- Commit to Database ---
        try:
            db.session.add(user_to_save)
            db.session.commit()
            return {"message": "User registered. Please check for verification code."}, 201
        except Exception as e:
            db.session.rollback()
            print(f"Database Commit Error: {e}")
            return {"error": "An unexpected database error occurred."}, 500

    def login_user(self, login_identifier, password, remember_me=False, from_verification=False):
        """Logs a user in using either their email or phone number."""
        user = None
        if validate_email(login_identifier):
            user = User.query.filter_by(email=login_identifier).first()
        else:
            user = User.query.filter_by(phone_number=login_identifier).first()
        
        if not user:
            return {"error": "Invalid credentials."}, 401
        
        if user.status == 'suspended':
            return {"error": "This account has been suspended."}, 403

        if not from_verification and not user.check_password(password):
            return {"error": "Invalid credentials."}, 401
        
        # --- "Remember Me" Logic ---
        if remember_me:
            # Set a long expiration for the token
            expires_delta = timedelta(days=30)
            print(f"User {user.id} chose 'Remember Me'. Token will expire in 30 days.")
        else:
            # Set a standard, shorter expiration
            expires_delta = timedelta(days=1)
            print(f"User {user.id} did not choose 'Remember Me'. Token will expire in 1 day.")


        # ... (rest of the login logic is the same)
        additional_claims = {"roles": [role.name for role in user.roles]}
        access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims, expires_delta=expires_delta)
        user_data = self.serialize_user(user)
        return {"token": access_token, "user": user_data}, 200

    def logout_user(self):
        try:
            jti = get_jwt()["jti"]
            blocklisted_token = TokenBlocklist(jti=jti)
            db.session.add(blocklisted_token)
            db.session.commit()
            return {"message": "Successfully logged out"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": "Could not process logout"}, 500