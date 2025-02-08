# app/api/admin.py
from flask import Blueprint, request, jsonify
from app.services.admin_service import AdminService
from app.utils.auth import require_auth

admin_bp = Blueprint('admin', __name__)
admin_service = AdminService()

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