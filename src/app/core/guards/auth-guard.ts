import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // بنتاكد هل اليوزر مسجل دخول (هل الـ token أو الـ flag موجود في الـ localStorage)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return true; // مسموح له يدخل
  } else {
    // لو مش مسجل دخول، حوله على اللوج ان فوراً
    return router.createUrlTree(['/login']);
  }
};
