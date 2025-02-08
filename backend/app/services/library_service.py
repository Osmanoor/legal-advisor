# app/services/library_service.py
from typing import Dict, Any, Tuple, Optional, BinaryIO
from app.config import Config
from LocalDriveLibrary import LocalDriveLibrary

class LibraryService:
    def __init__(self):
        """Initialize library service with drive library"""
        self.drive_library = LocalDriveLibrary(root_folder_path=Config.LIBRARY_ROOT_FOLDER)

    def list_contents(self, folder_id: Optional[str], sort_by: str, sort_order: str) -> Dict[str, Any]:
        """List contents of a folder with sorting options"""
        return self.drive_library.list_folder_contents(folder_id, sort_by, sort_order)

    def search_files(self, query: str, folder_id: Optional[str] = None, 
                    recursive: bool = True, file_type: Optional[str] = None,
                    min_size: Optional[int] = None, max_size: Optional[int] = None) -> Dict[str, Any]:
        """Search for files with various filters"""
        return self.drive_library.search_files(
            query=query,
            folder_id=folder_id,
            recursive=recursive,
            file_type=file_type,
            min_size=min_size,
            max_size=max_size
        )

    def get_download_url(self, file_id: str) -> Dict[str, Any]:
        """Get download URL for a file"""
        return self.drive_library.download_file(file_id)

    def download_file(self, file_id: str) -> Tuple[Optional[BinaryIO], str, str]:
        """Download a file and return file object, name, and mime type"""
        return self.drive_library.download_file(file_id)

    def get_file_content(self, file_id: str) -> Dict[str, Any]:
        """Get file content for viewing"""
        return self.drive_library.get_file_content(file_id)