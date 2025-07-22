# app/api/reviews.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import UserReview, User
from app.extensions import db
import uuid
from app.utils.auth_decorators import permission_required

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('', methods=['POST'])
@jwt_required()
@permission_required('access_feedback')
def submit_review():
    """
    Allows an authenticated user to submit a new review.
    A user can only have one review. If they submit a new one, it overwrites the old one.
    """
    user_id_str = get_jwt_identity()
    user_id = uuid.UUID(user_id_str)
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body cannot be empty"}), 400

    rating = data.get('rating')
    comment = data.get('comment')
    preview_settings = data.get('preview_settings', {})

    # --- Validation ---
    if not rating or not isinstance(rating, int) or not (1 <= rating <= 5):
        return jsonify({"error": "A rating between 1 and 5 is required."}), 400
        
    if not isinstance(preview_settings, dict):
        return jsonify({"error": "'preview_settings' must be an object."}), 400
    
    # --- Logic: Find existing review or create a new one ---
    review = UserReview.query.filter_by(user_id=user_id).first()
    
    if review:
        # Update existing review
        print(f"Updating existing review for user {user_id}")
        review.rating = rating
        review.comment = comment
        review.preview_settings = preview_settings
        review.is_approved = False # Reset approval status on new submission
        review.is_archived = False
    else:
        # Create a new review
        print(f"Creating new review for user {user_id}")
        review = UserReview(
            user_id=user_id,
            rating=rating,
            comment=comment,
            preview_settings=preview_settings
        )
        db.session.add(review)

    try:
        db.session.commit()
        return jsonify({"message": "Your feedback has been submitted successfully."}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error submitting review: {e}")
        return jsonify({"error": "An internal database error occurred."}), 500