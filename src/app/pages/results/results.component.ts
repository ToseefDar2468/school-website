import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ResultHighlight } from '../../core/models/result-highlight.model';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent {
  private readonly dataService = inject(DataService);

  readonly highlights$ = this.dataService.getResultHighlights().pipe(
    map((highlights) => highlights.slice(0, 5))
  );

  readonly topPerformers = [
    { year: 2025, name: 'Ayesha Khan', score: 'A+ (Matric)' },
    { year: 2025, name: 'Usman Ali', score: 'A (Science)' },
    { year: 2024, name: 'Fatima Noor', score: 'A+ (Matric)' },
    { year: 2024, name: 'Hassan Raza', score: 'A (Computer Science)' }
  ] as const;

  readonly achievements = [
    {
      year: 2025,
      title: 'District Science Fair – 1st Position',
      description: 'Our STEM team secured top honors for innovative project work.'
    },
    {
      year: 2024,
      title: 'Inter-School Debate Championship',
      description: 'Senior students won the regional debate competition.'
    },
    {
      year: 2024,
      title: 'Qiraat Competition – Best School Award',
      description: 'Recognized for outstanding performance in Qiraat and Na’at.'
    },
    {
      year: 2023,
      title: 'Sports Gala Overall Trophy',
      description: 'Awarded for excellence across athletics and team sports.'
    }
  ] as const;

  trackByMetric(_: number, item: ResultHighlight): string {
    return item.id;
  }
}
