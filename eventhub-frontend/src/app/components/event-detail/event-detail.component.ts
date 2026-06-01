import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6" *ngIf="evento">
      <div class="bg-white rounded-3xl shadow-xl overflow-hidden border">
        <img [src]="evento.immagine" class="w-full h-64 object-cover">
        <div class="p-8">
          <h1 class="text-4xl font-black mb-2">{{evento.titolo}}</h1>
          <p class="text-gray-500 mb-6">{{evento.data | date:'fullDate'}} - {{evento.citta}}</p>
          
          <div *ngIf="auth.currentUser(); else loginMsg">
            <button *ngIf="!isPastEvent()" (click)="book()" class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Iscriviti Ora</button>
            
            <!-- RECENSIONI (Solo se evento passato) -->
            <div *ngIf="isPastEvent()" class="mt-10 p-6 bg-gray-50 rounded-2xl">
              <h3 class="font-bold text-xl mb-4 text-indigo-700">Lascia una recensione</h3>
              <select [(ngModel)]="rating" class="p-2 border rounded mb-2 w-full">
                <option [ngValue]="5">5 Stelle - Eccellente</option>
                <option [ngValue]="4">4 Stelle - Molto buono</option>
                <option [ngValue]="3">3 Stelle - Buono</option>
                <option [ngValue]="2">2 Stelle - Sufficiente</option>
                <option [ngValue]="1">1 Stella - Scarso</option>
              </select>
              <textarea [(ngModel)]="commento" placeholder="Scrivi un commento..." class="w-full p-2 border rounded mb-2"></textarea>
              <button (click)="sendReview()" class="bg-gray-800 text-white px-4 py-2 rounded font-bold">Invia Recensione</button>
            </div>
          </div>
          
          <ng-template #loginMsg>
            <div class="p-4 bg-yellow-50 rounded-xl text-center font-bold">Accedi per prenotare o recensire.</div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class EventDetailComponent implements OnInit {
  evento: any; rating = 5; commento = '';
  constructor(private route: ActivatedRoute, private es: EventService, public auth: AuthService) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.es.getEventoById(id).subscribe(d => this.evento = d);
  }
  isPastEvent() { return new Date(this.evento.data) < new Date(); }
  book() { this.es.subscribeToEvent(this.evento, this.auth.currentUser().email).subscribe(() => alert('Iscritto!')); }
  sendReview() {
    this.es.addReview({ eventId: this.evento.id, userEmail: this.auth.currentUser().email, rating: this.rating, commento: this.commento }).subscribe(() => alert('Recensione inviata!'));
  }
}
