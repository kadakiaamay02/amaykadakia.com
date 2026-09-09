import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, EventItem } from '../../../services/dashboard.service';
import { Subject, Subscription, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, OnDestroy {
  events: EventItem[] = [];
  limit = 100;
  loading = false;
  error: string | null = null;
  autoRefresh = true;
  autoMs = 3000;

  private destroy$ = new Subject<void>();
  private autoSub: Subscription | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadEvents();
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    this.dashboardService.getEvents(this.limit).pipe(takeUntil(this.destroy$)).subscribe({
      next: (events) => {
        // ensure each event has collapsed state
        this.events = events.map(e => ({ ...e, _expanded: false } as any));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load events', err);
        this.error = 'Failed to load events';
        this.loading = false;
      }
    });
  }

  refreshManual(): void {
    this.loadEvents();
  }

  startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.autoSub = timer(0, this.autoMs).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.dashboardService.getEvents(this.limit))
    ).subscribe({
      next: (events) => {
        this.events = events.map(e => ({ ...e, _expanded: false } as any));
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Auto-refresh failed', err);
        this.error = 'Auto-refresh failed';
      }
    });
  }

  stopAutoRefresh(): void {
    if (this.autoSub) {
      this.autoSub.unsubscribe();
      this.autoSub = null;
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  toggleRow(event: any): void {
    event._expanded = !event._expanded;
  }
}
