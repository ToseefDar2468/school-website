import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { Notice } from '../../core/models/notice.model';
import { Event } from '../../core/models/event.model';
import { GalleryAlbum } from '../../core/models/gallery-album.model';
import { Testimonial } from '../../core/models/testimonial.model';
import { DataService } from '../../core/services/data.service';
import { compareDateISO, sortByDateISO } from '../../core/utils/date.utils';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { SectionHeaderComponent } from '../../components/ui/section-header/section-header.component';

interface TrustIndicator {
  title: string;
  description: string;
  iconPath: string;
}

interface AdmissionStep {
  title: string;
  description: string;
}

interface GalleryPreview {
  album?: GalleryAlbum;
  images: string[];
}

interface NoticeCardView extends Notice {
  excerpt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink, BadgeComponent, SectionHeaderComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly dataService = inject(DataService);

  readonly trustIndicators: TrustIndicator[] = [
    {
      title: 'Qualified Faculty',
      description: 'Experienced educators committed to academic excellence.',
      iconPath:
        'M12 3l7 3v6c0 4.1-3 7.8-7 9-4-1.2-7-4.9-7-9V6l7-3z'
    },
    {
      title: 'Islamic Character Building',
      description: 'Values-driven environment nurturing faith and integrity.',
      iconPath: 'M12 6a4 4 0 100 8 4 4 0 000-8zm0 10c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z'
    },
    {
      title: 'Board Exam Preparation',
      description: 'Structured preparation with proven academic results.',
      iconPath: 'M4 6h16v12H4z M8 10h8 M8 14h6'
    },
    {
      title: 'Safe Campus',
      description: 'Secure, supportive, and student-centered campus life.',
      iconPath: 'M7 10V7a5 5 0 0110 0v3 M6 10h12v10H6z'
    }
  ];

  readonly admissionSteps: AdmissionStep[] = [
    {
      title: 'Inquiry',
      description: 'Connect with admissions for program details and eligibility.'
    },
    {
      title: 'Visit',
      description: 'Tour our campus and meet faculty to understand our culture.'
    },
    {
      title: 'Assessment',
      description: 'Complete placement assessment to ensure the right fit.'
    },
    {
      title: 'Confirmation',
      description: 'Finalize enrollment and receive onboarding guidance.'
    }
  ];

  readonly pinnedNotices$ = this.dataService.getNotices().pipe(
    map((notices) =>
      sortByDateISO(notices.filter((notice) => notice.isPinned)).map(this.toNoticeCard)
    )
  );

  readonly latestNotices$ = this.dataService.getNotices().pipe(
    map((notices) =>
      sortByDateISO(notices.filter((notice) => !notice.isPinned))
        .slice(0, 3)
        .map(this.toNoticeCard)
    )
  );

  readonly upcomingEvents$ = this.dataService.getEvents().pipe(
    map((events) => this.getUpcomingEvents(events, 2))
  );

  readonly galleryPreview$ = this.dataService.getGalleryAlbums().pipe(
    map((albums): GalleryPreview => {
      const album = albums[0];
      return {
        album,
        images: album ? album.imageUrls.slice(0, 8) : []
      };
    })
  );

  readonly testimonials$ = this.dataService.getTestimonials().pipe(
    map((testimonials) => testimonials.slice(0, 3))
  );

  private readonly toNoticeCard = (notice: Notice): NoticeCardView => {
    const excerpt = notice.description.length > 140
      ? `${notice.description.slice(0, 140)}...`
      : notice.description;

    return {
      ...notice,
      excerpt
    };
  };

  private getUpcomingEvents(events: Event[], count: number): Event[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => new Date(event.dateISO) >= today)
      .slice()
      .sort((a, b) => compareDateISO(a.dateISO, b.dateISO, 'asc'))
      .slice(0, count);
  }
}
