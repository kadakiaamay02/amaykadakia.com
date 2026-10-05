import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Note {
  id: number;
  content: string;
  due_date: string | null;
  created_at: string;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [FormsModule], // CommonModule no longer needed with @if / @for
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notes`;
  private successTimer?: ReturnType<typeof setTimeout>;

  notes: Note[] = [];
  newNote = '';
  newDueDate = '';
  error = '';
  success = '';
  formOpen = false; // controls the form on phones

  ngOnInit(): void {
    this.loadNotes();
  }

  ngOnDestroy(): void {
    clearTimeout(this.successTimer);
  }

  loadNotes(): void {
    this.http.get<Note[]>(this.apiUrl).subscribe({
      next: (data) => this.notes = this.sortNotes(data),
      error: () => this.error = 'Failed to load notes.'
    });
  }

  addNote(): void {
    this.submitNote(`${this.apiUrl}/add`, 'Note added!', 'Failed to add note.');
  }

  addAndPrintNote(): void {
    this.submitNote(this.apiUrl, 'Note added and printed!', 'Failed to add note.');
  }

  print(): void {
    this.submitNote(`${this.apiUrl}/print`, 'Note printed!', 'Failed to print note.');
  }

  deleteNote(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.showSuccess('Note deleted!');
        this.loadNotes();
      },
      error: () => this.error = 'Failed to delete note.'
    });
  }

  printNote(id: number): void {
    this.http.post(`${this.apiUrl}/${id}/print`, {}).subscribe({
      next: () => this.showSuccess('Note printed!'),
      error: () => this.error = 'Failed to print note.'
    });
  }

  /** Shared logic for Add, Add & Print, and Print */
  private submitNote(url: string, successMsg: string, errorMsg: string): void {
    if (!this.newNote.trim()) {
      this.error = 'Write a note first.';
      return;
    }

    this.http.post<{ id: number; message: string }>(url, {
      content: this.newNote,
      due_date: this.newDueDate || null
    }).subscribe({
      next: () => {
        this.newNote = '';
        this.newDueDate = '';
        this.formOpen = false; // collapse the form on phones after saving
        this.showSuccess(successMsg);
        this.loadNotes();
      },
      error: () => this.error = errorMsg
    });
  }

  private showSuccess(message: string): void {
    this.error = '';
    this.success = message;
    clearTimeout(this.successTimer);
    this.successTimer = setTimeout(() => this.success = '', 3000);
  }

  /**
   * Notes without a due date come first (newest first),
   * then dated notes from soonest to latest.
   */
  private sortNotes(notes: Note[]): Note[] {
    return [...notes].sort((a, b) => {
      if (!a.due_date && !b.due_date) return b.created_at.localeCompare(a.created_at);
      if (!a.due_date) return -1;
      if (!b.due_date) return 1;
      return a.due_date.localeCompare(b.due_date)
        || b.created_at.localeCompare(a.created_at);
    });
  }
}