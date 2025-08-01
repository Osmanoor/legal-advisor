# File: app/services/users_admin_service.py

import os
from app.models import User, Role, Permission
from app.extensions import db
from app.utils.validators import validate_phone_number, validate_password
from app.models.role_permission import UserPermissionOverride

class UsersAdminService:

    def create_user(self, data):
        """Creates a new user via the admin panel."""
        phone_number = data.get('phoneNumber')
        email = data.get('email')
        password = data.get('password')
        role_id = data.get('role_id')

        # Basic validation
        if not all([data.get('fullName'), phone_number, password, role_id]):
            return {"error": "Full name, phone number, password, and role_id are required."}, 400
        if not validate_phone_number(phone_number):
            return {"error": "Invalid phone number format."}, 400
        if User.query.filter_by(phone_number=phone_number).first():
            return {"error": "A user with this phone number already exists."}, 409
        if email and User.query.filter_by(email=email).first():
            return {"error": "A user with this email already exists."}, 409

        role = Role.query.get(role_id)
        if not role:
            return {"error": "Invalid role_id."}, 400

        new_user = User(
            full_name=data['fullName'],
            phone_number=phone_number,
            email=email,
            job_title=data.get('jobTitle')
        )
        new_user.set_password(password)
        new_user.roles.append(role)

        try:
            db.session.add(new_user)
            db.session.commit()
            return self.serialize_user(new_user), 201
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to create user: {e}"}, 500

    def get_all_users(self, page=1, per_page=20):
        """Retrieves a paginated list of all users."""
        paginated_users = User.query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        users_data = [self.serialize_user_summary(user) for user in paginated_users.items]
        
        return {
            "users": users_data,
            "total": paginated_users.total,
            "pages": paginated_users.pages,
            "current_page": paginated_users.page
        }, 200

    def get_user_by_id(self, user_id):
        """Retrieves detailed information for a single user."""
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return self.serialize_user(user), 200

    def update_user(self, user_id, data):
        """Updates a user's details, roles, status, and permission overrides with security checks."""
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        # --- SECURITY CHECK 1: Protect Super Admin ---
        super_admin_identifier = os.environ.get('SUPER_ADMIN_IDENTIFIER')
        if super_admin_identifier and (user.phone_number == super_admin_identifier or user.email == super_admin_identifier):
            return {"error": "The super admin account cannot be modified."}, 403

        try:
            if 'fullName' in data: user.full_name = data['fullName']
            if 'jobTitle' in data: user.job_title = data['jobTitle']
            if 'email' in data: user.email = data['email']
            
            # --- MODIFICATION START: Handle status update ---
            if 'status' in data:
                new_status = data['status']
                if new_status in ['active', 'suspended']:
                    user.status = new_status
                else:
                    return {"error": "Invalid status value provided."}, 400
            # --- MODIFICATION END ---
            
            if 'role_ids' in data:
                new_roles = Role.query.filter(Role.id.in_(data['role_ids'])).all()
                user.roles = new_roles
            
            if 'permission_overrides' in data:
                # First, clear all existing overrides for this user
                UserPermissionOverride.query.filter_by(user_id=user.id).delete()
                
                # Then, add the new ones with security checks
                user_is_admin = "Admin" in [role.name for role in user.roles]
                for override_data in data['permission_overrides']:
                    permission = Permission.query.get(override_data['permission_id'])
                    if permission:
                        # --- SECURITY CHECK 2: Prevent Privilege Escalation ---
                        if not user_is_admin and permission.permission_type == 'admin':
                             return {"error": f"Cannot assign admin permission '{permission.name}' to a non-admin user."}, 403
                        
                        override = UserPermissionOverride(
                            user_id=user.id,
                            permission_id=permission.id,
                            override_type=override_data['override_type']
                        )
                        db.session.add(override)
            
            db.session.commit()
            return self.serialize_user(user), 200
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update user: {e}"}, 500


    def delete_user(self, user_id):
        # ... (this method can be enhanced with super admin protection too) ...
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        super_admin_identifier = os.environ.get('SUPER_ADMIN_IDENTIFIER')
        if super_admin_identifier and (user.phone_number == super_admin_identifier or user.email == super_admin_identifier):
            return {"error": "The super admin account cannot be deleted."}, 403
        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": "User deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to delete user: {e}"}, 500

    # --- Serialization Helpers ---
    def serialize_user_summary(self, user):
        """Serializes a user for list view."""
        return {
            "id": str(user.id),
            "fullName": user.full_name,
            "email": user.email,
            "phoneNumber": user.phone_number,
            "roles": [role.name for role in user.roles],
            "created_at": user.created_at.isoformat(),
            "status": user.status, # <-- ADDED
        }

    def serialize_user(self, user):
        """Serializes a user for detailed view."""
        return {
            "id": str(user.id),
            "fullName": user.full_name,
            "email": user.email,
            "phoneNumber": user.phone_number,
            "jobTitle": user.job_title,
            "roles": [{"id": role.id, "name": role.name} for role in user.roles],
            "permission_overrides": [
                {
                    "permission_id": override.permission_id,
                    "permission_name": override.permission.name,
                    "override_type": override.override_type
                }
                for override in user.permission_overrides
            ],
            "created_at": user.created_at.isoformat(),
            "status": user.status, # <-- ADDED
        }