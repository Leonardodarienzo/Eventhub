import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../models/event.model';

const API_URL = 'http://127.0.0.1:5000/api';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  getEventi(): Observable<Evento[]> {
    return this.http.get<{ events: any[] }>(`${API_URL}/public/events`).pipe(
      map(response => response.events.map(event => this.normalizeEvent(event)))
    );
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<{ event: any }>(`${API_URL}/public/events/${id}`).pipe(
      map(response => this.normalizeEvent(response.event))
    );
  }

  private normalizeEvent(event: any): Evento {
    return {
      id: event.id,
      titolo: event.title,
      descrizione: event.description,
      data: event.date,
      citta: event.location.split(',')[0] || event.location,
      luogo: event.location,
      prezzo: event.price,
      categoria: event.category,
      posti_disponibili: event.available_seats,
      immagine: event.cover_image || 'https://via.placeholder.com/800'
    };
  }
}
