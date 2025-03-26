# app/api/admin.py

from functools import wraps
from flask import Blueprint, request, jsonify, session
from app.services.admin_service import AdminService
from app.utils.auth import require_auth

admin_bp = Blueprint('admin', __name__)
admin_service = AdminService()

def require_auth(f):
    """
    Decorator for routes that require basic authentication
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return jsonify({'error': 'Unauthorized access'}), 401
        return f(*args, **kwargs)
    return decorated

def check_auth(username: str, password: str) -> bool:
    """
    Check if username and password are valid
    """
    return username == 'admin' and password == '123'

@admin_bp.route('/contact', methods=['POST'])
def submit_contact():
    """Submit a contact form"""
    try:
        data = request.get_json()
        return admin_service.save_contact(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/contacts', methods=['GET'])
@require_auth
def get_contacts():
    """Get all contact form submissions (admin only)"""
    try:
        return admin_service.get_all_contacts()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/emails', methods=['GET'])
@require_auth
def get_emails():
    """Get all sent email records (admin only)"""
    try:
        return admin_service.get_all_emails()
    except Exception as e:
        return jsonify({'error': str(e)}), 500