import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GlobalTranslationService } from '../../services/global-translation.service';

@Component({
  selector: 'app-global-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="language-toggle-btn" 
      (click)="toggleLanguage()"
      [title]="getButtonTitle()"
      [attr.dir]="isRTL ? 'rtl' : 'ltr'"
    >
      <span class="flag">{{ getLanguageFlag() }}</span>
      <span class="text">{{ getLanguageText() }}</span>
    </button>
  `,
  styles: [`
    .language-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      min-width: 120px;
      justify-content: center;
    }

    .language-toggle-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .language-toggle-btn:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .language-toggle-btn:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .flag {
      font-size: 1.2rem;
      line-height: 1;
    }

    .text {
      font-weight: 600;
    }

    /* RTL specific styles */
    .language-toggle-btn[dir="rtl"] {
      flex-direction: row-reverse;
    }

    /* Dark mode support */
    .dark-mode .language-toggle-btn {
      background: #374151;
      border-color: #4b5563;
      color: #e5e7eb;
    }

    .dark-mode .language-toggle-btn:hover {
      background: #4b5563;
      border-color: #6b7280;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .language-toggle-btn {
        min-width: 100px;
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
      
      .text {
        display: none;
      }
      
      .flag {
        font-size: 1.4rem;
      }
    }

    /* Animation for language change */
    .language-toggle-btn {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class GlobalLanguageToggleComponent implements OnInit, OnDestroy {
  private languageSubscription?: Subscription;

  constructor(private globalTranslationService: GlobalTranslationService) {}

  ngOnInit() {
    // Subscribe to language changes to trigger re-renders
    this.languageSubscription = this.globalTranslationService.getLanguageChange$().subscribe(() => {
      // Component will automatically re-render due to reactive properties
    });
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  toggleLanguage(): void {
    this.globalTranslationService.toggleLanguage();
  }

  getCurrentLanguage(): string {
    return this.globalTranslationService.getCurrentLanguage();
  }

  getLanguageFlag(): string {
    return this.globalTranslationService.getLanguageFlag();
  }

  getLanguageText(): string {
    return this.globalTranslationService.getLanguageText();
  }

  getButtonTitle(): string {
    return this.globalTranslationService.getButtonTitle();
  }

  get isRTL(): boolean {
    return this.globalTranslationService.isRTL();
  }
} 