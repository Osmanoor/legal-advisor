# api/correction.py
from flask import Blueprint, request, jsonify
from app.services.correction_service import CorrectionService
from app.utils.auth_decorators import permission_required, usage_limited 

correction_bp = Blueprint('correction', __name__)
correction_service = CorrectionService()

@correction_bp.route('', methods=['POST'])
@permission_required('access_text_corrector')
@usage_limited('text_corrections_per_day')
def correct_text():
    """Handle text correction requests"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        language = data.get('language', 'en')
        
        if not text:
            return jsonify({'error': 'Text is required', 'status': 'error'}), 400
        if language not in ['en', 'ar']:
            return jsonify({'error': 'Invalid language. Must be "en" or "ar"'}), 400
            
        result = correction_service.correct_text(text, language)
        
        if 'error' in result:
            return jsonify(result), 500
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500