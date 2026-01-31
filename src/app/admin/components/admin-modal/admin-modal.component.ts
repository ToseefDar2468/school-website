import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  templateUrl: './admin-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminModalComponent {
  @Input({ required: true }) open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
