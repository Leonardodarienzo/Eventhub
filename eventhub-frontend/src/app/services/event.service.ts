import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../models/event.model';

const API_URL = '/api';

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

  subscribeToEvent(eventId: number) {
    return this.http.post(`${API_URL}/user/subscribe/${eventId}`, {});
  }

  getMyTickets() {
    return this.http.get<{ tickets: any[] }>(`${API_URL}/user/tickets`);
  }

  getProfile() {
    return this.http.get<{ user: any }>(`${API_URL}/user/profile`);
  }

  getOrganizerDashboard() {
    return this.http.get<{ organizer: any; stats: any }>(`${API_URL}/organizer/dashboard`);
  }

  getOrganizerEvents() {
    return this.http.get<{ events: any[] }>(`${API_URL}/organizer/events`);
  }

  createEvent(payload: FormData) {
    return this.http.post(`${API_URL}/organizer/events`, payload);
  }

  deleteEvent(eventId: number) {
    return this.http.delete(`${API_URL}/organizer/events/${eventId}`);
  }

  exportEventCsv(eventId: number) {
    return this.http.get(`${API_URL}/organizer/events/${eventId}/export-csv`, { responseType: 'blob' });
  }

  getAdminUsers() {
    return this.http.get<{ users: any[] }>(`${API_URL}/admin/users`);
  }

  getFlaggedReviews() {
    return this.http.get<{ flagged_reviews: any[] }>(`${API_URL}/admin/reviews/flagged`);
  }

  flagReview(reviewId: number) {
    return this.http.post(`${API_URL}/user/reviews/${reviewId}/flag`, {});
  }

  changeUserRole(userId: number, role: string) {
    return this.http.put(`${API_URL}/admin/users/${userId}/role`, { role });
  }

  banUser(userId: number) {
    return this.http.put(`${API_URL}/admin/users/${userId}/ban`, {});
  }

  unbanUser(userId: number) {
    return this.http.put(`${API_URL}/admin/users/${userId}/unban`, {});
  }

  private normalizeEvent(event: any): Evento {
    const locationParts = (event.location || '').split(',').map((part: string) => part.trim()).filter((part: string) => part.length > 0);
    const city = locationParts.length > 1 ? locationParts[locationParts.length - 1] : locationParts[0] || 'Sconosciuta';

    return {
      id: event.id,
      titolo: event.title,
      descrizione: event.description,
      data: event.date,
      citta: city,
      luogo: event.location,
      prezzo: event.price,
      categoria: event.category,
      posti_disponibili: event.available_seats,
      immagine: event.cover_image || 'https://via.placeholder.com/800'
    };
  }
}
