const fs = require('fs');

// List of components that need language toggle buttons
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
  'role-details/role-details.component.html',
  'settings/settings.component.html',
  'user-profile/user-profile.component.html',
  'sustainability/sustainability.component.html'
];

function addLanguageToggleButton(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Check if language toggle is already present
    if (content.includes('app-unified-language-toggle') || content.includes('language-toggle')) {
      return false; // Already has language toggle
    }

    // Add language toggle button at the top of the component
    const languageToggleButton = `
  <!-- Language Toggle Button -->
  <div class="language-toggle-container">
    <button 
      class="language-toggle-btn" 
      (click)="toggleLanguage()"
      [class.rtl]="isRTL"
      [title]="getButtonTitle()"
    >
      <span class="language-flag">{{ getLanguageFlag() }}</span>
      <span class="language-text">{{ getLanguageText() }}</span>
    </button>
  </div>

  <style>
    .language-toggle-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }

    .language-toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      backdrop-filter: blur(10px);
    }

    .language-toggle-btn:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .language-flag {
      font-size: 16px;
    }

    .language-toggle-btn.rtl {
      right: auto;
      left: 20px;
    }

    .language-text {
      font-weight: 600;
    }

    /* RTL Support */
    :host-context([dir="rtl"]) .language-toggle-btn {
      right: auto;
      left: 20px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .language-toggle-container {
        top: 15px;
        right: 15px;
      }

      .language-toggle-btn {
        padding: 6px 12px;
        font-size: 13px;
      }

      .language-toggle-btn.rtl {
        right: auto;
        left: 15px;
      }

      .language-text {
        display: none;
      }
    }
  </style>`;

    // Insert the language toggle at the beginning of the template
    if (content.includes('<div') || content.includes('<section') || content.includes('<main')) {
      // Find the first opening tag and insert after it
      const firstTagMatch = content.match(/<[^>]+>/);
      if (firstTagMatch) {
        const insertPosition = firstTagMatch.index + firstTagMatch[0].length;
        content = content.slice(0, insertPosition) + languageToggleButton + content.slice(insertPosition);
        updated = true;
      }
    } else {
      // If no clear structure, add at the beginning
      content = languageToggleButton + content;
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

function addLanguageToggleToAllComponents() {
  console.log('🔧 ADDING LANGUAGE TOGGLE BUTTONS TO ALL COMPONENTS...\n');
  
  let updatedCount = 0;
  let errorCount = 0;
  
  components.forEach(componentPath => {
    const filePath = `src/app/${componentPath}`;
    
    try {
      if (fs.existsSync(filePath)) {
        const wasUpdated = addLanguageToggleButton(filePath);
        if (wasUpdated) {
          console.log(`✅ Added toggle: ${componentPath.split('/').pop()}`);
          updatedCount++;
        } else {
          console.log(`⏭️  Already has toggle: ${componentPath.split('/').pop()}`);
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
  console.log(`\n🎉 Language toggle buttons added to all components!`);
  console.log(`🌍 Each page now has its own language toggle button!`);
}

// Run the script
addLanguageToggleToAllComponents(); 