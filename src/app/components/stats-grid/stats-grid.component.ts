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
      @for (stat of stats; track stat.title; let i = $index) {
        <div class="stats-card" [class.stats-card--wide]="i === 0">
          <a [href]="stat.link" target="_blank" class="stats-card__link">
            <div class="stats-card__header">
              <div class="stats-card__label">
                <div class="stats-card__dot"></div>
                <h5 class="stats-card__title">{{ stat.title }}</h5>
              </div>
              <svg class="stats-card__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stats-card__image">
              <img [src]="stat.imageUrl" [alt]="stat.title" loading="lazy">
            </div>
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 1.6rem;
      margin: 2.4rem 0;
    }

    .stats-card {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      backdrop-filter: blur(8px);
    }

    .stats-card--wide {
      grid-column: 1;
      grid-row: 1 / 3;
      display: flex;
      flex-direction: column;
    }

    .stats-card--wide .stats-card__link {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .stats-card--wide .stats-card__image {
      flex: 1;
    }

    .stats-card--wide .stats-card__image img {
      height: 100%;
      object-fit: scale-down;
    }

    .stats-card:hover {
      border-color: rgba(234, 190, 124, 0.28);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(234, 190, 124, 0.08);
      transform: translateY(-3px);
    }

    .stats-card__link {
      display: block;
      text-decoration: none;
      color: inherit;
      height: 100%;
    }

    .stats-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.4rem 1.6rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      transition: background 0.25s ease;
    }

    .stats-card:hover .stats-card__header {
      background: rgba(255, 255, 255, 0.035);
    }

    .stats-card__label {
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }

    .stats-card__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-1);
      opacity: 0.7;
      flex-shrink: 0;
    }

    .stats-card__title {
      font-size: 1.35rem;
      font-weight: 500;
      margin: 0;
      color: var(--color-text);
      letter-spacing: 0.01em;
    }

    .stats-card__icon {
      color: var(--color-1);
      opacity: 0;
      transition: all 0.3s ease;
      transform: translate(-6px, 6px);
      flex-shrink: 0;
    }

    .stats-card:hover .stats-card__icon {
      opacity: 1;
      transform: translate(0, 0);
    }

    .stats-card__image {
      width: 100%;
      overflow: hidden;
      padding: 1.2rem;
    }

    .stats-card__image img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
      transition: transform 0.4s ease;
    }

    .stats-card:hover .stats-card__image img {
      transform: scale(1.015);
    }

    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }

      .stats-card--wide {
        grid-column: 1;
        grid-row: auto;
      }
    }

    @media (max-width: 768px) {
      .stats-card__title {
        font-size: 1.2rem;
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
