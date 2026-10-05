import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PortfolioService } from '@app/services/portfolio.service';
import { Certification, EducationModel } from '@app/models/portfolio.model';

@Component({
  selector: 'app-education',
  imports: [],
  templateUrl: './education.html',
  styleUrl: './education.scss',
  standalone: true
})
export class Education implements OnInit {
  degrees: EducationModel[] = [];
  certifications: Certification[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.education$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.degrees = data);

    this.portfolioService.certifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.certifications = data);
  }
}