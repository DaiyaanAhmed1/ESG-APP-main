import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SustainabilityGoalsRadialTranslationService } from '../../services/sustainability-goals-radial-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sustainability-goals-radial-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="sustainability-goals-radial-language-toggle" 
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
    .sustainability-goals-radial-language-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      margin-left: 1rem;
      backdrop-filter: blur(10px);
    }

    .sustainability-goals-radial-language-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .sustainability-goals-radial-language-toggle:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }

    .sustainability-goals-radial-language-toggle .icon {
      font-size: 1rem;
    }

    /* RTL support */
    .sustainability-goals-radial-language-toggle.rtl .icon {
      margin-left: 0.5rem;
      margin-right: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sustainability-goals-radial-language-toggle {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
        margin-left: 0.5rem;
      }
    }
  `]
})
export class SustainabilityGoalsRadialLanguageToggleComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  isRTL = false;
  private subscription?: Subscription;

  constructor(private translationService: SustainabilityGoalsRadialTranslationService) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.subscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Sustainability Goals Radial language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Sustainability Goals Radial translations not loaded yet');
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleLanguage() {
    this.translationService.toggleLanguage();
  }

  getLanguageFlag(): string {
    return this.currentLanguage === 'en' ? '🇺🇸' : '🇸🇦';
  }

  getLanguageText(): string {
    return this.currentLanguage === 'en' ? 'EN' : 'AR';
  }

  getButtonTitle(): string {
    return this.currentLanguage === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية';
  }
} 