from flask import Blueprint

# Creiamo un blueprint principale per le API
api_bp = Blueprint('api', __name__)

# Importiamo le rotte dai singoli file
from app.api.public import public_bp
from app.api.user import user_bp
from app.api.organizer import organizer_bp
from app.api.admin import admin_bp

# Registriamo i sotto-blueprint nel blueprint principale con dei prefissi ordinati
api_bp.register_blueprint(public_bp, url_prefix='/public')
api_bp.register_blueprint(user_bp, url_prefix='/user')
api_bp.register_blueprint(organizer_bp, url_prefix='/organizer')
api_bp.register_blueprint(admin_bp, url_prefix='/admin')