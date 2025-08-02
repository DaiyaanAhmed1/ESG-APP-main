const fs = require('fs');

// List of components that need fixing
const components = [
  'dashboard/dashboard.component.ts',
  'ai/ai.component.ts',
  'environmental/environmental.component.ts',
  'social/social.component.ts',
  'governance/governance.component.ts',
  'reporting/reporting.component.ts',
  'integrations/integrations.component.ts',
  'compliance/compliance.component.ts',
  'localization/localization.component.ts',
  'security/security.component.ts',
  'ux/ux.component.ts',
  'help-support/help-support.component.ts',
  'training-development/training-development.component.ts',
  'resource-management/resource-management.component.ts',
  'materiality/materiality.component.ts',
  'stakeholder-engagement/stakeholder-engagement.component.ts',
  'communication-hub/communication-hub.component.ts',
  'data-management/data-management.component.ts',
  'report-analytics/report-analytics.component.ts',
  'marketing-team/marketing-team.component.ts',
  'marketing-head/marketing-head.component.ts',
  'manage-team/manage-team.component.ts',
  'leads/leads.component.ts',
  'initiatives-dashboard/initiatives-dashboard.component.ts',
  'governance-dashboard/governance-dashboard.component.ts',
  'environmental-dashboard/environmental-dashboard.component.ts',
  'social-dashboard/social-dashboard.component.ts',
  'environmental-training/environmental-training.component.ts',
  'esg-specialist/esg-specialist.component.ts',
  'esg-iot-smart-tech-engineer/esg-iot-smart-tech-engineer.component.ts',
  'green-building-energy-modelling-specialist/green-building-energy-modelling-specialist.component.ts',
  'sustainability-risk-specialist/sustainability-risk-specialist.component.ts',
  'carbon-footprint-line-chart/carbon-footprint-line-chart.component.ts',
  'energy-consumption-bar-chart/energy-consumption-bar-chart.component.ts',
  'iot-sensor-gauge/iot-sensor-gauge.component.ts',
  'water-waste-line-chart/water-waste-line-chart.component.ts',
  'sustainability-goals-radial/sustainability-goals-radial.component.ts',
  'supply-chain-area-chart/supply-chain-area-chart.component.ts',
  'role-details/role-details.component.ts'
];

function fixComponent(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Fix 1: Remove duplicate isRTL getter if there's already an isRTL property
    if (content.includes('isRTL = false;') && content.includes('get isRTL(): boolean {')) {
      content = content.replace(/\s*get isRTL\(\): boolean \{\s*return this\.translationService\.isRTL\(\);\s*\}/g, '');
      updated = true;
    }

    // Fix 2: Remove all the language toggle methods that were added incorrectly
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
      updated = true;
    }

    // Fix 3: Remove any remaining duplicate isRTL getters
    content = content.replace(/\s*get isRTL\(\): boolean \{\s*return this\.translationService\.isRTL\(\);\s*\}/g, '');

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

function fixAllComponents() {
  console.log('🔧 FIXING DUPLICATE ERRORS IN ALL COMPONENTS...\n');
  
  let fixedCount = 0;
  let errorCount = 0;
  
  components.forEach(componentPath => {
    const filePath = `src/app/${componentPath}`;
    
    try {
      if (fs.existsSync(filePath)) {
        const wasFixed = fixComponent(filePath);
        if (wasFixed) {
          console.log(`✅ Fixed: ${componentPath.split('/').pop()}`);
          fixedCount++;
        } else {
          console.log(`⏭️  No changes needed: ${componentPath.split('/').pop()}`);
        }
      } else {
        console.log(`⚠️  File not found: ${componentPath.split('/').pop()}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error fixing ${componentPath.split('/').pop()}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Fix Summary:`);
  console.log(`✅ Fixed: ${fixedCount} components`);
  console.log(`❌ Errors: ${errorCount} components`);
  console.log(`\n🎉 All duplicate errors should be resolved!`);
}

// Run the fix
fixAllComponents(); 