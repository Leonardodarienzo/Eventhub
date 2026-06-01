import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { Evento } from '../../models/event.model';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <h1 class="text-3xl font-black mb-6 italic underline">Dashboard Organizzatore</h1>
      <div class="bg-white border rounded-xl overflow-hidden shadow-md">
        <div class="bg-gray-100 p-4 font-bold border-b">I Tuoi Eventi Pubblicati</div>
        <div *ngFor="let ev of eventi" class="p-4 border-b flex justify-between items-center">
          <div>
            <p class="font-bold">{{ev.titolo}}</p>
            <p class="text-xs text-gray-500">{{ev.citta}} - {{ev.data}}</p>
          </div>
          <button (click)="export(ev.id)" class="bg-indigo-600 text-white px-4 py-1 rounded text-xs font-bold uppercase">Esporta Iscritti (CSV)</button>
        </div>
      </div>
    </div>
  `
})
export class OrganizerDashboardComponent implements OnInit {
  eventi: Evento[] = [];
  constructor(private es: EventService) {}
  ngOnInit() { 
    this.es.getOrganizerEvents().subscribe((data: Evento[]) => {
      this.eventi = data;
    });
  }
  export(id: number) { alert('Esportazione CSV avviata per evento ID: ' + id); }
}
