# app/api/users_admin.py

from flask import Blueprint, request, jsonify
from app.utils.auth_decorators import permission_required
from app.services.users_admin_service import UsersAdminService

users_admin_bp = Blueprint('users_admin', __name__)
users_admin_service = UsersAdminService()

@users_admin_bp.route('', methods=['POST'])
@permission_required('manage_users')
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body cannot be empty"}), 400
    result, status_code = users_admin_service.create_user(data)
    return jsonify(result), status_code

@users_admin_bp.route('', methods=['GET'])
@permission_required('manage_users')
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    result, status_code = users_admin_service.get_all_users(page, per_page)
    return jsonify(result), status_code

@users_admin_bp.route('/<uuid:user_id>', methods=['GET'])
@permission_required('manage_users')
def get_user(user_id):
    result, status_code = users_admin_service.get_user_by_id(user_id)
    return jsonify(result), status_code

@users_admin_bp.route('/<uuid:user_id>', methods=['PUT'])
@permission_required('update_user')
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body cannot be empty"}), 400
    result, status_code = users_admin_service.update_user(user_id, data)
    return jsonify(result), status_code

@users_admin_bp.route('/<uuid:user_id>', methods=['DELETE'])
@permission_required('delete_user')
def delete_user(user_id):
    result, status_code = users_admin_service.delete_user(user_id)
    return jsonify(result), status_code