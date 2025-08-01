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
    # --- MODIFICATION START: Handle guest users ---
    # If there is no user_id (i.e., a guest), return an empty list immediately.
    if not user_id:
        return jsonify([]), 200
    # --- MODIFICATION END ---
    
    sessions = chat_service.get_sessions_for_user(user_id)
    return jsonify([serialize_session_list_item(s) for s in sessions]), 200

@chat_bp.route('/sessions/<session_id>', methods=['GET'])
@permission_required('access_chat')
def get_session_messages(session_id):
    user_id = get_jwt_identity()
    # Guests will not have a user_id, so this will correctly deny access.
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    session = chat_service.get_session_by_id(session_id, user_id)
    if not session:
        return jsonify({"error": "Session not found or access denied"}), 404
    return jsonify([serialize_message(m) for m in session.messages]), 200

@chat_bp.route('/sessions/<session_id>', methods=['DELETE'])
@permission_required('access_chat')
def delete_session(session_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
        
    if chat_service.delete_session_by_id(session_id, user_id):
        return jsonify({"message": "Session deleted successfully"}), 200
    return jsonify({"error": "Session not found or access denied"}), 404

@chat_bp.route('/sessions/<session_id>/message', methods=['POST'])
@permission_required('access_chat')
@usage_limited('ai_assistant_queries_per_day')
def add_message(session_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
        
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
    
    # --- MODIFICATION START: Handle guest chat history ---
    # Only consider history if the user is a guest (no user_id).
    history = data.get('history') if not user_id else None
    # --- MODIFICATION END ---
    
    if not first_message:
        return jsonify({"error": "Initial message content is required"}), 400
    
    session, user_message, assistant_message, error = chat_service.start_new_session(user_id, first_message, options, history)
    
    if error:
        return jsonify({"error": error}), 500
        
    messages_payload = [serialize_message(user_message), serialize_message(assistant_message)]
    
    # --- MODIFICATION START: Differentiate response for guests vs. users ---
    if session: # Authenticated user response
        return jsonify({
            'id': str(session.id), 
            'title': session.title,
            'updated_at': session.updated_at.isoformat() + 'Z',
            'questionCount': 1,
            'messages': messages_payload
        }), 201
    else: # Guest user response (no session created)
        return jsonify({
            'messages': messages_payload
        }), 200
    # --- MODIFICATION END ---