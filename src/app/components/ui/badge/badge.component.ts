import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'pinned' | 'category' | 'new';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  readonly label = input.required<string>();
  readonly variant = input<BadgeVariant>('category');
  readonly extraClass = input<string>('');

  readonly classes = computed(() => {
    const base =
      'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold';
    const variantClass = {
      pinned: 'border-primary/20 bg-primary/10 text-primary',
      category: 'border-border bg-surface-2 text-text',
      new: 'border-accent/30 bg-accent/15 text-heading'
    }[this.variant()];

    return `${base} ${variantClass} ${this.extraClass()}`.trim();
  });
}
