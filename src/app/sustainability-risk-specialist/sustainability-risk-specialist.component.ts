import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SustainabilityRiskSpecialistTranslationService } from '../services/sustainability-risk-specialist-translation.service';
import { SustainabilityRiskSpecialistLanguageToggleComponent } from '../components/sustainability-risk-specialist-language-toggle/sustainability-risk-specialist-language-toggle.component';

@Component({
  selector: 'app-sustainability-risk-specialist',
  standalone: true,
  imports: [CommonModule, SustainabilityRiskSpecialistLanguageToggleComponent],
  template: `
    <div [class.rtl]="isRTL">
      <header class="src-header">
        <div class="src-header-content">
          <span class="src-header-logo">🛡️ {{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.PLATFORM_TITLE') }}</span>
          <span class="src-header-welcome">{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.WELCOME_MESSAGE') }}, {{ username || 'Specialist' }}! <span class="src-header-role">({{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.SPECIALIST_ROLE') }})</span></span>
          <app-sustainability-risk-specialist-language-toggle></app-sustainability-risk-specialist-language-toggle>
        </div>
      </header>
      <div class="src-dashboard-main">
        <section class="src-hero-section animate-fade-in">
          <div class="src-hero-bg"></div>
          <div class="src-hero-content">
            <div class="src-hero-icon">🛡️</div>
            <h1 class="src-hero-title animate-slide-in">{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.HERO_TITLE') }}</h1>
            <span class="src-hero-role animate-fade-in-delay">{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.HERO_ROLE') }}</span>
            <p class="src-hero-lead animate-fade-in-delay2">{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.HERO_LEAD') }}</p>
          </div>
        </section>
        <section class="src-responsibilities-grid">
          <div class="src-resp-card animate-stagger">
            <div class="src-resp-icon">💻</div>
            <h2>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.DEVELOPING_TECHNOLOGY_STRATEGIES') }}</h2>
            <p>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.DEVELOPING_TECHNOLOGY_STRATEGIES_DESC') }}</p>
          </div>
          <div class="src-resp-card animate-stagger">
            <div class="src-resp-icon">📜</div>
            <h2>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.ENSURING_COMPLIANCE') }}</h2>
            <p>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.ENSURING_COMPLIANCE_DESC') }}</p>
          </div>
          <div class="src-resp-card animate-stagger">
            <div class="src-resp-icon">⚠️</div>
            <h2>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.MANAGING_RISKS') }}</h2>
            <p>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.MANAGING_RISKS_DESC') }}</p>
          </div>
          <div class="src-resp-card animate-stagger">
            <div class="src-resp-icon">🔗</div>
            <h2>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.INTEGRATING_SUSTAINABILITY') }}</h2>
            <p>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.INTEGRATING_SUSTAINABILITY_DESC') }}</p>
          </div>
          <div class="src-resp-card animate-stagger">
            <div class="src-resp-icon">📊</div>
            <h2>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.PROMOTING_TRANSPARENCY') }}</h2>
            <p>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.PROMOTING_TRANSPARENCY_DESC') }}</p>
          </div>
          <div class="src-resp-card animate-stagger">
            <div class="src-resp-icon">🚀</div>
            <h2>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.STAYING_ABREAST_TECHNOLOGIES') }}</h2>
            <p>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.STAYING_ABREAST_TECHNOLOGIES_DESC') }}</p>
          </div>
        </section>
      </div>
      <footer class="src-footer">
        <div class="src-footer-content">
          <span>{{ getTranslatedText('SUSTAINABILITY_RISK_SPECIALIST.COPYRIGHT') }}</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .src-header {
      width: 100%;
      background: linear-gradient(135deg, #2d2e83, #6c63ff);
      color: #fff;
      padding: 1.2rem 2rem;
      border-radius: 0 0 1.2rem 1.2rem;
      box-shadow: 0 4px 16px 0 #6c63ff22;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: fadeInHeader 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInHeader {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: none; }
    }
    .src-header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .src-header-logo {
      font-size: 1.8rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 2px 2px 4px #6c63ff88;
    }
    .src-header-welcome {
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(90deg, #fff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .src-header-role {
      font-weight: 700;
      color: #fff;
    }
    .src-dashboard-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2.5rem;
      animation: fadeInFeatures 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    .src-hero-section {
      position: relative;
      width: 100%;
      height: 300px;
      border-radius: 1.2rem;
      overflow: hidden;
      margin-bottom: 2.5rem;
      box-shadow: 0 8px 32px 0 #6c63ff22;
      animation: fadeInHero 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInHero {
      0% { opacity: 0; transform: translateY(40px); }
      100% { opacity: 1; transform: none; }
    }
    .src-hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('https://images.unsplash.com/photo-1517486803460-6396898505c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
      filter: blur(5px) brightness(0.7);
      z-index: -1;
    }
    .src-hero-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      z-index: 1;
    }
    .src-hero-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 15px #4bc0c0cc);
    }
    .src-hero-title {
      font-size: 2.8rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      color: #fff;
      text-shadow: 2px 2px 4px #6c63ff88;
    }
    .src-hero-role {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.5px;
      text-shadow: 1px 1px 2px #6c63ff88;
    }
    .src-hero-lead {
      font-size: 1.1rem;
      color: #fff;
      margin-top: 0.8rem;
      max-width: 800px;
      padding: 0 1rem;
      text-shadow: 1px 1px 2px #6c63ff88;
    }
    .src-responsibilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.2rem;
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
    }
    .src-resp-card {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      min-width: 320px;
      max-width: 420px;
      width: 100%;
      margin-bottom: 1.5rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInCard {
      0% { opacity: 0; transform: translateY(40px) scale(0.97); }
      100% { opacity: 1; transform: none; }
    }
    .src-resp-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px 0 #6c63ff33;
    }
    .src-resp-icon {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 0 8px #4bc0c0cc);
    }
    .src-footer {
      width: 100%;
      background: linear-gradient(135deg, #2d2e83, #6c63ff);
      color: #fff;
      padding: 1.5rem 2rem;
      border-radius: 1.2rem 1.2rem 0 0;
      box-shadow: 0 -4px 16px 0 #6c63ff22;
      margin-top: 2rem;
      text-align: center;
      font-size: 0.9rem;
      animation: fadeInFooter 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInFooter {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: none; }
    }
    .src-footer-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .src-footer-content span {
      color: #e0e7ff;
      font-weight: 500;
    }
  `]
})
export class SustainabilityRiskSpecialistComponent implements OnInit, OnDestroy {
  username = '';
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  constructor(private translationService: SustainabilityRiskSpecialistTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Sustainability Risk Specialist language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Sustainability Risk Specialist translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    // Component initialization
  }

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