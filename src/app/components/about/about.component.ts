import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { TimelineEntry, Skill, Certification } from '../../models/portfolio.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  experience: TimelineEntry[] = [];
  education: TimelineEntry[] = [];
  skills: Skill[] = [];
  certifications: Certification[] = [];

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
