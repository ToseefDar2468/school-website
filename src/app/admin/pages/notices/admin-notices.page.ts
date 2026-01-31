import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, finalize, of, shareReplay, switchMap, take, tap } from 'rxjs';

import { Notice } from '../../../core/models/notice.model';
import { NoticesApiService } from '../../../core/api/notices-api.service';
import { NoticeUpsertDto } from '../../../core/api/notices-api.models';
import { ConfirmDialogService } from '../../../core/ui/confirm-dialog/confirm-dialog.service';
import { ToastService } from '../../../core/ui/toast/toast.service';
import { AdminModalComponent } from '../../components/admin-modal/admin-modal.component';

interface NoticeFormValue {
  title: string;
  description: string;
  dateISO: string;
  isPinned: boolean;
  attachmentUrl: string;
}

@Component({
  selector: 'app-admin-notices',
  standalone: true,
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, AdminModalComponent],
  templateUrl: './admin-notices.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNoticesPage {
  private readonly noticesApi = inject(NoticesApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly toastService = inject(ToastService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly formOpenSubject = new BehaviorSubject<boolean>(false);
  private readonly editingNoticeSubject = new BehaviorSubject<Notice | null>(null);
  private readonly deleteTargetSubject = new BehaviorSubject<Notice | null>(null);
  private readonly savingSubject = new BehaviorSubject<boolean>(false);
  private readonly deletingSubject = new BehaviorSubject<boolean>(false);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dateISO: new FormControl(this.todayInput(), { nonNullable: true, validators: [Validators.required] }),
    isPinned: new FormControl(false, { nonNullable: true }),
    attachmentUrl: new FormControl('', { nonNullable: true })
  });

  readonly notices$ = this.refresh$.pipe(
    tap(() => {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
    }),
    switchMap(() =>
      this.noticesApi.getNotices(true).pipe(
        catchError(() => {
          this.errorSubject.next('Unable to load notices. Please try again.');
          this.toastService.error('Unable to load notices.');
          return of([] as Notice[]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
    ),
    shareReplay(1)
  );

  readonly vm$ = combineLatest({
    notices: this.notices$,
    isLoading: this.loadingSubject,
    errorMessage: this.errorSubject,
    formOpen: this.formOpenSubject,
    editingNotice: this.editingNoticeSubject,
    deleteTarget: this.deleteTargetSubject,
    isSaving: this.savingSubject,
    isDeleting: this.deletingSubject
  });

  openCreate(): void {
    this.editingNoticeSubject.next(null);
    this.form.reset(this.defaultFormValue());
    this.formOpenSubject.next(true);
  }

  openEdit(notice: Notice): void {
    this.editingNoticeSubject.next(notice);
    this.form.reset({
      title: notice.title,
      description: notice.description,
      dateISO: this.toDateInput(notice.dateISO),
      isPinned: notice.isPinned,
      attachmentUrl: notice.attachmentUrl ?? ''
    });
    this.formOpenSubject.next(true);
  }

  closeForm(): void {
    this.formOpenSubject.next(false);
    this.editingNoticeSubject.next(null);
    this.form.reset(this.defaultFormValue());
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
    const editingNotice = this.editingNoticeSubject.getValue();

    this.savingSubject.next(true);

    const request$ = editingNotice
      ? this.noticesApi.adminUpdateNotice(editingNotice.id, dto)
      : this.noticesApi.adminCreateNotice(dto);

    request$
      .pipe(finalize(() => this.savingSubject.next(false)))
      .subscribe({
        next: () => {
          this.closeForm();
          this.refresh$.next();
          this.toastService.success(
            editingNotice ? 'Notice updated successfully.' : 'Notice created successfully.'
          );
        },
        error: () => {
          this.errorSubject.next('Unable to save notice. Please try again.');
          this.toastService.error('Unable to save notice.');
        }
      });
  }

  openDelete(notice: Notice): void {
    this.confirmDialog
      .confirm({
        title: 'Delete notice',
        message: `Are you sure you want to delete "${notice.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        intent: 'danger'
      })
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.deleteTargetSubject.next(notice);
        this.deletingSubject.next(true);
        this.errorSubject.next(null);

        this.noticesApi
          .adminDeleteNotice(notice.id)
          .pipe(finalize(() => this.deletingSubject.next(false)))
          .subscribe({
            next: () => {
              this.deleteTargetSubject.next(null);
              this.refresh$.next();
              this.toastService.success('Notice deleted successfully.');
            },
            error: () => {
              this.errorSubject.next('Unable to delete notice. Please try again.');
              this.toastService.error('Unable to delete notice.');
            }
          });
      });
  }

  private defaultFormValue(): NoticeFormValue {
    return {
      title: '',
      description: '',
      dateISO: this.todayInput(),
      isPinned: false,
      attachmentUrl: ''
    };
  }

  private todayInput(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private toDateInput(value: string): string {
    return value ? value.slice(0, 10) : this.todayInput();
  }

  private toDto(value: NoticeFormValue): NoticeUpsertDto {
    const attachment = value.attachmentUrl.trim();
    const normalizedDate = value.dateISO.includes('T')
      ? value.dateISO
      : new Date(`${value.dateISO}T00:00:00Z`).toISOString();

    return {
      title: value.title.trim(),
      description: value.description.trim(),
      dateISO: normalizedDate,
      isPinned: value.isPinned,
      attachmentUrl: attachment ? attachment : undefined
    };
  }
}
