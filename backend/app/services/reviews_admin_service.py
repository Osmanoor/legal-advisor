# app/services/reviews_admin_service.py

from app.models import UserReview, User
from app.extensions import db

class ReviewsAdminService:
    def get_all_reviews(self, page=1, per_page=20, filter_by='pending'): # <-- Default filter is 'pending'
        """
        Retrieves a paginated list of all user reviews, with filtering.
        """
        # Base query to select the review object and related user details
        query = db.session.query(
            UserReview, 
            User.full_name, 
            User.profile_picture_url
        ).outerjoin(User, UserReview.user_id == User.id)

        # --- NEW FILTERING LOGIC ---
        if filter_by == 'pending':
            # Filter for reviews that are NOT approved AND NOT archived
            query = query.filter(UserReview.is_approved == False, UserReview.is_archived == False)
        elif filter_by == 'approved':
            query = query.filter(UserReview.is_approved == True)
        elif filter_by == 'archived':
            query = query.filter(UserReview.is_archived == True)
        # If filter_by is 'all' or anything else, no filter is applied.
        
        # Add ordering and paginate
        reviews_paginated = query.order_by(UserReview.submitted_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        reviews_data = []
        for review, user_name, user_profile_picture_url in reviews_paginated.items:
            reviews_data.append({
                "id": review.id,
                "user_id": str(review.user_id) if review.user_id else None,
                "user_name": user_name or "Guest",
                "user_profile_picture_url": user_profile_picture_url,
                "rating": review.rating,
                "comment": review.comment,
                "is_approved": review.is_approved,
                "is_archived": review.is_archived,
                "submitted_at": review.submitted_at.isoformat(),
                "preview_settings": review.preview_settings
            })
            
        return {
            "reviews": reviews_data,
            "total": reviews_paginated.total,
            "pages": reviews_paginated.pages,
            "current_page": reviews_paginated.page
        }, 200
    def update_review(self, review_id, data):
        """
        Updates the details and status of a specific review,
        ensuring that 'approved' and 'archived' are mutually exclusive.
        """
        review = UserReview.query.get(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        # --- NEW STATE LOGIC ---
        # The request payload will contain the desired new state.
        
        # Handle 'is_approved' update
        if 'is_approved' in data and isinstance(data['is_approved'], bool):
            review.is_approved = data['is_approved']
            # If we are approving a review, it cannot be archived.
            if review.is_approved:
                review.is_archived = False
        
        # Handle 'is_archived' update
        if 'is_archived' in data and isinstance(data['is_archived'], bool):
            review.is_archived = data['is_archived']
            # If we are archiving a review, it cannot be approved.
            if review.is_archived:
                review.is_approved = False
            
        # Handle comment update (this is independent)
        if 'comment' in data:
            review.comment = data['comment']

        try:
            db.session.commit()
            
            # ... (Serialization logic remains the same)
            user_details = {"user_name": "Guest", "user_profile_picture_url": None}
            if review.user:
                user_details["user_name"] = review.user.full_name
                user_details["user_profile_picture_url"] = review.user.profile_picture_url

            updated_review = {
                "id": review.id,
                # ... (other fields)
                "is_approved": review.is_approved,
                "is_archived": review.is_archived,
                # ... (other fields)
                **user_details
            }
            return updated_review, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error updating review: {e}")
            return {"error": "An internal error occurred while updating the review."}, 500