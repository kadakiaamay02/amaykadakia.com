import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const SESSION_KEY = 'samay_auth';

@Injectable({ providedIn: 'root' })
export class SamayLoginService {
  private loginUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  validate(password: string): Observable<boolean> {
    return this.http.post<{ success: boolean }>(this.loginUrl, { password }).pipe(
      map(res => res.success),
      tap(valid => { if (valid) sessionStorage.setItem(SESSION_KEY, '1'); }),
      catchError(() => of(false))
    );
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }
}