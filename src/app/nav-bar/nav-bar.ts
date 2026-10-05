import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  standalone: true
})
export class NavBar {
  isMenuOpen = false; // menu starts closed on phones

  navLinks = [
    { path: '/experience', label: 'Experience' },
    { path: '/education', label: 'Education' },
    { path: '/projects', label: 'Projects' },
    { path: '/games', label: 'Play Games' }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Escape closes the menu
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  // Close the menu if the window grows past the phone breakpoint
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768) this.closeMenu();
  }
}