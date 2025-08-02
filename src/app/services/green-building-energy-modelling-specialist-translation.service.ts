import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GreenBuildingEnergyModellingSpecialistTranslationService {
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
        console.log('Green Building Energy Modelling Specialist translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Green Building Energy Modelling Specialist translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST: {
          // Header and navigation
          PLATFORM_TITLE: "ESG Platform",
          WELCOME_MESSAGE: "Welcome",
          SPECIALIST_ROLE: "Green Building & Energy Modelling Specialist",
          
          // Hero section
          HERO_TITLE: "Green Building & Energy Modelling Dashboard",
          HERO_ROLE: "Green Building & Energy Modelling Specialist",
          HERO_LEAD: "Drive sustainable building design, energy efficiency, and green certification with advanced modelling tools.",
          
          // Feature cards
          BUILDING_ENERGY_SIMULATION: "Building Energy Simulation & Modelling",
          BUILDING_ENERGY_SIMULATION_DESC: "Use advanced software (e.g., EnergyPlus, IESVE) to simulate building energy performance, optimize HVAC, lighting, and envelope design for maximum efficiency.",
          
          GREEN_BUILDING_CERTIFICATION: "Green Building Certification Management",
          GREEN_BUILDING_CERTIFICATION_DESC: "Coordinate and document compliance for LEED, BREEAM, WELL, or local green building certifications, ensuring all credits and prerequisites are met.",
          
          ENERGY_EFFICIENCY_ANALYSIS: "Energy Efficiency Analysis",
          ENERGY_EFFICIENCY_ANALYSIS_DESC: "Analyze energy consumption data, identify inefficiencies, and recommend retrofits or operational changes to reduce energy use and costs.",
          
          SUSTAINABLE_MATERIALS: "Sustainable Materials & Design Integration",
          SUSTAINABLE_MATERIALS_DESC: "Advise on the selection of low-impact materials, passive design strategies, and integration of renewable energy systems into building projects.",
          
          PERFORMANCE_MONITORING: "Performance Monitoring & Reporting",
          PERFORMANCE_MONITORING_DESC: "Implement IoT sensors and dashboards to monitor building performance in real time, and generate reports for stakeholders and certification bodies.",
          
          EMERGING_TECHNOLOGIES: "Researching Emerging Green Technologies",
          EMERGING_TECHNOLOGIES_DESC: "Stay up to date with the latest in green building tech, such as smart glass, advanced insulation, and AI-driven energy management.",
          
          // Building features and metrics
          ENERGY_PERFORMANCE: "Energy Performance",
          HVAC_OPTIMIZATION: "HVAC Optimization",
          LIGHTING_DESIGN: "Lighting Design",
          ENVELOPE_DESIGN: "Envelope Design",
          PASSIVE_DESIGN: "Passive Design",
          RENEWABLE_ENERGY: "Renewable Energy",
          
          // Certification types
          LEED_CERTIFICATION: "LEED Certification",
          BREEAM_CERTIFICATION: "BREEAM Certification",
          WELL_CERTIFICATION: "WELL Certification",
          LOCAL_CERTIFICATION: "Local Certification",
          
          // Analysis and monitoring
          ENERGY_CONSUMPTION: "Energy Consumption",
          EFFICIENCY_ANALYSIS: "Efficiency Analysis",
          RETROFIT_RECOMMENDATIONS: "Retrofit Recommendations",
          OPERATIONAL_CHANGES: "Operational Changes",
          REAL_TIME_MONITORING: "Real-time Monitoring",
          PERFORMANCE_REPORTS: "Performance Reports",
          
          // Materials and technologies
          LOW_IMPACT_MATERIALS: "Low-impact Materials",
          SMART_GLASS: "Smart Glass",
          ADVANCED_INSULATION: "Advanced Insulation",
          AI_ENERGY_MANAGEMENT: "AI-driven Energy Management",
          
          // Footer
          COPYRIGHT: "© 2024 ESG Platform. All rights reserved.",
          
          // Status and metrics
          STATUS_ACTIVE: "Active",
          STATUS_PENDING: "Pending",
          STATUS_COMPLETED: "Completed",
          STATUS_OPTIMIZED: "Optimized",
          STATUS_EFFICIENT: "Efficient",
          STATUS_CERTIFIED: "Certified"
        },
        NAVIGATION: {
          DASHBOARD: "Dashboard",
          BUILDINGS: "Buildings",
          ENERGY_MODELS: "Energy Models",
          CERTIFICATIONS: "Certifications",
          ANALYTICS: "Analytics",
          REPORTS: "Reports",
          SETTINGS: "Settings",
          LOGOUT: "Logout"
        }
      },
      ar: {
        GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST: {
          // Header and navigation
          PLATFORM_TITLE: "منصة البيئية والاجتماعية والحوكمية",
          WELCOME_MESSAGE: "مرحباً",
          SPECIALIST_ROLE: "متخصص المباني الخضراء ونمذجة الطاقة",
          
          // Hero section
          HERO_TITLE: "لوحة تحكم المباني الخضراء ونمذجة الطاقة",
          HERO_ROLE: "متخصص المباني الخضراء ونمذجة الطاقة",
          HERO_LEAD: "قيادة تصميم المباني المستدامة وكفاءة الطاقة والشهادات الخضراء باستخدام أدوات النمذجة المتقدمة.",
          
          // Feature cards
          BUILDING_ENERGY_SIMULATION: "محاكاة ونمذجة طاقة المباني",
          BUILDING_ENERGY_SIMULATION_DESC: "استخدم البرامج المتقدمة (مثل EnergyPlus, IESVE) لمحاكاة أداء طاقة المباني وتحسين التكييف والإضاءة وتصميم الغلاف الخارجي لأقصى كفاءة.",
          
          GREEN_BUILDING_CERTIFICATION: "إدارة شهادات المباني الخضراء",
          GREEN_BUILDING_CERTIFICATION_DESC: "تنسيق وتوثيق الامتثال لشهادات LEED و BREEAM و WELL أو الشهادات المحلية للمباني الخضراء، مع ضمان تحقيق جميع النقاط والمتطلبات الأساسية.",
          
          ENERGY_EFFICIENCY_ANALYSIS: "تحليل كفاءة الطاقة",
          ENERGY_EFFICIENCY_ANALYSIS_DESC: "تحليل بيانات استهلاك الطاقة وتحديد أوجه عدم الكفاءة والتوصية بالتحديثات أو التغييرات التشغيلية لتقليل استخدام الطاقة والتكاليف.",
          
          SUSTAINABLE_MATERIALS: "المواد المستدامة وتكامل التصميم",
          SUSTAINABLE_MATERIALS_DESC: "تقديم المشورة بشأن اختيار المواد منخفضة التأثير واستراتيجيات التصميم السلبي وتكامل أنظمة الطاقة المتجددة في مشاريع المباني.",
          
          PERFORMANCE_MONITORING: "مراقبة الأداء وإعداد التقارير",
          PERFORMANCE_MONITORING_DESC: "تنفيذ أجهزة استشعار إنترنت الأشياء ولوحات التحكم لمراقبة أداء المباني في الوقت الفعلي وإعداد تقارير لأصحاب المصلحة وهيئات الشهادات.",
          
          EMERGING_TECHNOLOGIES: "البحث في التقنيات الخضراء الناشئة",
          EMERGING_TECHNOLOGIES_DESC: "البقاء على اطلاع بأحدث تقنيات المباني الخضراء مثل الزجاج الذكي والعزل المتقدم وإدارة الطاقة المدعومة بالذكاء الاصطناعي.",
          
          // Building features and metrics
          ENERGY_PERFORMANCE: "أداء الطاقة",
          HVAC_OPTIMIZATION: "تحسين التكييف",
          LIGHTING_DESIGN: "تصميم الإضاءة",
          ENVELOPE_DESIGN: "تصميم الغلاف الخارجي",
          PASSIVE_DESIGN: "التصميم السلبي",
          RENEWABLE_ENERGY: "الطاقة المتجددة",
          
          // Certification types
          LEED_CERTIFICATION: "شهادة LEED",
          BREEAM_CERTIFICATION: "شهادة BREEAM",
          WELL_CERTIFICATION: "شهادة WELL",
          LOCAL_CERTIFICATION: "الشهادة المحلية",
          
          // Analysis and monitoring
          ENERGY_CONSUMPTION: "استهلاك الطاقة",
          EFFICIENCY_ANALYSIS: "تحليل الكفاءة",
          RETROFIT_RECOMMENDATIONS: "توصيات التحديث",
          OPERATIONAL_CHANGES: "التغييرات التشغيلية",
          REAL_TIME_MONITORING: "المراقبة في الوقت الفعلي",
          PERFORMANCE_REPORTS: "تقارير الأداء",
          
          // Materials and technologies
          LOW_IMPACT_MATERIALS: "المواد منخفضة التأثير",
          SMART_GLASS: "الزجاج الذكي",
          ADVANCED_INSULATION: "العزل المتقدم",
          AI_ENERGY_MANAGEMENT: "إدارة الطاقة المدعومة بالذكاء الاصطناعي",
          
          // Footer
          COPYRIGHT: "© 2024 منصة البيئية والاجتماعية والحوكمية. جميع الحقوق محفوظة.",
          
          // Status and metrics
          STATUS_ACTIVE: "نشط",
          STATUS_PENDING: "قيد الانتظار",
          STATUS_COMPLETED: "مكتمل",
          STATUS_OPTIMIZED: "محسن",
          STATUS_EFFICIENT: "كفء",
          STATUS_CERTIFIED: "معتمد"
        },
        NAVIGATION: {
          DASHBOARD: "لوحة التحكم",
          BUILDINGS: "المباني",
          ENERGY_MODELS: "نماذج الطاقة",
          CERTIFICATIONS: "الشهادات",
          ANALYTICS: "التحليلات",
          REPORTS: "التقارير",
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