import { Injectable } from '@angular/core';
import { Evento } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private eventi: Evento[] = [
    { 
      id: 1, titolo: 'Jazz Night sotto le stelle', categoria: 'Concerti', 
      descrizione: 'Una serata magica con i migliori talenti del jazz contemporaneo.',
      data: '2024-07-15', citta: 'Milano', luogo: 'Cortile Sforzesco', 
      prezzo: 25, posti_disponibili: 45, 
      immagine: 'https://images.unsplash.com/photo-1511192336575-5a79af67a62d?w=800' 
    },
    { 
      id: 2, titolo: 'Workshop: Angular Advanced', categoria: 'Workshop', 
      descrizione: 'Approfondimento su RxJS, Signals e architetture scalabili.',
      data: '2024-09-10', citta: 'Roma', luogo: 'Campus Tecnologico', 
      prezzo: 89, posti_disponibili: 12, 
      immagine: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' 
    },
    { 
      id: 3, titolo: 'Presentazione: Il Mistero di Venere', categoria: 'Libri', 
      descrizione: 'L’autrice Giulia Bianchi presenta il suo ultimo thriller mozzafiato.',
      data: '2024-06-25', citta: 'Torino', luogo: 'Salone del Libro', 
      prezzo: 0, posti_disponibili: 100, 
      immagine: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800' 
    },
    { 
      id: 4, titolo: 'Rock in the Park', categoria: 'Concerti', 
      descrizione: 'Le migliori band emergenti del panorama rock italiano si sfidano sul palco.',
      data: '2024-08-05', citta: 'Bologna', luogo: 'Parco Nord', 
      prezzo: 15, posti_disponibili: 200, 
      immagine: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800' 
    },
    { 
      id: 5, titolo: 'Corso di Fotografia Digitale', categoria: 'Workshop', 
      descrizione: 'Dalle basi alla post-produzione: impara a scattare foto professionali.',
      data: '2024-10-12', citta: 'Firenze', luogo: 'Studio Luce', 
      prezzo: 55, posti_disponibili: 8, 
      immagine: 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=800' 
    },
    { 
      id: 6, titolo: 'Festival della Poesia Urbana', categoria: 'Libri', 
      descrizione: 'Reading pubblico e workshop di scrittura creativa tra le strade del centro.',
      data: '2024-06-30', citta: 'Napoli', luogo: 'Piazza del Plebiscito', 
      prezzo: 0, posti_disponibili: 300, 
      immagine: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800' 
    },
    { 
      id: 7, titolo: 'Sinfonia n. 5 di Beethoven', categoria: 'Concerti', 
      descrizione: 'L’orchestra filarmonica esegue uno dei capolavori della musica classica.',
      data: '2024-11-20', citta: 'Venezia', luogo: 'Teatro La Fenice', 
      prezzo: 120, posti_disponibili: 20, 
      immagine: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800' 
    },
    { 
      id: 8, titolo: 'Workshop: Cucina Vegana', categoria: 'Workshop', 
      descrizione: 'Scopri come preparare piatti gourmet 100% vegetali e salutari.',
      data: '2024-07-22', citta: 'Palermo', luogo: 'Accademia del Gusto', 
      prezzo: 40, posti_disponibili: 15, 
      immagine: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800' 
    },
    { 
      id: 9, titolo: 'Incontro con l’Astronauta', categoria: 'Libri', 
      descrizione: 'Presentazione del libro "Oltre le Stelle" con testimonianze reali dallo spazio.',
      data: '2024-09-05', citta: 'Genova', luogo: 'Acquario Eventi', 
      prezzo: 10, posti_disponibili: 150, 
      immagine: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800' 
    },
    { 
      id: 10, titolo: 'Elettronica & Sintetizzatori', categoria: 'Concerti', 
      descrizione: 'Un viaggio sonoro tra beat digitali e sintetizzatori analogici.',
      data: '2024-12-01', citta: 'Bari', luogo: 'Club Underground', 
      prezzo: 20, posti_disponibili: 60, 
      immagine: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800' 
    }
  ];

  getEventi() { return this.eventi; }
  getEventoById(id: number) { return this.eventi.find(e => e.id === id); }
}
