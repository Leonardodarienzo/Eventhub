from functools import wraps
from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt


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
            roles = jwt_data.get('roles', [])
            g.current_user = {
                "id": jwt_data.get('sub'),
                "email": jwt_data.get('email'),
                "username": jwt_data.get('username'),
                "roles": roles
            }

            if required_role and required_role not in roles:
                return jsonify({"error": f"Accesso negato. Richiesto ruolo: {required_role}"}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator