import os
from flask import Flask, jsonify, render_template_string
from config import Config
from app.extensions import db, migrate, cors, jwt


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Crea la cartella per gli upload se non esiste
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Inizializzazione Estensioni
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    jwt.init_app(app)

    # Registrazione dei Blueprint
    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.route('/api/docs', methods=['GET'])
    def api_docs():
        return render_template_string(
            '''<!doctype html>
            <html>
              <head>
                <title>EventHub API Docs</title>
                <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
              </head>
              <body>
                <redoc spec-url="/api/openapi.json"></redoc>
              </body>
            </html>'''
        )

    @app.route('/api/openapi.json', methods=['GET'])
    def api_openapi():
        return jsonify({
            "openapi": "3.0.0",
            "info": {
                "title": "EventHub API",
                "version": "1.0",
                "description": "API REST per EventHub"
            },
            "paths": {
                "/api/public/events": {
                    "get": {
                        "summary": "Elenco degli eventi pubblici",
                        "parameters": [
                            {"name": "category", "in": "query", "schema": {"type": "string"}},
                            {"name": "city", "in": "query", "schema": {"type": "string"}},
                            {"name": "min_date", "in": "query", "schema": {"type": "string"}},
                            {"name": "max_date", "in": "query", "schema": {"type": "string"}},
                            {"name": "max_price", "in": "query", "schema": {"type": "number"}},
                            {"name": "search", "in": "query", "schema": {"type": "string"}}
                        ],
                        "responses": {"200": {"description": "Lista eventi"}}
                    }
                },
                "/api/public/events/{event_id}": {
                    "get": {
                        "summary": "Dettaglio evento",
                        "parameters": [{"name": "event_id", "in": "path", "required": true, "schema": {"type": "integer"}}],
                        "responses": {"200": {"description": "Dettaglio evento"}}
                    }
                },
                "/api/public/register": {
                    "post": {
                        "summary": "Registrazione utente",
                        "responses": {"201": {"description": "Utente registrato"}}
                    }
                },
                "/api/public/login": {
                    "post": {
                        "summary": "Login utente",
                        "responses": {"200": {"description": "Token JWT"}}
                    }
                },
                "/api/public/refresh": {
                    "post": {
                        "summary": "Refresh token JWT",
                        "responses": {"200": {"description": "Nuovo access token"}}
                    }
                },
                "/api/user/profile": {
                    "get": {"summary": "Profilo utente", "responses": {"200": {"description": "Dati profilo"}}},
                    "put": {"summary": "Aggiorna profilo", "responses": {"200": {"description": "Profilo aggiornato"}}}
                },
                "/api/user/profile/password": {
                    "put": {"summary": "Cambia password utente", "responses": {"200": {"description": "Password aggiornata"}}}
                },
                "/api/user/tickets": {
                    "get": {"summary": "Elenco biglietti dell'utente", "responses": {"200": {"description": "Lista biglietti"}}}
                },
                "/api/user/subscribe/{event_id}": {
                    "post": {"summary": "Iscrizione a un evento", "responses": {"201": {"description": "Iscrizione effettuata"}}}
                },
                "/api/user/unsubscribe/{event_id}": {
                    "delete": {"summary": "Disiscriviti da un evento", "responses": {"200": {"description": "Disiscrizione effettuata"}}}
                },
                "/api/organizer/dashboard": {
                    "get": {"summary": "Statistiche organizzatore", "responses": {"200": {"description": "Dati dashboard"}}}
                },
                "/api/organizer/events": {
                    "get": {"summary": "Lista eventi organizzatore", "responses": {"200": {"description": "Lista eventi"}}},
                    "post": {"summary": "Crea un evento", "responses": {"201": {"description": "Evento creato"}}}
                },
                "/api/organizer/events/{event_id}": {
                    "put": {"summary": "Aggiorna evento", "responses": {"200": {"description": "Evento aggiornato"}}},
                    "delete": {"summary": "Elimina evento", "responses": {"200": {"description": "Evento eliminato"}}}
                },
                "/api/organizer/events/{event_id}/export-csv": {
                    "get": {"summary": "Esporta lista iscritti in CSV", "responses": {"200": {"description": "CSV di iscritti"}}}
                },
                "/api/admin/users": {
                    "get": {"summary": "Lista utenti", "responses": {"200": {"description": "Lista utenti"}}}
                },
                "/api/admin/users/{user_id}/role": {
                    "put": {"summary": "Modifica ruolo utente", "responses": {"200": {"description": "Ruolo modificato"}}}
                },
                "/api/admin/users/{user_id}/ban": {
                    "put": {"summary": "Banna utente", "responses": {"200": {"description": "Utente bannato"}}}
                },
                "/api/admin/users/{user_id}/unban": {
                    "put": {"summary": "Ripristina utente", "responses": {"200": {"description": "Utente ripristinato"}}}
                },
                "/api/admin/reviews/flagged": {
                    "get": {"summary": "Recensioni segnalate", "responses": {"200": {"description": "Lista recensioni segnalate"}}}
                }
            }
        })

    with app.app_context():
        from datetime import datetime
        from app.models import Event, User

        db.create_all()

        organizer = User.query.filter_by(email='organizer@test.it').first()
        if organizer is None:
            organizer = User(
                email='organizer@test.it',
                username='organizer',
                role='organizer'
            )
            organizer.set_password('organizer123')
            db.session.add(organizer)
            db.session.commit()

        admin = User.query.filter_by(email='admin@test.it').first()
        if admin is None:
            admin = User(
                email='admin@test.it',
                username='admin',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

        if Event.query.count() == 0:
            sample_events = [
                Event(
                    title='Jazz Night sotto le stelle',
                    description='Una serata magica con i migliori talenti del jazz contemporaneo.',
                    date=datetime.fromisoformat('2024-07-15T21:00:00'),
                    location='Cortile Sforzesco, Milano',
                    category='concerto',
                    price=25.0,
                    total_seats=60,
                    available_seats=60,
                    cover_image='https://images.unsplash.com/photo-1511192336575-5a79af67a62d?w=800',
                    organizer_id=organizer.id
                ),
                Event(
                    title='Workshop: Angular Advanced',
                    description='Approfondimento su RxJS, Signals e architetture scalabili.',
                    date=datetime.fromisoformat('2024-09-10T18:30:00'),
                    location='Campus Tecnologico, Roma',
                    category='workshop',
                    price=89.0,
                    total_seats=40,
                    available_seats=40,
                    cover_image='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
                    organizer_id=organizer.id
                ),
                Event(
                    title='Presentazione: Il Mistero di Venere',
                    description='L’autrice Giulia Bianchi presenta il suo ultimo thriller mozzafiato.',
                    date=datetime.fromisoformat('2024-06-25T20:00:00'),
                    location='Salone del Libro, Torino',
                    category='presentazione_libro',
                    price=0.0,
                    total_seats=120,
                    available_seats=120,
                    cover_image='https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
                    organizer_id=organizer.id
                ),
                Event(
                    title='Cinema sotto le stelle',
                    description='Proiezione all’aperto dei migliori film dell’estate.',
                    date=datetime.fromisoformat('2024-08-02T21:30:00'),
                    location='Parco del Valentino, Torino',
                    category='concerto',
                    price=12.0,
                    total_seats=80,
                    available_seats=80,
                    cover_image='https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800',
                    organizer_id=organizer.id
                ),
                Event(
                    title='Masterclass Social Media',
                    description='Strategie avanzate per promuovere eventi online con successo.',
                    date=datetime.fromisoformat('2024-10-12T17:00:00'),
                    location='Spazio Coworking, Bologna',
                    category='workshop',
                    price=59.0,
                    total_seats=50,
                    available_seats=50,
                    cover_image='https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
                    organizer_id=organizer.id
                ),
                Event(
                    title='Festival delle Letture',
                    description='Incontri con autori e reading di nuovi romanzi.',
                    date=datetime.fromisoformat('2024-07-22T18:00:00'),
                    location='Giardini di Castelvecchio, Verona',
                    category='presentazione_libro',
                    price=8.0,
                    total_seats=90,
                    available_seats=90,
                    cover_image='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
                    organizer_id=organizer.id
                )
            ]
            db.session.add_all(sample_events)
            db.session.commit()

    return app