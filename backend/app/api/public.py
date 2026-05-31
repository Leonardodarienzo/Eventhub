from flask import Blueprint, jsonify
from app.models import Event

public_bp = Blueprint('public', __name__)

@public_bp.route('/events', methods=['GET'])
def get_events():
    # Per ora restituisce una lista vuota di test
    return jsonify({"events": [], "message": "Rotta pubblica funzionante"}), 200