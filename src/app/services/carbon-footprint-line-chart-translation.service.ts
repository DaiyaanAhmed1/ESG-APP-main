import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarbonFootprintLineChartTranslationService {
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
        console.log('Carbon Footprint Line Chart translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Carbon Footprint Line Chart translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        CARBON_FOOTPRINT_LINE_CHART: {
          // Chart title and description
          TITLE: "Carbon Footprint Area Chart (Scope 1, 2, 3)",
          SUBTITLE: "Environmental Impact Monitoring",
          
          // Scope labels
          SCOPE_1: "Scope 1",
          SCOPE_2: "Scope 2",
          SCOPE_3: "Scope 3",
          SCOPE_1_DESC: "Direct emissions from owned sources",
          SCOPE_2_DESC: "Indirect emissions from purchased energy",
          SCOPE_3_DESC: "Indirect emissions from value chain",
          
          // Chart labels and units
          TONNES_CO2_EQUIVALENT: "tCO₂e",
          CARBON_EMISSIONS: "Carbon Emissions",
          ENVIRONMENTAL_IMPACT: "Environmental Impact",
          
          // Progress indicators
          EMISSIONS_REDUCTION: "Emissions Reduction",
          CARBON_NEUTRALITY: "Carbon Neutrality",
          SUSTAINABILITY_GOALS: "Sustainability Goals",
          
          // AI insights
          AI_INSIGHT_REDUCTION: "Carbon emissions show 12% reduction compared to last year. Scope 3 emissions decreased by 8% due to supplier optimization.",
          AI_INSIGHT_TREND: "Emissions trend indicates seasonal variation. Winter months show 15% higher Scope 1 emissions.",
          AI_INSIGHT_OPTIMIZATION: "Scope 2 emissions reduced by 20% through renewable energy adoption. Consider expanding solar initiatives.",
          AI_INSIGHT_TARGET: "On track to achieve 25% emissions reduction by 2025. Current progress: 18% complete.",
          AI_INSIGHT_ANOMALY: "Unusual spike in Scope 1 emissions detected. Investigate potential equipment efficiency issues.",
          AI_INSIGHT_OPPORTUNITY: "Scope 3 optimization opportunity identified. Supplier engagement could reduce emissions by 12%.",
          
          // Status and metrics
          STATUS_DECREASING: "Decreasing",
          STATUS_INCREASING: "Increasing",
          STATUS_STABLE: "Stable",
          STATUS_CRITICAL: "Critical",
          
          // Chart legend
          LEGEND_SCOPE_1: "Scope 1",
          LEGEND_SCOPE_2: "Scope 2",
          LEGEND_SCOPE_3: "Scope 3",
          
          // Tooltip content
          TOOLTIP_MONTH: "Month",
          TOOLTIP_EMISSIONS: "Emissions",
          TOOLTIP_TOTAL: "Total",
          
          // Footer and data info
          DATA_POWERED_BY: "Data powered by AI/ML",
          LAST_UPDATED: "Last updated",
          REAL_TIME_MONITORING: "Real-time monitoring"
        }
      },
      ar: {
        CARBON_FOOTPRINT_LINE_CHART: {
          // Chart title and description
          TITLE: "رسم بياني لمنطقة البصمة الكربونية (النطاق 1، 2، 3)",
          SUBTITLE: "مراقبة التأثير البيئي",
          
          // Scope labels
          SCOPE_1: "النطاق 1",
          SCOPE_2: "النطاق 2",
          SCOPE_3: "النطاق 3",
          SCOPE_1_DESC: "الانبعاثات المباشرة من المصادر المملوكة",
          SCOPE_2_DESC: "الانبعاثات غير المباشرة من الطاقة المشتراة",
          SCOPE_3_DESC: "الانبعاثات غير المباشرة من سلسلة القيمة",
          
          // Chart labels and units
          TONNES_CO2_EQUIVALENT: "طن مكافئ CO₂",
          CARBON_EMISSIONS: "انبعاثات الكربون",
          ENVIRONMENTAL_IMPACT: "التأثير البيئي",
          
          // Progress indicators
          EMISSIONS_REDUCTION: "تقليل الانبعاثات",
          CARBON_NEUTRALITY: "حياد الكربون",
          SUSTAINABILITY_GOALS: "أهداف الاستدامة",
          
          // AI insights
          AI_INSIGHT_REDUCTION: "تظهر انبعاثات الكربون انخفاضاً بنسبة 12% مقارنة بالعام الماضي. انخفضت انبعاثات النطاق 3 بنسبة 8% بسبب تحسين الموردين.",
          AI_INSIGHT_TREND: "يشير اتجاه الانبعاثات إلى تباين موسمي. تظهر أشهر الشتاء انبعاثات أعلى بنسبة 15% في النطاق 1.",
          AI_INSIGHT_OPTIMIZATION: "انخفضت انبعاثات النطاق 2 بنسبة 20% من خلال اعتماد الطاقة المتجددة. فكر في توسيع مبادرات الطاقة الشمسية.",
          AI_INSIGHT_TARGET: "في الطريق لتحقيق انخفاض بنسبة 25% في الانبعاثات بحلول عام 2025. التقدم الحالي: 18% مكتمل.",
          AI_INSIGHT_ANOMALY: "تم اكتشاف ارتفاع غير عادي في انبعاثات النطاق 1. تحقق من مشاكل كفاءة المعدات المحتملة.",
          AI_INSIGHT_OPPORTUNITY: "تم تحديد فرصة تحسين النطاق 3. يمكن أن يقلل التعامل مع الموردين من الانبعاثات بنسبة 12%.",
          
          // Status and metrics
          STATUS_DECREASING: "تناقص",
          STATUS_INCREASING: "تزايد",
          STATUS_STABLE: "مستقر",
          STATUS_CRITICAL: "حرج",
          
          // Chart legend
          LEGEND_SCOPE_1: "النطاق 1",
          LEGEND_SCOPE_2: "النطاق 2",
          LEGEND_SCOPE_3: "النطاق 3",
          
          // Tooltip content
          TOOLTIP_MONTH: "الشهر",
          TOOLTIP_EMISSIONS: "الانبعاثات",
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