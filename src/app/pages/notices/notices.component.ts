import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest, map, startWith } from 'rxjs';

import { Notice } from '../../core/models/notice.model';
import { NoticesApiService } from '../../core/api/notices-api.service';
import { compareDateISO } from '../../core/utils/date.utils';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { SectionHeaderComponent } from '../../components/ui/section-header/section-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface FilterOption {
  value: 'all' | 'pinned' | 'latest';
  label: string;
}

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    BadgeComponent,
    SectionHeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './notices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticesComponent {
  private readonly noticesApi = inject(NoticesApiService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly filterControl = new FormControl<'all' | 'pinned' | 'latest'>('all', { nonNullable: true });

  readonly filterOptions: FilterOption[] = [
    { value: 'all', label: 'All notices' },
    { value: 'pinned', label: 'Pinned only' },
    { value: 'latest', label: 'Latest only' }
  ];

  private readonly search$ = this.searchControl.valueChanges.pipe(startWith(this.searchControl.value));
  private readonly filter$ = this.filterControl.valueChanges.pipe(startWith(this.filterControl.value));

  readonly vm$ = combineLatest([
    this.noticesApi.getNotices(true),
    this.search$,
    this.filter$
  ]).pipe(
    map(([notices, search, filter]) => this.buildView(notices, search, filter))
  );

  trackById(_: number, notice: Notice): string {
    return notice.id;
  }

  excerpt(text: string): string {
    return text.length > 140 ? `${text.slice(0, 140)}...` : text;
  }

  private buildView(notices: Notice[], search: string, filter: 'all' | 'pinned' | 'latest') {
    const term = search.trim().toLowerCase();
    const matches = (notice: Notice) =>
      !term || notice.title.toLowerCase().includes(term) || notice.description.toLowerCase().includes(term);

    const pinned = notices
      .filter((notice) => notice.isPinned)
      .filter(matches)
      .slice()
      .sort((a, b) => compareDateISO(a.dateISO, b.dateISO, 'desc'));

    const regular = notices
      .filter((notice) => !notice.isPinned)
      .filter(matches)
      .slice()
      .sort((a, b) => compareDateISO(a.dateISO, b.dateISO, 'desc'));

    return {
      pinned: filter === 'all' || filter === 'pinned' ? pinned : [],
      regular: filter === 'all' || filter === 'latest' ? regular : []
    };
  }
}
