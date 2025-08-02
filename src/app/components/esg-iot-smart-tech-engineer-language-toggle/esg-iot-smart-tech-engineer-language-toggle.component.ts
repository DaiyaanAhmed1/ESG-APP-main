import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsgIotSmartTechEngineerTranslationService } from '../../services/esg-iot-smart-tech-engineer-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-esg-iot-smart-tech-engineer-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="esg-iot-smart-tech-engineer-language-toggle" 
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
    .esg-iot-smart-tech-engineer-language-toggle {
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

    .esg-iot-smart-tech-engineer-language-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .esg-iot-smart-tech-engineer-language-toggle:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }

    .esg-iot-smart-tech-engineer-language-toggle .icon {
      font-size: 1rem;
    }

    /* Dark mode styles */
    .dark-mode .esg-iot-smart-tech-engineer-language-toggle {
      background: rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .dark-mode .esg-iot-smart-tech-engineer-language-toggle:hover {
      background: rgba(0, 0, 0, 0.5);
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* RTL support */
    .esg-iot-smart-tech-engineer-language-toggle.rtl .icon {
      margin-left: 0.5rem;
      margin-right: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .esg-iot-smart-tech-engineer-language-toggle {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
        margin-left: 0.5rem;
      }
    }
  `]
})
export class EsgIotSmartTechEngineerLanguageToggleComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  isRTL = false;
  private subscription?: Subscription;

  constructor(private translationService: EsgIotSmartTechEngineerTranslationService) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.subscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('ESG IoT Smart Tech Engineer language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('ESG IoT Smart Tech Engineer translations not loaded yet');
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