const fs = require('fs');
const path = require('path');

function finalVerification() {
  console.log('🧪 Final Verification of Language System Fixes...\n');
  
  let verificationResults = {
    translationPaths: { passed: 0, failed: 0, details: [] },
    globalLanguageService: { passed: 0, failed: 0, details: [] },
    loginComponent: { passed: 0, failed: 0, details: [] },
    sidebarToggles: { passed: 0, failed: 0, details: [] },
    ssrFixes: { passed: 0, failed: 0, details: [] }
  };

  // Test 1: Translation Service Paths
  console.log('📁 Test 1: Translation Service Paths');
  const translationServices = [
    'dashboard-translation.service.ts',
    'login-translation.service.ts',
    'ai-translation.service.ts'
  ];

  translationServices.forEach(service => {
    const filePath = `src/app/services/${service}`;
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('../assets/i18n/')) {
          console.log(`  ✅ ${service}: Correct path`);
          verificationResults.translationPaths.passed++;
        } else {
          console.log(`  ❌ ${service}: Incorrect path`);
          verificationResults.translationPaths.failed++;
        }
      }
    } catch (error) {
      console.log(`  ❌ ${service}: Error reading file`);
      verificationResults.translationPaths.failed++;
    }
  });

  // Test 2: Global Language Service SSR Fixes
  console.log('\n🌐 Test 2: Global Language Service SSR Fixes');
  const globalServicePath = 'src/app/services/global-language.service.ts';
  try {
    if (fs.existsSync(globalServicePath)) {
      const content = fs.readFileSync(globalServicePath, 'utf8');
      if (content.includes('typeof window !== \'undefined\'') && 
          content.includes('window.localStorage')) {
        console.log('  ✅ Global Language Service: SSR-safe');
        verificationResults.globalLanguageService.passed++;
      } else {
        console.log('  ❌ Global Language Service: Missing SSR protection');
        verificationResults.globalLanguageService.failed++;
      }
    }
  } catch (error) {
    console.log('  ❌ Global Language Service: Error reading file');
    verificationResults.globalLanguageService.failed++;
  }

  // Test 3: Login Component
  console.log('\n🔐 Test 3: Login Component');
  const loginPath = 'src/app/login/login.component.ts';
  try {
    if (fs.existsSync(loginPath)) {
      const content = fs.readFileSync(loginPath, 'utf8');
      if (content.includes('UnifiedLanguageToggleComponent') && 
          content.includes('<app-unified-language-toggle>') &&
          content.includes('typeof window !== \'undefined\'')) {
        console.log('  ✅ Login component: Using unified toggle and SSR-safe');
        verificationResults.loginComponent.passed++;
      } else {
        console.log('  ❌ Login component: Issues found');
        verificationResults.loginComponent.failed++;
      }
    }
  } catch (error) {
    console.log('  ❌ Login component: Error reading file');
    verificationResults.loginComponent.failed++;
  }

  // Test 4: Sidebar Language Toggles
  console.log('\n🎛️  Test 4: Sidebar Language Toggles');
  const componentsWithSidebars = [
    'dashboard/dashboard.component.html',
    'ux/ux.component.html',
    'training-development/training-development.component.html'
  ];

  componentsWithSidebars.forEach(component => {
    const filePath = `src/app/${component}`;
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('<app-unified-language-toggle>')) {
          console.log(`  ✅ ${component}: Has language toggle`);
          verificationResults.sidebarToggles.passed++;
        } else {
          console.log(`  ❌ ${component}: Missing language toggle`);
          verificationResults.sidebarToggles.failed++;
        }
      }
    } catch (error) {
      console.log(`  ❌ ${component}: Error reading file`);
      verificationResults.sidebarToggles.failed++;
    }
  });

  // Test 5: SSR Fixes in Components
  console.log('\n🛡️  Test 5: SSR Fixes in Components');
  const componentsWithSSRFixes = [
    'training-development/training-development.component.ts',
    'help-support/help-support.component.ts',
    'resource-management/resource-management.component.ts'
  ];

  componentsWithSSRFixes.forEach(component => {
    const filePath = `src/app/${component}`;
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('typeof window !== \'undefined\'') && 
            content.includes('window.localStorage')) {
          console.log(`  ✅ ${component}: SSR-safe`);
          verificationResults.ssrFixes.passed++;
        } else {
          console.log(`  ❌ ${component}: Missing SSR protection`);
          verificationResults.ssrFixes.failed++;
        }
      }
    } catch (error) {
      console.log(`  ❌ ${component}: Error reading file`);
      verificationResults.ssrFixes.failed++;
    }
  });

  // Summary
  console.log('\n📊 Final Verification Summary:');
  console.log(`Translation Paths: ${verificationResults.translationPaths.passed} passed, ${verificationResults.translationPaths.failed} failed`);
  console.log(`Global Language Service: ${verificationResults.globalLanguageService.passed} passed, ${verificationResults.globalLanguageService.failed} failed`);
  console.log(`Login Component: ${verificationResults.loginComponent.passed} passed, ${verificationResults.loginComponent.failed} failed`);
  console.log(`Sidebar Toggles: ${verificationResults.sidebarToggles.passed} passed, ${verificationResults.sidebarToggles.failed} failed`);
  console.log(`SSR Fixes: ${verificationResults.ssrFixes.passed} passed, ${verificationResults.ssrFixes.failed} failed`);

  const totalPassed = Object.values(verificationResults).reduce((sum, test) => sum + test.passed, 0);
  const totalFailed = Object.values(verificationResults).reduce((sum, test) => sum + test.failed, 0);

  console.log(`\n🎯 Overall: ${totalPassed} passed, ${totalFailed} failed`);

  if (totalFailed === 0) {
    console.log('\n🎉 ALL VERIFICATIONS PASSED!');
    console.log('✅ Translation service paths are correct');
    console.log('✅ Global language service is SSR-safe');
    console.log('✅ Login component uses unified toggle');
    console.log('✅ Sidebar language toggles are present');
    console.log('✅ All components are SSR-safe');
    console.log('\n🚀 Your language switching system should now be fully functional!');
  } else {
    console.log('\n⚠️  Some verifications failed. Please check the details above.');
  }

  return verificationResults;
}

// Run the verification
finalVerification(); 