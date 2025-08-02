import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnergyConsumptionBarChartTranslationService {
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
        console.log('Energy Consumption Bar Chart translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Energy Consumption Bar Chart translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        ENERGY_CONSUMPTION_BAR_CHART: {
          // Chart title and badges
          TITLE: "Energy Consumption Analytics",
          IOT_BADGE: "IoT",
          AI_ML_BADGE: "AI/ML",
          
          // Statistics cards
          TOTAL_ENERGY: "Total Energy",
          TOTAL_ENERGY_DESC: "This month's consumption",
          RENEWABLE: "Renewable",
          RENEWABLE_DESC: "Clean energy usage",
          EFFICIENCY: "Efficiency",
          EFFICIENCY_DESC: "Energy optimization",
          
          // Chart labels and units
          MEGAWATT_HOURS: "MWh",
          RENEWABLE_LABEL: "Renewable",
          NON_RENEWABLE_LABEL: "Non-Renewable",
          TOTAL_LABEL: "Total",
          
          // Progress indicators
          ENERGY_EFFICIENCY: "Energy Efficiency",
          RENEWABLE_MIX: "Renewable Mix",
          
          // AI insights
          AI_INSIGHT_OPTIMIZATION: "Energy consumption shows 15% improvement in efficiency. Consider implementing smart grid technologies for further optimization.",
          AI_INSIGHT_RENEWABLE: "Renewable energy usage increased by 8%. Solar panel installation in Q2 could boost this to 25%.",
          AI_INSIGHT_PEAK: "Peak consumption detected during 2-4 PM. Recommend load balancing strategies.",
          AI_INSIGHT_TREND: "Consumption trend indicates seasonal variation. Winter months show 20% higher usage.",
          AI_INSIGHT_ANOMALY: "Unusual spike detected on Tuesday. Investigate potential equipment malfunction.",
          AI_INSIGHT_SAVINGS: "Current efficiency measures saving $12,000 monthly. ROI on smart meters: 8 months.",
          
          // Status and metrics
          STATUS_ACTIVE: "Active",
          STATUS_OPTIMAL: "Optimal",
          STATUS_WARNING: "Warning",
          STATUS_CRITICAL: "Critical",
          
          // Footer and data info
          DATA_POWERED_BY: "Data powered by IoT",
          LAST_UPDATED: "Last updated",
          REAL_TIME_DATA: "Real-time data"
        }
      },
      ar: {
        ENERGY_CONSUMPTION_BAR_CHART: {
          // Chart title and badges
          TITLE: "تحليلات استهلاك الطاقة",
          IOT_BADGE: "إنترنت الأشياء",
          AI_ML_BADGE: "الذكاء الاصطناعي/التعلم الآلي",
          
          // Statistics cards
          TOTAL_ENERGY: "إجمالي الطاقة",
          TOTAL_ENERGY_DESC: "استهلاك هذا الشهر",
          RENEWABLE: "متجددة",
          RENEWABLE_DESC: "استخدام الطاقة النظيفة",
          EFFICIENCY: "الكفاءة",
          EFFICIENCY_DESC: "تحسين الطاقة",
          
          // Chart labels and units
          MEGAWATT_HOURS: "ميجاواط ساعة",
          RENEWABLE_LABEL: "متجددة",
          NON_RENEWABLE_LABEL: "غير متجددة",
          TOTAL_LABEL: "الإجمالي",
          
          // Progress indicators
          ENERGY_EFFICIENCY: "كفاءة الطاقة",
          RENEWABLE_MIX: "مزيج الطاقة المتجددة",
          
          // AI insights
          AI_INSIGHT_OPTIMIZATION: "يظهر استهلاك الطاقة تحسناً بنسبة 15% في الكفاءة. فكر في تنفيذ تقنيات الشبكة الذكية لمزيد من التحسين.",
          AI_INSIGHT_RENEWABLE: "زاد استخدام الطاقة المتجددة بنسبة 8%. يمكن أن يعزز تركيب الألواح الشمسية في الربع الثاني هذا إلى 25%.",
          AI_INSIGHT_PEAK: "تم اكتشاف استهلاك ذروة خلال 2-4 مساءً. أوصي باستراتيجيات موازنة الأحمال.",
          AI_INSIGHT_TREND: "يشير اتجاه الاستهلاك إلى تباين موسمي. تظهر أشهر الشتاء استهلاكاً أعلى بنسبة 20%.",
          AI_INSIGHT_ANOMALY: "تم اكتشاف ارتفاع غير عادي يوم الثلاثاء. تحقق من احتمال عطل في المعدات.",
          AI_INSIGHT_SAVINGS: "تدابير الكفاءة الحالية توفر 12,000 دولار شهرياً. العائد على الاستثمار في العدادات الذكية: 8 أشهر.",
          
          // Status and metrics
          STATUS_ACTIVE: "نشط",
          STATUS_OPTIMAL: "مثالي",
          STATUS_WARNING: "تحذير",
          STATUS_CRITICAL: "حرج",
          
          // Footer and data info
          DATA_POWERED_BY: "البيانات مدعومة بإنترنت الأشياء",
          LAST_UPDATED: "آخر تحديث",
          REAL_TIME_DATA: "بيانات في الوقت الفعلي"
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