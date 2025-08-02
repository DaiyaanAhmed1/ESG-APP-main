import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WaterWasteLineChartTranslationService {
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
        console.log('Water Waste Line Chart translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Water Waste Line Chart translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        WATER_WASTE_LINE_CHART: {
          // Chart title and description
          TITLE: "Water & Waste Line Chart",
          SUBTITLE: "Resource Consumption Monitoring",
          
          // Resource types
          WATER_USAGE: "Water Usage",
          WASTE_GENERATION: "Waste Generation",
          WATER_CONSUMPTION: "Water Consumption",
          WASTE_DISPOSAL: "Waste Disposal",
          RECYCLING_RATE: "Recycling Rate",
          WATER_EFFICIENCY: "Water Efficiency",
          
          // Units
          CUBIC_METERS: "m³",
          LITERS: "L",
          TONNES: "t",
          KILOGRAMS: "kg",
          PERCENTAGE: "%",
          GALLONS: "gal",
          
          // Chart labels
          WATER_CONSUMPTION_TREND: "Water Consumption Trend",
          WASTE_GENERATION_TREND: "Waste Generation Trend",
          RESOURCE_MONITORING: "Resource Monitoring",
          SUSTAINABILITY_METRICS: "Sustainability Metrics",
          
          // Status indicators
          STATUS_DECREASING: "Decreasing",
          STATUS_INCREASING: "Increasing",
          STATUS_STABLE: "Stable",
          STATUS_OPTIMAL: "Optimal",
          
          // AI insights
          AI_INSIGHT_WATER_SAVINGS: "Water consumption decreased by 15% compared to last month. Efficiency improvements show positive impact.",
          AI_INSIGHT_WASTE_REDUCTION: "Waste generation reduced by 8% through recycling initiatives. Target of 25% reduction by year-end achievable.",
          AI_INSIGHT_EFFICIENCY: "Water efficiency improved by 12% with new conservation measures. Consider expanding to other facilities.",
          AI_INSIGHT_RECYCLING: "Recycling rate increased to 68%. On track to achieve 75% target by Q4.",
          AI_INSIGHT_ANOMALY: "Unusual spike in water usage detected. Investigate potential leaks or equipment issues.",
          AI_INSIGHT_OPPORTUNITY: "Waste reduction opportunity identified. Process optimization could reduce waste by 15%.",
          
          // Progress indicators
          WATER_CONSERVATION: "Water Conservation",
          WASTE_REDUCTION: "Waste Reduction",
          SUSTAINABILITY_GOALS: "Sustainability Goals",
          
          // Chart legend
          LEGEND_WATER: "Water",
          LEGEND_WASTE: "Waste",
          LEGEND_RECYCLING: "Recycling",
          
          // Tooltip content
          TOOLTIP_MONTH: "Month",
          TOOLTIP_CONSUMPTION: "Consumption",
          TOOLTIP_GENERATION: "Generation",
          TOOLTIP_TOTAL: "Total",
          
          // Footer and data info
          DATA_POWERED_BY: "Data powered by AI/ML",
          LAST_UPDATED: "Last updated",
          REAL_TIME_MONITORING: "Real-time monitoring"
        }
      },
      ar: {
        WATER_WASTE_LINE_CHART: {
          // Chart title and description
          TITLE: "رسم بياني خطي للمياه والنفايات",
          SUBTITLE: "مراقبة استهلاك الموارد",
          
          // Resource types
          WATER_USAGE: "استخدام المياه",
          WASTE_GENERATION: "توليد النفايات",
          WATER_CONSUMPTION: "استهلاك المياه",
          WASTE_DISPOSAL: "التخلص من النفايات",
          RECYCLING_RATE: "معدل إعادة التدوير",
          WATER_EFFICIENCY: "كفاءة المياه",
          
          // Units
          CUBIC_METERS: "م³",
          LITERS: "لتر",
          TONNES: "طن",
          KILOGRAMS: "كجم",
          PERCENTAGE: "%",
          GALLONS: "جالون",
          
          // Chart labels
          WATER_CONSUMPTION_TREND: "اتجاه استهلاك المياه",
          WASTE_GENERATION_TREND: "اتجاه توليد النفايات",
          RESOURCE_MONITORING: "مراقبة الموارد",
          SUSTAINABILITY_METRICS: "مقاييس الاستدامة",
          
          // Status indicators
          STATUS_DECREASING: "تناقص",
          STATUS_INCREASING: "تزايد",
          STATUS_STABLE: "مستقر",
          STATUS_OPTIMAL: "مثالي",
          
          // AI insights
          AI_INSIGHT_WATER_SAVINGS: "انخفض استهلاك المياه بنسبة 15% مقارنة بالشهر الماضي. تظهر تحسينات الكفاءة تأثيراً إيجابياً.",
          AI_INSIGHT_WASTE_REDUCTION: "انخفض توليد النفايات بنسبة 8% من خلال مبادرات إعادة التدوير. الهدف المتمثل في خفض بنسبة 25% بحلول نهاية العام قابل للتحقيق.",
          AI_INSIGHT_EFFICIENCY: "تحسنت كفاءة المياه بنسبة 12% مع تدابير الحفظ الجديدة. فكر في التوسع إلى مرافق أخرى.",
          AI_INSIGHT_RECYCLING: "ارتفع معدل إعادة التدوير إلى 68%. في الطريق لتحقيق هدف 75% بحلول الربع الرابع.",
          AI_INSIGHT_ANOMALY: "تم اكتشاف ارتفاع غير عادي في استخدام المياه. تحقق من التسريبات المحتملة أو مشاكل المعدات.",
          AI_INSIGHT_OPPORTUNITY: "تم تحديد فرصة تقليل النفايات. يمكن أن يقلل تحسين العملية من النفايات بنسبة 15%.",
          
          // Progress indicators
          WATER_CONSERVATION: "حفظ المياه",
          WASTE_REDUCTION: "تقليل النفايات",
          SUSTAINABILITY_GOALS: "أهداف الاستدامة",
          
          // Chart legend
          LEGEND_WATER: "المياه",
          LEGEND_WASTE: "النفايات",
          LEGEND_RECYCLING: "إعادة التدوير",
          
          // Tooltip content
          TOOLTIP_MONTH: "الشهر",
          TOOLTIP_CONSUMPTION: "الاستهلاك",
          TOOLTIP_GENERATION: "التوليد",
          TOOLTIP_TOTAL: "الإجمالي",
          
          // Footer and data info
          DATA_POWERED_BY: "البيانات مدعومة بالذكاء الاصطناعي/التعلم الآلي",
          LAST_UPDATED: "آخر تحديث",
          REAL_TIME_MONITORING: "المراقبة في الوقت الفعلي"
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