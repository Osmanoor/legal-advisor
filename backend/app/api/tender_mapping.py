# app/api/tender_mapping.py

from flask import Blueprint, request, jsonify
from app.services.tender_mapping_service import TenderMappingService
from app.models.tender_mapping import MappingRule
from dataclasses import asdict

tender_mapping_bp = Blueprint('tender_mapping', __name__)
tender_mapping_service = TenderMappingService()

@tender_mapping_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories and their options for dropdown menus"""
    try:
        categories = tender_mapping_service.get_categories()
        return jsonify([asdict(category) for category in categories])
    except Exception as e:
        print(f"Error getting categories: {str(e)}")
        return jsonify({"error": str(e)}), 500

@tender_mapping_bp.route('/map', methods=['POST'])
def map_tender_type():
    """Map inputs to tender type"""
    try:
        data = request.get_json()
        if not isinstance(data, dict):
            return jsonify({"error": "Invalid input: expected dictionary"}), 400
        
        result = tender_mapping_service.map_tender_type(data)
        return jsonify(asdict(result))
    except Exception as e:
        print(f"Error mapping tender: {str(e)}")
        return jsonify({"error": str(e)}), 500

@tender_mapping_bp.route('/rules', methods=['POST'])
def save_mapping_rule():
    """Add a new mapping rule"""
    try:
        data = request.get_json()
        if not all(k in data for k in ['conditions', 'matched_tender_type', 'attributes']):
            return jsonify({"error": "Missing required fields"}), 400
        
        rule = MappingRule(
            conditions=data['conditions'],
            matched_tender_type=data['matched_tender_type'],
            attributes=data['attributes']
        )
        
        success = tender_mapping_service.save_mapping_rule(rule)
        if success:
            return jsonify({"message": "Rule saved successfully"})
        else:
            return jsonify({"error": "Failed to save rule"}), 500
    except Exception as e:
        print(f"Error saving rule: {str(e)}")
        return jsonify({"error": str(e)}), 500