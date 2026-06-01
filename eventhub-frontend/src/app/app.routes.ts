import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { OrganizerDashboardComponent } from './components/organizer/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'tickets', component: UserDashboardComponent },
  { path: 'organizer-dashboard', component: OrganizerDashboardComponent },
  { path: 'admin-dashboard', component: AdminComponent },
  { path: '**', redirectTo: '' }
];