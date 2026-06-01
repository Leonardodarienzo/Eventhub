import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrganizerDashboardComponent } from './components/organizer/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'tickets', component: UserDashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'organizer', component: OrganizerDashboardComponent },
  { path: '**', redirectTo: '' }
];
