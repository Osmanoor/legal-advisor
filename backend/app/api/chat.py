# app/api/chat.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.chat_service import ChatService

chat_bp = Blueprint('chat_api', __name__)
chat_service = ChatService()

def serialize_resource(resource):
    """Serializes a MessageResource object into the frontend's Resource format."""
    return {
        'content': resource.content,
        'metadata': resource.resource_metadata 
    }

def serialize_message(message):
    """Serializes a ChatMessage object into the frontend's ChatMessage format."""
    return {
        'id': str(message.id),
        'role': message.role,
        'content': message.content,
        'timestamp': message.created_at.isoformat(), 
        'resources': [serialize_resource(r) for r in message.resources]
    }

def serialize_session_list_item(session):
    """Serializes a ChatSession object for the session list."""
    return {
        'id': str(session.id),
        'title': session.title,
        'lastUpdated': session.updated_at.isoformat(),
        'questionCount': len(session.messages) // 2 
    }

@chat_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    """Get all chat sessions for the current user."""
    user_id = get_jwt_identity()
    sessions = chat_service.get_sessions_for_user(user_id)
    return jsonify([serialize_session_list_item(s) for s in sessions]), 200

@chat_bp.route('/sessions/<session_id>', methods=['GET'])
@jwt_required()
def get_session_messages(session_id):
    """Get all messages for a specific chat session."""
    user_id = get_jwt_identity()
    session = chat_service.get_session_by_id(session_id, user_id)
    if not session:
        return jsonify({"error": "Session not found or access denied"}), 404
    return jsonify([serialize_message(m) for m in session.messages]), 200

@chat_bp.route('/sessions/<session_id>', methods=['DELETE'])
@jwt_required()
def delete_session(session_id):
    """Delete a chat session."""
    user_id = get_jwt_identity()
    if chat_service.delete_session_by_id(session_id, user_id):
        return jsonify({"message": "Session deleted successfully"}), 200
    return jsonify({"error": "Session not found or access denied"}), 404

@chat_bp.route('/sessions/<session_id>/message', methods=['POST'])
@jwt_required()
def add_message(session_id):
    """Add a new message to an existing session."""
    user_id = get_jwt_identity()
    data = request.get_json()
    user_message = data.get('message')
    options = data.get('options', {})

    if not user_message:
        return jsonify({"error": "Message content is required"}), 400

    assistant_message, error = chat_service.add_message_to_session(session_id, user_id, user_message, options)
    if error:
        return jsonify({"error": error}), 404
        
    return jsonify(serialize_message(assistant_message)), 201

@chat_bp.route('/sessions/new', methods=['POST'])
@jwt_required()
def start_new_chat():
    """Start a new chat session."""
    user_id = get_jwt_identity()
    data = request.get_json()
    first_message = data.get('message')
    options = data.get('options', {})

    if not first_message:
        return jsonify({"error": "Initial message content is required"}), 400

    session, error = chat_service.start_new_session(user_id, first_message, options)
    if error:
        return jsonify({"error": error}), 500

    return jsonify({
        'id': str(session.id),
        'title': session.title,
        'updated_at': session.updated_at.isoformat(),
        'messages': [serialize_message(m) for m in session.messages]
    }), 201