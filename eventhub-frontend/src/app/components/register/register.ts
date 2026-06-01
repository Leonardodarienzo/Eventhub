import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div class="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Crea il tuo Account</h2>
          <p class="mt-2 text-sm text-gray-500">Unisciti a EventHub per partecipare ai migliori eventi</p>
        </div>
        <div *ngIf="error" class="p-3 mb-4 bg-red-600 text-white text-xs font-bold rounded shadow">{{ error }}</div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input formControlName="nome" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Mario Rossi">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input formControlName="email" type="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="mario@esempio.it">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input formControlName="password" type="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="••••••••">
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all">
            Registrati
          </button>
        </form>

        <div class="text-center text-sm text-gray-600">
          Hai già un account? <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Torna al login</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.auth.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error = err.error?.error || 'Impossibile registrare l’utente';
      }
    });
  }
}