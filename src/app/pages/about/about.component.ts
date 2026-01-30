import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly visionMission = [
    {
      title: 'Our Vision',
      description:
        'To nurture confident learners who excel academically, uphold Islamic values, and contribute positively to society.'
    },
    {
      title: 'Our Mission',
      description:
        'We provide a holistic education that blends strong academics, character development, and spiritual growth through dedicated mentorship and a caring school community.'
    }
  ];

  readonly coreValues = [
    {
      title: 'Faith & Integrity',
      description: 'We model honesty, humility, and accountability in all actions.',
      iconPath: 'M12 3l4 7h-8l4-7zm-6 9h12v9H6v-9z'
    },
    {
      title: 'Academic Excellence',
      description: 'We inspire curiosity, critical thinking, and strong study habits.',
      iconPath: 'M4 6h16M6 6v12m12-12v12M9 10h6'
    },
    {
      title: 'Respect & Compassion',
      description: 'We promote empathy, service, and care for others.',
      iconPath: 'M12 21l-7-7a4 4 0 015.7-5.7L12 9l1.3-1.7A4 4 0 0121 14l-9 7z'
    },
    {
      title: 'Discipline & Responsibility',
      description: 'We encourage self-control, leadership, and accountability.',
      iconPath: 'M8 7h8v4H8V7zm-1 6h10v4H7v-4z'
    },
    {
      title: 'Community Partnership',
      description: 'We collaborate with families to support every learner.',
      iconPath: 'M4 14l4-4 4 4 6-6 2 2-8 8-8-8z'
    }
  ];

  readonly facilities = [
    {
      title: 'Science Lab',
      description: 'Hands-on experiments for physics, chemistry, and biology.',
      iconPath: 'M10 2h4v3l3 6a4 4 0 01-3.5 6H10.5A4 4 0 017 11l3-6V2z'
    },
    {
      title: 'Computer Lab',
      description: 'Modern systems for coding, research, and digital skills.',
      iconPath: 'M4 5h16v10H4V5zm6 12h4'
    },
    {
      title: 'Library',
      description: 'Curated resources for reading, reference, and study.',
      iconPath: 'M6 4h10a2 2 0 012 2v12H6a2 2 0 01-2-2V6a2 2 0 012-2z'
    },
    {
      title: 'Sports',
      description: 'Indoor and outdoor activities to promote fitness.',
      iconPath: 'M6 6l12 12M6 18l12-12M4 12h16'
    },
    {
      title: 'Prayer Area',
      description: 'A peaceful space for prayer and reflection.',
      iconPath: 'M12 3a4 4 0 014 4c0 2.2-1.8 4-4 4a4 4 0 110-8zm-6 16h12'
    },
    {
      title: 'Secure Campus',
      description: 'Safe facilities with monitored entry and caring staff.',
      iconPath: 'M12 3l7 3v6c0 4.4-3 8.5-7 9-4-0.5-7-4.6-7-9V6l7-3z'
    }
  ];
}
