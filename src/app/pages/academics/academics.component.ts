import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-academics',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './academics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademicsComponent {
  readonly programs = [
    {
      name: 'Playgroup',
      ageRange: '2.5 – 3.5 years',
      focus: 'Early social skills, motor development, and joyful learning.',
      query: 'playgroup'
    },
    {
      name: 'Nursery',
      ageRange: '3.5 – 4.5 years',
      focus: 'Language growth, pre-writing skills, and confidence building.',
      query: 'nursery'
    },
    {
      name: 'Prep',
      ageRange: '4.5 – 5.5 years',
      focus: 'Foundational literacy, numeracy, and classroom readiness.',
      query: 'prep'
    },
    {
      name: 'Primary',
      ageRange: 'Grades 1 – 5',
      focus: 'Core subjects, reading fluency, and Islamic character.',
      query: 'primary'
    },
    {
      name: 'Middle',
      ageRange: 'Grades 6 – 8',
      focus: 'Concept mastery, critical thinking, and study habits.',
      query: 'middle'
    },
    {
      name: 'Matric',
      ageRange: 'Grades 9 – 10',
      focus: 'Board exam preparation and academic specialization.',
      query: 'matric'
    }
  ] as const;

  readonly curriculumPoints = [
    'Integrated curriculum that blends national standards with Islamic values.',
    'Concept-first teaching supported by daily practice and revision.',
    'Project-based learning to build confidence and communication skills.',
    'Continuous feedback through assignments, quizzes, and mentorship.'
  ];

  readonly activities = [
    {
      title: 'Qiraat & Islamic Studies Clubs',
      description: 'Develop Tajweed, Seerah understanding, and Islamic etiquette.'
    },
    {
      title: 'Science & STEM Projects',
      description: 'Hands-on experiments and fairs to spark curiosity.'
    },
    {
      title: 'Debate & Public Speaking',
      description: 'Build articulation, confidence, and respectful dialogue.'
    },
    {
      title: 'Sports & Physical Fitness',
      description: 'Regular activities that promote teamwork and health.'
    },
    {
      title: 'Arts & Creativity',
      description: 'Calligraphy, craft, and creative expression sessions.'
    },
    {
      title: 'Community Service',
      description: 'Service drives that teach empathy and responsibility.'
    }
  ] as const;

  readonly assessmentSteps = [
    {
      title: 'Baseline Assessment',
      description: 'Initial diagnostic tests to understand student strengths.'
    },
    {
      title: 'Ongoing Formative Checks',
      description: 'Weekly quizzes and classwork to monitor progress.'
    },
    {
      title: 'Monthly Reviews',
      description: 'Parent updates with academic goals and action plans.'
    },
    {
      title: 'Term Exams',
      description: 'Structured assessments aligned with board requirements.'
    }
  ] as const;
}
