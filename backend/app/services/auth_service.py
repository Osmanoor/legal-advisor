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
from app.utils.validators import validate_phone_number, validate_password

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

    def _generate_and_store_code(self, phone_number):
        """Generates a 6-digit code, stores it, and returns it."""
        code = str(random.randint(100000, 999999))
        expires_at = time.time() + 600  # Code is valid for 10 minutes
        _reset_codes[phone_number] = {'code': code, 'expires_at': expires_at}
        return code

    def _send_sms(self, to_phone_number, body):
        """Sends an SMS using Twilio."""
        if not self.twilio_client:
            print(f"!!! TWILIO NOT CONFIGURED. SMS Body for {to_phone_number}: {body} !!!")
            return True, None # Pretend success for development
        
        try:
            message = self.twilio_client.messages.create(
                body=body,
                from_=os.environ['TWILIO_PHONE_NUMBER'],
                to=to_phone_number # Assumes international format, e.g., +966...
            )
            print(f"SMS sent to {to_phone_number}, SID: {message.sid}, body: {body}")
            return True, None
        except Exception as e:
            print(f"Twilio SMS sending failed: {e}")
            return False, str(e)

    def request_password_reset(self, phone_number):
        """Handles the 'forgot password' request."""
        user = User.query.filter_by(phone_number=phone_number).first()
        if not user:
            # We don't reveal if the user exists for security reasons
            return {"message": "If an account with this phone number exists, a reset code has been sent."}, 200

        code = self._generate_and_store_code(phone_number)
        body = f"Your password reset code is: {code}. It will expire in 10 minutes."
        
        # NOTE: Twilio requires phone numbers in E.164 format (e.g., +9665...).
        # We assume the input `phone_number` needs to be converted.
        # This is a placeholder for your specific conversion logic.
        formatted_phone = f"{phone_number.lstrip('0')}"

        success, error = self._send_sms(formatted_phone, body)
        
        if not success:
            return {"error": f"Failed to send reset code: {error}"}, 500

        return {"message": "If an account with this phone number exists, a reset code has been sent."}, 200

    def verify_reset_code(self, phone_number, code):
        """Verifies the provided reset code."""
        stored_code_info = _reset_codes.get(phone_number)
        if not stored_code_info:
            return {"error": "Invalid or expired code."}, 400

        if time.time() > stored_code_info['expires_at']:
            del _reset_codes[phone_number] # Clean up expired code
            return {"error": "Invalid or expired code."}, 400
        
        if stored_code_info['code'] != code:
            return {"error": "Invalid or expired code."}, 400
        
        # Code is valid, can be removed now
        del _reset_codes[phone_number]
        return {"message": "Code verified successfully."}, 200
    
    def verify_phone_number(self, phone_number, code):
        """
        Verifies a user's phone number with a code and logs them in.
        """
        # 1. Reuse the code verification logic from password reset
        stored_code_info = _reset_codes.get(phone_number)
        if not stored_code_info or time.time() > stored_code_info['expires_at'] or stored_code_info['code'] != code:
            return {"error": "Invalid or expired verification code."}, 400

        # 2. Find the user
        user = User.query.filter_by(phone_number=phone_number).first()
        if not user:
            return {"error": "User not found."}, 404

        # 3. Mark the user as verified
        try:
            user.phone_verified_at = datetime.utcnow()
            del _reset_codes[phone_number] # Clean up the used code
            db.session.commit()

            # 4. Create and return the user's first JWT (log them in)
            # This logic is copied from the login_user method
            role_permissions = {perm.name for role in user.roles for perm in role.permissions}
            user_specific_perms = {perm.name for perm in user.permission_overrides}
            all_permissions = list(role_permissions.union(user_specific_perms))
            additional_claims = {
                "roles": [role.name for role in user.roles],
                "permissions": all_permissions
            }
            access_token = create_access_token(
                identity=str(user.id), 
                additional_claims=additional_claims,
                expires_delta=timedelta(days=7)
            )
            user_data = {
                "id": str(user.id),
                "fullName": user.full_name,
                "email": user.email,
                "jobTitle": user.job_title,
                "roles": [role.name for role in user.roles],
                "permissions": all_permissions
            }
            return {"token": access_token, "user": user_data}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": "An internal error occurred during verification."}, 500

    def set_new_password(self, phone_number, new_password):
        """Sets a new password for the user."""
        if not validate_password(new_password):
            return {"error": "Password must be at least 8 characters long."}, 400
            
        user = User.query.filter_by(phone_number=phone_number).first()
        if not user:
            return {"error": "User not found."}, 404
        
        try:
            user.set_password(new_password)
            db.session.commit()
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
    def register_user(self, full_name, phone_number, password):
        """
        Handles the user registration process.
        Returns a tuple of (response, status_code).
        """
        if not validate_phone_number(phone_number):
            return {"error": "Invalid phone number format. It should be 10 digits starting with 05."}, 400
        if not validate_password(password):
            return {"error": "Password must be at least 8 characters long."}, 400
        if User.query.filter_by(phone_number=phone_number).first():
            return {"error": "A user with this phone number already exists."}, 409
        default_role = Role.query.filter_by(name='Registered User').first()
        if not default_role:
            return {"error": "Default user role not found. Please contact support."}, 500

        # Create the user object
        new_user = User(
            full_name=full_name,
            phone_number=phone_number,
        )
        new_user.set_password(password)
        new_user.roles.append(default_role)

        try:
            # Save the user to the database
            db.session.add(new_user)
            db.session.commit()

            # Generate and send verification code via SMS
            code = self._generate_and_store_code(phone_number) # We reuse the password reset storage for this
            body = f"Your verification code is: {code}. Welcome!"
            
            formatted_phone = f"{phone_number.lstrip('0')}"
            print(f"Sending verification SMS to {formatted_phone}: {body}")
            # success, error = self._send_sms(formatted_phone, body)

            # if not success:
            #     # In a real app, you might want to handle this more gracefully,
            #     # but for now, we'll return an error.
            #     return {"error": "User created, but failed to send verification SMS."}, 500

            # Prepare a success response, but DO NOT return a token yet.
            user_data = {
                "id": str(new_user.id),
                "fullName": new_user.full_name,
                "phoneNumber": new_user.phone_number
            }
            return {"message": "User registered successfully. Please enter the verification code sent to your phone.", "user": user_data}, 201
        
        except Exception as e:
            db.session.rollback()
            return {"error": "An internal error occurred during registration."}, 500
        
    def login_user(self, phone_number, password):
        user = User.query.filter_by(phone_number=phone_number).first()
        if not user or not user.check_password(password):
            return {"error": "Invalid phone number or password"}, 401
        role_permissions = {perm.name for role in user.roles for perm in role.permissions}
        user_specific_perms = {perm.name for perm in user.permission_overrides}
        all_permissions = list(role_permissions.union(user_specific_perms))
        additional_claims = {"roles": [role.name for role in user.roles], "permissions": all_permissions}
        access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims, expires_delta=timedelta(days=7))
        user_data = {"id": str(user.id), "fullName": user.full_name, "email": user.email, "jobTitle": user.job_title, "roles": [role.name for role in user.roles], "permissions": all_permissions}
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