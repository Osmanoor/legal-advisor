from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
from googleapiclient.http import MediaIoBaseDownload
import io
import sys
import os

class DriveLibrary:
    """Google Drive Library for Flask Backend"""

    def __init__(self, folder_id, credentials_path=None):
        self.FOLDER_ID = folder_id
        self.credentials_path = credentials_path or os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        if not self.credentials_path:
            raise ValueError("Credentials path must be provided either through constructor or GOOGLE_APPLICATION_CREDENTIALS environment variable")
        self.service = self._authenticate_drive()

    def _authenticate_drive(self):
        """Authenticate with Google Drive using a service account"""
        scopes = ['https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            self.credentials_path, scopes
        )
        return build('drive', 'v3', credentials=credentials)

    def list_folder_contents(self, folder_id=None, sort_by='name', sort_order='asc'):
        """List contents of a folder with sorting"""
        try:
            folder_id = folder_id or self.FOLDER_ID
            
            # Build the query
            query = f"'{folder_id}' in parents"
            
            # Build the sort order string
            order_by = f"{sort_by} {sort_order}"
            
            results = self.service.files().list(
                q=query,
                pageSize=1000,
                orderBy=order_by,
                fields="files(id, name, mimeType, createdTime, modifiedTime, size)"
            ).execute()
            
            return results.get('files', [])
            
        except Exception as e:
            print(f"Error listing folder contents: {str(e)}")
            return []

    def search_files(self, query, folder_id=None, recursive=True, file_type=None, min_size=None, max_size=None):
        """
        Advanced search with multiple criteria that recursively searches through all folders
        and subfolders for files matching the query.
        """
        try:
            folder_id = folder_id or self.FOLDER_ID
            results = []

            # First, get all items in the current folder
            folder_query = f"'{folder_id}' in parents"
            response = self.service.files().list(
                q=folder_query,
                pageSize=1000,
                fields="files(id, name, mimeType, createdTime, modifiedTime, size, parents)"
            ).execute()

            items = response.get('files', [])

            # Separate files and folders
            files = []
            subfolders = []
            for item in items:
                if item['mimeType'] == 'application/vnd.google-apps.folder':
                    subfolders.append(item)
                else:
                    files.append(item)

            # Apply search criteria to files
            for file in files:
                matches_criteria = True

                # Check name query
                if query and query.lower() not in file['name'].lower():
                    matches_criteria = False

                # Check file type
                if file_type:
                    if file_type == 'pdf' and file['mimeType'] != 'application/pdf':
                        matches_criteria = False

                # Check size constraints
                if 'size' in file:
                    size = int(file['size'])
                    if min_size and size < min_size:
                        matches_criteria = False
                    if max_size and size > max_size:
                        matches_criteria = False
                elif min_size:  # If size is required but not present
                    matches_criteria = False

                if matches_criteria:
                    results.append(file)

            # Recursively search through subfolders
            if recursive:
                for folder in subfolders:
                    subfolder_results = self.search_files(
                        query=query,
                        folder_id=folder['id'],
                        recursive=True,
                        file_type=file_type,
                        min_size=min_size,
                        max_size=max_size
                    )
                    if isinstance(subfolder_results, list):  # Ensure we got a valid result
                        results.extend(subfolder_results)

            return results
        except Exception as e:
            print(f"Error in search_files: {str(e)}")
            return {'error': str(e)}

    def download_file(self, file_id):
        """Generate a download URL for a Google Drive file"""
        try:
            # Get file metadata first to verify access and get filename
            file_metadata = self.service.files().get(
                fileId=file_id,
                fields="name, mimeType, webContentLink",
                supportsAllDrives=True
            ).execute()

            # Get the webContentLink (direct download URL)
            download_url = file_metadata.get('webContentLink')

            if not download_url:
                # If webContentLink is not available, generate a temporary URL
                request = self.service.files().get_media(fileId=file_id)
                token = self.credentials.get_access_token().access_token
                download_url = f"{request.uri}?alt=media&access_token={token}"

            return {
                'url': download_url,
                'name': file_metadata['name'],
                'mimeType': file_metadata['mimeType']
            }

        except Exception as e:
            print(f"Error generating download URL: {str(e)}")
            return {'error': str(e)}
