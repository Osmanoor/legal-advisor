from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from typing import Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import csv
from functools import wraps
import hashlib

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.config import load_config
from src.rag_system import ArabicRAGSystem


os.environ["OPENAI_API_KEY"] = "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"
os.environ["GOOGLE_API_KEY"] = "AIzaSyCS1BffW1boMTsHsg5tW_LJRIErIWxJ0EI"

# Configuration
CONTACTS_FILE = 'data/contacts.csv'
ADMIN_USERNAME = 'admin'  
ADMIN_PASSWORD = '123'  

# Ensure data directory exists
os.makedirs(os.path.dirname(CONTACTS_FILE), exist_ok=True)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables
configs = {}
rag_systems = {}
chat_histories = {}  # Store chat histories per session

def get_rag_system(language):
    if language not in rag_systems:
        configs[language] = load_config(language)
        rag_systems[language] = ArabicRAGSystem(configs[language])
    return rag_systems[language]

@dataclass
class ChatResponse:
    """Structure for chat response"""
    answer: str
    sources: list
    error: Optional[str] = None


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        print(auth)
        if not auth or not check_auth(auth.username, auth.password):
            return jsonify({'error': 'Unauthorized access'}), 401
        return f(*args, **kwargs)
    return decorated

def check_auth(username, password):
    # In production, use proper password hashing
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        message = data.get('message')
        session_id = data.get('sessionId', 'default')  # Use a session ID to maintain separate chat histories
        language = data.get('language', 'ar')

        # Get the appropriate rag_system for the given language
        rag_system = get_rag_system(language)

        if not message:
            return jsonify({"error": "No message provided"}), 400

        # Initialize chat history for new sessions
        if session_id not in chat_histories:
            chat_histories[session_id] = []

        # Get response from RAG system
        response = rag_system.query(
            message,
            chat_histories[session_id]
        )

        # Update chat history
        chat_histories[session_id].append((message, response["answer"]))

        # Format sources for response
        formatted_sources = []
        for doc in response["source_documents"]:
            source = {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            formatted_sources.append(source)

        chat_response = ChatResponse(
            answer=response["answer"],
            sources=formatted_sources
        )
        print(asdict(chat_response))
        return jsonify(asdict(chat_response))

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat/history', methods=['GET'])
def get_chat_history():
    """Get chat history for a session"""
    session_id = request.args.get('sessionId', 'default')
    return jsonify(chat_histories.get(session_id, []))

@app.route('/api/chat/history', methods=['DELETE'])
def clear_chat_history():
    """Clear chat history for a session"""
    session_id = request.args.get('sessionId', 'default')
    if session_id in chat_histories:
        chat_histories[session_id] = []
    return jsonify({"status": "success"})

@app.route('/api/language', methods=['GET', 'PUT'])
def handle_language():
    """Handle language preference"""
    if request.method == 'GET':
        return jsonify({"language": request.args.get('language', 'ar')})
    else:
        data = request.get_json()
        language = data.get('language', 'ar')

        return jsonify({"language": language})
    
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        print(data)
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return jsonify({'error': 'All fields are required'}), 400

        # Create CSV file if it doesn't exist
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
    app.run(debug=True, port=5000)