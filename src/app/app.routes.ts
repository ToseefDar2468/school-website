import { Routes } from '@angular/router';

export const routes: Routes = [
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
      import('./pages/events/events.component').then((m) => m.EventsComponent)
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
];
