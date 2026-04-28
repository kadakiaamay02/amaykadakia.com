import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SamayLoginService {
  private loginUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  validate(password: string): Observable<boolean> {
    return this.http.post<{ success: boolean }>(this.loginUrl, { password }).pipe(
      map(res => res.success),
      catchError(() => of(false))
    );
  }
}