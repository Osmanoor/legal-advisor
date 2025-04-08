import pdfkit
import platform
import os

def html_to_pdf_pdfkit(html_file_path: str, pdf_file_path: str, wkhtmltopdf_path: str = None):
    """
    Converts an HTML file to a PDF file using pdfkit, preserving appearance.

    Args:
        html_file_path: Path to the input HTML file.
        pdf_file_path: Path where the output PDF file will be saved.
        wkhtmltopdf_path: Optional path to the wkhtmltopdf executable. 
                          Required if it's not in the system's PATH.
    """
    print(f"Attempting to convert '{html_file_path}' to '{pdf_file_path}' using pdfkit...")

    # --- wkhtmltopdf Configuration ---
    # pdfkit needs to know where wkhtmltopdf is installed.
    # If it's in your system PATH, pdfkit might find it automatically.
    # If not, you MUST provide the path.
    config = None
    if wkhtmltopdf_path:
        # Check if the provided path exists
        if not os.path.exists(wkhtmltopdf_path):
             print(f"Error: Provided wkhtmltopdf path does not exist: {wkhtmltopdf_path}")
             # Try to find it automatically based on OS as a fallback
             wkhtmltopdf_path = find_wkhtmltopdf_path()
             if not wkhtmltopdf_path:
                 print("Error: Could not find wkhtmltopdf executable automatically either.")
                 print("Please install wkhtmltopdf and provide the correct path.")
                 return False
             else:
                 print(f"Found wkhtmltopdf automatically at: {wkhtmltopdf_path}")
                 config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)
        else:
             print(f"Using provided wkhtmltopdf path: {wkhtmltopdf_path}")
             config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)
    else:
        # Try to find it automatically
        wkhtmltopdf_path_auto = find_wkhtmltopdf_path()
        if wkhtmltopdf_path_auto:
            print(f"Found wkhtmltopdf automatically at: {wkhtmltopdf_path_auto}")
            config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path_auto)
        else:
             print("Error: wkhtmltopdf path not provided and could not find it automatically.")
             print("Please install wkhtmltopdf from https://wkhtmltopdf.org/downloads.html")
             print("and either add it to your system PATH or provide the path to this function.")
             return False

    # --- Conversion Options ---
    # These options help ensure layout and appearance are preserved.
    options = {
        'page-size': 'A4',             # Standard page size (Letter, A3, etc.)
        'margin-top': '0.75in',        # Adjust margins as needed
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        'encoding': "UTF-8",           # Important for non-English characters
        'enable-local-file-access': None, # Allows loading local CSS/images referenced in HTML
        'keep-relative-links': None,   # Keep relative links if any (usually not needed for PDF)
        'print-media-type': None,      # Use CSS @media print rules
        'disable-smart-shrinking': None, # Prevent resizing content (use with caution)
        # 'enable-smart-shrinking': None, # Alternative: try to fit content smartly (default)
        'no-outline': None,            # Optional: Disable PDF outline generation
        'load-error-handling': 'ignore', # Optional: skip, ignore, abort on resource load errors
        'load-media-error-handling': 'ignore', # Optional: handle media load errors
        'custom-header': [             # Optional: Add header
             ('Accept-Language', 'en-US,en;q=0.9,ar;q=0.8') # Example header if needed
        ],
        # 'zoom': '1.0', # Optional: Adjust zoom level if needed
        # 'dpi': '300' # Optional: Set DPI for rendering quality
    }

    try:
        print("Starting PDF generation...")
        success = pdfkit.from_file(html_file_path, pdf_file_path, options=options, configuration=config)
        if success:
            print(f"Successfully created PDF: {pdf_file_path}")
            return True
        else:
            # pdfkit.from_file returns True on success, raises exception on failure usually
            # This else might not be reached often, but included for completeness
            print("PDF generation failed (pdfkit returned False).")
            return False
            
    except FileNotFoundError as e:
         print(f"Error: Input HTML file not found: {html_file_path}")
         print(e)
         return False
    except OSError as e:
        # This often indicates wkhtmltopdf was not found or has permission issues
        print(f"Error during PDF generation (OSError): {e}")
        print("This might be due to wkhtmltopdf not being found or configuration issues.")
        print(f"Path used for wkhtmltopdf: {config.wkhtmltopdf if config else 'Not configured'}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during PDF generation: {e}")
        return False

def find_wkhtmltopdf_path():
    """Tries to find the wkhtmltopdf executable path based on OS."""
    system = platform.system()
    if system == "Windows":
        # Common installation paths on Windows
        possible_paths = [
            'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe',
            'C:\\Program Files (x86)\\wkhtmltopdf\\bin\\wkhtmltopdf.exe',
        ]
    elif system == "Linux":
        # Common installation paths on Linux (check PATH first)
        try:
            # Check if it's in the PATH
            path = os.popen('which wkhtmltopdf').read().strip()
            if path and os.path.exists(path):
                return path
        except Exception:
            pass 
        # Common manual install locations
        possible_paths = [
            '/usr/bin/wkhtmltopdf',
            '/usr/local/bin/wkhtmltopdf',
        ]
    elif system == "Darwin": # macOS
         # Common installation paths on macOS (check PATH first)
        try:
            # Check if it's in the PATH
            path = os.popen('which wkhtmltopdf').read().strip()
            if path and os.path.exists(path):
                return path
        except Exception:
            pass
        possible_paths = [
            '/usr/local/bin/wkhtmltopdf',
            '/opt/homebrew/bin/wkhtmltopdf', # Apple Silicon Homebrew
        ]
    else:
        possible_paths = []

    for path in possible_paths:
        if os.path.exists(path):
            return path
            
    # Last resort: check PATH directly using shutil (more robust)
    try:
        import shutil
        path = shutil.which('wkhtmltopdf')
        if path:
            return path
    except ImportError:
        pass # shutil might not be available in very old Pythons

    return None

# --- How to use ---
# 1. Install pdfkit: pip install pdfkit
# 2. Install wkhtmltopdf: Download from https://wkhtmltopdf.org/downloads.html
#    Make sure to download the correct version for your OS.
#    During installation (especially on Windows), you might get an option to add it to PATH.
# 3. Define paths
input_html = "procurement_report.html" # Replace with your HTML file name
output_pdf = 'report_pdfkit.pdf' # Replace with desired PDF file name

# --- !! IMPORTANT !! ---
# If wkhtmltopdf is NOT in your system PATH, specify the full path to the executable below.
# Example for Windows: path_to_wkhtml = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
# Example for Linux: path_to_wkhtml = '/usr/local/bin/wkhtmltopdf'
# Example for macOS: path_to_wkhtml = '/usr/local/bin/wkhtmltopdf'
# If it IS in your PATH, you can leave it as None.
path_to_wkhtml = None 

# Create a dummy HTML file for testing if it doesn't exist
if not os.path.exists(input_html):
    print(f"Creating dummy HTML file: {input_html}")
    with open(input_html, 'w', encoding='utf-8') as f:
        f.write("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Test Report</title>
            <style>
                body { font-family: sans-serif; color: #333; }
                h1 { color: blue; }
                p { background-color: yellow; padding: 10px; border: 1px solid red;}
            </style>
        </head>
        <body>
            <h1>Test Report</h1>
            <p>This is a test paragraph with some styling.</p>
            <p>الألوان والأبعاد يجب أن تبقى كما هي.</p> 
        </body>
        </html>
        """)

# Run the conversion
if html_to_pdf_pdfkit(input_html, output_pdf, wkhtmltopdf_path=path_to_wkhtml):
     print("Done.")
else:
     print("Conversion failed.")

