# app/services/settings_service.py

import os
import json
import threading
from app.config import Config

# Use a lock to prevent race conditions when reading/writing the file in a multi-threaded environment
_lock = threading.Lock()

class SettingsService:
    _cache = None
    _last_modified_time = 0
    _settings_file_path = Config.SETTINGS_FILE_PATH

    @classmethod
    def _get_default_settings(cls):
        """Provides the default structure for global_settings.json."""
        return {
            "guest_permissions": {
                "features_enabled": {
                    "access_chat": False,
                    "access_search_tool": True,
                    "access_calculator": True,
                    "access_text_corrector": False,
                    "access_report_generator": False
                },
                "usage_limits": {
                    "ai_assistant_queries_per_day": 5,
                    "text_corrections_per_day": 10,
                    "report_generations_per_day": 1
                }
            },
            "registered_user_permissions": {
                "features_enabled": {
                    "access_chat": True,
                    "access_search_tool": True,
                    "access_calculator": True,
                    "access_text_corrector": True,
                    "access_report_generator": True,
                    "access_feedback": True,
                },
                "usage_limits": {
                    "ai_assistant_queries_per_day": 50,
                    "text_corrections_per_day": 100,
                    "report_generations_per_day": 10
                },
                "data_limits": {
                    "max_chat_sessions": 20,
                    "max_tender_reports": 10
                }
            },
            "admin_permissions": {
                "features_enabled": {
                    # --- MODIFICATION START ---
                    # User-facing features (defaults for admins)
                    "access_chat": True,
                    "access_search_tool": True,
                    "access_calculator": True,
                    "access_text_corrector": True,
                    "access_report_generator": True,
                    "access_feedback": True,
                    # Admin-facing features (defaults for admins)
                    "view_analytics": True,
                    "manage_users": True,
                    "update_user": True,
                    "delete_user": False,
                    "manage_feedback": True,
                    "manage_contacts": True,
                    "update_admin": False,
                    "manage_global_settings": False,
                    
                    # --- MODIFICATION END ---
                },
                "usage_limits": {
                    "ai_assistant_queries_per_day": -1,
                    "text_corrections_per_day": -1,
                    "report_generations_per_day": -1
                }
            }
        }


    @classmethod
    def get_settings(cls):
        """
        Retrieves settings from an in-memory cache.
        If the settings file on disk has been modified, it reloads the cache.
        """
        with _lock:
            try:
                # Get the last modification time of the file
                mtime = os.path.getmtime(cls._settings_file_path)

                # If the file has been modified or the cache is empty, reload it
                if mtime > cls._last_modified_time or cls._cache is None:
                    print(f"[{threading.get_ident()}] Settings file changed. Reloading cache.")
                    with open(cls._settings_file_path, 'r') as f:
                        cls._cache = json.load(f)
                    cls._last_modified_time = mtime
            
            except (FileNotFoundError, json.JSONDecodeError):
                # If file doesn't exist or is corrupt, return a safe default
                print(f"[{threading.get_ident()}] Settings file not found or corrupt. Using default.")
                cls._cache = cls._get_default_settings()
                cls._last_modified_time = 0 # Reset timestamp

            return cls._cache

    @classmethod
    def force_reload(cls):
        """Forces the cache to be invalidated and reloaded on the next read."""
        with _lock:
            print(f"[{threading.get_ident()}] Forcing settings cache reload.")
            cls._last_modified_time = 0
            cls._cache = None