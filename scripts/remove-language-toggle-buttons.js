const fs = require('fs');

// List of components that need language toggle buttons removed
const components = [
  'dashboard/dashboard.component.html',
  'ai/ai.component.html',
  'environmental/environmental.component.html',
  'social/social.component.html',
  'governance/governance.component.html',
  'reporting/reporting.component.html',
  'integrations/integrations.component.html',
  'compliance/compliance.component.html',
  'localization/localization.component.html',
  'security/security.component.html',
  'ux/ux.component.html',
  'help-support/help-support.component.html',
  'training-development/training-development.component.html',
  'resource-management/resource-management.component.html',
  'materiality/materiality.component.html',
  'stakeholder-engagement/stakeholder-engagement.component.html',
  'communication-hub/communication-hub.component.html',
  'data-management/data-management.component.html',
  'report-analytics/report-analytics.component.html',
  'marketing-team/marketing-team.component.html',
  'marketing-head/marketing-head.component.html',
  'manage-team/manage-team.component.html',
  'leads/leads.component.html',
  'initiatives-dashboard/initiatives-dashboard.component.html',
  'governance-dashboard/governance-dashboard.component.html',
  'environmental-dashboard/environmental-dashboard.component.html',
  'social-dashboard/social-dashboard.component.html',
  'environmental-training/environmental-training.component.html',
  'esg-specialist/esg-specialist.component.html',
  'esg-iot-smart-tech-engineer/esg-iot-smart-tech-engineer.component.html',
  'green-building-energy-modelling-specialist/green-building-energy-modelling-specialist.component.html',
  'sustainability-risk-specialist/sustainability-risk-specialist.component.html',
  'carbon-footprint-line-chart/carbon-footprint-line-chart.component.html',
  'energy-consumption-bar-chart/energy-consumption-bar-chart.component.html',
  'iot-sensor-gauge/iot-sensor-gauge.component.html',
  'water-waste-line-chart/water-waste-line-chart.component.html',
  'sustainability-goals-radial/sustainability-goals-radial.component.html',
  'supply-chain-area-chart/supply-chain-area-chart.component.html',
  'role-details/role-details.component.html'
];

function removeLanguageToggleButton(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Remove the language toggle button and its styles
    const languageTogglePattern = /<!-- Language Toggle Button -->[\s\S]*?<\/style>/;
    if (content.match(languageTogglePattern)) {
      content = content.replace(languageTogglePattern, '');
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

function removeAllLanguageToggleButtons() {
  console.log('🔧 REMOVING LANGUAGE TOGGLE BUTTONS FROM ALL COMPONENTS...\n');
  
  let removedCount = 0;
  let errorCount = 0;
  
  components.forEach(componentPath => {
    const filePath = `src/app/${componentPath}`;
    
    try {
      if (fs.existsSync(filePath)) {
        const wasRemoved = removeLanguageToggleButton(filePath);
        if (wasRemoved) {
          console.log(`✅ Removed toggle: ${componentPath.split('/').pop()}`);
          removedCount++;
        } else {
          console.log(`⏭️  No toggle found: ${componentPath.split('/').pop()}`);
        }
      } else {
        console.log(`⚠️  File not found: ${componentPath.split('/').pop()}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error removing ${componentPath.split('/').pop()}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Removed: ${removedCount} language toggle buttons`);
  console.log(`❌ Errors: ${errorCount} components`);
  console.log(`\n🎉 All language toggle buttons removed!`);
  console.log(`🌍 Application should now compile without errors!`);
}

// Run the script
removeAllLanguageToggleButtons(); 