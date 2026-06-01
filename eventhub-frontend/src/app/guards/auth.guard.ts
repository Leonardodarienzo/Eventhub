import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const role = user.user?.role || user.role;
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles && !requiredRoles.includes(role)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
