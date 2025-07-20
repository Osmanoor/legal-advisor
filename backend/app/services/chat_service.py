# app/services/chat_service.py

import uuid
import sys
import os
from flask import jsonify
from app.extensions import db
from app.models import ChatSession, ChatMessage, MessageResource

# Correctly import the RAG system components
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from src.config import load_config
from src.rag_system import ArabicRAGSystem

class ChatService:
    def __init__(self):
        # Your existing RAG system initialization remains the same
        self.rag_systems = {}
        self.configs = {}

    def get_rag_system(self, language: str = 'ar', reasoning: bool = False):
        """Get or create RAG system for specified language and reasoning mode."""
        if language not in self.rag_systems:
            self.rag_systems[language] = {}
            self.configs[language] = {}

        if reasoning not in self.rag_systems[language]:
            self.configs[language][reasoning] = load_config(language, reasoning)
            self.rag_systems[language][reasoning] = ArabicRAGSystem(self.configs[language][reasoning])

        return self.rag_systems[language][reasoning]

    # --- NEW DATABASE-DRIVEN METHODS ---

    def get_sessions_for_user(self, user_id: str):
        """Fetches all chat sessions for a given user from the database."""
        user_uuid = uuid.UUID(user_id)
        sessions = ChatSession.query.filter_by(user_id=user_uuid).order_by(ChatSession.updated_at.desc()).all()
        return sessions

    def get_session_by_id(self, session_id: str, user_id: str):
        """Fetches a single chat session, ensuring it belongs to the user."""
        session_uuid = uuid.UUID(session_id)
        user_uuid = uuid.UUID(user_id)
        session = ChatSession.query.filter_by(id=session_uuid, user_id=user_uuid).first()
        return session

    def delete_session_by_id(self, session_id: str, user_id: str) -> bool:
        """Deletes a session from the database if it belongs to the user."""
        session = self.get_session_by_id(session_id, user_id)
        if session:
            db.session.delete(session)
            db.session.commit()
            return True
        return False

    def _get_history_for_rag(self, session: ChatSession):
        """Formats the chat history from the database for the RAG system."""
        history = []
        # The RAG system expects a list of tuples: (user_message, assistant_response)
        user_msgs = [msg for msg in session.messages if msg.role == 'user']
        assistant_msgs = [msg for msg in session.messages if msg.role == 'assistant']
        
        # Pair them up
        for i in range(len(user_msgs)):
            user_msg = user_msgs[i].content
            assistant_msg = assistant_msgs[i].content if i < len(assistant_msgs) else ""
            history.append((user_msg, assistant_msg))
            
        return history

    def add_message_to_session(self, session_id: str, user_id: str, user_message_content: str, options: dict):
        """Adds a user message, gets an assistant response, and saves both to the DB."""
        session = self.get_session_by_id(session_id, user_id)
        if not session:
            return None, "Session not found or access denied"

        # 1. Save the user's message
        user_message = ChatMessage(session_id=session.id, role='user', content=user_message_content)
        db.session.add(user_message)
        db.session.flush() # We need to flush to include this message in the history query
        
        # 2. Prepare history for the RAG system from the database
        history = self._get_history_for_rag(session)
        history.append((user_message_content, '')) # Add the current question

        # 3. Get the assistant's response using your existing logic
        rag_system = self.get_rag_system(
            language=options.get('language', 'ar'),
            reasoning=options.get('reasoning', False)
        )
        response_data = rag_system.query(user_message_content, history[:-1]) # Pass history without the current question
        
        # 4. Save the assistant's message
        assistant_message = ChatMessage(session_id=session.id, role='assistant', content=response_data['answer'])
        db.session.add(assistant_message)
        db.session.flush() # Flush to get an ID for the assistant_message

        # 5. Save resources, using the corrected column name 'resource_metadata'
        for doc in response_data.get("source_documents", []):
            resource = MessageResource(
                message_id=assistant_message.id,
                content=doc.page_content,
                resource_metadata=doc.metadata
            )
            db.session.add(resource)
            
        db.session.commit()
        return assistant_message, None

    def start_new_session(self, user_id: str, first_message_content: str, options: dict):
        """Starts a new session, gets the first response, and saves everything to the DB."""
        user_uuid = uuid.UUID(user_id)
        
        new_session = ChatSession(
            user_id=user_uuid,
            title=first_message_content[:120]
        )
        db.session.add(new_session)
        
        user_message = ChatMessage(session=new_session, role='user', content=first_message_content)
        db.session.add(user_message)
        
        rag_system = self.get_rag_system(
            language=options.get('language', 'ar'),
            reasoning=options.get('reasoning', False)
        )
        # There is no history for the first message
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
        return new_session, None