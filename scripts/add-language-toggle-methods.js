const fs = require('fs');

// List of components that need language toggle methods
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
  'role-details/role-details.component.ts',
  'settings/settings.component.ts',
  'user-profile/user-profile.component.ts',
  'sustainability/sustainability.component.ts'
];

function addLanguageToggleMethods(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Check if language toggle methods are already present
    if (content.includes('toggleLanguage()') || content.includes('getLanguageFlag()')) {
      return false; // Already has language toggle methods
    }

    // Add language toggle methods before the closing brace of the class
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

    // Find the last closing brace of the class and insert before it
    const lastBraceIndex = content.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      content = content.slice(0, lastBraceIndex) + languageToggleMethods + '\n' + content.slice(lastBraceIndex);
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

function addLanguageToggleMethodsToAllComponents() {
  console.log('🔧 ADDING LANGUAGE TOGGLE METHODS TO ALL COMPONENTS...\n');
  
  let updatedCount = 0;
  let errorCount = 0;
  
  components.forEach(componentPath => {
    const filePath = `src/app/${componentPath}`;
    
    try {
      if (fs.existsSync(filePath)) {
        const wasUpdated = addLanguageToggleMethods(filePath);
        if (wasUpdated) {
          console.log(`✅ Added methods: ${componentPath.split('/').pop()}`);
          updatedCount++;
        } else {
          console.log(`⏭️  Already has methods: ${componentPath.split('/').pop()}`);
        }
      } else {
        console.log(`⚠️  File not found: ${componentPath.split('/').pop()}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error updating ${componentPath.split('/').pop()}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Updated: ${updatedCount} components`);
  console.log(`❌ Errors: ${errorCount} components`);
  console.log(`\n🎉 Language toggle methods added to all components!`);
  console.log(`🌍 Language toggle buttons should now work on all pages!`);
}

// Run the script
addLanguageToggleMethodsToAllComponents(); 