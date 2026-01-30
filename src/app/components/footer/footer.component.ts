import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly quickLinks: FooterLink[] = [
    { label: 'Admissions', path: '/admissions' },
    { label: 'Academics', path: '/academics' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Results', path: '/results' },
    { label: 'Notices', path: '/notices' },
    { label: 'Contact', path: '/contact' }
  ];
}
