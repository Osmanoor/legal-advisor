# app/services/gatekeeper_service.py

import json

SETTINGS_FILE_PATH = 'global_settings.json'

# This map links a permission name to its corresponding feature key in the settings file.
PERMISSION_TO_FEATURE_MAP = {
    'access_ai_assistant': 'ai_assistant',
    'access_calculator': 'calculator',
    'access_text_corrector': 'text_corrector',
    'access_search_tool': 'search_tool', # Assuming search tool is another feature
    'access_report_generator': 'report_generator' # Assuming this is the tender mapping feature
}

class GatekeeperService:

    def _load_settings(self):
        """Loads and returns the global settings from the JSON file."""
        try:
            with open(SETTINGS_FILE_PATH, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            # If the file doesn't exist or is invalid, return a default "disabled" state.
            return {"feature_access": {}}

    def is_guest_allowed(self, permission_name: str) -> bool:
        """
        Checks the global settings to see if a guest is allowed to access a feature.
        """
        settings = self._load_settings()
        
        # Find the feature key (e.g., 'ai_assistant') from the permission name
        feature_key = PERMISSION_TO_FEATURE_MAP.get(permission_name)
        if not feature_key:
            # If the permission isn't a feature, guests are denied by default.
            return False
            
        # Get the access rules for this specific feature
        feature_access_rules = settings.get('feature_access', {}).get(feature_key, {})
        
        # Check the 'guests_enabled' flag
        return feature_access_rules.get('guests_enabled', False)