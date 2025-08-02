import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SustainabilityTranslationService } from '../../services/sustainability-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sustainability-sidebar-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="edash-language-toggle" 
      (click)="toggleLanguage()" 
      [class.rtl]="isRTL"
      [attr.aria-label]="getButtonTitle()" 
      [attr.data-title]="getButtonTitle()"
    >
      <span class="icon">{{ getLanguageFlag() }}</span>
      <span *ngIf="!sidebarCollapsed">{{ getLanguageText() }}</span>
    </button>
  `,
  styles: [`
    .edash-language-toggle {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .edash-language-toggle:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .edash-language-toggle:focus {
      outline: none;
      box-shadow: 0 0 0 2px #3b82f6;
    }

    .edash-language-toggle .icon {
      margin-right: 0.75rem;
      font-size: 1rem;
    }

    /* Dark mode styles */
    .edash-sidenav.dark-mode .edash-language-toggle {
      color: #94a3b8;
    }

    .edash-sidenav.dark-mode .edash-language-toggle:hover {
      background: #334155;
      color: #e2e8f0;
    }

    /* Collapsed state */
    .edash-sidenav.collapsed .edash-language-toggle {
      justify-content: center;
      padding: 0.75rem 0.5rem;
    }

    .edash-sidenav.collapsed .edash-language-toggle .icon {
      margin-right: 0;
    }


  `]
})
export class SustainabilitySidebarLanguageToggleComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  isRTL = false;
  sidebarCollapsed = false;
  private subscription?: Subscription;

  constructor(private translationService: SustainabilityTranslationService) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.subscription = this.translationService.getLanguageChange$().subscribe(lang => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Sustainability language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Sustainability translations not loaded yet');
      } else {
        console.log('Sustainability translations loaded successfully');
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

  // Method to update sidebar collapsed state
  setSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
} 