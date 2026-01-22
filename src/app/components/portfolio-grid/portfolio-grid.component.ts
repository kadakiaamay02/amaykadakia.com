import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../services/modal.service';

@Component({
  selector: 'app-portfolio-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portfolio-grid">
      <div class="portfolio-card" *ngFor="let project of projects; let i = index">
        <div class="portfolio-card__header" (click)="toggleProject(i)">
          <div class="portfolio-card__image">
            <img [src]="project.image" [alt]="project.title">
          </div>
          <div class="portfolio-card__info">
            <h3 class="portfolio-card__title">{{ project.title }}</h3>
            <p class="portfolio-card__category">{{ project.category }}</p>
          </div>
          <button class="portfolio-card__toggle" [class.open]="expandedId === i" aria-label="Toggle details">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="portfolio-card__content" [class.expanded]="expandedId === i">
          <div class="portfolio-card__details">
            <p class="portfolio-card__description">{{ project.details }}</p>
            
            <div class="portfolio-card__tags" *ngIf="project.tags && project.tags.length">
              <span class="portfolio-card__tag" *ngFor="let tag of project.tags">
                {{ tag }}
              </span>
            </div>

            <div class="portfolio-card__links" *ngIf="project.link">
              <a [href]="project.link" target="_blank" class="portfolio-card__link">
                View Project
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }

    .portfolio-card {
      background: var(--color-gray-10);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--color-gray-8);
      transition: all 0.3s ease;
    }

    .portfolio-card:hover {
      border-color: var(--color-1);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .portfolio-card__header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      cursor: pointer;
      user-select: none;
      transition: background 0.3s ease;
    }

    .portfolio-card__header:hover {
      background: var(--color-gray-9);
    }

    .portfolio-card__image {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      border-radius: 6px;
      overflow: hidden;
      background: var(--color-gray-8);
    }

    .portfolio-card__image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .portfolio-card__info {
      flex: 1;
    }

    .portfolio-card__title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: var(--color-text);
    }

    .portfolio-card__category {
      font-size: 0.875rem;
      color: var(--color-gray-5);
      margin: 0;
    }

    .portfolio-card__toggle {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-1);
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }

    .portfolio-card__toggle.open {
      transform: rotate(180deg);
    }

    .portfolio-card__content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }

    .portfolio-card__content.expanded {
      max-height: 500px;
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .portfolio-card__details {
      border-top: 1px solid var(--color-gray-8);
      padding-top: 1.5rem;
    }

    .portfolio-card__description {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--color-text);
      margin: 0 0 1.5rem 0;
    }

    .portfolio-card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .portfolio-card__tag {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      background: var(--color-gray-9);
      border-radius: 16px;
      font-size: 0.8rem;
      color: var(--color-text);
      border: 1px solid var(--color-gray-8);
    }

    .portfolio-card__links {
      display: flex;
      gap: 1rem;
    }

    .portfolio-card__link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: var(--color-1);
      color: var(--color-body);
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .portfolio-card__link:hover {
      background: var(--color-2);
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .portfolio-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .portfolio-card__image {
        width: 70px;
        height: 70px;
      }

      .portfolio-card__title {
        font-size: 1rem;
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
