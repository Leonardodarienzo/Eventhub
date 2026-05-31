import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="p-8 text-center"><h1 class="text-2xl font-bold">Dettaglio Evento</h1><p>Qui vedrai le info dell evento selezionato.</p></div>'
})
export class EventDetailComponent {}