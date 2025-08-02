import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitiativesDashboardTranslationService {
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
        console.log('Initiatives Dashboard translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load initiatives dashboard translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        INITIATIVES_DASHBOARD: {
          // Navigation items
          SUSTAINABILITY_HEAD: "Sustainability Head",
          MATERIALITY_ASSESSMENT: "Materiality Assessment",
          MANAGE_TEAM: "Manage Team",
          ESG_INITIATIVE: "ESG Initiative",
          REPORTING_ANALYSIS: "Reporting & Analysis",
          TRAINING_DEVELOPMENT: "Training & Development",
          STAKEHOLDER_ENGAGEMENT: "Stakeholder Engagement",
          DATA_MANAGEMENT: "Data Management",
          
          // Basic actions
          COLLAPSE: "Collapse",
          LIGHT_MODE: "Light Mode",
          DARK_MODE: "Dark Mode",
          LOGOUT: "Logout",

          // Batch 2: Dashboard Summary & Headers
          DASHBOARD_TITLE: "Initiatives Dashboard",
          DASHBOARD_SUBTITLE: "Manage and track ESG initiatives, projects, and sustainability goals",
          LAST_UPDATED: "Last updated",
          ACTIVE_PROJECTS: "Active Projects",
          PROPOSALS: "Proposals",
          BUDGETS: "Budgets",
          MILESTONES: "Milestones",
          OVERVIEW: "Overview",
          STATUS: "Status",
          PROGRESS: "Progress",
          OWNER: "Owner",
          ACTIONS: "Actions",
          EDIT: "Edit",
          MONITOR: "Monitor",
          DELETE: "Delete",
          SAVE: "Save",
          CANCEL: "Cancel",
          CLOSE: "Close",

          // Batch 3: Advanced Features & Modals
          BUDGET_TRACKING: "Budget Tracking & Impact Forecasts",
          MILESTONE_TRACKER: "Milestone Tracker",
          PROJECT_NAME: "Project Name",
          TARGET_DATE: "Target Date",
          SUBMIT_PROPOSAL: "Submit Proposal",
          PROJECT_TITLE: "Project Title",
          PROJECT_DESCRIPTION: "Project Description",
          EDIT_PROJECT: "Edit Project",
          MONITOR_PROJECT: "Monitor Project",
          ONGOING: "Ongoing",
          COMPLETED: "Completed",
          ON_HOLD: "On Hold",
          PENDING: "Pending",
          APPROVED: "Approved",
          REJECTED: "Rejected",
          BUDGET: "Budget",
          SPENT: "Spent",
          FORECAST_IMPACT: "Forecast Impact",
          PROGRESS_PERCENTAGE: "Progress (%)",
          MODAL_ACTIONS: "Modal Actions"
        },
        NAVIGATION: {
          DASHBOARD: "Dashboard",
          INITIATIVES: "Initiatives",
          SUSTAINABILITY: "Sustainability",
          MATERIALITY: "Materiality",
          TEAM: "Team",
          REPORTING: "Reporting",
          TRAINING: "Training",
          STAKEHOLDER: "Stakeholder",
          DATA: "Data",
          SETTINGS: "Settings",
          LOGOUT: "Logout"
        }
      },
      ar: {
        INITIATIVES_DASHBOARD: {
          // Navigation items
          SUSTAINABILITY_HEAD: "رئيس الاستدامة",
          MATERIALITY_ASSESSMENT: "تقييم الأهمية النسبية",
          MANAGE_TEAM: "إدارة الفريق",
          ESG_INITIATIVE: "مبادرة البيئية والاجتماعية والحوكمية",
          REPORTING_ANALYSIS: "التقارير والتحليل",
          TRAINING_DEVELOPMENT: "التدريب والتطوير",
          STAKEHOLDER_ENGAGEMENT: "مشاركة أصحاب المصلحة",
          DATA_MANAGEMENT: "إدارة البيانات",
          
          // Basic actions
          COLLAPSE: "طي",
          LIGHT_MODE: "الوضع الفاتح",
          DARK_MODE: "الوضع الداكن",
          LOGOUT: "تسجيل الخروج",

          // Batch 2: Dashboard Summary & Headers
          DASHBOARD_TITLE: "لوحة تحكم المبادرات",
          DASHBOARD_SUBTITLE: "إدارة وتتبع مبادرات البيئية والاجتماعية والحوكمية والمشاريع وأهداف الاستدامة",
          LAST_UPDATED: "آخر تحديث",
          ACTIVE_PROJECTS: "المشاريع النشطة",
          PROPOSALS: "الاقتراحات",
          BUDGETS: "الميزانيات",
          MILESTONES: "المراحل المهمة",
          OVERVIEW: "نظرة عامة",
          STATUS: "الحالة",
          PROGRESS: "التقدم",
          OWNER: "المالك",
          ACTIONS: "الإجراءات",
          EDIT: "تعديل",
          MONITOR: "مراقبة",
          DELETE: "حذف",
          SAVE: "حفظ",
          CANCEL: "إلغاء",
          CLOSE: "إغلاق",

          // Batch 3: Advanced Features & Modals
          BUDGET_TRACKING: "تتبع الميزانية والتنبؤ بالتأثير",
          MILESTONE_TRACKER: "متتبع المراحل",
          PROJECT_NAME: "اسم المشروع",
          TARGET_DATE: "تاريخ الهدف",
          SUBMIT_PROPOSAL: "إرسال الاقتراح",
          PROJECT_TITLE: "عنوان المشروع",
          PROJECT_DESCRIPTION: "وصف المشروع",
          EDIT_PROJECT: "تعديل المشروع",
          MONITOR_PROJECT: "مراقبة المشروع",
          ONGOING: "قيد التنفيذ",
          COMPLETED: "مكتمل",
          ON_HOLD: "معلق",
          PENDING: "في الانتظار",
          APPROVED: "موافق عليه",
          REJECTED: "مرفوض",
          BUDGET: "الميزانية",
          SPENT: "المُنفق",
          FORECAST_IMPACT: "التنبؤ بالتأثير",
          PROGRESS_PERCENTAGE: "التقدم (%)",
          MODAL_ACTIONS: "إجراءات النافذة"
        },
        NAVIGATION: {
          DASHBOARD: "لوحة التحكم",
          INITIATIVES: "المبادرات",
          SUSTAINABILITY: "الاستدامة",
          MATERIALITY: "الأهمية النسبية",
          TEAM: "الفريق",
          REPORTING: "التقارير",
          TRAINING: "التدريب",
          STAKEHOLDER: "أصحاب المصلحة",
          DATA: "البيانات",
          SETTINGS: "الإعدادات",
          LOGOUT: "تسجيل الخروج"
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