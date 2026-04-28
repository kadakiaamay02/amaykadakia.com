import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Wine {
  id?: number;
  name: string;
  rating: number;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class WineService {
  private apiUrl = `${environment.apiUrl}/wines`;

  constructor(private http: HttpClient) { }

  getWines(): Observable<Wine[]> {
    return this.http.get<Wine[]>(this.apiUrl);
  }

  addWine(wine: Wine): Observable<any> {
    return this.http.post(this.apiUrl, wine);
  }
}