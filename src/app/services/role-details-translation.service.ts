import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleDetailsTranslationService {
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
        console.log('Role Details translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load role details translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        ROLE_DETAILS: {
          TITLE: "Role Details",
          SUBTITLE: "Comprehensive role information and responsibilities",
          WELCOME: "Welcome",
          SUSTAINABILITY_HEAD_MANAGER: "Sustainability Head Manager",
          ESG_PLATFORM: "ESG Platform",
          QUICK_STATS: "Quick Stats",
          CO2: "CO₂",
          DIVERSITY: "Diversity",
          COMPLIANCE: "Compliance",
          PROJECTS: "Projects",
          ACTIVE: "Active",
          ESG_SCORE: "ESG Score",
          CO2_TARGET: "CO₂ Target",
          REVIEW_PROJECTS: "Review Projects",
          PROJECTS_NEED_APPROVAL: "projects need your approval",
          SOLAR_PANEL_EXPANSION: "Solar Panel Expansion",
          WATER_CONSERVATION: "Water Conservation",
          ZERO_WASTE_OFFICE: "Zero-Waste Office",
          PENDING: "Pending",
          IN_REVIEW: "In Review",
          GO_TO_PROJECTS: "Go to Projects",
          COMPLIANCE_ALERTS: "Compliance Alerts",
          COMPLIANCE_ISSUES: "compliance issues require attention",
          WATER_USAGE_ABOVE_TARGET: "Water usage above target",
          SUPPLIER_AUDIT_OVERDUE: "Supplier audit overdue",
          DUE: "Due",
          VIEW_COMPLIANCE: "View Compliance",
          SET_UPDATE_GOALS: "Set/Update Goals",
          ANNUAL_CO2_TARGET: "Annual CO₂ target",
          WATER_TARGET: "Water",
          UPDATE_GOALS: "Update Goals",
          TEAM_COLLABORATION: "Team Collaboration",
          NEW_COMMENTS: "new comments",
          TASK_ASSIGNED: "task assigned",
          READY_FOR_Q2_REPORT: "Ready for Q2 report review.",
          SUPPLIER_AUDIT_SCHEDULED: "Supplier audit scheduled.",
          GO_TO_TEAM: "Go to Team",
          DOWNLOAD_SHARE_REPORT: "Download/Share Report",
          LATEST_ESG_REPORT: "Latest ESG report ready for download or sharing.",
          DOWNLOAD_REPORT: "Download Report",
          SHARE_WITH_BOARD: "Share with Board",
          ANALYST_DASHBOARD: "Analyst Dashboard",
          DATA_ANALYST: "Data Analyst",
          KPI_OVERVIEW: "KPI Overview",
          PERFORMANCE_METRICS: "Performance Metrics",
          TEAM_ANALYSIS: "Team Analysis",
          RECENT_COLLABORATION: "Recent Collaboration",
          COMPLIANCE_STATUS: "Compliance Status",
          STAKEHOLDER_ENGAGEMENT: "Stakeholder Engagement",
          NEWS_UPDATES: "News & Updates",
          TASK_MODAL: "Task Modal",
          CLOSE: "Close",
          SAVE: "Save",
          CANCEL: "Cancel",
          SUCCESS: "Success",
          ERROR: "Error",
          GOALS_UPDATED: "Goals updated successfully",
          GOALS_SAVED: "Goals saved successfully"
        },
        NAVIGATION: {
          DASHBOARD: "Dashboard",
          TEAM_MANAGEMENT: "Team Management",
          LEADS: "Leads",
          RESOURCE_MANAGEMENT: "Resource Management",
          REPORT_ANALYTICS: "Report & Analytics",
          TRAINING_DEVELOP: "Training & Develop",
          HELP_SUPPORT: "Help & Support",
          SECURITY: "Security",
          UX: "UX",
          LOCALIZATION: "Localization",
          LOGOUT: "Logout",
          COLLAPSE: "Collapse",
          LIGHT_MODE: "Light Mode"
        }
      },
      ar: {
        ROLE_DETAILS: {
          TITLE: "تفاصيل الدور",
          SUBTITLE: "معلومات شاملة عن الدور والمسؤوليات",
          WELCOME: "مرحباً",
          SUSTAINABILITY_HEAD_MANAGER: "مدير الاستدامة",
          ESG_PLATFORM: "منصة ESG",
          QUICK_STATS: "إحصائيات سريعة",
          CO2: "ثاني أكسيد الكربون",
          DIVERSITY: "التنوع",
          COMPLIANCE: "الامتثال",
          PROJECTS: "المشاريع",
          ACTIVE: "نشط",
          ESG_SCORE: "درجة ESG",
          CO2_TARGET: "هدف ثاني أكسيد الكربون",
          REVIEW_PROJECTS: "مراجعة المشاريع",
          PROJECTS_NEED_APPROVAL: "مشاريع تحتاج موافقتك",
          SOLAR_PANEL_EXPANSION: "توسيع الألواح الشمسية",
          WATER_CONSERVATION: "حفظ المياه",
          ZERO_WASTE_OFFICE: "مكتب خالٍ من النفايات",
          PENDING: "معلق",
          IN_REVIEW: "قيد المراجعة",
          GO_TO_PROJECTS: "الذهاب إلى المشاريع",
          COMPLIANCE_ALERTS: "تنبيهات الامتثال",
          COMPLIANCE_ISSUES: "مشاكل امتثال تحتاج انتباه",
          WATER_USAGE_ABOVE_TARGET: "استخدام المياه أعلى من الهدف",
          SUPPLIER_AUDIT_OVERDUE: "مراجعة المورد متأخرة",
          DUE: "مستحق",
          VIEW_COMPLIANCE: "عرض الامتثال",
          SET_UPDATE_GOALS: "تعيين/تحديث الأهداف",
          ANNUAL_CO2_TARGET: "الهدف السنوي لثاني أكسيد الكربون",
          WATER_TARGET: "المياه",
          UPDATE_GOALS: "تحديث الأهداف",
          TEAM_COLLABORATION: "تعاون الفريق",
          NEW_COMMENTS: "تعليقات جديدة",
          TASK_ASSIGNED: "مهمة مُسندة",
          READY_FOR_Q2_REPORT: "جاهز لمراجعة تقرير الربع الثاني.",
          SUPPLIER_AUDIT_SCHEDULED: "مراجعة المورد مجدولة.",
          GO_TO_TEAM: "الذهاب إلى الفريق",
          DOWNLOAD_SHARE_REPORT: "تحميل/مشاركة التقرير",
          LATEST_ESG_REPORT: "أحدث تقرير ESG جاهز للتحميل أو المشاركة.",
          DOWNLOAD_REPORT: "تحميل التقرير",
          SHARE_WITH_BOARD: "مشاركة مع المجلس",
          ANALYST_DASHBOARD: "لوحة تحكم المحلل",
          DATA_ANALYST: "محلل البيانات",
          KPI_OVERVIEW: "نظرة عامة على مؤشرات الأداء",
          PERFORMANCE_METRICS: "مقاييس الأداء",
          TEAM_ANALYSIS: "تحليل الفريق",
          RECENT_COLLABORATION: "التعاون الأخير",
          COMPLIANCE_STATUS: "حالة الامتثال",
          STAKEHOLDER_ENGAGEMENT: "مشاركة أصحاب المصلحة",
          NEWS_UPDATES: "الأخبار والتحديثات",
          TASK_MODAL: "نافذة المهمة",
          CLOSE: "إغلاق",
          SAVE: "حفظ",
          CANCEL: "إلغاء",
          SUCCESS: "نجح",
          ERROR: "خطأ",
          GOALS_UPDATED: "تم تحديث الأهداف بنجاح",
          GOALS_SAVED: "تم حفظ الأهداف بنجاح"
        },
        NAVIGATION: {
          DASHBOARD: "لوحة التحكم",
          TEAM_MANAGEMENT: "إدارة الفريق",
          LEADS: "العملاء المحتملين",
          RESOURCE_MANAGEMENT: "إدارة الموارد",
          REPORT_ANALYTICS: "التقارير والتحليلات",
          TRAINING_DEVELOP: "التدريب والتطوير",
          HELP_SUPPORT: "المساعدة والدعم",
          SECURITY: "الأمان",
          UX: "تجربة المستخدم",
          LOCALIZATION: "التوطين",
          LOGOUT: "تسجيل الخروج",
          COLLAPSE: "طي",
          LIGHT_MODE: "الوضع الفاتح"
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