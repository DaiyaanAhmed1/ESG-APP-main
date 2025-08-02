import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SustainabilityGoalsRadialTranslationService {
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
        console.log('Sustainability Goals Radial translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Sustainability Goals Radial translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        SUSTAINABILITY_GOALS_RADIAL: {
          // Chart title and description
          TITLE: "Sustainability Goals Radial",
          SUBTITLE: "Progress Tracking Dashboard",
          
          // Goal categories
          ENVIRONMENTAL_GOALS: "Environmental Goals",
          SOCIAL_GOALS: "Social Goals",
          GOVERNANCE_GOALS: "Governance Goals",
          SUSTAINABILITY_TARGETS: "Sustainability Targets",
          ESG_OBJECTIVES: "ESG Objectives",
          IMPACT_METRICS: "Impact Metrics",
          
          // Progress indicators
          PROGRESS: "Progress",
          COMPLETION: "Completion",
          TARGET: "Target",
          ACHIEVED: "Achieved",
          REMAINING: "Remaining",
          ON_TRACK: "On Track",
          
          // Status indicators
          STATUS_EXCELLENT: "Excellent",
          STATUS_GOOD: "Good",
          STATUS_AVERAGE: "Average",
          STATUS_NEEDS_IMPROVEMENT: "Needs Improvement",
          STATUS_CRITICAL: "Critical",
          
          // AI insights
          AI_INSIGHT_PROGRESS: "Overall sustainability progress is at 78%. Environmental goals leading with 85% completion.",
          AI_INSIGHT_TARGETS: "Social goals need attention with 65% completion. Governance goals on track at 82%.",
          AI_INSIGHT_ACHIEVEMENT: "Three major sustainability targets achieved this quarter. Two more expected by year-end.",
          AI_INSIGHT_OPPORTUNITY: "Opportunity to accelerate social impact initiatives. Consider additional stakeholder engagement.",
          AI_INSIGHT_RISK: "Environmental compliance targets at risk. Immediate action required for regulatory alignment.",
          AI_INSIGHT_SUCCESS: "Governance framework implementation successful. Ready to expand to additional regions.",
          
          // Chart labels
          OVERALL_PROGRESS: "Overall Progress",
          GOAL_CATEGORIES: "Goal Categories",
          SUSTAINABILITY_SCORE: "Sustainability Score",
          PERFORMANCE_METRICS: "Performance Metrics",
          
          // Units and measurements
          PERCENTAGE: "%",
          PERCENT_COMPLETE: "% Complete",
          PERCENT_ACHIEVED: "% Achieved",
          
          // Footer and data info
          DATA_POWERED_BY: "Data powered by AI/ML",
          LAST_UPDATED: "Last updated",
          REAL_TIME_TRACKING: "Real-time tracking"
        }
      },
      ar: {
        SUSTAINABILITY_GOALS_RADIAL: {
          // Chart title and description
          TITLE: "الأهداف المستدامة الشعاعية",
          SUBTITLE: "لوحة تتبع التقدم",
          
          // Goal categories
          ENVIRONMENTAL_GOALS: "الأهداف البيئية",
          SOCIAL_GOALS: "الأهداف الاجتماعية",
          GOVERNANCE_GOALS: "أهداف الحوكمة",
          SUSTAINABILITY_TARGETS: "أهداف الاستدامة",
          ESG_OBJECTIVES: "أهداف ESG",
          IMPACT_METRICS: "مقاييس التأثير",
          
          // Progress indicators
          PROGRESS: "التقدم",
          COMPLETION: "الإنجاز",
          TARGET: "الهدف",
          ACHIEVED: "المحقق",
          REMAINING: "المتبقي",
          ON_TRACK: "في المسار الصحيح",
          
          // Status indicators
          STATUS_EXCELLENT: "ممتاز",
          STATUS_GOOD: "جيد",
          STATUS_AVERAGE: "متوسط",
          STATUS_NEEDS_IMPROVEMENT: "يحتاج تحسين",
          STATUS_CRITICAL: "حرج",
          
          // AI insights
          AI_INSIGHT_PROGRESS: "التقدم العام في الاستدامة عند 78%. الأهداف البيئية في المقدمة بنسبة إنجاز 85%.",
          AI_INSIGHT_TARGETS: "الأهداف الاجتماعية تحتاج اهتمام بنسبة إنجاز 65%. أهداف الحوكمة في المسار الصحيح عند 82%.",
          AI_INSIGHT_ACHIEVEMENT: "تم تحقيق ثلاثة أهداف استدامة رئيسية هذا الربع. متوقع تحقيق هدفين آخرين بحلول نهاية العام.",
          AI_INSIGHT_OPPORTUNITY: "فرصة لتسريع مبادرات التأثير الاجتماعي. فكر في مشاركة إضافية لأصحاب المصلحة.",
          AI_INSIGHT_RISK: "أهداف الامتثال البيئي في خطر. مطلوب إجراء فوري للمواءمة التنظيمية.",
          AI_INSIGHT_SUCCESS: "تنفيذ إطار الحوكمة ناجح. جاهز للتوسع إلى مناطق إضافية.",
          
          // Chart labels
          OVERALL_PROGRESS: "التقدم العام",
          GOAL_CATEGORIES: "فئات الأهداف",
          SUSTAINABILITY_SCORE: "درجة الاستدامة",
          PERFORMANCE_METRICS: "مقاييس الأداء",
          
          // Units and measurements
          PERCENTAGE: "%",
          PERCENT_COMPLETE: "% مكتمل",
          PERCENT_ACHIEVED: "% محقق",
          
          // Footer and data info
          DATA_POWERED_BY: "البيانات مدعومة بالذكاء الاصطناعي/التعلم الآلي",
          LAST_UPDATED: "آخر تحديث",
          REAL_TIME_TRACKING: "التتبع في الوقت الفعلي"
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