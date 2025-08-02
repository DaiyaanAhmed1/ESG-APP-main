import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { UxTranslationService } from '../services/ux-translation.service';
import { ThemeService } from '../services/theme.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

interface UxMetric {
  id: string;
  title: string;
  value: string | number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  icon: string;
  description: string;
}

interface UserFeedback {
  id: number;
  title: string;
  description: string;
  category: 'usability' | 'design' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'reviewing' | 'implementing' | 'completed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

@Component({
  selector: 'app-ux',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  templateUrl: './ux.component.html',
  styleUrls: ['./ux.component.css']
})
export class UxComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  // UX metrics
  uxMetrics: UxMetric[] = [
    {
      id: 'satisfaction',
      title: 'User Satisfaction',
      value: '4.8/5',
      status: 'excellent',
      icon: '😊',
      description: 'Overall user satisfaction score'
    },
    {
      id: 'engagement',
      title: 'User Engagement',
      value: '87%',
      status: 'excellent',
      icon: '📈',
      description: 'User engagement rate'
    },
    {
      id: 'retention',
      title: 'User Retention',
      value: '92%',
      status: 'excellent',
      icon: '🔄',
      description: 'User retention rate'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '15.3%',
      status: 'good',
      icon: '🎯',
      description: 'User conversion rate'
    },
    {
      id: 'accessibility',
      title: 'Accessibility Score',
      value: '95%',
      status: 'excellent',
      icon: '♿',
      description: 'Accessibility compliance score'
    },
    {
      id: 'performance',
      title: 'Performance Score',
      value: '89%',
      status: 'good',
      icon: '⚡',
      description: 'Application performance score'
    }
  ];

  // User feedback
  userFeedback: UserFeedback[] = [
    {
      id: 1,
      title: 'Mobile Navigation Improvement',
      description: 'Users find the mobile navigation menu difficult to use on smaller screens',
      category: 'usability',
      priority: 'high',
      status: 'reviewing',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      assignedTo: 'UX Team'
    },
    {
      id: 2,
      title: 'Color Contrast Enhancement',
      description: 'Request for better color contrast to improve accessibility',
      category: 'accessibility',
      priority: 'medium',
      status: 'implementing',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T16:30:00Z',
      assignedTo: 'Design Team'
    }
  ];

  // UX analytics
  uxAnalytics = [
    { metric: 'Active Users', value: '1,247', change: '+12%', trend: 'up' },
    { metric: 'Session Duration', value: '8.5 min', change: '+5%', trend: 'up' },
    { metric: 'Bounce Rate', value: '23%', change: '-8%', trend: 'down' },
    { metric: 'Page Views', value: '45,892', change: '+15%', trend: 'up' }
  ];

  // Design system
  designSystem = [
    { component: 'Buttons', status: 'Complete', lastUpdated: '2024-01-10' },
    { component: 'Forms', status: 'In Progress', lastUpdated: '2024-01-08' },
    { component: 'Navigation', status: 'Complete', lastUpdated: '2024-01-05' },
    { component: 'Cards', status: 'Complete', lastUpdated: '2024-01-03' }
  ];

  // User testing
  userTesting = [
    { test: 'Usability Testing', participants: 15, completion: '85%', dueDate: '2024-02-01' },
    { test: 'A/B Testing', participants: 120, completion: '92%', dueDate: '2024-02-15' },
    { test: 'Accessibility Audit', participants: 8, completion: '78%', dueDate: '2024-02-28' }
  ];

  constructor(
    private router: Router,
    private translationService: UxTranslationService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('UX language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('UX translations not loaded yet');
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
      case 'excellent':
      case 'completed':
        return '#10b981';
      case 'good':
      case 'implementing':
        return '#3b82f6';
      case 'warning':
      case 'reviewing':
        return '#f59e0b';
      case 'critical':
      case 'new':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#f97316';
      case 'urgent':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  viewFeedbackDetails(feedback: UserFeedback) {
    console.log('Viewing feedback:', feedback);
  }

  updateDesignComponent(component: any) {
    console.log('Updating component:', component);
  }

  viewTestingProgress(test: any) {
    console.log('Viewing testing:', test);
  }

  exportUxReport() {
    console.log('Exporting UX report');
  }

  refreshUxData() {
    console.log('Refreshing UX data');
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