# app/models/role_permission.py

from app.extensions import db

# --- Association Tables ---

# Many-to-Many: User <-> Role
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Uuid, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True)
)

# Many-to-Many: Role <-> Permission
# NOTE: This table will no longer be used for enforcement. Permissions are now configured in global_settings.json
# However, we keep it for potential future use or for other structural reasons.
role_permissions = db.Table('role_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
)


# --- Main Models ---

class UserPermissionOverride(db.Model):
    __tablename__ = 'user_permission_overrides' 

    user_id = db.Column(db.Uuid, db.ForeignKey('users.id'), primary_key=True)
    permission_id = db.Column(db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
    # The override_type can now be 'ALLOW', 'DENY', or potentially other states.
    override_type = db.Column(db.String(10), nullable=False)

    user = db.relationship('User', back_populates='permission_overrides')
    permission = db.relationship('Permission', back_populates='user_overrides')

class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    
    users = db.relationship('User', secondary=user_roles, back_populates='roles')
    permissions = db.relationship('Permission', secondary=role_permissions, back_populates='roles')

    def __repr__(self):
        return f'<Role {self.name}>'

class Permission(db.Model):
    __tablename__ = 'permissions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # --- NEW: Categorize permissions as 'user' or 'admin' facing ---
    permission_type = db.Column(db.String(50), nullable=False, server_default='user', index=True)

    roles = db.relationship('Role', secondary=role_permissions, back_populates='permissions')
    user_overrides = db.relationship('UserPermissionOverride', back_populates='permission')

    def __repr__(self):
        return f'<Permission {self.name}>'