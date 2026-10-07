import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CodeWindow } from '@app/code-window/code-window';

type FlightStatus = 'airborne' | 'on_ground' | 'not_broadcasting' | 'not_found' | 'waiting';

/**
 * Shape of tracked_summary() in app.py. Only `flight` and `status` are guaranteed
 * (a pin that hasn't been polled yet is just { flight, status: 'waiting' }).
 */
interface TrackedFlight {
  flight: string;
  status: FlightStatus | string;
  callsign?: string | null;
  tail_number?: string | null;
  aircraft_type?: string | null;
  airline?: string | null;
  origin?: string | null;
  destination?: string | null;
  origin_city?: string | null;       // added to tracked_summary() in app.py
  destination_city?: string | null;
  altitude_ft?: number | null;
  ground_speed_kt?: number | null;
  track_deg?: number | null;
  vertical_rate_fpm?: number | null;
  on_ground?: boolean | null;
  phase?: string | null;             // CLIMB, CRUISE, DESCENT, LANDING, DEPARTING, GROUND
  arrived?: boolean | null;
  progress?: number | null;          // 0-1 along the route
  remaining_nm?: number | null;
  eta_ts?: number | null;            // Unix seconds, straight-line estimate
  last_seen_ts?: number | null;
  event?: { type: 'departed' | 'landed'; ts: number; detail?: string } | null;
}

interface Stat {
  label: string;
  value: string;
  hint?: string; // extra text for screen readers / tooltip
}

/** Everything the card displays, already formatted */
export interface FlightView {
  key: string;
  flight: string;
  status: string;
  statusLabel: string;
  airline?: string;
  origin?: string;
  destination?: string;
  originName?: string;
  destinationName?: string;
  aircraft?: string;
  tail?: string;
  phase?: string;
  progress?: number;       // 0-100 for the route bar
  eta?: string;            // "8:42 PM"
  etaIn?: string;          // "in 1 hr 20 min"
  remaining?: string;      // "412 nm to go"
  arrived: boolean;
  event?: string;          // "Departed from BWI 14 min ago"
  stats: Stat[];
  lastSeen?: string;
}

interface PinResponse {
  message: string;
  tracking: TrackedFlight | null;
}

interface PinnedResponse {
  pinned: TrackedFlight[];
}

@Component({
  selector: 'app-flight-tracker',
  imports: [FormsModule, CodeWindow],
  templateUrl: './flight-tracker.html',
  styleUrl: './flight-tracker.scss',
  standalone: true
})
export class FlightTracker implements OnInit {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private apiUrl = `${environment.apiUrl}/track`;

  readonly trackerLines = [
    '// Flight tracker',
    '// Enter a flight number to pin it',
  ];

  readonly statusLabels: Record<string, string> = {
    airborne: 'Airborne',
    on_ground: 'On the ground',
    not_broadcasting: 'Not broadcasting',
    not_found: 'Not found',
    waiting: 'Waiting for data',
    arrived: 'Arrived',
  };

  flightNumber = '';
  error = '';
  message = '';
  tracking = false;

  pinned: FlightView[] = [];
  loadingPinned = true;
  removing = new Set<string>(); // flights currently being deleted

  ngOnInit(): void {
    this.loadPinned();
  }

  loadPinned(): void {
    this.loadingPinned = true;
    this.http
      .get<PinnedResponse>(`${this.apiUrl}/pinned`)
      .pipe(
        finalize(() => (this.loadingPinned = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => (this.pinned = (res.pinned ?? []).map(f => this.toView(f))),
        error: err => (this.error = this.errorText(err, 'Could not load pinned flights.')),
      });
  }

  checkFlightNumber(): void {
    const flight = this.flightNumber.trim().toUpperCase();
    if (!flight) {
      this.error = 'Error: flight number is empty.';
      return;
    }

    this.tracking = true;
    this.error = '';
    this.message = '';

    this.http
      .post<PinResponse>(`${this.apiUrl}/${encodeURIComponent(flight)}/pin`, {})
      .pipe(
        finalize(() => (this.tracking = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.message = res.message;
          this.flightNumber = '';
          this.loadPinned(); // refresh the list so the new pin shows up
        },
        error: err => (this.error = this.errorText(err, 'Something went wrong pinning that flight.')),
      });
  }

  removePin(flight: FlightView): void {
    const key = flight.key;
    if (this.removing.has(key)) return;

    this.removing.add(key);
    this.error = '';
    this.message = '';

    this.http
      .delete<{ message?: string }>(`${this.apiUrl}/${encodeURIComponent(key)}/pin`)
      .pipe(
        finalize(() => this.removing.delete(key)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.pinned = this.pinned.filter(f => f.key !== key);
          this.message = res?.message ?? `Unpinned ${flight.flight}.`;
        },
        error: err => (this.error = this.errorText(err, `Could not unpin ${flight.flight}.`)),
      });
  }

  // ---------- Formatting ----------

  /** Maps tracked_summary() from app.py to what the card shows. */
  private toView(f: TrackedFlight): FlightView {
    const stats: Stat[] = [];
    const live = f.status === 'airborne';

    if (live && this.isNum(f.altitude_ft)) {
      stats.push({ label: 'Altitude', value: `${this.num(f.altitude_ft)} ft` });
    }
    if (live && this.isNum(f.ground_speed_kt)) {
      stats.push({
        label: 'Speed',
        value: `${this.num(f.ground_speed_kt)} kt`,
        hint: `${this.num(f.ground_speed_kt * 1.15078)} mph`,
      });
    }
    if (live && this.isNum(f.track_deg)) {
      const deg = Math.round(((f.track_deg % 360) + 360) % 360);
      stats.push({ label: 'Heading', value: `${deg}° ${this.compass(deg)}` });
    }
    if (live && this.isNum(f.vertical_rate_fpm)) {
      stats.push(this.verticalStat(f.vertical_rate_fpm));
    }

    const arrived = !!f.arrived;
    const eta = !arrived && this.isNum(f.eta_ts) ? new Date(f.eta_ts * 1000) : null;

    return {
      key: f.flight,
      flight: f.flight,
      status: arrived ? 'arrived' : f.status,
      statusLabel: arrived ? 'Arrived' : (this.statusLabels[f.status] ?? f.status),
      airline: f.airline ?? undefined,
      origin: f.origin ?? undefined,
      destination: f.destination ?? undefined,
      originName: f.origin_city ?? undefined,
      destinationName: f.destination_city ?? undefined,
      aircraft: f.aircraft_type ?? undefined,
      tail: f.tail_number ?? undefined,
      phase: live && f.phase ? this.phaseLabels[f.phase] ?? f.phase : undefined,
      progress: this.isNum(f.progress) ? Math.round((arrived ? 1 : f.progress) * 100) : undefined,
      eta: this.clock(eta),
      etaIn: eta ? this.until(eta) : undefined,
      remaining: !arrived && this.isNum(f.remaining_nm) ? `${this.num(f.remaining_nm)} nm to go` : undefined,
      arrived,
      event: f.event ? this.eventText(f.event) : undefined,
      stats,
      lastSeen: this.relative(f.last_seen_ts),
    };
  }

  readonly phaseLabels: Record<string, string> = {
    DEPARTING: 'Departing',
    CLIMB: 'Climbing',
    CRUISE: 'Cruising',
    DESCENT: 'Descending',
    LANDING: 'Landing',
    GROUND: 'On the ground',
  };

  private eventText(e: NonNullable<TrackedFlight['event']>): string {
    const what = e.type === 'departed' ? 'Departed' : 'Landed';
    return `${what}${e.detail ? ' ' + e.detail.split('  ')[0] : ''} ${this.relative(e.ts)}`;
  }

  /** "in 1 hr 20 min" */
  private until(d: Date): string {
    const min = Math.max(0, Math.round((d.getTime() - Date.now()) / 60000));
    if (min < 1) return 'any minute';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `in ${h ? `${h} hr ` : ''}${m ? `${m} min` : ''}`.trim();
  }

  private verticalStat(fpm: number): Stat {
    if (Math.abs(fpm) < 100) return { label: 'Vertical', value: '→ Level', hint: 'Level flight' };
    const climbing = fpm > 0;
    return {
      label: 'Vertical',
      value: `${climbing ? '↑' : '↓'} ${this.num(Math.abs(fpm))} fpm`,
      hint: climbing ? 'Climbing' : 'Descending',
    };
  }

  /** Accepts ISO strings or Unix seconds */
  private toDate(v?: string | number | null): Date | null {
    if (v === null || v === undefined || v === '') return null;
    const d = typeof v === 'number' ? new Date(v * 1000) : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  private clock(d: Date | null): string | undefined {
    if (!d) return undefined;
    const sameDay = d.toDateString() === new Date().toDateString();
    return d.toLocaleString(undefined, sameDay
      ? { hour: 'numeric', minute: '2-digit' }
      : { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  private relative(v?: string | number | null): string | undefined {
    const d = this.toDate(v);
    if (!d) return undefined;
    const sec = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
    if (sec < 60) return 'just now';
    if (sec < 3600) return `${Math.round(sec / 60)} min ago`;
    if (sec < 86400) return `${Math.round(sec / 3600)} hr ago`;
    return d.toLocaleDateString();
  }

  private compass(deg: number): string {
    const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return points[Math.round(deg / 45) % 8];
  }

  private num(n: number): string {
    return Math.round(n).toLocaleString();
  }

  private isNum(v: unknown): v is number {
    return typeof v === 'number' && Number.isFinite(v);
  }

  private errorText(err: HttpErrorResponse, fallback: string): string {
    if (err.status === 0) return "Error: can't reach the server. Try again in a moment.";
    return `Error: ${err.error?.error ?? fallback}`;
  }
}