import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  // Definiamo l'URL base una volta sola
  private baseApi = 'https://organic-zebra-76jr9g4x6vw2x56j-5000.app.github.dev';

  constructor(private http: HttpClient) {}

  // Metodo singolo e corretto
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApi}/api/public/events`);
  }

  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseApi}/api/public/events/${id}`);
  }

  getMyTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApi}/api/user/tickets`);
  }

  bookTicket(eventId: number): Observable<any> {
    return this.http.post(`${this.baseApi}/api/user/tickets`, { event_id: eventId });
  }

  addReview(eventId: number, review: any): Observable<any> {
    return this.http.post(`${this.baseApi}/api/public/events/${eventId}/reviews`, review);
  }
}