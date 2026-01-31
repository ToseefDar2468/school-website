import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface AdminStat {
  label: string;
  value: string;
  delta: string;
}

interface AdminQuickAction {
  title: string;
  description: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgFor],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  readonly stats = signal<AdminStat[]>([
    { label: 'Open inquiries', value: '18', delta: '+4 this week' },
    { label: 'Active notices', value: '6', delta: '2 expiring soon' },
    { label: 'Upcoming events', value: '3', delta: 'Next in 4 days' }
  ]);

  readonly quickActions = signal<AdminQuickAction[]>([
    {
      title: 'Review new inquiries',
      description: 'Follow up with guardians who requested information.'
    },
    {
      title: 'Draft a notice',
      description: 'Share policy updates and upcoming reminders.'
    },
    {
      title: 'Publish event schedule',
      description: 'Confirm details for the next student program.'
    }
  ]);
}
