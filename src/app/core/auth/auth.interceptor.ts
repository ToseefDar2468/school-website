import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

const normalizeUrl = (url: string): string => url.replace(/\/+$/, '');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const apiUrl = normalizeUrl(environment.API_URL);
  const loginUrl = `${apiUrl}/auth/login`;

  if (!req.url.startsWith(apiUrl) || req.url.startsWith(loginUrl)) {
    return next(req);
  }

  const token = authService.getToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
