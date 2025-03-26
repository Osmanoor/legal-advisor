# app/__init__.py
from flask import Flask, send_from_directory
from flask_cors import CORS
from app.config import Config
import os

def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__, static_folder='static', static_url_path='')
    app.config.from_object(config_class)
    
    # Initialize CORS
    CORS(app)
    
    # Register blueprints - Move this BEFORE the static routes
    from app.api.chat import chat_bp
    from app.api.search import search_bp
    from app.api.library import library_bp
    from app.api.admin import admin_bp
    from app.api.templates import templates_bp
    from app.api.correction import correction_bp
    from app.api.journey import journey_bp 
    from app.api.tender_mapping import tender_mapping_bp 

    # Register all API blueprints first
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    app.register_blueprint(library_bp, url_prefix='/api/library')
    app.register_blueprint(templates_bp, url_prefix='/api/templates')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(correction_bp, url_prefix='/api/correction')
    app.register_blueprint(journey_bp, url_prefix='/api/journey')
    app.register_blueprint(tender_mapping_bp, url_prefix='/api/tender-mapping')

    # Static routes should come AFTER API routes
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def serve_path(path):
        if path.startswith('api/'):
            return 'Not found', 404
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, "index.html")
    
    return app