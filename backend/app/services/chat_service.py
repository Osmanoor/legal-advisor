# app/services/chat_service.py

import uuid
import sys
import os
from flask import jsonify
from datetime import datetime
from app.extensions import db
from app.models import ChatSession, ChatMessage, MessageResource

# Correctly import the RAG system components
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from src.config import load_config
from src.rag_system import ArabicRAGSystem

class ChatService:
    def __init__(self):
        self.rag_systems = {}
        self.configs = {}

    def get_rag_system(self, language: str = 'ar', reasoning: bool = False):
        if language not in self.rag_systems:
            self.rag_systems[language] = {}
            self.configs[language] = {}

        if reasoning not in self.rag_systems[language]:
            self.configs[language][reasoning] = load_config(language, reasoning)
            self.rag_systems[language][reasoning] = ArabicRAGSystem(self.configs[language][reasoning])

        return self.rag_systems[language][reasoning]

    def get_sessions_for_user(self, user_id: str):
        user_uuid = uuid.UUID(user_id)
        sessions = ChatSession.query.filter_by(user_id=user_uuid).order_by(ChatSession.updated_at.desc()).all()
        return sessions

    def get_session_by_id(self, session_id: str, user_id: str):
        session_uuid = uuid.UUID(session_id)
        user_uuid = uuid.UUID(user_id)
        session = ChatSession.query.filter_by(id=session_uuid, user_id=user_uuid).first()
        return session

    def delete_session_by_id(self, session_id: str, user_id: str) -> bool:
        session = self.get_session_by_id(session_id, user_id)
        if session:
            db.session.delete(session)
            db.session.commit()
            return True
        return False

    def _get_history_for_rag(self, session: ChatSession):
        history = []
        user_msgs = [msg for msg in session.messages if msg.role == 'user']
        assistant_msgs = [msg for msg in session.messages if msg.role == 'assistant']
        
        for i in range(len(user_msgs)):
            user_msg = user_msgs[i].content
            assistant_msg = assistant_msgs[i].content if i < len(assistant_msgs) else ""
            history.append((user_msg, assistant_msg))
            
        return history

    def add_message_to_session(self, session_id: str, user_id: str, user_message_content: str, options: dict):
        session = self.get_session_by_id(session_id, user_id)
        if not session:
            return None, "Session not found or access denied"

        user_message = ChatMessage(session_id=session.id, role='user', content=user_message_content)
        db.session.add(user_message)
        db.session.flush()
        
        history = self._get_history_for_rag(session)
        history.append((user_message_content, ''))

        rag_system = self.get_rag_system(
            language=options.get('language', 'ar'),
            reasoning=options.get('reasoning', False)
        )
        response_data = rag_system.query(user_message_content, history[:-1])
        
        assistant_message = ChatMessage(session_id=session.id, role='assistant', content=response_data['answer'])
        db.session.add(assistant_message)
        db.session.flush()

        for doc in response_data.get("source_documents", []):
            resource = MessageResource(
                message_id=assistant_message.id,
                content=doc.page_content,
                resource_metadata=doc.metadata
            )
            db.session.add(resource)
            
        db.session.commit()
        return assistant_message, None

    def start_new_session(self, user_id: str | None, first_message_content: str, options: dict, history: list | None = None):
        """Starts a new session for users, or handles a sessionless query for guests."""
        
        rag_system = self.get_rag_system(
            language=options.get('language', 'ar'),
            reasoning=options.get('reasoning', False)
        )

        # --- MODIFICATION START: Handle authenticated vs. guest users ---
        if user_id:
            # Authenticated user: Create persistent session and messages
            user_uuid = uuid.UUID(user_id)
            
            new_session = ChatSession(
                user_id=user_uuid,
                title=first_message_content[:120]
            )
            db.session.add(new_session)
            
            user_message = ChatMessage(session=new_session, role='user', content=first_message_content)
            db.session.add(user_message)
            
            response_data = rag_system.query(first_message_content, [])
            
            assistant_message = ChatMessage(session=new_session, role='assistant', content=response_data['answer'])
            db.session.add(assistant_message)
            db.session.flush()

            for doc in response_data.get("source_documents", []):
                resource = MessageResource(
                    message_id=assistant_message.id,
                    content=doc.page_content,
                    resource_metadata=doc.metadata
                )
                db.session.add(resource)
            
            db.session.commit()
            return new_session, user_message, assistant_message, None
        else:
            # Guest user: Perform RAG query without saving to DB
            chat_history_for_rag = history or []
            
            response_data = rag_system.query(first_message_content, chat_history_for_rag)

            # Create transient (non-DB) message objects to return
            user_message = ChatMessage(role='user', content=first_message_content, id=uuid.uuid4(), created_at=datetime.utcnow(), resources=[])
            assistant_message = ChatMessage(role='assistant', content=response_data['answer'], id=uuid.uuid4(), created_at=datetime.utcnow())
            
            # Populate resources for the assistant message
            transient_resources = []
            for doc in response_data.get("source_documents", []):
                resource = MessageResource(content=doc.page_content, resource_metadata=doc.metadata)
                transient_resources.append(resource)
            assistant_message.resources = transient_resources

            return None, user_message, assistant_message, None
        # --- MODIFICATION END ---


# --- SERIALIZATION HELPERS ---
def serialize_session_list_item(session):
    question_count = sum(1 for msg in session.messages if msg.role == 'user')
    return {
        'id': str(session.id), 
        'title': session.title,
        'updated_at': session.updated_at.isoformat() + 'Z',
        'questionCount': question_count
    }

def serialize_resource(resource):
    return { 'content': resource.content, 'metadata': resource.resource_metadata }

def serialize_message(message):
    return {
        'id': str(message.id), 'role': message.role, 'content': message.content,
        'timestamp': message.created_at.isoformat() + 'Z',
        'resources': [serialize_resource(r) for r in message.resources]
    }