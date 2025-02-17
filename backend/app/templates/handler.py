from docx import Document
from docx2pdf import convert
import os
from typing import Dict, List, Optional, Set
from dataclasses import dataclass
import re
from google.cloud import storage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import smtplib
import platform
if platform.system() == 'Windows':
    import pythoncom
@dataclass
class TemplateInfo:
    """Class for storing template information"""
    filename: str
    placeholders: List[str]

class TemplateHandler:
    def __init__(self, templates_dir: str = "backend/templates/docs"):
        """Initialize the template handler with the templates directory"""
        self.templates_dir = templates_dir
    
    def _get_all_text_elements(self, doc: Document) -> str:
        """Extract text from all possible elements in the document"""
        text_parts = []
        
        # Get text from paragraphs
        for paragraph in doc.paragraphs:
            text_parts.append(paragraph.text)
        
        # Get text from tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        text_parts.append(paragraph.text)
        
        # Get text from headers and footers
        for section in doc.sections:
            # Header
            for paragraph in section.header.paragraphs:
                text_parts.append(paragraph.text)
            # Footer
            for paragraph in section.footer.paragraphs:
                text_parts.append(paragraph.text)
                
        return " ".join(text_parts)
    
    def _extract_placeholders(self, filepath: str) -> List[str]:
        """Extract all placeholders from a template"""
        doc = Document(filepath)
        text = self._get_all_text_elements(doc)
        placeholders = re.findall(r'\{\{(\w+)\}\}', text)
        return list(set(placeholders))
    
    def get_available_templates(self) -> List[TemplateInfo]:
        """Get all available templates and their placeholders"""
        templates = []
        for filename in os.listdir(self.templates_dir):
            if filename.endswith('.docx'):
                filepath = os.path.join(self.templates_dir, filename)
                placeholders = self._extract_placeholders(filepath)
                templates.append(TemplateInfo(filename=filename, placeholders=placeholders))
        return templates
    
    def _replace_text_in_paragraph(self, paragraph, values: Dict[str, str]):
        """Replace placeholders in a paragraph while preserving formatting"""
        for run in paragraph.runs:
            for key, value in values.items():
                placeholder = f'{{{{{key}}}}}'
                if placeholder in run.text:
                    # Preserve the run's formatting while replacing text
                    run.text = run.text.replace(placeholder, value)
    
    def fill_template(self, template_name: str, values: Dict[str, str]) -> Document:
        """Fill a template with provided values while preserving formatting and images"""
        template_path = os.path.join(self.templates_dir, template_name)
        doc = Document(template_path)
        
        # Replace in paragraphs
        for paragraph in doc.paragraphs:
            self._replace_text_in_paragraph(paragraph, values)
        
        # Replace in tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        self._replace_text_in_paragraph(paragraph, values)
        
        # Replace in headers and footers
        for section in doc.sections:
            # Header
            for paragraph in section.header.paragraphs:
                self._replace_text_in_paragraph(paragraph, values)
            # Footer
            for paragraph in section.footer.paragraphs:
                self._replace_text_in_paragraph(paragraph, values)
        
        return doc
    
    def save_document(self, doc: Document, output_path: str):
        """Save the document to the specified path"""
        doc.save(output_path)
    
    def convert_to_pdf(self, docx_path: str, pdf_path: str):
        """Convert a DOCX file to PDF with proper COM initialization on Windows"""
        try:
            if platform.system() == 'Windows':
                # Initialize COM for the current thread
                pythoncom.CoInitialize()
            
            # Perform the conversion
            convert(docx_path, pdf_path)
            
        except Exception as e:
            raise Exception(f"Error converting to PDF: {str(e)}")
        
        finally:
            if platform.system() == 'Windows':
                # Uninitialize COM
                pythoncom.CoUninitialize()
    
    def send_email(self, 
                   recipient_email: str,
                   subject: str,
                   body: str,
                   attachment_path: str,
                   smtp_server: str,
                   smtp_port: int,
                   smtp_username: str,
                   smtp_password: str):
        """Send an email with the document attached"""
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        with open(attachment_path, 'rb') as f:
            attachment = MIMEApplication(f.read(), _subtype='docx')
            attachment.add_header('Content-Disposition', 'attachment', filename=os.path.basename(attachment_path))
            msg.attach(attachment)
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)

# Example usage and testing
if __name__ == "__main__":
    # Initialize handler
    handler = TemplateHandler()
    
    # Get available templates
    templates = handler.get_available_templates()
    print("Available templates:")
    for template in templates:
        print(f"Template: {template.filename}")
        print(f"Placeholders: {template.placeholders}")
    
    # Test filling a template
    values = {
        "title": "تجربة العنوان",
        "text": "هذا نص تجريبي لملء النموذج"
    }
    
    doc = handler.fill_template("doc1.docx", values)
    
    # Save filled document
    output_docx = "output.docx"
    handler.save_document(doc, output_docx)
    handler.convert_to_pdf(output_docx, "output.pdf")
    
    # Test with doc2
    values2 = {
        "name": "Osman Bashir",
        "desc": " 1# Senior Software Engineer"
    }
    
    doc2 = handler.fill_template("doc2.docx", values2)
    output_docx2 = "output2.docx"
    handler.save_document(doc2, output_docx2)
    handler.convert_to_pdf(output_docx2, "output2.pdf")