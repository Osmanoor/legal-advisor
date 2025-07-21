# app/api/contact.py

from flask import Blueprint, request, jsonify
from app.models import ContactSubmission
from app.extensions import db
from app.utils.validators import validate_email # Assuming you have this helper

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('', methods=['POST'])
def submit_contact():
    """
    Accepts a contact form submission from any user (guest or authenticated).
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body cannot be empty"}), 400

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    # --- Validation ---
    if not all([name, email, message]):
        return jsonify({"error": "Name, email, and message are required fields."}), 400
    
    if not isinstance(name, str) or not isinstance(email, str) or not isinstance(message, str):
        return jsonify({"error": "All fields must be strings."}), 400

    if len(name.strip()) == 0 or len(message.strip()) == 0:
        return jsonify({"error": "Name and message fields cannot be empty."}), 400
        
    # Using a validator for the email format
    if not validate_email(email):
        return jsonify({"error": "Invalid email format provided."}), 400
        
    # --- Logic: Create and save the submission ---
    try:
        new_submission = ContactSubmission(
            name=name.strip(),
            email=email.strip(),
            message=message.strip(),
            status='new' # Default status for all new submissions
        )
        db.session.add(new_submission)
        db.session.commit()
        
        return jsonify({"message": "Your message has been submitted successfully."}), 201

    except Exception as e:
        db.session.rollback()
        print(f"ERROR [Contact Form]: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500