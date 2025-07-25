# app/api/calculator.py

from flask import Blueprint, request, jsonify
from app.services.date_service import DateService

calculator_bp = Blueprint('calculator_api', __name__)

@calculator_bp.route('/convert-date', methods=['POST'])
def convert_date():
    data = request.get_json()
    date_str = data.get('date')
    from_calendar = data.get('from_calendar')

    if not date_str or not from_calendar:
        return jsonify({"error": "Missing 'date' or 'from_calendar' fields"}), 400

    result = DateService.convert_date(date_str, from_calendar)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 200

@calculator_bp.route('/date-difference', methods=['POST'])
def date_difference():
    data = request.get_json()
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    # --- MODIFIED: Get calendar, default to gregorian ---
    calendar = data.get('calendar', 'gregorian')

    if not start_date or not end_date:
        return jsonify({"error": "Missing 'start_date' or 'end_date' fields"}), 400

    result = DateService.calculate_difference(start_date, end_date, calendar)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 200

@calculator_bp.route('/end-date', methods=['POST'])
def end_date():
    data = request.get_json()
    start_date = data.get('start_date')
    duration = data.get('duration')
    # --- MODIFIED: Get calendar, default to gregorian ---
    calendar = data.get('calendar', 'gregorian')

    if not start_date or not duration:
        return jsonify({"error": "Missing 'start_date' or 'duration' fields"}), 400
    
    if not isinstance(duration, dict):
        return jsonify({"error": "'duration' must be an object with years, months, or days"}), 400

    result = DateService.calculate_end_date(start_date, duration, calendar)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result), 200