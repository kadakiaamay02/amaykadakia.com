import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../services/modal.service';

@Component({
  selector: 'app-portfolio-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portfolio-grid">
      @for (project of projects; track project.title; let i = $index) {
        <div class="portfolio-card" [class.is-open]="expandedId === i">
          <div class="portfolio-card__header" (click)="toggleProject(i)">
            <div class="portfolio-card__image">
              <img [src]="project.image" [alt]="project.title">
            </div>
            <div class="portfolio-card__info">
              <span class="portfolio-card__category">{{ project.category }}</span>
              <h3 class="portfolio-card__title">{{ project.title }}</h3>
            </div>
            <button class="portfolio-card__toggle" [class.open]="expandedId === i" aria-label="Toggle details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="portfolio-card__content" [class.expanded]="expandedId === i">
            <div class="portfolio-card__details">
              <p class="portfolio-card__description">{{ project.details }}</p>

              @if (project.tags && project.tags.length) {
                <div class="portfolio-card__tags">
                  @for (tag of project.tags; track tag) {
                    <span class="portfolio-card__tag">{{ tag }}</span>
                  }
                </div>
              }

              @if (project.link) {
                <div class="portfolio-card__links">
                  <a [href]="project.link" target="_blank" class="portfolio-card__link">
                    View Project
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.6rem;
      margin: 2.4rem 0;
    }

    .portfolio-card {
      background: rgba(255, 255, 255, 0.025);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.07);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(8px);
    }

    .portfolio-card:hover,
    .portfolio-card.is-open {
      border-color: rgba(234, 190, 124, 0.25);
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(234, 190, 124, 0.08);
      transform: translateY(-2px);
    }

    .portfolio-card__header {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      padding: 1.6rem;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s ease;
    }

    .portfolio-card__header:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .portfolio-card__image {
      width: 72px;
      height: 72px;
      flex-shrink: 0;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .portfolio-card__image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .portfolio-card:hover .portfolio-card__image img {
      transform: scale(1.06);
    }

    .portfolio-card__info {
      flex: 1;
      min-width: 0;
    }

    .portfolio-card__category {
      display: block;
      font-size: 1.1rem;
      font-weight: 400;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-2-lighter);
      margin-bottom: 0.3rem;
    }

    .portfolio-card__title {
      font-size: 1.7rem;
      font-weight: 600;
      margin: 0;
      color: var(--color-white);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }

    .portfolio-card__toggle {
      background: rgba(234, 190, 124, 0.08);
      border: 1px solid rgba(234, 190, 124, 0.18);
      border-radius: 50%;
      cursor: pointer;
      color: var(--color-1);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }

    .portfolio-card__toggle:hover {
      background: rgba(234, 190, 124, 0.15);
      border-color: var(--color-1);
    }

    .portfolio-card__toggle.open {
      transform: rotate(180deg);
      background: rgba(234, 190, 124, 0.15);
      border-color: var(--color-1);
    }

    .portfolio-card__content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .portfolio-card__content.expanded {
      max-height: 600px;
    }

    .portfolio-card__details {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 1.6rem;
    }

    .portfolio-card__description {
      font-size: 1.55rem;
      line-height: 1.7;
      color: var(--color-text);
      margin: 0 0 1.6rem 0;
    }

    .portfolio-card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.6rem;
    }

    .portfolio-card__tag {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 1rem;
      background: rgba(35, 150, 127, 0.07);
      border: 1px solid rgba(35, 150, 127, 0.2);
      border-radius: 100px;
      font-size: 1.2rem;
      color: var(--color-2-lighter);
      letter-spacing: 0.02em;
      line-height: 1;
    }

    .portfolio-card__links {
      display: flex;
      gap: 1rem;
    }

    .portfolio-card__link {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.8rem 1.8rem;
      background: transparent;
      color: var(--color-1);
      border: 1px solid rgba(234, 190, 124, 0.4);
      border-radius: 100px;
      text-decoration: none;
      font-weight: 500;
      font-size: 1.4rem;
      letter-spacing: 0.05em;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .portfolio-card__link:hover {
      background: var(--color-1);
      border-color: var(--color-1);
      color: var(--color-gray-10);
      box-shadow: 0 4px 20px rgba(234, 190, 124, 0.25);
      gap: 0.9rem;
    }

    @media (max-width: 768px) {
      .portfolio-grid {
        grid-template-columns: 1fr;
        gap: 1.2rem;
      }

      .portfolio-card__image {
        width: 60px;
        height: 60px;
      }

      .portfolio-card__title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PortfolioGridComponent {
  @Input() projects: Portfolio[] = [];
  expandedId: number | null = null;

  toggleProject(index: number): void {
    this.expandedId = this.expandedId === index ? null : index;
  }
}
