# app/models/review.py

from datetime import datetime
from app.extensions import db
from sqlalchemy.dialects.postgresql import JSONB

class UserReview(db.Model):
    __tablename__ = 'user_reviews'

    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign key to the user. 'ondelete="SET NULL"' handles database-level cascades.
    user_id = db.Column(db.Uuid, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    # Stores user preferences for what info appears in the review (e.g., {'show_name': true, 'show_job': false})
    preview_settings = db.Column(JSONB, nullable=False, default={})

    rating = db.Column(db.SmallInteger, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    
    # Admin-controlled flags
    is_approved = db.Column(db.Boolean, nullable=False, default=False) # To show on landing page
    is_archived = db.Column(db.Boolean, nullable=False, default=False)
    
    submitted_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationship back to the User model
    user = db.relationship('User', back_populates='reviews')

    # Add a check constraint for the rating
    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

    def __repr__(self):
        return f'<UserReview id={self.id} rating={self.rating}>'