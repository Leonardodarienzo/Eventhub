import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6 max-w-md">
      <div class="bg-white rounded-lg shadow-md p-6" *ngIf="userProfile">
        <h1 class="text-2xl font-bold mb-4 text-gray-800">Il Tuo Profilo</h1>
        <p class="mb-2"><span class="font-semibold">Email:</span> {{ userProfile.email }}</p>
        <p class="mb-4"><span class="font-semibold">Ruolo:</span> {{ userProfile.role }}</p>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  userProfile: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.currentUserValue;
    if (user) {
      this.userProfile = user;
    }
  }
}