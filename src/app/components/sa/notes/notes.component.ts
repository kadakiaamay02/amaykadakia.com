import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  newNote = '';
  error = '';
  success = '';
  newDueDate = '';

  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.http.get<Note[]>(this.apiUrl).subscribe({
      next: (data) => this.notes = data,
      error: () => this.error = 'Failed to load notes.'
    });
  }

  deleteNote(id: number): void {
  this.http.delete(`${this.apiUrl}/${id}`).subscribe({
    next: () => {
      this.success = 'Note deleted!';
      this.loadNotes();
      setTimeout(() => this.success = '', 3000);
    },
    error: () => this.error = 'Failed to delete note.'
  });
}

  addAndPrintNote(): void {
    if (!this.newNote.trim()) return;

    this.http.post<{ id: number, message: string }>(this.apiUrl, {
      content: this.newNote,
      due_date: this.newDueDate || null
    }).subscribe({
      next: () => {
        this.success = 'Note added and printed!';
        this.newNote = '';
        this.newDueDate = '';
        this.loadNotes();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Failed to add note.'
    });
  }

    addNote(): void {
    if (!this.newNote.trim()) return;

    this.http.post<{ id: number, message: string }>(`${this.apiUrl}/add`, {
      content: this.newNote,
      due_date: this.newDueDate || null
    }).subscribe({
      next: () => {
        this.success = 'Note added and printed!';
        this.newNote = '';
        this.newDueDate = '';
        this.loadNotes();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Failed to add note.'
    });
  }
  
  printNote(id: number): void {
  this.http.post(`${this.apiUrl}/${id}/print`, {}).subscribe({
    next: () => {
      this.success = 'Note printed!';
      setTimeout(() => this.success = '', 3000);
    },
    error: () => this.error = 'Failed to print note.'
  });
}

}