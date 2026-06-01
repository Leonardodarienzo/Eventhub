import pytest
from datetime import datetime
from app import create_app
from app.extensions import db
from app.models import Event, User
from config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

@pytest.fixture
def app():
    app = create_app(config_class=TestConfig)
    with app.app_context():
        db.create_all()
        organizer = User.query.filter_by(email='organizer@test.it').first()
        if organizer is None:
            organizer = User(email='organizer@test.it', username='organizer', role='organizer')
            organizer.set_password('organizer123')
            db.session.add(organizer)
            db.session.commit()

        event = Event(
            title='Evento Test',
            description='Evento per test',
            date=datetime.fromisoformat('2025-01-01T20:00:00'),
            location='Roma',
            category='concerto',
            price=10.0,
            total_seats=100,
            available_seats=100,
            cover_image='https://via.placeholder.com/800',
            organizer_id=organizer.id
        )
        db.session.add(event)
        db.session.commit()
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_public_events(client):
    response = client.get('/api/public/events')
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'events' in json_data
    assert isinstance(json_data['events'], list)

def test_user_registration(client):
    payload = {'email': 'user@test.it', 'username': 'user', 'password': 'pass1234'}
    response = client.post('/api/public/register', json=payload)
    assert response.status_code == 201
    json_data = response.get_json()
    assert 'access_token' in json_data
    assert json_data['user']['email'] == 'user@test.it'

def test_user_login(client):
    register_payload = {'email': 'login@test.it', 'username': 'loginuser', 'password': 'loginpass'}
    client.post('/api/public/register', json=register_payload)

    login_payload = {'email': 'login@test.it', 'password': 'loginpass'}
    response = client.post('/api/public/login', json=login_payload)
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'access_token' in json_data
    assert json_data['user']['email'] == 'login@test.it'
