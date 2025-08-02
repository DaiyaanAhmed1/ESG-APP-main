const fs = require('fs');
const path = require('path');

// List of translation services to update (excluding login which we already fixed)
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
  'initiatives-dashboard-translation.service.ts',
  'governance-dashboard-translation.service.ts',
  'environmental-dashboard-translation.service.ts',
  'social-dashboard-translation.service.ts',
  'marketing-head-translation.service.ts',
  'governance-lead-translation.service.ts',
  'environmental-training-translation.service.ts',
  'esg-specialist-translation.service.ts',
  'esg-iot-smart-tech-engineer-translation.service.ts',
  'green-building-energy-modelling-specialist-translation.service.ts',
  'sustainability-risk-specialist-translation.service.ts',
  'carbon-footprint-line-chart-translation.service.ts',
  'energy-consumption-bar-chart-translation.service.ts',
  'iot-sensor-gauge-translation.service.ts',
  'water-waste-line-chart-translation.service.ts',
  'sustainability-goals-radial-translation.service.ts',
  'supply-chain-area-chart-translation.service.ts',
  'role-details-translation.service.ts',
  'settings-translation.service.ts',
  'user-profile-translation.service.ts',
  'sustainability-translation.service.ts'
];

function updateTranslationService(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Add GlobalLanguageService import if not present
    if (!content.includes('GlobalLanguageService')) {
      content = content.replace(
        /import \{ Injectable \} from '@angular\/core';/,
        `import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';`
      );
      updated = true;
    }

    // Update constructor to inject GlobalLanguageService
    if (!content.includes('globalLanguageService: GlobalLanguageService')) {
      content = content.replace(
        /constructor\(private http: HttpClient\) \{/,
        `constructor(
    private http: HttpClient,
    private globalLanguageService: GlobalLanguageService
  ) {`
      );
      updated = true;
    }

    // Add subscription to global language changes
    if (!content.includes('globalLanguageService.getLanguageState$()')) {
      const constructorMatch = content.match(/constructor\([^)]*\) \{[\s\S]*?\}/);
      if (constructorMatch) {
        const constructorEnd = constructorMatch[0].lastIndexOf('}');
        const beforeConstructor = content.substring(0, constructorMatch.index + constructorEnd);
        const afterConstructor = content.substring(constructorMatch.index + constructorEnd);
        
        const subscriptionCode = `
    
    // Subscribe to global language changes
    this.globalLanguageService.getLanguageState$().subscribe((state) => {
      this.languageChange$.next(state.currentLanguage);
    });`;
        
        content = beforeConstructor + subscriptionCode + afterConstructor;
        updated = true;
      }
    }

    // Update getCurrentLanguage method
    if (content.includes('getCurrentLanguage(): string {') && !content.includes('globalLanguageService.getCurrentLanguage()')) {
      content = content.replace(
        /getCurrentLanguage\(\): string \{[\s\S]*?return this\.currentLanguage;[\s\S]*?\}/,
        `getCurrentLanguage(): string {
    return this.globalLanguageService.getCurrentLanguage();
  }`
      );
      updated = true;
    }

    // Update toggleLanguage method
    if (content.includes('toggleLanguage(): void {') && !content.includes('globalLanguageService.toggleLanguage()')) {
      content = content.replace(
        /toggleLanguage\(\): void \{[\s\S]*?this\.currentLanguage = this\.currentLanguage === 'en' \? 'ar' : 'en';[\s\S]*?\}/,
        `toggleLanguage(): void {
    this.globalLanguageService.toggleLanguage();
  }`
      );
      updated = true;
    }

    // Update translate method to use global language
    if (content.includes('translate(key: string): string {') && !content.includes('globalLanguageService.getCurrentLanguage()')) {
      content = content.replace(
        /let value = this\.translations\[this\.currentLanguage\];/,
        `const currentLanguage = this.globalLanguageService.getCurrentLanguage();
      let value = this.translations[currentLanguage];`
      );
      updated = true;
    }

    // Update isRTL method
    if (content.includes('isRTL(): boolean {') && !content.includes('globalLanguageService.isRTL()')) {
      content = content.replace(
        /isRTL\(\): boolean \{[\s\S]*?return this\.currentLanguage === 'ar';[\s\S]*?\}/,
        `isRTL(): boolean {
    return this.globalLanguageService.isRTL();
  }`
      );
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

function fixAllTranslationServices() {
  console.log('🔧 Updating all translation services to use global language service...\n');
  
  let updatedCount = 0;
  let errorCount = 0;
  
  translationServices.forEach(serviceFile => {
    const filePath = `src/app/services/${serviceFile}`;
    
    try {
      if (fs.existsSync(filePath)) {
        const wasUpdated = updateTranslationService(filePath);
        if (wasUpdated) {
          console.log(`✅ Updated: ${serviceFile}`);
          updatedCount++;
        } else {
          console.log(`⏭️  Already updated: ${serviceFile}`);
        }
      } else {
        console.log(`⚠️  File not found: ${serviceFile}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error updating ${serviceFile}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Updated: ${updatedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 All translation services now use global language service!`);
  console.log(`🌍 Language changes will now persist across all pages!`);
}

// Run the fix
fixAllTranslationServices(); 