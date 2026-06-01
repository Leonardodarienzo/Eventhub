import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="bg-indigo-900 text-white p-4 flex justify-between items-center px-8 shadow-md">
      <a routerLink="/" class="text-2xl font-black italic">EventHub</a>
      <div class="flex items-center space-x-6 text-xs font-bold uppercase">
        <a routerLink="/" class="hover:text-indigo-300">Esplora</a>
        <div *ngIf="!auth.currentUser()">
          <a routerLink="/login" class="bg-white text-indigo-900 px-4 py-2 rounded shadow">Accedi</a>
        </div>
        <div *ngIf="auth.currentUser()" class="flex items-center space-x-4">
          <a routerLink="/tickets" class="hover:text-indigo-300">Miei Biglietti</a>
          <a routerLink="/profile" class="hover:text-indigo-300">Profilo</a>
          <button (click)="logout()" class="text-red-400">Esci</button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/']); }
}
