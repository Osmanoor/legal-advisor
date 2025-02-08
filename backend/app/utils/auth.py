# app/utils/auth.py
from functools import wraps
from flask import request, jsonify
from app.config import Config

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return jsonify({'error': 'Unauthorized access'}), 401
        return f(*args, **kwargs)
    return decorated

def check_auth(username, password):
    return username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD
