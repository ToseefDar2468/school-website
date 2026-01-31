import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/pages/login/admin-login.page').then(
        (m) => m.AdminLoginPage
      )
  },
  {
    path: 'admin',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./admin/layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/pages/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          )
      },
      {
        path: 'inquiries',
        loadComponent: () =>
          import('./admin/pages/inquiries/admin-inquiries.page').then(
            (m) => m.AdminInquiriesPage
          )
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./admin/pages/events/admin-events.page').then(
            (m) => m.AdminEventsPage
          )
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./admin/pages/gallery/admin-gallery.page').then(
            (m) => m.AdminGalleryPage
          )
      },
      {
        path: 'notices',
        loadComponent: () =>
          import('./admin/pages/notices/admin-notices.page').then(
            (m) => m.AdminNoticesPage
          )
      }
    ]
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
        pathMatch: 'full'
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component').then((m) => m.AboutComponent)
      },
      {
        path: 'admissions',
        loadComponent: () =>
          import('./pages/admissions/admissions.component').then(
            (m) => m.AdmissionsComponent
          )
      },
      {
        path: 'academics',
        loadComponent: () =>
          import('./pages/academics/academics.component').then(
            (m) => m.AcademicsComponent
          )
      },
      {
        path: 'faculty',
        loadComponent: () =>
          import('./pages/faculty/faculty.component').then(
            (m) => m.FacultyComponent
          )
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./pages/results/results.component').then(
            (m) => m.ResultsComponent
          )
      },
      {
        path: 'notices/:id',
        loadComponent: () =>
          import('./pages/notices/notice-detail.component').then(
            (m) => m.NoticeDetailComponent
          )
      },
      {
        path: 'notices',
        loadComponent: () =>
          import('./pages/notices/notices.component').then(
            (m) => m.NoticesComponent
          )
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./pages/events/event-detail.component').then(
            (m) => m.EventDetailComponent
          )
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./pages/events/events.component').then(
            (m) => m.EventsComponent
          )
      },
      {
        path: 'gallery/:id',
        loadComponent: () =>
          import('./pages/gallery/album-detail.component').then(
            (m) => m.AlbumDetailComponent
          )
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./pages/gallery/gallery.component').then(
            (m) => m.GalleryComponent
          )
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          )
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          )
      }
    ]
  }
];
