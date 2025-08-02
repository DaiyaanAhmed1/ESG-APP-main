const fs = require('fs');

function testLoginLanguage() {
  console.log('🧪 Testing Login Language Toggle Fixes...\n');
  
  // Test 1: Check login component uses correct toggle
  console.log('🔐 Test 1: Login Component Language Toggle');
  const loginPath = 'src/app/login/login.component.ts';
  try {
    if (fs.existsSync(loginPath)) {
      const content = fs.readFileSync(loginPath, 'utf8');
      if (content.includes('LoginLanguageToggleComponent') && 
          content.includes('<app-login-language-toggle>')) {
        console.log('  ✅ Login component: Using original login toggle');
      } else {
        console.log('  ❌ Login component: Not using original toggle');
      }
    }
  } catch (error) {
    console.log('  ❌ Error reading login component');
  }

  // Test 2: Check login translation service uses global service
  console.log('\n🌐 Test 2: Login Translation Service Global Integration');
  const loginServicePath = 'src/app/services/login-translation.service.ts';
  try {
    if (fs.existsSync(loginServicePath)) {
      const content = fs.readFileSync(loginServicePath, 'utf8');
      if (content.includes('GlobalLanguageService') && 
          content.includes('globalLanguageService.toggleLanguage()')) {
        console.log('  ✅ Login translation service: Connected to global service');
      } else {
        console.log('  ❌ Login translation service: Not connected to global service');
      }
    }
  } catch (error) {
    console.log('  ❌ Error reading login translation service');
  }

  // Test 3: Check login toggle component uses global service
  console.log('\n🎛️  Test 3: Login Toggle Component Global Integration');
  const loginTogglePath = 'src/app/components/login-language-toggle/login-language-toggle.component.ts';
  try {
    if (fs.existsSync(loginTogglePath)) {
      const content = fs.readFileSync(loginTogglePath, 'utf8');
      if (content.includes('GlobalLanguageService')) {
        console.log('  ✅ Login toggle component: Uses global service');
      } else {
        console.log('  ❌ Login toggle component: Does not use global service');
      }
    }
  } catch (error) {
    console.log('  ❌ Error reading login toggle component');
  }

  console.log('\n🎉 Login language toggle tests completed!');
}

// Run the test
testLoginLanguage(); 