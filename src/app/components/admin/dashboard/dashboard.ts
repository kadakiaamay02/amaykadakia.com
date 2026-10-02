import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, EventItem } from '../../../services/dashboard.service';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';

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
    this.autoRefresh ? this.startAutoRefresh() : this.loadEvents();
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
      switchMap(() => this.dashboardService.getEvents(this.limit).pipe(
        catchError(err => {
          console.error('Auto-refresh failed', err);
          this.error = 'Failed to load events';
          return EMPTY;
        })
      ))
    ).subscribe(events => {
      this.applyEvents(events);
      this.error = null;
    });
  }

  stopAutoRefresh(): void {
    if (this.autoSub) {
      this.autoSub.unsubscribe();
      this.autoSub = null;
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh ? this.startAutoRefresh() : this.stopAutoRefresh();
  }

  private expanded = new Set<number>();

  private applyEvents(events: EventItem[]): void {
    this.events = events.map(e => ({ ...e, _expanded: this.expanded.has(e.id) }));
  }

  toggleRow(e: EventItem): void {
  e._expanded = !e._expanded;
  e._expanded ? this.expanded.add(e.id) : this.expanded.delete(e.id);
  }
}
