const fs = require('fs');

// List of all translation services that need to be restored
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

function restoreTranslationService(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    // Read the original file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix 1: Remove any broken GlobalLanguageService imports
    content = content.replace(/import \{ GlobalLanguageService \} from '\.\/global-language\.service';[\s]*/g, '');
    content = content.replace(/import \{ map \} from 'rxjs\/operators';[\s]*/g, '');
    
    // Fix 2: Restore proper constructor
    content = content.replace(
      /constructor\([\s\S]*?private globalLanguageService: GlobalLanguageService[\s\S]*?\) \{[\s\S]*?\}/g,
      `constructor(private http: HttpClient) {
    this.loadFallbackTranslations();
    this.loadTranslations();
  }`
    );
    
    // Fix 3: Remove any broken subscription code
    content = content.replace(
      /\s*\/\/ Subscribe to global language changes[\s\S]*?this\.languageChange\$\.next\(state\.currentLanguage\);[\s\S]*?\}\);[\s]*/g,
      ''
    );
    
    // Fix 4: Restore getCurrentLanguage method
    content = content.replace(
      /getCurrentLanguage\(\): string \{[\s\S]*?return this\.globalLanguageService\.getCurrentLanguage\(\);[\s\S]*?\}/g,
      `getCurrentLanguage(): string {
    return this.currentLanguage;
  }`
    );
    
    // Fix 5: Restore getLanguageChange$ method
    content = content.replace(
      /getLanguageChange\$\(\): Observable<string> \{[\s\S]*?return this\.globalLanguageService\.getLanguageState\$\(\)\.pipe\([\s\S]*?map\(\(state: any\) => state\.currentLanguage\)[\s\S]*?\);[\s\S]*?\}/g,
      `getLanguageChange$(): Observable<string> {
    return this.languageChange$.asObservable();
  }`
    );
    
    // Fix 6: Restore toggleLanguage method
    content = content.replace(
      /toggleLanguage\(\): void \{[\s\S]*?this\.globalLanguageService\.toggleLanguage\(\);[\s\S]*?\}/g,
      `toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.languageChange$.next(this.currentLanguage);
  }`
    );
    
    // Fix 7: Restore translate method
    content = content.replace(
      /const currentLanguage = this\.globalLanguageService\.getCurrentLanguage\(\);[\s]*let value = this\.translations\[currentLanguage\];/g,
      `let value = this.translations[this.currentLanguage];`
    );
    
    // Fix 8: Restore isRTL method
    content = content.replace(
      /isRTL\(\): boolean \{[\s\S]*?return this\.globalLanguageService\.isRTL\(\);[\s\S]*?\}/g,
      `isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }`
    );
    
    // Fix 9: Remove any broken method definitions that are outside the class
    content = content.replace(/\s*}\s*else\s*{\s*}/g, '');
    content = content.replace(/\s*translate\(key: string\): string \{[\s\S]*?\}/g, '');
    content = content.replace(/\s*isRTL\(\): boolean \{[\s\S]*?\}/g, '');
    content = content.replace(/\s*isTranslationsLoaded\(\): boolean \{[\s\S]*?\}/g, '');
    content = content.replace(/\s*getTranslations\(\): any \{[\s\S]*?\}/g, '');
    
    // Fix 10: Ensure proper class structure
    if (!content.includes('export class')) {
      return false;
    }
    
    // Fix 11: Remove any duplicate closing braces
    content = content.replace(/\}\s*\}\s*$/g, '}');
    
    // Write the restored content
    fs.writeFileSync(filePath, content);
    return true;
    
  } catch (error) {
    console.error(`Error restoring ${filePath}:`, error.message);
    return false;
  }
}

function restoreAllTranslationServices() {
  console.log('🔧 RESTORING ALL TRANSLATION SERVICES TO WORKING STATE...\n');
  
  let restoredCount = 0;
  let errorCount = 0;
  
  translationServices.forEach(serviceFile => {
    const filePath = `src/app/services/${serviceFile}`;
    
    try {
      if (fs.existsSync(filePath)) {
        const wasRestored = restoreTranslationService(filePath);
        if (wasRestored) {
          console.log(`✅ Restored: ${serviceFile}`);
          restoredCount++;
        } else {
          console.log(`⚠️  Could not restore: ${serviceFile}`);
          errorCount++;
        }
      } else {
        console.log(`⚠️  File not found: ${serviceFile}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error restoring ${serviceFile}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Restoration Summary:`);
  console.log(`✅ Restored: ${restoredCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 All translation services should now be working!`);
}

// Run the restoration
restoreAllTranslationServices(); 