export interface Evento {
  id: number;
  titolo: string;
  descrizione: string;
  data: string;
  citta: string;
  luogo: string;
  prezzo: number;
  categoria: string;
  posti_disponibili: number;
  immagine: string;
}
export interface Recensione {
  eventId: number;
  userEmail: string;
  rating: number;
  commento: string;
}
export interface Biglietto {
  id: string;
  eventId: number;
  eventTitolo: string;
  userEmail: string;
  dataAcquisto: string;
}
