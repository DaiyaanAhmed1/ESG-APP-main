const fs = require('fs');

// List of files that need object key fixes
const filesToFix = [
  'communication-hub-translation.service.ts',
  'data-management-translation.service.ts',
  'environmental-training-translation.service.ts',
  'esg-specialist-translation.service.ts',
  'governance-lead-translation.service.ts',
  'help-support-translation.service.ts',
  'manage-team-translation.service.ts',
  'marketing-team-translation.service.ts',
  'report-analytics-translation.service.ts',
  'resource-management-translation.service.ts',
  'stakeholder-engagement-translation.service.ts',
  'training-development-translation.service.ts'
];

function fixObjectKeys(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Fix 1: Replace spaces with underscores in object keys
    const spaceKeyReplacements = [
      ['COMMUNICATION HUB', 'COMMUNICATION_HUB'],
      ['DATA MANAGEMENT', 'DATA_MANAGEMENT'],
      ['ENVIRONMENTAL TRAINING', 'ENVIRONMENTAL_TRAINING'],
      ['ESG SPECIALIST', 'ESG_SPECIALIST'],
      ['GOVERNANCE LEAD', 'GOVERNANCE_LEAD'],
      ['HELP SUPPORT', 'HELP_SUPPORT'],
      ['MANAGE TEAM', 'MANAGE_TEAM'],
      ['MARKETING TEAM', 'MARKETING_TEAM'],
      ['REPORT ANALYTICS', 'REPORT_ANALYTICS'],
      ['RESOURCE MANAGEMENT', 'RESOURCE_MANAGEMENT'],
      ['STAKEHOLDER ENGAGEMENT', 'STAKEHOLDER_ENGAGEMENT'],
      ['TRAINING DEVELOPMENT', 'TRAINING_DEVELOPMENT']
    ];

    spaceKeyReplacements.forEach(([oldKey, newKey]) => {
      if (content.includes(oldKey)) {
        content = content.replace(new RegExp(oldKey.replace(/\s+/g, '\\s+'), 'g'), newKey);
        updated = true;
      }
    });

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

function fixAllObjectKeys() {
  console.log('🔧 FIXING INVALID OBJECT KEYS IN TRANSLATION SERVICES...\n');
  
  let fixedCount = 0;
  let errorCount = 0;
  
  filesToFix.forEach(fileName => {
    const filePath = `src/app/services/${fileName}`;
    
    try {
      if (fs.existsSync(filePath)) {
        const wasFixed = fixObjectKeys(filePath);
        if (wasFixed) {
          console.log(`✅ Fixed: ${fileName}`);
          fixedCount++;
        } else {
          console.log(`⏭️  No changes needed: ${fileName}`);
        }
      } else {
        console.log(`⚠️  File not found: ${fileName}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error fixing ${fileName}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n📊 Fix Summary:`);
  console.log(`✅ Fixed: ${fixedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 All object keys should now be valid!`);
}

// Run the fix
fixAllObjectKeys(); 