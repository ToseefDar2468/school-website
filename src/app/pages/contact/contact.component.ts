import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { delay, of } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly cards = [
    {
      title: 'Phone',
      value: '+92 000 0000000',
      description: 'Mon–Sat, 8:00 AM – 2:00 PM'
    },
    {
      title: 'Email',
      value: 'admissions@ivmhs.edu.pk',
      description: 'We reply within 1–2 working days'
    },
    {
      title: 'Address',
      value: 'Main Campus, Model Town, Lahore',
      description: 'Near City Center, Lahore'
    },
    {
      title: 'Timings',
      value: 'Monday – Saturday',
      description: '8:00 AM – 2:00 PM'
    }
  ] as const;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly successId = signal<string | null>(null);

  readonly formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  readonly isInvalid = computed(() => this.formStatus() === 'INVALID');

  private readonly submissions: Array<Record<string, string>> = [];

  submit(): void {
    this.submitted.set(true);
    this.successId.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = {
      ...this.form.getRawValue()
    };

    const requestId = `IVMHS-CONTACT-${Date.now().toString(36).toUpperCase()}`;
    this.submissions.push({ ...payload, requestId });

    of(requestId)
      .pipe(delay(800), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (id) => {
          this.successId.set(id);
          this.submitting.set(false);
          this.form.reset();
          this.submitted.set(false);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
  }

  hasError(controlName: keyof typeof this.form.controls, error: string): boolean {
    const control = this.form.get(controlName);
    if (!control) {
      return false;
    }
    return control.hasError(error) && (control.touched || this.submitted());
  }
}
