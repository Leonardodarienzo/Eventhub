import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<any>(JSON.parse(localStorage.getItem('user_session') || 'null'));

  private getUsers(): any[] {
    const saved = localStorage.getItem('db_users');
    const users = saved ? JSON.parse(saved) : [];
    // SE IL DB È VUOTO, AGGIUNGIAMO UN UTENTE DI TEST AUTOMATICAMENTE
    if (users.length === 0) {
      const admin = { email: 'admin@test.it', password: '123', role: 'admin' };
      users.push(admin);
      localStorage.setItem('db_users', JSON.stringify(users));
    }
    return users;
  }

  register(data: any) {
    const users = this.getUsers();
    users.push({ email: data.email, password: data.password, role: 'user' });
    localStorage.setItem('db_users', JSON.stringify(users));
    console.log('REGISTRAZIONE AVVENUTA PER:', data.email);
  }

  login(credentials: any): boolean {
    const users = this.getUsers();
    console.log('UTENTI DISPONIBILI NEL DB:', users);

    const found = users.find((u: any) => 
      u.email.toLowerCase().trim() === credentials.email.toLowerCase().trim() && 
      u.password === credentials.password
    );

    if (found) {
      localStorage.setItem('user_session', JSON.stringify(found));
      this.currentUser.set(found);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('user_session');
    this.currentUser.set(null);
  }
}
