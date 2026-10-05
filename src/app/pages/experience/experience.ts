import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PortfolioService } from '@app/services/portfolio.service';
import { WorkExperience } from '@app/models/portfolio.model';
import { CodeWindow } from '@app/code-window/code-window';

@Component({
  selector: 'app-experience',
  imports: [CodeWindow],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  standalone: true
})
export class Experience implements OnInit {
  experiences: WorkExperience[] = [];

  readonly headerLines = [
    '// Professional Experience',
    "// Where I've worked and what I've built there",
  ];

  private destroyRef = inject(DestroyRef);

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.experience$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.experiences = data);
  }
}