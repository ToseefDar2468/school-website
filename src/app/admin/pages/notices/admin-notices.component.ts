import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-notices',
  standalone: true,
  templateUrl: './admin-notices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNoticesComponent {
  readonly draftCount = signal(2);
}
