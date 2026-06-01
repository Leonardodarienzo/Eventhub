import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/event.service';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Dashboard Organizzatore</h1>
      <p>Gestisci i tuoi eventi e monitora le vendite dei biglietti.</p>
    </div>
  `
})
export class OrganizerDashboardComponent implements OnInit {
  constructor(private es: EventsService) {}

  ngOnInit(): void {}
}