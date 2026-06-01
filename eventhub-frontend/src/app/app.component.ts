import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // IMPORTANTE: NavbarComponent e RouterModule devono essere presenti qui
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-navbar></app-navbar>
      
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  title = 'EventHub';
}