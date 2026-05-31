import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Evento } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-6" *ngIf="evento">
      <a routerLink="/" class="text-indigo-600 font-bold mb-4 inline-block">← Torna alla lista</a>
      <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <img [src]="evento.immagine" class="w-full h-80 object-cover">
        <div class="p-8">
          <div class="flex justify-between items-center mb-4">
             <h1 class="text-4xl font-black text-gray-900">{{evento.titolo}}</h1>
             <span class="bg-green-100 text-green-700 px-4 py-1 rounded-full font-bold text-sm">Posti: {{evento.posti_disponibili}}</span>
          </div>
          <p class="text-gray-600 text-lg leading-relaxed mb-8">{{evento.descrizione}}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase">Quando e Dove</p>
              <p class="font-bold text-gray-800">{{evento.data | date:'fullDate'}}</p>
              <p class="text-gray-600">{{evento.luogo}}, {{evento.citta}}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase">Prezzo Biglietto</p>
              <p class="text-3xl font-black text-indigo-600">{{evento.prezzo === 0 ? 'Gratis' : evento.prezzo + ' €'}}</p>
            </div>
          </div>
          
          <button class="w-full bg-indigo-600 text-white mt-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-indigo-700 transition">
            Acquista Biglietto
          </button>
        </div>
      </div>
    </div>
  `
})
export class EventDetailComponent implements OnInit {
  evento: Evento | undefined;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.evento = this.eventService.getEventoById(id);
  }
}
