const fs = require('fs');
const path = require('path');

// List of all translation service files that need SSR fixes
const translationServices = [
  'ai-translation.service.ts',
  'carbon-footprint-line-chart-translation.service.ts',
  'communication-hub-translation.service.ts',
  'compliance-translation.service.ts',
  'data-management-translation.service.ts',
  'energy-consumption-bar-chart-translation.service.ts',
  'environmental-translation.service.ts',
  'environmental-training-translation.service.ts',
  'esg-iot-smart-tech-engineer-translation.service.ts',
  'esg-specialist-translation.service.ts',
  'governance-translation.service.ts',
  'governance-lead-translation.service.ts',
  'green-building-energy-modelling-specialist-translation.service.ts',
  'help-support-translation.service.ts',
  'initiatives-dashboard-translation.service.ts',
  'integrations-translation.service.ts',
  'iot-sensor-gauge-translation.service.ts',
  'leads-translation.service.ts',
  'localization-translation.service.ts',
  'login-translation.service.ts',
  'manage-team-translation.service.ts',
  'marketing-team-translation.service.ts',
  'marketing-translation.service.ts',
  'materiality-translation.service.ts',
  'report-analytics-translation.service.ts',
  'reporting-translation.service.ts',
  'resource-management-translation.service.ts',
  'role-details-translation.service.ts',
  'security-translation.service.ts',
  'settings-translation.service.ts',
  'social-dashboard-translation.service.ts',
  'social-manager-translation.service.ts',
  'social-translation.service.ts',
  'stakeholder-engagement-translation.service.ts',
  'supply-chain-area-chart-translation.service.ts',
  'sustainability-goals-radial-translation.service.ts',
  'sustainability-risk-specialist-translation.service.ts',
  'sustainability-translation.service.ts',
  'training-development-translation.service.ts',
  'user-profile-translation.service.ts',
  'ux-translation.service.ts',
  'water-waste-line-chart-translation.service.ts'
];

function fixSSRIssues() {
  console.log('🔧 Fixing SSR issues in translation services...\n');
  
  let fixedCount = 0;
  let errorCount = 0;
  
  translationServices.forEach(serviceFile => {
    const filePath = `src/app/services/${serviceFile}`;
    
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file needs fixing
        if (content.includes('console.warn(\'Not in browser environment')) {
          // Replace console.warn with console.log
          content = content.replace(
            /console\.warn\('Not in browser environment, using fallback translations'\)/g,
            'console.log(\'Not in browser environment, using fallback translations\')'
          );
          
          fs.writeFileSync(filePath, content);
          console.log(`✅ Fixed SSR issue: ${serviceFile}`);
          fixedCount++;
        } else {
          console.log(`⏭️  Already correct: ${serviceFile}`);
        }
      } else {
        console.log(`⚠️  File not found: ${serviceFile}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error fixing ${serviceFile}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Fixed: ${fixedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 SSR fixes completed!`);
}

// Run the fix
fixSSRIssues(); 