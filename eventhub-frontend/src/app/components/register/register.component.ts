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
    <div class="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div class="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-center">REGISTRAZIONE</h2>
        <form [formGroup]="f" (ngSubmit)="save()">
          <input formControlName="email" type="email" placeholder="Email" class="w-full p-2 mb-4 border">
          <input formControlName="password" type="password" placeholder="Password" class="w-full p-2 mb-4 border">
          <button type="submit" [disabled]="f.invalid" class="w-full bg-green-600 text-white p-2 font-bold uppercase">Crea Account</button>
        </form>
        <p class="mt-4 text-center">Hai già un account? <a routerLink="/login" class="text-blue-600 font-bold underline">Vai al Login</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  f: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.f = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  save() {
    this.auth.register(this.f.value);
    alert('ACCOUNT CREATO! ORA FAI IL LOGIN.');
    this.router.navigate(['/login']);
  }
}
