import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../models/portfolio.model';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
  portfolioItems: Portfolio[] = [];
  selectedModal: Portfolio | null = null;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.portfolio$.subscribe(data => {
      this.portfolioItems = data;
    });
  }

  openModal(item: Portfolio): void {
    this.selectedModal = item;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedModal = null;
    document.body.style.overflow = 'auto';
  }
}
