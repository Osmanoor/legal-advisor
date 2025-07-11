# app/__init__.py
import os
import click
from flask import Flask, send_from_directory
from flask.cli import with_appcontext

from app.config import Config
from app.extensions import db, migrate, bcrypt, jwt

def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__, static_folder='../static', static_url_path='')
    app.config.from_object(config_class)
    
    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import models here so that Alembic can see them
    from app import models

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload: dict):
        jti = jwt_payload["jti"]
        token = db.session.query(models.TokenBlocklist.id).filter_by(jti=jti).scalar()
        return token is not None

    # --- Register Blueprints ---
    from app.api.auth import auth_bp
    from app.api.admin import admin_bp
    from app.api.reviews_admin import reviews_admin_bp
    from app.api.users_admin import users_admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth') 
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(reviews_admin_bp, url_prefix='/api/admin/reviews')
    app.register_blueprint(users_admin_bp, url_prefix='/api/admin/users')
    
    # Register custom CLI commands
    app.cli.add_command(seed_data_command)

    # --- Static file serving (for React build) ---
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


@click.command('seed-data')
@with_appcontext
def seed_data_command():
    # Seeding logic remains the same...
    from app.models import Role, Permission
    
    print("Seeding database...")

    # --- Define Roles ---
    roles = ['Admin', 'Registered User', 'Guest']
    for role_name in roles:
        if not Role.query.filter_by(name=role_name).first():
            role = Role(name=role_name)
            db.session.add(role)

    # --- Define Permissions ---
    permissions_data = {
        'access_ai_assistant': 'تمنح صلاحية استخدام المساعد الذكي.',
        'access_calculator': 'تمنح صلاحية استخدام أدوات الحاسبة.',
        'access_text_corrector': 'تمنح صلاحية استخدام أداة تصحيح النصوص الذكية.',
        'access_report_generator': 'تمنح صلاحية استخدام نظام إنشاء تقارير المنافسات.',
        'access_search_tool': 'تمنح صلاحية استخدام أداة البحث في المستندات.',
        'access_admin_dashboard': 'تمنح صلاحية الوصول إلى صفحة لوحة التحكم الرئيسية.',
        'access_ratings_management': 'تمنح صلاحية الوصول إلى قسم إدارة تقييمات المستخدمين.',
        'access_contact_us': 'تمنح صلاحية الوصول إلى قسم رسائل "اتصل بنا".',
        'view_users_list': 'تمنح صلاحية عرض قائمة جميع المستخدمين والمسؤولين.',
        'delete_user': 'تمنح صلاحية حذف حساب مستخدم بشكل دائم.',
        'manage_admins': 'تمنح صلاحية إنشاء وتعديل وحذف حسابات المسؤولين الآخرين.',
        'access_global_settings': 'تمنح صلاحية الوصول إلى لوحة الإعدادات العامة للموقع.'
    }
    
    for perm_name, perm_desc in permissions_data.items():
        if not Permission.query.filter_by(name=perm_name).first():
            permission = Permission(name=perm_name, description=perm_desc)
            db.session.add(permission)
            
    db.session.commit()

    # --- Assign Permissions to Roles ---
    admin_role = Role.query.filter_by(name='Admin').first()
    reg_user_role = Role.query.filter_by(name='Registered User').first()
    
    all_permissions = Permission.query.all()
    
    # Admin gets all permissions
    if admin_role:
        admin_role.permissions = all_permissions
        
    # Registered User gets feature permissions
    if reg_user_role:
        feature_perms_names = [
            'access_ai_assistant', 'access_calculator', 'access_text_corrector', 
            'access_report_generator', 'access_search_tool'
        ]
        feature_perms = Permission.query.filter(Permission.name.in_(feature_perms_names)).all()
        reg_user_role.permissions = feature_perms

    db.session.commit()
    print("Database seeding complete.")