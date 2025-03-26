# app/services/templates_service.py

from typing import Dict, List, Any
import os
import csv
from datetime import datetime
from app.config import Config
from werkzeug.exceptions import BadRequest, NotFound
import tempfile
from ..templates.handler import TemplateHandler


class TemplateService:
    def __init__(self):
        """Initialize template service with handler"""
        self.template_handler = TemplateHandler(
            templates_dir=Config.TEMPLATES_DIR,
            templates_config_path=os.path.join(os.path.dirname(Config.TEMPLATES_DIR), "templates_config.json")
        )
        self.temp_dir = tempfile.gettempdir()
        self.emails_file = os.path.join('data', 'emails.csv')
        # Ensure emails directory exists
        os.makedirs(os.path.dirname(self.emails_file), exist_ok=True)

    def get_all_templates(self) -> List[Dict]:
        """Get all available templates with their placeholders"""
        templates = self.template_handler.get_available_templates()
        return [
            {
                "id": template.id,
                "filename": template.filename,
                "display_name": template.display_name,
                "description": template.description,
                "placeholders": [
                    {
                        "id": placeholder.id,
                        "type": placeholder.type,
                        "required": placeholder.required,
                        "description": placeholder.description,
                        "source": placeholder.source
                    }
                    for placeholder in template.placeholders
                ]
            }
            for template in templates
        ]

    def get_template_details(self, template_id: str) -> Dict:
        """Get details for a specific template by ID"""
        template = self.template_handler.get_template_by_id(template_id)
        if not template:
            raise NotFound(f"Template {template_id} not found")
            
        return {
            "id": template.id,
            "filename": template.filename,
            "display_name": template.display_name,
            "description": template.description,
            "placeholders": [
                {
                    "id": placeholder.id,
                    "type": placeholder.type,
                    "required": placeholder.required,
                    "description": placeholder.description,
                    "source": placeholder.source
                }
                for placeholder in template.placeholders
            ]
        }

    def generate_document(self, template_id: str, values: Dict[str, Any]) -> str:
        """Generate filled document and return path to temporary file"""
        try:
            # Validate template exists
            template = self.template_handler.get_template_by_id(template_id)
            if not template:
                raise NotFound(f"Template {template_id} not found")
            
            # Generate document - no validation needed as values come ready from frontend
            temp_path = self.template_handler.generate_template_document(
                template_id=template_id,
                values=values,
                output_format="docx"
            )
            
            return temp_path

        except Exception as e:
            if isinstance(e, (NotFound, BadRequest)):
                raise
            raise Exception(f"Error generating document: {str(e)}")

    def convert_to_pdf(self, docx_path: str) -> str:
        """Convert DOCX to PDF and return PDF path"""
        pdf_path = os.path.splitext(docx_path)[0] + ".pdf"
        self.template_handler.convert_to_pdf(docx_path, pdf_path)
        return pdf_path

    def send_document_email(
        self,
        recipient_email: str,
        subject: str,
        body: str,
        attachment_path: str
    ) -> None:
        """Send email with document attachment and log the email details"""
        try:
            # Get email configuration from app config
            smtp_config = Config.SMTP_CONFIG
            
            # Log email details to CSV file
            self._log_email(recipient_email, subject, body, attachment_path)
            
            # Send the email
            self.template_handler.send_document_email(
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

    def _log_email(self, recipient_email: str, subject: str, body: str, attachment_path: str) -> None:
        """Log email details to a CSV file"""
        try:
            file_exists = os.path.isfile(self.emails_file)
            
            with open(self.emails_file, 'a', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                
                # Write header if file doesn't exist
                if not file_exists:
                    writer.writerow(['Date', 'Recipient', 'Subject', 'Body', 'Attachment'])
                
                # Write email data
                writer.writerow([
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    recipient_email,
                    subject,
                    body,
                    os.path.basename(attachment_path)
                ])
                
        except Exception as e:
            print(f"Error logging email: {str(e)}")
            # Continue with email sending even if logging fails

    def cleanup_temp_file(self, file_path: str) -> None:
        """Clean up temporary files"""
        # self.template_handler.cleanup_temp_file(file_path)