import { Injectable } from '@angular/core';
import { GlobalLanguageService } from './global-language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EsgIotSmartTechEngineerTranslationService {
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
        console.log('ESG IoT Smart Tech Engineer translations loaded from JSON files:', this.translations);
      }
    } catch (error) {
      console.warn('Failed to load ESG IoT Smart Tech Engineer translations from JSON files:', error);
    }
  }

  private loadFallbackTranslations() {
    this.translations = {
      en: {
        ESG_IOT_SMART_TECH_ENGINEER: {
          // Header and navigation
          PLATFORM_TITLE: "ESG Platform",
          WELCOME_MESSAGE: "Welcome",
          ENGINEER_ROLE: "ESG IoT & Smart Tech Engineer",
          DARK_MODE: "Dark Mode",
          LIGHT_MODE: "Light Mode",
          
          // Sensor data and monitoring
          TEMPERATURE: "Temperature",
          HUMIDITY: "Humidity",
          ENERGY: "Energy",
          SENSORS_ONLINE: "Sensors Online",
          SIMULATE: "Simulate",
          LAST_SYNC: "Last Sync",
          
          // Device status
          DEVICE_STATUS: "Device Status",
          ONLINE: "Online",
          OFFLINE: "Offline",
          RECENT_ALERTS: "Recent Alerts",
          
          // IoT features
          SENSOR_MANAGEMENT: "Sensor Management",
          SENSOR_MANAGEMENT_DESC: "Monitor and control IoT sensors across facilities",
          SMART_ANALYTICS: "Smart Analytics",
          SMART_ANALYTICS_DESC: "AI-powered data analysis and predictive insights",
          ENERGY_OPTIMIZATION: "Energy Optimization",
          ENERGY_OPTIMIZATION_DESC: "Real-time energy consumption optimization",
          ENVIRONMENTAL_MONITORING: "Environmental Monitoring",
          ENVIRONMENTAL_MONITORING_DESC: "Track environmental metrics and compliance",
          PREDICTIVE_MAINTENANCE: "Predictive Maintenance",
          PREDICTIVE_MAINTENANCE_DESC: "AI-driven equipment maintenance predictions",
          SUSTAINABILITY_TRACKING: "Sustainability Tracking",
          SUSTAINABILITY_TRACKING_DESC: "Monitor sustainability goals and metrics",
          
          // Modal and actions
          CLOSE: "Close",
          DETAILS: "Details",
          CHART: "Chart",
          
          // Alerts and notifications
          SENSOR_OFFLINE_ALERT: "Sensor #15 went offline",
          HIGH_TEMPERATURE_ALERT: "High temperature detected in Zone A",
          ENERGY_SPIKE_ALERT: "Energy consumption spike detected",
          MAINTENANCE_DUE_ALERT: "Maintenance due for HVAC system",
          OPTIMIZATION_OPPORTUNITY_ALERT: "Energy optimization opportunity detected",
          
          // Footer
          COPYRIGHT: "© 2024 ESG Platform. All rights reserved.",
          
          // Units and measurements
          DEGREES_CELSIUS: "°C",
          PERCENTAGE: "%",
          KILOWATT_HOURS: "kWh",
          MINUTES_AGO: "min ago",
          
          // Status indicators
          STATUS_ONLINE: "Online",
          STATUS_OFFLINE: "Offline",
          STATUS_WARNING: "Warning",
          STATUS_CRITICAL: "Critical",
          STATUS_OPTIMAL: "Optimal"
        },
        NAVIGATION: {
          DASHBOARD: "Dashboard",
          SENSORS: "Sensors",
          ANALYTICS: "Analytics",
          ENERGY: "Energy",
          ENVIRONMENT: "Environment",
          MAINTENANCE: "Maintenance",
          SETTINGS: "Settings",
          LOGOUT: "Logout"
        }
      },
      ar: {
        ESG_IOT_SMART_TECH_ENGINEER: {
          // Header and navigation
          PLATFORM_TITLE: "منصة البيئية والاجتماعية والحوكمية",
          WELCOME_MESSAGE: "مرحباً",
          ENGINEER_ROLE: "مهندس إنترنت الأشياء والتقنيات الذكية للبيئية والاجتماعية والحوكمية",
          DARK_MODE: "الوضع الداكن",
          LIGHT_MODE: "الوضع الفاتح",
          
          // Sensor data and monitoring
          TEMPERATURE: "درجة الحرارة",
          HUMIDITY: "الرطوبة",
          ENERGY: "الطاقة",
          SENSORS_ONLINE: "أجهزة الاستشعار المتصلة",
          SIMULATE: "محاكاة",
          LAST_SYNC: "آخر مزامنة",
          
          // Device status
          DEVICE_STATUS: "حالة الجهاز",
          ONLINE: "متصل",
          OFFLINE: "غير متصل",
          RECENT_ALERTS: "التنبيهات الأخيرة",
          
          // IoT features
          SENSOR_MANAGEMENT: "إدارة أجهزة الاستشعار",
          SENSOR_MANAGEMENT_DESC: "مراقبة والتحكم في أجهزة استشعار إنترنت الأشياء عبر المرافق",
          SMART_ANALYTICS: "التحليلات الذكية",
          SMART_ANALYTICS_DESC: "تحليل البيانات المدعوم بالذكاء الاصطناعي والرؤى التنبؤية",
          ENERGY_OPTIMIZATION: "تحسين الطاقة",
          ENERGY_OPTIMIZATION_DESC: "تحسين استهلاك الطاقة في الوقت الفعلي",
          ENVIRONMENTAL_MONITORING: "المراقبة البيئية",
          ENVIRONMENTAL_MONITORING_DESC: "تتبع المقاييس البيئية والامتثال",
          PREDICTIVE_MAINTENANCE: "الصيانة التنبؤية",
          PREDICTIVE_MAINTENANCE_DESC: "تنبؤات صيانة المعدات المدعومة بالذكاء الاصطناعي",
          SUSTAINABILITY_TRACKING: "تتبع الاستدامة",
          SUSTAINABILITY_TRACKING_DESC: "مراقبة أهداف الاستدامة والمقاييس",
          
          // Modal and actions
          CLOSE: "إغلاق",
          DETAILS: "التفاصيل",
          CHART: "الرسم البياني",
          
          // Alerts and notifications
          SENSOR_OFFLINE_ALERT: "جهاز الاستشعار رقم 15 غير متصل",
          HIGH_TEMPERATURE_ALERT: "تم اكتشاف درجة حرارة عالية في المنطقة أ",
          ENERGY_SPIKE_ALERT: "تم اكتشاف ارتفاع في استهلاك الطاقة",
          MAINTENANCE_DUE_ALERT: "الصيانة مستحقة لنظام التكييف",
          OPTIMIZATION_OPPORTUNITY_ALERT: "تم اكتشاف فرصة لتحسين الطاقة",
          
          // Footer
          COPYRIGHT: "© 2024 منصة البيئية والاجتماعية والحوكمية. جميع الحقوق محفوظة.",
          
          // Units and measurements
          DEGREES_CELSIUS: "°م",
          PERCENTAGE: "%",
          KILOWATT_HOURS: "كيلوواط ساعة",
          MINUTES_AGO: "دقيقة مضت",
          
          // Status indicators
          STATUS_ONLINE: "متصل",
          STATUS_OFFLINE: "غير متصل",
          STATUS_WARNING: "تحذير",
          STATUS_CRITICAL: "حرج",
          STATUS_OPTIMAL: "مثالي"
        },
        NAVIGATION: {
          DASHBOARD: "لوحة التحكم",
          SENSORS: "أجهزة الاستشعار",
          ANALYTICS: "التحليلات",
          ENERGY: "الطاقة",
          ENVIRONMENT: "البيئة",
          MAINTENANCE: "الصيانة",
          SETTINGS: "الإعدادات",
          LOGOUT: "تسجيل الخروج"
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