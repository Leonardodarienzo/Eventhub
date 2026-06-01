import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
      <div class="max-w-md w-full bg-white p-8 rounded shadow-lg border-t-4 border-blue-600">
        <h2 class="text-2xl font-bold mb-2 text-center">LOGIN</h2>
        <div *ngIf="error" class="p-3 mb-4 bg-red-600 text-white text-xs font-bold rounded shadow">{{error}}</div>
        <form [formGroup]="f" (ngSubmit)="ok()">
          <input formControlName="email" type="email" placeholder="Email" class="w-full p-2 mb-4 border rounded">
          <input formControlName="password" type="password" placeholder="Password" class="w-full p-2 mb-4 border rounded">
          <button type="submit" [disabled]="f.invalid" class="w-full bg-blue-600 text-white p-3 font-bold rounded hover:bg-blue-700 transition">ENTRA ORA</button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600">Non hai un account? <a routerLink="/register" class="text-blue-600 font-bold underline">Registrati</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  f: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.f = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ok() {
    if (this.f.invalid) {
      return;
    }

    this.auth.login(this.f.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error = err.error?.error || 'Credenziali non valide';
      }
    });
  }
}
