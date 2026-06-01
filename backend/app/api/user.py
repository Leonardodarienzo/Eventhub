from flask import Blueprint, jsonify, request, g
from app.extensions import db
from app.models import User, Event, Ticket, Review
from app.utils import require_role
from app.schemas import review_schema
from app.tasks import send_email_async
from datetime import datetime
import qrcode
import io
import base64

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['PUT'])
@require_role()
def update_profile():
    """Modifica il profilo personale nel DB locale"""
    data = request.get_json() or {}
    user = User.query.get_or_404(int(g.current_user['id']))

    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']

    db.session.commit()
    return jsonify({
        "message": "Profilo aggiornato con successo",
        "user": {"id": user.id, "email": user.email, "username": user.username, "role": user.role}
    }), 200


@user_bp.route('/profile', methods=['GET'])
@require_role()
def get_profile():
    user = User.query.get_or_404(int(g.current_user['id']))
    return jsonify({
        "user": {"id": user.id, "email": user.email, "username": user.username, "role": user.role}
    }), 200


@user_bp.route('/profile/password', methods=['PUT'])
@require_role()
def change_password():
    data = request.get_json() or {}
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({"error": "old_password e new_password sono obbligatori"}), 400

    user = User.query.get_or_404(int(g.current_user['id']))
    if not user.check_password(old_password):
        return jsonify({"error": "Password corrente non corretta"}), 403

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password modificata con successo"}), 200


@user_bp.route('/subscribe/<int:event_id>', methods=['POST'])
@require_role('user')
def subscribe_to_event(event_id):
    """Iscrizione a un evento con verifica posti e invio mail asincrona"""
    user = User.query.get_or_404(int(g.current_user['id']))

    event = Event.query.get_or_404(event_id)
    if event.available_seats <= 0:
        return jsonify({"error": "Posti esauriti per questo evento"}), 400

    already_subscribed = Ticket.query.filter_by(user_id=user.id, event_id=event.id).first()
    if already_subscribed:
        return jsonify({"error": "Sei già iscritto a questo evento"}), 400

    qr_data = f"TICKET-{user.id}-{event.id}-{datetime.utcnow().timestamp()}"
    event.available_seats -= 1
    new_ticket = Ticket(user_id=user.id, event_id=event.id, qr_code_data=qr_data)
    db.session.add(new_ticket)
    db.session.commit()

    send_email_async(
        email=user.email,
        subject=f"Conferma iscrizione: {event.title}",
        body=f"Ciao {user.username}, la tua iscrizione all'evento '{event.title}' è confermata!"
    )

    return jsonify({"message": "Iscrizione completata con successo!", "ticket_id": new_ticket.id}), 201


@user_bp.route('/unsubscribe/<int:event_id>', methods=['DELETE'])
@require_role('user')
def unsubscribe_from_event(event_id):
    """Disiscrizione da un evento e ripristino del posto disponibile"""
    user = User.query.get_or_404(int(g.current_user['id']))
    ticket = Ticket.query.filter_by(user_id=user.id, event_id=event_id).first()

    if not ticket:
        return jsonify({"error": "Nessuna iscrizione trovata per questo evento"}), 404

    event = Event.query.get(event_id)
    if event:
        event.available_seats += 1

    db.session.delete(ticket)
    db.session.commit()

    return jsonify({"message": "Disiscrizione completata. Posto liberato."}), 200


@user_bp.route('/tickets', methods=['GET'])
@require_role('user')
def get_my_tickets():
    """Visualizzazione dei propri biglietti con QR code in Base64"""
    user = User.query.get_or_404(int(g.current_user['id']))
    tickets = Ticket.query.filter_by(user_id=user.id).all()
    output = []

    for t in tickets:
        qr = qrcode.make(t.qr_code_data)
        buf = io.BytesIO()
        qr.save(buf, format='PNG')
        qr_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

        output.append({
            "ticket_id": t.id,
            "event_title": t.event.title,
            "event_date": t.event.date.isoformat(),
            "location": t.event.location,
            "qr_code_base64": f"data:image/png;base64,{qr_base64}"
        })

    return jsonify({"tickets": output}), 200


@user_bp.route('/review/<int:event_id>', methods=['POST'])
@require_role('user')
def add_review(event_id):
    """Pubblicazione recensioni (rating 1-5) solo dopo che l'evento è passato"""
    user = User.query.get_or_404(int(g.current_user['id']))
    event = Event.query.get_or_404(event_id)

    if event.date > datetime.utcnow():
        return jsonify({"error": "Non puoi recensire un evento che non si è ancora svolto"}), 400

    ticket = Ticket.query.filter_by(user_id=user.id, event_id=event.id).first()
    if not ticket:
        return jsonify({"error": "Puoi recensire solo eventi a cui hai partecipato"}), 403

    already_reviewed = Review.query.filter_by(user_id=user.id, event_id=event.id).first()
    if already_reviewed:
        return jsonify({"error": "Hai già lasciato una recensione per questo evento"}), 400

    data = request.get_json() or {}
    errors = review_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    new_review = Review(
        user_id=user.id,
        event_id=event.id,
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({"message": "Recensione pubblicata con successo!"}), 201


@user_bp.route('/reviews/<int:review_id>/flag', methods=['POST'])
@require_role('user')
def flag_review(review_id):
    review = Review.query.get_or_404(review_id)
    review.is_flagged = True
    db.session.commit()
    return jsonify({"message": "Recensione segnalata per moderazione."}), 200