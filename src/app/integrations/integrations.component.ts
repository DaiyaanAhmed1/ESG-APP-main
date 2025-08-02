import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IntegrationsTranslationService } from '../services/integrations-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, UnifiedLanguageToggleComponent],
  template: `
    <div class="integrations-root" [class.rtl]="isRTL">
      <header class="integrations-header">
        <div class="header-content">
          <h1>{{ getTranslatedText('INTEGRATIONS.TITLE') }}</h1>
          <p>{{ getTranslatedText('INTEGRATIONS.SUBTITLE') }}</p>
        </div>
        <app-unified-language-toggle></app-unified-language-toggle>
      </header>
      
      <main class="module-main">
        <div class="module-graph">
          <svg width="200" height="60">
            <polyline points="0,20 40,30 80,50 120,40 160,10 200,30" style="fill:none;stroke:#4bc0c0;stroke-width:3" />
          </svg>
        </div>
        <div class="module-data">
          {{ getTranslatedText('INTEGRATIONS.APIS') }}: 6, {{ getTranslatedText('INTEGRATIONS.SOURCES') }}: 10
        </div>
      </main>
    </div>
  `,
  styles: [`
    .integrations-root {
      min-height: 100vh;
      background: #f8fafc;
      color: #222;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      transition: all 0.3s ease;
    }

    .integrations-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #2563eb;
      margin: 0 0 0.5rem 0;
    }

    .header-content p {
      font-size: 1.1rem;
      color: #64748b;
      margin: 0;
    }

    .module-main { 
      padding: 2rem; 
    }
    
    .module-graph { 
      margin: 1rem 0; 
    }
    
    .module-data { 
      color: #4bc0c0; 
      font-weight: 500; 
    }

    /* RTL Support */
    .integrations-root.rtl {
      direction: rtl;
    }

    .integrations-root.rtl .integrations-header {
      flex-direction: row-reverse;
    }

    .integrations-root.rtl .header-content h1,
    .integrations-root.rtl .header-content p {
      text-align: right;
    }

    /* Dark mode support */
    .integrations-root.dark-mode {
      background: #181828;
      color: #e0e0e0;
    }

    .integrations-root.dark-mode .integrations-header {
      background: #23284a;
      border-bottom-color: #333;
    }

    .integrations-root.dark-mode .header-content h1 {
      color: #7eaaff;
    }

    .integrations-root.dark-mode .header-content p {
      color: #94a3b8;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .integrations-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .header-content h1 {
        font-size: 1.5rem;
      }

      .header-content p {
        font-size: 1rem;
      }
    }
  `]
})
export class IntegrationsComponent implements OnInit, OnDestroy {
  // Translation properties
  currentLanguage = 'en';
  isRTL = false;
  private translationSubscription?: Subscription;

  constructor(private translationService: IntegrationsTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Integrations language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Integrations translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    // Component initialization logic can be added here if needed
  }

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }


} 