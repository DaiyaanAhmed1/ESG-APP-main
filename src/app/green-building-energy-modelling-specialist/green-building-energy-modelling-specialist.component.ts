import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GreenBuildingEnergyModellingSpecialistTranslationService } from '../services/green-building-energy-modelling-specialist-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-green-building-energy-modelling-specialist',
  standalone: true,
  imports: [CommonModule, UnifiedLanguageToggleComponent],
  template: `
    <div [class.rtl]="isRTL">
      <header class="gbem-header">
        <div class="gbem-header-content">
          <span class="gbem-header-logo">🏢 {{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.PLATFORM_TITLE') }}</span>
          <span class="gbem-header-welcome">{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.WELCOME_MESSAGE') }}, {{ username || 'Specialist' }}! <span class="gbem-header-role">({{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.SPECIALIST_ROLE') }})</span></span>
          <app-unified-language-toggle></app-unified-language-toggle>
        </div>
      </header>
      <div class="gbem-dashboard-main">
        <section class="gbem-hero-section animate-fade-in">
          <div class="gbem-hero-bg"></div>
          <div class="gbem-hero-content">
            <div class="gbem-hero-icon">🏢</div>
            <h1 class="gbem-hero-title animate-slide-in">{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.HERO_TITLE') }}</h1>
            <span class="gbem-hero-role animate-fade-in-delay">{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.HERO_ROLE') }}</span>
            <p class="gbem-hero-lead animate-fade-in-delay2">{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.HERO_LEAD') }}</p>
          </div>
        </section>
        <section class="gbem-features-grid">
          <div class="gbem-feature-card animate-stagger">
            <div class="gbem-feature-icon">💡</div>
            <h2>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.BUILDING_ENERGY_SIMULATION') }}</h2>
            <p>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.BUILDING_ENERGY_SIMULATION_DESC') }}</p>
          </div>
          <div class="gbem-feature-card animate-stagger">
            <div class="gbem-feature-icon">🏅</div>
            <h2>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.GREEN_BUILDING_CERTIFICATION') }}</h2>
            <p>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.GREEN_BUILDING_CERTIFICATION_DESC') }}</p>
          </div>
          <div class="gbem-feature-card animate-stagger">
            <div class="gbem-feature-icon">⚡</div>
            <h2>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.ENERGY_EFFICIENCY_ANALYSIS') }}</h2>
            <p>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.ENERGY_EFFICIENCY_ANALYSIS_DESC') }}</p>
          </div>
          <div class="gbem-feature-card animate-stagger">
            <div class="gbem-feature-icon">🌱</div>
            <h2>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.SUSTAINABLE_MATERIALS') }}</h2>
            <p>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.SUSTAINABLE_MATERIALS_DESC') }}</p>
          </div>
          <div class="gbem-feature-card animate-stagger">
            <div class="gbem-feature-icon">📊</div>
            <h2>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.PERFORMANCE_MONITORING') }}</h2>
            <p>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.PERFORMANCE_MONITORING_DESC') }}</p>
          </div>
          <div class="gbem-feature-card animate-stagger">
            <div class="gbem-feature-icon">🔬</div>
            <h2>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.EMERGING_TECHNOLOGIES') }}</h2>
            <p>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.EMERGING_TECHNOLOGIES_DESC') }}</p>
          </div>
        </section>
      </div>
      <footer class="gbem-footer">
        <div class="gbem-footer-content">
          <span>{{ getTranslatedText('GREEN_BUILDING_ENERGY_MODELLING_SPECIALIST.COPYRIGHT') }}</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .gbem-header {
      width: 100%;
      background: linear-gradient(135deg, #388e3c, #6c63ff);
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
    .gbem-header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .gbem-header-logo {
      font-size: 1.8rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 2px 2px 4px #388e3c88;
    }
    .gbem-header-welcome {
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(90deg, #fff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gbem-header-role {
      font-weight: 700;
      color: #fff;
    }
    .gbem-dashboard-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2.5rem;
      animation: fadeInFeatures 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    .gbem-hero-section {
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
    .gbem-hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
      filter: blur(5px) brightness(0.7);
      z-index: -1;
    }
    .gbem-hero-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      z-index: 1;
    }
    .gbem-hero-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 15px #4bc0c0cc);
    }
    .gbem-hero-title {
      font-size: 2.8rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      color: #fff;
      text-shadow: 2px 2px 4px #388e3c88;
    }
    .gbem-hero-role {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.5px;
      text-shadow: 1px 1px 2px #388e3c88;
    }
    .gbem-hero-lead {
      font-size: 1.1rem;
      color: #fff;
      margin-top: 0.8rem;
      max-width: 800px;
      padding: 0 1rem;
      text-shadow: 1px 1px 2px #388e3c88;
    }
    .gbem-features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.2rem;
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
    }
    .gbem-feature-card {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #388e3c22;
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
    .gbem-feature-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px 0 #388e3c33;
    }
    .gbem-feature-icon {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 0 8px #4bc0c0cc);
    }
    .gbem-footer {
      width: 100%;
      background: linear-gradient(135deg, #388e3c, #6c63ff);
      color: #fff;
      padding: 1.5rem 2rem;
      border-radius: 1.2rem 1.2rem 0 0;
      box-shadow: 0 -4px 16px 0 #388e3c22;
      margin-top: 2rem;
      text-align: center;
      font-size: 0.9rem;
      animation: fadeInFooter 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInFooter {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: none; }
    }
    .gbem-footer-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .gbem-footer-content span {
      color: #e0e7ff;
      font-weight: 500;
    }
  `]
})
export class GreenBuildingEnergyModellingSpecialistComponent implements OnInit, OnDestroy {
  username = '';
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  constructor(private translationService: GreenBuildingEnergyModellingSpecialistTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Green Building Energy Modelling Specialist language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Green Building Energy Modelling Specialist translations not loaded yet');
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