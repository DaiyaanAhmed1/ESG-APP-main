const fs = require('fs');

// List of files that might have errors
const filesToCheck = [
  'src/app/services/dashboard-translation.service.ts',
  'src/app/services/ai-translation.service.ts',
  'src/app/services/social-translation.service.ts',
  'src/app/services/governance-translation.service.ts',
  'src/app/services/reporting-translation.service.ts',
  'src/app/services/integrations-translation.service.ts',
  'src/app/services/compliance-translation.service.ts',
  'src/app/services/localization-translation.service.ts',
  'src/app/services/security-translation.service.ts',
  'src/app/services/ux-translation.service.ts',
  'src/app/services/help-support-translation.service.ts',
  'src/app/services/training-development-translation.service.ts',
  'src/app/services/resource-management-translation.service.ts',
  'src/app/services/materiality-translation.service.ts',
  'src/app/services/stakeholder-engagement-translation.service.ts',
  'src/app/services/communication-hub-translation.service.ts',
  'src/app/services/data-management-translation.service.ts',
  'src/app/services/report-analytics-translation.service.ts',
  'src/app/services/marketing-translation.service.ts',
  'src/app/services/manage-team-translation.service.ts',
  'src/app/services/leads-translation.service.ts',
  'src/app/services/governance-lead-translation.service.ts',
  'src/app/services/environmental-training-translation.service.ts',
  'src/app/services/esg-specialist-translation.service.ts'
];

function fixTranslationService(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Fix 1: Remove problematic subscription code that might cause errors
    if (content.includes('globalLanguageService.getLanguageState$().subscribe')) {
      content = content.replace(
        /\s*\/\/ Subscribe to global language changes[\s\S]*?this\.languageChange\$\.next\(state\.currentLanguage\);[\s\S]*?\}\);[\s]*/g,
        ''
      );
      updated = true;
    }

    // Fix 2: Simplify the constructor to avoid circular dependencies
    if (content.includes('globalLanguageService: GlobalLanguageService')) {
      content = content.replace(
        /constructor\([\s\S]*?private globalLanguageService: GlobalLanguageService[\s\S]*?\) \{[\s\S]*?\}/g,
        `constructor(private http: HttpClient) {
    this.loadFallbackTranslations();
    this.loadTranslations();
  }`
      );
      updated = true;
    }

    // Fix 3: Remove GlobalLanguageService import if causing issues
    if (content.includes('import { GlobalLanguageService }')) {
      content = content.replace(
        /import { GlobalLanguageService } from '\.\/global-language\.service';[\s]*/g,
        ''
      );
      updated = true;
    }

    // Fix 4: Restore original methods if they were broken
    if (content.includes('globalLanguageService.getCurrentLanguage()')) {
      content = content.replace(
        /getCurrentLanguage\(\): string \{[\s\S]*?return this\.globalLanguageService\.getCurrentLanguage\(\);[\s\S]*?\}/g,
        `getCurrentLanguage(): string {
    return this.currentLanguage;
  }`
      );
      updated = true;
    }

    if (content.includes('globalLanguageService.toggleLanguage()')) {
      content = content.replace(
        /toggleLanguage\(\): void \{[\s\S]*?this\.globalLanguageService\.toggleLanguage\(\);[\s\S]*?\}/g,
        `toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.languageChange$.next(this.currentLanguage);
  }`
      );
      updated = true;
    }

    if (content.includes('globalLanguageService.isRTL()')) {
      content = content.replace(
        /isRTL\(\): boolean \{[\s\S]*?return this\.globalLanguageService\.isRTL\(\);[\s\S]*?\}/g,
        `isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }`
      );
      updated = true;
    }

    // Fix 5: Restore original translate method
    if (content.includes('globalLanguageService.getCurrentLanguage()')) {
      content = content.replace(
        /const currentLanguage = this\.globalLanguageService\.getCurrentLanguage\(\);[\s]*let value = this\.translations\[currentLanguage\];/g,
        `let value = this.translations[this.currentLanguage];`
      );
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function quickFix() {
  console.log('🚨 QUICK FIX: Reverting problematic changes...\n');
  
  let fixedCount = 0;
  let errorCount = 0;
  
  filesToCheck.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        const wasFixed = fixTranslationService(filePath);
        if (wasFixed) {
          console.log(`✅ Fixed: ${filePath.split('/').pop()}`);
          fixedCount++;
        } else {
          console.log(`⏭️  No changes needed: ${filePath.split('/').pop()}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error fixing ${filePath.split('/').pop()}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Quick Fix Summary:`);
  console.log(`✅ Fixed: ${fixedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 Errors should be resolved! Try running npm start again.`);
}

// Run the quick fix
quickFix(); 