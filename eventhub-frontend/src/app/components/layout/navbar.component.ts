import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-gray-800 p-4 text-white flex justify-between items-center">
      <a routerLink="/" class="text-xl font-bold tracking-wider">EVENTHUB</a>
      <div class="flex space-x-4">
        <a routerLink="/" class="hover:text-gray-300">Home</a>
        <div *ngIf="!auth.currentUserValue">
          <a routerLink="/login" class="hover:text-gray-300 mr-4">Login</a>
          <a routerLink="/register" class="hover:text-gray-300">Registrati</a>
        </div>
        <div *ngIf="auth.currentUserValue" class="flex items-center space-x-4">
          <a routerLink="/tickets" class="hover:text-gray-300">I miei Biglietti</a>
          <a routerLink="/profile" class="hover:text-gray-300">Profilo</a>
          <button (click)="auth.logout()" class="bg-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}