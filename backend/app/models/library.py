# app/models/library.py
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from datetime import datetime

@dataclass
class FileMetadata:
    """Structure for file metadata"""
    id: str
    name: str
    mime_type: str
    size: int
    created_time: datetime
    modified_time: datetime
    parent_folder_id: Optional[str]

@dataclass
class FolderContents:
    """Structure for folder contents"""
    files: List[FileMetadata]
    folders: List[Dict[str, Any]]
    parent_id: Optional[str]