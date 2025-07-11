# app/api/auth.py

import os
from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies, jwt_required
from app.services.auth_service import AuthService
from app.utils.auth_decorators import permission_required

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

# --- Password Reset Flow ---

@auth_bp.route('/password/forgot', methods=['POST'])
def forgot_password():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
    
    result, status_code = auth_service.request_password_reset(phone_number)
    return jsonify(result), status_code

@auth_bp.route('/password/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    code = data.get('code')
    if not phone_number or not code:
        return jsonify({"error": "Phone number and code are required"}), 400
        
    result, status_code = auth_service.verify_reset_code(phone_number, code)
    return jsonify(result), status_code

@auth_bp.route('/password/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    new_password = data.get('newPassword')
    # NOTE: In a real app, you'd pass a temporary token from verify_code
    # to prove the user completed that step. For simplicity, we omit that here.
    if not phone_number or not new_password:
        return jsonify({"error": "Phone number and new password are required"}), 400
    
    result, status_code = auth_service.set_new_password(phone_number, new_password)
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
    if not code:
        return redirect('/login?error=linkedin_auth_failed') # Redirect to frontend login

    result, status_code = auth_service.handle_linkedin_callback(code)

    if status_code == 200:
        # On success, set our own app's cookie and redirect to the frontend dashboard
        # The frontend will need to handle this redirect and store the user info.
        response = redirect('/dashboard') # Redirect to the main app dashboard
        set_access_cookies(response, result["token"])
        return response

    return redirect('/login?error=linkedin_process_failed')


# ... (register, login, logout endpoints remain here) ...
@auth_bp.route('/verify-phone', methods=['POST'])
def verify_phone():
    """Endpoint for verifying a new user's phone number."""
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    code = data.get('code')

    if not phone_number or not code:
        return jsonify({"error": "Phone number and code are required"}), 400
    
    result, status_code = auth_service.verify_phone_number(phone_number, code)

    # If verification is successful, a token is returned. We must set the cookie.
    if status_code == 200:
        response = jsonify({"user": result["user"]})
        set_access_cookies(response, result["token"])
        return response, 200

    return jsonify(result), status_code

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('fullName')
    phone_number = data.get('phoneNumber')
    password = data.get('password')
    if not all([full_name, phone_number, password]):
        return jsonify({"error": "Full name, phone number, and password are required"}), 400
    result, status_code = auth_service.register_user(full_name, phone_number, password)
    return jsonify(result), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    password = data.get('password')
    if not phone_number or not password:
        return jsonify({"error": "Phone number and password are required"}), 400
    result, status_code = auth_service.login_user(phone_number, password)
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

@auth_bp.route('/test-permission', methods=['GET'])
@permission_required('access_admin_dashboard') # Protect this route
def test_permission():
    """
    A test endpoint to demonstrate the permission decorator.
    Only users with 'access_admin_dashboard' permission can access this.
    """
    return jsonify({"message": "Success! You have the 'access_admin_dashboard' permission."}), 200