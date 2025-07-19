import os
import mimetypes
import base64
from datetime import datetime
import io
from pathlib import Path
import shutil

class LocalDriveLibrary:
    """Local File System Library that mirrors Google Drive functionality"""

    def __init__(self, root_folder_path):
        """Initialize with the path to the root folder containing all files"""
        self.root_folder_path = os.path.abspath(root_folder_path)
        # if not os.path.exists(self.root_folder_path):
        #     raise ValueError(f"Root folder path does not exist: {self.root_folder_path}")

    def _get_file_info(self, file_path):
        """Get file information similar to Google Drive format"""
        stats = os.stat(file_path)
        relative_path = os.path.relpath(file_path, self.root_folder_path)
        is_folder = os.path.isdir(file_path)
        
        mime_type = ('application/vnd.google-apps.folder' if is_folder 
                    else mimetypes.guess_type(file_path)[0] or 'application/octet-stream')
        
        return {
            'id': relative_path,  # Using relative path as ID
            'name': os.path.basename(file_path),
            'mimeType': mime_type,
            'size': str(stats.st_size) if not is_folder else '0',
            'createdTime': datetime.fromtimestamp(stats.st_ctime).isoformat(),
            'modifiedTime': datetime.fromtimestamp(stats.st_mtime).isoformat()
        }

    def _get_absolute_path(self, file_id):
        """Convert file_id (relative path) to absolute path"""
        if not file_id:
            return self.root_folder_path
        return os.path.join(self.root_folder_path, file_id)

    def list_folder_contents(self, folder_id=None, sort_by='name', sort_order='asc'):
        """List contents of a folder"""
        try:
            folder_path = self._get_absolute_path(folder_id)
            if not os.path.exists(folder_path):
                return []

            items = []
            with os.scandir(folder_path) as entries:
                for entry in entries:
                    items.append(self._get_file_info(entry.path))

            # Sort items
            reverse = sort_order.lower() == 'desc'
            if sort_by == 'name':
                items.sort(key=lambda x: x['name'].lower(), reverse=reverse)
            elif sort_by in ['createdTime', 'modifiedTime', 'size']:
                items.sort(key=lambda x: x[sort_by], reverse=reverse)

            return items

        except Exception as e:
            print(f"Error listing folder contents: {str(e)}")
            return []

    def search_files(self, query, folder_id=None, recursive=True, file_type=None, min_size=None, max_size=None):
        """Search for files matching criteria"""
        try:
            start_path = self._get_absolute_path(folder_id)
            results = []

            def should_include_file(file_info):
                if query.lower() not in file_info['name'].lower():
                    return False
                
                if file_type and file_info['mimeType'] != f'application/{file_type}':
                    return False
                
                if not file_info['mimeType'] == 'application/vnd.google-apps.folder':
                    size = int(file_info['size'])
                    if min_size and size < min_size:
                        return False
                    if max_size and size > max_size:
                        return False
                
                return True

            if recursive:
                for root, dirs, files in os.walk(start_path):
                    for item in dirs + files:
                        file_info = self._get_file_info(os.path.join(root, item))
                        if should_include_file(file_info):
                            results.append(file_info)
            else:
                with os.scandir(start_path) as entries:
                    for entry in entries:
                        file_info = self._get_file_info(entry.path)
                        if should_include_file(file_info):
                            results.append(file_info)

            return results

        except Exception as e:
            print(f"Error searching files: {str(e)}")
            return []

    def download_file(self, file_id):
        """Get file for download"""
        try:
            file_path = self._get_absolute_path(file_id)
            if not os.path.isfile(file_path):
                return None, None, {'error': 'File not found'}

            mime_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'
            return open(file_path, 'rb'), os.path.basename(file_path), mime_type

        except Exception as e:
            print(f"Error preparing download: {str(e)}")
            return None, None, {'error': str(e)}

    def get_file_content(self, file_id):
        """Get file content and metadata for viewing"""
        try:
            file_path = self._get_absolute_path(file_id)
            if not os.path.isfile(file_path):
                return {'error': 'File not found'}

            mime_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'
            
            # List of viewable MIME types
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
            
            # Read and encode file content
            with open(file_path, 'rb') as f:
                content = f.read()
                encoded_content = base64.b64encode(content).decode('utf-8')

            return {
                'name': os.path.basename(file_path),
                'mimeType': mime_type,
                'content': encoded_content,
                'isViewable': is_viewable,
                'originalName': os.path.basename(file_path)
            }

        except Exception as e:
            print(f"Error getting file content: {str(e)}")
            return {'error': str(e)}