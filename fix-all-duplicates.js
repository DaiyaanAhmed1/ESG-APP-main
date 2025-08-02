const fs = require('fs');

// List of all components that need fixing
const components = [
  'src/app/compliance/compliance.component.ts',
  'src/app/localization/localization.component.ts',
  'src/app/security/security.component.ts',
  'src/app/ux/ux.component.ts',
  'src/app/help-support/help-support.component.ts',
  'src/app/training-development/training-development.component.ts',
  'src/app/resource-management/resource-management.component.ts',
  'src/app/materiality/materiality.component.ts',
  'src/app/stakeholder-engagement/stakeholder-engagement.component.ts',
  'src/app/communication-hub/communication-hub.component.ts',
  'src/app/data-management/data-management.component.ts',
  'src/app/report-analytics/report-analytics.component.ts',
  'src/app/marketing-team/marketing-team.component.ts',
  'src/app/marketing-head/marketing-head.component.ts',
  'src/app/manage-team/manage-team.component.ts',
  'src/app/leads/leads.component.ts',
  'src/app/initiatives-dashboard/initiatives-dashboard.component.ts',
  'src/app/governance-dashboard/governance-dashboard.component.ts',
  'src/app/environmental-dashboard/environmental-dashboard.component.ts',
  'src/app/social-dashboard/social-dashboard.component.ts',
  'src/app/environmental-training/environmental-training.component.ts',
  'src/app/esg-specialist/esg-specialist.component.ts',
  'src/app/esg-iot-smart-tech-engineer/esg-iot-smart-tech-engineer.component.ts',
  'src/app/green-building-energy-modelling-specialist/green-building-energy-modelling-specialist.component.ts',
  'src/app/sustainability-risk-specialist/sustainability-risk-specialist.component.ts',
  'src/app/carbon-footprint-line-chart/carbon-footprint-line-chart.component.ts',
  'src/app/energy-consumption-bar-chart/energy-consumption-bar-chart.component.ts',
  'src/app/iot-sensor-gauge/iot-sensor-gauge.component.ts',
  'src/app/water-waste-line-chart/water-waste-line-chart.component.ts',
  'src/app/sustainability-goals-radial/sustainability-goals-radial.component.ts',
  'src/app/supply-chain-area-chart/supply-chain-area-chart.component.ts',
  'src/app/role-details/role-details.component.ts'
];

console.log('🔧 FIXING ALL DUPLICATE ERRORS...\n');

let fixedCount = 0;

components.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove the problematic language toggle methods
      const languageToggleMethods = `
  // Language toggle methods
  toggleLanguage() {
    this.translationService.toggleLanguage();
  }

  getLanguageFlag(): string {
    return this.translationService.getCurrentLanguage() === 'en' ? '🇺🇸' : '🇸🇦';
  }

  getLanguageText(): string {
    return this.translationService.getCurrentLanguage() === 'en' ? 'English' : 'العربية';
  }

  getButtonTitle(): string {
    return this.translationService.getCurrentLanguage() === 'en' 
      ? 'Switch to Arabic' 
      : 'التبديل إلى الإنجليزية';
  }

  get isRTL(): boolean {
    return this.translationService.isRTL();
  }`;

      if (content.includes(languageToggleMethods)) {
        content = content.replace(languageToggleMethods, '');
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed: ${filePath.split('/').pop()}`);
        fixedCount++;
      }
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
  }
});

console.log(`\n🎉 FIXED ${fixedCount} COMPONENTS!`);
console.log('🌍 Your application should now compile without errors!'); 