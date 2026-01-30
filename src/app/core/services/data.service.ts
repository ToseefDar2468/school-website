import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

import { Notice } from '../models/notice.model';
import { Event } from '../models/event.model';
import { Testimonial } from '../models/testimonial.model';
import { StaffMember } from '../models/staff-member.model';
import { ResultHighlight } from '../models/result-highlight.model';
import { GalleryAlbum } from '../models/gallery-album.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly delayMs = 250;

  private readonly notices: Notice[] = [
    {
      id: 'notice-001',
      title: 'Winter Term Exam Schedule Published',
      description:
        'The winter term examination schedule for grades 6-12 is now available. Please review timings and room assignments carefully.',
      dateISO: '2026-01-12',
      isPinned: true,
      attachmentUrl: 'assets/docs/winter-term-exam-schedule.pdf'
    },
    {
      id: 'notice-002',
      title: 'Parent-Teacher Conference Week',
      description:
        'Parents are requested to book slots with class advisors between January 20-24 to discuss student progress.',
      dateISO: '2026-01-08',
      isPinned: true
    },
    {
      id: 'notice-003',
      title: 'Annual Sports Day Registration',
      description:
        'Students may register for track and field events with their house captains by January 25.',
      dateISO: '2026-01-05',
      isPinned: false
    },
    {
      id: 'notice-004',
      title: 'Library Extension Hours',
      description:
        'The library will remain open until 5:00 PM on weekdays to support exam preparation.',
      dateISO: '2025-12-18',
      isPinned: false
    },
    {
      id: 'notice-005',
      title: 'Scholarship Application Window',
      description:
        'Merit and need-based scholarship applications are open for the 2026-27 academic year.',
      dateISO: '2025-12-10',
      isPinned: false,
      attachmentUrl: 'assets/docs/scholarship-application-form.pdf'
    },
    {
      id: 'notice-006',
      title: 'Transportation Route Updates',
      description:
        'Minor changes have been made to Route B and Route D pickup timings. Please confirm with the transport office.',
      dateISO: '2025-12-02',
      isPinned: false
    }
  ];

  private readonly events: Event[] = [
    {
      id: 'event-001',
      title: 'Annual Sports Day',
      description:
        'A full-day celebration of athleticism featuring track events, house relays, and award ceremonies.',
      dateISO: '2026-02-08',
      venue: 'Main Sports Ground',
      coverImageUrl: 'assets/images/events/sports-day-cover.jpg',
      galleryImageUrls: [
        'assets/images/events/sports-day-1.jpg',
        'assets/images/events/sports-day-2.jpg',
        'assets/images/events/sports-day-3.jpg'
      ]
    },
    {
      id: 'event-002',
      title: 'STEM Innovation Fair',
      description:
        'Student teams will present research projects and prototypes focused on sustainability and community impact.',
      dateISO: '2026-03-02',
      venue: 'Innovation Hall',
      coverImageUrl: 'assets/images/events/stem-fair-cover.jpg',
      galleryImageUrls: [
        'assets/images/events/stem-fair-1.jpg',
        'assets/images/events/stem-fair-2.jpg'
      ]
    },
    {
      id: 'event-003',
      title: 'Quran Recitation Evening',
      description:
        'An evening program featuring student recitations, reflections, and community dua.',
      dateISO: '2026-02-20',
      venue: 'Auditorium',
      coverImageUrl: 'assets/images/events/quran-evening-cover.jpg',
      galleryImageUrls: [
        'assets/images/events/quran-evening-1.jpg',
        'assets/images/events/quran-evening-2.jpg'
      ]
    },
    {
      id: 'event-004',
      title: 'Grade 6 Orientation',
      description:
        'A welcome session for incoming students and families covering campus tours and academic expectations.',
      dateISO: '2026-01-30',
      venue: 'Learning Commons',
      coverImageUrl: 'assets/images/events/orientation-cover.jpg',
      galleryImageUrls: [
        'assets/images/events/orientation-1.jpg',
        'assets/images/events/orientation-2.jpg'
      ]
    }
  ];

  private readonly testimonials: Testimonial[] = [
    {
      id: 'testimonial-001',
      name: 'Amina Rahman',
      role: 'Parent of Grade 10 student',
      message:
        'The teachers are attentive and genuinely invested in every child. We have seen remarkable growth both academically and spiritually.'
    },
    {
      id: 'testimonial-002',
      name: 'Omar Siddiqui',
      role: 'Alumni, Class of 2022',
      message:
        'Islamic Vision prepared me with strong fundamentals and the confidence to pursue engineering at university.'
    },
    {
      id: 'testimonial-003',
      name: 'Samiha Khan',
      role: 'Parent Council Representative',
      message:
        'The communication is excellent, and the school consistently creates meaningful opportunities for student leadership.'
    }
  ];

  private readonly staff: StaffMember[] = [
    {
      id: 'staff-001',
      name: 'Dr. Farah Malik',
      designation: 'Principal',
      subjectOrDept: 'School Leadership',
      photoUrl: 'assets/images/staff/farah-malik.jpg'
    },
    {
      id: 'staff-002',
      name: 'Mr. Yasir Ahmed',
      designation: 'Vice Principal',
      subjectOrDept: 'Student Affairs',
      photoUrl: 'assets/images/staff/yasir-ahmed.jpg'
    },
    {
      id: 'staff-003',
      name: 'Ms. Leena Qureshi',
      designation: 'Head of Science',
      subjectOrDept: 'Physics',
      photoUrl: 'assets/images/staff/leena-qureshi.jpg'
    },
    {
      id: 'staff-004',
      name: 'Mr. Bilal Hassan',
      designation: 'Senior Teacher',
      subjectOrDept: 'Mathematics',
      photoUrl: 'assets/images/staff/bilal-hassan.jpg'
    }
  ];

  private readonly resultHighlights: ResultHighlight[] = [
    {
      id: 'result-001',
      year: 2025,
      metric: 'Board Examination Pass Rate',
      value: '98%',
      note: 'Highest in the district for the second consecutive year.'
    },
    {
      id: 'result-002',
      year: 2025,
      metric: 'Students with A or A+ Grades',
      value: '76%'
    },
    {
      id: 'result-003',
      year: 2024,
      metric: 'National Science Olympiad Qualifiers',
      value: '14 students'
    },
    {
      id: 'result-004',
      year: 2024,
      metric: 'Scholarships Awarded',
      value: '$180k',
      note: 'Combined merit and need-based awards.'
    }
  ];

  private readonly galleryAlbums: GalleryAlbum[] = [
    {
      id: 'album-001',
      title: 'Campus Life Highlights',
      coverImageUrl: 'assets/images/gallery/campus-life-cover.jpg',
      imageUrls: [
        'assets/images/gallery/campus-life-1.jpg',
        'assets/images/gallery/campus-life-2.jpg',
        'assets/images/gallery/campus-life-3.jpg'
      ],
      category: 'Campus Life'
    },
    {
      id: 'album-002',
      title: 'Sports Day Moments',
      coverImageUrl: 'assets/images/gallery/sports-day-cover.jpg',
      imageUrls: [
        'assets/images/gallery/sports-day-1.jpg',
        'assets/images/gallery/sports-day-2.jpg',
        'assets/images/gallery/sports-day-3.jpg'
      ],
      category: 'Sports'
    },
    {
      id: 'album-003',
      title: 'STEM Fair Showcase',
      coverImageUrl: 'assets/images/gallery/stem-fair-cover.jpg',
      imageUrls: [
        'assets/images/gallery/stem-fair-1.jpg',
        'assets/images/gallery/stem-fair-2.jpg'
      ],
      category: 'Academics'
    },
    {
      id: 'album-004',
      title: 'Community Events',
      coverImageUrl: 'assets/images/gallery/community-events-cover.jpg',
      imageUrls: [
        'assets/images/gallery/community-events-1.jpg',
        'assets/images/gallery/community-events-2.jpg',
        'assets/images/gallery/community-events-3.jpg'
      ],
      category: 'Events'
    }
  ];

  private simulate<T>(data: T): Observable<T> {
    return of(data).pipe(delay(this.delayMs));
  }

  getNotices(): Observable<Notice[]> {
    return this.simulate(this.notices.slice());
  }

  getPinnedNotices(): Observable<Notice[]> {
    return this.simulate(this.notices.filter((notice) => notice.isPinned));
  }

  getNoticeById(id: string): Observable<Notice | undefined> {
    return this.simulate(this.notices.find((notice) => notice.id === id));
  }

  getEvents(): Observable<Event[]> {
    return this.simulate(this.events.slice());
  }

  getEventById(id: string): Observable<Event | undefined> {
    return this.simulate(this.events.find((event) => event.id === id));
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.simulate(this.testimonials.slice());
  }

  getStaff(): Observable<StaffMember[]> {
    return this.simulate(this.staff.slice());
  }

  getResultHighlights(): Observable<ResultHighlight[]> {
    return this.simulate(this.resultHighlights.slice());
  }

  getGalleryAlbums(): Observable<GalleryAlbum[]> {
    return this.simulate(this.galleryAlbums.slice());
  }

  getAlbumById(id: string): Observable<GalleryAlbum | undefined> {
    return this.simulate(this.galleryAlbums.find((album) => album.id === id));
  }
}
