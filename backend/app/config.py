# app/config.py
import os
from typing import Dict, Any

class Config:
    """Application configuration"""
    CONTACTS_FILE = os.path.join('data', 'contacts.csv')
    EMAILS_FILE = os.path.join('data', 'emails.csv')
    ADMIN_USERNAME = 'admin'
    ADMIN_PASSWORD = '123'

    # Add any chat-specific configurations here
    CHAT_CONFIG: Dict[str, Any] = {
        'default_language': 'ar',
        'max_history_length': 100
    }

    # Search configurations
    SEARCH_CONFIG = {
        'default_page_size': 10,
        'max_page_size': 100,
        'min_query_length': 2,
        'valid_doc_types': ['System', 'Regulation', 'Both']
    }

    # Library configurations
    LIBRARY_ROOT_FOLDER = "backend/library"
    LIBRARY_CONFIG = {
        'allowed_file_types': ['pdf', 'doc', 'docx', 'txt'],
        'max_file_size': 50 * 1024 * 1024,  # 50MB
        'default_sort_by': 'name',
        'default_sort_order': 'asc'
    }

    CONTACTS_FILE = os.path.join('data', 'contacts.csv')
    ADMIN_CONFIG = {
        'allowed_email_domains': ['*'],  # Allow all domains
        'max_message_length': 1000,
        'required_fields': ['name', 'email', 'message']
    }

    # Templates & Email configurations
    TEMPLATES_DIR = 'backend/app/templates/docs'
    SMTP_CONFIG = {
        'server': 'smtp.gmail.com',
        'port': 587,
        'username': 'osmanoor2018@gmail.com',
        'password': 'kjpq qqgc moju mqhe'
    }

    #Journey
    Journey_DIR = os.path.join('backend','data', 'journey')

    #Tender Mapping
    TENDER_MAPPING_DIR = os.path.join('backend','data', 'tender_mapping')