const fs = require('fs');
const path = require('path');

// List of all components that need to be updated
const components = [
  'ai',
  'carbon-footprint-line-chart',
  'communication-hub',
  'compliance',
  'data-management',
  'energy-consumption-bar-chart',
  'environmental',
  'environmental-dashboard',
  'environmental-training',
  'esg-iot-smart-tech-engineer',
  'esg-specialist',
  'governance',
  'governance-dashboard',
  'green-building-energy-modelling-specialist',
  'help-support',
  'initiatives-dashboard',
  'integrations',
  'iot-sensor-gauge',
  'leads',
  'localization',
  'login',
  'manage-team',
  'marketing-head',
  'marketing-team',
  'materiality',
  'report-analytics',
  'reporting',
  'resource-management',
  'role-details',
  'security',
  'social',
  'social-dashboard',
  'stakeholder-engagement',
  'supply-chain-area-chart',
  'sustainability-goals-radial',
  'sustainability-risk-specialist',
  'training-development',
  'ux',
  'water-waste-line-chart'
];

// Function to update component imports
function updateComponentImports(componentName) {
  const componentPath = `src/app/${componentName}/${componentName}.component.ts`;
  
  if (!fs.existsSync(componentPath)) {
    console.log(`⚠️  Component not found: ${componentPath}`);
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  
  // Replace individual language toggle import with unified one
  const oldImportPattern = new RegExp(`import\\s+\\{[^}]*\\}\\s+from\\s+['"]\\.\\./components/[^'"]*-language-toggle/[^'"]*['"];?`, 'g');
  const newImport = `import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';`;
  
  content = content.replace(oldImportPattern, newImport);
  
  // Update imports array
  const importsPattern = /imports:\s*\[([^\]]+)\]/;
  const match = content.match(importsPattern);
  
  if (match) {
    const currentImports = match[1];
    // Remove old language toggle component and add unified one
    const updatedImports = currentImports
      .split(',')
      .map(imp => imp.trim())
      .filter(imp => !imp.includes('LanguageToggleComponent') && !imp.includes('SidebarLanguageToggleComponent'))
      .join(', ');
    
    const newImportsArray = `imports: [${updatedImports}, UnifiedLanguageToggleComponent]`;
    content = content.replace(importsPattern, newImportsArray);
  }
  
  // Update template to use unified component
  content = content.replace(/app-[^>]*language-toggle/g, 'app-unified-language-toggle');
  
  fs.writeFileSync(componentPath, content);
  console.log(`✅ Updated imports for: ${componentName}`);
}

// Function to update HTML templates
function updateHtmlTemplate(componentName) {
  const htmlPath = `src/app/${componentName}/${componentName}.component.html`;
  
  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠️  HTML template not found: ${htmlPath}`);
    return;
  }

  let content = fs.readFileSync(htmlPath, 'utf8');
  
  // Replace all language toggle components with unified one
  content = content.replace(/<app-[^>]*language-toggle[^>]*><\/app-[^>]*language-toggle>/g, '<app-unified-language-toggle></app-unified-language-toggle>');
  
  fs.writeFileSync(htmlPath, content);
  console.log(`✅ Updated HTML template for: ${componentName}`);
}

// Function to update translation services
function updateTranslationService(componentName) {
  const servicePath = `src/app/services/${componentName}-translation.service.ts`;
  
  if (!fs.existsSync(servicePath)) {
    console.log(`⚠️  Translation service not found: ${servicePath}`);
    return;
  }

  let content = fs.readFileSync(servicePath, 'utf8');
  
  // Add global language service import
  if (!content.includes('GlobalLanguageService')) {
    const importPattern = /import\s+{[^}]*}\s+from\s+['"]@angular\/core['"];?/;
    const newImport = `import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';`;
    
    content = content.replace(importPattern, newImport);
  }
  
  // Update constructor to inject global service
  const constructorPattern = /constructor\s*\(([^)]*)\)\s*{/;
  const constructorMatch = content.match(constructorPattern);
  
  if (constructorMatch) {
    const currentParams = constructorMatch[1];
    const newConstructor = `constructor(
    private http: HttpClient,
    private globalLanguageService: GlobalLanguageService
  )`;
    content = content.replace(constructorPattern, newConstructor);
  }
  
  // Update language change subscription
  content = content.replace(
    /this\.languageChange\$\.next\([^)]*\);/g,
    '// Language changes are now handled by global service'
  );
  
  fs.writeFileSync(servicePath, content);
  console.log(`✅ Updated translation service for: ${componentName}`);
}

// Main execution
console.log('🚀 Starting unified language system update...\n');

components.forEach(component => {
  console.log(`📝 Processing: ${component}`);
  updateComponentImports(component);
  updateHtmlTemplate(component);
  updateTranslationService(component);
  console.log('');
});

console.log('✅ Unified language system update completed!');
console.log('\n📋 Next steps:');
console.log('1. Test the application to ensure all components work correctly');
console.log('2. Verify that language toggles are consistent across all pages');
console.log('3. Check that language changes propagate globally'); 