const fs = require('fs');
const path = require('path');

// List of components that need localStorage SSR fixes
const componentsWithLocalStorage = [
  'training-development/training-development.component.ts',
  'stakeholder-engagement/stakeholder-engagement.component.ts',
  'social-dashboard/social-dashboard.component.ts',
  'resource-management/resource-management.component.ts',
  'reporting/reporting.component.ts',
  'report-analytics/report-analytics.component.ts',
  'marketing-team/marketing-team.component.ts',
  'materiality/materiality.component.ts',
  'marketing-head/marketing-head.component.ts',
  'manage-team/manage-team.component.ts',
  'leads/leads.component.ts',
  'initiatives-dashboard/initiatives-dashboard.component.ts',
  'help-support/help-support.component.ts',
  'governance-dashboard/governance-dashboard.component.ts',
  'environmental-training/environmental-training.component.ts',
  'esg-specialist/esg-specialist.component.ts',
  'environmental-dashboard/environmental-dashboard.component.ts',
  'data-management/data-management.component.ts',
  'communication-hub/communication-hub.component.ts'
];

function fixLocalStorageSSR() {
  console.log('🔧 Fixing localStorage SSR issues in components...\n');
  
  let fixedCount = 0;
  let errorCount = 0;
  
  componentsWithLocalStorage.forEach(component => {
    const filePath = `src/app/${component}`;
    
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let needsFix = false;
        
        // Check if file has localStorage usage that needs SSR protection
        if (content.includes('localStorage.removeItem(\'currentUser\')')) {
          // Replace direct localStorage calls with SSR-safe versions
          content = content.replace(
            /localStorage\.removeItem\('currentUser'\)/g,
            'if (typeof window !== \'undefined\' && window.localStorage) { localStorage.removeItem(\'currentUser\'); }'
          );
          needsFix = true;
        }
        
        if (needsFix) {
          fs.writeFileSync(filePath, content);
          console.log(`✅ Fixed localStorage SSR: ${component}`);
          fixedCount++;
        } else {
          console.log(`⏭️  Already correct: ${component}`);
        }
      } else {
        console.log(`⚠️  File not found: ${component}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error fixing ${component}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Fixed: ${fixedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 localStorage SSR fixes completed!`);
}

// Run the fix
fixLocalStorageSSR(); 