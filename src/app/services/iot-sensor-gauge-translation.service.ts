import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IotSensorGaugeTranslationService {
  private currentLanguage = 'en';
  private translations: any = {};
  private languageChange$ = new BehaviorSubject<string>('en');

  constructor(
    private http: HttpClient,
    private globalLanguageService: GlobalLanguageService
  ) {
    this.loadFallbackTranslations();
    this.loadTranslations();
  
    
    // Subscribe to global language changes
    this.globalLanguageService.getLanguageState$().subscribe((state) => {
      this.languageChange$.next(state.currentLanguage);
    });}

  private async loadTranslations() {
    try {
      if (typeof window === 'undefined') {
        console.log('Not in browser environment, using fallback translations');
        return;
      }

      const [enTranslations, arTranslations] = await Promise.all([
        this.http.get('../assets/i18n/en.json').toPromise(),
        this.http.get('../assets/i18n/ar.json').toPromise()
      ]);

      if (enTranslations && arTranslations) {
        this.translations = {
          en: enTranslations,
          ar: arTranslations
        };
        console.log('IoT Sensor Gauge translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load IoT Sensor Gauge translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        IOT_SENSOR_GAUGE: {
          // Chart title and description
          TITLE: "IoT Sensor Gauge",
          SUBTITLE: "Real-time Sensor Monitoring",
          
          // Sensor types
          TEMPERATURE: "Temperature",
          HUMIDITY: "Humidity",
          AIR_QUALITY: "Air Quality",
          ENERGY_USAGE: "Energy Usage",
          WATER_FLOW: "Water Flow",
          WASTE_LEVEL: "Waste Level",
          
          // Units
          CELSIUS: "°C",
          PERCENTAGE: "%",
          PPM: "ppm",
          KWH: "kWh",
          LITERS_PER_MINUTE: "L/min",
          PERCENT_FULL: "% Full",
          
          // Status indicators
          STATUS_NORMAL: "Normal",
          STATUS_WARNING: "Warning",
          STATUS_CRITICAL: "Critical",
          STATUS_OPTIMAL: "Optimal",
          
          // Chart labels
          CURRENT_VALUE: "Current Value",
          TARGET_RANGE: "Target Range",
          SENSOR_STATUS: "Sensor Status",
          LAST_UPDATE: "Last Update",
          
          // IoT features
          REAL_TIME_MONITORING: "Real-time Monitoring",
          SENSOR_DATA: "Sensor Data",
          IOT_CONNECTIVITY: "IoT Connectivity",
          DATA_ANALYTICS: "Data Analytics"
        }
      },
      ar: {
        IOT_SENSOR_GAUGE: {
          // Chart title and description
          TITLE: "مقياس مستشعر إنترنت الأشياء",
          SUBTITLE: "مراقبة المستشعرات في الوقت الفعلي",
          
          // Sensor types
          TEMPERATURE: "درجة الحرارة",
          HUMIDITY: "الرطوبة",
          AIR_QUALITY: "جودة الهواء",
          ENERGY_USAGE: "استهلاك الطاقة",
          WATER_FLOW: "تدفق المياه",
          WASTE_LEVEL: "مستوى النفايات",
          
          // Units
          CELSIUS: "°م",
          PERCENTAGE: "%",
          PPM: "جزء في المليون",
          KWH: "كيلوواط ساعة",
          LITERS_PER_MINUTE: "لتر/دقيقة",
          PERCENT_FULL: "% ممتلئ",
          
          // Status indicators
          STATUS_NORMAL: "عادي",
          STATUS_WARNING: "تحذير",
          STATUS_CRITICAL: "حرج",
          STATUS_OPTIMAL: "مثالي",
          
          // Chart labels
          CURRENT_VALUE: "القيمة الحالية",
          TARGET_RANGE: "النطاق المستهدف",
          SENSOR_STATUS: "حالة المستشعر",
          LAST_UPDATE: "آخر تحديث",
          
          // IoT features
          REAL_TIME_MONITORING: "المراقبة في الوقت الفعلي",
          SENSOR_DATA: "بيانات المستشعر",
          IOT_CONNECTIVITY: "اتصال إنترنت الأشياء",
          DATA_ANALYTICS: "تحليل البيانات"
        }
      }
    };
  }

  getCurrentLanguage(): string {
    return this.globalLanguageService.getCurrentLanguage();
  }

  getLanguageChange$(): Observable<string> {
    return this.languageChange$.asObservable();
  }

  toggleLanguage(): void {
    this.globalLanguageService.toggleLanguage();
  }

  translate(key: string): string {
    try {
      const keys = key.split('.');
      let translation = this.translations[this.currentLanguage];
      
      for (const k of keys) {
        translation = translation[k];
        if (!translation) break;
      }
      
      return translation || key;
    } catch (error) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
  }

  isRTL(): boolean {
    return this.globalLanguageService.isRTL();
  }

  isTranslationsLoaded(): boolean {
    return Object.keys(this.translations).length > 0;
  }

  getTranslations(): any {
    return this.translations;
  }
} 