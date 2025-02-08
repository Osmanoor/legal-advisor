# app/services/admin_service.py
import csv
import os
from datetime import datetime
from typing import Dict, List
from flask import jsonify
from app.config import Config

class AdminService:
    def __init__(self):
        """Initialize admin service"""
        os.makedirs(os.path.dirname(Config.CONTACTS_FILE), exist_ok=True)

    def save_contact(self, data: Dict) -> tuple:
        """
        Save contact form submission
        
        Args:
            data: Dictionary containing name, email, and message
            
        Returns:
            tuple: (response_dict, status_code)
        """
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return jsonify({'error': 'All fields are required'}), 400

        try:
            file_exists = os.path.isfile(Config.CONTACTS_FILE)
            with open(Config.CONTACTS_FILE, 'a', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                if not file_exists:
                    writer.writerow(['Date', 'Name', 'Email', 'Message'])
                writer.writerow([
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    name,
                    email,
                    message
                ])

            return jsonify({'message': 'Contact form submitted successfully'}), 200
        except Exception as e:
            print(f"Error saving contact: {str(e)}")
            return jsonify({'error': 'Failed to save contact form'}), 500

    def get_all_contacts(self) -> tuple:
        """
        Get all contact form submissions
        
        Returns:
            tuple: (response_dict, status_code)
        """
        if not os.path.exists(Config.CONTACTS_FILE):
            return jsonify([]), 200

        try:
            contacts = []
            with open(Config.CONTACTS_FILE, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                contacts = list(reader)
            return jsonify(contacts), 200
        except Exception as e:
            print(f"Error reading contacts: {str(e)}")
            return jsonify({'error': 'Failed to read contacts'}), 500