import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovernanceLeadTranslationService } from '../../services/governance-lead-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-governance-lead-sidebar-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="gdash-language-toggle" 
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
    .gdash-language-toggle {
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

    .gdash-language-toggle:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .gdash-language-toggle:focus {
      outline: none;
      box-shadow: 0 0 0 2px #3b82f6;
    }

    .gdash-language-toggle .icon {
      margin-right: 0.75rem;
      font-size: 1rem;
    }

    /* Dark mode styles */
    .gdash-sidenav.dark-mode .gdash-language-toggle {
      color: #94a3b8;
    }

    .gdash-sidenav.dark-mode .gdash-language-toggle:hover {
      background: #334155;
      color: #e2e8f0;
    }

    /* Collapsed state */
    .gdash-sidenav.collapsed .gdash-language-toggle {
      justify-content: center;
      padding: 0.75rem 0.5rem;
    }

    .gdash-sidenav.collapsed .gdash-language-toggle .icon {
      margin-right: 0;
    }


  `]
})
export class GovernanceLeadSidebarLanguageToggleComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  isRTL = false;
  sidebarCollapsed = false;
  private subscription?: Subscription;

  constructor(private translationService: GovernanceLeadTranslationService) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.subscription = this.translationService.getLanguageChange$().subscribe(lang => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Governance Lead language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Governance Lead translations not loaded yet');
      } else {
        console.log('Governance Lead translations loaded successfully');
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