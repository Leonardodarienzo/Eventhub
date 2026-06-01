import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUserValue;

  // 1. Se l'utente non è loggato, lo rimandiamo al login
  if (!currentUser) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 2. Controllo dei ruoli autorizzati
  const expectedRoles = route.data['roles'] as Array<string>;
  if (expectedRoles && !authService.hasRole(expectedRoles)) {
    // Loggato ma senza permessi: rimbalzato alla home
    router.navigate(['/']);
    return false;
  }

  return true;
};