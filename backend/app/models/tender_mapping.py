# app/models/tender_mapping.py

from dataclasses import dataclass
from typing import Dict, List, Any, Optional

@dataclass
class TenderAttribute:
    """Structure for tender attribute"""
    name: str
    value: str

@dataclass
class TenderType:
    """Structure for matched tender type"""
    name: str
    attributes: List[TenderAttribute]
    description: Optional[str] = None

@dataclass
class MappingRule:
    """Structure for mapping rule"""
    conditions: Dict[str, str]
    matched_tender_type: str
    attributes: Dict[str, str]

@dataclass
class TenderCategoryOptions:
    """Structure for tender category options"""
    category: str
    options: List[str]

@dataclass
class TenderMappingResult:
    """Structure for tender mapping result"""
    matched_tender_type: TenderType
    confidence_score: float
    alternative_types: Optional[List[TenderType]] = None
    message: Optional[str] = None