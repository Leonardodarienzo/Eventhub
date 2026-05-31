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
@require_role() # Basta essere autenticati
def update_profile():
    """Modifica o sincronizza il profilo personale nel DB locale"""
    data = request.get_json()
    # Cerchiamo l'utente locale usando il Keycloak ID
    user = User.query.filter_by(keycloak_id=g.current_user['keycloak_id']).first()
    
    if not user:
        user = User(
            keycloak_id=g.current_user['keycloak_id'],
            email=g.current_user['email'],
            username=data.get('username', g.current_user['username'])
        )
        db.session.add(user)
    else:
        if 'username' in data:
            user.username = data['username']
            
    db.session.commit()
    return jsonify({"message": "Profilo aggiornato con successo localmente"}), 200


@user_bp.route('/subscribe/<int:event_id>', methods=['POST'])
@require_role('user')
def subscribe_to_event(event_id):
    """Iscrizione a un evento con verifica posti e invio mail asincrona"""
    user = User.query.filter_by(keycloak_id=g.current_user['keycloak_id']).first()
    if not user:
        # Se l'utente non esiste ancora nel DB locale, lo creiamo al volo
        user = User(keycloak_id=g.current_user['keycloak_id'], email=g.current_user['email'], username=g.current_user['username'])
        db.session.add(user)
        db.session.commit()

    event = Event.query.get_or_404(event_id)
    
    # 1. Verifica disponibilità posti
    if event.available_seats <= 0:
        return jsonify({"error": "Posti esauriti per questo evento"}), 400
        
    # 2. Verifica se è già iscritto
    already_subscribed = Ticket.query.filter_by(user_id=user.id, event_id=event.id).first()
    if already_subscribed:
        return jsonify({"error": "Sei già iscritto a questo evento"}), 400
        
    # 3. Generazione dati QR Code
    qr_data = f"TICKET-{user.id}-{event.id}-{datetime.utcnow().timestamp()}"
    
    # 4. Riduzione posto e creazione biglietto
    event.available_seats -= 1
    new_ticket = Ticket(user_id=user.id, event_id=event.id, qr_code_data=qr_data)
    db.session.add(new_ticket)
    db.session.commit()
    
    # 5. Task Asincrono (Threading) per invio email di conferma
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
    user = User.query.filter_by(keycloak_id=g.current_user['keycloak_id']).first_or_404()
    ticket = Ticket.query.filter_by(user_id=user.id, event_id=event_id).first()
    
    if not ticket:
        return jsonify({"error": "Nessuna iscrizione trovata per questo evento"}), 404
        
    event = Event.query.get(event_id)
    event.available_seats += 1 # Rilascia il posto
    
    db.session.delete(ticket)
    db.session.commit()
    
    return jsonify({"message": "Disiscrizione completata. Posto liberato."}), 200


@user_bp.route('/tickets', methods=['GET'])
@require_role('user')
def get_my_tickets():
    """Visualizzazione dei propri biglietti convertendo il QR data in un'immagine Base64 per il frontend"""
    user = User.query.filter_by(keycloak_id=g.current_user['keycloak_id']).first()
    if not user:
        return jsonify({"tickets": []}), 200
        
    tickets = Ticket.query.filter_by(user_id=user.id).all()
    output = []
    
    for t in tickets:
        # Genera l'immagine QR code reale in memoria
        qr = qrcode.make(t.qr_code_data)
        buf = io.BytesIO()
        qr.save(buf, format='PNG')
        qr_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        output.append({
            "ticket_id": t.id,
            "event_title": t.event.title,
            "event_date": t.event.date.isoformat(),
            "location": t.event.location,
            "qr_code_base64": f"data:image/png;base64,{qr_base64}" # Pronto per il tag <img src="..."> in Angular
        })
        
    return jsonify({"tickets": output}), 200


@user_bp.route('/review/<int:event_id>', methods=['POST'])
@require_role('user')
def add_review(event_id):
    """Pubblicazione recensioni (rating 1-5) solo DOPO che l'evento si è svolto"""
    user = User.query.filter_by(keycloak_id=g.current_user['keycloak_id']).first_or_404()
    event = Event.query.get_or_404(event_id)
    
    # 1. Controlla se l'evento è già passato
    if event.date > datetime.utcnow():
        return jsonify({"error": "Non puoi recensire un evento che non si è ancora svolto"}), 400
        
    # 2. Controlla se l'utente ha effettivamente partecipato (ha il biglietto)
    ticket = Ticket.query.filter_by(user_id=user.id, event_id=event.id).first()
    if not ticket:
        return jsonify({"error": "Puoi recensire solo eventi a cui hai partecipato"}), 403
        
    # 3. Controlla se ha già lasciato una recensione
    already_reviewed = Review.query.filter_by(user_id=user.id, event_id=event.id).first()
    if already_reviewed:
        return jsonify({"error": "Hai già lasciato una recensione per questo evento"}), 400
        
    # 4. Validazione dell'input con Marshmallow
    data = request.get_json()
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