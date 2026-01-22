import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Portfolio {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  details: string;
  tags: string[];
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalOpen$ = new BehaviorSubject<boolean>(false);
  private selectedProject$ = new BehaviorSubject<Portfolio | null>(null);

  constructor() {}

  getModalState(): Observable<boolean> {
    return this.modalOpen$.asObservable();
  }

  getSelectedProject(): Observable<Portfolio | null> {
    return this.selectedProject$.asObservable();
  }

  openModal(project: Portfolio): void {
    this.selectedProject$.next(project);
    this.modalOpen$.next(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.modalOpen$.next(false);
    this.selectedProject$.next(null);
    document.body.style.overflow = 'auto';
  }
}
