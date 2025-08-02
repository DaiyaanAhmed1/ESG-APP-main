import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainAreaChartTranslationService {
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
        console.log('Supply Chain Area Chart translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Supply Chain Area Chart translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        SUPPLY_CHAIN_AREA_CHART: {
          // Chart title and description
          TITLE: "Supply Chain Area Chart",
          SUBTITLE: "Logistics & Emissions Monitoring",
          
          // Supply chain categories
          TRANSPORTATION: "Transportation",
          MANUFACTURING: "Manufacturing",
          WAREHOUSING: "Warehousing",
          DISTRIBUTION: "Distribution",
          LOGISTICS: "Logistics",
          SUPPLIER_NETWORK: "Supplier Network",
          
          // Emissions and metrics
          CARBON_EMISSIONS: "Carbon Emissions",
          LOGISTICS_COSTS: "Logistics Costs",
          DELIVERY_TIMES: "Delivery Times",
          SUPPLY_CHAIN_EFFICIENCY: "Supply Chain Efficiency",
          ENVIRONMENTAL_IMPACT: "Environmental Impact",
          
          // Units
          TONNES_CO2: "tCO₂",
          PERCENTAGE: "%",
          DAYS: "days",
          KILOMETERS: "km",
          DOLLARS: "$",
          
          // Chart labels
          SUPPLY_CHAIN_EMISSIONS: "Supply Chain Emissions",
          LOGISTICS_PERFORMANCE: "Logistics Performance",
          CARBON_FOOTPRINT: "Carbon Footprint",
          OPERATIONAL_METRICS: "Operational Metrics",
          
          // Status indicators
          STATUS_OPTIMIZED: "Optimized",
          STATUS_EFFICIENT: "Efficient",
          STATUS_AVERAGE: "Average",
          STATUS_NEEDS_IMPROVEMENT: "Needs Improvement",
          STATUS_CRITICAL: "Critical",
          
          // AI insights
          AI_INSIGHT_OPTIMIZATION: "Supply chain emissions reduced by 18% through route optimization. Logistics costs decreased by 12%.",
          AI_INSIGHT_EFFICIENCY: "Warehousing efficiency improved by 15%. Consider expanding automated systems to reduce carbon footprint.",
          AI_INSIGHT_SUPPLIERS: "Supplier network optimization shows 22% reduction in delivery times. Carbon emissions per shipment down 8%.",
          AI_INSIGHT_TRANSPORT: "Transportation emissions decreased by 14% with electric vehicle adoption. On track for 25% reduction target.",
          AI_INSIGHT_DISTRIBUTION: "Distribution network optimization reduces carbon footprint by 16%. Consider regional distribution centers.",
          AI_INSIGHT_MANUFACTURING: "Manufacturing emissions show 11% reduction. Supply chain transparency initiatives showing positive results.",
          
          // Progress indicators
          EMISSIONS_REDUCTION: "Emissions Reduction",
          LOGISTICS_OPTIMIZATION: "Logistics Optimization",
          SUPPLY_CHAIN_GOALS: "Supply Chain Goals",
          
          // Chart legend
          LEGEND_TRANSPORTATION: "Transportation",
          LEGEND_MANUFACTURING: "Manufacturing",
          LEGEND_WAREHOUSING: "Warehousing",
          LEGEND_DISTRIBUTION: "Distribution",
          
          // Tooltip content
          TOOLTIP_MONTH: "Month",
          TOOLTIP_EMISSIONS: "Emissions",
          TOOLTIP_COSTS: "Costs",
          TOOLTIP_TOTAL: "Total",
          
          // Footer and data info
          DATA_POWERED_BY: "Data powered by AI/ML",
          LAST_UPDATED: "Last updated",
          REAL_TIME_MONITORING: "Real-time monitoring"
        }
      },
      ar: {
        SUPPLY_CHAIN_AREA_CHART: {
          // Chart title and description
          TITLE: "رسم بياني لمنطقة سلسلة التوريد",
          SUBTITLE: "مراقبة اللوجستيات والانبعاثات",
          
          // Supply chain categories
          TRANSPORTATION: "النقل",
          MANUFACTURING: "التصنيع",
          WAREHOUSING: "التخزين",
          DISTRIBUTION: "التوزيع",
          LOGISTICS: "اللوجستيات",
          SUPPLIER_NETWORK: "شبكة الموردين",
          
          // Emissions and metrics
          CARBON_EMISSIONS: "انبعاثات الكربون",
          LOGISTICS_COSTS: "تكاليف اللوجستيات",
          DELIVERY_TIMES: "أوقات التسليم",
          SUPPLY_CHAIN_EFFICIENCY: "كفاءة سلسلة التوريد",
          ENVIRONMENTAL_IMPACT: "التأثير البيئي",
          
          // Units
          TONNES_CO2: "طن CO₂",
          PERCENTAGE: "%",
          DAYS: "أيام",
          KILOMETERS: "كم",
          DOLLARS: "$",
          
          // Chart labels
          SUPPLY_CHAIN_EMISSIONS: "انبعاثات سلسلة التوريد",
          LOGISTICS_PERFORMANCE: "أداء اللوجستيات",
          CARBON_FOOTPRINT: "البصمة الكربونية",
          OPERATIONAL_METRICS: "المقاييس التشغيلية",
          
          // Status indicators
          STATUS_OPTIMIZED: "محسن",
          STATUS_EFFICIENT: "كفء",
          STATUS_AVERAGE: "متوسط",
          STATUS_NEEDS_IMPROVEMENT: "يحتاج تحسين",
          STATUS_CRITICAL: "حرج",
          
          // AI insights
          AI_INSIGHT_OPTIMIZATION: "انخفضت انبعاثات سلسلة التوريد بنسبة 18% من خلال تحسين المسارات. انخفضت تكاليف اللوجستيات بنسبة 12%.",
          AI_INSIGHT_EFFICIENCY: "تحسنت كفاءة التخزين بنسبة 15%. فكر في توسيع الأنظمة الآلية لتقليل البصمة الكربونية.",
          AI_INSIGHT_SUPPLIERS: "يظهر تحسين شبكة الموردين انخفاضاً بنسبة 22% في أوقات التسليم. انبعاثات الكربون لكل شحنة انخفضت بنسبة 8%.",
          AI_INSIGHT_TRANSPORT: "انخفضت انبعاثات النقل بنسبة 14% مع اعتماد المركبات الكهربائية. في الطريق لتحقيق هدف خفض بنسبة 25%.",
          AI_INSIGHT_DISTRIBUTION: "تحسين شبكة التوزيع يقلل البصمة الكربونية بنسبة 16%. فكر في مراكز التوزيع الإقليمية.",
          AI_INSIGHT_MANUFACTURING: "تظهر انبعاثات التصنيع انخفاضاً بنسبة 11%. مبادرات شفافية سلسلة التوريد تظهر نتائج إيجابية.",
          
          // Progress indicators
          EMISSIONS_REDUCTION: "تقليل الانبعاثات",
          LOGISTICS_OPTIMIZATION: "تحسين اللوجستيات",
          SUPPLY_CHAIN_GOALS: "أهداف سلسلة التوريد",
          
          // Chart legend
          LEGEND_TRANSPORTATION: "النقل",
          LEGEND_MANUFACTURING: "التصنيع",
          LEGEND_WAREHOUSING: "التخزين",
          LEGEND_DISTRIBUTION: "التوزيع",
          
          // Tooltip content
          TOOLTIP_MONTH: "الشهر",
          TOOLTIP_EMISSIONS: "الانبعاثات",
          TOOLTIP_COSTS: "التكاليف",
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