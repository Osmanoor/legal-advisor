import os
from dataclasses import dataclass
from typing import Literal
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('..','.env')
load_dotenv(dotenv_path)

@dataclass
class RAGConfig:
    """Configuration settings for the RAG system."""
    openai_api_key: str
    lang: Literal["ar", "en"] = "ar"  # Default to Arabic
    embedding_model: str = "text-embedding-3-small"
    llm_model: str = "gpt-4-turbo-preview"
    chunk_size: int = 500
    chunk_overlap: int = 50
    temperature: float = 0.3

def load_config(language= 'ar') -> RAGConfig:
    """Load configuration from environment variables."""
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    
    # Get language from environment variable, default to Arabic if not set
    lang = language
    if lang not in ["ar", "en"]:
        raise ValueError("RAG_LANGUAGE must be either 'ar' or 'en'")
    
    return RAGConfig(
        openai_api_key=openai_api_key,
        lang=lang
    )