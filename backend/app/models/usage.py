# app/models/usage.py

from datetime import date
from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID

class UserUsageLog(db.Model):
    __tablename__ = 'user_usage_logs'

    id = db.Column(db.Integer, primary_key=True)
    
    # Nullable to support guests
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True, index=True)
    
    # To track anonymous users, e.g., by a hashed IP
    guest_identifier = db.Column(db.String(255), nullable=True, index=True)
    
    # The feature being tracked, e.g., 'ai_assistant_query'
    feature = db.Column(db.String(100), nullable=False, index=True)
    
    # The date of usage
    usage_date = db.Column(db.Date, nullable=False, default=date.today, index=True)
    
    # The number of times the feature was used on that day
    count = db.Column(db.Integer, nullable=False, default=1)

    user = db.relationship('User')

    # Ensure we only have one row per user/guest per feature per day
    __table_args__ = (
        db.UniqueConstraint('user_id', 'feature', 'usage_date', name='_user_feature_date_uc'),
        db.UniqueConstraint('guest_identifier', 'feature', 'usage_date', name='_guest_feature_date_uc'),
    )

    def __repr__(self):
        identifier = f"User {self.user_id}" if self.user_id else f"Guest {self.guest_identifier}"
        return f'<UserUsageLog for {identifier} on {self.usage_date} for {self.feature}: {self.count}>'