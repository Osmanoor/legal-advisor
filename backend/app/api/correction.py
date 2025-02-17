# api/correction.py
from flask import Blueprint, request, jsonify
from app.services.correction_service import CorrectionService

correction_bp = Blueprint('correction', __name__)
correction_service = CorrectionService()

@correction_bp.route('', methods=['POST'])
def correct_text():
    """Handle text correction requests"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        language = data.get('language', 'en')
        
        if not text:
            return jsonify({
                'error': 'Text is required',
                'status': 'error'
            }), 400
            
        if language not in ['en', 'ar']:
            return jsonify({
                'error': 'Invalid language. Must be either "en" or "ar"',
                'status': 'error'
            }), 400
            
        result = correction_service.correct_text(text, language)
        
        if 'error' in result:
            return jsonify(result), 500
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500