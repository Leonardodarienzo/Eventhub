from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Event, User
from app.schemas import events_schema

public_bp = Blueprint('public', __name__)

@public_bp.route('/events', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.date.asc()).all()
    return jsonify({"events": events_schema.dump(events)}), 200

@public_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify({"event": events_schema.dump(event)}), 200

@public_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    username = data.get('username') or data.get('nome')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"error": "email, username e password sono obbligatori"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Utente con questa email già registrato"}), 400

    user = User(email=email, username=username, role='user')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            "roles": [user.role],
            "email": user.email,
            "username": user.username
        }
    )
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message": "Registrazione completata con successo",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"id": user.id, "email": user.email, "username": user.username, "role": user.role}
    }), 201

@public_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "email e password sono obbligatori"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Credenziali non valide"}), 401

    if user.banned:
        return jsonify({"error": "Utente bannato, contatta l'amministratore"}), 403

    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            "roles": [user.role],
            "email": user.email,
            "username": user.username
        }
    )
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message": "Accesso eseguito con successo",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"id": user.id, "email": user.email, "username": user.username, "role": user.role}
    }), 200

@public_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    user = User.query.get_or_404(identity)
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            "roles": [user.role],
            "email": user.email,
            "username": user.username
        }
    )
    return jsonify({"access_token": access_token}), 200
