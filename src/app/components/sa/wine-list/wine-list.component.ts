import { Component } from '@angular/core';
import { SortingServiceService } from '@app/services/s/sorting-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Wine {
  name: string;
  rating: number;
  notes: string;
}
@Component({
  selector: 'app-wine-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wine-list.component.html',
  styleUrl: './wine-list.component.scss'
})
export class WineListComponent {
  wines: Wine[] = [];
  newWine: Wine = { name: '', rating: 1, notes: '' };
  showForm = false;

  constructor(private sortingService: SortingServiceService) {}

  addWine() {
    if (this.newWine.name.trim()) {
      this.wines.push({ ...this.newWine });
      this.wines = this.sortingService.sortByKey(this.wines, 'rating', 'desc');
      this.newWine = { name: '', rating: 1, notes: '' };
      this.showForm = false;
    }
  }

  openForm() {
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.newWine = { name: '', rating: 1, notes: '' };
  }
}
