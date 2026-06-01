import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./components/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: 'organizer',
    loadComponent: () => import('./components/organizer/dashboard.component').then(m => m.OrganizerDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['organizer'] }
  },
];
