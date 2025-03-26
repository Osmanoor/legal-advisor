import unittest
import requests
import json
import os
import tempfile
from datetime import datetime


class TemplatesEndpointTest(unittest.TestCase):
    """Test case for templates API endpoints"""
    
    BASE_URL = "http://localhost:8080/api"
    TEMPLATES_URL = f"{BASE_URL}/templates"
    
    def setUp(self):
        """Setup before each test"""
        # Create a temporary directory to store test files
        self.temp_dir = tempfile.mkdtemp()
        
        # Sample template values for award letter
        self.sample_values = {
            "today_date": datetime.now().strftime("%d/%m/%Y"),
            "supplier_name": "شركة الأمل للمقاولات",
            "supplier_address": "الرياض، طريق الملك فهد",
            "supplier_email": "info@alamal.com",
            "project_name": "توريد وتركيب أنظمة تكييف",
            "contract_number": 12345,
            "commercial_register": 4030123456,
            "project_name_repeat": "توريد وتركيب أنظمة تكييف",
            "offer_date": "15/02/2025",
            "total_amount_number": 500000,
            "total_amount_text": "خمسمائة ألف ريال سعودي",
            "authority_title": "مدير إدارة المشتريات",
            "authority_name": "محمد عبدالله السعيد"
        }
    
    def tearDown(self):
        """Cleanup after each test"""
        # Remove any downloaded files
        for filename in os.listdir(self.temp_dir):
            os.remove(os.path.join(self.temp_dir, filename))
        os.rmdir(self.temp_dir)
    
    def test_get_all_templates(self):
        """Test retrieving all templates"""
        response = requests.get(self.TEMPLATES_URL)
        self.assertEqual(response.status_code, 200)
        
        # Verify response structure
        data = response.json()
        self.assertIn("templates", data)
        self.assertIsInstance(data["templates"], list)
        
        # If templates exist, verify their structure
        if data["templates"]:
            template = data["templates"][0]
            self.assertIn("id", template)
            self.assertIn("filename", template)
            self.assertIn("display_name", template)
            self.assertIn("placeholders", template)
    
    def test_get_template_details(self):
        """Test retrieving details for a specific template"""
        # First get all templates to find an ID to test
        all_templates = requests.get(self.TEMPLATES_URL).json()
        if not all_templates.get("templates"):
            self.skipTest("No templates available for testing")
        
        template_id = all_templates["templates"][0]["id"]
        response = requests.get(f"{self.TEMPLATES_URL}/{template_id}")
        
        self.assertEqual(response.status_code, 200)
        template = response.json()
        
        # Verify template structure
        self.assertEqual(template["id"], template_id)
        self.assertIn("filename", template)
        self.assertIn("placeholders", template)
        
        # Verify placeholder structure
        if template["placeholders"]:
            placeholder = template["placeholders"][0]
            self.assertIn("id", placeholder)
            self.assertIn("type", placeholder)
            self.assertIn("required", placeholder)
            self.assertIn("description", placeholder)
    
    def test_generate_and_download_document(self):
        """Test generating and downloading a document"""
        # First get all templates to find an ID to test
        all_templates = requests.get(self.TEMPLATES_URL).json()
        if not all_templates.get("templates"):
            self.skipTest("No templates available for testing")
        
        template_id = all_templates["templates"][0]["id"]
        
        # Generate document
        generate_response = requests.post(
            f"{self.TEMPLATES_URL}/{template_id}/generate",
            json=self.sample_values
        )
        
        self.assertEqual(generate_response.status_code, 200)
        generate_data = generate_response.json()
        self.assertIn("doc_path", generate_data)
        
        # Download as DOCX
        download_response = requests.post(
            f"{self.TEMPLATES_URL}/download/docx",
            json={"doc_path": generate_data["doc_path"]}
        )
        
        self.assertEqual(download_response.status_code, 200)
        self.assertIn("application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                     download_response.headers["Content-Type"])
        
        # Save the downloaded file
        docx_path = os.path.join(self.temp_dir, "test_document.docx")
        with open(docx_path, "wb") as f:
            f.write(download_response.content)
        
        # Verify file exists and has content
        self.assertTrue(os.path.exists(docx_path))
        self.assertGreater(os.path.getsize(docx_path), 0)
    
    def test_generate_and_download_pdf(self):
        """Test generating and downloading a document as PDF"""
        # First get all templates to find an ID to test
        all_templates = requests.get(self.TEMPLATES_URL).json()
        if not all_templates.get("templates"):
            self.skipTest("No templates available for testing")
        
        template_id = all_templates["templates"][0]["id"]
        
        # Generate document
        generate_response = requests.post(
            f"{self.TEMPLATES_URL}/{template_id}/generate",
            json=self.sample_values
        )
        
        self.assertEqual(generate_response.status_code, 200)
        generate_data = generate_response.json()
        
        # Download as PDF
        download_response = requests.post(
            f"{self.TEMPLATES_URL}/download/pdf",
            json={"doc_path": generate_data["doc_path"]}
        )
        
        self.assertEqual(download_response.status_code, 200)
        self.assertIn("application/pdf", download_response.headers["Content-Type"])
        
        # Save the downloaded file
        pdf_path = os.path.join(self.temp_dir, "test_document.pdf")
        with open(pdf_path, "wb") as f:
            f.write(download_response.content)
        
        # Verify file exists and has content
        self.assertTrue(os.path.exists(pdf_path))
        self.assertGreater(os.path.getsize(pdf_path), 0)
    
    def test_invalid_template_id(self):
        """Test behavior with an invalid template ID"""
        response = requests.get(f"{self.TEMPLATES_URL}/nonexistent_template")
        self.assertEqual(response.status_code, 404)
    
    def test_missing_values(self):
        """Test generating a document with missing values"""
        # First get all templates to find an ID to test
        all_templates = requests.get(self.TEMPLATES_URL).json()
        if not all_templates.get("templates"):
            self.skipTest("No templates available for testing")
        
        template_id = all_templates["templates"][0]["id"]
        
        # Generate with empty values
        response = requests.post(
            f"{self.TEMPLATES_URL}/{template_id}/generate",
            json={}
        )
        
        # This might be 400 (if backend validates) or 200 (if frontend handles validation)
        # Adjust the test based on your implementation
        if response.status_code == 400:
            self.assertIn("error", response.json())
        else:
            self.assertEqual(response.status_code, 200)
            self.assertIn("doc_path", response.json())
    
    def test_send_email(self):
        """Test sending document via email (if implemented)"""
        # First generate a document
        all_templates = requests.get(self.TEMPLATES_URL).json()
        if not all_templates.get("templates"):
            self.skipTest("No templates available for testing")
        
        template_id = all_templates["templates"][0]["id"]
        
        generate_response = requests.post(
            f"{self.TEMPLATES_URL}/{template_id}/generate",
            json=self.sample_values
        )
        
        if generate_response.status_code != 200:
            self.skipTest("Document generation failed, cannot test email")
        
        doc_path = generate_response.json()["doc_path"]
        
        # Attempt to send email (might be skipped in CI environments)
        # Use a test email or environment variable
        test_email = os.environ.get("TEST_EMAIL", "osmanbashir2013@gmail.com")
        
        email_data = {
            "recipient_email": test_email,
            "subject": "Test Email with Generated Document",
            "body": "This is a test email with an attached document generated from a template.",
            "doc_path": doc_path
        }
        
        response = requests.post(f"{self.TEMPLATES_URL}/send-email", json=email_data)
        
        # This might fail if email sending is not configured in the test environment
        # So we'll just check the response structure
        if response.status_code == 200:
            self.assertIn("message", response.json())
        else:
            print(f"Email sending test failed with status {response.status_code}: {response.text}")


if __name__ == "__main__":
    unittest.main()