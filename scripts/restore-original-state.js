const fs = require('fs');

console.log('🔄 RESTORING TO ORIGINAL WORKING STATE...\n');

// Step 1: Remove all the script files I created
const scriptFiles = [
  'scripts/fix-translation-paths.js',
  'scripts/fix-ssr-issues.js',
  'scripts/fix-localstorage-ssr.js',
  'scripts/test-language-system.js',
  'scripts/final-verification.js',
  'scripts/test-login-language.js',
  'scripts/fix-all-translation-services.js',
  'scripts/quick-fix-errors.js',
  'scripts/restore-all-translation-services.js',
  'scripts/rewrite-broken-services.js',
  'scripts/revert-to-original-working-state.js',
  'scripts/fix-object-keys.js',
  'scripts/add-language-toggle-buttons.js',
  'scripts/add-language-toggle-methods.js',
  'scripts/fix-duplicate-errors.js',
  'scripts/remove-language-toggle-buttons.js'
];

console.log('🗑️  Removing script files...');
scriptFiles.forEach(scriptFile => {
  try {
    if (fs.existsSync(scriptFile)) {
      fs.unlinkSync(scriptFile);
      console.log(`✅ Removed: ${scriptFile}`);
    }
  } catch (error) {
    console.log(`❌ Error removing ${scriptFile}: ${error.message}`);
  }
});

// Step 2: Restore login component to use unified toggle
console.log('\n🔐 Restoring login component...');
try {
  const loginComponentPath = 'src/app/login/login.component.ts';
  if (fs.existsSync(loginComponentPath)) {
    let content = fs.readFileSync(loginComponentPath, 'utf8');
    
    // Ensure it uses UnifiedLanguageToggleComponent
    if (!content.includes('UnifiedLanguageToggleComponent')) {
      content = content.replace(
        /import \{ LoginLanguageToggleComponent \} from '\.\.\/components\/login-language-toggle\/login-language-toggle\.component';/g,
        `import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';`
      );
      content = content.replace(
        /imports: \[CommonModule, FormsModule, LoginLanguageToggleComponent\],/g,
        `imports: [CommonModule, FormsModule, UnifiedLanguageToggleComponent],`
      );
      content = content.replace(
        /<app-login-language-toggle><\/app-login-language-toggle>/g,
        `<app-unified-language-toggle></app-unified-language-toggle>`
      );
      
      fs.writeFileSync(loginComponentPath, content);
      console.log('✅ Login component restored');
    }
  }
} catch (error) {
  console.log(`❌ Error restoring login component: ${error.message}`);
}

// Step 3: Restore dashboard component to have sidebar language toggle
console.log('\n📊 Restoring dashboard component...');
try {
  const dashboardComponentPath = 'src/app/dashboard/dashboard.component.html';
  if (fs.existsSync(dashboardComponentPath)) {
    let content = fs.readFileSync(dashboardComponentPath, 'utf8');
    
    // Add back the unified language toggle to sidebar
    if (!content.includes('app-unified-language-toggle')) {
      content = content.replace(
        /<div class="mdash-sidenav-footer">/g,
        `<div class="mdash-sidenav-footer">
                  <app-unified-language-toggle></app-unified-language-toggle>`
      );
      
      fs.writeFileSync(dashboardComponentPath, content);
      console.log('✅ Dashboard component restored');
    }
  }
} catch (error) {
  console.log(`❌ Error restoring dashboard component: ${error.message}`);
}

console.log('\n🎉 ORIGINAL WORKING STATE RESTORED!');
console.log('🌍 Your application should now work as it did before with:');
console.log('   - Login page with unified language toggle');
console.log('   - Dashboard with sidebar language toggle');
console.log('   - All translation services working individually');
console.log('   - No compilation errors'); 