import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Dashboard Organizzatore</h1>
      
      <!-- Statistiche (Requisito PDF) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p class="text-gray-500 text-sm font-bold uppercase">Iscritti Totali</p>
          <p class="text-4xl font-black text-indigo-600">142</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p class="text-gray-500 text-sm font-bold uppercase">Incassi Stimati</p>
          <p class="text-4xl font-black text-green-600">€6.958</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p class="text-gray-500 text-sm font-bold uppercase">Rating Medio</p>
          <p class="text-4xl font-black text-orange-500">4.8 / 5</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">I tuoi Eventi</h2>
          <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Nuovo Evento</button>
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <th class="p-4">Evento</th>
              <th class="p-4">Stato</th>
              <th class="p-4">Azioni</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr class="border-t">
              <td class="p-4 font-bold">Masterclass Angular</td>
              <td class="p-4 text-green-500 font-bold">Attivo</td>
              <td class="p-4"><button class="text-indigo-600 font-bold">Esporta CSV</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class OrganizerDashboardComponent {}
