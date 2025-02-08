from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class SearchResult:
    """Structure for search results"""
    title: str
    content: str
    type: str
    relevance: float
    metadata: Dict[str, Any]

@dataclass
class SearchResponse:
    """Structure for search response"""
    results: List[SearchResult]
    total_count: int
    page: int
    page_size: int