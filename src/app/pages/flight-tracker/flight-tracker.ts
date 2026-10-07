import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CodeWindow } from '@app/code-window/code-window';
import { finalize } from 'rxjs';

interface TrackedFlight {
  flight: string;
  status: string; // 'airborne' | 'on_ground' | 'not_broadcasting' | 'not_found' | 'waiting'
  tail_number?: string | null;
  aircraft_type?: string | null;
  origin?: string | null;
  destination?: string | null;
}

interface PinResponse {
  message: string;
  tracking: TrackedFlight | null;
}

@Component({
  selector: 'app-flight-tracker',
  imports: [FormsModule, CodeWindow],
  templateUrl: './flight-tracker.html',
  styleUrl: './flight-tracker.scss',
  standalone: true
})
export class FlightTracker {

   private http = inject(HttpClient);
  readonly TrackerLines = [
    '// Enter the flight number to continue',
  ];

  flightNumber = '';
  error = '';
  Tracking = false;
  message = '';
  result: TrackedFlight | null = null;

  checkFlightNumber(): void {
    const flight = this.flightNumber.trim();
    if (!flight) {
      this.error = 'Error: flight number is empty.';
      return;
    }

    this.Tracking = true;
    this.error = '';
    this.message = '';
    this.result = null;

    this.http
      .post<PinResponse>(
        `${environment.apiUrl}/track/${encodeURIComponent(flight)}/pin`,
        {}
      )
      .pipe(finalize(() => (this.Tracking = false)))
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.result = res.tracking;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 0) {
            this.error = "Can't reach the server. Try again in a moment.";
          } else {
            this.error = err.error?.error ?? 'Something went wrong pinning that flight.';
          }
        },
      });
  }
}
