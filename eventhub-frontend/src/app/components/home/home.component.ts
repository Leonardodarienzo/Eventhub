import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Evento } from '../../models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 italic underline">EventHub - Prossimi Eventi</h1>
      
      <div class="bg-indigo-50 p-6 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm border border-indigo-100">
        <input [(ngModel)]="filtroTitolo" (input)="applicaFiltri()" placeholder="Cerca per titolo..." class="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none">
        
        <select [(ngModel)]="filtroCategoria" (change)="applicaFiltri()" class="p-2 border rounded-lg">
          <option value="">Tutte le categorie</option>
          <option *ngFor="let cat of categorie" [value]="cat">{{ cat }}</option>
        </select>

        <select [(ngModel)]="filtroCitta" (change)="applicaFiltri()" class="p-2 border rounded-lg">
          <option value="">Tutte le città</option>
          <option *ngFor="let city of citta" [value]="city">{{ city }}</option>
        </select>

        <input [(ngModel)]="filtroPrezzo" (input)="applicaFiltri()" type="number" placeholder="Prezzo max €" class="p-2 border rounded-lg">
      </div>

      <div *ngIf="isLoading" class="text-center py-16 text-gray-500">Caricamento eventi...</div>
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div *ngFor="let ev of eventiFiltrati" class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:scale-105 transition-transform duration-300">
          <img [src]="ev.immagine" class="w-full h-48 object-cover">
          <div class="p-5">
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-widest">{{ev.categoria}}</span>
            <h2 class="text-xl font-bold mt-1 text-gray-900">{{ev.titolo}}</h2>
            <p class="text-gray-500 text-sm mt-1">{{ev.data | date:'dd/MM/yyyy'}} • {{ev.citta}}</p>
            <div class="mt-4 flex justify-between items-center border-t pt-4">
              <span class="text-lg font-black text-gray-900">{{ ev.prezzo === 0 ? 'Gratis' : ev.prezzo + ' €' }}</span>
              <button [routerLink]="['/event', ev.id]" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Vedi Dettagli</button>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!isLoading && eventiFiltrati.length === 0" class="text-center py-20 text-gray-400 italic">Nessun evento trovato...</div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  eventi: Evento[] = [];
  eventiFiltrati: Evento[] = [];
  isLoading = true;

  filtroTitolo: string = '';
  filtroCategoria: string = '';
  filtroCitta: string = '';
  filtroPrezzo: number | null = null;

  categorie: string[] = [];
  citta: string[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEventi().subscribe({
      next: events => {
        this.eventi = events;
        this.eventiFiltrati = events;
        this.categorie = this.getUnique(events.map(ev => ev.categoria));
        this.citta = this.getUnique(events.map(ev => ev.citta));
        this.isLoading = false;
      },
      error: () => {
        this.eventi = [];
        this.eventiFiltrati = [];
        this.categorie = [];
        this.citta = [];
        this.isLoading = false;
      }
    });
  }

  getUnique(values: string[]): string[] {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'it'));
  }

  applicaFiltri() {
    this.eventiFiltrati = this.eventi.filter(ev => {
      const matchTitolo = ev.titolo.toLowerCase().includes(this.filtroTitolo.toLowerCase());
      const matchCat = this.filtroCategoria === '' || ev.categoria === this.filtroCategoria;
      const matchCitta = this.filtroCitta === '' || ev.citta === this.filtroCitta;
      const matchPrezzo = this.filtroPrezzo === null || ev.prezzo <= this.filtroPrezzo;
      return matchTitolo && matchCat && matchCitta && matchPrezzo;
    });
  }
}
