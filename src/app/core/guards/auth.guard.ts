import { signal } from '@angular/core';
import { CanMatchFn } from '@angular/router';

export const authGuard: CanMatchFn = () => {
  const isAuthenticated = signal(true);
  return isAuthenticated();
};
