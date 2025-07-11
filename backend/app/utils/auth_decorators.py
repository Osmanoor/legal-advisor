# app/utils/auth_decorators.py

from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.services.gatekeeper_service import GatekeeperService # Import the new service

gatekeeper = GatekeeperService()

def permission_required(permission_name: str):
    """
    A decorator to protect routes with a specific permission.
    This now handles both registered users and guest users based on settings.
    """
    def decorator(fn):
        @wraps(fn)
        # Use optional=True to allow the route to be accessed by guests
        @jwt_required(optional=True)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()

            # --- Case 1: Registered User ---
            if user_id:
                user = User.query.get(user_id)
                if not user:
                    return jsonify({"error": "User not found"}), 401

                if user.can(permission_name):
                    # User has permission, proceed to the route function
                    return fn(*args, **kwargs)
                else:
                    # User does not have permission
                    return jsonify({"error": "You do not have the required permission for this feature."}), 403
            
            # --- Case 2: Guest User (user_id is None) ---
            else:
                if gatekeeper.is_guest_allowed(permission_name):
                    # Guest is allowed based on global settings, proceed
                    return fn(*args, **kwargs)
                else:
                    # Guest is not allowed, or is trying to access a non-feature permission
                    return jsonify({
                        "error": "Access denied. This feature requires authentication or is disabled for guest users."
                    }), 401 # Use 401 to prompt login

        return wrapper
    return decorator