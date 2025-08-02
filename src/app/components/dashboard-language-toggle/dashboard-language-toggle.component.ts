import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardTranslationService } from '../../services/dashboard-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="dashboard-language-toggle" 
      (click)="toggleLanguage()" 
      [class.rtl]="isRTL"
      [attr.aria-label]="getButtonTitle()" 
      [attr.data-title]="getButtonTitle()"
    >
      <span class="icon">{{ getLanguageFlag() }}</span>
      <span>{{ getLanguageText() }}</span>
    </button>
  `,
  styles: [`
    .dashboard-language-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid #e2e8f0;
      color: #64748b;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      margin-left: 1rem;
    }

    .dashboard-language-toggle:hover {
      background: #f1f5f9;
      color: #334155;
      border-color: #cbd5e1;
    }

    .dashboard-language-toggle:focus {
      outline: none;
      box-shadow: 0 0 0 2px #3b82f6;
    }

    .dashboard-language-toggle .icon {
      font-size: 1rem;
    }

    /* Dark mode styles */
    .dark-mode .dashboard-language-toggle {
      color: #94a3b8;
      border-color: #475569;
    }

    .dark-mode .dashboard-language-toggle:hover {
      background: #334155;
      color: #e2e8f0;
      border-color: #64748b;
    }

    /* RTL support */
    .dashboard-language-toggle.rtl .icon {
      margin-left: 0.5rem;
      margin-right: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-language-toggle {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
        margin-left: 0.5rem;
      }
    }
  `]
})
export class DashboardLanguageToggleComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  isRTL = false;
  private subscription?: Subscription;

  constructor(private translationService: DashboardTranslationService) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.subscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Dashboard language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Dashboard translations not loaded yet');
      } else {
        console.log('Dashboard translations loaded successfully');
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleLanguage() {
    this.translationService.toggleLanguage();
  }

  getLanguageFlag(): string {
    return this.currentLanguage === 'en' ? '🇺🇸' : '🇸🇦';
  }

  getLanguageText(): string {
    return this.currentLanguage === 'en' ? 'English' : 'العربية';
  }

  getButtonTitle(): string {
    return this.currentLanguage === 'en'
      ? 'Switch to Arabic'
      : 'التبديل إلى الإنجليزية';
  }
} 