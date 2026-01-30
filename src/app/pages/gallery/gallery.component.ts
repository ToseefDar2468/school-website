import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest, map, startWith } from 'rxjs';
import { GalleryAlbum } from '../../core/models/gallery-album.model';
import { DataService } from '../../core/services/data.service';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { SectionHeaderComponent } from '../../components/ui/section-header/section-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

type CategoryFilter = 'All' | string;

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    BadgeComponent,
    SectionHeaderComponent,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  private readonly dataService = inject(DataService);

  readonly categoryControl = new FormControl<CategoryFilter>('All', { nonNullable: true });

  private readonly albums$ = this.dataService.getGalleryAlbums();
  private readonly category$ = this.categoryControl.valueChanges.pipe(
    startWith(this.categoryControl.value)
  );

  readonly view$ = combineLatest([this.albums$, this.category$]).pipe(
    map(([albums, category]) => {
      const categories = this.buildCategories(albums);
      const filtered =
        category === 'All' ? albums : albums.filter((album) => album.category === category);
      const displayAlbums = filtered.map((album, index) => ({
        ...album,
        coverImageUrl: this.resolveImage(album.coverImageUrl, index)
      }));
      return { categories, albums: displayAlbums, category };
    })
  );

  trackById(_: number, album: GalleryAlbum): string {
    return album.id;
  }

  resolveImage(url: string, index: number): string {
    if (!url || url.startsWith('assets/')) {
      const seed = 1200 + index;
      return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&sig=${seed}`;
    }
    return url;
  }

  private buildCategories(albums: GalleryAlbum[]): CategoryFilter[] {
    const unique = Array.from(new Set(albums.map((album) => album.category)));
    return ['All', ...unique];
  }
}
