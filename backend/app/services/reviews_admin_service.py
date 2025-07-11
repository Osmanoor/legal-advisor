# app/services/reviews_admin_service.py

from app.models import UserReview, User
from app.extensions import db

class ReviewsAdminService:
    def get_all_reviews(self, page=1, per_page=20):
        """
        Retrieves a paginated list of all user reviews.
        """
        # Query for reviews and include the user's full name to avoid extra queries (N+1 problem)
        reviews_query = db.session.query(UserReview, User.full_name)\
            .outerjoin(User, UserReview.user_id == User.id)\
            .order_by(UserReview.submitted_at.desc())
        
        paginated_reviews = reviews_query.paginate(page=page, per_page=per_page, error_out=False)
        
        reviews_data = []
        for review, user_name in paginated_reviews.items:
            reviews_data.append({
                "id": review.id,
                "user_id": str(review.user_id) if review.user_id else None,
                "user_name": user_name or "Guest", # Display 'Guest' if user is null
                "rating": review.rating,
                "comment": review.comment,
                "is_approved": review.is_approved,
                "is_archived": review.is_archived,
                "submitted_at": review.submitted_at.isoformat(),
                "preview_settings": review.preview_settings
            })
            
        return {
            "reviews": reviews_data,
            "total": paginated_reviews.total,
            "pages": paginated_reviews.pages,
            "current_page": paginated_reviews.page
        }, 200

    def update_review(self, review_id, data):
        """
        Updates the details and status of a specific review.
        """
        review = UserReview.query.get(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        # Update fields if they are present in the request data
        if 'is_approved' in data and isinstance(data['is_approved'], bool):
            review.is_approved = data['is_approved']
        
        if 'is_archived' in data and isinstance(data['is_archived'], bool):
            review.is_archived = data['is_archived']
            
        if 'comment' in data:
            review.comment = data['comment']
        
        # You could also add logic to update preview_settings if needed
        # if 'preview_settings' in data:
        #     review.preview_settings = data['preview_settings']

        try:
            db.session.commit()
            
            # Serialize and return the updated review object
            updated_review = {
                "id": review.id,
                "user_id": str(review.user_id) if review.user_id else None,
                "rating": review.rating,
                "comment": review.comment,
                "is_approved": review.is_approved,
                "is_archived": review.is_archived,
                "submitted_at": review.submitted_at.isoformat(),
                "preview_settings": review.preview_settings
            }
            return updated_review, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error updating review: {e}")
            return {"error": "An internal error occurred while updating the review."}, 500