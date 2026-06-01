import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-8">Area Admin</h1>

      <div class="grid gap-6 lg:grid-cols-2 mb-8">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">Gestione utenti</h2>
          <div *ngIf="users?.length; else noUsers">
            <div *ngFor="let user of users" class="py-3 border-b last:border-b-0">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p class="font-bold">{{ user.username }} <span class="text-gray-500">({{ user.email }})</span></p>
                  <p class="text-xs text-gray-500">Ruolo: {{ user.role }} • Banned: {{ user.banned }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button class="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm" (click)="changeRole(user.id, 'organizer')">Organizer</button>
                  <button class="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm" (click)="changeRole(user.id, 'user')">User</button>
                  <button class="px-3 py-2 rounded-xl bg-red-600 text-white text-sm" (click)="banUser(user.id)">Ban</button>
                  <button class="px-3 py-2 rounded-xl bg-green-600 text-white text-sm" (click)="unbanUser(user.id)" *ngIf="user.banned">Unban</button>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noUsers>
            <p class="text-gray-500">Nessun utente trovato.</p>
          </ng-template>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">Recensioni segnalate</h2>
          <div *ngIf="flaggedReviews?.length; else noReviews">
            <div *ngFor="let review of flaggedReviews" class="py-3 border-b last:border-b-0">
              <p class="font-bold">{{ review.username }} su {{ review.event_title }}</p>
              <p class="text-sm text-gray-500">{{ review.comment }}</p>
              <div class="mt-2 flex gap-2">
                <button class="px-3 py-2 rounded-xl bg-red-600 text-white text-sm" (click)="deleteReview(review.review_id)">Elimina</button>
                <button class="px-3 py-2 rounded-xl bg-green-600 text-white text-sm" (click)="approveReview(review.review_id)">Approva</button>
              </div>
            </div>
          </div>
          <ng-template #noReviews>
            <p class="text-gray-500">Nessuna recensione segnalata al momento.</p>
          </ng-template>
        </div>
      </div>

      <div *ngIf="message" class="rounded-xl bg-green-100 p-4 text-green-700 mb-6">{{ message }}</div>
      <div *ngIf="error" class="rounded-xl bg-red-100 p-4 text-red-700 mb-6">{{ error }}</div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  flaggedReviews: any[] = [];
  message = '';
  error = '';

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadFlaggedReviews();
  }

  loadUsers() {
    this.eventService.getAdminUsers().subscribe({
      next: response => this.users = response.users,
      error: err => this.error = err.error?.error || 'Impossibile caricare gli utenti'
    });
  }

  loadFlaggedReviews() {
    this.eventService.getFlaggedReviews().subscribe({
      next: response => this.flaggedReviews = response.flagged_reviews,
      error: err => this.error = err.error?.error || 'Impossibile caricare le recensioni segnalate'
    });
  }

  changeRole(userId: number, role: string) {
    this.eventService.changeUserRole(userId, role).subscribe({
      next: () => {
        this.message = 'Ruolo aggiornato con successo';
        this.error = '';
        this.loadUsers();
      },
      error: err => this.error = err.error?.error || 'Errore durante la modifica ruolo'
    });
  }

  banUser(userId: number) {
    this.eventService.banUser(userId).subscribe({
      next: () => {
        this.message = 'Utente bannato con successo';
        this.error = '';
        this.loadUsers();
      },
      error: err => this.error = err.error?.error || 'Errore durante il ban'
    });
  }

  unbanUser(userId: number) {
    this.eventService.unbanUser(userId).subscribe({
      next: () => {
        this.message = 'Utente ripristinato con successo';
        this.error = '';
        this.loadUsers();
      },
      error: err => this.error = err.error?.error || 'Errore durante lo sblocco'
    });
  }

  deleteReview(reviewId: number) {
    this.eventService.deleteReview(reviewId).subscribe({
      next: () => {
        this.message = 'Recensione eliminata.';
        this.error = '';
        this.loadFlaggedReviews();
      },
      error: err => this.error = err.error?.error || 'Errore durante l\'eliminazione'
    });
  }

  approveReview(reviewId: number) {
    this.eventService.approveReview(reviewId).subscribe({
      next: () => {
        this.message = 'Recensione approvata.';
        this.error = '';
        this.loadFlaggedReviews();
      },
      error: err => this.error = err.error?.error || 'Errore durante l\'approvazione'
    });
  }
}
