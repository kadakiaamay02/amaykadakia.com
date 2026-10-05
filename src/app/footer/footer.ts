import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone: true
})
export class Footer implements OnDestroy {
  currentYear = new Date().getFullYear();

  email = 'kadakiaamay02@gmail.com';
  copied = false;
  private copiedTimer?: ReturnType<typeof setTimeout>;

  socialLinks = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/amaykadakia/', icon: 'linkedin' },
    { label: 'GitHub', url: 'https://github.com/kadakiaamay02', icon: 'github' },
    { label: 'Buy Me a Coffee', url: 'https://www.buymeacoffee.com/amaykadakia', icon: 'coffee' }
  ];

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email);
      this.copied = true;
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => this.copied = false, 2000);
    } catch {
      // Clipboard can be blocked (old browsers, non-HTTPS); fall back to the email app
      window.location.href = `mailto:${this.email}`;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.copiedTimer);
  }
}