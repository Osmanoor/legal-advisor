# app/api/chat.py
from flask import Blueprint, request, jsonify
from app.services.chat_service import ChatService
from app.utils.auth_decorators import permission_required

chat_bp = Blueprint('chat', __name__)
chat_service = ChatService()

@chat_bp.route('', methods=['POST'])
@permission_required('access_ai_assistant')
def chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        return chat_service.process_chat(data)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
def get_chat_history():
    """Get chat history for a session"""
    session_id = request.args.get('sessionId', 'default')
    return chat_service.get_history(session_id)

@chat_bp.route('/history', methods=['DELETE'])
def clear_chat_history():
    """Clear chat history for a session"""
    session_id = request.args.get('sessionId', 'default')
    return chat_service.clear_history(session_id)