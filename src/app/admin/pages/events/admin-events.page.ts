import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, finalize, map, of, shareReplay, switchMap, take, tap } from 'rxjs';

import { Event } from '../../../core/models/event.model';
import { EventsApiService } from '../../../core/api/events-api.service';
import { EventUpsertDto } from '../../../core/api/events-api.models';
import { ConfirmDialogService } from '../../../core/ui/confirm-dialog/confirm-dialog.service';
import { ToastService } from '../../../core/ui/toast/toast.service';
import { AdminModalComponent } from '../../components/admin-modal/admin-modal.component';

interface EventFormValue {
  title: string;
  description: string;
  dateISO: string;
  venue: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
}

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, AdminModalComponent],
  templateUrl: './admin-events.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEventsPage {
  private readonly eventsApi = inject(EventsApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly toastService = inject(ToastService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly formOpenSubject = new BehaviorSubject<boolean>(false);
  private readonly editingEventSubject = new BehaviorSubject<Event | null>(null);
  private readonly deleteTargetSubject = new BehaviorSubject<Event | null>(null);
  private readonly savingSubject = new BehaviorSubject<boolean>(false);
  private readonly deletingSubject = new BehaviorSubject<boolean>(false);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dateISO: new FormControl(this.todayInput(), { nonNullable: true, validators: [Validators.required] }),
    venue: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    coverImageUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    galleryImageUrls: this.buildGalleryArray([''])
  });

  readonly events$ = this.refresh$.pipe(
    tap(() => {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
    }),
    switchMap(() =>
      this.eventsApi.getEvents().pipe(
        map((events) =>
          events
            .slice()
            .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
        ),
        catchError(() => {
          this.errorSubject.next('Unable to load events. Please try again.');
          this.toastService.error('Unable to load events.');
          return of([] as Event[]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
    ),
    shareReplay(1)
  );

  readonly vm$ = combineLatest({
    events: this.events$,
    isLoading: this.loadingSubject,
    errorMessage: this.errorSubject,
    formOpen: this.formOpenSubject,
    editingEvent: this.editingEventSubject,
    deleteTarget: this.deleteTargetSubject,
    isSaving: this.savingSubject,
    isDeleting: this.deletingSubject
  });

  openCreate(): void {
    this.editingEventSubject.next(null);
    this.resetForm(this.defaultFormValue());
    this.formOpenSubject.next(true);
  }

  openEdit(event: Event): void {
    this.editingEventSubject.next(event);
    this.resetForm({
      title: event.title,
      description: event.description,
      dateISO: this.toDateInput(event.dateISO),
      venue: event.venue,
      coverImageUrl: event.coverImageUrl,
      galleryImageUrls: event.galleryImageUrls ?? []
    });
    this.formOpenSubject.next(true);
  }

  closeForm(): void {
    this.formOpenSubject.next(false);
    this.editingEventSubject.next(null);
    this.resetForm(this.defaultFormValue());
  }

  submit(): void {
    this.errorSubject.next(null);

    if (this.savingSubject.getValue()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.toDto(this.form.getRawValue());
    const editingEvent = this.editingEventSubject.getValue();

    this.savingSubject.next(true);

    const request$ = editingEvent
      ? this.eventsApi.adminUpdateEvent(editingEvent.id, dto)
      : this.eventsApi.adminCreateEvent(dto);

    request$
      .pipe(finalize(() => this.savingSubject.next(false)))
      .subscribe({
        next: () => {
          this.closeForm();
          this.refresh$.next();
          this.toastService.success(
            editingEvent ? 'Event updated successfully.' : 'Event created successfully.'
          );
        },
        error: () => {
          this.errorSubject.next('Unable to save event. Please try again.');
          this.toastService.error('Unable to save event.');
        }
      });
  }

  openDelete(event: Event): void {
    this.confirmDialog
      .confirm({
        title: 'Delete event',
        message: `Are you sure you want to delete "${event.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        intent: 'danger'
      })
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.deleteTargetSubject.next(event);
        this.deletingSubject.next(true);
        this.errorSubject.next(null);

        this.eventsApi
          .adminDeleteEvent(event.id)
          .pipe(finalize(() => this.deletingSubject.next(false)))
          .subscribe({
            next: () => {
              this.deleteTargetSubject.next(null);
              this.refresh$.next();
              this.toastService.success('Event deleted successfully.');
            },
            error: () => {
              this.errorSubject.next('Unable to delete event. Please try again.');
              this.toastService.error('Unable to delete event.');
            }
          });
      });
  }

  addGalleryUrl(): void {
    this.galleryArray.push(this.createUrlControl(''));
  }

  removeGalleryUrl(index: number): void {
    if (this.galleryArray.length <= 1) {
      this.galleryArray.at(0).setValue('');
      return;
    }
    this.galleryArray.removeAt(index);
  }

  get galleryControls(): FormControl<string>[] {
    return this.galleryArray.controls;
  }

  private get galleryArray(): FormArray<FormControl<string>> {
    return this.form.controls.galleryImageUrls;
  }

  private resetForm(value: EventFormValue): void {
    this.form.reset({
      title: value.title,
      description: value.description,
      dateISO: value.dateISO,
      venue: value.venue,
      coverImageUrl: value.coverImageUrl
    });
    this.setGalleryUrls(value.galleryImageUrls);
  }

  private buildGalleryArray(urls: string[]): FormArray<FormControl<string>> {
    const values = urls.length ? urls : [''];
    return new FormArray(values.map((url) => this.createUrlControl(url)));
  }

  private setGalleryUrls(urls: string[]): void {
    const values = urls.length ? urls : [''];
    this.galleryArray.clear();
    values.forEach((url) => this.galleryArray.push(this.createUrlControl(url)));
  }

  private createUrlControl(value: string): FormControl<string> {
    return new FormControl(value, { nonNullable: true });
  }

  private defaultFormValue(): EventFormValue {
    return {
      title: '',
      description: '',
      dateISO: this.todayInput(),
      venue: '',
      coverImageUrl: '',
      galleryImageUrls: ['']
    };
  }

  private todayInput(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private toDateInput(value: string): string {
    return value ? value.slice(0, 10) : this.todayInput();
  }

  private toDto(value: EventFormValue): EventUpsertDto {
    const normalizedDate = value.dateISO.includes('T')
      ? value.dateISO
      : new Date(`${value.dateISO}T00:00:00Z`).toISOString();

    const galleryImageUrls = value.galleryImageUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    return {
      title: value.title.trim(),
      description: value.description.trim(),
      dateISO: normalizedDate,
      venue: value.venue.trim(),
      coverImageUrl: value.coverImageUrl.trim(),
      galleryImageUrls
    };
  }
}
