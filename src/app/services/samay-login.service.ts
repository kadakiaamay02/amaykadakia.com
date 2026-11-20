import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const SESSION_KEY = 'samay_auth';
const TOKEN_KEY = 'samay_token';

@Injectable({ providedIn: 'root' })
export class SamayLoginService {
  private loginUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  validate(password: string): Observable<boolean> {
    return this.http.post<{ success: boolean; token?: string }>(this.loginUrl, { password }).pipe(
      tap(res => {
        if (!res.success) return;
        sessionStorage.setItem(SESSION_KEY, '1');
        // The server signs a token that the private API endpoints check on every request
        if (res.token) sessionStorage.setItem(TOKEN_KEY, res.token);
      }),
      map(res => res.success),
      catchError(() => of(false))
    );
  }

  /** The token sent as "Authorization: Bearer ..." (see auth.interceptor.ts), or null once it has expired. */
  getToken(): string | null {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const expires = Number(token.split('.')[1]);   // token looks like v1.<expiry seconds>.<signature>
    if (!expires || expires * 1000 <= Date.now()) {
      this.logout();
      return null;
    }
    return token;
  }

  isLoggedIn(): boolean {
    if (sessionStorage.getItem(SESSION_KEY) !== '1') return false;
    // A stored token that has expired means the session is over
    if (sessionStorage.getItem(TOKEN_KEY) && !this.getToken()) return false;
    return true;
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
}
