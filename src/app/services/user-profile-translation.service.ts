import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileTranslationService {
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
        console.log('User Profile translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load User Profile translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        USER_PROFILE: {
          // Page title and navigation
          TITLE: "User Profile",
          SUBTITLE: "Profile Management & Account Settings",
          BACK_TO_DASHBOARD: "Back to Dashboard",
          
          // Profile sections
          PERSONAL_INFORMATION: "Personal Information",
          CONTACT_DETAILS: "Contact Details",
          ACCOUNT_SETTINGS: "Account Settings",
          PREFERENCES: "Preferences",
          SECURITY: "Security",
          ACTIVITY: "Activity",
          
          // Personal information
          FIRST_NAME: "First Name",
          LAST_NAME: "Last Name",
          FULL_NAME: "Full Name",
          DATE_OF_BIRTH: "Date of Birth",
          GENDER: "Gender",
          NATIONALITY: "Nationality",
          BIO: "Biography",
          ABOUT_ME: "About Me",
          PROFILE_PICTURE: "Profile Picture",
          UPLOAD_PHOTO: "Upload Photo",
          REMOVE_PHOTO: "Remove Photo",
          
          // Contact details
          EMAIL_ADDRESS: "Email Address",
          PHONE_NUMBER: "Phone Number",
          MOBILE_NUMBER: "Mobile Number",
          ADDRESS: "Address",
          CITY: "City",
          COUNTRY: "Country",
          POSTAL_CODE: "Postal Code",
          WEBSITE: "Website",
          LINKEDIN: "LinkedIn",
          TWITTER: "Twitter",
          
          // Account settings
          USERNAME: "Username",
          PASSWORD: "Password",
          CURRENT_PASSWORD: "Current Password",
          NEW_PASSWORD: "New Password",
          CONFIRM_PASSWORD: "Confirm Password",
          CHANGE_PASSWORD: "Change Password",
          ACCOUNT_TYPE: "Account Type",
          MEMBERSHIP_LEVEL: "Membership Level",
          ACCOUNT_STATUS: "Account Status",
          VERIFICATION_STATUS: "Verification Status",
          
          // Preferences
          LANGUAGE: "Language",
          TIMEZONE: "Timezone",
          DATE_FORMAT: "Date Format",
          TIME_FORMAT: "Time Format",
          CURRENCY: "Currency",
          THEME: "Theme",
          NOTIFICATIONS: "Notifications",
          EMAIL_PREFERENCES: "Email Preferences",
          PRIVACY_SETTINGS: "Privacy Settings",
          
          // Security
          TWO_FACTOR_AUTHENTICATION: "Two-Factor Authentication",
          LOGIN_HISTORY: "Login History",
          ACTIVE_SESSIONS: "Active Sessions",
          DEVICE_MANAGEMENT: "Device Management",
          PASSWORD_HISTORY: "Password History",
          SECURITY_QUESTIONS: "Security Questions",
          LOGOUT_ALL_DEVICES: "Logout All Devices",
          
          // Activity
          RECENT_ACTIVITY: "Recent Activity",
          LOGIN_ATTEMPTS: "Login Attempts",
          PASSWORD_CHANGES: "Password Changes",
          PROFILE_UPDATES: "Profile Updates",
          ACCOUNT_CREATED: "Account Created",
          LAST_LOGIN: "Last Login",
          LAST_ACTIVITY: "Last Activity",
          
          // Actions and buttons
          SAVE_CHANGES: "Save Changes",
          CANCEL: "Cancel",
          UPDATE_PROFILE: "Update Profile",
          DELETE_ACCOUNT: "Delete Account",
          DEACTIVATE_ACCOUNT: "Deactivate Account",
          EXPORT_DATA: "Export Data",
          DOWNLOAD_PROFILE: "Download Profile",
          
          // Messages and alerts
          PROFILE_UPDATED: "Profile updated successfully",
          PASSWORD_CHANGED: "Password changed successfully",
          EMAIL_VERIFIED: "Email verified successfully",
          ACCOUNT_DELETED: "Account deleted successfully",
          ERROR_UPDATING: "Error updating profile",
          CONFIRM_DELETE: "Are you sure you want to delete your account?",
          UNSAVED_CHANGES: "You have unsaved changes",
          
          // Form labels and placeholders
          ENTER_FIRST_NAME: "Enter your first name",
          ENTER_LAST_NAME: "Enter your last name",
          ENTER_EMAIL: "Enter your email address",
          ENTER_PHONE: "Enter your phone number",
          ENTER_ADDRESS: "Enter your address",
          ENTER_BIO: "Tell us about yourself",
          SELECT_COUNTRY: "Select your country",
          SELECT_LANGUAGE: "Select your language",
          SELECT_THEME: "Select your theme",
          
          // Status indicators
          VERIFIED: "Verified",
          UNVERIFIED: "Unverified",
          ACTIVE: "Active",
          INACTIVE: "Inactive",
          SUSPENDED: "Suspended",
          PENDING: "Pending",
          APPROVED: "Approved",
          REJECTED: "Rejected"
        }
      },
      ar: {
        USER_PROFILE: {
          // Page title and navigation
          TITLE: "الملف الشخصي",
          SUBTITLE: "إدارة الملف الشخصي وإعدادات الحساب",
          BACK_TO_DASHBOARD: "العودة إلى لوحة التحكم",
          
          // Profile sections
          PERSONAL_INFORMATION: "المعلومات الشخصية",
          CONTACT_DETAILS: "تفاصيل الاتصال",
          ACCOUNT_SETTINGS: "إعدادات الحساب",
          PREFERENCES: "التفضيلات",
          SECURITY: "الأمان",
          ACTIVITY: "النشاط",
          
          // Personal information
          FIRST_NAME: "الاسم الأول",
          LAST_NAME: "اسم العائلة",
          FULL_NAME: "الاسم الكامل",
          DATE_OF_BIRTH: "تاريخ الميلاد",
          GENDER: "الجنس",
          NATIONALITY: "الجنسية",
          BIO: "السيرة الذاتية",
          ABOUT_ME: "عني",
          PROFILE_PICTURE: "صورة الملف الشخصي",
          UPLOAD_PHOTO: "رفع صورة",
          REMOVE_PHOTO: "إزالة الصورة",
          
          // Contact details
          EMAIL_ADDRESS: "عنوان البريد الإلكتروني",
          PHONE_NUMBER: "رقم الهاتف",
          MOBILE_NUMBER: "رقم الجوال",
          ADDRESS: "العنوان",
          CITY: "المدينة",
          COUNTRY: "البلد",
          POSTAL_CODE: "الرمز البريدي",
          WEBSITE: "الموقع الإلكتروني",
          LINKEDIN: "لينكد إن",
          TWITTER: "تويتر",
          
          // Account settings
          USERNAME: "اسم المستخدم",
          PASSWORD: "كلمة المرور",
          CURRENT_PASSWORD: "كلمة المرور الحالية",
          NEW_PASSWORD: "كلمة المرور الجديدة",
          CONFIRM_PASSWORD: "تأكيد كلمة المرور",
          CHANGE_PASSWORD: "تغيير كلمة المرور",
          ACCOUNT_TYPE: "نوع الحساب",
          MEMBERSHIP_LEVEL: "مستوى العضوية",
          ACCOUNT_STATUS: "حالة الحساب",
          VERIFICATION_STATUS: "حالة التحقق",
          
          // Preferences
          LANGUAGE: "اللغة",
          TIMEZONE: "المنطقة الزمنية",
          DATE_FORMAT: "تنسيق التاريخ",
          TIME_FORMAT: "تنسيق الوقت",
          CURRENCY: "العملة",
          THEME: "المظهر",
          NOTIFICATIONS: "الإشعارات",
          EMAIL_PREFERENCES: "تفضيلات البريد الإلكتروني",
          PRIVACY_SETTINGS: "إعدادات الخصوصية",
          
          // Security
          TWO_FACTOR_AUTHENTICATION: "المصادقة الثنائية",
          LOGIN_HISTORY: "سجل تسجيل الدخول",
          ACTIVE_SESSIONS: "الجلسات النشطة",
          DEVICE_MANAGEMENT: "إدارة الأجهزة",
          PASSWORD_HISTORY: "سجل كلمات المرور",
          SECURITY_QUESTIONS: "أسئلة الأمان",
          LOGOUT_ALL_DEVICES: "تسجيل الخروج من جميع الأجهزة",
          
          // Activity
          RECENT_ACTIVITY: "النشاط الأخير",
          LOGIN_ATTEMPTS: "محاولات تسجيل الدخول",
          PASSWORD_CHANGES: "تغييرات كلمة المرور",
          PROFILE_UPDATES: "تحديثات الملف الشخصي",
          ACCOUNT_CREATED: "تم إنشاء الحساب",
          LAST_LOGIN: "آخر تسجيل دخول",
          LAST_ACTIVITY: "آخر نشاط",
          
          // Actions and buttons
          SAVE_CHANGES: "حفظ التغييرات",
          CANCEL: "إلغاء",
          UPDATE_PROFILE: "تحديث الملف الشخصي",
          DELETE_ACCOUNT: "حذف الحساب",
          DEACTIVATE_ACCOUNT: "إلغاء تفعيل الحساب",
          EXPORT_DATA: "تصدير البيانات",
          DOWNLOAD_PROFILE: "تحميل الملف الشخصي",
          
          // Messages and alerts
          PROFILE_UPDATED: "تم تحديث الملف الشخصي بنجاح",
          PASSWORD_CHANGED: "تم تغيير كلمة المرور بنجاح",
          EMAIL_VERIFIED: "تم التحقق من البريد الإلكتروني بنجاح",
          ACCOUNT_DELETED: "تم حذف الحساب بنجاح",
          ERROR_UPDATING: "خطأ في تحديث الملف الشخصي",
          CONFIRM_DELETE: "هل أنت متأكد من أنك تريد حذف حسابك؟",
          UNSAVED_CHANGES: "لديك تغييرات غير محفوظة",
          
          // Form labels and placeholders
          ENTER_FIRST_NAME: "أدخل اسمك الأول",
          ENTER_LAST_NAME: "أدخل اسم عائلتك",
          ENTER_EMAIL: "أدخل عنوان بريدك الإلكتروني",
          ENTER_PHONE: "أدخل رقم هاتفك",
          ENTER_ADDRESS: "أدخل عنوانك",
          ENTER_BIO: "أخبرنا عن نفسك",
          SELECT_COUNTRY: "اختر بلدك",
          SELECT_LANGUAGE: "اختر لغتك",
          SELECT_THEME: "اختر مظهرك",
          
          // Status indicators
          VERIFIED: "متحقق",
          UNVERIFIED: "غير متحقق",
          ACTIVE: "نشط",
          INACTIVE: "غير نشط",
          SUSPENDED: "معلق",
          PENDING: "في الانتظار",
          APPROVED: "موافق عليه",
          REJECTED: "مرفوض"
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