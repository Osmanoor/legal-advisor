from flask import Flask, request, jsonify, send_from_directory
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
