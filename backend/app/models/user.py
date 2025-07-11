# app/models/user.py

import uuid
from datetime import datetime
from app.extensions import db, bcrypt
from .role_permission import user_roles

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Uuid, primary_key=True, default=uuid.uuid4)
    full_name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    job_title = db.Column(db.String(255), nullable=True)
    profile_picture_url = db.Column(db.String(512), nullable=True)
    linkedin_id = db.Column(db.String(100), unique=True, nullable=True)
    phone_verified_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    roles = db.relationship('Role', secondary=user_roles, back_populates='users', lazy='joined')
    permission_overrides = db.relationship('UserPermissionOverride', back_populates='user', lazy='joined')    
    # NEW: Relationship to UserReview model
    # lazy='dynamic' is efficient, it returns a query object instead of loading all reviews into memory.
    reviews = db.relationship('UserReview', back_populates='user', lazy='dynamic')

    def set_password(self, password):
        """Hashes the password and sets it on the user object."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Checks if the provided password matches the user's hashed password."""
        return bcrypt.check_password_hash(self.password_hash, password)

    def can(self, permission_name: str) -> bool:
        """
        Checks if the user has a given permission using the 3-step logic.
        1. User-specific DENY
        2. User-specific ALLOW
        3. Role-based ALLOW
        """
        # Step 1 & 2: Check for user-specific overrides
        for override in self.permission_overrides:
            if override.permission.name == permission_name:
                if override.override_type == 'DENY':
                    return False  # Highest priority: explicit deny
                elif override.override_type == 'ALLOW':
                    return True  # Second priority: explicit allow

        # Step 3: Fallback to role-based permissions
        for role in self.roles:
            for permission in role.permissions:
                if permission.name == permission_name:
                    return True # Role grants permission

        # Default Deny
        return False

    def __repr__(self):
        return f'<User {self.full_name}>'


class TokenBlocklist(db.Model):
    """Stores invalidated JWTs."""
    __tablename__ = 'token_blocklist'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<TokenBlocklist jti={self.jti}>'