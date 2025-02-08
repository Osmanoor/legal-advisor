# app/services/search_service.py
from typing import List, Dict, Optional
from data.search_engine import SearchEngine

class SearchService:
    def __init__(self):
        """Initialize search service with search engine"""
        self.search_engine = SearchEngine()

    def perform_search(self, query: str, doc_type: str = 'Both') -> List[Dict]:
        """
        Perform search operation using the search engine.
        
        Args:
            query (str): Search query text
            doc_type (str): Type of documents to search ('System', 'Regulation', 'Both')
            
        Returns:
            List[Dict]: List of search results
        """
        return self.search_engine.search(
            query_text=query,
            doc_type=doc_type
        )