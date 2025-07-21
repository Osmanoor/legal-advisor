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

    # --- Register Blueprints ---
    # (No changes here, keep your existing blueprints)
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
    
    # Register custom CLI commands
    app.cli.add_command(seed_data_command)

    # --- Static file serving (for React build) ---
    # (No changes here)
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

# ... (keep the seed_data_command function as it is, no changes needed there) ...
@click.command('seed-data')
@with_appcontext
def seed_data_command():
    """Seeds the database with roles, permissions, and sample data."""
    from app.models import User, Role, Permission, UserReview, ContactSubmission

    print("--- Seeding Roles and Permissions ---")
    # ... (Roles and Permissions seeding logic remains unchanged) ...
    roles = ['Admin', 'Registered User', 'Guest']
    for role_name in roles:
        if not Role.query.filter_by(name=role_name).first():
            role = Role(name=role_name)
            db.session.add(role)
    # ... (and so on) ...
    db.session.commit()
    print("Roles and Permissions seeded successfully.")

    print("\n--- Seeding Sample Users and Super Admin ---")
    # ... (Super Admin creation logic remains unchanged) ...
    admin_role = Role.query.filter_by(name='Admin').first()
    reg_user_role = Role.query.filter_by(name='Registered User').first()

    # Create a sample registered user for reviews if they don't exist
    sample_user_phone = '+249912345678'
    sample_user = User.query.filter_by(phone_number=sample_user_phone).first()
    if not sample_user:
        sample_user = User(
            full_name="Sample User",
            phone_number=sample_user_phone,
            phone_verified_at=datetime.utcnow()
        )
        sample_user.set_password("password123")
        if reg_user_role:
            sample_user.roles.append(reg_user_role)
        db.session.add(sample_user)
        print(f"Created 'Sample User' with phone {sample_user_phone}")
    
    # Super Admin logic
    super_admin_phone = '+249123456789'
    if not User.query.filter_by(phone_number=super_admin_phone).first():
        super_admin_password = os.environ.get('SUPER_ADMIN_PASSWORD')
        if super_admin_password and admin_role:
            super_admin = User(
                full_name="Super Admin",
                phone_number=super_admin_phone,
                phone_verified_at=datetime.utcnow()
            )
            super_admin.set_password(super_admin_password)
            super_admin.roles.append(admin_role)
            db.session.add(super_admin)
            print(f"Created 'Super Admin' with phone {super_admin_phone}")
    
    db.session.commit()
    print("Users seeded successfully.")


    # --- NEW: Seeding Contact Submissions ---
    print("\n--- Seeding Contact Submissions ---")
    if ContactSubmission.query.first():
        print("Contact submissions already exist. Skipping.")
    else:
        contacts_to_add = [
            ContactSubmission(name="Ahmed Ali", email="ahmed.ali@example.com", message="Great platform, very helpful for procurement professionals!", status="new", submitted_at=datetime.utcnow() - timedelta(days=1)),
            ContactSubmission(name="Fatima Khalid", email="fatima.k@example.com", message="I have a question about the tender mapping tool. Can someone assist?", status="new", submitted_at=datetime.utcnow() - timedelta(hours=5)),
            ContactSubmission(name="Yusuf Ibrahim", email="yusuf.i@example.com", message="Found a small bug in the date calculator when using Hijri dates.", status="read", submitted_at=datetime.utcnow() - timedelta(days=3)),
        ]
        db.session.bulk_save_objects(contacts_to_add)
        db.session.commit()
        print("Added 3 sample contact submissions.")

    # --- NEW: Seeding User Reviews ---
    print("\n--- Seeding User Reviews ---")
    if UserReview.query.first():
        print("User reviews already exist. Skipping.")
    else:
        # Re-fetch sample_user to ensure it has an ID
        sample_user = User.query.filter_by(phone_number=sample_user_phone).first()
        reviews_to_add = [
            UserReview(user_id=sample_user.id if sample_user else None, rating=5, comment="The AI assistant is incredibly accurate. It saved me hours of research time.", is_approved=True, submitted_at=datetime.utcnow() - timedelta(days=2)),
            UserReview(user_id=None, rating=4, comment="Very useful tools, especially the text corrector. Would love to see more document templates.", is_approved=False, submitted_at=datetime.utcnow() - timedelta(days=5)),
            UserReview(user_id=sample_user.id if sample_user else None, rating=5, comment="A must-have for anyone in government procurement in Saudi Arabia. The journey map is a great feature for new employees.", is_approved=False, is_archived=False, submitted_at=datetime.utcnow() - timedelta(hours=10)),
            UserReview(user_id=None, rating=3, comment="The site is a bit slow sometimes, but the information is valuable.", is_approved=True, is_archived=True, submitted_at=datetime.utcnow() - timedelta(days=10)),
        ]
        db.session.bulk_save_objects(reviews_to_add)
        db.session.commit()
        print("Added 4 sample user reviews.")
    
    print("\nDatabase seeding complete.")