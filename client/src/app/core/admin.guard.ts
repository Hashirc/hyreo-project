import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (authService.isAdmin()) {
      return true;
    } else {
      // Authenticated but not an admin -> Redirect to home page
      router.navigate(['/']);
      return false;
    }
  }

  // Not authenticated -> Redirect to admin login page
  router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
