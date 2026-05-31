import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center p-10">
      <div class="bg-white border-2 border-dashed border-gray-300 p-8 rounded-xl shadow-lg text-center max-w-sm">
        <h2 class="text-2xl font-bold mb-4">Il tuo Biglietto</h2>
        <div class="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
          <!-- Placeholder per QR Code -->
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12345" alt="QR Code">
        </div>
        <p class="font-mono text-gray-500">ID: EVENT-9921-X</p>
        <p class="mt-4 font-bold text-lg">Masterclass Angular</p>
      </div>
    </div>
  `
})
export class TicketComponent {}
