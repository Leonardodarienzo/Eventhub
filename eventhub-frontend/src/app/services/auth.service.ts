import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  is_banned: boolean;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://organic-zebra-76jr9g4x6vw2x56j-5000.app.github.dev/api/auth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('eh_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get accessToken(): string | null {
    return localStorage.getItem('eh_access_token');
  }

  register(userData: unknown): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: unknown): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('eh_access_token', response.access_token);
        localStorage.setItem('eh_refresh_token', response.refresh_token);
        localStorage.setItem('eh_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('eh_access_token');
    localStorage.removeItem('eh_refresh_token');
    localStorage.removeItem('eh_user');
    this.currentUserSubject.next(null);
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return roles.includes(user.role);
  }
}