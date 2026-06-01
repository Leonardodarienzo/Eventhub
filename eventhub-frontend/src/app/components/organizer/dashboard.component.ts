import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-8">Dashboard Organizzatore</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Eventi pubblicati</p>
          <p class="text-4xl font-black text-indigo-600">{{ stats.events_count }}</p>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Iscritti totali</p>
          <p class="text-4xl font-black text-green-600">{{ stats.total_attendees }}</p>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Incassi stimati</p>
          <p class="text-4xl font-black text-orange-500">€{{ stats.estimated_revenue }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div class="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-bold">I tuoi eventi</h2>
              <p class="text-sm text-gray-500">Gestisci, modifica o elimina i tuoi eventi.</p>
            </div>
          </div>
          <div *ngIf="events.length; else noEvents">
            <div *ngFor="let event of events" class="mb-4 p-5 rounded-3xl border border-gray-100 bg-gray-50">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 class="text-lg font-bold">{{ event.titolo }}</h3>
                  <p class="text-sm text-gray-500">{{ event.data | date:'short' }} • {{ event.citta }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button (click)="exportCsv(event.id)" class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">Esporta CSV</button>
                  <button (click)="deleteEvent(event.id)" class="px-4 py-2 rounded-xl bg-red-500 text-white text-sm">Elimina</button>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noEvents>
            <p class="text-gray-500">Nessun evento ancora creato. Usa il modulo di creazione a destra per aggiungerne uno.</p>
          </ng-template>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-xl font-bold mb-4">Crea nuovo evento</h2>
          <form [formGroup]="eventForm" (ngSubmit)="submit()" class="space-y-4">
            <input formControlName="title" placeholder="Titolo" class="w-full p-3 border rounded-xl" />
            <textarea formControlName="description" rows="4" placeholder="Descrizione" class="w-full p-3 border rounded-xl"></textarea>
            <input formControlName="date" type="datetime-local" class="w-full p-3 border rounded-xl" />
            <input formControlName="location" placeholder="Luogo" class="w-full p-3 border rounded-xl" />
            <select formControlName="category" class="w-full p-3 border rounded-xl">
              <option value="">Seleziona categoria</option>
              <option value="concerto">Concerto</option>
              <option value="workshop">Workshop</option>
              <option value="presentazione_libro">Presentazione libro</option>
            </select>
            <div class="grid grid-cols-2 gap-4">
              <input formControlName="price" type="number" min="0" placeholder="Prezzo" class="w-full p-3 border rounded-xl" />
              <input formControlName="total_seats" type="number" min="1" placeholder="Posti totali" class="w-full p-3 border rounded-xl" />
            </div>
            <input type="file" (change)="onFileChange($event)" class="w-full text-sm text-gray-500" />
            <button type="submit" [disabled]="eventForm.invalid" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Crea Evento</button>
          </form>
          <p *ngIf="successMessage" class="mt-4 text-green-700">{{ successMessage }}</p>
          <p *ngIf="error" class="mt-4 text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  `
})
export class OrganizerDashboardComponent implements OnInit {
  events: any[] = [];
  stats = { events_count: 0, total_attendees: 0, estimated_revenue: 0, average_rating: 0 };
  eventForm: FormGroup;
  selectedCover: File | null = null;
  successMessage = '';
  error = '';

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      total_seats: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.refreshDashboard();
  }

  refreshDashboard() {
    this.eventService.getOrganizerDashboard().subscribe({
      next: response => {
        this.stats = response.stats;
      },
      error: err => {
        this.error = err.error?.error || 'Impossibile caricare le statistiche';
      }
    });

    this.eventService.getOrganizerEvents().subscribe({
      next: response => {
        this.events = response.events.map((event: any) => ({
          ...event,
          data: event.date,
          citta: event.location.split(',').pop()?.trim() || event.location,
          titolo: event.title
        }));
      },
      error: err => {
        this.error = err.error?.error || 'Impossibile caricare gli eventi';
      }
    });
  }

  onFileChange(event: any) {
    this.selectedCover = event.target.files?.[0] || null;
  }

  submit() {
    if (!this.eventForm.valid) {
      return;
    }

    const formData = new FormData();
    Object.entries(this.eventForm.value).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? '');
    });

    if (this.selectedCover) {
      formData.append('cover_image', this.selectedCover, this.selectedCover.name);
    }

    this.eventService.createEvent(formData).subscribe({
      next: () => {
        this.successMessage = 'Evento creato con successo!';
        this.error = '';
        this.eventForm.reset({ price: 0, total_seats: 1 });
        this.selectedCover = null;
        this.refreshDashboard();
      },
      error: err => {
        this.error = err.error?.error || 'Impossibile creare l\'evento';
        this.successMessage = '';
      }
    });
  }

  deleteEvent(eventId: number) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.successMessage = 'Evento cancellato con successo';
        this.error = '';
        this.refreshDashboard();
      },
      error: err => {
        this.error = err.error?.error || 'Errore durante l\'eliminazione';
      }
    });
  }

  exportCsv(eventId: number) {
    this.eventService.exportEventCsv(eventId).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `event_${eventId}_attendees.csv`;
        link.click();
      },
      error: err => {
        this.error = err.error?.error || 'Errore durante i download CSV';
      }
    });
  }
}
