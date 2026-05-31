from functools import wraps
from flask import request, jsonify, g
import jwt
import requests

# Configurazione Keycloak (puoi spostare queste variabili in config.py se preferisci)
KEYCLOAK_URL = "http://localhost:8080"  # URL esterno per validazione audience
KEYCLOAK_REALM = "eventhub"             # Sostituisci con il nome del tuo Realm se diverso
# URL dei certificati pubblici di Keycloak per verificare la firma del JWT
JWKS_URL = f"http://eventhub_keycloak:8080/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs"

def get_public_key(token):
    """Scarica la chiave pubblica corretta da Keycloak usando il Key ID (kid) del JWT"""
    try:
        header = jwt.get_unverified_header(token)
        kid = header.get('kid')
        
        # Richiede le chiavi a Keycloak
        jwks = requests.get(JWKS_URL).json()
        for key in jwks['keys']:
            if key['kid'] == kid:
                # Converte i dati JWKS in una chiave pubblica utilizzabile da PyJWT
                return jwt.algorithms.RSAAlgorithm.from_jwk(key)
    except Exception as e:
        print(f"Errore nel recupero della chiave pubblica Keycloak: {e}")
        return None

def require_role(required_role=None):
    """Decoratore custom per proteggere le rotte di Flask con i ruoli di Keycloak"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"error": "Token mancante o formato non valido (Usa 'Bearer <token>')"}), 401
            
            token = auth_header.split(" ")[1]
            public_key = get_public_key(token)
            
            if not public_key:
                return jsonify({"error": "Impossibile verificare l'autenticità del token"}), 401
                
            try:
                # Valida la firma del token e la scadenza
                # Disabilitiamo temporaneamente l'audience check perché varia tra frontend e backend
                decoded = jwt.decode(token, public_key, algorithms=["RS256"], options={"verify_aud": False})
                
                # Recupera i ruoli del Realm da Keycloak
                realm_access = decoded.get('realm_access', {})
                roles = realm_access.get('roles', [])
                
                # Salva i dati dell'utente nella variabile globale 'g' di Flask per usarli nelle rotte
                g.current_user = {
                    "keycloak_id": decoded.get("sub"),
                    "email": decoded.get("email"),
                    "username": decoded.get("preferred_username"),
                    "roles": roles
                }
                
                # Se è richiesto un ruolo specifico, controlla che l'utente ce l'abbia
                if required_role and required_role not in roles:
                    return jsonify({"error": f"Accesso negato. Richiesto ruolo: {required_role}"}), 403
                    
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Il token è scaduto"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Token non valido"}), 401
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator