# app/api/auth.py

import os
from flask import Blueprint, request, jsonify, redirect, current_app
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies, jwt_required, get_jwt_identity
from app.services.auth_service import AuthService
from app.utils.auth_decorators import permission_required
from app.models import User # Import the User model
from app.extensions import db

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_bp.route('/profile/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    if 'avatar' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['avatar']
    
    result, status_code = auth_service.upload_avatar(user, file)
    return jsonify(result), status_code


@auth_bp.route('/password/change', methods=['POST'])
@jwt_required()
def change_password():
    """Allows a logged-in user to change their password."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    data = request.get_json()
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not current_password or not new_password:
        return jsonify({"error": "Current and new passwords are required."}), 400

    # Verify the user's current password
    if not user.check_password(current_password):
        return jsonify({"error": "Incorrect current password."}), 401

    # Set the new password
    user.set_password(new_password)
    try:
        db.session.commit()
        return jsonify({"message": "Password updated successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An internal error occurred."}), 500


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body cannot be empty"}), 400
    
    if 'email' in data and user.email:
        return jsonify({"error": "Cannot change a verified email from this endpoint."}), 400
    if 'phoneNumber' in data and user.phone_number:
        return jsonify({"error": "Cannot change a verified phone number from this endpoint."}), 400

    # Define fields that are allowed to be updated
    # --- ADD 'workplace' TO THE LIST ---
    allowed_fields = ['fullName', 'email', 'jobTitle', 'linkedin', 'workplace'] 
    updated = False

    if 'fullName' in data and data['fullName']:
        user.full_name = data['fullName']
        updated = True
    
    if 'email' in data and data['email']:
        if User.query.filter(User.email == data['email'], User.id != user.id).first():
            return jsonify({"error": "This email is already in use by another account."}), 409
        user.email = data['email']
        updated = True
        
    if 'jobTitle' in data:
        user.job_title = data['jobTitle']
        updated = True

    if 'linkedin' in data:
        user.linkedin_id = data['linkedin']
        updated = True
    
    # --- ADD LOGIC TO UPDATE THE WORKPLACE FIELD ---
    if 'workplace' in data:
        user.workplace = data['workplace']
        updated = True

    if not updated:
        return jsonify({"message": "No updatable fields provided."}), 200

    try:
        db.session.commit()
        user_data = auth_service.serialize_user(user) # Use a helper for serialization
        return jsonify(user_data), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An internal error occurred while updating the profile."}), 500

# --- New Endpoint to Get Current User ---
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Gets the profile of the currently authenticated user."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = auth_service.serialize_user(user)
    return jsonify(user_data), 200

# --- Password Reset Flow ---
@auth_bp.route('/password/forgot', methods=['POST'])
def forgot_password():
    data = request.get_json()
    identifier = data.get('identifier')
    if not identifier:
        return jsonify({"error": "Email or phone number is required"}), 400
    
    result, status_code = auth_service.request_password_reset(identifier)
    return jsonify(result), status_code

@auth_bp.route('/password/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    identifier = data.get('identifier')
    code = data.get('code')
    if not identifier or not code:
        return jsonify({"error": "Identifier and code are required"}), 400
        
    result, status_code = auth_service.verify_reset_code(identifier, code)
    return jsonify(result), status_code

@auth_bp.route('/password/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    identifier = data.get('identifier')
    new_password = data.get('newPassword')
    code = data.get('code') # We now require the code for the final step for security
    
    if not identifier or not new_password or not code:
        return jsonify({"error": "Identifier, new password, and verification code are required"}), 400
    
    result, status_code = auth_service.set_new_password(identifier, new_password, code)
    return jsonify(result), status_code
# --- LinkedIn Social Login Flow ---

@auth_bp.route('/linkedin', methods=['GET'])
def linkedin_login():
    """Redirects the user to LinkedIn for authorization."""
    client_id = os.environ.get('LINKEDIN_CLIENT_ID')
    redirect_uri = os.environ.get('LINKEDIN_REDIRECT_URI')
    
    # Define the necessary scopes
    scopes = 'openid profile email'
    
    linkedin_auth_url = (
        f"https://www.linkedin.com/oauth/v2/authorization?"
        f"response_type=code&client_id={client_id}&"
        f"redirect_uri={redirect_uri}&scope={scopes}"
    )
    return redirect(linkedin_auth_url)

@auth_bp.route('/linkedin/callback', methods=['GET'])
def linkedin_callback():
    """Handles the callback from LinkedIn after authorization."""
    code = request.args.get('code')

    # --- MODIFICATION START: Environment-aware redirect URLs ---
    frontend_url = current_app.config.get('FRONTEND_URL')
    # Use absolute URL in development if FRONTEND_URL is set, otherwise use relative path for production.
    base_url = frontend_url if frontend_url else ''
    
    if not code:
        # Redirect to frontend login page with an error
        return redirect(f"{base_url}/login?error=linkedin_auth_failed")

    result, status_code = auth_service.handle_linkedin_callback(code)

    if status_code == 200:
        # On success, set our app's cookie and redirect to the frontend dashboard
        response = redirect(f"{base_url}/chat") # Use base_url for the redirect
        set_access_cookies(response, result["token"])
        return response

    # On failure, redirect back to the frontend login page with a different error
    return redirect(f"{base_url}/login?error=linkedin_process_failed")
    # --- MODIFICATION END ---


# ... (register, login, logout endpoints remain here) ...
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Pass all relevant fields to the service
    result, status_code = auth_service.register_user(
        full_name=data.get('fullName'),
        password=data.get('password'),
        email=data.get('email'),
        phone_number=data.get('phoneNumber')
    )
    return jsonify(result), status_code

# Rename verify-phone to verify
@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    result, status_code = auth_service.verify_otp(
        identifier=data.get('identifier'),
        code=data.get('code')
    )
    # The login process is now handled inside verify_otp
    if status_code == 200:
        response = jsonify({"user": result["user"]})
        set_access_cookies(response, result["token"])
        return response, 200
    return jsonify(result), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    # Use a generic identifier for login
    result, status_code = auth_service.login_user(
        login_identifier=data.get('loginIdentifier'),
        password=data.get('password'),
        remember_me=data.get('rememberMe', False),
    )
    if status_code == 200:
        response = jsonify({"user": result["user"]})
        set_access_cookies(response, result["token"])
        return response, 200
    return jsonify(result), status_code


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    result, status_code = auth_service.logout_user()
    response = jsonify(result)
    unset_jwt_cookies(response)
    return response, status_code