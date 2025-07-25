# app/__init__.py

import os
import click
from flask import Flask, send_from_directory
from flask.cli import with_appcontext
from datetime import datetime, timedelta

from app.config import Config
from app.extensions import db, migrate, bcrypt, jwt, cors

def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__, static_folder='../static', static_url_path='')
    app.config.from_object(config_class)
    
    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    # Import models here so that Alembic can see them
    from app import models

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload: dict):
        jti = jwt_payload["jti"]
        token = db.session.query(models.TokenBlocklist.id).filter_by(jti=jti).scalar()
        return token is not None

    # --- Register Blueprints (Unchanged) ---
    from app.api.auth import auth_bp
    from app.api.admin import admin_bp
    from app.api.reviews_admin import reviews_admin_bp
    from app.api.users_admin import users_admin_bp
    from app.api.chat import chat_bp
    from app.api.correction import correction_bp
    from app.api.journey import journey_bp
    from app.api.library import library_bp
    from app.api.search import search_bp
    from app.api.templates import templates_bp
    from app.api.tender_mapping import tender_mapping_bp
    from app.api.reviews import reviews_bp
    from app.api.contact import contact_bp
    from app.api.settings import settings_bp
    from app.api.calculator import calculator_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth') 
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(reviews_admin_bp, url_prefix='/api/admin/reviews')
    app.register_blueprint(users_admin_bp, url_prefix='/api/admin/users')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(correction_bp, url_prefix='/api/correction')
    app.register_blueprint(journey_bp, url_prefix='/api/journey')
    app.register_blueprint(library_bp, url_prefix='/api/library')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    app.register_blueprint(templates_bp, url_prefix='/api/templates')
    app.register_blueprint(tender_mapping_bp, url_prefix='/api/tender-mapping')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(contact_bp, url_prefix='/api/contact')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(calculator_bp, url_prefix='/api/calculator')
    
    # Register custom CLI commands
    app.cli.add_command(seed_data_command)

    # --- Static file serving (Unchanged) ---
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def serve_path(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app


# --- REVISED SEED COMMAND ---
@click.command('seed-data')
@with_appcontext
def seed_data_command():
    """Seeds the database with a clean slate of roles and permissions."""
    from app.models import User, Role, Permission, UserPermissionOverride, UserReview, ContactSubmission, role_permissions

    # --- 1. Seed Roles ---
    print("--- Seeding Roles ---")
    roles = ['Admin', 'Registered User', 'Guest']
    for role_name in roles:
        if not Role.query.filter_by(name=role_name).first():
            db.session.add(Role(name=role_name))
            print(f"Created role: {role_name}")
    db.session.commit()

    # --- 2. Clean and Re-seed Permissions ---
    print("\n--- Deleting all existing permissions and overrides for a clean slate ---")
    try:
        # Delete in the correct order to avoid foreign key violations
        db.session.query(UserPermissionOverride).delete()
        db.session.execute(role_permissions.delete())
        db.session.query(Permission).delete()
        db.session.commit()
        print("Successfully deleted old permissions.")
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting permissions: {e}")
        return

    print("\n--- Seeding Fresh Permissions ---")
    # This is the single source of truth for all permissions in the system.
    all_permissions = [
        # User-facing features
        {'name': 'access_chat', 'type': 'user', 'desc': 'Access the AI Assistant page'},
        {'name': 'access_search_tool', 'type': 'user', 'desc': 'Access the advanced search tool'},
        {'name': 'access_calculator', 'type': 'user', 'desc': 'Access the calculators page'},
        {'name': 'access_text_corrector', 'type': 'user', 'desc': 'Access the text corrector tool'},
        {'name': 'access_report_generator', 'type': 'user', 'desc': 'Access the tender mapping/report generator'},
        {'name': 'access_feedback', 'type': 'user', 'desc': 'Access the user feedback submission page'},
        
        # Admin-facing features (Page/Component Access)
        {'name': 'view_analytics', 'type': 'admin', 'desc': 'View the admin analytics dashboard'},
        {'name': 'manage_users', 'type': 'admin', 'desc': 'View and manage the user list'},
        {'name': 'manage_feedback', 'type': 'admin', 'desc': 'Manage user feedback and reviews'},
        {'name': 'manage_contacts', 'type': 'admin', 'desc': 'View and manage contact form submissions'},
        {'name': 'manage_global_settings', 'type': 'admin', 'desc': 'Allow access to the global settings page'},
        
        # Granular Admin actions (API endpoint protection)
        {'name': 'update_user', 'type': 'admin', 'desc': 'Allow editing of a Registered User\'s details'},
        {'name': 'delete_user', 'type': 'admin', 'desc': 'Allow deletion of a Registered User'},
        {'name': 'update_admin', 'type': 'admin', 'desc': 'Allow editing of another Admin\'s details and permissions'},
    ]

    for perm_data in all_permissions:
        perm = Permission(name=perm_data['name'], permission_type=perm_data['type'], description=perm_data['desc'])
        db.session.add(perm)
    
    db.session.commit()
    print("Permissions re-seeded successfully.")

    # --- 3. Seed Users (Super Admin and Sample User) ---
    print("\n--- Seeding Sample Users and Super Admin ---")
    super_admin_identifier = os.environ.get('SUPER_ADMIN_IDENTIFIER')
    super_admin_password = os.environ.get('SUPER_ADMIN_PASSWORD')
    
    admin_role = Role.query.filter_by(name='Admin').first()
    reg_user_role = Role.query.filter_by(name='Registered User').first()

    if not super_admin_identifier or not super_admin_password:
        print("WARNING: SUPER_ADMIN_IDENTIFIER or SUPER_ADMIN_PASSWORD not set. Super admin will not be created.")
    else:
        super_admin = User.query.filter_by(phone_number=super_admin_identifier).first()
        if not super_admin:
            super_admin = User(
                full_name="Super Admin", phone_number=super_admin_identifier,
                phone_verified_at=datetime.utcnow(), status='active'
            )
            super_admin.set_password(super_admin_password)
            super_admin.roles.append(admin_role)
            db.session.add(super_admin)
            db.session.commit()
            print(f"Created 'Super Admin' with identifier {super_admin_identifier}")
        
        # Grant the Super Admin an explicit ALLOW override for ALL permissions.
        if super_admin:
            # We already deleted all overrides, so no need to clear them again.
            all_permissions_in_db = Permission.query.all()
            for permission in all_permissions_in_db:
                override = UserPermissionOverride(
                    user_id=super_admin.id, permission_id=permission.id, override_type='ALLOW'
                )
                db.session.add(override)
            db.session.commit()
            print(f"Granted all {len(all_permissions_in_db)} permissions to Super Admin.")

    # Create a sample user
    sample_user_phone = '+249912345678'
    if not User.query.filter_by(phone_number=sample_user_phone).first():
        sample_user = User(
            full_name="Sample User", phone_number=sample_user_phone,
            phone_verified_at=datetime.utcnow(), status='active'
        )
        sample_user.set_password("password123")
        sample_user.roles.append(reg_user_role)
        db.session.add(sample_user)
        print(f"Created 'Sample User' with phone {sample_user_phone}")
    db.session.commit()
    print("Users seeded successfully.")

    # --- 4. Seed Sample Data (Reviews & Contacts - Unchanged) ---
    print("\n--- Seeding Contact Submissions & User Reviews ---")
    if not ContactSubmission.query.first():
        db.session.add_all([
            ContactSubmission(name="Ahmed Ali", email="ahmed.ali@example.com", message="Great platform!", status="new"),
            ContactSubmission(name="Fatima Khalid", email="fatima.k@example.com", message="I have a question.", status="read"),
        ])
        print("Added sample contact submissions.")

    if not UserReview.query.first():
        sample_user = User.query.filter_by(phone_number=sample_user_phone).first()
        if sample_user:
            db.session.add_all([
                UserReview(user_id=sample_user.id, rating=5, comment="Incredibly accurate!", is_approved=True),
                UserReview(user_id=sample_user.id, rating=4, comment="Very useful tools.", is_approved=False),
            ])
            print("Added sample user reviews.")
            
    db.session.commit()
    print("\nDatabase seeding complete.")