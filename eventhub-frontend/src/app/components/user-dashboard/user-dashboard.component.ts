import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <div class="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">Profilo utente</h2>
          <div *ngIf="profile">
            <p><strong>Nome:</strong> {{ profile.username }}</p>
            <p><strong>Email:</strong> {{ profile.email }}</p>
            <p><strong>Ruolo:</strong> {{ profile.role }}</p>
          </div>
        </div>

        <div class="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">I tuoi biglietti</h2>
          <div *ngIf="tickets?.length; else noTickets">
            <div *ngFor="let ticket of tickets" class="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <p class="font-bold">{{ ticket.event_title }}</p>
              <p class="text-sm text-gray-500">{{ ticket.event_date | date:'fullDate' }} • {{ ticket.location }}</p>
              <img [src]="ticket.qr_code_base64" alt="QR Code" class="mt-4 w-44 h-44 object-contain" />
            </div>
          </div>
          <ng-template #noTickets>
            <p class="text-gray-500">Non hai ancora biglietti acquistati.</p>
          </ng-template>
        </div>
      </div>
      <div *ngIf="error" class="p-4 mb-4 rounded-xl bg-red-100 text-red-700">{{ error }}</div>
    </div>
  `
})
export class UserDashboard implements OnInit {
  profile: any = null;
  tickets: any[] = [];
  error = '';

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getProfile().subscribe({
      next: response => this.profile = response.user,
      error: err => this.error = err.error?.error || 'Impossibile caricare il profilo'
    });

    this.eventService.getMyTickets().subscribe({
      next: response => this.tickets = response.tickets,
      error: err => this.error = err.error?.error || 'Impossibile caricare i biglietti'
    });
  }
}
