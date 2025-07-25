# app/services/admin_service.py

import os
import json
from app.models import Role, Permission, ContactSubmission
from app.extensions import db 
from app.config import Config

SETTINGS_FILE_PATH = Config.SETTINGS_FILE_PATH

class AdminService:

    def _get_default_settings(self):
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

    def get_all_settings(self):
        """
        Retrieves global settings from JSON, all roles, and all categorized permissions.
        """
        try:
            if not os.path.exists(SETTINGS_FILE_PATH):
                global_settings = self._get_default_settings()
                with open(SETTINGS_FILE_PATH, 'w') as f:
                    json.dump(global_settings, f, indent=2)
            else:
                with open(SETTINGS_FILE_PATH, 'r') as f:
                    global_settings = json.load(f)
        
        except (IOError, json.JSONDecodeError) as e:
            print(f"Error handling settings file: {e}")
            return {"error": "Could not read or create settings file."}, 500

        roles = Role.query.order_by(Role.name).all()
        roles_data = [{"id": role.id, "name": role.name} for role in roles]

        permissions = Permission.query.order_by(Permission.permission_type, Permission.name).all()
        permissions_data = {
            "user": [p for p in permissions if p.permission_type == 'user'],
            "admin": [p for p in permissions if p.permission_type == 'admin']
        }
        permissions_serialized = {
            "user": [{"id": p.id, "name": p.name, "description": p.description} for p in permissions_data["user"]],
            "admin": [{"id": p.id, "name": p.name, "description": p.description} for p in permissions_data["admin"]],
        }

        return {
            "global_settings": global_settings,
            "roles": roles_data,
            "all_permissions": permissions_serialized
        }, 200

    def update_all_settings(self, data):
        """
        Updates the global_settings.json file.
        """
        try:
            # We now expect the full settings object, not a wrapped one
            with open(SETTINGS_FILE_PATH, 'w') as f:
                json.dump(data, f, indent=2)
            
            return {"message": "Settings updated successfully"}, 200

        except IOError as e:
            print(f"Error writing settings file: {e}")
            return {"error": "Could not write to settings file."}, 500
        except Exception as e:
            print(f"Error updating settings: {e}")
            return {"error": "An internal error occurred while updating settings."}, 500

    def get_dashboard_stats(self):
        dummy_stats = { "total_users": 150, "new_messages": 12, "pending_reviews": 5 }
        return dummy_stats, 200

    def get_contact_submissions(self, page=1, per_page=20):
        paginated_submissions = ContactSubmission.query.order_by(ContactSubmission.submitted_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        submissions_data = [
            {
                "id": s.id, "name": s.name, "email": s.email, "message": s.message,
                "status": s.status, "submitted_at": s.submitted_at.isoformat()
            } for s in paginated_submissions.items
        ]
        return {
            "submissions": submissions_data,
            "total": paginated_submissions.total,
            "pages": paginated_submissions.pages,
            "current_page": paginated_submissions.page
        }, 200

    def update_contact_submission_status(self, submission_id, new_status):
        submission = ContactSubmission.query.get(submission_id)
        if not submission:
            return {"error": "Submission not found"}, 404
        
        allowed_statuses = ['new', 'read', 'archived']
        if new_status not in allowed_statuses:
            return {"error": f"Invalid status. Must be one of: {allowed_statuses}"}, 400

        submission.status = new_status
        db.session.commit()

        updated_submission = {
            "id": submission.id, "name": submission.name, "email": submission.email,
            "message": submission.message, "status": submission.status,
            "submitted_at": submission.submitted_at.isoformat()
        }
        return updated_submission, 200