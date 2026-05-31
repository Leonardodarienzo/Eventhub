import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { OrganizerDashboardComponent } from './components/organizer/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'organizer', component: OrganizerDashboardComponent },
];
