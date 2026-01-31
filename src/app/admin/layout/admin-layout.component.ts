import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface AdminNavItem {
  label: string;
  path: string;
  description: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  readonly sidebarOpen = signal(false);

  readonly navItems = signal<AdminNavItem[]>([
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      description: 'Overview and quick stats'
    },
    {
      label: 'Inquiries',
      path: '/admin/inquiries',
      description: 'Admissions and contact requests'
    },
    {
      label: 'Notices',
      path: '/admin/notices',
      description: 'Manage announcements'
    }
  ]);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.sidebarOpen.set(false);
  }
}
