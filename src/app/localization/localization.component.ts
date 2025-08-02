import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { LocalizationTranslationService } from '../services/localization-translation.service';
import { ThemeService } from '../services/theme.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  status: 'active' | 'inactive' | 'pending';
  completion: number;
  lastUpdated: string;
}

interface Region {
  code: string;
  name: string;
  flag: string;
  languages: string[];
  timezone: string;
  currency: string;
  dateFormat: string;
  status: 'active' | 'inactive';
}

interface TranslationProject {
  id: number;
  name: string;
  language: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  progress: number;
  assignedTo?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-localization',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  templateUrl: './localization.component.html',
  styleUrls: ['./localization.component.css']
})
export class LocalizationComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  // Supported languages
  supportedLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      status: 'active',
      completion: 100,
      lastUpdated: '2024-01-15'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      status: 'active',
      completion: 85,
      lastUpdated: '2024-01-14'
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      status: 'inactive',
      completion: 45,
      lastUpdated: '2024-01-10'
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      status: 'pending',
      completion: 20,
      lastUpdated: '2024-01-08'
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      status: 'pending',
      completion: 15,
      lastUpdated: '2024-01-05'
    }
  ];

  // Supported regions
  supportedRegions: Region[] = [
    {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      languages: ['en'],
      timezone: 'UTC-5',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      status: 'active'
    },
    {
      code: 'SA',
      name: 'Saudi Arabia',
      flag: '🇸🇦',
      languages: ['ar'],
      timezone: 'UTC+3',
      currency: 'SAR',
      dateFormat: 'DD/MM/YYYY',
      status: 'active'
    },
    {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      languages: ['fr'],
      timezone: 'UTC+1',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      status: 'inactive'
    },
    {
      code: 'ES',
      name: 'Spain',
      flag: '🇪🇸',
      languages: ['es'],
      timezone: 'UTC+1',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      status: 'inactive'
    }
  ];

  // Translation projects
  translationProjects: TranslationProject[] = [
    {
      id: 1,
      name: 'Dashboard Interface',
      language: 'Arabic',
      status: 'completed',
      progress: 100,
      assignedTo: 'Translation Team',
      dueDate: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      name: 'User Documentation',
      language: 'French',
      status: 'in-progress',
      progress: 65,
      assignedTo: 'Content Team',
      dueDate: '2024-01-25',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Help & Support',
      language: 'Spanish',
      status: 'review',
      progress: 90,
      assignedTo: 'Support Team',
      dueDate: '2024-01-20',
      priority: 'high'
    }
  ];

  // Localization metrics
  localizationMetrics = [
    { metric: 'Supported Languages', value: '5', change: '+2', trend: 'up' },
    { metric: 'Active Regions', value: '2', change: '+1', trend: 'up' },
    { metric: 'Translation Progress', value: '78%', change: '+12%', trend: 'up' },
    { metric: 'RTL Support', value: 'Enabled', change: 'Active', trend: 'stable' }
  ];

  // Cultural adaptation
  culturalAdaptation = [
    { aspect: 'Date Formats', status: 'Complete', lastUpdated: '2024-01-10' },
    { aspect: 'Time Formats', status: 'Complete', lastUpdated: '2024-01-10' },
    { aspect: 'Currency Formats', status: 'Complete', lastUpdated: '2024-01-08' },
    { aspect: 'Number Formats', status: 'Complete', lastUpdated: '2024-01-08' },
    { aspect: 'RTL Support', status: 'Complete', lastUpdated: '2024-01-05' },
    { aspect: 'Font Support', status: 'In Progress', lastUpdated: '2024-01-12' }
  ];

  constructor(
    private router: Router,
    private translationService: LocalizationTranslationService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Localization language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Localization translations not loaded yet');
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
      case 'active':
      case 'completed':
        return '#10b981';
      case 'in-progress':
      case 'review':
        return '#f59e0b';
      case 'inactive':
      case 'pending':
        return '#6b7280';
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
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  addLanguage() {
    console.log('Adding new language');
  }

  removeLanguage(language: Language) {
    console.log('Removing language:', language);
  }

  addRegion() {
    console.log('Adding new region');
  }

  removeRegion(region: Region) {
    console.log('Removing region:', region);
  }

  viewTranslationDetails(project: TranslationProject) {
    console.log('Viewing translation details:', project);
  }

  updateCulturalAspect(aspect: any) {
    console.log('Updating cultural aspect:', aspect);
  }

  exportLocalizationData() {
    console.log('Exporting localization data');
  }

  backupTranslations() {
    console.log('Backing up translations');
  }

  restoreTranslations() {
    console.log('Restoring translations');
  }

  refreshLocalizationData() {
    console.log('Refreshing localization data');
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