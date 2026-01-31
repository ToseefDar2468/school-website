import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'accessToken';

  login(email: string, password: string): Observable<LoginResponse> {
    const payload: LoginRequest = { email, password };

    return this.http
      .post<LoginResponse>(`${environment.API_URL}/auth/login`, payload)
      .pipe(tap((response) => this.storeToken(response.accessToken)));
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
