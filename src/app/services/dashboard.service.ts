import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface EventItem {
	id: number;
	timestamp: number;
	timestamp_iso?: string;
	source: string;
	level: string;
	message: string;
	data: any;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
	private eventsUrl = `${environment.apiUrl}/events`;

	constructor(private http: HttpClient) {}

	getEvents(limit = 100): Observable<EventItem[]> {
		const params = new HttpParams().set('limit', String(limit));
		return this.http.get<EventItem[]>(this.eventsUrl, { params }).pipe(
			catchError((err) => {
				console.error('DashboardService.getEvents error', err);
				return of([] as EventItem[]);
			})
		);
	}

	postEvent(body: Partial<EventItem>) {
		return this.http.post(this.eventsUrl, body);
	}
}

