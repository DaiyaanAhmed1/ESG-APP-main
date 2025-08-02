import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiTranslationService } from '../services/ai-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, UnifiedLanguageToggleComponent],
  template: `
    <main class="module-main" [class.rtl]="isRTL">
      <div class="header-row">
        <div>
          <h2>{{ getTranslatedText('AI.TITLE') }}</h2>
          <p>{{ getTranslatedText('AI.SUBTITLE') }}</p>
        </div>
        <app-unified-language-toggle></app-unified-language-toggle>
      </div>
      <div class="module-graph">
        <svg width="200" height="60"><polyline points="0,10 40,30 80,20 120,50 160,40 200,30" style="fill:none;stroke:#ff9f40;stroke-width:3" /></svg>
      </div>
      <div class="module-data">{{ getTranslatedText('AI.PREDICTIONS') }}: 3, {{ getTranslatedText('AI.ACCURACY') }}: 92%</div>
    </main>
  `,
  styles: [`
    .module-main { padding: 2rem; }
    
    // RTL support
    .module-main.rtl {
      direction: rtl;
      text-align: right;
    }
    
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .module-main.rtl .header-row {
      flex-direction: row-reverse;
    }
    
    .module-graph { margin: 1rem 0; }
    .module-data { color: #ff9f40; font-weight: 500; }
  `]
})
export class AiComponent implements OnInit, OnDestroy {
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  constructor(private translationService: AiTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      console.log('AI language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('AI translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
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