import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsTranslationService {
  private currentLanguage = 'en';
  private translations: any = {};
  private languageChange$ = new BehaviorSubject<string>('en');

  constructor(
    private http: HttpClient,
    private globalLanguageService: GlobalLanguageService
  ) {
    this.loadFallbackTranslations();
    this.loadTranslations();
  
    
    // Subscribe to global language changes
    this.globalLanguageService.getLanguageState$().subscribe((state) => {
      this.languageChange$.next(state.currentLanguage);
    });}

  private async loadTranslations() {
    try {
      if (typeof window === 'undefined') {
        console.log('Not in browser environment, using fallback translations');
        return;
      }

      const [enTranslations, arTranslations] = await Promise.all([
        this.http.get('../assets/i18n/en.json').toPromise(),
        this.http.get('../assets/i18n/ar.json').toPromise()
      ]);

      if (enTranslations && arTranslations) {
        this.translations = {
          en: enTranslations,
          ar: arTranslations
        };
        console.log('Settings translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Settings translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        SETTINGS: {
          // Page title and navigation
          TITLE: "Settings",
          SUBTITLE: "System Configuration & Preferences",
          BACK_TO_DASHBOARD: "Back to Dashboard",
          
          // Settings categories
          GENERAL_SETTINGS: "General Settings",
          PROFILE_SETTINGS: "Profile Settings",
          NOTIFICATION_SETTINGS: "Notification Settings",
          SECURITY_SETTINGS: "Security Settings",
          PRIVACY_SETTINGS: "Privacy Settings",
          APPEARANCE_SETTINGS: "Appearance Settings",
          
          // General settings
          LANGUAGE: "Language",
          TIMEZONE: "Timezone",
          DATE_FORMAT: "Date Format",
          TIME_FORMAT: "Time Format",
          CURRENCY: "Currency",
          THEME: "Theme",
          DARK_MODE: "Dark Mode",
          LIGHT_MODE: "Light Mode",
          AUTO_MODE: "Auto Mode",
          
          // Profile settings
          PERSONAL_INFORMATION: "Personal Information",
          FIRST_NAME: "First Name",
          LAST_NAME: "Last Name",
          EMAIL_ADDRESS: "Email Address",
          PHONE_NUMBER: "Phone Number",
          JOB_TITLE: "Job Title",
          DEPARTMENT: "Department",
          COMPANY: "Company",
          PROFILE_PICTURE: "Profile Picture",
          CHANGE_PASSWORD: "Change Password",
          
          // Notification settings
          NOTIFICATIONS: "Notifications",
          EMAIL_NOTIFICATIONS: "Email Notifications",
          PUSH_NOTIFICATIONS: "Push Notifications",
          SMS_NOTIFICATIONS: "SMS Notifications",
          NOTIFICATION_FREQUENCY: "Notification Frequency",
          DAILY_DIGEST: "Daily Digest",
          WEEKLY_SUMMARY: "Weekly Summary",
          REAL_TIME: "Real-time",
          DISABLED: "Disabled",
          
          // Security settings
          SECURITY: "Security",
          TWO_FACTOR_AUTHENTICATION: "Two-Factor Authentication",
          LOGIN_HISTORY: "Login History",
          ACTIVE_SESSIONS: "Active Sessions",
          PASSWORD_POLICY: "Password Policy",
          SESSION_TIMEOUT: "Session Timeout",
          LOGOUT_ALL_DEVICES: "Logout All Devices",
          
          // Privacy settings
          PRIVACY: "Privacy",
          DATA_SHARING: "Data Sharing",
          ANALYTICS_TRACKING: "Analytics Tracking",
          COOKIE_PREFERENCES: "Cookie Preferences",
          LOCATION_SHARING: "Location Sharing",
          PROFILE_VISIBILITY: "Profile Visibility",
          PUBLIC: "Public",
          PRIVATE: "Private",
          FRIENDS_ONLY: "Friends Only",
          
          // Appearance settings
          APPEARANCE: "Appearance",
          FONT_SIZE: "Font Size",
          COLOR_SCHEME: "Color Scheme",
          LAYOUT_PREFERENCES: "Layout Preferences",
          COMPACT_VIEW: "Compact View",
          COMFORTABLE_VIEW: "Comfortable View",
          SIDEBAR_POSITION: "Sidebar Position",
          LEFT: "Left",
          RIGHT: "Right",
          TOP: "Top",
          
          // Actions and buttons
          SAVE_CHANGES: "Save Changes",
          CANCEL: "Cancel",
          RESET_TO_DEFAULT: "Reset to Default",
          APPLY: "Apply",
          CONFIRM: "Confirm",
          DELETE: "Delete",
          EDIT: "Edit",
          UPDATE: "Update",
          
          // Messages and alerts
          CHANGES_SAVED: "Changes saved successfully",
          ERROR_SAVING: "Error saving changes",
          CONFIRM_DELETE: "Are you sure you want to delete this?",
          UNSAVED_CHANGES: "You have unsaved changes",
          SESSION_EXPIRED: "Your session has expired",
          
          // Form labels and placeholders
          ENTER_FIRST_NAME: "Enter your first name",
          ENTER_LAST_NAME: "Enter your last name",
          ENTER_EMAIL: "Enter your email address",
          ENTER_PHONE: "Enter your phone number",
          ENTER_JOB_TITLE: "Enter your job title",
          SELECT_DEPARTMENT: "Select your department",
          SELECT_TIMEZONE: "Select your timezone",
          SELECT_LANGUAGE: "Select your language",
          SELECT_THEME: "Select your theme",
          
          // Help and support
          HELP: "Help",
          SUPPORT: "Support",
          FAQ: "FAQ",
          CONTACT_SUPPORT: "Contact Support",
          USER_GUIDE: "User Guide",
          FEEDBACK: "Feedback",
          REPORT_BUG: "Report Bug",
          SUGGEST_FEATURE: "Suggest Feature"
        }
      },
      ar: {
        SETTINGS: {
          // Page title and navigation
          TITLE: "الإعدادات",
          SUBTITLE: "تكوين النظام والتفضيلات",
          BACK_TO_DASHBOARD: "العودة إلى لوحة التحكم",
          
          // Settings categories
          GENERAL_SETTINGS: "الإعدادات العامة",
          PROFILE_SETTINGS: "إعدادات الملف الشخصي",
          NOTIFICATION_SETTINGS: "إعدادات الإشعارات",
          SECURITY_SETTINGS: "إعدادات الأمان",
          PRIVACY_SETTINGS: "إعدادات الخصوصية",
          APPEARANCE_SETTINGS: "إعدادات المظهر",
          
          // General settings
          LANGUAGE: "اللغة",
          TIMEZONE: "المنطقة الزمنية",
          DATE_FORMAT: "تنسيق التاريخ",
          TIME_FORMAT: "تنسيق الوقت",
          CURRENCY: "العملة",
          THEME: "المظهر",
          DARK_MODE: "الوضع الداكن",
          LIGHT_MODE: "الوضع الفاتح",
          AUTO_MODE: "الوضع التلقائي",
          
          // Profile settings
          PERSONAL_INFORMATION: "المعلومات الشخصية",
          FIRST_NAME: "الاسم الأول",
          LAST_NAME: "اسم العائلة",
          EMAIL_ADDRESS: "عنوان البريد الإلكتروني",
          PHONE_NUMBER: "رقم الهاتف",
          JOB_TITLE: "المسمى الوظيفي",
          DEPARTMENT: "القسم",
          COMPANY: "الشركة",
          PROFILE_PICTURE: "صورة الملف الشخصي",
          CHANGE_PASSWORD: "تغيير كلمة المرور",
          
          // Notification settings
          NOTIFICATIONS: "الإشعارات",
          EMAIL_NOTIFICATIONS: "إشعارات البريد الإلكتروني",
          PUSH_NOTIFICATIONS: "الإشعارات الفورية",
          SMS_NOTIFICATIONS: "إشعارات الرسائل النصية",
          NOTIFICATION_FREQUENCY: "تكرار الإشعارات",
          DAILY_DIGEST: "ملخص يومي",
          WEEKLY_SUMMARY: "ملخص أسبوعي",
          REAL_TIME: "في الوقت الفعلي",
          DISABLED: "معطل",
          
          // Security settings
          SECURITY: "الأمان",
          TWO_FACTOR_AUTHENTICATION: "المصادقة الثنائية",
          LOGIN_HISTORY: "سجل تسجيل الدخول",
          ACTIVE_SESSIONS: "الجلسات النشطة",
          PASSWORD_POLICY: "سياسة كلمة المرور",
          SESSION_TIMEOUT: "انتهاء صلاحية الجلسة",
          LOGOUT_ALL_DEVICES: "تسجيل الخروج من جميع الأجهزة",
          
          // Privacy settings
          PRIVACY: "الخصوصية",
          DATA_SHARING: "مشاركة البيانات",
          ANALYTICS_TRACKING: "تتبع التحليلات",
          COOKIE_PREFERENCES: "تفضيلات ملفات تعريف الارتباط",
          LOCATION_SHARING: "مشاركة الموقع",
          PROFILE_VISIBILITY: "رؤية الملف الشخصي",
          PUBLIC: "عام",
          PRIVATE: "خاص",
          FRIENDS_ONLY: "الأصدقاء فقط",
          
          // Appearance settings
          APPEARANCE: "المظهر",
          FONT_SIZE: "حجم الخط",
          COLOR_SCHEME: "مخطط الألوان",
          LAYOUT_PREFERENCES: "تفضيلات التخطيط",
          COMPACT_VIEW: "عرض مضغوط",
          COMFORTABLE_VIEW: "عرض مريح",
          SIDEBAR_POSITION: "موضع الشريط الجانبي",
          LEFT: "يسار",
          RIGHT: "يمين",
          TOP: "أعلى",
          
          // Actions and buttons
          SAVE_CHANGES: "حفظ التغييرات",
          CANCEL: "إلغاء",
          RESET_TO_DEFAULT: "إعادة تعيين إلى الافتراضي",
          APPLY: "تطبيق",
          CONFIRM: "تأكيد",
          DELETE: "حذف",
          EDIT: "تعديل",
          UPDATE: "تحديث",
          
          // Messages and alerts
          CHANGES_SAVED: "تم حفظ التغييرات بنجاح",
          ERROR_SAVING: "خطأ في حفظ التغييرات",
          CONFIRM_DELETE: "هل أنت متأكد من أنك تريد حذف هذا؟",
          UNSAVED_CHANGES: "لديك تغييرات غير محفوظة",
          SESSION_EXPIRED: "انتهت صلاحية جلستك",
          
          // Form labels and placeholders
          ENTER_FIRST_NAME: "أدخل اسمك الأول",
          ENTER_LAST_NAME: "أدخل اسم عائلتك",
          ENTER_EMAIL: "أدخل عنوان بريدك الإلكتروني",
          ENTER_PHONE: "أدخل رقم هاتفك",
          ENTER_JOB_TITLE: "أدخل مسمى وظيفتك",
          SELECT_DEPARTMENT: "اختر قسمك",
          SELECT_TIMEZONE: "اختر منطقتك الزمنية",
          SELECT_LANGUAGE: "اختر لغتك",
          SELECT_THEME: "اختر مظهرك",
          
          // Help and support
          HELP: "المساعدة",
          SUPPORT: "الدعم",
          FAQ: "الأسئلة الشائعة",
          CONTACT_SUPPORT: "اتصل بالدعم",
          USER_GUIDE: "دليل المستخدم",
          FEEDBACK: "التعليقات",
          REPORT_BUG: "الإبلاغ عن خطأ",
          SUGGEST_FEATURE: "اقتراح ميزة"
        }
      }
    };
  }

  getCurrentLanguage(): string {
    return this.globalLanguageService.getCurrentLanguage();
  }

  getLanguageChange$(): Observable<string> {
    return this.languageChange$.asObservable();
  }

  toggleLanguage(): void {
    this.globalLanguageService.toggleLanguage();
  }

  translate(key: string): string {
    try {
      const keys = key.split('.');
      let translation = this.translations[this.currentLanguage];
      
      for (const k of keys) {
        translation = translation[k];
        if (!translation) break;
      }
      
      return translation || key;
    } catch (error) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
  }

  isRTL(): boolean {
    return this.globalLanguageService.isRTL();
  }

  isTranslationsLoaded(): boolean {
    return Object.keys(this.translations).length > 0;
  }

  getTranslations(): any {
    return this.translations;
  }
} 