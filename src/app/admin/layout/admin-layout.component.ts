import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';
import { ToastContainerComponent } from '../../core/ui/toast/toast-container.component';

interface AdminNavItem {
  label: string;
  path: string;
  description: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, RouterOutlet, ConfirmDialogComponent, ToastContainerComponent],
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
      label: 'Events',
      path: '/admin/events',
      description: 'Manage school events'
    },
    {
      label: 'Gallery',
      path: '/admin/gallery',
      description: 'Manage albums and media'
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
    this.authService.logout();
    this.sidebarOpen.set(false);
    this.router.navigate(['/admin/login']);
  }
}
