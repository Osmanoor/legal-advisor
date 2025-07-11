# app/services/admin_service.py

import os
import json
from app.models import Role, Permission, ContactSubmission
from app.extensions import db

SETTINGS_FILE_PATH = 'global_settings.json'

class AdminService:
    # --- Settings and Roles Management ---

    def get_all_settings(self):
        """
        Retrieves global settings, roles with their permissions, and all available permissions.
        """
        # 1. Read global settings from file
        try:
            with open(SETTINGS_FILE_PATH, 'r') as f:
                global_settings = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            # Return a default structure if file is missing or corrupt
            global_settings = {}
        
        # 2. Get all roles and their assigned permission IDs
        roles = Role.query.all()
        roles_data = [
            {
                "id": role.id,
                "name": role.name,
                "permission_ids": [p.id for p in role.permissions]
            } for role in roles
        ]

        # 3. Get all available permissions
        permissions = Permission.query.all()
        permissions_data = [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description
            } for p in permissions
        ]

        return {
            "global_settings": global_settings,
            "roles": roles_data,
            "all_permissions": permissions_data
        }, 200

    def update_all_settings(self, data):
        """
        Updates global settings file and role-permission mappings.
        """
        try:
            # 1. Update global settings file if provided
            if 'global_settings' in data:
                with open(SETTINGS_FILE_PATH, 'w') as f:
                    json.dump(data['global_settings'], f, indent=2)
            
            # 2. Update role-permission mappings if provided
            if 'role_permissions' in data:
                role_permission_map = data['role_permissions']
                for item in role_permission_map:
                    role = Role.query.get(item['role_id'])
                    if role:
                        # Fetch all permission objects for the given IDs
                        permissions = Permission.query.filter(Permission.id.in_(item['permission_ids'])).all()
                        # Assign the new set of permissions to the role
                        role.permissions = permissions
            
            db.session.commit()
            return {"message": "Settings updated successfully"}, 200

        except Exception as e:
            db.session.rollback()
            print(f"Error updating settings: {e}")
            return {"error": "An internal error occurred while updating settings."}, 500

    # --- Dashboard Stats ---

    def get_dashboard_stats(self):
        """Returns dummy statistics for the admin dashboard."""
        # This can be replaced with real queries later
        dummy_stats = {
            "total_users": 150,
            "new_messages": 12,
            "pending_reviews": 5
        }
        return dummy_stats, 200

    # --- Contact Submissions Management ---

    def get_contact_submissions(self):
        """Retrieves all contact submissions."""
        submissions = ContactSubmission.query.order_by(ContactSubmission.submitted_at.desc()).all()
        submissions_data = [
            {
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "message": s.message,
                "status": s.status,
                "submitted_at": s.submitted_at.isoformat()
            } for s in submissions
        ]
        return submissions_data, 200

    def update_contact_submission_status(self, submission_id, new_status):
        """Updates the status of a contact submission."""
        submission = ContactSubmission.query.get(submission_id)
        if not submission:
            return {"error": "Submission not found"}, 404
        
        allowed_statuses = ['new', 'read', 'archived']
        if new_status not in allowed_statuses:
            return {"error": f"Invalid status. Must be one of: {allowed_statuses}"}, 400

        submission.status = new_status
        db.session.commit()

        updated_submission = {
            "id": submission.id,
            "name": submission.name,
            "email": submission.email,
            "message": submission.message,
            "status": submission.status,
            "submitted_at": submission.submitted_at.isoformat()
        }
        return updated_submission, 200