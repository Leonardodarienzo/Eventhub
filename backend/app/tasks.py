import threading
import time

def send_email_async(email, subject, body):
    """Funzione interna che simula l'invio di una mail bloccante (es. 3 secondi di attesa)"""
    def thread_target():
        print(f"[EMAIL] Inizio invio email a {email}...")
        time.sleep(3) # Simula il delay del server SMTP
        print(f"[EMAIL] Email inviata con successo! Oggetto: {subject}")
        
    # Avvia il processo in un thread separato così Flask risponde subito all'utente
    email_thread = threading.Thread(target=thread_target)
    email_thread.start()