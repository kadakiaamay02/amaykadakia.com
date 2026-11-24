import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CodeWindow } from '@app/code-window/code-window';
import {
  ChecklistKey, GuestFlight, GuestFlightInput, GuestFlightsResponse, Person, WeddingService,
} from '@app/services/s/wedding.service';

interface GuestForm {
  guest_name: string;
  event: ChecklistKey;
  flight: string;
  flight_date: string;
  arrive_time: string;
  from_airport: string;
  to_airport: string;
  pickup_by: string;
  notes: string;
  auto_pin: boolean;
}

const emptyForm = (event: ChecklistKey): GuestForm => ({
  guest_name: '', event, flight: '', flight_date: '', arrive_time: '', from_airport: '', to_airport: '',
  pickup_by: '', notes: '', auto_pin: true,
});

const REFRESH_MS = 60_000;

/**
 * Guest flights: who is flying in, and when. On the day, each flight goes on the matrix board on its own
 * (the same pins as the flight tracker page), a few hours before it lands.
 */
@Component({
  selector: 'app-guest-flights',
  standalone: true,
  imports: [FormsModule, RouterLink, CodeWindow],
  templateUrl: './guest-flights.component.html',
  styleUrl: './guest-flights.component.scss'
})
export class GuestFlightsComponent implements OnInit, OnDestroy {
  private api = inject(WeddingService);
  private messageTimer?: ReturnType<typeof setTimeout>;
  private refreshTimer?: ReturnType<typeof setInterval>;

  readonly formLines = ['// Guest flights', '// Goes on the matrix board on the day'];
  readonly events: { value: ChecklistKey; label: string }[] = [
    { value: 'engagement', label: 'Engagement' }, { value: 'wedding', label: 'Wedding' },
  ];
  readonly stateLabels: Record<string, string> = {
    scheduled: 'Scheduled', pinning: 'Going on the board…', queued: 'Waiting for a free spot',
    tracking: 'On the board', landed: 'Landed', off: 'Not on the board', past: 'Done',
  };
  readonly liveLabels: Record<string, string> = {
    airborne: 'In the air', on_ground: 'On the ground', not_broadcasting: 'No signal right now',
    not_found: 'Not flying yet', waiting: 'Checking…',
  };

  event: ChecklistKey = 'engagement';
  data: GuestFlightsResponse | null = null;
  people: Person[] = [];
  form: GuestForm = emptyForm('engagement');
  editingId: number | null = null;
  loading = true;
  saving = false;
  formOpen = false;
  busy = new Set<number>();
  error = '';
  success = '';

  get flights(): GuestFlight[] {
    return this.data?.flights ?? [];
  }

  /** Flights grouped by the day they land, soonest first; finished days go last */
  get days(): { date: string; label: string; flights: GuestFlight[]; past: boolean }[] {
    const today = this.localDate(new Date());
    const byDate = new Map<string, GuestFlight[]>();
    for (const f of this.flights) {
      byDate.set(f.flight_date, [...(byDate.get(f.flight_date) ?? []), f]);
    }
    const days = [...byDate.entries()].map(([date, flights]) => ({
      date, flights, label: this.dayLabel(date, today), past: date < today,
    }));
    return [...days.filter(d => !d.past), ...days.filter(d => d.past).reverse()];
  }

  get boardText(): string {
    if (!this.data) return '';
    const used = this.data.pinned.length;
    return `${used} of ${this.data.max_pinned} spots in use${used ? ': ' + this.data.pinned.join(', ') : ''}`;
  }

  get comingCount(): number {
    return this.flights.filter(f => !['landed', 'past'].includes(f.state)).length;
  }

  ngOnInit(): void {
    this.load();
    this.api.getPeople().subscribe({ next: people => this.people = people, error: () => {} });
    this.refreshTimer = setInterval(() => this.load(true), REFRESH_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
    clearInterval(this.refreshTimer);
  }

  setEvent(event: ChecklistKey): void {
    this.event = event;
    if (!this.editingId) this.form.event = event;
    this.loading = true;
    this.load();
  }

  load(quiet = false): void {
    this.api.getGuestFlights(this.event).subscribe({
      next: data => {
        this.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        if (!quiet) this.showError('Could not load guest flights. Is the server running?');
      }
    });
  }

  save(): void {
    const f = this.form;
    if (!f.guest_name.trim()) return this.showError("Add who's flying.");
    if (!f.flight.trim()) return this.showError('Add a flight number, like AA1234.');
    if (!f.flight_date) return this.showError('Add the day they land.');

    // Times are sent as Unix seconds from this browser, so the server's time zone doesn't matter
    const dayStart = new Date(`${f.flight_date}T00:00`);
    const arrive = f.arrive_time ? new Date(`${f.flight_date}T${f.arrive_time}`) : null;
    const payload: GuestFlightInput = {
      guest_name: f.guest_name.trim(),
      event: f.event,
      flight: f.flight.trim().toUpperCase(),
      flight_date: f.flight_date,
      day_start_ts: Math.floor(dayStart.getTime() / 1000),
      arrive_time: f.arrive_time || null,
      arrive_ts: arrive ? Math.floor(arrive.getTime() / 1000) : null,
      from_airport: f.from_airport.trim().toUpperCase() || null,
      to_airport: f.to_airport.trim().toUpperCase() || null,
      pickup_by: f.pickup_by.trim() || null,
      notes: f.notes.trim() || null,
      auto_pin: f.auto_pin,
    };

    this.saving = true;
    const request: Observable<GuestFlight> = this.editingId
      ? this.api.updateGuestFlight(this.editingId, payload)
      : this.api.addGuestFlight(payload);
    request.subscribe({
      next: saved => {
        this.saving = false;
        const onBoard = saved.state === 'tracking' ? ' It is on the matrix board now.' : '';
        this.showSuccess((this.editingId ? 'Saved.' : `${saved.guest_name}'s flight added.`) + onBoard);
        if (saved.event !== this.event) this.event = saved.event;
        this.cancelEdit();
        this.formOpen = false;
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.showError(err.error?.error || 'Could not save.');
      }
    });
  }

  edit(f: GuestFlight): void {
    this.editingId = f.id;
    this.form = {
      guest_name: f.guest_name, event: f.event, flight: f.flight, flight_date: f.flight_date,
      arrive_time: f.arrive_time ?? '', from_airport: f.from_airport ?? '', to_airport: f.to_airport ?? '',
      pickup_by: f.pickup_by ?? '', notes: f.notes ?? '', auto_pin: f.auto_pin,
    };
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = emptyForm(this.event);
  }

  remove(f: GuestFlight): void {
    if (!confirm(`Remove ${f.guest_name}'s flight ${f.flight}?`)) return;
    this.busy.add(f.id);
    this.api.deleteGuestFlight(f.id).subscribe({
      next: res => {
        this.busy.delete(f.id);
        if (this.editingId === f.id) this.cancelEdit();
        this.showSuccess(res.message);
        this.load();
      },
      error: () => {
        this.busy.delete(f.id);
        this.showError('Could not remove that flight.');
      }
    });
  }

  toggleAuto(f: GuestFlight): void {
    this.busy.add(f.id);
    this.api.updateGuestFlight(f.id, { auto_pin: !f.auto_pin }).subscribe({
      next: () => {
        this.busy.delete(f.id);
        this.load(true);
      },
      error: (err: HttpErrorResponse) => {
        this.busy.delete(f.id);
        this.showError(err.error?.error || 'Could not change that.');
      }
    });
  }

  pinNow(f: GuestFlight): void {
    this.busy.add(f.id);
    this.api.pinGuestFlight(f.id).subscribe({
      next: res => {
        this.busy.delete(f.id);
        this.showSuccess(res.message ?? `${f.flight} is on the matrix board.`);
        this.load(true);
      },
      error: (err: HttpErrorResponse) => {
        this.busy.delete(f.id);
        this.showError(err.error?.error || `Could not put ${f.flight} on the board.`);
      }
    });
  }

  /**
   * "Pin now" only around the time they fly: the board follows today's flight with that number, so pinning a
   * flight days early would show someone else's trip. Up to 18 hours before landing covers long-haul flights.
   */
  canPinNow(f: GuestFlight): boolean {
    if (['tracking', 'landed'].includes(f.state)) return false;
    const now = Date.now() / 1000;
    const from = f.arrive_ts ? f.arrive_ts - 18 * 3600 : f.day_start_ts - 3 * 3600;
    return now >= from && now <= f.pin_until_ts;
  }

  /** One line under the flight saying what the board is doing with it */
  boardLine(f: GuestFlight): string {
    switch (f.state) {
      case 'scheduled': return `Goes on the board ${this.when(f.pin_from_ts)}`;
      case 'pinning': return 'Going on the board within a minute';
      case 'queued': return `All ${this.data?.max_pinned ?? 3} spots are taken. It goes on when one frees up.`;
      case 'tracking': return 'On the matrix board';
      case 'landed': return f.landed_at ? `Landed ${this.when(f.landed_at)}` : 'Landed';
      case 'off': return 'Won’t go on the board on its own';
      default: return '';
    }
  }

  liveLine(f: GuestFlight): string {
    const t = f.tracking;
    if (!t) return '';
    const parts = [t.arrived ? 'Arrived' : (this.liveLabels[t.status] ?? t.status)];
    if (t.status === 'airborne' && t.altitude_ft) parts.push(`${Math.round(t.altitude_ft).toLocaleString()} ft`);
    if (!t.arrived && t.eta_ts) parts.push(`ETA ~${this.clock(t.eta_ts)}`);
    if (!t.arrived && t.remaining_nm) parts.push(`${Math.round(t.remaining_nm).toLocaleString()} nm to go`);
    return parts.join(' · ');
  }

  progress(f: GuestFlight): number | null {
    const p = f.tracking?.progress;
    if (f.tracking?.arrived) return 100;
    return typeof p === 'number' ? Math.round(p * 100) : null;
  }

  landsAt(f: GuestFlight): string {
    return f.arrive_ts ? `Lands ${this.clock(f.arrive_ts)}` : 'Landing time not set';
  }

  // ---------- formatting

  private clock(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  /** "at 3:40 PM" today, otherwise "Tue 3:40 PM" */
  private when(ts: number): string {
    const d = new Date(ts * 1000);
    if (d.toDateString() === new Date().toDateString()) return `at ${this.clock(ts)}`;
    return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  private dayLabel(date: string, today: string): string {
    const d = new Date(`${date}T00:00`);
    const label = d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    const tomorrow = this.localDate(new Date(Date.now() + 86_400_000));
    if (date === today) return `Today · ${label}`;
    if (date === tomorrow) return `Tomorrow · ${label}`;
    return label;
  }

  private localDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  private showSuccess(message: string): void {
    this.error = '';
    this.success = message;
    clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => this.success = '', 4000);
  }

  private showError(message: string): void {
    this.success = '';
    this.error = message;
  }
}
