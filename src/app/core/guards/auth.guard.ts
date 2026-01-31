import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

const buildReturnUrl = (segments: { path: string }[], fallback: string): string => {
  if (!segments.length) {
    return fallback;
  }

  return `/${segments.map((segment) => segment.path).join('/')}`;
};

export const authGuard: CanMatchFn = (_route, segments) => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return true;
  }

  const router = inject(Router);
  const navigationUrl = router.getCurrentNavigation()?.extractedUrl?.toString();
  const returnUrl = navigationUrl ?? buildReturnUrl(segments, '/admin');

  return router.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl }
  });
};
