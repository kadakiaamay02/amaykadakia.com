import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ModalService, Portfolio } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" 
         *ngIf="isOpen$ | async" 
         (click)="closeModal()"
         [@fadeInOut]>
      <div class="modal-container" (click)="$event.stopPropagation()" [@slideIn]>
        <button class="modal-close" (click)="closeModal()" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <ng-container *ngIf="project$ | async as project">
          <div class="modal-content">
            <div class="modal-image" *ngIf="project.image">
              <img [src]="project.image" [alt]="project.title" />
            </div>

            <div class="modal-body">
              <div class="modal-header">
                <h2 class="modal-title">{{ project.title }}</h2>
                <p class="modal-category">{{ project.category }}</p>
              </div>

              <p class="modal-description">{{ project.details }}</p>

              <div class="modal-tags" *ngIf="project.tags && project.tags.length">
                <span class="modal-tag" *ngFor="let tag of project.tags">
                  {{ tag }}
                </span>
              </div>

              <div class="modal-footer" *ngIf="project.link">
                <a [href]="project.link" target="_blank" class="modal-link">
                  View Project
                  <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
    }

    .modal-container {
      background: var(--color-body);
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 40px;
      height: 40px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text);
      transition: all 0.3s ease;
      z-index: 10;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    .modal-image {
      width: 100%;
      height: 300px;
      overflow: hidden;
      border-radius: 12px 12px 0 0;
    }

    .modal-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-body {
      padding: 2rem;
    }

    .modal-header {
      margin-bottom: 1.5rem;
    }

    .modal-title {
      font-size: 2rem;
      font-weight: 600;
      color: var(--color-text-dark);
      margin-bottom: 0.5rem;
    }

    .modal-category {
      color: var(--color-1);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }

    .modal-description {
      color: var(--color-text);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    .modal-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .modal-tag {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--color-gray-9);
      border-radius: 20px;
      font-size: 0.875rem;
      color: var(--color-text);
    }

    .modal-footer {
      border-top: 1px solid var(--color-border);
      padding-top: 1.5rem;
    }

    .modal-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--color-1);
      color: var(--color-body);
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .modal-link:hover {
      background: var(--color-2);
      transform: translateX(4px);
    }

    .modal-link svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 600px) {
      .modal-container {
        border-radius: 12px;
      }

      .modal-image {
        height: 200px;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .modal-title {
        font-size: 1.5rem;
      }
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {
  isOpen$ = this.modalService.getModalState();
  project$ = this.modalService.getSelectedProject();

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  closeModal(): void {
    this.modalService.closeModal();
  }
}
