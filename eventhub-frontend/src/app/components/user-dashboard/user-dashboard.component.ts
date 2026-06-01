import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto p-6">
      <h1 class="text-3xl font-black mb-8">I miei Biglietti</h1>
      <div *ngIf="tickets.length > 0; else noTickets" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let t of tickets" class="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
          <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=' + t.id" class="border p-1 bg-white">
          <div class="flex-1">
            <h3 class="font-bold text-xl">{{t.eventTitolo}}</h3>
            <p class="text-xs text-gray-400 font-mono">{{t.id}}</p>
            <button (click)="cancel(t.id)" class="mt-4 text-red-500 text-xs font-bold uppercase hover:underline">Disiscriviti</button>
          </div>
        </div>
      </div>
      <ng-template #noTickets><p class="italic text-gray-400 text-center py-20">Non hai ancora acquistato biglietti.</p></ng-template>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  tickets: any[] = [];
  constructor(private es: EventService, private auth: AuthService) {}
  ngOnInit() { this.load(); }
  load() { this.tickets = this.es.getBookings().filter(t => t.userEmail === this.auth.currentUser()?.email); }
  cancel(id: string) { if(confirm('Vuoi annullare la prenotazione?')) { this.es.unsubscribe(id).subscribe(() => this.load()); } }
}
