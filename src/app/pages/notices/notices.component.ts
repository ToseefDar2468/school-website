import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest, map, startWith } from 'rxjs';
import { Notice } from '../../core/models/notice.model';
import { DataService } from '../../core/services/data.service';
import { sortByDateISO } from '../../core/utils/date.utils';

type NoticeFilter = 'all' | 'pinned' | 'month';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './notices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticesComponent {
  private readonly dataService = inject(DataService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly filterControl = new FormControl<NoticeFilter>('all', { nonNullable: true });

  private readonly notices$ = this.dataService.getNotices().pipe(map((notices) => sortByDateISO(notices)));

  private readonly search$ = this.searchControl.valueChanges.pipe(startWith(this.searchControl.value));
  private readonly filter$ = this.filterControl.valueChanges.pipe(startWith(this.filterControl.value));

  readonly vm$ = combineLatest([this.notices$, this.search$, this.filter$]).pipe(
    map(([notices, search, filter]) => {
      const filtered = this.applyFilters(notices, search, filter);
      return {
        pinned: filtered.filter((notice) => notice.isPinned),
        regular: filtered.filter((notice) => !notice.isPinned),
        filter
      };
    })
  );

  readonly filterOptions: { value: NoticeFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pinned', label: 'Pinned' },
    { value: 'month', label: 'This Month' }
  ];

  trackById(_: number, notice: Notice): string {
    return notice.id;
  }

  excerpt(text: string, maxLength = 140): string {
    if (text.length <= maxLength) {
      return text;
    }
    const trimmed = text.slice(0, maxLength).trimEnd();
    return `${trimmed}...`;
  }

  private applyFilters(notices: Notice[], search: string, filter: NoticeFilter): Notice[] {
    const term = search.trim().toLowerCase();
    let filtered = notices;

    if (term) {
      filtered = filtered.filter((notice) => {
        const haystack = `${notice.title} ${notice.description}`.toLowerCase();
        return haystack.includes(term);
      });
    }

    if (filter === 'pinned') {
      filtered = filtered.filter((notice) => notice.isPinned);
    } else if (filter === 'month') {
      filtered = filtered.filter((notice) => this.isThisMonth(notice.dateISO));
    }

    return filtered;
  }

  private isThisMonth(dateISO: string): boolean {
    const date = new Date(dateISO);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
}
