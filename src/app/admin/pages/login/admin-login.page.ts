import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './admin-login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.authService
      .login(email, password)
      .pipe(
        take(1),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (error) => {
          const message = error?.error?.message;
          this.errorMessage.set(
            typeof message === 'string'
              ? message
              : 'Login failed. Please check your credentials and try again.'
          );
        }
      });
  }
}
