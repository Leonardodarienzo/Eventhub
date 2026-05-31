from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models import User, Review
from app.utils import require_role

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@require_role('admin') # Bloccato solo per gli Admin di Keycloak
def change_user_role(user_id):
    """Promozione di un utente a Organizzatore o cambio ruolo locale"""
    data = request.get_json()
    new_role = data.get('role') # Es. 'organizer' o 'user'
    
    if new_role not in ['user', 'organizer', 'admin']:
        return jsonify({"error": "Ruolo specificato non valido"}), 400
        
    user = User.query.get_or_404(user_id)
    user.role = new_role
    db.session.commit()
    
    return jsonify({"message": f"Ruolo dell'utente {user.username} modificato in {new_role}"}), 200


@admin_bp.route('/users/<int:user_id>/ban', methods=['PUT'])
@require_role('admin')
def ban_user(user_id):
    """Semplice ban locale (impostando un flag o cambiando ruolo in 'banned')"""
    user = User.query.get_or_404(user_id)
    user.role = 'banned' # Le rotte con @require_role rifiuteranno l'accesso
    db.session.commit()
    
    return jsonify({"message": f"Utente {user.username} bannato con successo dalle risorse locali"}), 200


@admin_bp.route('/reviews/flagged', methods=['GET'])
@require_role('admin')
def get_flagged_reviews():
    """Visualizza tutte le recensioni segnalate per linguaggio inappropriato o spam"""
    flagged_reviews = Review.query.filter_by(is_flagged=True).all()
    output = []
    for r in flagged_reviews:
        output.append({
            "review_id": r.id,
            "event_title": r.event.title,
            "username": r.user.username,
            "rating": r.rating,
            "comment": r.comment
        })
    return jsonify({"flagged_reviews": output}), 200


@admin_bp.route('/reviews/<int:review_id>/moderate', methods=['DELETE', 'PUT'])
@require_role('admin')
def moderate_review(review_id):
    """Moderazione della recensione: DELETE per cancellarla, PUT per approvarla (togliere la segnalazione)"""
    review = Review.query.get_or_404(review_id)
    
    if request.method == 'DELETE':
        # Rimuove definitivamente la recensione inappropriata
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Recensione eliminata con successo"}), 200
        
    elif request.method == 'PUT':
        # L'admin ritiene che la recensione sia valida, toglie il flag di segnalazione
        review.is_flagged = False
        db.session.commit()
        return jsonify({"message": "Segnalazione archiviata, recensione approvata"}), 200