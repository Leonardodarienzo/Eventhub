import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { EventDetailComponent } from './event-detail.component';
import { EventService } from '../../services/event.service';

const mockEventService = {
  getEventoById: () => ({
    id: 1,
    titolo: 'Evento di prova',
    descrizione: 'Descrizione evento di prova',
    data: '2024-06-01',
    citta: 'Test',
    luogo: 'Sede Test',
    prezzo: 0,
    posti_disponibili: 10,
    immagine: 'https://via.placeholder.com/800'
  })
};

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, EventDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: EventService, useValue: mockEventService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
