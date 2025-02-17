from typing import Dict, List, Optional, BinaryIO
import os
from app.config import Config
from flask import current_app
from werkzeug.exceptions import BadRequest, NotFound
from ..templates.handler import TemplateHandler, TemplateInfo
import tempfile

class TemplateService:
    def __init__(self):
        self.template_handler = TemplateHandler(
            templates_dir=Config.TEMPLATES_DIR
        )
        self.temp_dir = tempfile.gettempdir()

    def get_all_templates(self) -> List[Dict]:
        """Get all available templates with their placeholders"""
        templates = self.template_handler.get_available_templates()
        return [
            {
                "filename": template.filename,
                "placeholders": template.placeholders,
                "display_name": self._get_display_name(template.filename)
            }
            for template in templates
        ]

    def _get_display_name(self, filename: str) -> str:
        """Convert filename to display name"""
        return filename.replace('.docx', '').replace('_', ' ').title()

    def get_template_details(self, template_name: str) -> Dict:
        """Get details for a specific template"""
        try:
            templates = self.template_handler.get_available_templates()
            template = next(t for t in templates if t.filename == template_name)
            return {
                "filename": template.filename,
                "placeholders": template.placeholders,
                "display_name": self._get_display_name(template.filename)
            }
        except StopIteration:
            raise NotFound(f"Template {template_name} not found")

    def generate_document(self, template_name: str, values: Dict[str, str]) -> str:
        """Generate filled document and return path to temporary file"""
        try:
            # Validate template exists
            template_details = self.get_template_details(template_name)
            
            # Validate all required placeholders are provided
            missing_placeholders = set(template_details['placeholders']) - set(values.keys())
            if missing_placeholders:
                raise BadRequest(f"Missing required placeholders: {', '.join(missing_placeholders)}")

            # Generate document
            doc = self.template_handler.fill_template(template_name, values)
            
            # Save to temporary file
            temp_path = os.path.join(self.temp_dir, f"temp_{template_name}")
            self.template_handler.save_document(doc, temp_path)
            
            return temp_path

        except Exception as e:
            if isinstance(e, (NotFound, BadRequest)):
                raise
            raise Exception(f"Error generating document: {str(e)}")

    def convert_to_pdf(self, docx_path: str) -> str:
        """Convert DOCX to PDF and return PDF path"""
        pdf_path = docx_path.replace('.docx', '.pdf')
        self.template_handler.convert_to_pdf(docx_path, pdf_path)
        return pdf_path

    def send_document_email(
        self,
        recipient_email: str,
        subject: str,
        body: str,
        attachment_path: str
    ) -> None:
        """Send email with document attachment"""
        try:
            # Get email configuration from app config
            smtp_config = Config.SMTP_CONFIG
            
            self.template_handler.send_email(
                recipient_email=recipient_email,
                subject=subject,
                body=body,
                attachment_path=attachment_path,
                smtp_server=smtp_config.get('server'),
                smtp_port=smtp_config.get('port'),
                smtp_username=smtp_config.get('username'),
                smtp_password=smtp_config.get('password')
            )
        except Exception as e:
            raise Exception(f"Error sending email: {str(e)}")

    def cleanup_temp_file(self, file_path: str) -> None:
        """Clean up temporary files"""
        try:
            if os.path.exists(file_path):
                # os.remove(file_path)
                pass
        except Exception as e:
            current_app.logger.error(f"Error cleaning up temp file {file_path}: {str(e)}")