# app/api/admin.py

from flask import Blueprint, request, jsonify
from app.utils.auth_decorators import permission_required
from app.services.admin_service import AdminService

admin_bp = Blueprint('admin', __name__)
admin_service = AdminService()

# --- Dashboard Stats Endpoint ---
@admin_bp.route('/dashboard-stats', methods=['GET'])
@permission_required('access_admin_dashboard')
def get_dashboard_stats():
    result, status_code = admin_service.get_dashboard_stats()
    return jsonify(result), status_code

# --- Settings & Role Management Endpoints ---
@admin_bp.route('/settings', methods=['GET'])
@permission_required('access_global_settings')
def get_settings():
    result, status_code = admin_service.get_all_settings()
    return jsonify(result), status_code

@admin_bp.route('/settings', methods=['PUT'])
@permission_required('access_global_settings')
def update_settings():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body cannot be empty"}), 400
    
    result, status_code = admin_service.update_all_settings(data)
    return jsonify(result), status_code

# --- Contact Submissions Endpoints ---
@admin_bp.route('/contact-submissions', methods=['GET'])
@permission_required('access_contact_us')
def get_contact_submissions():
    result, status_code = admin_service.get_contact_submissions()
    return jsonify(result), status_code

@admin_bp.route('/contact-submissions/<int:submission_id>/status', methods=['PUT'])
@permission_required('access_contact_us')
def update_contact_submission_status(submission_id):
    data = request.get_json()
    new_status = data.get('status')
    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    result, status_code = admin_service.update_contact_submission_status(submission_id, new_status)
    return jsonify(result), status_code