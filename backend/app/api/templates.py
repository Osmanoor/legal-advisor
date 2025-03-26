# app/api/templates.py
from flask import Blueprint, jsonify, request, send_file, current_app
from ..services.templates_service import TemplateService
from werkzeug.exceptions import BadRequest
import os

templates_bp = Blueprint('templates', __name__)
template_service = TemplateService()

@templates_bp.route('', methods=['GET'])
def get_templates():
    """Get all available templates"""
    try:
        templates = template_service.get_all_templates()
        return jsonify({"templates": templates})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@templates_bp.route('/<template_id>', methods=['GET'])
def get_template_details(template_id):
    """Get details for a specific template"""
    try:
        template = template_service.get_template_details(template_id)
        return jsonify(template)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@templates_bp.route('/<template_id>/generate', methods=['POST'])
def generate_document(template_id):
    """Generate document from template"""
    try:
        values = request.json
        if not values:
            raise BadRequest("No values provided")

        # Generate document
        doc_path = template_service.generate_document(template_id, values)
        
        # Return document path in session
        return jsonify({
            "message": "Document generated successfully",
            "doc_path": doc_path
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@templates_bp.route('/download/<format>', methods=['POST'])
def download_document(format):
    """Download generated document"""
    try:
        doc_path = request.json.get('doc_path')
        if not doc_path or not os.path.exists(doc_path):
            raise BadRequest("Invalid document path")

        if format.lower() == 'pdf':
            pdf_path = template_service.convert_to_pdf(doc_path)
            response = send_file(pdf_path, as_attachment=True, download_name='document.pdf')
            # Clean up after sending
            template_service.cleanup_temp_file(pdf_path)
        else:
            response = send_file(doc_path, as_attachment=True, download_name='document.docx')

        # Clean up original file after sending
        template_service.cleanup_temp_file(doc_path)
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@templates_bp.route('/send-email', methods=['POST'])
def send_document_email():
    """Send document via email"""
    try:
        data = request.json
        required_fields = ['recipient_email', 'subject', 'body', 'doc_path']
        
        # Validate required fields
        if not all(field in data for field in required_fields):
            raise BadRequest("Missing required fields")

        # Send email
        template_service.send_document_email(
            recipient_email=data['recipient_email'],
            subject=data['subject'],
            body=data['body'],
            attachment_path=data['doc_path']
        )

        # Clean up temp file
        template_service.cleanup_temp_file(data['doc_path'])

        return jsonify({"message": "Email sent successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400