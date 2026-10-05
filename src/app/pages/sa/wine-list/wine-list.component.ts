import { Component } from '@angular/core';
import { SortingServiceService } from '@app/services/s/sorting-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WineService } from '@app/services/s/wine-service.service';
import { HttpClientModule } from '@angular/common/http';

export interface Wine {
  name: string;
  rating: number;
  notes: string;
}
@Component({
  selector: 'app-wine-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './wine-list.component.html',
  styleUrl: './wine-list.component.scss'
})
export class WineListComponent {
  wines: Wine[] = [];
  newWine: Wine = { name: '', rating: 1, notes: '' };
  showForm = false;

  constructor(private sortingService: SortingServiceService, private wineService: WineService) {}
  ngOnInit() {
    this.loadWines();
  }

  loadWines(): void {
    this.wineService.getWines().subscribe({
      next: (data) => {
        this.wines = data;
      },
      error: (err) => console.error('Error fetching wines', err)
    });
  }

  onSubmit(): void {
    // Send the new wine to the Python backend
    this.wineService.addWine(this.newWine).subscribe({
      next: (response) => {
        console.log('Wine saved!', response);
        this.loadWines(); // Refresh the list to show the new entry
        
        // Reset the form inputs
        this.newWine = { name: '', rating: 1, notes: '' };
      },
      error: (err) => console.error('Error saving wine', err)
    });
  }

  openForm() {
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.newWine = { name: '', rating: 1, notes: '' };
  }
}
