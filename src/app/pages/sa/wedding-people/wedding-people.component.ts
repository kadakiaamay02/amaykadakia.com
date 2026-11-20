import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CodeWindow } from '@app/code-window/code-window';
import { Person, PersonInput, WeddingService } from '@app/services/s/wedding.service';

const emptyPerson = (): PersonInput => ({
  name: '', email: '', phone: '', role: 'family', side: 'bride', relation: '', notify_on_complete: false, notes: ''
});

/** Family & contacts: the people checklist items get assigned to, and who hears when things are done. */
@Component({
  selector: 'app-wedding-people',
  standalone: true,
  imports: [FormsModule, RouterLink, CodeWindow],
  templateUrl: './wedding-people.component.html',
  styleUrl: './wedding-people.component.scss'
})
export class WeddingPeopleComponent implements OnInit, OnDestroy {
  private api = inject(WeddingService);
  private messageTimer?: ReturnType<typeof setTimeout>;

  readonly formLines = ['// Family & contacts', '// Helpers, and who gets updates'];
  readonly roles: { value: string; label: string }[] = [
    { value: 'bride', label: 'Bride' }, { value: 'groom', label: 'Groom' }, { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' }, { value: 'grandparent', label: 'Grandparent' },
    { value: 'family', label: 'Other family' }, { value: 'friend', label: 'Friend' },
    { value: 'planner', label: 'Planner' }, { value: 'vendor', label: 'Vendor' }, { value: 'other', label: 'Other' },
  ];
  readonly sides: { value: string; label: string }[] = [
    { value: 'bride', label: "Bride's side" }, { value: 'groom', label: "Groom's side" }, { value: 'both', label: 'Both / shared' },
  ];

  people: Person[] = [];
  form: PersonInput = emptyPerson();
  editingId: number | null = null;
  notifyTouched = false;       // stop auto-ticking "notify" once you've set it yourself
  loading = true;
  saving = false;
  formOpen = false;
  error = '';
  success = '';

  get groups(): { label: string; people: Person[] }[] {
    const couple = this.people.filter(p => p.role === 'bride' || p.role === 'groom');
    const rest = this.people.filter(p => p.role !== 'bride' && p.role !== 'groom');
    return [
      { label: 'The couple', people: couple },
      { label: "Bride's side", people: rest.filter(p => p.side === 'bride') },
      { label: "Groom's side", people: rest.filter(p => p.side === 'groom') },
      { label: 'Shared / others', people: rest.filter(p => p.side !== 'bride' && p.side !== 'groom') },
    ].filter(g => g.people.length);
  }

  get notifiedCount(): number {
    return this.people.filter(p => p.notify_on_complete && p.email).length;
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
  }

  load(): void {
    this.api.getPeople().subscribe({
      next: people => {
        this.people = people;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showError('Could not load contacts. Is the server running?');
      }
    });
  }

  onRoleChange(): void {
    if (this.form.role === 'bride' || this.form.role === 'groom') this.form.side = this.form.role;
    // The bride and groom are who gets the "it's done" emails, unless you say otherwise
    if (!this.notifyTouched) this.form.notify_on_complete = this.form.role === 'bride' || this.form.role === 'groom';
  }

  save(): void {
    if (!this.form.name.trim()) {
      this.showError('Add a name first.');
      return;
    }
    const payload: PersonInput = {
      ...this.form,
      name: this.form.name.trim(),
      email: this.form.email?.trim() || null,
      phone: this.form.phone?.trim() || null,
      relation: this.form.relation?.trim() || null,
      notes: this.form.notes?.trim() || null,
    };
    this.saving = true;
    const request: Observable<Person> = this.editingId ? this.api.updatePerson(this.editingId, payload) : this.api.addPerson(payload);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.showSuccess(this.editingId ? 'Saved.' : `${payload.name} added.`);
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

  edit(person: Person): void {
    this.editingId = person.id;
    this.notifyTouched = true;
    this.form = {
      name: person.name, email: person.email ?? '', phone: person.phone ?? '', role: person.role || 'other',
      side: person.side ?? 'both', relation: person.relation ?? '', notify_on_complete: person.notify_on_complete,
      notes: person.notes ?? '',
    };
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.notifyTouched = false;
    this.form = emptyPerson();
  }

  remove(person: Person): void {
    if (!confirm(`Remove ${person.name}? Checklist items assigned to them keep their name and email.`)) return;
    this.api.deletePerson(person.id).subscribe({
      next: () => {
        if (this.editingId === person.id) this.cancelEdit();
        this.showSuccess(`${person.name} removed.`);
        this.load();
      },
      error: () => this.showError('Could not remove that person.')
    });
  }

  toggleNotify(person: Person): void {
    this.api.updatePerson(person.id, { notify_on_complete: !person.notify_on_complete }).subscribe({
      next: updated => person.notify_on_complete = updated.notify_on_complete,
      error: () => this.showError('Could not update that setting.')
    });
  }

  roleLabel(value: string): string {
    return this.roles.find(r => r.value === value)?.label ?? value;
  }

  private showSuccess(message: string): void {
    this.error = '';
    this.success = message;
    clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => this.success = '', 3500);
  }

  private showError(message: string): void {
    this.success = '';
    this.error = message;
  }
}
