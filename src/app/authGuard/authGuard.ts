import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
//  const authService = inject(AuthService);
  const router = inject(Router);

  if (true) {
    return true; // ✅ puede pasar
  } else {
    // 🚫 si no está logueado lo mando a login
    router.navigate(['/login']);
    return false;
  }
};
