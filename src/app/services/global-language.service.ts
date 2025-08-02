import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LanguageState {
  currentLanguage: 'en' | 'ar';
  isRTL: boolean;
  displayText: 'full' | 'abbreviated';
  theme: 'light' | 'dark' | 'glassmorphism';
}

@Injectable({
  providedIn: 'root'
})
export class GlobalLanguageService {
  private languageState$ = new BehaviorSubject<LanguageState>({
    currentLanguage: 'en',
    isRTL: false,
    displayText: 'abbreviated', // 'EN'/'AR' instead of 'English'/'العربية'
    theme: 'glassmorphism' // Consistent glassmorphism theme across all toggles
  });

  constructor() {
    // Load saved language preference from localStorage (only in browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLanguage = localStorage.getItem('esg-app-language');
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        this.setLanguage(savedLanguage);
      }
    }
  }

  // Observable for language changes
  getLanguageState$(): Observable<LanguageState> {
    return this.languageState$.asObservable();
  }

  // Get current language state
  getCurrentLanguageState(): LanguageState {
    return this.languageState$.value;
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.languageState$.value.currentLanguage;
  }

  // Check if RTL
  isRTL(): boolean {
    return this.languageState$.value.isRTL;
  }

  // Toggle language
  toggleLanguage(): void {
    const currentState = this.languageState$.value;
    const newLanguage = currentState.currentLanguage === 'en' ? 'ar' : 'en';
    this.setLanguage(newLanguage);
  }

  // Set specific language
  setLanguage(language: 'en' | 'ar'): void {
    const newState: LanguageState = {
      currentLanguage: language,
      isRTL: language === 'ar',
      displayText: this.languageState$.value.displayText,
      theme: this.languageState$.value.theme
    };

    this.languageState$.next(newState);
    
    // Save to localStorage (only in browser environment)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('esg-app-language', language);
    }
    
    // Update document direction (only in browser environment)
    if (typeof window !== 'undefined' && window.document) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
    
    console.log(`Global language changed to: ${language}`);
  }

  // Set display text style
  setDisplayText(style: 'full' | 'abbreviated'): void {
    const currentState = this.languageState$.value;
    const newState: LanguageState = {
      ...currentState,
      displayText: style
    };
    this.languageState$.next(newState);
  }

  // Set theme
  setTheme(theme: 'light' | 'dark' | 'glassmorphism'): void {
    const currentState = this.languageState$.value;
    const newState: LanguageState = {
      ...currentState,
      theme: theme
    };
    this.languageState$.next(newState);
  }

  // Get language flag
  getLanguageFlag(): string {
    return this.languageState$.value.currentLanguage === 'en' ? '🇺🇸' : '🇸🇦';
  }

  // Get language text based on display style
  getLanguageText(): string {
    const { currentLanguage, displayText } = this.languageState$.value;
    
    if (displayText === 'full') {
      return currentLanguage === 'en' ? 'English' : 'العربية';
    } else {
      return currentLanguage === 'en' ? 'EN' : 'AR';
    }
  }

  // Get button title
  getButtonTitle(): string {
    return this.languageState$.value.currentLanguage === 'en' 
      ? 'Switch to Arabic' 
      : 'التبديل إلى الإنجليزية';
  }

  // Get consistent CSS classes based on theme
  getToggleButtonClasses(): string {
    const { theme } = this.languageState$.value;
    
    switch (theme) {
      case 'glassmorphism':
        return 'global-language-toggle glassmorphism-theme';
      case 'dark':
        return 'global-language-toggle dark-theme';
      case 'light':
      default:
        return 'global-language-toggle light-theme';
    }
  }

  // Get consistent styles based on theme
  getToggleButtonStyles(): string {
    const { theme } = this.languageState$.value;
    
    switch (theme) {
      case 'glassmorphism':
        return `
          .global-language-toggle.glassmorphism-theme {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 0.5rem;
            margin-left: 1rem;
            backdrop-filter: blur(10px);
          }

          .global-language-toggle.glassmorphism-theme:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
          }

          .global-language-toggle.glassmorphism-theme:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
          }
        `;
        
      case 'dark':
        return `
          .global-language-toggle.dark-theme {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #334155;
            border: 1px solid #475569;
            color: #94a3b8;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 0.5rem;
            margin-left: 1rem;
          }

          .global-language-toggle.dark-theme:hover {
            background: #475569;
            color: #e2e8f0;
            border-color: #64748b;
          }

          .global-language-toggle.dark-theme:focus {
            outline: none;
            box-shadow: 0 0 0 2px #3b82f6;
          }
        `;
        
      case 'light':
      default:
        return `
          .global-language-toggle.light-theme {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: transparent;
            border: 1px solid #e2e8f0;
            color: #64748b;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 0.5rem;
            margin-left: 1rem;
          }

          .global-language-toggle.light-theme:hover {
            background: #f1f5f9;
            color: #334155;
            border-color: #cbd5e1;
          }

          .global-language-toggle.light-theme:focus {
            outline: none;
            box-shadow: 0 0 0 2px #3b82f6;
          }
        `;
    }
  }
} 