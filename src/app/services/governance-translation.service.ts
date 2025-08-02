import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GovernanceTranslationService {
  private currentLanguage = 'en';
  private translations: any = {};
  private languageChange$ = new BehaviorSubject<string>('en');

  constructor(private http: HttpClient) {
    this.loadFallbackTranslations();
    this.loadTranslations();
  }

  private async loadTranslations() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('Not in browser environment, using fallback translations');
        return;
      }

      // Load both language files
      const [enTranslations, arTranslations] = await Promise.all([
        this.http.get('../assets/i18n/en.json').toPromise(),
        this.http.get('../assets/i18n/ar.json').toPromise()
      ]);

      // Only update translations if loading was successful
      if (enTranslations && arTranslations) {
        this.translations = {
          en: enTranslations,
          ar: arTranslations
        };
        console.log('Governance translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Governance translations from JSON files:', error);
      // Keep using fallback translations that were loaded in constructor
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        GOVERNANCE: {
          TITLE: "Governance Dashboard",
          WELCOME: "Welcome to Governance",
          OVERVIEW: "Overview",
          METRICS: "Key Metrics",
          PERFORMANCE: "Performance",
          REPORTS: "Reports",
          ANALYTICS: "Analytics",
          SETTINGS: "Settings"
        },
        NAVIGATION: {
          ENVIRONMENTAL: "Environmental",
          SOCIAL: "Social", 
          GOVERNANCE: "Governance",
          REPORTING: "Reporting",
          INTEGRATIONS: "Integrations",
          COMPLIANCE: "Compliance",
          AI: "AI",
          LOCALIZATION: "Localization",
          SECURITY: "Security",
          UX: "UX"
        }
      },
      ar: {
        GOVERNANCE: {
          TITLE: "لوحة تحكم Governance",
          WELCOME: "مرحباً بك في Governance",
          OVERVIEW: "نظرة عامة",
          METRICS: "المقاييس الرئيسية",
          PERFORMANCE: "الأداء",
          REPORTS: "التقارير",
          ANALYTICS: "التحليلات",
          SETTINGS: "الإعدادات"
        },
        NAVIGATION: {
          ENVIRONMENTAL: "البيئي",
          SOCIAL: "الاجتماعي",
          GOVERNANCE: "الحوكمة",
          REPORTING: "التقارير",
          INTEGRATIONS: "التكاملات",
          COMPLIANCE: "الامتثال",
          AI: "الذكاء الاصطناعي",
          LOCALIZATION: "التوطين",
          SECURITY: "الأمان",
          UX: "تجربة المستخدم"
        }
      }
    };
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getLanguageChange$(): Observable<string> {
    return this.languageChange$.asObservable();
  }

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.languageChange$.next(this.currentLanguage);
  }

  translate(key: string): string {
    try {
      const keys = key.split('.');
      let value = this.translations[this.currentLanguage];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      if (!value) {
        console.warn(`Governance translation not found for key: ${key} in language: ${this.currentLanguage}`);
        return key;
      }
      
      return value;
    } catch (error) {
      console.error(`Governance translation error for key: ${key}`, error);
      return key;
    }
  }

  isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }

  isTranslationsLoaded(): boolean {
    return Object.keys(this.translations).length > 0;
  }

  getTranslations(): any {
    return this.translations;
  }
}