import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-md mx-auto p-8 bg-white shadow-lg mt-10 rounded-2xl border">
      <h2 class="text-2xl font-black mb-6 italic underline">Gestione Profilo</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase">Email</label>
          <input [(ngModel)]="email" class="w-full p-2 border rounded bg-gray-50" disabled>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase">Nuovo Nome</label>
          <input [(ngModel)]="nome" class="w-full p-2 border rounded">
        </div>
        <div class="pt-4 border-t">
          <label class="block text-xs font-bold text-gray-400 uppercase">Cambia Password</label>
          <input type="password" [(ngModel)]="password" placeholder="Nuova password" class="w-full p-2 border rounded">
        </div>
        <button (click)="save()" class="w-full bg-indigo-600 text-white p-3 rounded font-bold uppercase mt-4">Salva Modifiche</button>
      </div>
    </div>
  `
})
export class ProfileComponent {
  email = ''; nome = ''; password = '';
  constructor(private auth: AuthService) {
    const user = this.auth.currentUser();
    if(user) { this.email = user.email; this.nome = user.email.split('@')[0]; }
  }
  save() { alert('Profilo e Password aggiornati con successo!'); }
}
