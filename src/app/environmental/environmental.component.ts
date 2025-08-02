import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentalTranslationService } from '../services/environmental-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';
import { Subscription } from 'rxjs';

interface Supplier {
  name: string;
  emissions: number | null;
  status: string;
}
interface Goal {
  name: string;
  progress: number;
  aiInsight: string;
}

@Component({
  selector: 'app-environmental',
  standalone: true,
  imports: [CommonModule, UnifiedLanguageToggleComponent],
  template: `
    <main class="module-main">
      <div class="env-header-row">
        <span class="env-logo">🌱</span>
        <div>
          <h2>{{ getTranslatedText('ENVIRONMENTAL.TITLE') }} <span class="ai-badge">{{ getTranslatedText('ENVIRONMENTAL.AI_BADGE') }}</span></h2>
          <p class="env-desc">{{ getTranslatedText('ENVIRONMENTAL.SUBTITLE') }}</p>
        </div>
        <app-unified-language-toggle></app-unified-language-toggle>
      </div>

      <!-- 1. Carbon Footprint Tracking -->
      <section class="env-section">
        <h3>{{ getTranslatedText('ENVIRONMENTAL.CARBON_FOOTPRINT') }}</h3>
        <div class="carbon-cards">
          <div class="carbon-card">Scope 1: {{scope1}} tCO₂</div>
          <div class="carbon-card">Scope 2: {{scope2}} tCO₂</div>
          <div class="carbon-card">Scope 3: {{scope3}} tCO₂</div>
        </div>
        <div class="carbon-trend-bar">
          <div class="carbon-trend" [style.width.%]="carbonTrend">{{carbonTrend}}% ↓</div>
        </div>
        <div class="ai-insight">AI: Scope 2 emissions down 12% this quarter.</div>
      </section>

      <!-- 2. Energy Consumption Monitoring -->
      <section class="env-section">
        <h3>Energy Consumption Monitoring</h3>
        <div class="energy-cards">
          <div class="energy-card">Renewable: {{energyRenewable}} MWh</div>
          <div class="energy-card">Non-renewable: {{energyNonRenewable}} MWh</div>
        </div>
        <div class="energy-pie">
          <div class="energy-pie-renewable" [style.width.%]="energyRenewablePercent"></div>
          <div class="energy-pie-nonrenewable" [style.width.%]="100-energyRenewablePercent"></div>
        </div>
        <div class="ai-insight">AI: Increase solar share by 10% for savings.</div>
      </section>

      <!-- 3. Water Usage and Waste Management -->
      <section class="env-section">
        <h3>Water Usage & Waste Management</h3>
        <div class="water-cards">
          <div class="water-card">Water: {{waterUsage}} m³</div>
          <div class="water-card">Waste: {{waste}} kg</div>
          <div class="water-card">Recycling: {{recycling}} kg</div>
        </div>
        <div class="ai-insight">AI: High water use in Plant B. Suggested: upgrade to low-flow systems.</div>
      </section>

      <!-- 4. Supply Chain Emissions Tracking -->
      <section class="env-section">
        <h3>Supply Chain Emissions Tracking</h3>
        <table class="supply-table">
          <tr><th>Supplier</th><th>Emissions (tCO₂)</th><th>Status</th></tr>
          <tr *ngFor="let supplier of suppliers">
            <td>{{supplier.name}}</td>
            <td>{{supplier.emissions !== null ? supplier.emissions : 'N/A'}}</td>
            <td>
              <span [ngClass]="{'missing': supplier.emissions === null, 'ok': supplier.emissions !== null}">
                {{supplier.status}}
              </span>
            </td>
          </tr>
        </table>
        <div class="ai-insight">AI: 2 suppliers lack data. Please engage.</div>
      </section>

      <!-- 5. Sustainability Goal Tracking -->
      <section class="env-section">
        <h3>Sustainability Goals</h3>
        <div *ngFor="let goal of goals" class="goal-row">
          <div class="goal-name">{{goal.name}}: {{goal.progress}}%</div>
          <progress [value]="goal.progress" max="100"></progress>
          <div class="ai-insight">AI: {{goal.aiInsight}}</div>
        </div>
      </section>

      <!-- 6. Live IoT Data -->
      <section class="env-iot-section">
        <h3>Live IoT Data <span class="iot-live-dot"></span></h3>
        <div class="env-iot-grid">
          <div class="env-iot-card">
            <b>Energy (kWh)</b>
            <div class="env-iot-value">{{ iotData.energy }}</div>
          </div>
          <div class="env-iot-card">
            <b>Water Usage (m³)</b>
            <div class="env-iot-value">{{ iotData.water }}</div>
          </div>
          <div class="env-iot-card">
            <b>CO₂ Emissions (kg)</b>
            <div class="env-iot-value">{{ iotData.co2 }}</div>
          </div>
        </div>
        <div class="env-iot-updated">Last updated: {{ iotData.lastUpdated | date:'short' }}</div>
      </section>
    </main>
  `,
  styles: [`
    .module-main { padding: 2.5rem; max-width: 1100px; margin: 0 auto; }
    .env-header-row { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1.5rem; }
    .env-logo { font-size: 2.5rem; filter: drop-shadow(0 0 8px #7be495cc); }
    .ai-badge { background: #7be495; color: #205c20; border-radius: 0.7rem; padding: 0.2rem 0.7rem; font-size: 0.95rem; font-weight: 700; margin-left: 0.7rem; }
    .env-desc { color: #388e3c; font-size: 1.1rem; margin-top: 0.2rem; }
    .env-section { background: #f7f8fa; border-radius: 1.2rem; box-shadow: 0 2px 8px 0 #7be49522; padding: 1.5rem 1.2rem; margin-bottom: 2.2rem; }
    .carbon-cards, .energy-cards, .water-cards { display: flex; gap: 1.2rem; margin-bottom: 0.7rem; }
    .carbon-card, .energy-card, .water-card { background: #e0f7fa; border-radius: 0.8rem; padding: 0.8rem 1.2rem; font-weight: 700; color: #205c20; min-width: 120px; text-align: center; }
    .carbon-trend-bar { background: #e0f7fa; border-radius: 0.7rem; height: 1.2rem; margin-bottom: 0.7rem; overflow: hidden; }
    .carbon-trend { background: #7be495; color: #205c20; height: 100%; font-weight: 700; display: flex; align-items: center; padding-left: 0.7rem; transition: width 0.5s; }
    .energy-pie { display: flex; height: 1.2rem; border-radius: 0.7rem; overflow: hidden; margin-bottom: 0.7rem; background: #e0f7fa; }
    .energy-pie-renewable { background: #7be495; height: 100%; transition: width 0.5s; }
    .energy-pie-nonrenewable { background: #388e3c; height: 100%; transition: width 0.5s; }
    .ai-insight { color: #388e3c; font-size: 1.02rem; margin-top: 0.5rem; font-style: italic; }
    .supply-table { width: 100%; border-collapse: collapse; margin-top: 0.7rem; }
    .supply-table th, .supply-table td { border: 1px solid #b2f7ef; padding: 0.5rem 1rem; text-align: center; }
    .supply-table th { background: #e0f7fa; color: #205c20; }
    .supply-table .missing { color: #e84343; font-weight: 700; }
    .supply-table .ok { color: #388e3c; font-weight: 700; }
    .goal-row { margin-bottom: 1.2rem; }
    .goal-name { font-weight: 700; color: #205c20; margin-bottom: 0.2rem; }
    progress { width: 100%; height: 1.1rem; border-radius: 0.7rem; background: #e0f7fa; }
    progress::-webkit-progress-bar { background: #e0f7fa; border-radius: 0.7rem; }
    progress::-webkit-progress-value { background: #7be495; border-radius: 0.7rem; }
    progress::-moz-progress-bar { background: #7be495; border-radius: 0.7rem; }
    .env-iot-section { margin-bottom: 2.2rem; background: #e0f7fa; border-radius: 1.2rem; padding: 1.5rem 1.2rem; box-shadow: 0 2px 8px 0 #7be49522; }
    .env-iot-section h3 { color: #205c20; display: flex; align-items: center; gap: 0.7rem; }
    .iot-live-dot { display: inline-block; width: 0.9rem; height: 0.9rem; border-radius: 50%; background: #7be495; box-shadow: 0 0 8px #7be49588; animation: iot-blink 1.2s infinite alternate; }
    @keyframes iot-blink { 0% { opacity: 1; } 100% { opacity: 0.4; } }
    .env-iot-grid { display: flex; gap: 2.2rem; margin: 1.2rem 0; }
    .env-iot-card { background: #f7f8fa; border-radius: 1.2rem; box-shadow: 0 2px 8px 0 #7be49533; padding: 1.2rem 2rem; min-width: 160px; text-align: center; }
    .env-iot-value { font-size: 1.5rem; font-weight: 800; color: #388e3c; margin-top: 0.5rem; }
    .env-iot-updated { color: #388e3c; font-size: 0.98rem; margin-top: 0.5rem; font-style: italic; }
  `],
})
export class EnvironmentalComponent implements OnInit, OnDestroy {
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  // Carbon Footprint
  scope1 = 320;
  scope2 = 210;
  scope3 = 540;
  carbonTrend = 88;

  // Energy
  energyRenewable = 680;
  energyNonRenewable = 420;
  get energyRenewablePercent() { return Math.round((this.energyRenewable / (this.energyRenewable + this.energyNonRenewable)) * 100); }

  // Water & Waste
  waterUsage = 950;
  waste = 320;
  recycling = 180;

  // Supply Chain
  suppliers: Supplier[] = [
    { name: 'Alpha Steel', emissions: 120, status: 'OK' },
    { name: 'Green Plastics', emissions: null, status: 'Missing' },
    { name: 'EcoTextiles', emissions: 80, status: 'OK' },
    { name: 'LogiTrans', emissions: null, status: 'Missing' },
  ];

  // Goals
  goals: Goal[] = [
    { name: 'Net-zero by 2030', progress: 62, aiInsight: 'On track for net-zero by 2030.' },
    { name: '50% Renewable Energy by 2025', progress: 48, aiInsight: 'Increase renewable share by 8% to stay on track.' },
    { name: 'Reduce Water Usage 20% by 2026', progress: 35, aiInsight: 'Accelerate water-saving initiatives.' },
  ];

  // IoT
  iotData = {
    energy: 0,
    water: 0,
    co2: 0,
    lastUpdated: new Date(),
  };
  private iotInterval: any;

  constructor(private translationService: EnvironmentalTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Environmental language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Environmental translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    this.simulateIoT();
  }

  simulateIoT() {
    const random = (min: number, max: number) => Math.round(min + Math.random() * (max - min));
    this.iotData.energy = random(1200, 1800);
    this.iotData.water = random(800, 1200);
    this.iotData.co2 = random(300, 600);
    this.iotData.lastUpdated = new Date();
    this.iotInterval = setInterval(() => {
      this.iotData.energy = random(1200, 1800);
      this.iotData.water = random(800, 1200);
      this.iotData.co2 = random(300, 600);
      this.iotData.lastUpdated = new Date();
    }, 4000);
  }

  ngOnDestroy() {
    if (this.iotInterval) clearInterval(this.iotInterval);
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