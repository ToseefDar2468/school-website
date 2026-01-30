import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaBannerComponent {
  readonly heading = input.required<string>();
  readonly text = input.required<string>();
  readonly primaryLabel = input.required<string>();
  readonly primaryLink = input.required<string | any[]>();
  readonly secondaryLabel = input<string | null>(null);
  readonly secondaryLink = input<string | any[] | null>(null);

  readonly showSecondary = computed(() => !!this.secondaryLabel() && !!this.secondaryLink());
}
