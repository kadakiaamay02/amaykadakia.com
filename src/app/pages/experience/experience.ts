import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '@app/services/portfolio.service';
import { WorkExperience } from '@app/models/portfolio.model';


@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  standalone: true
})
export class Experience {
    experiences: WorkExperience[] = [];

    constructor(private portfolioService: PortfolioService) {}

    ngOnInit(): void {
        this.portfolioService.experience$.subscribe(data => {
            this.experiences = data;
        });
    }
}
