from app.extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')  # user, organizer, admin
    banned = db.Column(db.Boolean, default=False)

    # Relazioni
    events = db.relationship('Event', backref='organizer', lazy=True)
    tickets = db.relationship('Ticket', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(150), nullable=False) # Città/Luogo
    category = db.Column(db.String(50), nullable=False)  # concerto, workshop, ecc.
    price = db.Column(db.Float, default=0.0)
    total_seats = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    cover_image = db.Column(db.String(255), nullable=True) # Path locale del file
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relazioni
    tickets = db.relationship('Ticket', backref='event', lazy=True)
    reviews = db.relationship('Review', backref='event', lazy=True)

class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    qr_code_data = db.Column(db.String(255), nullable=False) # Stringa unica per generare il QR
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False) # 1 a 5
    comment = db.Column(db.Text, nullable=True)
    is_flagged = db.Column(db.Boolean, default=False) # Per moderazione admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)