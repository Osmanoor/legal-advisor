# app/api/journey.py

from flask import Blueprint, request, jsonify, send_file
from app.services.journey_service import JourneyService

journey_bp = Blueprint('journey', __name__)
journey_service = JourneyService()

@journey_bp.route('levels', methods=['GET'])
def get_all_levels():
    """Get all journey levels"""
    try:
        levels = journey_service.get_all_levels()
        return jsonify(levels)
    except Exception as e:
        print(f"Error fetching journey levels: {str(e)}")
        return jsonify({"error": str(e)}), 500

@journey_bp.route('/levels/<level_id>', methods=['GET'])
def get_level_resources(level_id):
    """Get resources for a specific level"""
    try:
        level_data = journey_service.get_level_resources(level_id)
        if "error" in level_data:
            return jsonify(level_data), 404
        return jsonify(level_data)
    except Exception as e:
        print(f"Error fetching level resources: {str(e)}")
        return jsonify({"error": str(e)}), 500

@journey_bp.route('/levels/<level_id>/resources/<resource_id>/view', methods=['GET'])
def view_resource(level_id, resource_id):
    """View a specific resource"""
    try:
        result = journey_service.get_resource(level_id, resource_id)
        if "error" in result:
            return jsonify(result), 404
        return jsonify(result)
    except Exception as e:
        print(f"Error viewing resource: {str(e)}")
        return jsonify({"error": str(e)}), 500

@journey_bp.route('/levels/<level_id>/resources/<resource_id>/download', methods=['GET'])
def download_resource(level_id, resource_id):
    """Download a specific resource"""
    try:
        file_io, file_name, mime_type = journey_service.download_resource(level_id, resource_id)
        
        if file_io is None:
            if isinstance(mime_type, dict) and 'error' in mime_type:
                return jsonify(mime_type), 404
            return jsonify({'error': 'Failed to download resource'}), 500
        
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
        print(f"Error downloading resource: {str(e)}")
        return jsonify({"error": str(e)}), 500