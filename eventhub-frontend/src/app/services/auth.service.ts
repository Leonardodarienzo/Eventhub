import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const API_URL = '/api';

interface StoredSession {
  access_token: string;
  refresh_token: string;
  user: { id: number; email: string; username: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();
  
  private loadUser(): any {
    const session = localStorage.getItem('user_session');
    if (!session) return null;
    try {
      const parsed = JSON.parse(session) as StoredSession;
      return parsed.user;
    } catch {
      return null;
    }
  }

  constructor(private http: HttpClient) {}

  get currentUser() {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    const session = localStorage.getItem('user_session');
    if (!session) return null;
    try {
      return (JSON.parse(session) as StoredSession).access_token;
    } catch {
      return null;
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${API_URL}/public/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('user_session', JSON.stringify(response));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: any): Observable<any> {
    const payload = { email: data.email, username: data.username, password: data.password };
    return this.http.post(`${API_URL}/public/register`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem('user_session', JSON.stringify(response));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('user_session');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const session = localStorage.getItem('user_session');
    if (!session) return false;
    try {
      return !!(JSON.parse(session) as StoredSession).access_token;
    } catch {
      return false;
    }
  }
}
