import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CodeWindow } from '@app/code-window/code-window';
import {
  ChecklistKey, GuestFlight, GuestFlightInput, GuestFlightsResponse, Person, ReturnFlightInput, WeddingService,
} from '@app/services/s/wedding.service';

interface GuestForm {
  guest_name: string;
  event: ChecklistKey;
  notes: string;
  auto_pin: boolean;
  // flying in
  flight: string;
  flight_date: string;
  arrive_time: string;
  from_airport: string;
  to_airport: string;
  pickup_by: string;
  // flying home
  ret_flight: string;
  ret_date: string;
  ret_time: string;
  ret_from: string;
  ret_to: string;
  ret_dropoff: string;
}

const emptyForm = (event: ChecklistKey): GuestForm => ({
  guest_name: '', event, notes: '', auto_pin: true,
  flight: '', flight_date: '', arrive_time: '', from_airport: '', to_airport: '', pickup_by: '',
  ret_flight: '', ret_date: '', ret_time: '', ret_from: '', ret_to: '', ret_dropoff: '',
});

const REFRESH_MS = 60_000;
const HOUR = 3600;

/**
 * Guest flights: who is flying in and home again, and when. On the day, each flight goes on the matrix board on
 * its own (the same pins as the flight tracker page): arrivals a few hours before they land, return flights
 * shortly before they take off.
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
  editingId: number | null = null;          // the arrival, or a return flight saved on its own
  editingReturnOnly = false;
  hadReturn = false;                        // the trip being edited already has a return flight
  loading = true;
  saving = false;
  formOpen = false;
  busy = new Set<number>();
  error = '';
  success = '';

  get flights(): GuestFlight[] {
    return this.data?.flights ?? [];
  }

  /** Flights grouped by the day they land or leave, soonest first; finished days go last */
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

  get comingText(): string {
    const coming = this.flights.filter(f => !['landed', 'past'].includes(f.state));
    const arriving = coming.filter(f => f.direction !== 'return').length;
    const leaving = coming.length - arriving;
    const parts: string[] = [];
    if (arriving) parts.push(`${arriving} arriving`);
    if (leaving) parts.push(`${leaving} flying home`);
    return parts.join(' · ') || 'All done';
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

  /** The return flight that belongs to this arrival, if any */
  returnOf(f: GuestFlight): GuestFlight | undefined {
    return this.flights.find(r => r.direction === 'return' && r.trip_id === f.id);
  }

  save(): void {
    const f = this.form;
    const hasArrival = !this.editingReturnOnly && !!f.flight.trim();
    const hasReturn = !!f.ret_flight.trim();
    if (!f.guest_name.trim()) return this.showError("Add who's flying.");
    if (!hasArrival && !hasReturn) return this.showError('Add a flight number, like AA1234.');
    if (hasArrival && !f.flight_date) return this.showError('Add the day they land.');
    if (hasReturn && !f.ret_date) return this.showError('Add the day they fly home.');
    if (hasArrival && hasReturn && f.ret_date < f.flight_date) {
      return this.showError('The flight home is before the day they land.');
    }
    if (this.editingId && !this.editingReturnOnly && !hasArrival) {
      return this.showError("Add the flight they're arriving on, or remove this guest and add the return flight on its own.");
    }

    const shared = {
      guest_name: f.guest_name.trim(),
      event: f.event,
      notes: f.notes.trim() || null,
      auto_pin: f.auto_pin,
    };
    const returnLeg: ReturnFlightInput | null = hasReturn ? {
      flight: f.ret_flight.trim().toUpperCase(),
      flight_date: f.ret_date,
      day_start_ts: this.ts(f.ret_date),
      depart_time: f.ret_time || null,
      depart_ts: f.ret_time ? this.ts(f.ret_date, f.ret_time) : null,
      // Going home usually retraces the trip in, so fill the airports from it when left blank
      from_airport: this.code(f.ret_from) || this.code(f.to_airport),
      to_airport: this.code(f.ret_to) || this.code(f.from_airport),
      pickup_by: f.ret_dropoff.trim() || null,
      auto_pin: f.auto_pin,
    } : null;

    let payload: GuestFlightInput;
    if (hasArrival) {
      payload = {
        ...shared,
        flight: f.flight.trim().toUpperCase(),
        flight_date: f.flight_date,
        day_start_ts: this.ts(f.flight_date),
        arrive_time: f.arrive_time || null,
        arrive_ts: f.arrive_time ? this.ts(f.flight_date, f.arrive_time) : null,
        from_airport: this.code(f.from_airport),
        to_airport: this.code(f.to_airport),
        pickup_by: f.pickup_by.trim() || null,
      };
      if (returnLeg) payload.return = returnLeg;
      else if (this.hadReturn) payload.return = null;    // cleared the return flight: remove it
    } else {
      // A return flight on its own (they didn't fly in, or you're editing one saved that way)
      payload = { ...returnLeg!, ...shared, direction: 'return' };
    }

    this.saving = true;
    const request: Observable<GuestFlight> = this.editingId
      ? this.api.updateGuestFlight(this.editingId, payload)
      : this.api.addGuestFlight(payload);
    request.subscribe({
      next: saved => {
        this.saving = false;
        const onBoard = saved.state === 'tracking' || saved.return?.state === 'tracking' ? ' It is on the matrix board now.' : '';
        const what = saved.return ? 'flights' : (saved.direction === 'return' ? 'return flight' : 'flight');
        this.showSuccess((this.editingId ? 'Saved.' : `${saved.guest_name}'s ${what} added.`) + onBoard);
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

  /** Editing either leg of a trip opens the whole trip */
  edit(leg: GuestFlight): void {
    const arrival = leg.direction === 'return'
      ? (leg.trip_id ? this.flights.find(f => f.id === leg.trip_id) : undefined)
      : leg;
    const ret = arrival ? this.returnOf(arrival) : leg;

    this.editingId = arrival?.id ?? leg.id;
    this.editingReturnOnly = !arrival;
    this.hadReturn = !!(arrival && ret);
    const base = arrival ?? leg;
    this.form = {
      ...emptyForm(base.event),
      guest_name: base.guest_name, event: base.event, notes: base.notes ?? '', auto_pin: base.auto_pin,
      ...(arrival ? {
        flight: arrival.flight, flight_date: arrival.flight_date, arrive_time: arrival.arrive_time ?? '',
        from_airport: arrival.from_airport ?? '', to_airport: arrival.to_airport ?? '', pickup_by: arrival.pickup_by ?? '',
      } : {}),
      ...(ret ? {
        ret_flight: ret.flight, ret_date: ret.flight_date, ret_time: ret.depart_time ?? '',
        ret_from: ret.from_airport ?? '', ret_to: ret.to_airport ?? '', ret_dropoff: ret.pickup_by ?? '',
      } : {}),
    };
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingReturnOnly = false;
    this.hadReturn = false;
    this.form = emptyForm(this.event);
  }

  remove(f: GuestFlight): void {
    const ret = f.direction === 'arrival' ? this.returnOf(f) : undefined;
    const question = f.direction === 'return'
      ? `Remove ${f.guest_name}'s return flight ${f.flight}?`
      : `Remove ${f.guest_name}'s flight ${f.flight}${ret ? ` and their return flight ${ret.flight}` : ''}?`;
    if (!confirm(question)) return;
    this.busy.add(f.id);
    this.api.deleteGuestFlight(f.id).subscribe({
      next: res => {
        this.busy.delete(f.id);
        if (this.editingId === f.id || this.editingId === f.trip_id) this.cancelEdit();
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
   * "Pin now" only around the time they fly: the board follows today's flight with that number, so pinning
   * days early would show someone else's trip. Up to 18 hours before landing covers long-haul arrivals.
   */
  canPinNow(f: GuestFlight): boolean {
    if (['tracking', 'landed'].includes(f.state)) return false;
    const now = Date.now() / 1000;
    const legTs = this.legTs(f);
    const from = legTs ? legTs - (f.direction === 'return' ? 6 : 18) * HOUR : f.day_start_ts - 3 * HOUR;
    return now >= from && now <= f.pin_until_ts;
  }

  /** One line under the flight saying what the board is doing with it */
  boardLine(f: GuestFlight): string {
    switch (f.state) {
      case 'scheduled': return `Goes on the board ${this.when(f.pin_from_ts)}`;
      case 'pinning': return 'Going on the board within a minute';
      case 'queued': return `All ${this.data?.max_pinned ?? 3} spots are taken. It goes on when one frees up.`;
      case 'landed': return f.landed_at ? `Landed ${this.when(f.landed_at)}` : '';
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

  /** "Lands 3:40 PM" / "Takes off 11:05 AM" */
  timeLine(f: GuestFlight): string {
    if (f.direction === 'return') {
      return f.depart_ts ? `Takes off ${this.clock(f.depart_ts)}` : 'Take-off time not set';
    }
    return f.arrive_ts ? `Lands ${this.clock(f.arrive_ts)}` : 'Landing time not set';
  }

  /** On an arrival card: "Flies home Sun, Nov 29 · AA2210" */
  homeLine(f: GuestFlight): string {
    const ret = this.returnOf(f);
    if (!ret) return '';
    const day = new Date(`${ret.flight_date}T00:00`).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    return `Flies home ${day}${ret.depart_ts ? ' ' + this.clock(ret.depart_ts) : ''} · ${ret.flight}`;
  }

  // ---------- formatting

  private legTs(f: GuestFlight): number | null {
    return f.direction === 'return' ? f.depart_ts : f.arrive_ts;
  }

  /** Unix seconds for a date (and time) in this browser's time zone, so the server's zone doesn't matter */
  private ts(date: string, time = '00:00'): number {
    return Math.floor(new Date(`${date}T${time}`).getTime() / 1000);
  }

  private code(value: string): string | null {
    return value.trim().toUpperCase() || null;
  }

  private clock(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  /** "at 3:40 PM" today, otherwise "Tue, Nov 24, 3:40 PM" */
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
