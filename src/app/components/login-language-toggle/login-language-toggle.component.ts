import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginTranslationService } from '../../services/login-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="language-toggle-btn" 
      (click)="toggleLanguage()"

      [class.rtl]="isRTL"
      [title]="getButtonTitle()"
    >
      <span class="language-flag">{{ getLanguageFlag() }}</span>
      <span class="language-text">{{ getLanguageText() }}</span>
    </button>
  `,
  styles: [`
    .language-toggle-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      backdrop-filter: blur(10px);
      z-index: 1000;
    }

    .language-toggle-btn:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .language-flag {
      font-size: 16px;
    }

    .language-toggle-btn.rtl {
      right: auto;
      left: 20px;
    }

    .language-flag {
      font-size: 16px;
    }

    .language-text {
      font-weight: 600;
    }

    /* RTL Support */
    :host-context([dir="rtl"]) .language-toggle-btn {
      right: auto;
      left: 20px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .language-toggle-btn {
        top: 15px;
        right: 15px;
        padding: 6px 12px;
        font-size: 13px;
      }



      .language-toggle-btn.rtl {
        right: auto;
        left: 15px;
      }

      .language-text {
        display: none;
      }
    }
  `]
})
export class LoginLanguageToggleComponent implements OnInit, OnDestroy {
  currentLanguage = 'en';
  isRTL = false;
  private subscription?: Subscription;

  constructor(private translationService: LoginTranslationService) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();
    
    this.subscription = this.translationService.getLanguageChange$().subscribe(lang => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
    });
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