# app/api/settings.py

import os
import json
from flask import Blueprint, jsonify

settings_bp = Blueprint('settings', __name__)

SETTINGS_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'global_settings.json')

@settings_bp.route('/guest', methods=['GET'])
def get_guest_settings():
    """
    Returns the public-facing settings for guest users.
    This endpoint is not authenticated.
    """
    try:
        with open(SETTINGS_FILE_PATH, 'r') as f:
            all_settings = json.load(f)
        
        guest_permissions = all_settings.get('guest_permissions', {})
        return jsonify(guest_permissions), 200

    except (FileNotFoundError, json.JSONDecodeError):
        # If settings are missing or corrupt, return a safe default (no access)
        return jsonify({
            "features_enabled": {},
            "usage_limits": {}
        }), 500
    except Exception as e:
        print(f"Error reading guest settings: {e}")
        return jsonify({"error": "Could not retrieve guest settings"}), 500