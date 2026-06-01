import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evento, Biglietto, Recensione } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private eventi: Evento[] = [
    { id: 1, titolo: 'Jazz Night', categoria: 'Concerti', descrizione: 'Jazz sotto le stelle.', data: '2027-07-15', citta: 'Milano', luogo: 'Parco Sempione', prezzo: 20, posti_disponibili: 50, immagine: 'https://images.unsplash.com/photo-1511192336575-5a79af67a62d?w=400' },
    { id: 2, titolo: 'Workshop Angular', categoria: 'Workshop', descrizione: 'Sviluppo Full-stack.', data: '2027-09-10', citta: 'Roma', luogo: 'Tech Hub', prezzo: 50, posti_disponibili: 10, immagine: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400' },
    { id: 3, titolo: 'Evento Passato (Test Recensioni)', categoria: 'Libri', descrizione: 'Un evento già concluso.', data: '2023-01-01', citta: 'Torino', luogo: 'Libreria', prezzo: 0, posti_disponibili: 0, immagine: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' }
  ];

  getEventi(): Observable<Evento[]> { return of(this.eventi); }
  getEventoById(id: number): Observable<Evento | undefined> { return of(this.eventi.find(e => e.id === id)); }
  getBookings(): Biglietto[] { return JSON.parse(localStorage.getItem('user_tickets') || '[]'); }
  
  subscribeToEvent(evento: Evento, email: string): Observable<any> {
    const tickets = this.getBookings();
    tickets.push({ id: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(), eventId: evento.id, eventTitolo: evento.titolo, userEmail: email, dataAcquisto: new Date().toISOString() });
    localStorage.setItem('user_tickets', JSON.stringify(tickets));
    return of({ success: true });
  }

  unsubscribe(ticketId: string): Observable<any> {
    const tickets = this.getBookings().filter(t => t.id !== ticketId);
    localStorage.setItem('user_tickets', JSON.stringify(tickets));
    return of({ success: true });
  }

  addReview(review: Recensione): Observable<any> {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return of({ success: true });
  }

  getOrganizerEvents(): Observable<Evento[]> { return of(this.eventi); }
}
