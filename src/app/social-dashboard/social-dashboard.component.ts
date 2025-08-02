import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { GlobalTranslationService } from '../services/global-translation.service';
import { ThemeService } from '../services/theme.service';
import { GlobalLanguageToggleComponent } from '../components/global-language-toggle/global-language-toggle.component';

@Component({
  selector: 'app-social-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GlobalLanguageToggleComponent],
  template: `
    <style>
      .social-root {
        min-height: 100vh;
        background: #f8fafc;
        color: #222;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
        flex-direction: row;
      }
      .edash-sidenav {
        width: 260px;
        background: #fff;
        border-right: 1px solid #ececec;
        box-shadow: 2px 0 8px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: 1000;
        overflow-y: auto;
        overflow-x: hidden;
      transition: background 0.3s, color 0.3s;
    }
      .social-root > .social-main {
        margin-left: 260px;
      }
      .edash-sidenav.dark-mode {
        background: #1a1a2e;
        color: #e0e0e0;
        border-right: 1px solid #333;
      }
      .edash-sidenav-header {
        padding: 2rem 1rem 1rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .edash-logo {
        width: 48px;
        height: 48px;
      margin-bottom: 0.5rem;
      }
      .edash-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #2563eb;
      }
      .edash-sidenav.dark-mode .edash-title {
        color: #7eaaff;
      }
      .edash-nav {
        display: flex;
        flex-direction: column;
      padding: 1rem 0;
        flex: 1 1 auto;
    }
      .edash-nav-link {
      display: flex;
      align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        color: #333;
      text-decoration: none;
        font-weight: 500;
        font-size: 1rem;
        border-right: 3px solid transparent;
        transition: background 0.2s, color 0.2s;
      }
      .edash-nav-link.active {
        background: #e6f0ff;
        color: #2563eb;
        border-right: 3px solid #2563eb;
      }
      .edash-nav-link:hover {
        background: #f3f4f6;
        color: #2563eb;
      }
      .edash-sidenav.dark-mode .edash-nav-link {
        color: #e0e0e0;
      }
      .edash-sidenav.dark-mode .edash-nav-link.active {
        background: #223c2c;
        color: #7eaaff;
        border-right: 3px solid #7eaaff;
      }
      .edash-sidenav.dark-mode .edash-nav-link:hover {
        background: #22223c;
        color: #7eaaff;
      }
      .edash-nav-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 2rem;
      }
      .edash-nav-actions button {
      display: flex;
      align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        border-radius: 6px;
        border: none;
      background: none;
      cursor: pointer;
        transition: background 0.2s, color 0.2s;
        color: #333;
      }
      .edash-nav-actions button:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
      .edash-nav-actions button:hover {
        background: #f3f4f6;
        color: #2563eb;
      }
      .edash-sidenav.dark-mode .edash-nav-actions button {
        color: #e0e0e0;
      }
      .edash-sidenav.dark-mode .edash-nav-actions button:hover {
        background: #23284a;
        color: #7eaaff;
      }
      .edash-nav-actions .icon {
        font-size: 1.2rem;
        display: inline-block;
      }
      .edash-nav-actions .edash-logout {
        color: #dc3545;
        font-weight: 600;
      }
      .edash-sidenav.dark-mode .edash-nav-actions .edash-logout {
        color: #ffb3b3;
      }
      .edash-nav-actions .edash-logout:hover {
        background: #ffe6e6;
        color: #a71d2a;
      }
      .edash-sidenav.dark-mode .edash-nav-actions .edash-logout:hover {
        background: #3a1a1a;
        color: #ff4d4d;
      }
      @media (max-width: 900px) {
        .social-root { flex-direction: column; }
        .edash-sidenav {
          position: static;
          width: 100%;
          height: auto;
          margin-left: 0;
        }
        .social-root > .social-main {
          margin-left: 0;
        }
      }
      .social-main {
      flex: 1;
      padding: 2rem;
        background: #f8fafc;
        transition: background 0.3s, color 0.3s;
      }
      .social-root.dark-mode .social-main {
        background: #181828;
        color: #e0e0e0;
      }
      .social-header {
      display: flex;
      justify-content: space-between;
        align-items: center;
      margin-bottom: 2rem;
    }
      .social-title {
      font-size: 2rem;
      font-weight: 700;
        color: #2563eb;
      }
      .social-root.dark-mode .social-title {
        color: #7eaaff;
      }
      .social-subtitle {
      font-size: 1.1rem;
        color: #666;
      margin-bottom: 2rem;
    }
      .social-root.dark-mode .social-subtitle {
        color: #b0b0b0;
      }
      .social-content {
      background: #fff;
      border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        transition: background 0.3s, color 0.3s;
      }
      .social-root.dark-mode .social-content {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .social-grid {
      display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      margin-bottom: 2rem;
    }
      .social-card {
        background: #f8f9fa;
        border-radius: 12px;
      padding: 1.5rem;
        transition: background 0.3s, color 0.3s;
      }
      .social-root.dark-mode .social-card {
        background: #1a1a2e;
        color: #e0e0e0;
      }
      .social-card h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
        color: #2563eb;
      }
      .social-root.dark-mode .social-card h3 {
        color: #7eaaff;
      }
      .metric-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .metric-label {
        color: #666;
      }
      .social-root.dark-mode .metric-label {
        color: #b0b0b0;
      }
      .metric-value {
        font-weight: 600;
        color: #2563eb;
      }
      .social-root.dark-mode .metric-value {
        color: #7eaaff;
      }
      
      /* RTL Text Support */
      .rtl-text {
        direction: rtl;
        text-align: right;
      }
      
      .ltr-text {
        direction: ltr;
        text-align: left;
      }
    </style>
    <div class="social-root" [class.dark-mode]="darkMode">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.SOCIAL_MANAGER') }}</span>
        </div>
        <nav class="edash-nav">
          <a routerLink="/environmental-dashboard" class="edash-nav-link"><span class="edash-nav-icon">🌍</span><span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.ENVIRONMENTAL') }}</span></a>
          <a routerLink="/social-dashboard" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🤝</span><span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.SOCIAL') }}</span></a>
          <a routerLink="/goverance-dashboard" class="edash-nav-link"><span class="edash-nav-icon">🏛️</span><span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.GOVERNANCE') }}</span></a>
          <div class="edash-nav-actions">
            <app-global-language-toggle></app-global-language-toggle>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav">
              <span class="icon">{{ sidebarCollapsed ? '➡️' : '⬅️' }}</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode">
              <span class="icon">{{ darkMode ? '☀️' : '🌙' }}</span>
              <span *ngIf="!sidebarCollapsed">{{ darkMode ? getTranslatedText('NAVIGATION.LIGHT_MODE') : getTranslatedText('NAVIGATION.DARK_MODE') }}</span>
            </button>
            <button class="edash-logout" (click)="logout()" aria-label="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LOGOUT') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      <main class="social-main">
        <div class="social-header">
          <div>
            <h1 class="social-title">{{ getTranslatedText('SOCIAL_MANAGER.DASHBOARD') }}</h1>
            <p class="social-subtitle">{{ getTranslatedText('SOCIAL_MANAGER.WELCOME_MESSAGE') }}</p>
          </div>
        </div>

        <div class="social-content">
          <div class="social-grid">
            <div class="social-card">
              <h3>👥 {{ getTranslatedText('SOCIAL_MANAGER.EMPLOYEE_ENGAGEMENT') }}</h3>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.SATISFACTION_SCORE') }}</span>
                <span class="metric-value">88%</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.RETENTION_RATE') }}</span>
                <span class="metric-value">94%</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.TRAINING_HOURS') }}</span>
                <span class="metric-value">120 hrs/emp</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.EMPLOYEE_SURVEYS') }}</span>
                <span class="metric-value">95% Response</span>
              </div>
            </div>
            <div class="social-card">
              <h3>🤝 {{ getTranslatedText('SOCIAL_MANAGER.COMMUNITY_IMPACT') }}</h3>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.VOLUNTEER_HOURS') }}</span>
                <span class="metric-value">2,450 hrs</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.CHARITABLE_DONATIONS') }}</span>
                <span class="metric-value">$125K</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.LOCAL_PARTNERSHIPS') }}</span>
                <span class="metric-value">15</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.COMMUNITY_EVENTS') }}</span>
                <span class="metric-value">24/year</span>
              </div>
            </div>
            <div class="social-card">
              <h3>🌱 {{ getTranslatedText('SOCIAL_MANAGER.DIVERSITY_INCLUSION') }}</h3>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.GENDER_DIVERSITY') }}</span>
                <span class="metric-value">52%</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.LEADERSHIP_DIVERSITY') }}</span>
                <span class="metric-value">45%</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.INCLUSION_SCORE') }}</span>
                <span class="metric-value">91%</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.DI_TRAINING') }}</span>
                <span class="metric-value">100% Complete</span>
              </div>
            </div>
            <div class="social-card">
              <h3>📊 {{ getTranslatedText('SOCIAL_MANAGER.SOCIAL_PERFORMANCE') }}</h3>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.SOCIAL_SCORE') }}</span>
                <span class="metric-value">A+</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.STAKEHOLDER_SATISFACTION') }}</span>
                <span class="metric-value">87%</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">{{ getTranslatedText('METRICS.SOCIAL_IMPACT_RATING') }}</span>
                <span class="metric-value">4.2/5</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">Social Compliance:</span>
                <span class="metric-value">98%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})

export class SocialDashboardComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  constructor(
    private router: Router,
    private translationService: GlobalTranslationService
  ) {}

  ngOnInit() {
    // Initialize translation
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    
    this.translationSubscription = this.translationService.getLanguageChange$().subscribe(lang => {
      this.currentLanguage = lang;
      
      console.log('Social Manager language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Social Manager translations not loaded yet');
      } else {
        console.log('Social Manager translations loaded successfully');
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.translationSubscription?.unsubscribe();
  }

  logout() { 
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }
  toggleDarkMode() { this.darkMode = !this.darkMode; }

  getTranslatedText(key: string): string {
    const translated = this.translationService.translate(key);
    if (translated === key) {
      console.warn(`Social Manager translation failed for key: ${key}`);
    }
    return translated;
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