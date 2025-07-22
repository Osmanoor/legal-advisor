# app/services/gatekeeper_service.py

import json
from app.models import User

# Path to the settings file
SETTINGS_FILE_PATH = 'global_settings.json'

class GatekeeperService:
    def __init__(self):
        try:
            with open(SETTINGS_FILE_PATH, 'r') as f:
                self.settings = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.settings = {}

    def has_permission(self, user: User | None, permission_name: str) -> bool:
        """
        Performs a three-tiered check for a user's permission.
        1. Checks for an individual override (ALLOW/DENY).
        2. Falls back to the role's default from global_settings.json.
        3. Defaults to DENY if not found anywhere.
        """
        # Case 1: Authenticated User
        if user:
            # Tier 1: Check for a specific override for this user
            for override in user.permission_overrides:
                if override.permission.name == permission_name:
                    return override.override_type == 'ALLOW'
            
            # Tier 2: Fallback to role default from settings file
            role_name = user.roles[0].name if user.roles else 'Registered User'
            if role_name == 'Admin':
                role_settings = self.settings.get('admin_permissions', {})
            else: # Registered User
                role_settings = self.settings.get('registered_user_permissions', {})

            return role_settings.get('features_enabled', {}).get(permission_name, False)

        # Case 2: Guest User
        else:
            guest_settings = self.settings.get('guest_permissions', {})
            return guest_settings.get('features_enabled', {}).get(permission_name, False)