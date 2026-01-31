import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginComponent {
  readonly email = signal('');
  readonly password = signal('');
  readonly isSubmitting = signal(false);

  updateEmail(value: string): void {
    this.email.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }

  submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.isSubmitting.set(false);
  }
}
