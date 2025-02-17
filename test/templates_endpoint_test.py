import requests
import json
import os
from pprint import pprint

class TemplateEndpointTester:
    def __init__(self, base_url="http://localhost:8080/api"):  # Updated port to 8080
        self.base_url = base_url
        self.generated_doc_path = None

    def test_get_all_templates(self):
        """Test GET /templates endpoint"""
        print("\n1. Testing GET all templates...")
        try:
            response = requests.get(f"{self.base_url}/templates")
            pprint(response.json())
            assert response.status_code == 200
            return response.json()
        except requests.exceptions.ConnectionError:
            print(f"Connection Error: Make sure the Flask server is running on {self.base_url}")
            raise
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_get_template_details(self, template_name="doc1.docx"):
        """Test GET /templates/<template_name> endpoint"""
        print(f"\n2. Testing GET template details for {template_name}...")
        try:
            response = requests.get(f"{self.base_url}/templates/{template_name}")
            pprint(response.json())
            assert response.status_code == 200
            return response.json()
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_generate_document(self, template_name="doc1.docx"):
        """Test POST /templates/<template_name>/generate endpoint"""
        print(f"\n3. Testing generate document for {template_name}...")
        try:
            # Get template details first to know required placeholders
            template_details = self.test_get_template_details(template_name)
            
            # Create test values for each placeholder
            test_values = {
                placeholder: f"Test {placeholder} value"
                for placeholder in template_details['placeholders']
            }
            
            response = requests.post(
                f"{self.base_url}/templates/{template_name}/generate",
                json=test_values
            )
            pprint(response.json())
            assert response.status_code == 200
            
            # Save doc_path for later tests
            self.generated_doc_path = response.json().get('doc_path')
            return response.json()
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_download_document_docx(self):
        """Test POST /templates/download/docx endpoint"""
        print("\n4. Testing download document as DOCX...")
        try:
            if not self.generated_doc_path:
                print("No document generated yet. Generating one...")
                self.test_generate_document()

            response = requests.post(
                f"{self.base_url}/templates/download/docx",
                json={"doc_path": self.generated_doc_path}
            )
            
            if response.status_code == 200:
                # Save the file locally for inspection
                with open("test_download.docx", "wb") as f:
                    f.write(response.content)
                print("Document downloaded successfully as 'test_download.docx'")
            else:
                print("Error downloading document:", response.json())
            
            assert response.status_code == 200
            return response
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_download_document_pdf(self):
        """Test POST /templates/download/pdf endpoint"""
        print("\n5. Testing download document as PDF...")
        try:
            if not self.generated_doc_path:
                print("No document generated yet. Generating one...")
                self.test_generate_document()

            response = requests.post(
                f"{self.base_url}/templates/download/pdf",
                json={"doc_path": self.generated_doc_path}
            )
            
            if response.status_code == 200:
                # Save the file locally for inspection
                with open("test_download.pdf", "wb") as f:
                    f.write(response.content)
                print("Document downloaded successfully as 'test_download.pdf'")
            else:
                print("Error downloading document:", response.json())
            
            assert response.status_code == 200
            return response
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def test_send_email(self, recipient_email="osmanbashir2013@gmail.com"):
        """Test POST /templates/send-email endpoint"""
        print("\n6. Testing send email...")
        try:
            if not self.generated_doc_path:
                print("No document generated yet. Generating one...")
                self.test_generate_document()

            email_data = {
                "recipient_email": recipient_email,
                "subject": "Test Document",
                "body": "Please find the test document attached.",
                "doc_path": self.generated_doc_path
            }

            response = requests.post(
                f"{self.base_url}/templates/send-email",
                json=email_data
            )
            pprint(response.json())
            assert response.status_code == 200
            return response.json()
        except Exception as e:
            print(f"Error: {str(e)}")
            raise

    def run_all_tests(self):
        """Run all tests in sequence"""
        try:
            print(f"Starting tests against server at {self.base_url}")
            print("Make sure the Flask server is running before proceeding.")
            input("Press Enter to continue...")
            
            self.test_get_all_templates()
            self.test_get_template_details()
            self.test_generate_document()
            self.test_download_document_docx()
            self.test_download_document_pdf()
            self.test_send_email()
            print("\nAll tests completed successfully!")
        except AssertionError as e:
            print(f"\nTest failed: {str(e)}")
        except requests.exceptions.ConnectionError:
            print("\nConnection Error: Could not connect to the server. Make sure:")
            print("1. The Flask server is running")
            print("2. The port number is correct (currently set to 8080)")
            print("3. You can access the server at", self.base_url)
        except Exception as e:
            print(f"\nError during testing: {str(e)}")

if __name__ == "__main__":
    # Create tester instance
    tester = TemplateEndpointTester()  # Uses port 8080 by default
    
    # Alternatively, you can specify a different base URL:
    # tester = TemplateEndpointTester(base_url="http://localhost:8080/api")
    
    # Run all tests
    tester.run_all_tests()