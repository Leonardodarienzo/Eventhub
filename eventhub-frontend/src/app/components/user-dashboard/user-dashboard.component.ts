import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">I Miei Biglietti Prenotati</h1>
      <div *ngIf="tickets.length === 0" class="text-gray-500">Non hai ancora prenotato nessun biglietto.</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div *ngFor="let t of tickets" class="border p-4 rounded shadow bg-white">
          <h2 class="text-xl font-semibold">Codice Biglietto: #{{ t.id }}</h2>
          <p class="text-gray-600 text-sm">ID Evento: {{ t.event_id }}</p>
        </div>
      </div>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  tickets: any[] = [];

  constructor(private es: EventsService, private auth: AuthService) {}

  ngOnInit(): void {
    // Usiamo il tuo metodo reale getMyTickets()
    // Sostituisci la chiamata errata con questa:
    this.es.getMyTickets().subscribe((data: any[]) => {
      this.tickets = data;
    });
  }
}