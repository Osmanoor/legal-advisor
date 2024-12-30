from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import os
import sys
from typing import Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import csv
from functools import wraps

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.config import load_config
from src.rag_system import ArabicRAGSystem
from data.search_engine import SearchEngine
from app.DriveLibrary import DriveLibrary



app = Flask('__name__', static_folder='static', static_url_path='')
CORS(app)

# Configuration
CONTACTS_FILE = 'data/contacts.csv'
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = '123'

# Ensure data directory exists
os.makedirs(os.path.dirname(CONTACTS_FILE), exist_ok=True)

# Global variables
configs = {}
rag_systems = {}
chat_histories = {}

# Initialize Drive Library with your Google Drive folder ID
drive_library = DriveLibrary(folder_id="1BMIRxbgn7CdNCETbULCntFDJ-gEBYPWA", credentials_path="service_account_credentials.json")


search_engine = SearchEngine()
@dataclass
class ChatResponse:
    """Structure for chat response"""
    answer: str
    sources: list
    error: Optional[str] = None

def get_rag_system(language):
    if language not in rag_systems:
        configs[language] = load_config(language)
        rag_systems[language] = ArabicRAGSystem(configs[language])
    return rag_systems[language]

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return jsonify({'error': 'Unauthorized access'}), 401
        return f(*args, **kwargs)
    return decorated

def check_auth(username, password):
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")


# Catch all routes to serve React Router paths
@app.route('/<path:path>')
def serve_path(path):
    if path.startswith('api/'):
        return 'Not found', 404
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        message = data.get('message')
        session_id = data.get('sessionId', 'default')
        language = data.get('language', 'ar')

        rag_system = get_rag_system(language)

        if not message:
            return jsonify({"error": "No message provided"}), 400

        if session_id not in chat_histories:
            chat_histories[session_id] = []

        response = rag_system.query(
            message,
            chat_histories[session_id]
        )

        chat_histories[session_id].append((message, response["answer"]))

        formatted_sources = []
        for doc in response["source_documents"]:
            print(doc.metadata)
            print("\n")
            source = {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            formatted_sources.append(source)

        chat_response = ChatResponse(
            answer=response["answer"],
            sources=formatted_sources
        )
        return jsonify(asdict(chat_response))

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat/history', methods=['GET'])
def get_chat_history():
    session_id = request.args.get('sessionId', 'default')
    return jsonify(chat_histories.get(session_id, []))

@app.route('/api/chat/history', methods=['DELETE'])
def clear_chat_history():
    session_id = request.args.get('sessionId', 'default')
    if session_id in chat_histories:
        chat_histories[session_id] = []
    return jsonify({"status": "success"})

def validate_search_type(search_type: Optional[str]) -> bool:
    """Validate the search type parameter."""
    if search_type is None:
        return True
    return search_type in ['System', 'Regulation', 'Both']

@app.route('/api/search', methods=['GET'])
def search():
    """
    Handle search requests with query parameters.
    
    Query Parameters:
    - query (required): Search keywords
    - type (optional): Resource type filter ('System', 'Regulation', 'Both')
    
    Returns:
    - JSON response with search results or error message
    """
    # Get query parameters
    search_query = request.args.get('query', '').strip()
    search_type = request.args.get('type')
    print(f"search:{search_query} type:{search_type}")
    # Validate input
    if not search_query:
        return jsonify({
            'error': 'Search query is required'
        }), 400

    if search_type is None:
        search_type = "Both"
        
    if not validate_search_type(search_type):
        return jsonify({
            'error': 'Invalid search type. Must be one of: System, Regulation, Both'
        }), 400
    
    try:
        # Call your existing search function
        # Assuming your function is named 'perform_search' and takes these parameters
        search_results = search_engine.search(
            query_text=search_query,
            doc_type=search_type
        )

        # Return the results
        return jsonify({
            'data': search_results
        }), 200

    except Exception as e:
        # Log the error here if you have logging set up
        return jsonify({
            'error': 'An error occurred while processing your search'
        }), 500
    
# Library API --------------------------
@app.route('/api/list-folder-contents', methods=['GET'])
def list_folder_contents():
    folder_id = request.args.get('folder_id', None)
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')
    result = drive_library.list_folder_contents(folder_id, sort_by, sort_order)
    print(result)
    return jsonify(result)

@app.route('/api/search-files', methods=['GET'])
def search_files():
    query = request.args.get('query', '')
    folder_id = request.args.get('folder_id', None)
    recursive = request.args.get('recursive', 'true').lower() == 'true'
    file_type = request.args.get('file_type', None)
    min_size = request.args.get('min_size', None)
    max_size = request.args.get('max_size', None)

    result = drive_library.search_files(
        query=query,
        folder_id=folder_id,
        recursive=recursive,
        file_type=file_type,
        min_size=int(min_size) if min_size else None,
        max_size=int(max_size) if max_size else None
    )
    print(result)
    return jsonify(result)

@app.route('/api/get-download-url', methods=['POST'])
def get_download_url():
    try:
        data = request.json
        file_id = data.get('file_id')

        if not file_id:
            return jsonify({'error': 'file_id is required'}), 400

        result = drive_library.download_file(file_id)
        
        if 'error' in result:
            return jsonify(result), 500

        return jsonify(result)

    except Exception as e:
        print(f"Error in download URL endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/download-file', methods=['POST'])
def download_file():
    try:
        data = request.json
        file_id = data.get('file_id')

        if not file_id:
            return jsonify({'error': 'file_id is required'}), 400

        file_io, file_name, mime_type = drive_library.download_file(file_id)
        
        if file_io is None:
            # If mime_type is a dict, it contains our error message
            if isinstance(mime_type, dict) and 'error' in mime_type:
                return jsonify(mime_type), 500
            return jsonify({'error': 'Failed to download file'}), 500

        # Add headers to prevent caching
        response = send_file(
            file_io,
            mimetype=mime_type,
            as_attachment=True,
            download_name=file_name
        )
        
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        
        return response

    except Exception as e:
        print(f"Error in download endpoint: {str(e)}")
        return jsonify({'error': 'Server error during download'}), 500

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return jsonify({'error': 'All fields are required'}), 400

        file_exists = os.path.isfile(CONTACTS_FILE)
        with open(CONTACTS_FILE, 'a', newline='', encoding='utf-8') as file:
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
        return jsonify({'error': str(e)}), 500

@app.route('/api/contacts', methods=['GET'])
@require_auth
def get_contacts():
    try:
        if not os.path.exists(CONTACTS_FILE):
            return jsonify([])

        contacts = []
        with open(CONTACTS_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            contacts = list(reader)

        return jsonify(contacts)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
