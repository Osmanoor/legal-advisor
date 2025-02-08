# app/api/search.py
from flask import Blueprint, request, jsonify
from app.services.search_service import SearchService
from app.utils.validators import validate_search_params

search_bp = Blueprint('search', __name__)
search_service = SearchService()

@search_bp.route('', methods=['GET'])
def search():
    """
    Handle search requests with query parameters.
    
    Query Parameters:
    - query (required): Search keywords
    - type (optional): Resource type filter ('System', 'Regulation', 'Both')
    
    Returns:
    - JSON response with search results or error message
    """
    search_query = request.args.get('query', '').strip()
    search_type = request.args.get('type', 'Both')

    # Validate parameters
    validation_error = validate_search_params(search_query, search_type)
    if validation_error:
        return jsonify({'error': validation_error}), 400

    try:
        results = search_service.perform_search(search_query, search_type)
        return jsonify({'data': results}), 200
    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({
            'error': 'An error occurred while processing your search'
        }), 500