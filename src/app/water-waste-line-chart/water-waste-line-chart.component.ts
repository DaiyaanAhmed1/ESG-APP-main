import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WaterWasteLineChartTranslationService } from '../services/water-waste-line-chart-translation.service';
import { WaterWasteLineChartLanguageToggleComponent } from '../components/water-waste-line-chart-language-toggle/water-waste-line-chart-language-toggle.component';
@Component({
  selector: 'app-water-waste-line-chart',
  standalone: true,
  imports: [CommonModule, WaterWasteLineChartLanguageToggleComponent],
  template: `
    <div class="wwlc-card" [class.rtl]="isRTL">
      <div class="wwlc-title">
        {{ getTranslatedText('WATER_WASTE_LINE_CHART.TITLE') }}
        <app-water-waste-line-chart-language-toggle></app-water-waste-line-chart-language-toggle>
      </div>
      <div class="wwlc-line-chart-wrap">
        <svg width="100%" height="180" viewBox="0 0 400 180" (mousemove)="onMouseMove($event)" (mouseleave)="hoverIndex=null">
          <!-- Water line -->
          <polyline [attr.points]="getLine(waterData)" fill="none" stroke="#3b82f6" stroke-width="3" />
          <!-- Waste line -->
          <polyline [attr.points]="getLine(wasteData)" fill="none" stroke="#ef4444" stroke-width="3" />
          <!-- Water area -->
          <polygon [attr.points]="getArea(waterData)" fill="#3b82f6" fill-opacity="0.2" />
          <!-- Waste area -->
          <polygon [attr.points]="getArea(wasteData)" fill="#ef4444" fill-opacity="0.2" />
          <!-- Tooltip -->
          <g *ngIf="hoverIndex !== null">
            <circle [attr.cx]="40+hoverIndex*40" [attr.cy]="getY(waterData[hoverIndex])" r="6" fill="#3b82f6" />
            <circle [attr.cx]="40+hoverIndex*40" [attr.cy]="getY(wasteData[hoverIndex])" r="6" fill="#ef4444" />
            <rect [attr.x]="40+hoverIndex*40-30" [attr.y]="getY(waterData[hoverIndex])-60" width="110" height="54" rx="8" fill="#fff" stroke="#e0e7ff" stroke-width="2" />
            <text [attr.x]="40+hoverIndex*40-20" [attr.y]="getY(waterData[hoverIndex])-40" font-size="13" fill="#23284a">{{months[hoverIndex]}}</text>
            <text [attr.x]="40+hoverIndex*40-20" [attr.y]="getY(waterData[hoverIndex])-24" font-size="13" fill="#3b82f6">{{ getTranslatedText('WATER_WASTE_LINE_CHART.LEGEND_WATER') }}: {{waterData[hoverIndex]}}</text>
            <text [attr.x]="40+hoverIndex*40-20" [attr.y]="getY(wasteData[hoverIndex])-8" font-size="13" fill="#ef4444">{{ getTranslatedText('WATER_WASTE_LINE_CHART.LEGEND_WASTE') }}: {{wasteData[hoverIndex]}}</text>
          </g>
          <!-- X axis labels -->
          <g>
            <text *ngFor="let m of months; let i = index" [attr.x]="40+i*40" y="170" font-size="12" fill="#23284a">{{m}}</text>
          </g>
          <!-- Y axis labels -->
          <g>
            <text x="5" y="30" font-size="12" fill="#23284a">{{ getTranslatedText('WATER_WASTE_LINE_CHART.CUBIC_METERS') }}</text>
            <text x="5" y="60" font-size="12" fill="#23284a">200</text>
            <text x="5" y="110" font-size="12" fill="#23284a">100</text>
            <text x="5" y="160" font-size="12" fill="#23284a">0</text>
          </g>
        </svg>
        <div class="wwlc-legend-row">
          <span class="wwlc-legend" style="color:#3b82f6">■ {{ getTranslatedText('WATER_WASTE_LINE_CHART.LEGEND_WATER') }}</span>
          <span class="wwlc-legend" style="color:#ef4444">■ {{ getTranslatedText('WATER_WASTE_LINE_CHART.LEGEND_WASTE') }}</span>
        </div>
      </div>
      <div class="wwlc-progress-row">
        <div class="wwlc-progress-bar-bg">
          <div class="wwlc-progress-bar" [style.width.%]="absPercentChange" [ngClass]="{'down': percentChange < 0, 'up': percentChange > 0}"></div>
        </div>
        <span class="wwlc-progress-label" [ngClass]="{'down': percentChange < 0, 'up': percentChange > 0}">
          {{absPercentChange}}% <span *ngIf="percentChange < 0">↓</span><span *ngIf="percentChange > 0">↑</span>
        </span>
      </div>
      <div class="wwlc-ai-insight"><i>AI: {{aiInsight}}</i></div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    .wwlc-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 1.5rem;
      color: #fff;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .wwlc-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .wwlc-line-chart-wrap {
      position: relative;
      width: 100%;
      height: 180px;
      margin-bottom: 1rem;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    .wwlc-legend-row {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
    }

    .wwlc-legend {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .wwlc-progress-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .wwlc-progress-bar-bg {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }

    .wwlc-progress-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .wwlc-progress-bar.down {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .wwlc-progress-bar.up {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .wwlc-progress-label {
      font-size: 0.875rem;
      font-weight: 600;
      min-width: 60px;
      text-align: center;
    }

    .wwlc-progress-label.down {
      color: #fecaca;
    }

    .wwlc-progress-label.up {
      color: #bbf7d0;
    }

    .wwlc-ai-insight {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      font-style: italic;
      line-height: 1.4;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border-left: 3px solid #3b82f6;
    }

    /* RTL support */
    .wwlc-card.rtl {
      direction: rtl;
    }

    .wwlc-card.rtl .wwlc-title {
      flex-direction: row-reverse;
    }

    .wwlc-card.rtl .wwlc-legend-row {
      flex-direction: row-reverse;
    }

    .wwlc-card.rtl .wwlc-ai-insight {
      border-left: none;
      border-right: 3px solid #3b82f6;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .wwlc-card {
        padding: 1rem;
      }
      
      .wwlc-title {
        font-size: 1.125rem;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
      
      .wwlc-legend-row {
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
      }
      
      .wwlc-progress-row {
        flex-direction: column;
        gap: 0.5rem;
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
export class WaterWasteLineChartComponent implements OnInit, OnDestroy {
  @Input() darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  // Water Waste Line Chart properties
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  waterData = [60, 70, 65, 80, 75, 85, 90, 88];
  wasteData = [30, 35, 32, 40, 38, 42, 45, 43];
  hoverIndex: number|null = null;
  percentChange = -12; // Example: 12% decrease
  absPercentChange = 12; // Absolute value for display
  aiInsight = 'Water consumption decreased by 15% compared to last month. Efficiency improvements show positive impact.';
  
  // Legacy properties (keeping for compatibility)
  water = [60, 70, 65, 80, 75, 85, 90, 88];
  waste = [30, 35, 32, 40, 38, 42, 45, 43];
  constructor(private translationService: WaterWasteLineChartTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Water Waste Line Chart language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Water Waste Line Chart translations not loaded yet');
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

  getLine(data: number[]): string {
    // Y axis: 0-100, X: 40 + i*50
    return data.map((v,i) => `${40+i*50},${170-(v/100)*140}`).join(' ');
  }

  getArea(data: number[]): string {
    // Create area polygon for filled area under the line
    const points = data.map((v,i) => `${40+i*50},${170-(v/100)*140}`).join(' ');
    const bottomRight = `${40+(data.length-1)*50},170`;
    const bottomLeft = '40,170';
    return `${bottomLeft} ${points} ${bottomRight}`;
  }

  getY(value: number): number {
    // Convert value to Y coordinate (0-100 scale to 30-170)
    return 170 - (value / 100) * 140;
  }

  onMouseMove(event: MouseEvent) {
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const idx = Math.round((x - 40) / 50);
    if (idx >= 0 && idx < this.months.length) {
      this.hoverIndex = idx;
    } else {
      this.hoverIndex = null;
    }
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