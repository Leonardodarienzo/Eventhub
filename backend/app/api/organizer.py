from flask import Blueprint, jsonify, g
from app.utils import require_role

organizer_bp = Blueprint('organizer', __name__)

@organizer_bp.route('/dashboard', methods=['GET'])
@require_role('organizer') # <--- Ora questa rotta accetta solo utenti con ruolo 'organizer' in Keycloak
def get_dashboard():
    # 'g.current_user' contiene i dettagli estratti dal JWT di Keycloak!
    return jsonify({
        "message": f"Benvenuto nella dashboard, {g.current_user['username']}!",
        "stats": "Qui metteremo i grafici degli incassi"
    }), 200