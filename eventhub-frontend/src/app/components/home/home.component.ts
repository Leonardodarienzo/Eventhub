import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/event.service'; // Assicurati che il percorso sia quello giusto

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  events: any[] = []; // Qui vengono salvati gli eventi

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    // Questa riga è il motore che prende i dati dal backend
    this.eventsService.getEvents().subscribe({
      next: (data) => {
        this.events = data; 
        console.log('Eventi ricevuti dal server:', data);
      },
      error: (err) => {
        console.error('Errore di connessione:', err);
      }
    });
  }
}