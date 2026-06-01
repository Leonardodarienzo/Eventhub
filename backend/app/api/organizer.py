import os
from flask import Blueprint, jsonify, request, g, current_app
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models import User, Event
from app.schemas import event_schema, events_schema
from app.utils import require_role

organizer_bp = Blueprint('organizer', __name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@organizer_bp.route('/dashboard', methods=['GET'])
@require_role('organizer')
def get_dashboard():
    user = User.query.get_or_404(int(g.current_user['id']))
    events = Event.query.filter_by(organizer_id=user.id).all()

    total_attendees = sum(len(event.tickets) for event in events)
    total_revenue = sum((event.total_seats - event.available_seats) * event.price for event in events)
    ratings = [review.rating for event in events for review in event.reviews]
    average_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0.0

    return jsonify({
        "organizer": {"id": user.id, "username": user.username, "email": user.email},
        "stats": {
            "events_count": len(events),
            "total_attendees": total_attendees,
            "estimated_revenue": total_revenue,
            "average_rating": average_rating
        }
    }), 200


@organizer_bp.route('/events', methods=['GET'])
@require_role('organizer')
def list_events():
    user = User.query.get_or_404(int(g.current_user['id']))
    events = Event.query.filter_by(organizer_id=user.id).order_by(Event.date.asc()).all()
    return jsonify({"events": events_schema.dump(events)}), 200


@organizer_bp.route('/events', methods=['POST'])
@require_role('organizer')
def create_event():
    user = User.query.get_or_404(int(g.current_user['id']))
    data = request.form.to_dict()
    cover_image_file = request.files.get('cover_image')

    if cover_image_file and allowed_file(cover_image_file.filename):
        filename = secure_filename(cover_image_file.filename)
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        cover_image_file.save(upload_path)
        cover_image = f"/static/uploads/{filename}"
    else:
        cover_image = None

    errors = event_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    event = Event(
        title=data['title'],
        description=data['description'],
        date=data['date'],
        location=data['location'],
        category=data['category'],
        price=float(data['price']),
        total_seats=int(data['total_seats']),
        available_seats=int(data['total_seats']),
        cover_image=cover_image,
        organizer_id=user.id
    )
    db.session.add(event)
    db.session.commit()

    return jsonify({"message": "Evento creato con successo", "event": event_schema.dump(event)}), 201


@organizer_bp.route('/events/<int:event_id>', methods=['PUT'])
@require_role('organizer')
def update_event(event_id):
    user = User.query.get_or_404(int(g.current_user['id']))
    event = Event.query.filter_by(id=event_id, organizer_id=user.id).first_or_404()
    data = request.form.to_dict()
    cover_image_file = request.files.get('cover_image')

    if cover_image_file and allowed_file(cover_image_file.filename):
        filename = secure_filename(cover_image_file.filename)
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        cover_image_file.save(upload_path)
        event.cover_image = f"/static/uploads/{filename}"

    if data.get('title'):
        event.title = data['title']
    if data.get('description'):
        event.description = data['description']
    if data.get('date'):
        event.date = data['date']
    if data.get('location'):
        event.location = data['location']
    if data.get('category'):
        event.category = data['category']
    if data.get('price') is not None:
        event.price = float(data['price'])
    if data.get('total_seats') is not None:
        total_seats = int(data['total_seats'])
        change = total_seats - event.total_seats
        event.total_seats = total_seats
        event.available_seats = max(0, event.available_seats + change)

    db.session.commit()
    return jsonify({"message": "Evento aggiornato con successo", "event": event_schema.dump(event)}), 200


@organizer_bp.route('/events/<int:event_id>', methods=['DELETE'])
@require_role('organizer')
def delete_event(event_id):
    user = User.query.get_or_404(int(g.current_user['id']))
    event = Event.query.filter_by(id=event_id, organizer_id=user.id).first_or_404()
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Evento eliminato con successo"}), 200