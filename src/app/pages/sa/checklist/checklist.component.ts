import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { CodeWindow } from '@app/code-window/code-window';
import {
  ChecklistItem, ChecklistItemInput, ChecklistKey, Person, SendEmailRequest, WeddingService
} from '@app/services/s/wedding.service';
import { STARTER_ITEMS } from './starter-items';

type Filter = 'open' | 'overdue' | 'done' | 'all';

interface ItemForm {
  title: string;
  details: string;
  category: string;
  due_date: string;
  /** '' = nobody yet, 'p:<id>' = someone on the contacts list, 'other' = type a name and email */
  assignee: string;
  assigned_to: string;
  assigned_email: string;
}

const emptyForm = (): ItemForm => ({
  title: '', details: '', category: '', due_date: '', assignee: '', assigned_to: '', assigned_email: ''
});

/**
 * One component serves both /samay/engagement-checklist and /samay/wedding-checklist.
 * Which list it shows comes from the route's data: { checklist: 'engagement' | 'wedding' }.
 */
@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [FormsModule, RouterLink, CodeWindow],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss'
})
export class ChecklistComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private api = inject(WeddingService);
  private routeSub?: Subscription;
  private messageTimer?: ReturnType<typeof setTimeout>;

  checklist: ChecklistKey = 'wedding';
  label = 'Wedding';
  items: ChecklistItem[] = [];
  people: Person[] = [];
  summary = { total: 0, done: 0, overdue: 0 };

  filter: Filter = 'open';
  personFilter = '';           // assignee email, or '' for everyone
  loading = true;
  saving = false;
  sending = false;
  busyIds = new Set<number>();
  error = '';
  success = '';

  formOpen = false;            // phones only
  editingId: number | null = null;
  form: ItemForm = emptyForm();
  notifyOnDone = true;         // email the bride and groom when something is ticked off

  reminderOpen = false;
  reminderMessage = '';

  get otherChecklist(): { key: ChecklistKey; label: string } {
    return this.checklist === 'wedding'
      ? { key: 'engagement', label: 'Engagement' }
      : { key: 'wedding', label: 'Wedding' };
  }

  // The code window types these once when the page opens, so they stay the same while editing
  readonly formLines = ['// Checklist item', '// Assign it to send reminders'];

  get percentDone(): number {
    return this.summary.total ? Math.round((this.summary.done / this.summary.total) * 100) : 0;
  }

  get assignees(): { name: string; email: string }[] {
    const seen = new Map<string, string>();
    for (const i of this.items) {
      if (i.assigned_email && !seen.has(i.assigned_email.toLowerCase())) {
        seen.set(i.assigned_email.toLowerCase(), i.assigned_to || i.assigned_email);
      }
    }
    return [...seen].map(([email, name]) => ({ email, name })).sort((a, b) => a.name.localeCompare(b.name));
  }

  get visibleItems(): ChecklistItem[] {
    return this.items.filter(i => {
      if (this.personFilter && (i.assigned_email || '').toLowerCase() !== this.personFilter) return false;
      switch (this.filter) {
        case 'open': return !i.done;
        case 'overdue': return i.overdue;
        case 'done': return i.done;
        default: return true;
      }
    });
  }

  get openWithEmailCount(): number {
    return this.items.filter(i => !i.done && i.assigned_email).length;
  }

  ngOnInit(): void {
    this.routeSub = this.route.data.subscribe(data => {
      this.checklist = data['checklist'] === 'engagement' ? 'engagement' : 'wedding';
      this.label = this.checklist === 'engagement' ? 'Engagement' : 'Wedding';
      this.cancelEdit();
      this.loadAll();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    clearTimeout(this.messageTimer);
  }

  loadAll(): void {
    this.loading = true;
    forkJoin({ list: this.api.getChecklist(this.checklist), people: this.api.getPeople() }).subscribe({
      next: ({ list, people }) => {
        this.applyList(list.items, list.summary);
        this.people = people;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showError('Could not load the checklist. Is the server running?');
      }
    });
  }

  private reload(): void {
    this.api.getChecklist(this.checklist).subscribe({
      next: list => this.applyList(list.items, list.summary),
      error: () => this.showError('Could not refresh the checklist.')
    });
  }

  private applyList(items: ChecklistItem[], summary: { total: number; done: number; overdue: number }): void {
    this.items = items;
    this.summary = summary;
  }

  // ---------------------------------------------------------------- add / edit

  onAssigneeChange(): void {
    const value = this.form.assignee;
    if (value.startsWith('p:')) {
      const person = this.people.find(p => p.id === Number(value.slice(2)));
      this.form.assigned_to = person?.name ?? '';
      this.form.assigned_email = person?.email ?? '';
    } else {
      this.form.assigned_to = '';
      this.form.assigned_email = '';
    }
  }

  save(): void {
    const title = this.form.title.trim();
    if (!title) {
      this.showError('Give the item a title first.');
      return;
    }
    const personId = this.form.assignee.startsWith('p:') ? Number(this.form.assignee.slice(2)) : null;
    const payload: ChecklistItemInput = {
      title,
      details: this.form.details.trim() || null,
      category: this.form.category.trim() || null,
      due_date: this.form.due_date || null,
      assigned_person_id: personId,
      assigned_to: this.form.assignee ? (this.form.assigned_to.trim() || null) : null,
      assigned_email: this.form.assignee ? (this.form.assigned_email.trim() || null) : null,
    };

    this.saving = true;
    const request: Observable<unknown> = this.editingId
      ? this.api.updateItem(this.editingId, payload)
      : this.api.addItem(this.checklist, payload);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.showSuccess(this.editingId ? 'Item updated.' : 'Item added.');
        this.cancelEdit();
        this.formOpen = false;
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.showError(err.error?.error || 'Could not save the item.');
      }
    });
  }

  edit(item: ChecklistItem): void {
    this.editingId = item.id;
    let assignee = '';
    if (item.assigned_person_id && this.people.some(p => p.id === item.assigned_person_id)) {
      assignee = `p:${item.assigned_person_id}`;
    } else if (item.assigned_to || item.assigned_email) {
      assignee = 'other';
    }
    this.form = {
      title: item.title,
      details: item.details ?? '',
      category: item.category ?? '',
      due_date: item.due_date ?? '',
      assignee,
      assigned_to: item.assigned_to ?? '',
      assigned_email: item.assigned_email ?? '',
    };
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = emptyForm();
  }

  remove(item: ChecklistItem): void {
    if (!confirm(`Delete "${item.title}"?`)) return;
    this.api.deleteItem(item.id).subscribe({
      next: () => {
        if (this.editingId === item.id) this.cancelEdit();
        this.showSuccess('Item deleted.');
        this.reload();
      },
      error: () => this.showError('Could not delete the item.')
    });
  }

  seedStarter(): void {
    this.saving = true;
    this.api.addItems(this.checklist, STARTER_ITEMS[this.checklist]).subscribe({
      next: res => {
        this.saving = false;
        this.showSuccess(`Added ${res.items.length} suggested items. Assign them to people to start sending reminders.`);
        this.reload();
      },
      error: () => {
        this.saving = false;
        this.showError('Could not add the suggested items.');
      }
    });
  }

  // ---------------------------------------------------------------- done / emails

  toggleDone(item: ChecklistItem): void {
    const done = !item.done;
    const notify = done && this.notifyOnDone;
    this.busyIds.add(item.id);
    this.api.updateItem(item.id, { done, notify }).subscribe({
      next: res => {
        this.busyIds.delete(item.id);
        if (res.emailed && !res.emailed.ok) {
          this.showError(`Marked done, but the email didn't go out: ${res.emailed.error}`);
        } else if (res.emailed?.ok) {
          this.showSuccess(`Done! Emailed ${res.emailed.to}.`);
        } else {
          this.showSuccess(done ? 'Marked done.' : 'Moved back to open.');
        }
        this.reload();
      },
      error: () => {
        this.busyIds.delete(item.id);
        this.showError('Could not update the item.');
      }
    });
  }

  remind(item: ChecklistItem): void {
    this.sendEmails({ type: 'reminder', item_ids: [item.id] }, item.id);
  }

  tellCouple(item: ChecklistItem): void {
    this.sendEmails({ type: 'completed', item_ids: [item.id] }, item.id);
  }

  sendBulkReminders(scope: 'open' | 'overdue' | 'due_soon'): void {
    const message = this.reminderMessage.trim();
    this.sendEmails({ type: 'reminder', checklist: this.checklist, scope, days: 7, message: message || undefined });
  }

  private sendEmails(request: SendEmailRequest, itemId?: number): void {
    this.sending = true;
    if (itemId) this.busyIds.add(itemId);
    this.api.sendEmail(request).subscribe({
      next: res => {
        this.sending = false;
        if (itemId) this.busyIds.delete(itemId);
        const failed = res.sent.filter(s => !s.ok);
        if (failed.length) {
          this.showError(`${res.message} ${failed.map(f => f.error).filter(Boolean).join(' ')}`.trim());
        } else {
          this.showSuccess(res.message);
          if (!itemId) {
            this.reminderOpen = false;
            this.reminderMessage = '';
          }
        }
        this.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.sending = false;
        if (itemId) this.busyIds.delete(itemId);
        this.showError(err.error?.error || 'Could not send the email.');
      }
    });
  }

  // ---------------------------------------------------------------- display helpers

  dueLabel(item: ChecklistItem): string {
    if (!item.due_date) return '';
    const [y, m, d] = item.due_date.split('-').map(Number);
    const due = new Date(y, (m || 1) - 1, d || 1);
    const pretty = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    if (item.done) return pretty;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((due.getTime() - today.getTime()) / 86400000);
    if (days < 0) return `${pretty} · ${-days} day${days === -1 ? '' : 's'} overdue`;
    if (days === 0) return `${pretty} · today`;
    if (days === 1) return `${pretty} · tomorrow`;
    return `${pretty} · in ${days} days`;
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
