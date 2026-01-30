import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './section-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly actionLabel = input<string | null>(null);
  readonly actionLink = input<string | any[] | null>(null);
  readonly headingLevel = input<1 | 2 | 3 | 4 | 5 | 6>(2);
  readonly containerClass = input<string>('flex flex-wrap items-start justify-between gap-3');
  readonly titleClass = input<string>('section-title');
  readonly subtitleClass = input<string>('section-subtitle');
  readonly actionClass = input<string>('link text-sm font-semibold');

  readonly showAction = computed(() => !!this.actionLabel() && !!this.actionLink());
}
