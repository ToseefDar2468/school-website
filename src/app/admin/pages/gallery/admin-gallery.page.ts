import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, finalize, map, of, shareReplay, switchMap, take, tap } from 'rxjs';

import { GalleryAlbum } from '../../../core/models/gallery-album.model';
import { GalleryApiService } from '../../../core/api/gallery-api.service';
import { GalleryAlbumUpsertDto } from '../../../core/api/gallery-api.models';
import { ConfirmDialogService } from '../../../core/ui/confirm-dialog/confirm-dialog.service';
import { ToastService } from '../../../core/ui/toast/toast.service';
import { AdminModalComponent } from '../../components/admin-modal/admin-modal.component';

interface AlbumFormValue {
  title: string;
  category: string;
  coverImageUrl: string;
  imageUrls: string[];
}

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, AdminModalComponent],
  templateUrl: './admin-gallery.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminGalleryPage {
  private readonly galleryApi = inject(GalleryApiService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly toastService = inject(ToastService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly formOpenSubject = new BehaviorSubject<boolean>(false);
  private readonly editingAlbumSubject = new BehaviorSubject<GalleryAlbum | null>(null);
  private readonly deleteTargetSubject = new BehaviorSubject<GalleryAlbum | null>(null);
  private readonly savingSubject = new BehaviorSubject<boolean>(false);
  private readonly deletingSubject = new BehaviorSubject<boolean>(false);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    coverImageUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    imageUrls: this.buildImageArray([''])
  });

  readonly albums$ = this.refresh$.pipe(
    tap(() => {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
    }),
    switchMap(() =>
      this.galleryApi.getAlbums().pipe(
        map((albums) => albums.slice().sort((a, b) => a.title.localeCompare(b.title))),
        catchError(() => {
          this.errorSubject.next('Unable to load albums. Please try again.');
          this.toastService.error('Unable to load albums.');
          return of([] as GalleryAlbum[]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
    ),
    shareReplay(1)
  );

  readonly vm$ = combineLatest({
    albums: this.albums$,
    isLoading: this.loadingSubject,
    errorMessage: this.errorSubject,
    formOpen: this.formOpenSubject,
    editingAlbum: this.editingAlbumSubject,
    deleteTarget: this.deleteTargetSubject,
    isSaving: this.savingSubject,
    isDeleting: this.deletingSubject
  });

  openCreate(): void {
    this.editingAlbumSubject.next(null);
    this.resetForm(this.defaultFormValue());
    this.formOpenSubject.next(true);
  }

  openEdit(album: GalleryAlbum): void {
    this.editingAlbumSubject.next(album);
    this.resetForm({
      title: album.title,
      category: album.category,
      coverImageUrl: album.coverImageUrl,
      imageUrls: album.imageUrls ?? []
    });
    this.formOpenSubject.next(true);
  }

  closeForm(): void {
    this.formOpenSubject.next(false);
    this.editingAlbumSubject.next(null);
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
    const editingAlbum = this.editingAlbumSubject.getValue();

    this.savingSubject.next(true);

    const request$ = editingAlbum
      ? this.galleryApi.adminUpdateAlbum(editingAlbum.id, dto)
      : this.galleryApi.adminCreateAlbum(dto);

    request$
      .pipe(finalize(() => this.savingSubject.next(false)))
      .subscribe({
        next: () => {
          this.closeForm();
          this.refresh$.next();
          this.toastService.success(
            editingAlbum ? 'Album updated successfully.' : 'Album created successfully.'
          );
        },
        error: () => {
          this.errorSubject.next('Unable to save album. Please try again.');
          this.toastService.error('Unable to save album.');
        }
      });
  }

  openDelete(album: GalleryAlbum): void {
    this.confirmDialog
      .confirm({
        title: 'Delete album',
        message: `Are you sure you want to delete "${album.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        intent: 'danger'
      })
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.deleteTargetSubject.next(album);
        this.deletingSubject.next(true);
        this.errorSubject.next(null);

        this.galleryApi
          .adminDeleteAlbum(album.id)
          .pipe(finalize(() => this.deletingSubject.next(false)))
          .subscribe({
            next: () => {
              this.deleteTargetSubject.next(null);
              this.refresh$.next();
              this.toastService.success('Album deleted successfully.');
            },
            error: () => {
              this.errorSubject.next('Unable to delete album. Please try again.');
              this.toastService.error('Unable to delete album.');
            }
          });
      });
  }

  addImageUrl(): void {
    this.imageArray.push(this.createUrlControl(''));
  }

  removeImageUrl(index: number): void {
    if (this.imageArray.length <= 1) {
      this.imageArray.at(0).setValue('');
      return;
    }
    this.imageArray.removeAt(index);
  }

  get imageControls(): FormControl<string>[] {
    return this.imageArray.controls;
  }

  private get imageArray(): FormArray<FormControl<string>> {
    return this.form.controls.imageUrls;
  }

  private resetForm(value: AlbumFormValue): void {
    this.form.reset({
      title: value.title,
      category: value.category,
      coverImageUrl: value.coverImageUrl
    });
    this.setImageUrls(value.imageUrls);
  }

  private buildImageArray(urls: string[]): FormArray<FormControl<string>> {
    const values = urls.length ? urls : [''];
    return new FormArray(values.map((url) => this.createUrlControl(url)));
  }

  private setImageUrls(urls: string[]): void {
    const values = urls.length ? urls : [''];
    this.imageArray.clear();
    values.forEach((url) => this.imageArray.push(this.createUrlControl(url)));
  }

  private createUrlControl(value: string): FormControl<string> {
    return new FormControl(value, { nonNullable: true });
  }

  private defaultFormValue(): AlbumFormValue {
    return {
      title: '',
      category: '',
      coverImageUrl: '',
      imageUrls: ['']
    };
  }

  private toDto(value: AlbumFormValue): GalleryAlbumUpsertDto {
    const imageUrls = value.imageUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    return {
      title: value.title.trim(),
      category: value.category.trim(),
      coverImageUrl: value.coverImageUrl.trim(),
      imageUrls
    };
  }
}
