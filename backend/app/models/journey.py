# app/models/journey.py

from dataclasses import dataclass
from typing import List, Dict, Any, Optional

@dataclass
class JourneyResource:
    """Structure for journey resource metadata"""
    id: str
    name: str
    description: Optional[str]
    type: str
    mime_type: str
    size: int
    created_time: str
    modified_time: str

@dataclass
class JourneyLevel:
    """Structure for journey level"""
    id: str
    name: str
    description: str
    order: int
    resources: List[JourneyResource]

@dataclass
class Journey:
    """Structure for complete journey"""
    levels: List[JourneyLevel]
    total_levels: int