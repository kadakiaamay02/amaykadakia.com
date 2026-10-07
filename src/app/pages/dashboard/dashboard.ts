import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subscription, interval } from 'rxjs';

export interface DashboardEvent {
  timestamp_iso?: string;
  source?: string;
  level?: string;
  message?: string;
  data?: any;
}
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, OnDestroy {
  private apiUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  limit: number = 50;
  events: DashboardEvent[] = [];
  private autoSub: Subscription | null = null;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.http.get<DashboardEvent[]>(`${this.apiUrl}/events?limit=${this.limit}`)
      .subscribe({
        next: (data) => this.events = data,
        error: (err) => console.error('Failed to load events:', err)
      });
  }

  startAuto(): void {
    this.stopAuto();
    this.autoSub = interval(3000).subscribe(() => this.refresh());
  }

  stopAuto(): void {
    if (this.autoSub) {
      this.autoSub.unsubscribe();
      this.autoSub = null;
    }
  }

  formatData(data: any): string {
    if (data === null || data === undefined || data === '') {
      return '';
    }
    return typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
  }

  ngOnDestroy(): void {
    this.stopAuto();
  }
}
