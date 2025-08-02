import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Initialize from localStorage if available (only in browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        this.darkModeSubject.next(savedMode === 'true');
      }
    }
  }

  get darkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleDarkMode(): void {
    const newMode = !this.darkModeSubject.value;
    this.darkModeSubject.next(newMode);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('darkMode', newMode.toString());
    }
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('darkMode', isDark.toString());
    }
  }
} 