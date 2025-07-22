# app/models/__init__.py

from .user import User, TokenBlocklist
from .role_permission import Role, Permission, UserPermissionOverride, user_roles, role_permissions
from .contact import ContactSubmission
from .review import UserReview  
from .chat import ChatSession, ChatMessage, MessageResource
from .usage import UserUsageLog # <-- IMPORT NEW MODEL

__all__ = [
    'User',
    'TokenBlocklist',
    'Role',
    'Permission',
    'UserPermissionOverride', 
    'ContactSubmission',
    'UserReview', 
    'ChatSession',      
    'ChatMessage',      
    'MessageResource',
    'UserUsageLog', 
    'user_roles',
    'role_permissions',
]