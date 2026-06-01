import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Pannello Amministratore</h1>
      <p>Gestione globale della piattaforma EventHub.</p>
    </div>
  `
})
export class AdminComponent implements OnInit {
  constructor(private eventService: EventsService) {}

  ngOnInit(): void {}
}