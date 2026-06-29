import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioGridComponent } from '../portfolio-grid/portfolio-grid.component';
import { StatsGridComponent } from '../stats-grid/stats-grid.component';
import { TimelineEntry, Skill, Certification } from '../../models/portfolio.model';
import { PORTFOLIO_PROJECTS } from '../../models/portfolio-data';
import { RouterLink } from '@angular/router';
import { AnimationService } from '@app/services/animation.service';

@Component({
    selector: 'app-about',
    imports: [CommonModule, PortfolioGridComponent, StatsGridComponent, RouterLink],
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, AfterViewInit {
  private animationService = inject(AnimationService);

  experience: TimelineEntry[] = [];
  education: TimelineEntry[] = [];
  skills: Skill[] = [];
  certifications: Certification[] = [];
  portfolioProjects = PORTFOLIO_PROJECTS;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.experience$.subscribe(data => {
      this.experience = data;
    });

    this.portfolioService.education$.subscribe(data => {
      this.education = data;
    });

    this.portfolioService.skills$.subscribe(data => {
      this.skills = data;
    });

    this.portfolioService.certifications$.subscribe(data => {
      this.certifications = data;
    });
  }

  ngAfterViewInit(): void {
    // This tells the script to look for the new elements injected by the router
    this.animationService.animateOnScroll('[data-animate-block]');
  }
}
