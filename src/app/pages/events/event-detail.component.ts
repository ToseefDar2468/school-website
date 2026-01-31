import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { DataService } from '../../core/services/data.service';
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
  private readonly dataService = inject(DataService);

  selectedImageUrl: string | null = null;
  selectedImageAlt = '';

  readonly event$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (id ? this.dataService.getEventById(id) : of(undefined))),
    map((event) => event ?? null)
  );

  openLightbox(url: string, alt: string): void {
    this.selectedImageUrl = url;
    this.selectedImageAlt = alt;
  }

  closeLightbox(): void {
    this.selectedImageUrl = null;
  }
}
