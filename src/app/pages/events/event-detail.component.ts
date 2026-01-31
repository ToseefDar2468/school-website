import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { EventsApiService } from '../../core/api/events-api.service';
import { LightboxModalComponent } from '../../components/lightbox-modal/lightbox-modal.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink, LightboxModalComponent],
  templateUrl: './event-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly eventsApi = inject(EventsApiService);

  selectedImageUrl: string | null = null;
  selectedImageAlt = '';

  readonly event$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (id ? this.eventsApi.getEvent(id) : of(null))),
    catchError(() => of(null))
  );

  openLightbox(url: string, alt: string): void {
    this.selectedImageUrl = url;
    this.selectedImageAlt = alt;
  }

  closeLightbox(): void {
    this.selectedImageUrl = null;
  }
}
