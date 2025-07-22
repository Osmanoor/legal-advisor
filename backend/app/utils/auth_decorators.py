# app/utils/auth_decorators.py

from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.services.gatekeeper_service import GatekeeperService
from app.services.usage_service import UsageService

gatekeeper = GatekeeperService()
usage_service = UsageService()

def permission_required(permission_name: str):
    """
    A decorator to protect routes with a specific permission.
    This handles both registered users and guests based on a tiered logic.
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required(optional=True)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id) if user_id else None

            if gatekeeper.has_permission(user, permission_name):
                return fn(*args, **kwargs)
            else:
                error_msg = "You do not have the required permission for this feature."
                status_code = 403 # Forbidden
                if not user:
                    error_msg = "Access denied. This feature requires authentication."
                    status_code = 401 # Unauthorized
                return jsonify({"error": error_msg}), status_code
        return wrapper
    return decorator

def usage_limited(feature_name: str):
    """
    A decorator to rate-limit an endpoint based on daily usage.
    It checks the limit before execution and logs the usage after.
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required(optional=True)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id) if user_id else None
            guest_identifier = request.remote_addr if not user else None

            # 1. Check if the user is within their limits
            if not usage_service.check_usage(user, guest_identifier, feature_name):
                return jsonify({"error": "Daily usage limit for this feature has been reached."}), 429

            # 2. Execute the function
            response = fn(*args, **kwargs)
            
            # 3. Log the usage only if the request was successful (e.g., status 2xx)
            # This check is basic, assuming tuple response from blueprints (jsonify(..), status_code)
            status_code = response[1] if isinstance(response, tuple) and len(response) > 1 else 200
            
            if 200 <= status_code < 300:
                usage_service.log_usage(user_id, guest_identifier, feature_name)
            
            return response
        return wrapper
    return decorator