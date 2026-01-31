import { AsyncPipe } from '@angular/common';
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

interface GalleryView {
  categories: string[];
  albums: GalleryAlbum[];
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    AsyncPipe,
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

  readonly categoryControl = new FormControl('All', { nonNullable: true });

  readonly view$ = combineLatest([
    this.dataService.getGalleryAlbums(),
    this.categoryControl.valueChanges.pipe(startWith(this.categoryControl.value))
  ]).pipe(map(([albums, category]) => this.buildView(albums, category)));

  trackById(_: number, album: GalleryAlbum): string {
    return album.id;
  }

  private buildView(albums: GalleryAlbum[], category: string): GalleryView {
    const categories = ['All', ...new Set(albums.map((album) => album.category))];

    return {
      categories,
      albums: category === 'All' ? albums : albums.filter((album) => album.category === category)
    };
  }
}
