import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest, map, startWith } from 'rxjs';
import { Event } from '../../core/models/event.model';
import { EventsApiService } from '../../core/api/events-api.service';
import { SectionHeaderComponent } from '../../components/ui/section-header/section-header.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    SectionHeaderComponent,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsComponent {
  private readonly eventsApi = inject(EventsApiService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly filterControl = new FormControl<'upcoming' | 'past'>('upcoming', { nonNullable: true });

  private readonly events$ = this.eventsApi.getEvents();
  private readonly search$ = this.searchControl.valueChanges.pipe(startWith(this.searchControl.value));
  private readonly filter$ = this.filterControl.valueChanges.pipe(startWith(this.filterControl.value));

  readonly eventsView$ = combineLatest([this.events$, this.search$, this.filter$]).pipe(
    map(([events, search, filter]) => {
      const filtered = this.applyFilters(events, search, filter);
      const sorted = this.sortEvents(filtered, filter);
      return {
        filter,
        events: sorted
      };
    })
  );

  trackById(_: number, event: Event): string {
    return event.id;
  }

  setFilter(filter: 'upcoming' | 'past'): void {
    this.filterControl.setValue(filter);
  }

  private applyFilters(events: Event[], search: string, filter: 'upcoming' | 'past'): Event[] {
    const term = search.trim().toLowerCase();
    const today = this.startOfToday();

    let filtered = events.filter((event) => {
      const eventDate = new Date(event.dateISO);
      return filter === 'upcoming' ? eventDate >= today : eventDate < today;
    });

    if (term) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(term));
    }

    return filtered;
  }

  private sortEvents(events: Event[], filter: 'upcoming' | 'past'): Event[] {
    return events
      .slice()
      .sort((a, b) =>
        filter === 'upcoming'
          ? new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
          : new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
      );
  }

  private startOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
