import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<any>(JSON.parse(localStorage.getItem('user_session') || 'null'));

  private getDbUsers(): any[] {
    const saved = localStorage.getItem('db_users');
    const users = saved ? JSON.parse(saved) : [];
    // Se non c'è nessuno, aggiungiamo un utente admin di default
    if (users.length === 0) {
      users.push({ email: 'admin@test.it', password: '123', role: 'admin' });
      localStorage.setItem('db_users', JSON.stringify(users));
    }
    return users;
  }

  register(data: any): Observable<any> {
    const users = this.getDbUsers();
    users.push({ ...data, role: 'user' });
    localStorage.setItem('db_users', JSON.stringify(users));
    return of({ success: true });
  }

  login(credentials: any): Observable<any> {
    const users = this.getDbUsers();
    const found = users.find((u: any) => 
      u.email.toLowerCase().trim() === credentials.email.toLowerCase().trim() && 
      u.password === credentials.password
    );

    if (found) {
      localStorage.setItem('user_session', JSON.stringify(found));
      this.currentUser.set(found);
      return of(found);
    }
    return throwError(() => new Error('Errore'));
  }

  logout() {
    localStorage.removeItem('user_session');
    this.currentUser.set(null);
  }
}
