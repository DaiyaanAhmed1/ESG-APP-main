import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || !window.localStorage) {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }

  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    try {
      // Validate that the stored user data is valid JSON
      const user = JSON.parse(currentUser);
      if (user && user.username && user.role) {
        return true;
      } else {
        // Invalid user data, clear it and redirect to login
        localStorage.removeItem('currentUser');
        const router = inject(Router);
        router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      // Invalid JSON, clear it and redirect to login
      localStorage.removeItem('currentUser');
      const router = inject(Router);
      router.navigate(['/login']);
      return false;
    }
  } else {
    // No user data, redirect to login
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
}; 