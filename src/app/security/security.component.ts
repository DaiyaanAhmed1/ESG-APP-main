import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { SecurityTranslationService } from '../services/security-translation.service';
import { ThemeService } from '../services/theme.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

interface SecurityMetric {
  id: string;
  title: string;
  value: string | number;
  status: 'secure' | 'warning' | 'critical';
  icon: string;
  description: string;
}

interface SecurityIncident {
  id: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  // Security metrics
  securityMetrics: SecurityMetric[] = [
    {
      id: 'compliance',
      title: 'Compliance Score',
      value: '98%',
      status: 'secure',
      icon: '✅',
      description: 'Overall compliance with security standards'
    },
    {
      id: 'incidents',
      title: 'Security Incidents',
      value: '0',
      status: 'secure',
      icon: '🛡️',
      description: 'Active security incidents'
    },
    {
      id: 'threats',
      title: 'Threats Blocked',
      value: '1,247',
      status: 'secure',
      icon: '🚫',
      description: 'Threats blocked in the last 30 days'
    },
    {
      id: 'backup',
      title: 'Backup Status',
      value: 'Active',
      status: 'secure',
      icon: '💾',
      description: 'Data backup and recovery status'
    },
    {
      id: 'encryption',
      title: 'Encryption',
      value: 'Enabled',
      status: 'secure',
      icon: '🔐',
      description: 'Data encryption status'
    },
    {
      id: 'monitoring',
      title: 'Security Monitoring',
      value: 'Active',
      status: 'secure',
      icon: '👁️',
      description: 'Real-time security monitoring'
    }
  ];

  // Security incidents
  securityIncidents: SecurityIncident[] = [
    {
      id: 1,
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts detected from unknown IP address',
      severity: 'medium',
      status: 'investigating',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      assignedTo: 'Security Team'
    },
    {
      id: 2,
      title: 'Data Access Audit',
      description: 'Unusual data access pattern detected in user accounts',
      severity: 'low',
      status: 'resolved',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T16:30:00Z',
      assignedTo: 'Compliance Team'
    }
  ];

  // Security policies
  securityPolicies = [
    { name: 'Password Policy', status: 'Active', lastUpdated: '2024-01-10' },
    { name: 'Data Classification', status: 'Active', lastUpdated: '2024-01-08' },
    { name: 'Access Control', status: 'Active', lastUpdated: '2024-01-05' },
    { name: 'Incident Response', status: 'Active', lastUpdated: '2024-01-03' }
  ];

  // Security training
  securityTraining = [
    { title: 'Security Awareness', completion: '85%', dueDate: '2024-02-01' },
    { title: 'Data Protection', completion: '92%', dueDate: '2024-02-15' },
    { title: 'Phishing Prevention', completion: '78%', dueDate: '2024-02-28' }
  ];

  constructor(
    private router: Router,
    private translationService: SecurityTranslationService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Security language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Security translations not loaded yet');
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  // Methods
  logout() {
    // Implement logout logic
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'secure':
      case 'resolved':
        return '#10b981';
      case 'warning':
      case 'investigating':
        return '#f59e0b';
      case 'critical':
      case 'open':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  viewIncidentDetails(incident: SecurityIncident) {
    // Implement incident details view
    console.log('Viewing incident:', incident);
  }

  updateSecurityPolicy(policy: any) {
    // Implement policy update
    console.log('Updating policy:', policy);
  }

  viewTrainingProgress(training: any) {
    // Implement training progress view
    console.log('Viewing training:', training);
  }

  exportSecurityReport() {
    // Implement report export
    console.log('Exporting security report');
  }

  refreshSecurityData() {
    // Implement data refresh
    console.log('Refreshing security data');
  }

  // Language toggle methods
  toggleLanguage() {
    this.translationService.toggleLanguage();
  }

  getLanguageFlag(): string {
    return this.translationService.getCurrentLanguage() === 'en' ? '🇺🇸' : '🇸🇦';
  }

  getLanguageText(): string {
    return this.translationService.getCurrentLanguage() === 'en' ? 'English' : 'العربية';
  }

  getButtonTitle(): string {
    return this.translationService.getCurrentLanguage() === 'en' 
      ? 'Switch to Arabic' 
      : 'التبديل إلى الإنجليزية';
  }

  get isRTL(): boolean {
    return this.translationService.isRTL();
  }
} 