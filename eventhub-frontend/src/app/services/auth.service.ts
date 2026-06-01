import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const API_URL = 'http://127.0.0.1:5000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user_session') || 'null'));
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser() {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUserSubject.value?.access_token || null;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${API_URL}/public/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('user_session', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  register(data: any): Observable<any> {
    const payload = { email: data.email, username: data.nome, password: data.password };
    return this.http.post(`${API_URL}/public/register`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem('user_session', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  logout() {
    localStorage.removeItem('user_session');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value?.access_token;
  }
}
