import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface InquiryRow {
  name: string;
  program: string;
  status: string;
  received: string;
}

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [NgFor],
  templateUrl: './admin-inquiries.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminInquiriesComponent {
  readonly inquiries = signal<InquiryRow[]>([
    { name: 'Aisha Khan', program: 'Grade 5', status: 'New', received: '2 hours ago' },
    { name: 'Omar Ali', program: 'Grade 9', status: 'Follow-up', received: 'Yesterday' },
    { name: 'Fatima Noor', program: 'Kindergarten', status: 'Scheduled', received: 'Jan 28' }
  ]);
}
