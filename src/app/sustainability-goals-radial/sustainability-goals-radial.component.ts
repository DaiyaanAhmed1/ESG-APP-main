import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SustainabilityGoalsRadialTranslationService } from '../services/sustainability-goals-radial-translation.service';
import { SustainabilityGoalsRadialLanguageToggleComponent } from '../components/sustainability-goals-radial-language-toggle/sustainability-goals-radial-language-toggle.component';
@Component({
  selector: 'app-sustainability-goals-radial',
  standalone: true,
  imports: [CommonModule, SustainabilityGoalsRadialLanguageToggleComponent],
  template: `
    <div class="sgr-card" [class.rtl]="isRTL">
      <div class="sgr-title">
        {{ getTranslatedText('SUSTAINABILITY_GOALS_RADIAL.TITLE') }}
        <app-sustainability-goals-radial-language-toggle></app-sustainability-goals-radial-language-toggle>
      </div>
      <div class="sgr-radial-wrap">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <!-- Background circle -->
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e7ff" stroke-width="12" />
          <!-- Progress circle -->
          <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="12" 
                  stroke-dasharray="502.4" [attr.stroke-dashoffset]="502.4 - (502.4 * progress / 100)" 
                  transform="rotate(-90 100 100)" />
          <!-- Center text -->
          <text x="100" y="95" font-size="24" font-weight="bold" fill="#23284a" text-anchor="middle">{{progress}}</text>
          <text x="100" y="115" font-size="14" fill="#23284a" text-anchor="middle">{{ getTranslatedText('SUSTAINABILITY_GOALS_RADIAL.PERCENTAGE') }}</text>
          <!-- Goal categories -->
          <text x="100" y="140" font-size="16" font-weight="500" fill="#10b981" text-anchor="middle">{{ getTranslatedText('SUSTAINABILITY_GOALS_RADIAL.OVERALL_PROGRESS') }}</text>
        </svg>
      </div>
      <div class="sgr-goals-grid">
        <div class="sgr-goal-item">
          <div class="sgr-goal-icon">🌱</div>
          <div class="sgr-goal-info">
            <div class="sgr-goal-name">{{ getTranslatedText('SUSTAINABILITY_GOALS_RADIAL.ENVIRONMENTAL_GOALS') }}</div>
            <div class="sgr-goal-progress">
              <div class="sgr-progress-bar">
                <div class="sgr-progress-fill" [style.width.%]="environmentalProgress"></div>
              </div>
              <span class="sgr-progress-text">{{environmentalProgress}}%</span>
            </div>
          </div>
        </div>
        <div class="sgr-goal-item">
          <div class="sgr-goal-icon">👥</div>
          <div class="sgr-goal-info">
            <div class="sgr-goal-name">{{ getTranslatedText('SUSTAINABILITY_GOALS_RADIAL.SOCIAL_GOALS') }}</div>
            <div class="sgr-goal-progress">
              <div class="sgr-progress-bar">
                <div class="sgr-progress-fill" [style.width.%]="socialProgress"></div>
              </div>
              <span class="sgr-progress-text">{{socialProgress}}%</span>
            </div>
          </div>
        </div>
        <div class="sgr-goal-item">
          <div class="sgr-goal-icon">🏛️</div>
          <div class="sgr-goal-info">
            <div class="sgr-goal-name">{{ getTranslatedText('SUSTAINABILITY_GOALS_RADIAL.GOVERNANCE_GOALS') }}</div>
            <div class="sgr-goal-progress">
              <div class="sgr-progress-bar">
                <div class="sgr-progress-fill" [style.width.%]="governanceProgress"></div>
              </div>
              <span class="sgr-progress-text">{{governanceProgress}}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sgr-status">
        <span class="sgr-status-badge" [ngClass]="getStatusClass()">{{ getTranslatedText('SUSTAINABILITY_GOALS_RADIAL.STATUS_' + getStatus().toUpperCase()) }}</span>
      </div>
      <div class="sgr-ai-insight"><i>AI: {{aiInsight}}</i></div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    .sgr-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 1.5rem;
      color: #fff;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .sgr-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .sgr-radial-wrap {
      margin-bottom: 1.5rem;
    }

    .sgr-radial-wrap svg {
      width: 100%;
      height: 100%;
    }

    .sgr-radial-wrap circle {
      stroke-dasharray: 502.4;
      stroke-dashoffset: 502.4;
      transition: stroke-dashoffset 0.5s ease-in-out;
    }

    .sgr-radial-wrap text {
      font-family: 'Arial', sans-serif;
    }

    .sgr-goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .sgr-goal-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .sgr-goal-icon {
      font-size: 1.5rem;
      color: #10b981;
    }

    .sgr-goal-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .sgr-goal-name {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .sgr-goal-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sgr-progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }

    .sgr-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #43d67c);
      border-radius: 4px;
      transition: width 0.5s ease-in-out;
    }

    .sgr-progress-text {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      min-width: 40px;
    }

    .sgr-status {
      margin-bottom: 1rem;
    }

    .sgr-status-badge {
      background: linear-gradient(90deg, #7b61ff, #43d67c);
      color: #fff;
      font-weight: 600;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .sgr-ai-insight {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      font-style: italic;
      line-height: 1.4;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border-left: 3px solid #10b981;
    }

    /* RTL support */
    .sgr-card.rtl {
      direction: rtl;
    }

    .sgr-card.rtl .sgr-title {
      flex-direction: row-reverse;
    }

    .sgr-card.rtl .sgr-goals-grid {
      direction: rtl;
    }

    .sgr-card.rtl .sgr-goal-item {
      flex-direction: row-reverse;
    }

    .sgr-card.rtl .sgr-ai-insight {
      border-left: none;
      border-right: 3px solid #10b981;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .sgr-card {
        padding: 1rem;
      }
      
      .sgr-title {
        font-size: 1.125rem;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
      
      .sgr-goals-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .sgr-goal-item {
        padding: 0.75rem;
      }
    }

    .ai-badge { 
      background: linear-gradient(90deg,#7b61ff,#43d67c); 
      color: #fff; 
      font-weight: 600; 
      border-radius: 6px; 
      padding: 0.1em 0.7em; 
      margin-left: 0.4em; 
      letter-spacing: 0.5px; 
      vertical-align: middle; 
      font-size: 12px; 
    }
  `]
})
export class SustainabilityGoalsRadialComponent implements OnInit, OnDestroy {
  @Input() darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  // Sustainability Goals Radial properties
  progress = 78; // Overall progress percentage
  environmentalProgress = 85; // Environmental goals progress
  socialProgress = 65; // Social goals progress
  governanceProgress = 82; // Governance goals progress
  aiInsight = 'Overall sustainability progress is at 78%. Environmental goals leading with 85% completion.';
  
  // Legacy properties (keeping for compatibility)
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  netZero = [72, 74, 75, 76, 77, 78, 80, 82];
  greenEnergy = [55, 56, 57, 58, 59, 60, 62, 65];
  wasteReduction = [38, 39, 40, 41, 42, 43, 45, 47];
  hoverIndex: number|null = null;
  lastUpdated = new Date().toLocaleString();
  private intervalId: any;

  constructor(private translationService: SustainabilityGoalsRadialTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Sustainability Goals Radial language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Sustainability Goals Radial translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.lastUpdated = new Date().toLocaleString();
    }, 60000);
  }
  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }
  getLine(data: number[]): string {
    return data.map((v,i) => `${40+i*50},${170-(v/100)*140}`).join(' ');
  }
  onMouseMove(event: MouseEvent) {
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const idx = Math.round((x-40)/50);
    if (idx >= 0 && idx < this.months.length) this.hoverIndex = idx; else this.hoverIndex = null;
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  // Get status class based on overall progress
  getStatusClass(): string {
    if (this.progress >= 90) return 'status-excellent';
    if (this.progress >= 75) return 'status-good';
    if (this.progress >= 60) return 'status-average';
    if (this.progress >= 40) return 'status-needs-improvement';
    return 'status-critical';
  }

  // Get status text based on overall progress
  getStatus(): string {
    if (this.progress >= 90) return 'EXCELLENT';
    if (this.progress >= 75) return 'GOOD';
    if (this.progress >= 60) return 'AVERAGE';
    if (this.progress >= 40) return 'NEEDS_IMPROVEMENT';
    return 'CRITICAL';
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