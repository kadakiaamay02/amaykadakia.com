import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export type ChecklistKey = 'engagement' | 'wedding';

export interface Person {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  side: string | null;
  relation: string | null;
  notify_on_complete: boolean;
  notes: string | null;
}

export type PersonInput = Omit<Person, 'id'>;

export interface ChecklistItem {
  id: number;
  checklist: ChecklistKey;
  title: string;
  details: string | null;
  category: string | null;
  due_date: string | null;
  assigned_to: string | null;
  assigned_email: string | null;
  assigned_person_id: number | null;
  done: boolean;
  done_at: string | null;
  done_by: string | null;
  overdue: boolean;
  due_ts: number | null;
  last_reminder_iso: string | null;
  sort_order: number;
}

export interface ChecklistItemInput {
  title: string;
  details?: string | null;
  category?: string | null;
  due_date?: string | null;
  assigned_to?: string | null;
  assigned_email?: string | null;
  assigned_person_id?: number | null;
}

export interface ChecklistResponse {
  checklist: ChecklistKey;
  label: string;
  items: ChecklistItem[];
  summary: { total: number; done: number; overdue: number };
}

export interface EmailOutcome {
  to: string | null;
  items: number[];
  ok: boolean;
  error: string | null;
}

export interface SendEmailResult {
  sent: EmailOutcome[];
  skipped: { id: number; title: string; reason: string }[];
  message: string;
}

export interface SendEmailRequest {
  type: 'reminder' | 'completed';
  item_ids?: number[];
  checklist?: ChecklistKey;
  scope?: 'open' | 'overdue' | 'due_soon' | 'done_today';
  days?: number;
  message?: string;
}

/** Talks to the private wedding endpoints in app.py. The login token is added by auth.interceptor.ts. */
@Injectable({ providedIn: 'root' })
export class WeddingService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // ---- people
  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.api}/wedding/people`);
  }

  addPerson(person: PersonInput): Observable<Person> {
    return this.http.post<Person>(`${this.api}/wedding/people`, person);
  }

  updatePerson(id: number, person: Partial<PersonInput>): Observable<Person> {
    return this.http.put<Person>(`${this.api}/wedding/people/${id}`, person);
  }

  deletePerson(id: number): Observable<unknown> {
    return this.http.delete(`${this.api}/wedding/people/${id}`);
  }

  // ---- checklist items
  getChecklist(checklist: ChecklistKey): Observable<ChecklistResponse> {
    return this.http.get<ChecklistResponse>(`${this.api}/checklists/${checklist}`);
  }

  addItem(checklist: ChecklistKey, item: ChecklistItemInput): Observable<ChecklistItem> {
    return this.http.post<ChecklistItem>(`${this.api}/checklists/${checklist}`, item);
  }

  addItems(checklist: ChecklistKey, items: ChecklistItemInput[]): Observable<{ items: ChecklistItem[] }> {
    return this.http.post<{ items: ChecklistItem[] }>(`${this.api}/checklists/${checklist}`, { items });
  }

  updateItem(id: number, changes: Partial<ChecklistItemInput> & { done?: boolean; notify?: boolean; done_by?: string }):
      Observable<{ item: ChecklistItem; emailed: EmailOutcome | null }> {
    return this.http.put<{ item: ChecklistItem; emailed: EmailOutcome | null }>(`${this.api}/checklists/items/${id}`, changes);
  }

  deleteItem(id: number): Observable<unknown> {
    return this.http.delete(`${this.api}/checklists/items/${id}`);
  }

  // ---- emails
  sendEmail(request: SendEmailRequest): Observable<SendEmailResult> {
    return this.http.post<SendEmailResult>(`${this.api}/checklists/send-email`, request);
  }
}
