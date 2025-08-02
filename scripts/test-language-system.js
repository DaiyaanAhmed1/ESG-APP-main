const fs = require('fs');
const path = require('path');

function testLanguageSystem() {
  console.log('🧪 Testing Language System Fixes...\n');
  
  let testResults = {
    translationPaths: { passed: 0, failed: 0, details: [] },
    loginComponent: { passed: 0, failed: 0, details: [] },
    sidebarToggles: { passed: 0, failed: 0, details: [] }
  };

  // Test 1: Check translation service paths
  console.log('📁 Test 1: Translation Service Paths');
  const translationServices = [
    'dashboard-translation.service.ts',
    'login-translation.service.ts',
    'ai-translation.service.ts',
    'environmental-translation.service.ts',
    'social-translation.service.ts'
  ];

  translationServices.forEach(service => {
    const filePath = `src/app/services/${service}`;
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('../assets/i18n/')) {
          console.log(`  ✅ ${service}: Correct path`);
          testResults.translationPaths.passed++;
        } else if (content.includes('./assets/i18n/')) {
          console.log(`  ❌ ${service}: Still has incorrect path`);
          testResults.translationPaths.failed++;
          testResults.translationPaths.details.push(service);
        } else {
          console.log(`  ⚠️  ${service}: No path found`);
        }
      } else {
        console.log(`  ⚠️  ${service}: File not found`);
      }
    } catch (error) {
      console.log(`  ❌ ${service}: Error reading file`);
      testResults.translationPaths.failed++;
    }
  });

  // Test 2: Check login component
  console.log('\n🔐 Test 2: Login Component');
  const loginPath = 'src/app/login/login.component.ts';
  try {
    if (fs.existsSync(loginPath)) {
      const content = fs.readFileSync(loginPath, 'utf8');
      if (content.includes('UnifiedLanguageToggleComponent') && 
          content.includes('<app-unified-language-toggle>')) {
        console.log('  ✅ Login component: Using unified toggle');
        testResults.loginComponent.passed++;
      } else {
        console.log('  ❌ Login component: Still using old toggle');
        testResults.loginComponent.failed++;
        testResults.loginComponent.details.push('login.component.ts');
      }
    } else {
      console.log('  ⚠️  Login component: File not found');
    }
  } catch (error) {
    console.log('  ❌ Login component: Error reading file');
    testResults.loginComponent.failed++;
  }

  // Test 3: Check sidebar language toggles
  console.log('\n🎛️  Test 3: Sidebar Language Toggles');
  const componentsWithSidebars = [
    'dashboard/dashboard.component.html',
    'ux/ux.component.html',
    'training-development/training-development.component.html',
    'security/security.component.html',
    'resource-management/resource-management.component.html',
    'help-support/help-support.component.html'
  ];

  componentsWithSidebars.forEach(component => {
    const filePath = `src/app/${component}`;
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('<app-unified-language-toggle>')) {
          console.log(`  ✅ ${component}: Has language toggle`);
          testResults.sidebarToggles.passed++;
        } else {
          console.log(`  ❌ ${component}: Missing language toggle`);
          testResults.sidebarToggles.failed++;
          testResults.sidebarToggles.details.push(component);
        }
      } else {
        console.log(`  ⚠️  ${component}: File not found`);
      }
    } catch (error) {
      console.log(`  ❌ ${component}: Error reading file`);
      testResults.sidebarToggles.failed++;
    }
  });

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`Translation Paths: ${testResults.translationPaths.passed} passed, ${testResults.translationPaths.failed} failed`);
  console.log(`Login Component: ${testResults.loginComponent.passed} passed, ${testResults.loginComponent.failed} failed`);
  console.log(`Sidebar Toggles: ${testResults.sidebarToggles.passed} passed, ${testResults.sidebarToggles.failed} failed`);

  const totalPassed = testResults.translationPaths.passed + testResults.loginComponent.passed + testResults.sidebarToggles.passed;
  const totalFailed = testResults.translationPaths.failed + testResults.loginComponent.failed + testResults.sidebarToggles.failed;

  console.log(`\n🎯 Overall: ${totalPassed} passed, ${totalFailed} failed`);

  if (totalFailed === 0) {
    console.log('🎉 All tests passed! Language system should be working properly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the details above.');
  }

  return testResults;
}

// Run the tests
testLanguageSystem(); 