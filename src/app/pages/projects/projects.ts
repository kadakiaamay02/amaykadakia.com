import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PortfolioService } from '@app/services/portfolio.service';
import { Project } from '@app/models/portfolio.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit, OnDestroy {
  @ViewChild('closeBtn') closeBtn?: ElementRef<HTMLButtonElement>;

  projects: Project[] = [];
  selectedProject: Project | null = null;

  private destroyRef = inject(DestroyRef);
  private lastFocused: HTMLElement | null = null;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.portfolio$.subscribe(data => {
            this.projects = data;
        });

  }

  openProject(project: Project): void {
    this.lastFocused = document.activeElement as HTMLElement;
    this.selectedProject = project;
    document.body.style.overflow = 'hidden'; // stop the page scrolling behind the modal

    // Move focus into the modal once it has rendered
    setTimeout(() => this.closeBtn?.nativeElement.focus());
  }

  closeModal(): void {
    if (!this.selectedProject) return;

    this.selectedProject = null;
    document.body.style.overflow = '';
    this.lastFocused?.focus(); // return focus to the card that opened it
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}