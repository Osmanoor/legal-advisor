# app/services/gatekeeper_service.py

from app.models import User
from app.services.settings_service import SettingsService

class GatekeeperService:

    def has_permission(self, user: User | None, permission_name: str) -> bool:
        """
        Performs a three-tiered check for a user's permission using fresh settings.
        """
        # --- MODIFICATION: Get the latest settings on every check ---
        settings = SettingsService.get_settings()
        
        # Case 1: Authenticated User
        if user:
            # Tier 1: Check for a specific override for this user
            for override in user.permission_overrides:
                if override.permission.name == permission_name:
                    return override.override_type == 'ALLOW'
            
            # Tier 2: Fallback to role default from settings file
            role_name = user.roles[0].name if user.roles else 'Registered User'
            if role_name == 'Admin':
                role_settings = settings.get('admin_permissions', {})
            else: # Registered User
                role_settings = settings.get('registered_user_permissions', {})

            return role_settings.get('features_enabled', {}).get(permission_name, False)

        # Case 2: Guest User
        else:
            guest_settings = settings.get('guest_permissions', {})
            return guest_settings.get('features_enabled', {}).get(permission_name, False)