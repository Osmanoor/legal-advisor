from flask import Flask, jsonify, request
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
import os

app = Flask(__name__)

class DriveLibrary:
    """Google Drive Library for Flask Backend"""

    def __init__(self, folder_id):
        self.FOLDER_ID = folder_id
        self.service = self._authenticate_drive()

    def _authenticate_drive(self):
        """Authenticate with Google Drive using a service account"""
        scopes = ['https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            'service_account_credentials.json', scopes
        )
        return build('drive', 'v3', credentials=credentials)

    def list_folder_contents(self, folder_id=None, sort_by='name', sort_order='asc'):
        """List contents of a folder with sorting"""
        try:
            folder_id = folder_id or self.FOLDER_ID
            query = f"'{folder_id}' in parents"
            order_by = f"{sort_by} {sort_order}"
            results = self.service.files().list(
                q=query,
                pageSize=1000,
                orderBy=order_by,
                fields="files(id, name, mimeType, createdTime, modifiedTime, size)"
            ).execute()
            return results.get('files', [])
        except Exception as e:
            return {'error': str(e)}

    def search_files(self, query, folder_id=None, recursive=False, file_type=None, min_size=None, max_size=None):
        """Advanced search with multiple criteria"""
        try:
            folder_id = folder_id or self.FOLDER_ID
            query_parts = [f"'{folder_id}' in parents"]

            if query:
                query_parts.append(f"name contains '{query}'")

            if file_type:
                if file_type == 'folder':
                    query_parts.append("mimeType = 'application/vnd.google-apps.folder'")
                elif file_type == 'pdf':
                    query_parts.append("mimeType = 'application/pdf'")

            if min_size:
                query_parts.append(f"size >= {min_size}")
            if max_size:
                query_parts.append(f"size <= {max_size}")

            full_query = " and ".join(query_parts)

            results = []
            response = self.service.files().list(
                q=full_query,
                pageSize=1000,
                fields="files(id, name, mimeType, createdTime, modifiedTime, size, parents)"
            ).execute()

            results.extend(response.get('files', []))

            if recursive:
                subfolders = [f for f in results if f['mimeType'] == 'application/vnd.google-apps.folder']
                for folder in subfolders:
                    subfolder_results = self.search_files(
                        query, folder['id'], recursive=True,
                        file_type=file_type, min_size=min_size, max_size=max_size
                    )
                    results.extend(subfolder_results)

            return results
        except Exception as e:
            return {'error': str(e)}

    def download_file(self, file_id, destination_path):
        """Download a file from Google Drive"""
        try:
            request = self.service.files().get_media(fileId=file_id)
            with open(destination_path, 'wb') as f:
                downloader = MediaIoBaseDownload(f, request)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
            return {'success': True, 'message': 'File downloaded successfully'}
        except Exception as e:
            return {'error': str(e)}

# Initialize Drive Library with your Google Drive folder ID
drive_library = DriveLibrary(folder_id="1MbGmql3amv-RJfrQs-LlcTMhXBJf-c3P")

@app.route('/list-folder-contents', methods=['GET'])
def list_folder_contents():
    folder_id = request.args.get('folder_id', None)
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')
    result = drive_library.list_folder_contents(folder_id, sort_by, sort_order)
    return jsonify(result)

@app.route('/search-files', methods=['GET'])
def search_files():
    query = request.args.get('query', '')
    folder_id = request.args.get('folder_id', None)
    recursive = request.args.get('recursive', 'false').lower() == 'true'
    file_type = request.args.get('file_type', None)
    min_size = request.args.get('min_size', None)
    max_size = request.args.get('max_size', None)

    result = drive_library.search_files(
        query=query,
        folder_id=folder_id,
        recursive=recursive,
        file_type=file_type,
        min_size=int(min_size) if min_size else None,
        max_size=int(max_size) if max_size else None
    )
    return jsonify(result)

@app.route('/download-file', methods=['POST'])
def download_file():
    data = request.json
    file_id = data.get('file_id')
    destination_path = data.get('destination_path')

    if not file_id or not destination_path:
        return jsonify({'error': 'file_id and destination_path are required'}), 400

    result = drive_library.download_file(file_id, destination_path)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
