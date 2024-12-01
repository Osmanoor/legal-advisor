from typing import Dict, Any, Optional
from .config import RAGConfig
from .vector_store import VectorStoreHandler
from .qa_chain import QAChainHandler
from .templates import get_collection_name, get_persist_directory

class ArabicRAGSystem:
    """Main RAG system using pre-generated database with language support."""
    
    def __init__(self, config: RAGConfig):
        """Initialize the RAG system with configuration."""
        self.config = config
        
        # Get language-specific paths and names
        persist_directory = get_persist_directory(config.lang)
        collection_name = get_collection_name(config.lang)
        
        # Initialize components with language support
        self.vector_handler = VectorStoreHandler(
            persist_directory=persist_directory,
            collection_name=collection_name,
            openai_api_key=config.openai_api_key,
            lang=config.lang
        )
        
        self.qa_handler = QAChainHandler(
            openai_api_key=config.openai_api_key,
            model_name=config.llm_model,
            temperature=config.temperature,
            lang=config.lang
        )
        
        # Setup QA chain with loaded vectorstore
        self.qa_handler.setup_chain(self.vector_handler.get_vectorstore())

    def query(self, question: str, chat_history: Optional[list] = None) -> Dict[str, Any]:
        """Process a query and return the response."""
        return self.qa_handler.query(question, chat_history)