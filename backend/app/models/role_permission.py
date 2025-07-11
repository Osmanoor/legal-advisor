# app/models/role_permission.py

from app.extensions import db

# --- Association Tables ---

# Many-to-Many: User <-> Role
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Uuid, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True)
)

# Many-to-Many: Role <-> Permission
role_permissions = db.Table('role_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
)


# --- Main Models ---

class UserPermissionOverride(db.Model):
    __tablename__ = 'user_permission_overrides' # New table name to avoid conflicts

    user_id = db.Column(db.Uuid, db.ForeignKey('users.id'), primary_key=True)
    permission_id = db.Column(db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
    override_type = db.Column(db.String(10), nullable=False)  # 'ALLOW' or 'DENY'

    # Relationships to easily navigate from this override model
    user = db.relationship('User', back_populates='permission_overrides')
    permission = db.relationship('Permission', back_populates='user_overrides')

class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False) # e.g., 'Admin', 'Registered User'
    
    # Relationship to users and permissions
    users = db.relationship('User', secondary=user_roles, back_populates='roles')
    permissions = db.relationship('Permission', secondary=role_permissions, back_populates='roles')

    def __repr__(self):
        return f'<Role {self.name}>'

class Permission(db.Model):
    __tablename__ = 'permissions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)

    roles = db.relationship('Role', secondary=role_permissions, back_populates='permissions')
    user_overrides = db.relationship('UserPermissionOverride', back_populates='permission')

    def __repr__(self):
        return f'<Permission {self.name}>'