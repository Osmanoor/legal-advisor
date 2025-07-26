# app/api/chat.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.services.chat_service import ChatService
from app.utils.auth_decorators import permission_required, usage_limited
from app.services.chat_service import serialize_session_list_item, serialize_message

chat_bp = Blueprint('chat_api', __name__)
chat_service = ChatService()

@chat_bp.route('/sessions', methods=['GET'])
@permission_required('access_chat')
def get_sessions():
    user_id = get_jwt_identity()
    sessions = chat_service.get_sessions_for_user(user_id)
    return jsonify([serialize_session_list_item(s) for s in sessions]), 200

@chat_bp.route('/sessions/<session_id>', methods=['GET'])
@permission_required('access_chat')
def get_session_messages(session_id):
    user_id = get_jwt_identity()
    session = chat_service.get_session_by_id(session_id, user_id)
    if not session:
        return jsonify({"error": "Session not found or access denied"}), 404
    return jsonify([serialize_message(m) for m in session.messages]), 200

@chat_bp.route('/sessions/<session_id>', methods=['DELETE'])
@permission_required('access_chat')
def delete_session(session_id):
    user_id = get_jwt_identity()
    if chat_service.delete_session_by_id(session_id, user_id):
        return jsonify({"message": "Session deleted successfully"}), 200
    return jsonify({"error": "Session not found or access denied"}), 404

@chat_bp.route('/sessions/<session_id>/message', methods=['POST'])
@permission_required('access_chat')
@usage_limited('ai_assistant_queries_per_day')
def add_message(session_id):
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
@permission_required('access_chat')
@usage_limited('ai_assistant_queries_per_day') 
def start_new_chat():
    user_id = get_jwt_identity()
    data = request.get_json()
    first_message = data.get('message')
    options = data.get('options', {})
    if not first_message:
        return jsonify({"error": "Initial message content is required"}), 400
    
    # --- FIX: Capture the explicit message objects returned from the service ---
    session, user_message, assistant_message, error = chat_service.start_new_session(user_id, first_message, options)
    
    if error:
        return jsonify({"error": error}), 500
        
    # --- FIX: Construct the messages array in the correct, guaranteed order ---
    messages_payload = [serialize_message(user_message), serialize_message(assistant_message)]
    
    return jsonify({
        'id': str(session.id), 
        'title': session.title,
        'updated_at': session.updated_at.isoformat() + 'Z',
        'questionCount': 1, # A new session always starts with one question
        'messages': messages_payload
    }), 201