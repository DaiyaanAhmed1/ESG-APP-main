import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginTranslationService {
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
        console.log('Translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load translations from JSON files:', error);
      // Keep using fallback translations that were loaded in constructor
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        LOGIN: {
          TITLE: "Sign In",
          SUBTITLE: "Access your ESG dashboard",
          USERNAME_PLACEHOLDER: "Enter your username",
          PASSWORD_PLACEHOLDER: "Enter your password",
          SIGN_IN_BUTTON: "Sign In",
          ERROR_FILL_FIELDS: "Please fill in all fields",
          ERROR_INVALID_CREDENTIALS: "Invalid credentials. Please try again.",
          WELCOME_TITLE: "Welcome to ESG Platform",
          WELCOME_SUBTITLE: "Comprehensive Environmental, Social, and Governance Management",
          WELCOME_DESCRIPTION: "Transform your organization's approach to Environmental, Social, and Governance (ESG) reporting with our comprehensive dashboard. Monitor, analyze, and drive sustainable business practices with real-time insights and actionable data.",
          FEATURE_ENVIRONMENTAL_TITLE: "Environmental",
          FEATURE_ENVIRONMENTAL_DESC: "Track carbon footprint, energy consumption, and sustainability initiatives",
          FEATURE_SOCIAL_TITLE: "Social",
          FEATURE_SOCIAL_DESC: "Monitor diversity, community impact, and employee engagement",
          FEATURE_GOVERNANCE_TITLE: "Governance",
          FEATURE_GOVERNANCE_DESC: "Ensure compliance, transparency, and ethical business practices"
        },
        COMMON: {
          USERNAME: "Username",
          PASSWORD: "Password",
          ROLE: "Role"
        },
        ROLES: {
          MARKETING_HEAD: "Marketing Head",
          SUSTAINABILITY_HEAD: "Sustainability Head Manager",
          ESG_SPECIALIST: "ESG Specialist",
          ENVIRONMENTAL_MANAGER: "Environmental Manager",
          SOCIAL_MANAGER: "Social Manager",
          GOVERNANCE_MANAGER: "Governance Manager",
          SUSTAINABILITY_HEAD_DESC: "Full access to all ESG dashboards and reporting capabilities. Strategic oversight and decision-making authority.",
          ESG_SPECIALIST_DESC: "Access to Environmental, Social, and Governance dashboards. Comprehensive ESG analysis and monitoring.",
          MARKETING_HEAD_DESC: "Access to Marketing dashboards. Comprehensive Marketing analysis and monitoring.",
          ENVIRONMENTAL_MANAGER_DESC: "Focus on environmental metrics, carbon footprint, energy consumption, and sustainability initiatives.",
          SOCIAL_MANAGER_DESC: "Employee engagement, community impact, diversity & inclusion, and social responsibility metrics.",
          GOVERNANCE_MANAGER_DESC: "Board composition, compliance status, ethics & transparency, and governance frameworks."
        }
      },
      ar: {
        LOGIN: {
          TITLE: "تسجيل الدخول",
          SUBTITLE: "الوصول إلى لوحة تحكم ESG",
          USERNAME_PLACEHOLDER: "أدخل اسم المستخدم",
          PASSWORD_PLACEHOLDER: "أدخل كلمة المرور",
          SIGN_IN_BUTTON: "تسجيل الدخول",
          ERROR_FILL_FIELDS: "يرجى ملء جميع الحقول",
          ERROR_INVALID_CREDENTIALS: "بيانات اعتماد غير صالحة. يرجى المحاولة مرة أخرى.",
          WELCOME_TITLE: "مرحباً بك في منصة ESG",
          WELCOME_SUBTITLE: "إدارة شاملة للبيئة والاجتماعية والحوكمة",
          WELCOME_DESCRIPTION: "حول نهج مؤسستك في تقارير البيئة والاجتماعية والحوكمة (ESG) من خلال لوحة تحكمنا الشاملة. راقب وحلل ودفع ممارسات الأعمال المستدامة مع رؤى فورية وبيانات قابلة للتنفيذ.",
          FEATURE_ENVIRONMENTAL_TITLE: "البيئية",
          FEATURE_ENVIRONMENTAL_DESC: "تتبع البصمة الكربونية واستهلاك الطاقة ومبادرات الاستدامة",
          FEATURE_SOCIAL_TITLE: "الاجتماعية",
          FEATURE_SOCIAL_DESC: "راقب التنوع والتأثير المجتمعي ومشاركة الموظفين",
          FEATURE_GOVERNANCE_TITLE: "الحوكمة",
          FEATURE_GOVERNANCE_DESC: "ضمان الامتثال والشفافية وممارسات الأعمال الأخلاقية"
        },
        COMMON: {
          USERNAME: "اسم المستخدم",
          PASSWORD: "كلمة المرور",
          ROLE: "الدور"
        },
        ROLES: {
          MARKETING_HEAD: "رئيس التسويق",
          SUSTAINABILITY_HEAD: "مدير الاستدامة الرئيسي",
          ESG_SPECIALIST: "متخصص ESG",
          ENVIRONMENTAL_MANAGER: "مدير البيئة",
          SOCIAL_MANAGER: "مدير الشؤون الاجتماعية",
          GOVERNANCE_MANAGER: "مدير الحوكمة",
          SUSTAINABILITY_HEAD_DESC: "وصول كامل لجميع لوحات تحكم ESG وقدرات التقارير. الإشراف الاستراتيجي وسلطة اتخاذ القرارات.",
          ESG_SPECIALIST_DESC: "الوصول إلى لوحات تحكم البيئة والاجتماعية والحوكمة. تحليل ومراقبة ESG شاملة.",
          MARKETING_HEAD_DESC: "الوصول إلى لوحات تحكم التسويق. تحليل ومراقبة التسويق الشاملة.",
          ENVIRONMENTAL_MANAGER_DESC: "التركيز على المقاييس البيئية والبصمة الكربونية واستهلاك الطاقة ومبادرات الاستدامة.",
          SOCIAL_MANAGER_DESC: "مشاركة الموظفين والتأثير المجتمعي والتنوع والشمول ومقاييس المسؤولية الاجتماعية.",
          GOVERNANCE_MANAGER_DESC: "تكوين مجلس الإدارة وحالة الامتثال والأخلاق والشفافية وأطر الحوكمة."
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
        console.warn(`Translation not found for key: ${key} in language: ${this.currentLanguage}`);
        return key;
      }
      
      return value;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
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