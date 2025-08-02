const fs = require('fs');

// List of broken files that need complete rewrite
const brokenFiles = [
  'governance-lead-translation.service.ts',
  'marketing-translation.service.ts',
  'sustainability-translation.service.ts',
  'esg-specialist-translation.service.ts'
];

function createProperTranslationService(serviceName, className) {
  return `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${className} {
  private currentLanguage = 'en';
  private translations: any = {};
  private languageChange$ = new BehaviorSubject<string>('en');

  constructor(private http: HttpClient) {
    this.loadFallbackTranslations();
    this.loadTranslations();
  }

  private async loadTranslations() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('Not in browser environment, using fallback translations');
        return;
      }

      // Load both language files
      const [enTranslations, arTranslations] = await Promise.all([
        this.http.get('../assets/i18n/en.json').toPromise(),
        this.http.get('../assets/i18n/ar.json').toPromise()
      ]);

      // Only update translations if loading was successful
      if (enTranslations && arTranslations) {
        this.translations = {
          en: enTranslations,
          ar: arTranslations
        };
        console.log('${serviceName} translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load ${serviceName} translations from JSON files:', error);
      // Keep using fallback translations that were loaded in constructor
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        ${serviceName.toUpperCase()}: {
          TITLE: "${serviceName} Dashboard",
          WELCOME: "Welcome to ${serviceName}",
          OVERVIEW: "Overview",
          METRICS: "Key Metrics",
          PERFORMANCE: "Performance",
          REPORTS: "Reports",
          ANALYTICS: "Analytics",
          SETTINGS: "Settings"
        },
        NAVIGATION: {
          ENVIRONMENTAL: "Environmental",
          SOCIAL: "Social", 
          GOVERNANCE: "Governance",
          REPORTING: "Reporting",
          INTEGRATIONS: "Integrations",
          COMPLIANCE: "Compliance",
          AI: "AI",
          LOCALIZATION: "Localization",
          SECURITY: "Security",
          UX: "UX"
        }
      },
      ar: {
        ${serviceName.toUpperCase()}: {
          TITLE: "لوحة تحكم ${serviceName}",
          WELCOME: "مرحباً بك في ${serviceName}",
          OVERVIEW: "نظرة عامة",
          METRICS: "المقاييس الرئيسية",
          PERFORMANCE: "الأداء",
          REPORTS: "التقارير",
          ANALYTICS: "التحليلات",
          SETTINGS: "الإعدادات"
        },
        NAVIGATION: {
          ENVIRONMENTAL: "البيئي",
          SOCIAL: "الاجتماعي",
          GOVERNANCE: "الحوكمة",
          REPORTING: "التقارير",
          INTEGRATIONS: "التكاملات",
          COMPLIANCE: "الامتثال",
          AI: "الذكاء الاصطناعي",
          LOCALIZATION: "التوطين",
          SECURITY: "الأمان",
          UX: "تجربة المستخدم"
        }
      }
    };
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getLanguageChange$(): Observable<string> {
    return this.languageChange$.asObservable();
  }

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.languageChange$.next(this.currentLanguage);
  }

  translate(key: string): string {
    try {
      const keys = key.split('.');
      let value = this.translations[this.currentLanguage];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      if (!value) {
        console.warn(\`${serviceName} translation not found for key: \${key} in language: \${this.currentLanguage}\`);
        return key;
      }
      
      return value;
    } catch (error) {
      console.error(\`${serviceName} translation error for key: \${key}\`, error);
      return key;
    }
  }

  isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }

  isTranslationsLoaded(): boolean {
    return Object.keys(this.translations).length > 0;
  }

  getTranslations(): any {
    return this.translations;
  }
}`;
}

function rewriteBrokenServices() {
  console.log('🔧 REWRITING BROKEN TRANSLATION SERVICES...\n');
  
  const serviceConfigs = [
    { file: 'governance-lead-translation.service.ts', name: 'Governance Lead', className: 'GovernanceLeadTranslationService' },
    { file: 'marketing-translation.service.ts', name: 'Marketing', className: 'MarketingTranslationService' },
    { file: 'sustainability-translation.service.ts', name: 'Sustainability', className: 'SustainabilityTranslationService' },
    { file: 'esg-specialist-translation.service.ts', name: 'ESG Specialist', className: 'EsgSpecialistTranslationService' }
  ];
  
  let rewrittenCount = 0;
  let errorCount = 0;
  
  serviceConfigs.forEach(config => {
    const filePath = `src/app/services/${config.file}`;
    
    try {
      const newContent = createProperTranslationService(config.name, config.className);
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Rewritten: ${config.file}`);
      rewrittenCount++;
    } catch (error) {
      console.log(`❌ Error rewriting ${config.file}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Rewrite Summary:`);
  console.log(`✅ Rewritten: ${rewrittenCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 All broken services have been rewritten!`);
}

// Run the rewrite
rewriteBrokenServices(); 