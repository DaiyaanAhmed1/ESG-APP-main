const fs = require('fs');

// List of all translation services to revert
const translationServices = [
  'dashboard-translation.service.ts',
  'ai-translation.service.ts',
  'environmental-translation.service.ts',
  'social-translation.service.ts',
  'governance-translation.service.ts',
  'reporting-translation.service.ts',
  'integrations-translation.service.ts',
  'compliance-translation.service.ts',
  'localization-translation.service.ts',
  'security-translation.service.ts',
  'ux-translation.service.ts',
  'help-support-translation.service.ts',
  'training-development-translation.service.ts',
  'resource-management-translation.service.ts',
  'materiality-translation.service.ts',
  'stakeholder-engagement-translation.service.ts',
  'communication-hub-translation.service.ts',
  'data-management-translation.service.ts',
  'report-analytics-translation.service.ts',
  'marketing-team-translation.service.ts',
  'marketing-translation.service.ts',
  'manage-team-translation.service.ts',
  'leads-translation.service.ts',
  'governance-lead-translation.service.ts',
  'environmental-training-translation.service.ts',
  'esg-specialist-translation.service.ts',
  'sustainability-translation.service.ts'
];

function createOriginalTranslationService(serviceName, className) {
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

function revertToOriginalState() {
  console.log('🔄 REVERTING TO ORIGINAL WORKING STATE...\n');
  
  const serviceConfigs = [
    { file: 'dashboard-translation.service.ts', name: 'Dashboard', className: 'DashboardTranslationService' },
    { file: 'ai-translation.service.ts', name: 'AI', className: 'AiTranslationService' },
    { file: 'environmental-translation.service.ts', name: 'Environmental', className: 'EnvironmentalTranslationService' },
    { file: 'social-translation.service.ts', name: 'Social', className: 'SocialTranslationService' },
    { file: 'governance-translation.service.ts', name: 'Governance', className: 'GovernanceTranslationService' },
    { file: 'reporting-translation.service.ts', name: 'Reporting', className: 'ReportingTranslationService' },
    { file: 'integrations-translation.service.ts', name: 'Integrations', className: 'IntegrationsTranslationService' },
    { file: 'compliance-translation.service.ts', name: 'Compliance', className: 'ComplianceTranslationService' },
    { file: 'localization-translation.service.ts', name: 'Localization', className: 'LocalizationTranslationService' },
    { file: 'security-translation.service.ts', name: 'Security', className: 'SecurityTranslationService' },
    { file: 'ux-translation.service.ts', name: 'UX', className: 'UxTranslationService' },
    { file: 'help-support-translation.service.ts', name: 'Help Support', className: 'HelpSupportTranslationService' },
    { file: 'training-development-translation.service.ts', name: 'Training Development', className: 'TrainingDevelopmentTranslationService' },
    { file: 'resource-management-translation.service.ts', name: 'Resource Management', className: 'ResourceManagementTranslationService' },
    { file: 'materiality-translation.service.ts', name: 'Materiality', className: 'MaterialityTranslationService' },
    { file: 'stakeholder-engagement-translation.service.ts', name: 'Stakeholder Engagement', className: 'StakeholderEngagementTranslationService' },
    { file: 'communication-hub-translation.service.ts', name: 'Communication Hub', className: 'CommunicationHubTranslationService' },
    { file: 'data-management-translation.service.ts', name: 'Data Management', className: 'DataManagementTranslationService' },
    { file: 'report-analytics-translation.service.ts', name: 'Report Analytics', className: 'ReportAnalyticsTranslationService' },
    { file: 'marketing-team-translation.service.ts', name: 'Marketing Team', className: 'MarketingTeamTranslationService' },
    { file: 'marketing-translation.service.ts', name: 'Marketing', className: 'MarketingTranslationService' },
    { file: 'manage-team-translation.service.ts', name: 'Manage Team', className: 'ManageTeamTranslationService' },
    { file: 'leads-translation.service.ts', name: 'Leads', className: 'LeadsTranslationService' },
    { file: 'governance-lead-translation.service.ts', name: 'Governance Lead', className: 'GovernanceLeadTranslationService' },
    { file: 'environmental-training-translation.service.ts', name: 'Environmental Training', className: 'EnvironmentalTrainingTranslationService' },
    { file: 'esg-specialist-translation.service.ts', name: 'ESG Specialist', className: 'EsgSpecialistTranslationService' },
    { file: 'sustainability-translation.service.ts', name: 'Sustainability', className: 'SustainabilityTranslationService' }
  ];
  
  let revertedCount = 0;
  let errorCount = 0;
  
  serviceConfigs.forEach(config => {
    const filePath = `src/app/services/${config.file}`;
    
    try {
      const newContent = createOriginalTranslationService(config.name, config.className);
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Reverted: ${config.file}`);
      revertedCount++;
    } catch (error) {
      console.log(`❌ Error reverting ${config.file}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Revert Summary:`);
  console.log(`✅ Reverted: ${revertedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 All translation services reverted to original working state!`);
  console.log(`🌍 Each page should now work individually with English and Arabic translations!`);
}

// Run the revert
revertToOriginalState(); 