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
    <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div class="max-w-md w-full bg-white p-8 rounded shadow-lg border-t-4 border-indigo-600">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">ACCEDI</h2>
        
        <div *ngIf="error" class="p-3 mb-4 bg-red-600 text-white text-sm font-bold rounded">
          EMAIL O PASSWORD ERRATI!
        </div>

        <form [formGroup]="f" (ngSubmit)="onLogin()">
          <div class="mb-4">
            <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">Email</label>
            <input formControlName="email" type="email" class="w-full p-2 border rounded focus:outline-indigo-500">
          </div>
          <div class="mb-6">
            <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">Password</label>
            <input formControlName="password" type="password" class="w-full p-2 border rounded focus:outline-indigo-500">
          </div>
          <button type="submit" [disabled]="f.invalid" class="w-full bg-indigo-600 text-white p-3 font-bold rounded hover:bg-indigo-700 transition disabled:bg-gray-300">
            ENTRA
          </button>
        </form>

        <div class="mt-6 text-center border-t pt-4">
          <p class="text-sm text-gray-600">
            Non hai un account? 
            <a routerLink="/register" class="text-indigo-600 font-bold underline ml-1">Registrati qui</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  f: FormGroup;
  error = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.f = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    this.auth.login(this.f.value).subscribe({
      next: () => {
        this.error = false;
        this.router.navigate(['/']); // Ti manda alla Home
      },
      error: () => {
        this.error = true;
      }
    });
  }
}
