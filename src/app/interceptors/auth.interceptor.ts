import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SamayLoginService } from '../services/samay-login.service';

/**
 * Adds the login token to requests that go to our own API, and sends you back to the
 * password screen if the server says the session has expired.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);

  const auth = inject(SamayLoginService);
  const router = inject(Router);
  const token = auth.getToken();
  const authedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !req.url.endsWith('/login')) {
        auth.logout();
        router.navigate(['/samay']);
      }
      return throwError(() => err);
    })
  );
};
