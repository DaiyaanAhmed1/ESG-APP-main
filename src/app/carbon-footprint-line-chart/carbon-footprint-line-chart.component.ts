import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CarbonFootprintLineChartTranslationService } from '../services/carbon-footprint-line-chart-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-carbon-footprint-line-chart',
  standalone: true,
  imports: [CommonModule, UnifiedLanguageToggleComponent],
  template: `
    <div class="cfp-card" [class.rtl]="isRTL">
      <div class="cfp-title">
        {{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.TITLE') }}
        <app-unified-language-toggle></app-unified-language-toggle>
      </div>
      <div class="cfp-area-chart-wrap">
        <svg width="100%" height="180" viewBox="0 0 400 180" (mousemove)="onMouseMove($event)" (mouseleave)="hoverIndex=null">
          <!-- Stacked areas -->
          <polygon [attr.points]="getArea(scope3)" fill="#fdba74" fill-opacity="0.35" />
          <polygon [attr.points]="getAreaSum(scope2,scope3)" fill="#2ecc71" fill-opacity="0.35" />
          <polygon [attr.points]="getAreaSum(scope1,scope2,scope3)" fill="#4a6cff" fill-opacity="0.35" />
          <!-- Lines -->
          <polyline [attr.points]="getLine(scope1,scope2,scope3)" fill="none" stroke="#4a6cff" stroke-width="2.5" />
          <polyline [attr.points]="getLine(scope2,scope3)" fill="none" stroke="#2ecc71" stroke-width="2.5" />
          <polyline [attr.points]="getLine(scope3)" fill="none" stroke="#fdba74" stroke-width="2.5" />
          <!-- Tooltip -->
          <g *ngIf="hoverIndex !== null">
            <circle [attr.cx]="40+hoverIndex*40" [attr.cy]="getY(scope1[hoverIndex]+scope2[hoverIndex]+scope3[hoverIndex])" r="7" fill="#4a6cff" />
            <circle [attr.cx]="40+hoverIndex*40" [attr.cy]="getY(scope2[hoverIndex]+scope3[hoverIndex])" r="7" fill="#2ecc71" />
            <circle [attr.cx]="40+hoverIndex*40" [attr.cy]="getY(scope3[hoverIndex])" r="7" fill="#fdba74" />
            <rect [attr.x]="40+hoverIndex*40-30" [attr.y]="getY(scope1[hoverIndex]+scope2[hoverIndex]+scope3[hoverIndex])-60" width="110" height="54" rx="8" fill="#fff" stroke="#e0e7ff" stroke-width="2" />
            <text [attr.x]="40+hoverIndex*40-20" [attr.y]="getY(scope1[hoverIndex]+scope2[hoverIndex]+scope3[hoverIndex])-40" font-size="13" fill="#23284a">{{months[hoverIndex]}}</text>
            <text [attr.x]="40+hoverIndex*40-20" [attr.y]="getY(scope1[hoverIndex]+scope2[hoverIndex]+scope3[hoverIndex])-24" font-size="13" fill="#4a6cff">{{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.SCOPE_1') }}: {{scope1[hoverIndex]}}</text>
            <text [attr.x]="40+hoverIndex*40-20" [attr.y]="getY(scope2[hoverIndex]+scope3[hoverIndex])-8" font-size="13" fill="#2ecc71">{{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.SCOPE_2') }}: {{scope2[hoverIndex]}}</text>
            <text [attr.x]="40+hoverIndex*40-20" [attr.y]="getY(scope3[hoverIndex])+8" font-size="13" fill="#fdba74">{{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.SCOPE_3') }}: {{scope3[hoverIndex]}}</text>
          </g>
          <!-- X axis labels -->
          <g>
            <text *ngFor="let m of months; let i = index" [attr.x]="40+i*40" y="170" font-size="12" fill="#23284a">{{m}}</text>
          </g>
          <!-- Y axis labels -->
          <g>
            <text x="5" y="30" font-size="12" fill="#23284a">{{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.TONNES_CO2_EQUIVALENT') }}</text>
            <text x="5" y="60" font-size="12" fill="#23284a">200</text>
            <text x="5" y="110" font-size="12" fill="#23284a">100</text>
            <text x="5" y="160" font-size="12" fill="#23284a">0</text>
          </g>
        </svg>
        <div class="cfp-legend-row">
          <span class="cfp-legend" style="color:#4a6cff">■ {{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.LEGEND_SCOPE_1') }}</span>
          <span class="cfp-legend" style="color:#2ecc71">■ {{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.LEGEND_SCOPE_2') }}</span>
          <span class="cfp-legend" style="color:#fdba74">■ {{ getTranslatedText('CARBON_FOOTPRINT_LINE_CHART.LEGEND_SCOPE_3') }}</span>
        </div>
      </div>
      <div class="cfp-progress-row">
        <div class="cfp-progress-bar-bg">
          <div class="cfp-progress-bar" [style.width.%]="absPercentChange" [ngClass]="{'down': percentChange < 0, 'up': percentChange > 0}"></div>
        </div>
        <span class="cfp-progress-label" [ngClass]="{'down': percentChange < 0, 'up': percentChange > 0}">
          {{absPercentChange}}% <span *ngIf="percentChange < 0">↓</span><span *ngIf="percentChange > 0">↑</span>
        </span>
      </div>
      <div class="cfp-ai-insight"><i>AI: {{aiInsight}}</i></div>
    </div>
  `,
  styles: [
    `.cfp-card {
      background: #f8fafb;
      border-radius: 18px;
      box-shadow: 0 2px 16px #e0e7ff55;
      padding: 2rem 2rem 1.5rem 2rem;
      min-width: 0;
      min-height: 180px;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      margin: 0 auto;
      max-width: 900px;
    }
    .cfp-title {
      font-size: 1.25em;
      font-weight: 600;
      margin-bottom: 1.1em;
    }
    .cfp-area-chart-wrap { width: 100%; margin-bottom: 1.5em; }
    .cfp-legend-row { display: flex; gap: 1em; margin-top: 0.5em; font-size: 14px; }
    .cfp-legend { font-weight: 600; }
    .cfp-progress-row { display: flex; align-items: center; gap: 1em; margin-bottom: 1.1em; }
    .cfp-progress-bar-bg { background: #e6f7fa; border-radius: 8px; width: 80%; height: 22px; overflow: hidden; margin-right: 1em; flex: 1; }
    .cfp-progress-bar { height: 100%; border-radius: 8px; transition: width 0.7s cubic-bezier(.4,1.4,.6,1); }
    .cfp-progress-bar.down { background: #7be495; }
    .cfp-progress-bar.up { background: #ffb3b3; }
    .cfp-progress-label { font-size: 1.1em; font-weight: 600; margin-left: 0.5em; letter-spacing: 0.5px; }
    .cfp-progress-label.down { color: #2ecc71; }
    .cfp-progress-label.up { color: #e74c3c; }
    .cfp-ai-insight { margin-top: 0.7em; font-size: 1em; color: #7a8a99; }
    @media (max-width: 900px) { .cfp-area-chart-wrap { margin-bottom: 1em; } }
    @media (max-width: 600px) { .cfp-card { padding: 1.1rem 0.5rem 1rem 0.5rem; } .cfp-title { font-size: 1.08em; } }
  `]
})
export class CarbonFootprintLineChartComponent implements OnInit, OnDestroy {
  @Input() darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  scope1 = [120, 130, 110, 140, 135, 125, 150, 145];
  scope2 = [80, 90, 85, 100, 95, 105, 110, 108];
  scope3 = [40, 50, 45, 55, 60, 58, 65, 62];
  percentChange = -12;
  aiInsight = 'Scope 2 emissions down 12% this quarter.';
  hoverIndex: number|null = null;

  constructor(private translationService: CarbonFootprintLineChartTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Carbon Footprint Line Chart language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Carbon Footprint Line Chart translations not loaded yet');
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

  get absPercentChange() {
    return Math.abs(this.percentChange);
  }
  getY(sum: number): number {
    return 170 - (sum/200)*140;
  }
  getLine(arr1: number[], arr2?: number[], arr3?: number[]): string {
    return arr1.map((v,i) => {
      let sum = v;
      if (arr2) sum += arr2[i];
      if (arr3) sum += arr3[i];
      return `${40+i*40},${this.getY(sum)}`;
    }).join(' ');
  }
  getArea(arr: number[]): string {
    let points = arr.map((v,i) => `${40+i*40},${this.getY(v)}`).join(' ');
    return `40,170 ${points} ${40+(arr.length-1)*40},170`;
  }
  getAreaSum(arr1: number[], arr2: number[], arr3?: number[]): string {
    let points = arr1.map((v,i) => {
      let sum = v+arr2[i];
      if (arr3) sum += arr3[i];
      return `${40+i*40},${this.getY(sum)}`;
    }).join(' ');
    return `40,170 ${points} ${40+(arr1.length-1)*40},170`;
  }
  onMouseMove(event: MouseEvent) {
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const idx = Math.round((x-40)/40);
    if (idx >= 0 && idx < this.months.length) this.hoverIndex = idx; else this.hoverIndex = null;
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