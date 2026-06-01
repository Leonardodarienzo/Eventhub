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
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex gap-4 mb-8 bg-gray-100 p-4 rounded-xl">
        <input [(ngModel)]="search" (input)="filter()" placeholder="Cerca..." class="flex-1 p-2 border rounded">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let ev of filtered" class="bg-white border rounded-xl overflow-hidden shadow-sm">
          <img [src]="ev.immagine" class="w-full h-40 object-cover">
          <div class="p-4">
            <h3 class="font-bold text-xl">{{ev.titolo}}</h3>
            <button [routerLink]="['/event', ev.id]" class="bg-indigo-600 text-white px-3 py-1 mt-4 rounded">Dettagli</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  all: Evento[] = []; filtered: Evento[] = []; search = '';
  constructor(private es: EventService) {}
  ngOnInit() { 
    this.es.getEventi().subscribe(data => {
      this.all = data;
      this.filtered = data;
    });
  }
  filter() {
    this.filtered = this.all.filter(e => e.titolo.toLowerCase().includes(this.search.toLowerCase()));
  }
}
