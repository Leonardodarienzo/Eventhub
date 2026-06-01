import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="p-8"><h1>Area Admin</h1><p>Gestione recensioni e utenti.</p></div>'
})
export class AdminComponent {
  constructor(private eventService: EventService) {}
}
