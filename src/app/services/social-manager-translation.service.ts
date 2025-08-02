import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialManagerTranslationService {
  private currentLanguage = 'en';
  private translations: any = {};
  private languageChange$ = new BehaviorSubject<string>('en');

  constructor(private http: HttpClient) {
    // Load fallback translations immediately
    this.loadFallbackTranslations();
    // Then try to load from JSON files
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
        console.log('Social Manager translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Social Manager translations from JSON files:', error);
      // Keep using fallback translations that were loaded in constructor
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        SOCIAL_MANAGER: {
          DASHBOARD: "Social Dashboard",
          WELCOME_MESSAGE: "Welcome back, Social Manager",
          EMPLOYEE_ENGAGEMENT: "Employee Engagement",
          COMMUNITY_IMPACT: "Community Impact",
          DIVERSITY_INCLUSION: "Diversity & Inclusion",
          SOCIAL_PERFORMANCE: "Social Performance"
        },
        METRICS: {
          SATISFACTION_SCORE: "Satisfaction Score:",
          RETENTION_RATE: "Retention Rate:",
          TRAINING_HOURS: "Training Hours:",
          EMPLOYEE_SURVEYS: "Employee Surveys:",
          VOLUNTEER_HOURS: "Volunteer Hours:",
          CHARITABLE_DONATIONS: "Charitable Donations:",
          LOCAL_PARTNERSHIPS: "Local Partnerships:",
          COMMUNITY_EVENTS: "Community Events:",
          GENDER_DIVERSITY: "Gender Diversity:",
          LEADERSHIP_DIVERSITY: "Leadership Diversity:",
          INCLUSION_SCORE: "Inclusion Score:",
          DI_TRAINING: "D&I Training:",
          SOCIAL_SCORE: "Social Score:",
          STAKEHOLDER_SATISFACTION: "Stakeholder Satisfaction:",
          SOCIAL_IMPACT_RATING: "Social Impact Rating:"
        },
        NAVIGATION: {
          ENVIRONMENTAL: "Environmental",
          SOCIAL: "Social",
          GOVERNANCE: "Governance",
          LOGOUT: "Logout",
          COLLAPSE: "Collapse",
          LIGHT_MODE: "Light Mode",
          DARK_MODE: "Dark Mode"
        },
        COMMON: {
          LANGUAGE: "Language"
        }
      },
      ar: {
        SOCIAL_MANAGER: {
          DASHBOARD: "لوحة تحكم الاجتماعي",
          WELCOME_MESSAGE: "مرحباً بعودتك، مدير الاجتماعي",
          EMPLOYEE_ENGAGEMENT: "مشاركة الموظفين",
          COMMUNITY_IMPACT: "التأثير المجتمعي",
          DIVERSITY_INCLUSION: "التنوع والشمول",
          SOCIAL_PERFORMANCE: "الأداء الاجتماعي"
        },
        METRICS: {
          SATISFACTION_SCORE: "درجة الرضا:",
          RETENTION_RATE: "معدل الاحتفاظ:",
          TRAINING_HOURS: "ساعات التدريب:",
          EMPLOYEE_SURVEYS: "استطلاعات الموظفين:",
          VOLUNTEER_HOURS: "ساعات التطوع:",
          CHARITABLE_DONATIONS: "التبرعات الخيرية:",
          LOCAL_PARTNERSHIPS: "الشراكات المحلية:",
          COMMUNITY_EVENTS: "الفعاليات المجتمعية:",
          GENDER_DIVERSITY: "التنوع الجندري:",
          LEADERSHIP_DIVERSITY: "تنوع القيادة:",
          INCLUSION_SCORE: "درجة الشمول:",
          DI_TRAINING: "تدريب التنوع والشمول:",
          SOCIAL_SCORE: "الدرجة الاجتماعية:",
          STAKEHOLDER_SATISFACTION: "رضا أصحاب المصلحة:",
          SOCIAL_IMPACT_RATING: "تقييم التأثير الاجتماعي:"
        },
        NAVIGATION: {
          ENVIRONMENTAL: "البيئي",
          SOCIAL: "الاجتماعي",
          GOVERNANCE: "الحوكمة",
          LOGOUT: "تسجيل الخروج",
          COLLAPSE: "طي",
          LIGHT_MODE: "الوضع الفاتح",
          DARK_MODE: "الوضع الداكن"
        },
        COMMON: {
          LANGUAGE: "اللغة"
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

    // Update document direction for RTL support
    if (this.currentLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }

  translate(key: string): string {
    try {
      const keys = key.split('.');
      let value = this.translations[this.currentLanguage];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      if (!value) {
        console.warn(`Social Manager translation not found for key: ${key} in language: ${this.currentLanguage}`);
        return key;
      }
      
      return value;
    } catch (error) {
      console.error(`Social Manager translation error for key: ${key}`, error);
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