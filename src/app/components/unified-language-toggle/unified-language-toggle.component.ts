import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalLanguageService, LanguageState } from '../../services/global-language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unified-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="getButtonClasses()" 
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
    .global-language-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      margin-left: 1rem;
      border: none;
      outline: none;
    }

    .global-language-toggle .icon {
      font-size: 1rem;
    }

    /* Glassmorphism theme (default) */
    .global-language-toggle.glassmorphism-theme {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      backdrop-filter: blur(10px);
    }

    .global-language-toggle.glassmorphism-theme:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .global-language-toggle.glassmorphism-theme:focus {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }

    /* Dark theme */
    .global-language-toggle.dark-theme {
      background: #334155;
      border: 1px solid #475569;
      color: #94a3b8;
    }

    .global-language-toggle.dark-theme:hover {
      background: #475569;
      color: #e2e8f0;
      border-color: #64748b;
    }

    .global-language-toggle.dark-theme:focus {
      box-shadow: 0 0 0 2px #3b82f6;
    }

    /* Light theme */
    .global-language-toggle.light-theme {
      background: transparent;
      border: 1px solid #e2e8f0;
      color: #64748b;
    }

    .global-language-toggle.light-theme:hover {
      background: #f1f5f9;
      color: #334155;
      border-color: #cbd5e1;
    }

    .global-language-toggle.light-theme:focus {
      box-shadow: 0 0 0 2px #3b82f6;
    }

    /* RTL support */
    .global-language-toggle.rtl .icon {
      margin-left: 0.5rem;
      margin-right: 0;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .global-language-toggle {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
        margin-left: 0.5rem;
      }
    }

    /* Animation for language change */
    .global-language-toggle {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0.7;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class UnifiedLanguageToggleComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  isRTL = false;
  displayText: 'full' | 'abbreviated' = 'abbreviated';
  theme: 'light' | 'dark' | 'glassmorphism' = 'glassmorphism';
  private subscription?: Subscription;

  constructor(private globalLanguageService: GlobalLanguageService) {}

  ngOnInit() {
    // Get initial state
    const initialState = this.globalLanguageService.getCurrentLanguageState();
    this.updateState(initialState);

    // Subscribe to language changes
    this.subscription = this.globalLanguageService.getLanguageState$().subscribe((state: LanguageState) => {
      this.updateState(state);
      console.log('Unified language toggle updated:', state);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateState(state: LanguageState): void {
    this.currentLanguage = state.currentLanguage;
    this.isRTL = state.isRTL;
    this.displayText = state.displayText;
    this.theme = state.theme;
  }

  toggleLanguage(): void {
    this.globalLanguageService.toggleLanguage();
  }

  getLanguageFlag(): string {
    return this.globalLanguageService.getLanguageFlag();
  }

  getLanguageText(): string {
    return this.globalLanguageService.getLanguageText();
  }

  getButtonTitle(): string {
    return this.globalLanguageService.getButtonTitle();
  }

  getButtonClasses(): string {
    return this.globalLanguageService.getToggleButtonClasses();
  }
} 