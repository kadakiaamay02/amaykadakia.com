import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { SamayLoginService } from '../services/samay-login.service';

export const samayGuard: CanActivateFn = () => {
  const auth = inject(SamayLoginService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/samay']);
  return false;
};
