# app/models/__init__.py

from .user import User, TokenBlocklist
from .role_permission import Role, Permission, user_roles, role_permissions
from .contact import ContactSubmission
from .review import UserReview  # <-- ADD THIS LINE

__all__ = [
    'User',
    'TokenBlocklist',
    'Role',
    'Permission',
    'ContactSubmission',
    'UserReview',  # <-- AND ADD THIS LINE
    'user_roles',
    'role_permissions',
    'user_permission_overrides'
]