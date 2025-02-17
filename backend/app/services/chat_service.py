# app/services/chat_service.py
from dataclasses import dataclass, asdict
from typing import Optional, Dict, List, Tuple
from flask import jsonify
import sys
import os
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.config import load_config
from src.rag_system import ArabicRAGSystem

load_dotenv()   

@dataclass
class ChatResponse:
    """Structure for chat response"""
    answer: str
    sources: list
    error: Optional[str] = None

class ChatService:
    def __init__(self):
        self.rag_systems: Dict[str, Dict[bool, ArabicRAGSystem]] = {}
        self.chat_histories: Dict[str, List[Tuple[str, str]]] = {}
        self.configs: Dict[str, Dict[bool, dict]] = {}

    def get_system_key(self, language: str, reasoning: bool) -> str:
        """Generate a unique key for the language-reasoning combination"""
        return f"{language}_{reasoning}"

    def get_rag_system(self, language: str, reasoning: bool = False) -> ArabicRAGSystem:
        """Get or create RAG system for specified language and reasoning mode"""
        if language not in self.rag_systems:
            self.rag_systems[language] = {}
            self.configs[language] = {}

        if reasoning not in self.rag_systems[language]:
            self.configs[language][reasoning] = load_config(language, reasoning)
            self.rag_systems[language][reasoning] = ArabicRAGSystem(self.configs[language][reasoning])

        return self.rag_systems[language][reasoning]

    def process_chat(self, data: dict):
        """Process chat message and return response"""
        message = data.get('message')
        session_id = data.get('sessionId', 'default')
        language = data.get('language', 'ar')
        reasoning = data.get('reasoning', False)

        if not message:
            return jsonify({"error": "No message provided"}), 400

        rag_system = self.get_rag_system(language, reasoning)

        if session_id not in self.chat_histories:
            self.chat_histories[session_id] = []

        response = rag_system.query(
            message,
            self.chat_histories[session_id]
        )

        self.chat_histories[session_id].append((message, response["answer"]))

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
        return jsonify(asdict(chat_response))

    def get_history(self, session_id: str):
        """Get chat history for a session"""
        return jsonify(self.chat_histories.get(session_id, []))

    def clear_history(self, session_id: str):
        """Clear chat history for a session"""
        if session_id in self.chat_histories:
            self.chat_histories[session_id] = []
        return jsonify({"status": "success"})