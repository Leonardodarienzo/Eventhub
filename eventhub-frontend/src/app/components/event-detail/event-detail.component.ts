import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-6" *ngIf="evento">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold mb-2">{{ evento.title }}</h1>
        <p class="text-gray-600 mb-4">{{ evento.description }}</p>
        <div class="mb-4">
          <span class="font-semibold">Data:</span> {{ evento.date }} <br>
          <span class="font-semibold">Luogo:</span> {{ evento.location }} <br>
          <span class="font-semibold">Prezzo:</span> {{ evento.price }}€
        </div>
        
        <div *ngIf="auth.currentUserValue" class="mt-6">
          <button (click)="prenotaBiglietto()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Prenota Biglietto
          </button>
        </div>
      </div>
    </div>
  `
})
export class EventDetailComponent implements OnInit {
  evento: any;
  rating: number = 5;
  commento: string = '';

  constructor(
    private route: ActivatedRoute, 
    private es: EventsService, 
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      // Convertiamo l'ID da stringa a numero per soddisfare il metodo getEventById(id: number)
      const idNum = Number(idStr);
      this.es.getEventById(idNum).subscribe(data => this.evento = data);
    }
  }

  prenotaBiglietto(): void {
    if (this.evento && this.auth.currentUserValue) {
      // Usiamo il tuo metodo reale bookTicket() passando l'id dell'evento
      this.es.bookTicket(Number(this.evento.id)).subscribe(() => {
        alert('Prenotazione completata con successo!');
      });
    }
  }

  lasciaRecensione(): void {
    if (this.evento && this.auth.currentUserValue) {
      const recensione = {
        rating: this.rating,
        comment: this.commento
      };
      this.es.addReview(Number(this.evento.id), recensione).subscribe(() => {
        alert('Recensione aggiunta!');
      });
    }
  }
}