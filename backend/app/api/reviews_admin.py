# app/api/reviews_admin.py

from flask import Blueprint, request, jsonify
from app.utils.auth_decorators import permission_required
from app.services.reviews_admin_service import ReviewsAdminService

reviews_admin_bp = Blueprint('reviews_admin', __name__)
reviews_admin_service = ReviewsAdminService()

@reviews_admin_bp.route('', methods=['GET'])
@permission_required('access_ratings_management')
def get_reviews():
    """
    Gets a paginated list of all user reviews.
    Accepts 'page' and 'per_page' query parameters.
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    result, status_code = reviews_admin_service.get_all_reviews(page, per_page)
    return jsonify(result), status_code

@reviews_admin_bp.route('/<int:review_id>', methods=['PUT'])
@permission_required('access_ratings_management')
def update_review(review_id):
    """
    Updates a specific review's details and status.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body cannot be empty"}), 400
    
    result, status_code = reviews_admin_service.update_review(review_id, data)
    return jsonify(result), status_code