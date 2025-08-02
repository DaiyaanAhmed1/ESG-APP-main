import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IotSensorGaugeTranslationService } from '../services/iot-sensor-gauge-translation.service';
import { IotSensorGaugeLanguageToggleComponent } from '../components/iot-sensor-gauge-language-toggle/iot-sensor-gauge-language-toggle.component';
@Component({
  selector: 'app-iot-sensor-gauge',
  standalone: true,
  imports: [CommonModule, IotSensorGaugeLanguageToggleComponent],
  template: `
    <div class="iot-gauge-card" [class.rtl]="isRTL">
      <div class="iot-gauge-title">
        {{ getTranslatedText('IOT_SENSOR_GAUGE.TITLE') }}
        <app-iot-sensor-gauge-language-toggle></app-iot-sensor-gauge-language-toggle>
      </div>
      <div class="iot-gauge-wrap">
        <svg width="100%" height="200" viewBox="0 0 200 200">
          <!-- Gauge background -->
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e7ff" stroke-width="12" />
          <!-- Gauge fill -->
          <circle cx="100" cy="100" r="80" fill="none" stroke="#4a6cff" stroke-width="12" 
                  stroke-dasharray="502.4" [attr.stroke-dashoffset]="502.4 - (502.4 * value / 100)" 
                  transform="rotate(-90 100 100)" />
          <!-- Center circle -->
          <circle cx="100" cy="100" r="60" fill="#fff" stroke="#e0e7ff" stroke-width="2" />
          <!-- Value text -->
          <text x="100" y="95" font-size="24" font-weight="bold" fill="#23284a" text-anchor="middle">{{value}}</text>
          <text x="100" y="115" font-size="14" fill="#23284a" text-anchor="middle">{{ getTranslatedText('IOT_SENSOR_GAUGE.PERCENTAGE') }}</text>
          <!-- Sensor type -->
          <text x="100" y="140" font-size="16" font-weight="500" fill="#4a6cff" text-anchor="middle">{{ getTranslatedText('IOT_SENSOR_GAUGE.' + sensorType.toUpperCase()) }}</text>
          <!-- Status indicator -->
          <circle cx="100" cy="160" r="8" [attr.fill]="getStatusColor()" />
          <text x="115" y="165" font-size="12" fill="#23284a">{{ getTranslatedText('IOT_SENSOR_GAUGE.STATUS_' + getStatus().toUpperCase()) }}</text>
        </svg>
      </div>
      <div class="iot-gauge-info">
        <div class="iot-gauge-stat">
          <span class="iot-gauge-label">{{ getTranslatedText('IOT_SENSOR_GAUGE.CURRENT_VALUE') }}:</span>
          <span class="iot-gauge-value">{{value}}{{ getTranslatedText('IOT_SENSOR_GAUGE.' + getUnit()) }}</span>
        </div>
        <div class="iot-gauge-stat">
          <span class="iot-gauge-label">{{ getTranslatedText('IOT_SENSOR_GAUGE.TARGET_RANGE') }}:</span>
          <span class="iot-gauge-value">{{min}}-{{max}}{{ getTranslatedText('IOT_SENSOR_GAUGE.' + getUnit()) }}</span>
        </div>
        <div class="iot-gauge-stat">
          <span class="iot-gauge-label">{{ getTranslatedText('IOT_SENSOR_GAUGE.LAST_UPDATE') }}:</span>
          <span class="iot-gauge-value">{{lastUpdate}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    .iot-gauge-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 1.5rem;
      color: #fff;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .iot-gauge-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .iot-gauge-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .iot-gauge-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .iot-gauge-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .iot-gauge-stat:last-child {
      border-bottom: none;
    }

    .iot-gauge-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .iot-gauge-value {
      font-weight: 600;
      font-size: 0.875rem;
    }

    /* RTL support */
    .iot-gauge-card.rtl {
      direction: rtl;
    }

    .iot-gauge-card.rtl .iot-gauge-stat {
      flex-direction: row-reverse;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .iot-gauge-card {
        padding: 1rem;
      }
      
      .iot-gauge-title {
        font-size: 1.125rem;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
      
      .iot-gauge-stat {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }

    .iot-badge { 
      background: linear-gradient(90deg,#43d67c,#7b61ff); 
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
export class IotSensorGaugeComponent implements OnInit, OnDestroy {
  @Input() darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  // IoT Sensor Gauge properties
  value = 75; // Current sensor value
  sensorType = 'TEMPERATURE'; // Current sensor type
  min = 0; // Minimum value
  max = 100; // Maximum value
  lastUpdate = new Date().toLocaleString(); // Last update time
  
  times = ['10:00','10:10','10:20','10:30','10:40','10:50','11:00','11:10'];
  sensorValues = [68, 70, 72, 75, 73, 74, 76, 78];
  hoverIndex: number|null = null;
  lastUpdated = new Date().toLocaleString();
  private intervalId: any;

  constructor(private translationService: IotSensorGaugeTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('IoT Sensor Gauge language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('IoT Sensor Gauge translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.lastUpdated = new Date().toLocaleString();
      // Simulate live data update
      this.sensorValues = this.sensorValues.map(v => v + (Math.random()-0.5)*2).map(v => Math.round(v));
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
    if (idx >= 0 && idx < this.times.length) this.hoverIndex = idx; else this.hoverIndex = null;
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  // Get status color based on value
  getStatusColor(): string {
    if (this.value >= 80) return '#ef4444'; // Critical - red
    if (this.value >= 60) return '#f59e0b'; // Warning - orange
    if (this.value >= 40) return '#10b981'; // Normal - green
    return '#3b82f6'; // Optimal - blue
  }

  // Get status text based on value
  getStatus(): string {
    if (this.value >= 80) return 'CRITICAL';
    if (this.value >= 60) return 'WARNING';
    if (this.value >= 40) return 'NORMAL';
    return 'OPTIMAL';
  }

  // Get unit based on sensor type
  getUnit(): string {
    switch (this.sensorType) {
      case 'TEMPERATURE': return 'CELSIUS';
      case 'HUMIDITY': return 'PERCENTAGE';
      case 'AIR_QUALITY': return 'PPM';
      case 'ENERGY_USAGE': return 'KWH';
      case 'WATER_FLOW': return 'LITERS_PER_MINUTE';
      case 'WASTE_LEVEL': return 'PERCENT_FULL';
      default: return 'PERCENTAGE';
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