# app/config.py

import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Application configuration"""

    # --- Database Configurations ---
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- NEW: Frontend URL for Development ---
    # This is used to construct absolute URLs for redirects during development.
    # In production, this will be None, and relative paths will be used.
    FRONTEND_URL = os.environ.get('FRONTEND_URL') # e.g., 'http://localhost:5173'

    # --- Security & JWT Configurations ---
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'a-default-fallback-secret-key'
    
    # --- THIS IS THE CRITICAL FIX ---
    # Explicitly tell JWT to look for the token in cookies.
    JWT_TOKEN_LOCATION = ["cookies"]

    # Use 'Lax' for development on HTTP. 'Lax' is the default for modern browsers
    # and works for top-level navigations, which is what our login redirect is.
    # This does NOT require the 'Secure' flag.
    # JWT_COOKIE_SAMESITE = 'Lax' 
    
    # # This MUST be False for development over HTTP.
    # JWT_COOKIE_SECURE = False
    
    # Explicitly name the cookie.
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"

    # Set the cookie path to the root of the domain. This is important.
    JWT_COOKIE_PATH = "/"
    
    # Turn off CSRF protection for now to isolate the issue. We can re-enable later.
    # In a cross-domain setup (e.g., localhost:5173 to localhost:8080), CSRF can
    # cause issues if not configured perfectly.
    JWT_COOKIE_CSRF_PROTECT = False
    
    # Ensure the cookie is not accessible via JavaScript.
    JWT_COOKIE_HTTPONLY = True

    # --- Existing Configurations ---
    CONTACTS_FILE = os.path.join('data', 'contacts.csv')
    EMAILS_FILE = os.path.join('data', 'emails.csv')
    ADMIN_USERNAME = 'admin'
    ADMIN_PASSWORD = '123'

    # ... (rest of your config file remains unchanged) ...
    CHAT_CONFIG = {
        'default_language': 'ar',
        'max_history_length': 100
    }
    SEARCH_CONFIG = {
        'default_page_size': 10,
        'max_page_size': 100,
        'min_query_length': 2,
        'valid_doc_types': ['System', 'Regulation', 'Both']
    }
    LIBRARY_ROOT_FOLDER = "library"
    LIBRARY_CONFIG = {
        'allowed_file_types': ['pdf', 'doc', 'docx', 'txt'],
        'max_file_size': 50 * 1024 * 1024,
        'default_sort_by': 'name',
        'default_sort_order': 'asc'
    }
    ADMIN_CONFIG = {
        'allowed_email_domains': ['*'],
        'max_message_length': 1000,
        'required_fields': ['name', 'email', 'message']
    }
    TEMPLATES_DIR = 'app/templates/docs'
    SMTP_CONFIG = {
        'server': 'smtp.gmail.com',
        'port': 587,
        'username': 'osmanoor2018@gmail.com',
        'password': 'kjpq qqgc moju mqhe'
    }
    Journey_DIR = os.path.join('data', 'journey')
    TENDER_MAPPING_DIR = os.path.join('data', 'tender_mapping')

    # --- Global Settings File Path ---
    SETTINGS_FILE_PATH = os.path.join(basedir, 'global_settings.json')
