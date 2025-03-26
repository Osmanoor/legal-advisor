# app/services/journey_service.py

import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
import mimetypes
from flask import current_app, send_file
import io
import base64
from app.config import Config

from app.models.journey import JourneyResource, JourneyLevel, Journey

class JourneyService:
    def __init__(self):
        """Initialize journey service with path to journey resources"""
        self.journey_root = Config.Journey_DIR
        # Create journey directory if it doesn't exist
        os.makedirs(self.journey_root, exist_ok=True)
        
    def _get_level_info(self, level_id: str) -> Dict[str, Any]:
        """Get level metadata from the info.json file in the level directory"""
        level_path = os.path.join(self.journey_root, level_id)
        info_path = os.path.join(level_path, 'info.json')
        
        if not os.path.exists(info_path):
            # Create default info.json if it doesn't exist
            default_info = {
                "name": f"Level {level_id}",
                "description": f"Description for level {level_id}",
                "order": int(level_id) if level_id.isdigit() else 0
            }
            
            os.makedirs(level_path, exist_ok=True)
            with open(info_path, 'w', encoding='utf-8') as f:
                json.dump(default_info, f, ensure_ascii=False, indent=2)
            
            return default_info
        
        with open(info_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _get_resource_info(self, file_path: str, level_id: str, resource_id: str) -> JourneyResource:
        """Extract resource metadata"""
        stats = os.stat(file_path)
        mime_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'
        
        return JourneyResource(
            id=resource_id,
            name=os.path.basename(file_path),
            description=None,  # Could be stored in a separate metadata file
            type=os.path.splitext(file_path)[1][1:],
            mime_type=mime_type,
            size=stats.st_size,
            created_time=datetime.fromtimestamp(stats.st_ctime).isoformat(),
            modified_time=datetime.fromtimestamp(stats.st_mtime).isoformat()
        )

    def get_all_levels(self) -> List[Dict[str, Any]]:
        """Get all journey levels with basic information"""
        if not os.path.exists(self.journey_root):
            return []
        
        levels = []
        for item in os.listdir(self.journey_root):
            level_path = os.path.join(self.journey_root, item)
            if os.path.isdir(level_path):
                try:
                    level_info = self._get_level_info(item)
                    levels.append({
                        "id": item,
                        "name": level_info.get("name", f"Level {item}"),
                        "description": level_info.get("description", ""),
                        "order": level_info.get("order", 0)
                    })
                except Exception as e:
                    current_app.logger.error(f"Error loading level {item}: {str(e)}")
                    continue
        
        # Sort levels by order
        levels.sort(key=lambda x: x["order"])
        return levels

    def get_level_resources(self, level_id: str) -> Dict[str, Any]:
        """Get all resources for a specific level"""
        level_path = os.path.join(self.journey_root, level_id)
        if not os.path.exists(level_path):
            return {"error": f"Level {level_id} not found"}
        
        level_info = self._get_level_info(level_id)
        resources = []
        
        for item in os.listdir(level_path):
            # Skip info.json
            if item == 'info.json':
                continue
                
            file_path = os.path.join(level_path, item)
            if os.path.isfile(file_path):
                try:
                    resource_info = self._get_resource_info(file_path, level_id, item)
                    resources.append(resource_info)
                except Exception as e:
                    current_app.logger.error(f"Error loading resource {item}: {str(e)}")
                    continue
        
        return {
            "id": level_id,
            "name": level_info.get("name", f"Level {level_id}"),
            "description": level_info.get("description", ""),
            "order": level_info.get("order", 0),
            "resources": resources
        }

    def get_resource(self, level_id: str, resource_id: str) -> Dict[str, Any]:
        """Get a specific resource for viewing/downloading"""
        resource_path = os.path.join(self.journey_root, level_id, resource_id)
        if not os.path.exists(resource_path):
            return {"error": f"Resource {resource_id} not found in level {level_id}"}
        
        mime_type = mimetypes.guess_type(resource_path)[0] or 'application/octet-stream'
            
        # For viewable files, encode content as base64
        viewable_types = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/svg+xml',
            'text/plain',
            'text/html',
        ]
        
        is_viewable = mime_type in viewable_types
        
        try:
            with open(resource_path, 'rb') as f:
                content = f.read()
                encoded_content = base64.b64encode(content).decode('utf-8')
            
            return {
                'name': os.path.basename(resource_path),
                'mimeType': mime_type,
                'content': encoded_content,
                'isViewable': is_viewable,
                'originalName': os.path.basename(resource_path)
            }
        except Exception as e:
            current_app.logger.error(f"Error getting resource content: {str(e)}")
            return {"error": str(e)}

    def download_resource(self, level_id: str, resource_id: str):
        """Get resource as a file for download"""
        resource_path = os.path.join(self.journey_root, level_id, resource_id)
        if not os.path.exists(resource_path):
            return None, None, {"error": f"Resource {resource_id} not found in level {level_id}"}
        
        mime_type = mimetypes.guess_type(resource_path)[0] or 'application/octet-stream'
        return open(resource_path, 'rb'), os.path.basename(resource_path), mime_type