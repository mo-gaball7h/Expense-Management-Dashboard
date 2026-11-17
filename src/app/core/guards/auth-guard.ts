import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // بنتاكد هل اليوزر مسجل دخول في الجلسة الحالية دي بس
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return true; // مسموح له بالدخول
  } else {
    // لو مش مسجل دخول، طرده فوراً على الـ login
    router.navigate(['/login']);
    return false;
  }
};