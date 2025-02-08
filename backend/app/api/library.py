# app/api/library.py
from flask import Blueprint, request, jsonify, send_file
from app.services.library_service import LibraryService
from app.utils.auth import require_auth

library_bp = Blueprint('library', __name__)
library_service = LibraryService()

@library_bp.route('/list-folder-contents', methods=['GET'])
def list_folder_contents():
    """List contents of a folder"""
    print("hellooooo")
    folder_id = request.args.get('folder_id', None)
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')
    
    result = library_service.list_contents(folder_id, sort_by, sort_order)
    return jsonify(result)

@library_bp.route('/search-files', methods=['GET'])
def search_files():
    """Search for files with various filters"""
    params = {
        'query': request.args.get('query', ''),
        'folder_id': request.args.get('folder_id', None),
        'recursive': request.args.get('recursive', 'true').lower() == 'true',
        'file_type': request.args.get('file_type', None),
        'min_size': request.args.get('min_size', None),
        'max_size': request.args.get('max_size', None)
    }
    
    if params['min_size']:
        params['min_size'] = int(params['min_size'])
    if params['max_size']:
        params['max_size'] = int(params['max_size'])
        
    result = library_service.search_files(**params)
    return jsonify(result)

@library_bp.route('/get-download-url', methods=['POST'])
def get_download_url():
    """Get download URL for a file"""
    try:
        data = request.json
        file_id = data.get('file_id')
        
        if not file_id:
            return jsonify({'error': 'file_id is required'}), 400
            
        result = library_service.get_download_url(file_id)
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in download URL endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@library_bp.route('/download-file', methods=['POST'])
def download_file():
    """Download a file"""
    try:
        data = request.json
        file_id = data.get('file_id')
        
        if not file_id:
            return jsonify({'error': 'file_id is required'}), 400
            
        file_io, file_name, mime_type = library_service.download_file(file_id)
        
        if file_io is None:
            if isinstance(mime_type, dict) and 'error' in mime_type:
                return jsonify(mime_type), 500
            return jsonify({'error': 'Failed to download file'}), 500
            
        response = send_file(
            file_io,
            mimetype=mime_type,
            as_attachment=True,
            download_name=file_name
        )
        
        # Add headers to prevent caching
        response.headers.update({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        })
        
        return response
        
    except Exception as e:
        print(f"Error in download endpoint: {str(e)}")
        return jsonify({'error': 'Server error during download'}), 500

@library_bp.route('/view-file', methods=['POST'])
def view_file():
    """View file content"""
    try:
        data = request.get_json()
        file_id = data.get('file_id')
        
        if not file_id:
            return jsonify({'error': 'file_id is required'}), 400
            
        result = library_service.get_file_content(file_id)
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in view file endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500