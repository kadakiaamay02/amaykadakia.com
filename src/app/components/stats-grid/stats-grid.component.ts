import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatItem {
  title: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <div class="stats-card" *ngFor="let stat of stats">
        <a [href]="stat.link" target="_blank" class="stats-card__link">
          <div class="stats-card__header">
            <h5 class="stats-card__title">{{ stat.title }}</h5>
            <svg class="stats-card__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stats-card__image">
            <img [src]="stat.imageUrl" [alt]="stat.title" loading="lazy">
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 2rem;
      margin: 3rem 0;
    }

    .stats-card:first-child {
      grid-column: 1;
      grid-row: 1 / 3;
      max-height: 600px;
      display: flex;
      flex-direction: column;
    }

    .stats-card:first-child .stats-card__link {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .stats-card:first-child .stats-card__image {
      flex: 1;
      height: 100%;
    }

    .stats-card:first-child .stats-card__image img {
      height: 100%;
      object-fit: scale-down;
    }

    .stats-card:nth-child(2) {
      grid-column: 2;
      grid-row: 1;
      height: 100%;
       object-fit: scale-down;
    }

    .stats-card:nth-child(3) {
      grid-column: 2;
      grid-row: 2;
      
        object-fit: scale-down;
    }

    .stats-card {
      border: 1px solid var(--color-gray-8);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      height: 100%;
    }

    .stats-card:hover {
      border-color: var(--color-1);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px);
    }

    .stats-card__link {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .stats-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--color-gray-8);
      transition: background 0.3s ease;
    }

    .stats-card:hover .stats-card__header {
      background: var(--color-gray-9);
    }

    .stats-card__title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      color: var(--color-text);
    }

    .stats-card__icon {
      color: var(--color-1);
      opacity: 0;
      transition: all 0.3s ease;
      transform: translate(-8px, 0);
    }

    .stats-card:hover .stats-card__icon {
      opacity: 1;
      transform: translate(0, 0);
    }

    .stats-card__image {
      width: 100%;
      height: auto;
      overflow: hidden;
    }

    .stats-card__image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.3s ease;
    }

    .stats-card:hover .stats-card__image img {
      transform: scale(1.02);
    }

    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }

      .stats-card:first-child {
        grid-column: 1;
        grid-row: auto;
      }

      .stats-card:nth-child(2) {
        grid-column: 1;
        grid-row: auto;
      }

      .stats-card:nth-child(3) {
        grid-column: 1;
        grid-row: auto;
      }
    }

    @media (max-width: 768px) {
      .stats-card__title {
        font-size: 1rem;
      }
    }
  `]
})
export class StatsGridComponent {
  stats: StatItem[] = [
    {
      title: 'GitHub Language Stats',
      imageUrl: 'https://github-readme-stats.vercel.app/api/top-langs/?username=kadakiaamay02&langs_count=8&theme=dark&count_private=true',
      link: 'https://github.com/kadakiaamay02'
    },
    {
      title: 'GitHub Stats',
      imageUrl: 'https://github-readme-stats.vercel.app/api?username=kadakiaamay02&show_icons=true&theme=dark&count_private=true&hide=prs&count_forked=true',
      link: 'https://github.com/kadakiaamay02'
    },
    {
      title: 'LeetCode Stats',
      imageUrl: 'https://leetcard.jacoblin.cool/kadakiaamay02',
      link: 'https://leetcode.com/kadakiaamay02'
    }
  ];
}
