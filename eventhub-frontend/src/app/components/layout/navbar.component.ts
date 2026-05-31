import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="bg-white border-b p-4 flex justify-between items-center px-8 shadow-sm">
      <a routerLink="/" class="text-2xl font-bold text-indigo-600 italic">EventHub</a>
      <div class="space-x-6 flex items-center">
        <a routerLink="/" class="hover:text-indigo-600 font-medium text-gray-700">Esplora</a>
        
        <!-- SE NON LOGGATO -->
        <div *ngIf="!auth.currentUser()" class="space-x-2">
           <a routerLink="/login" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">Accedi</a>
        </div>

        <!-- SE LOGGATO -->
        <div *ngIf="auth.currentUser()" class="flex items-center space-x-6">
           <span class="text-sm font-bold text-gray-700 uppercase">
             Ciao, {{ auth.currentUser().email.split('@')[0] }}
           </span>
           <button (click)="onLogout()" class="text-red-500 text-sm font-bold border border-red-200 px-3 py-1 rounded-md hover:bg-red-50">Esci</button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
