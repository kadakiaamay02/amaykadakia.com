import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/amaykadakia/', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:kadakiaamay02@gmail.com', icon: 'envelope' },
    { label: 'GitHub', url: 'https://github.com/kadakiaamay02', icon: 'github' },
    { label: 'Buy Me a Coffee', url: 'https://www.buymeacoffee.com/amaykadakia', icon: 'coffee' }
  ];
}