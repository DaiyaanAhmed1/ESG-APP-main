import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SustainabilityRiskSpecialistTranslationService {
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
        console.log('Sustainability Risk Specialist translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load Sustainability Risk Specialist translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        SUSTAINABILITY_RISK_SPECIALIST: {
          // Header and navigation
          PLATFORM_TITLE: "ESG Platform",
          WELCOME_MESSAGE: "Welcome",
          SPECIALIST_ROLE: "Sustainability Risk & Compliance Tech Specialist",
          
          // Hero section
          HERO_TITLE: "Risk & Compliance Technology Dashboard",
          HERO_ROLE: "Sustainability Risk & Compliance Tech Specialist",
          HERO_LEAD: "Empowering you to manage risk, compliance, and technology for a sustainable future.",
          
          // Responsibility cards
          DEVELOPING_TECHNOLOGY_STRATEGIES: "Developing & Implementing Sustainability Technology Strategies",
          DEVELOPING_TECHNOLOGY_STRATEGIES_DESC: "Design and deploy technology solutions that support sustainability goals, such as IoT for energy monitoring, AI for predictive analytics, and cloud-based ESG data platforms.",
          
          ENSURING_COMPLIANCE: "Ensuring Compliance with Sustainability Regulations",
          ENSURING_COMPLIANCE_DESC: "Monitor and ensure adherence to global and local sustainability regulations, automate compliance checks, and maintain audit-ready records.",
          
          MANAGING_RISKS: "Managing Sustainability Risks",
          MANAGING_RISKS_DESC: "Identify, assess, and mitigate risks related to environmental, social, and governance factors using advanced risk management tools and dashboards.",
          
          INTEGRATING_SUSTAINABILITY: "Integrating Sustainability into Business Processes",
          INTEGRATING_SUSTAINABILITY_DESC: "Embed sustainability criteria into procurement, operations, and supply chain management systems for end-to-end ESG integration.",
          
          PROMOTING_TRANSPARENCY: "Promoting Transparency and Reporting",
          PROMOTING_TRANSPARENCY_DESC: "Automate ESG data collection and reporting, generate real-time dashboards, and facilitate transparent communication with stakeholders.",
          
          STAYING_ABREAST_TECHNOLOGIES: "Staying Abreast of Emerging Technologies and Trends",
          STAYING_ABREAST_TECHNOLOGIES_DESC: "Continuously research and evaluate new technologies, such as blockchain for traceability or machine learning for risk prediction, to enhance sustainability initiatives.",
          
          // Technology and tools
          IOT_MONITORING: "IoT Monitoring",
          AI_ANALYTICS: "AI Analytics",
          CLOUD_PLATFORMS: "Cloud Platforms",
          BLOCKCHAIN_TRACEABILITY: "Blockchain Traceability",
          MACHINE_LEARNING: "Machine Learning",
          PREDICTIVE_ANALYTICS: "Predictive Analytics",
          
          // Risk management
          RISK_IDENTIFICATION: "Risk Identification",
          RISK_ASSESSMENT: "Risk Assessment",
          RISK_MITIGATION: "Risk Mitigation",
          ENVIRONMENTAL_RISKS: "Environmental Risks",
          SOCIAL_RISKS: "Social Risks",
          GOVERNANCE_RISKS: "Governance Risks",
          
          // Compliance and regulations
          GLOBAL_REGULATIONS: "Global Regulations",
          LOCAL_REGULATIONS: "Local Regulations",
          COMPLIANCE_CHECKS: "Compliance Checks",
          AUDIT_RECORDS: "Audit Records",
          REGULATORY_ADHERENCE: "Regulatory Adherence",
          
          // Business processes
          PROCUREMENT: "Procurement",
          OPERATIONS: "Operations",
          SUPPLY_CHAIN: "Supply Chain",
          END_TO_END_INTEGRATION: "End-to-End Integration",
          SUSTAINABILITY_CRITERIA: "Sustainability Criteria",
          
          // Reporting and transparency
          DATA_COLLECTION: "Data Collection",
          REAL_TIME_DASHBOARDS: "Real-time Dashboards",
          STAKEHOLDER_COMMUNICATION: "Stakeholder Communication",
          TRANSPARENT_REPORTING: "Transparent Reporting",
          ESG_DATA: "ESG Data",
          
          // Footer
          COPYRIGHT: "© 2024 ESG Platform. All rights reserved.",
          
          // Status and metrics
          STATUS_ACTIVE: "Active",
          STATUS_PENDING: "Pending",
          STATUS_COMPLETED: "Completed",
          STATUS_HIGH_RISK: "High Risk",
          STATUS_MEDIUM_RISK: "Medium Risk",
          STATUS_LOW_RISK: "Low Risk",
          STATUS_COMPLIANT: "Compliant",
          STATUS_NON_COMPLIANT: "Non-Compliant"
        },
        NAVIGATION: {
          DASHBOARD: "Dashboard",
          RISKS: "Risks",
          COMPLIANCE: "Compliance",
          TECHNOLOGY: "Technology",
          REPORTS: "Reports",
          SETTINGS: "Settings",
          LOGOUT: "Logout"
        }
      },
      ar: {
        SUSTAINABILITY_RISK_SPECIALIST: {
          // Header and navigation
          PLATFORM_TITLE: "منصة البيئية والاجتماعية والحوكمية",
          WELCOME_MESSAGE: "مرحباً",
          SPECIALIST_ROLE: "متخصص مخاطر الاستدامة والتقنيات الامتثالية",
          
          // Hero section
          HERO_TITLE: "لوحة تحكم تقنيات المخاطر والامتثال",
          HERO_ROLE: "متخصص مخاطر الاستدامة والتقنيات الامتثالية",
          HERO_LEAD: "تمكينك لإدارة المخاطر والامتثال والتقنيات من أجل مستقبل مستدام.",
          
          // Responsibility cards
          DEVELOPING_TECHNOLOGY_STRATEGIES: "تطوير وتنفيذ استراتيجيات تقنيات الاستدامة",
          DEVELOPING_TECHNOLOGY_STRATEGIES_DESC: "تصميم ونشر حلول تقنية تدعم أهداف الاستدامة، مثل إنترنت الأشياء لمراقبة الطاقة والذكاء الاصطناعي للتحليلات التنبؤية ومنصات البيانات البيئية والاجتماعية والحوكمية السحابية.",
          
          ENSURING_COMPLIANCE: "ضمان الامتثال للوائح الاستدامة",
          ENSURING_COMPLIANCE_DESC: "مراقبة وضمان الالتزام بالوائح العالمية والمحلية للاستدامة وأتمتة فحوصات الامتثال والحفاظ على السجلات الجاهزة للتدقيق.",
          
          MANAGING_RISKS: "إدارة مخاطر الاستدامة",
          MANAGING_RISKS_DESC: "تحديد وتقييم وتخفيف المخاطر المتعلقة بالعوامل البيئية والاجتماعية والحوكمية باستخدام أدوات إدارة المخاطر المتقدمة ولوحات التحكم.",
          
          INTEGRATING_SUSTAINABILITY: "دمج الاستدامة في العمليات التجارية",
          INTEGRATING_SUSTAINABILITY_DESC: "تضمين معايير الاستدامة في أنظمة المشتريات والعمليات وإدارة سلسلة التوريد للدمج الشامل للبيئية والاجتماعية والحوكمية.",
          
          PROMOTING_TRANSPARENCY: "تعزيز الشفافية وإعداد التقارير",
          PROMOTING_TRANSPARENCY_DESC: "أتمتة جمع البيانات البيئية والاجتماعية والحوكمية وإعداد التقارير وإنشاء لوحات تحكم في الوقت الفعلي وتسهيل التواصل الشفاف مع أصحاب المصلحة.",
          
          STAYING_ABREAST_TECHNOLOGIES: "البقاء على اطلاع بالتقنيات والاتجاهات الناشئة",
          STAYING_ABREAST_TECHNOLOGIES_DESC: "البحث والتقييم المستمر للتقنيات الجديدة مثل البلوك تشين للتتبع أو التعلم الآلي للتنبؤ بالمخاطر لتعزيز مبادرات الاستدامة.",
          
          // Technology and tools
          IOT_MONITORING: "مراقبة إنترنت الأشياء",
          AI_ANALYTICS: "تحليلات الذكاء الاصطناعي",
          CLOUD_PLATFORMS: "المنصات السحابية",
          BLOCKCHAIN_TRACEABILITY: "التتبع بالبلوك تشين",
          MACHINE_LEARNING: "التعلم الآلي",
          PREDICTIVE_ANALYTICS: "التحليلات التنبؤية",
          
          // Risk management
          RISK_IDENTIFICATION: "تحديد المخاطر",
          RISK_ASSESSMENT: "تقييم المخاطر",
          RISK_MITIGATION: "تخفيف المخاطر",
          ENVIRONMENTAL_RISKS: "المخاطر البيئية",
          SOCIAL_RISKS: "المخاطر الاجتماعية",
          GOVERNANCE_RISKS: "المخاطر الحوكمية",
          
          // Compliance and regulations
          GLOBAL_REGULATIONS: "الوائح العالمية",
          LOCAL_REGULATIONS: "الوائح المحلية",
          COMPLIANCE_CHECKS: "فحوصات الامتثال",
          AUDIT_RECORDS: "سجلات التدقيق",
          REGULATORY_ADHERENCE: "الالتزام التنظيمي",
          
          // Business processes
          PROCUREMENT: "المشتريات",
          OPERATIONS: "العمليات",
          SUPPLY_CHAIN: "سلسلة التوريد",
          END_TO_END_INTEGRATION: "الدمج الشامل",
          SUSTAINABILITY_CRITERIA: "معايير الاستدامة",
          
          // Reporting and transparency
          DATA_COLLECTION: "جمع البيانات",
          REAL_TIME_DASHBOARDS: "لوحات التحكم في الوقت الفعلي",
          STAKEHOLDER_COMMUNICATION: "تواصل أصحاب المصلحة",
          TRANSPARENT_REPORTING: "التقارير الشفافة",
          ESG_DATA: "البيانات البيئية والاجتماعية والحوكمية",
          
          // Footer
          COPYRIGHT: "© 2024 منصة البيئية والاجتماعية والحوكمية. جميع الحقوق محفوظة.",
          
          // Status and metrics
          STATUS_ACTIVE: "نشط",
          STATUS_PENDING: "قيد الانتظار",
          STATUS_COMPLETED: "مكتمل",
          STATUS_HIGH_RISK: "مخاطر عالية",
          STATUS_MEDIUM_RISK: "مخاطر متوسطة",
          STATUS_LOW_RISK: "مخاطر منخفضة",
          STATUS_COMPLIANT: "متوافق",
          STATUS_NON_COMPLIANT: "غير متوافق"
        },
        NAVIGATION: {
          DASHBOARD: "لوحة التحكم",
          RISKS: "المخاطر",
          COMPLIANCE: "الامتثال",
          TECHNOLOGY: "التقنيات",
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