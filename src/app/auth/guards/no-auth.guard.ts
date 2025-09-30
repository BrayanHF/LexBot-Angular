import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';
import { Location } from '@angular/common';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const location = inject(Location);

  return authService.currentUser$.pipe(
    filter(user => user !== undefined),
    take(1),
    map(user => {
      if (!user) return true;

      location.back();
      return false;
    })
  );
};
