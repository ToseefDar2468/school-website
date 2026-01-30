import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  readonly navItems: NavItem[] = [
    { label: 'Home', path: '', exact: true },
    { label: 'About', path: '/about' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Academics', path: '/academics' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Results', path: '/results' },
    { label: 'Notices', path: '/notices' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' }
  ];

  readonly isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
