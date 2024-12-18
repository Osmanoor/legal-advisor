from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
from googleapiclient.http import MediaIoBaseDownload
import io

app = Flask(__name__)
CORS(app)

class DriveLibrary:
    """Google Drive Library for Flask Backend"""

    def __init__(self, folder_id):
        self.FOLDER_ID = folder_id
        self.service = self._authenticate_drive()

    def _authenticate_drive(self):
        """Authenticate with Google Drive using a service account"""
        scopes = ['https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            'backend\\service_account_credentials.json', scopes
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

# Initialize Drive Library with your Google Drive folder ID
drive_library = DriveLibrary(folder_id="1MbGmql3amv-RJfrQs-LlcTMhXBJf-c3P")

@app.route('/list-folder-contents', methods=['GET'])
def list_folder_contents():
    folder_id = request.args.get('folder_id', None)
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')
    result = drive_library.list_folder_contents(folder_id, sort_by, sort_order)
    print(result)
    return jsonify(result)

@app.route('/search-files', methods=['GET'])
def search_files():
    query = request.args.get('query', '')
    folder_id = request.args.get('folder_id', None)
    recursive = request.args.get('recursive', 'true').lower() == 'true'
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
    print(result)
    return jsonify(result)

@app.route('/get-download-url', methods=['POST'])
def get_download_url():
    try:
        data = request.json
        file_id = data.get('file_id')

        if not file_id:
            return jsonify({'error': 'file_id is required'}), 400

        result = drive_library.download_file(file_id)
        
        if 'error' in result:
            return jsonify(result), 500

        return jsonify(result)

    except Exception as e:
        print(f"Error in download URL endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/download-file', methods=['POST'])
def download_file():
    try:
        data = request.json
        file_id = data.get('file_id')

        if not file_id:
            return jsonify({'error': 'file_id is required'}), 400

        file_io, file_name, mime_type = drive_library.download_file(file_id)
        
        if file_io is None:
            # If mime_type is a dict, it contains our error message
            if isinstance(mime_type, dict) and 'error' in mime_type:
                return jsonify(mime_type), 500
            return jsonify({'error': 'Failed to download file'}), 500

        # Add headers to prevent caching
        response = send_file(
            file_io,
            mimetype=mime_type,
            as_attachment=True,
            download_name=file_name
        )
        
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        
        return response

    except Exception as e:
        print(f"Error in download endpoint: {str(e)}")
        return jsonify({'error': 'Server error during download'}), 500

if __name__ == '__main__':
    app.run(debug=True)