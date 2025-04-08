# app/api/tender_mapping.py

from flask import Blueprint, request, jsonify
from app.services.tender_mapping_service import TenderMappingService

tender_mapping_bp = Blueprint('tender_mapping', __name__)
tender_mapping_service = TenderMappingService()

@tender_mapping_bp.route('/work-types', methods=['GET'])
def get_work_types():
    """Get all work types for dropdown menu"""
    try:
        work_types = tender_mapping_service.get_work_types()
        return jsonify(work_types)
    except Exception as e:
        print(f"Error getting work types: {str(e)}")
        return jsonify({"error": str(e)}), 500

@tender_mapping_bp.route('/calculate', methods=['POST'])
def calculate_procurement():
    """Calculate procurement details based on inputs"""
    try:
        data = request.get_json()
        if not isinstance(data, dict):
            return jsonify({"error": "Invalid input: expected dictionary"}), 400
        
        # Validate required fields
        required_fields = ['work_type', 'budget', 'start_date', 'project_duration']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        result = tender_mapping_service.calculate_procurement(data)
        print(result)
        if "error" in result:
            return jsonify({"error": result["error"]}), 500
            
        return jsonify(result)
    except Exception as e:
        print(f"Error calculating procurement: {str(e)}")
        return jsonify({"error": str(e)}), 500