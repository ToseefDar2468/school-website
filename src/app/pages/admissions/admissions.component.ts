import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { delay, of } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './admissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly classes = ['Playgroup', 'Nursery', 'Prep', 'Primary', 'Middle', 'Matric'] as const;

  readonly requirements = [
    'Completed inquiry form and admission request.',
    'Recent passport-size photographs (student & parents).',
    'Previous school report card (if applicable).',
    'Copy of B-Form or birth certificate.'
  ] as const;

  readonly documents = [
    'Student CNIC/B-Form copy',
    'Parent/guardian CNIC copy',
    'Transfer certificate (if applicable)',
    'Medical form and immunization record'
  ] as const;

  readonly steps = [
    'Submit inquiry form',
    'Campus visit & counseling',
    'Assessment (if required)',
    'Confirmation & fee submission'
  ] as const;

  readonly form = this.fb.nonNullable.group({
    studentName: ['', [Validators.required]],
    parentName: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
    classInterested: ['', [Validators.required]],
    cityArea: [''],
    message: ['']
  });

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly successId = signal<string | null>(null);

  readonly formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  readonly isInvalid = computed(() => this.formStatus() === 'INVALID');

  private readonly submissions: Array<Record<string, string>> = [];

  constructor() {
    const classParam = toSignal(this.route.queryParamMap, { initialValue: null });

    effect(() => {
      const params = classParam();
      const selected = params?.get('class');
      if (!selected) {
        return;
      }
      const match = this.classes.find((item) => item.toLowerCase() === selected.toLowerCase());
      if (match) {
        this.form.patchValue({ classInterested: match });
      }
    });
  }

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

    const inquiryId = `IVMHS-${Date.now().toString(36).toUpperCase()}`;
    this.submissions.push({ ...payload, inquiryId });

    of(inquiryId)
      .pipe(delay(900), takeUntilDestroyed(this.destroyRef))
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
