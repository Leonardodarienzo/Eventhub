import os
import socket
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent


def _postgres_available():
    if os.environ.get('USE_SQLITE', 'false').lower() in ('1', 'true', 'yes'):
        return False

    pg_user = os.environ.get('POSTGRES_USER')
    pg_password = os.environ.get('POSTGRES_PASSWORD')
    pg_host = os.environ.get('POSTGRES_HOST', 'localhost')
    pg_port = int(os.environ.get('POSTGRES_PORT', 5432))
    pg_db = os.environ.get('POSTGRES_DB')

    if not (pg_user and pg_password and pg_db):
        return False

    try:
        with socket.create_connection((pg_host, pg_port), timeout=1):
            return True
    except OSError:
        return False


class Config:
    # Chiave segreta per le sessioni di Flask e JWT
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key-cambiami-in-prod')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key-cambiami')

    PG_USER = os.environ.get('POSTGRES_USER')
    PG_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
    PG_HOST = os.environ.get('POSTGRES_HOST', 'localhost')
    PG_PORT = int(os.environ.get('POSTGRES_PORT', 5432))
    PG_DB = os.environ.get('POSTGRES_DB')

    if _postgres_available():
        SQLALCHEMY_DATABASE_URI = f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}"
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{BASE_DIR.parent / 'eventhub.db'}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configurazione per il caricamento delle immagini di copertina
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app/static/uploads')
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024