import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { GovernanceTranslationService } from '../services/governance-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.scss'],
  imports: [CommonModule, UnifiedLanguageToggleComponent]
})
export class GovernanceComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private sub: Subscription = new Subscription();
  
  // Translation properties
  currentLanguage = 'en';
  isRTL = false;
  private translationSubscription?: Subscription;

  // Board Composition Data
  boardMembers = [
    { avatar: '👨‍💼', name: 'Ahmed Al-Rashid', role: 'Chairman', status: 'Independent' },
    { avatar: '👩‍💼', name: 'Sarah Johnson', role: 'CEO', status: 'Executive' },
    { avatar: '👨‍💼', name: 'Mohammed Hassan', role: 'Independent Director', status: 'Independent' },
    { avatar: '👩‍💼', name: 'Fatima Al-Zahra', role: 'Independent Director', status: 'Independent' },
    { avatar: '👨‍💼', name: 'David Chen', role: 'Independent Director', status: 'Independent' },
    { avatar: '👩‍💼', name: 'Aisha Khan', role: 'Independent Director', status: 'Independent' },
    { avatar: '👨‍💼', name: 'Robert Smith', role: 'CFO', status: 'Executive' },
    { avatar: '👩‍💼', name: 'Layla Al-Mansouri', role: 'Independent Director', status: 'Independent' }
  ];

  // Risk Management Data
  highRisks = [
    { title: 'Regulatory Compliance', level: 'High', description: 'New ESG regulations in KSA require immediate attention' },
    { title: 'Data Privacy', level: 'Medium', description: 'PDPL compliance needs enhancement' },
    { title: 'Supply Chain Ethics', level: 'Medium', description: 'Supplier audit reveals potential issues' }
  ];

  antiCorruptionMeasures = [
    { icon: '📋', title: 'Code of Ethics', status: 'Active' },
    { icon: '🎓', title: 'Training Programs', status: 'Completed' },
    { icon: '🔍', title: 'Due Diligence', status: 'Ongoing' },
    { icon: '📞', title: 'Whistleblower Hotline', status: 'Active' }
  ];

  // Policy Management Data
  policies = [
    { title: 'Code of Ethics', status: 'Active', description: 'Comprehensive ethical guidelines for all employees', lastUpdated: '2024-01-15', owner: 'Legal Team', version: 'v3.2' },
    { title: 'ESG Policy', status: 'Active', description: 'Environmental, Social, and Governance framework', lastUpdated: '2024-02-20', owner: 'ESG Team', version: 'v2.1' },
    { title: 'Data Privacy Policy', status: 'Active', description: 'PDPL compliant data protection guidelines', lastUpdated: '2024-03-10', owner: 'IT Security', version: 'v1.8' },
    { title: 'Anti-Corruption Policy', status: 'Active', description: 'Anti-bribery and corruption prevention', lastUpdated: '2024-01-30', owner: 'Compliance', version: 'v2.0' }
  ];

  // Audit Trail Data
  auditActivities = [
    { icon: '📝', title: 'Policy Updated', description: 'ESG Policy updated to include new regulations', time: '2 hours ago', user: 'Sarah Johnson' },
    { icon: '🔍', title: 'Compliance Audit', description: 'Annual compliance audit completed', time: '1 day ago', user: 'Compliance Team' },
    { icon: '📊', title: 'Board Meeting', description: 'Q1 governance review meeting', time: '3 days ago', user: 'Board Secretary' },
    { icon: '🔒', title: 'Security Scan', description: 'Cybersecurity assessment completed', time: '1 week ago', user: 'IT Security' }
  ];

  documents = [
    { icon: '📄', title: 'Board Minutes Q1 2024', size: '2.3 MB', date: '2024-03-31' },
    { icon: '📋', title: 'Compliance Report', size: '1.8 MB', date: '2024-03-28' },
    { icon: '🔒', title: 'Security Audit Report', size: '3.1 MB', date: '2024-03-25' },
    { icon: '📊', title: 'ESG Performance Report', size: '4.2 MB', date: '2024-03-20' }
  ];

  // Privacy & Security Data
  privacyControls = [
    { title: 'Data Encryption', status: 'Active', progress: 95 },
    { title: 'Access Controls', status: 'Active', progress: 88 },
    { title: 'Data Retention', status: 'Active', progress: 92 },
    { title: 'Privacy Training', status: 'Active', progress: 85 }
  ];

  cyberStatus = [
    { icon: '🛡️', title: 'Firewall Status', value: 'Protected' },
    { icon: '🔐', title: 'Encryption', value: 'AES-256' },
    { icon: '👥', title: 'Access Logs', value: 'Monitored' },
    { icon: '🚨', title: 'Incident Response', value: 'Ready' }
  ];

  // Shariah Compliance Data
  shariahBoard = [
    { avatar: '👨‍💼', name: 'Sheikh Abdullah Al-Rashid', role: 'Chairman', expertise: 'Islamic Finance' },
    { avatar: '👨‍💼', name: 'Dr. Mohammed Al-Hassan', role: 'Member', expertise: 'Shariah Law' },
    { avatar: '👨‍💼', name: 'Sheikh Omar Al-Zahra', role: 'Member', expertise: 'Islamic Economics' }
  ];

  constructor(private translationService: GovernanceTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Governance language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Governance translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    this.startAutoUpdates();
  }

  ngAfterViewInit() {
    // Initialize any view-dependent logic
  }

  startAutoUpdates() {
    this.sub.add(interval(30000).subscribe(() => {
      this.updateGovernanceData();
    }));
  }

  updateGovernanceData() {
    // Simulate real-time updates
    console.log('Updating governance data...');
  }

  refreshBoardData() {
    // Refresh board composition data
    console.log('Refreshing board data...');
  }

  addCompensation() {
    // Add new compensation record
    console.log('Adding compensation record...');
  }

  showRiskAlerts() {
    // Show risk alerts modal
    console.log('Showing risk alerts...');
  }

  addPolicy() {
    // Add new policy
    console.log('Adding new policy...');
  }

  exportAuditTrail() {
    // Export audit trail
    console.log('Exporting audit trail...');
  }

  runSecurityScan() {
    // Run security scan
    console.log('Running security scan...');
  }

  runShariahAudit() {
    // Run Shariah compliance audit
    console.log('Running Shariah audit...');
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }


} 