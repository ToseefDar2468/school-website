import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { GalleryApiService } from '../../core/api/gallery-api.service';
import { GalleryAlbum } from '../../core/models/gallery-album.model';
import { LightboxModalComponent } from '../../components/lightbox-modal/lightbox-modal.component';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink, LightboxModalComponent],
  templateUrl: './album-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly galleryApi = inject(GalleryApiService);

  selectedImageUrl: string | null = null;
  selectedImageAlt = '';

  readonly album$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (id ? this.galleryApi.getAlbum(id) : of(null))),
    map((album) => (album ? this.mapImages(album) : null)),
    catchError(() => of(null))
  );

  openLightbox(url: string, alt: string): void {
    this.selectedImageUrl = url;
    this.selectedImageAlt = alt;
  }

  closeLightbox(): void {
    this.selectedImageUrl = null;
  }

  resolveImage(url: string, index: number): string {
    if (!url || url.startsWith('assets/')) {
      const seed = 1400 + index;
      return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&sig=${seed}`;
    }
    return url;
  }

  private mapImages(album: GalleryAlbum): GalleryAlbum {
    return {
      ...album,
      coverImageUrl: this.resolveImage(album.coverImageUrl, 0),
      imageUrls: album.imageUrls.map((url, index) => this.resolveImage(url, index + 1))
    };
  }
}
