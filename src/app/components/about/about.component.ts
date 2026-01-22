import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioGridComponent } from '../portfolio-grid/portfolio-grid.component';
import { StatsGridComponent } from '../stats-grid/stats-grid.component';
import { TimelineEntry, Skill, Certification } from '../../models/portfolio.model';
import { PORTFOLIO_PROJECTS } from '../../models/portfolio-data';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, PortfolioGridComponent, StatsGridComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./css/styles.css', './css/vendor.css']
})
export class AboutComponent implements OnInit {
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
}
