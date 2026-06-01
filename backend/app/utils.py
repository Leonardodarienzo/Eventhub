from functools import wraps
from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from app.models import User


def require_role(required_role=None):
    """Decoratore per proteggere le rotte di Flask con ruoli e JWT locali."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return jsonify({"error": str(e)}), 401

            jwt_data = get_jwt()
            user_id = jwt_data.get('sub')
            roles = jwt_data.get('roles', [])
            g.current_user = {
                "id": user_id,
                "email": jwt_data.get('email'),
                "username": jwt_data.get('username'),
                "roles": roles
            }

            user = User.query.get(user_id)
            if user is None:
                return jsonify({"error": "Utente non trovato"}), 404
            if user.banned:
                return jsonify({"error": "Utente bannato, accesso negato"}), 403

            if required_role and required_role not in roles:
                return jsonify({"error": f"Accesso negato. Richiesto ruolo: {required_role}"}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator