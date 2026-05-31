import os

class Config:
    # Chiave segreta per le sessioni di Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key-cambiami-in-prod')
    
    # Credenziali PostgreSQL reali fornite dal tuo file .env
    PG_USER = os.environ.get('POSTGRES_USER', 'postgres')
    PG_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'supersecret')
    PG_DB = os.environ.get('POSTGRES_DB', 'postgres')
    
    # Stringa di connessione a PostgreSQL (funzionante su localhost tramite porta inoltrata)
    SQLALCHEMY_DATABASE_URI = f"postgresql://{PG_USER}:{PG_PASSWORD}@localhost:5432/{PG_DB}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurazione per il caricamento delle immagini di copertina
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'app/static/uploads')
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024