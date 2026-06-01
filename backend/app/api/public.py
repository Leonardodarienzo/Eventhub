from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Event, User
from app.schemas import event_schema, events_schema
from sqlalchemy import or_
from datetime import datetime

public_bp = Blueprint('public', __name__)

@public_bp.route('/events', methods=['GET'])
def get_events():
    query = Event.query.order_by(Event.date.asc())

    category = request.args.get('category')
    city = request.args.get('city')
    min_date = request.args.get('min_date')
    max_date = request.args.get('max_date')
    max_price = request.args.get('max_price')
    search = request.args.get('search')

    if category:
        query = query.filter(Event.category == category)

    if city:
        query = query.filter(Event.location.ilike(f"%{city}%"))

    if min_date:
        try:
            min_dt = datetime.fromisoformat(min_date)
            query = query.filter(Event.date >= min_dt)
        except ValueError:
            return jsonify({"error": "Formato data min_date non valido. Usa YYYY-MM-DD o ISO 8601."}), 400

    if max_date:
        try:
            max_dt = datetime.fromisoformat(max_date)
            query = query.filter(Event.date <= max_dt)
        except ValueError:
            return jsonify({"error": "Formato data max_date non valido. Usa YYYY-MM-DD o ISO 8601."}), 400

    if max_price is not None and max_price != '':
        try:
            max_price_val = float(max_price)
            query = query.filter(Event.price <= max_price_val)
        except ValueError:
            return jsonify({"error": "max_price deve essere un numero."}), 400

    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            or_(
                Event.title.ilike(search_term),
                Event.description.ilike(search_term),
                Event.location.ilike(search_term)
            )
        )

    events = query.all()
    return jsonify({"events": events_schema.dump(events)}), 200

@public_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify({"event": event_schema.dump(event)}), 200

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
