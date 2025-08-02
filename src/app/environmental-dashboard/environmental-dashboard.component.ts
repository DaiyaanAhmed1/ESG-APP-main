import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { SustainabilityTranslationService } from '../services/sustainability-translation.service';
import { ThemeService } from '../services/theme.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';
import { CarbonFootprintLineChartComponent } from '../carbon-footprint-line-chart/carbon-footprint-line-chart.component';
import { SupplyChainAreaChartComponent } from '../supply-chain-area-chart/supply-chain-area-chart.component';
import { SustainabilityGoalsRadialComponent } from '../sustainability-goals-radial/sustainability-goals-radial.component';
@Component({
  selector: 'app-environmental-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CarbonFootprintLineChartComponent,
    SupplyChainAreaChartComponent,
    SustainabilityGoalsRadialComponent,
    UnifiedLanguageToggleComponent
  ],
  template: `
    <style>
      .edash-root {
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
        overflow-y: auto; /* Allow vertical scrolling if content is too tall */
        overflow-x: hidden;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root > .edash-main {
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
      .edash-sidenav-footer {
        margin-top: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .edash-sidenav-toggle, .edash-dark-toggle, .edash-logout {
        background: none;
        border: none;
        color: #333;
        font-size: 1rem;
        padding: 0.5rem 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.2s;
      }
      .edash-sidenav-toggle:hover, .edash-dark-toggle:hover {
        color: #2563eb;
      }
      .edash-sidenav.dark-mode .edash-sidenav-toggle, .edash-sidenav.dark-mode .edash-dark-toggle, .edash-sidenav.dark-mode .edash-logout {
        color: #e0e0e0;
      }
      .edash-main {
        flex: 1;
        padding: 2.5rem 2rem 2rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background: #f8fafc;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .edash-main {
        background: #181828;
        color: #e0e0e0;
      }
      .edash-header-bar {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 2rem;
      }
      .edash-header-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #2563eb;
      }
      .edash-root.dark-mode .edash-header-title {
        color: #7eaaff;
      }
      .edash-header-user {
        font-size: 1.1rem;
        color: #666;
      }
      .edash-root.dark-mode .edash-header-user {
        color: #b0b0b0;
      }
      .edash-summary-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        margin-bottom: 2.5rem;
      }
      .edash-summary-card {
        flex: 1 1 220px;
        min-width: 220px;
        max-width: 260px;
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #ececec;
        position: relative;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .edash-summary-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .edash-summary-icon {
        font-size: 1.6rem;
        margin-bottom: 0.5rem;
      }
      .edash-summary-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }
      .edash-summary-label {
        font-size: 1rem;
        color: #333;
        margin-top: 0.5rem;
      }
      .edash-root.dark-mode .edash-summary-label {
        color: #b0b0b0;
      }
      .edash-trends-section {
        background: #f7f8fa;
        border-radius: 18px;
        padding: 2rem 1.5rem;
        box-shadow: 0 6px 32px rgba(0,0,0,0.07);
        border: 1px solid #ececec;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .edash-trends-section {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .edash-trends-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2563eb;
        margin-bottom: 1rem;
      }
      .edash-root.dark-mode .edash-trends-title {
        color: #7eaaff;
      }
      @media (max-width: 900px) {
        .edash-root { flex-direction: column; }
        .edash-sidenav {
          position: static;
          width: 100%;
          height: auto;
          margin-left: 0;
        }
        .edash-root > .edash-main {
          margin-left: 0;
        }
        .edash-summary-row { flex-direction: column; gap: 1rem; }
        .edash-summary-card { max-width: 100%; width: 100%; }
      }
      .edash-sidenav-footer button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        border: none;
        background: none;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
      }
      .edash-sidenav-footer button:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
      .edash-sidenav-footer button:hover {
        background: #f3f4f6;
        color: #2563eb;
      }
      .edash-sidenav.dark-mode .edash-sidenav-footer button:hover {
        background: #23284a;
        color: #7eaaff;
      }
      .edash-sidenav-footer .icon {
        font-size: 1.2rem;
        display: inline-block;
      }
      .edash-logout {
        color: #dc3545;
        font-weight: 600;
      }
      .edash-sidenav.dark-mode .edash-logout {
        color: #ffb3b3;
      }
      .edash-logout:hover {
        background: #ffe6e6;
        color: #a71d2a;
      }
      .edash-sidenav.dark-mode .edash-logout:hover {
        background: #3a1a1a;
        color: #ff4d4d;
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
    </style>
    <div class="edash-root" [class.dark-mode]="darkMode" [class.light-mode]="!darkMode">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">Sustainability Head</span>
        </div>
        <nav class="edash-nav">
        <a routerLink="/environmental-dashboard" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.SUSTAINABILITY_HEAD') }}</span></a>
          <a routerLink="/materiality" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.MATERIALITY_ASSESSMENT') }}</span></a>
          <a routerLink="/team" class="edash-nav-link"><span class="edash-nav-icon">🧑‍🤝‍🧑</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.MANAGE_TEAM') }}</span></a>
          <a routerLink="/initiatives-dashboard" class="edash-nav-link"><span class="edash-nav-icon">📣</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.ESG_INITIATIVE') }}</span></a>
          <a routerLink="/reporting" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.REPORTING_ANALYSIS') }}</span></a>
          
          <a routerLink="/environmental-training" class="edash-nav-link"><span class="edash-nav-icon">🎓</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.TRAINING_DEVELOPMENT') }}</span></a>
          
          <a routerLink="/stakeholder-engagement" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🤝</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.STAKEHOLDER_ENGAGEMENT') }}</span></a>
          <a routerLink="/data-management" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🗄️</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.DATA_MANAGEMENT') }}</span></a>
  
          <div class="edash-nav-actions">
            <app-unified-language-toggle></app-unified-language-toggle>
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
      <main class="edash-main">
        <div class="edash-header-bar">
          <span class="edash-header-title">{{ getTranslatedText('SUSTAINABILITY.DASHBOARD_OVERVIEW') }}</span>
          <span class="edash-header-user">{{ getTranslatedText('SUSTAINABILITY.WELCOME_MESSAGE') }}</span>
        </div>
        <div class="edash-summary-row">
          <div class="edash-summary-card"><span class="edash-summary-icon">🌍</span><span class="edash-summary-value">78</span><span class="edash-summary-label">{{ getTranslatedText('SUSTAINABILITY.TOTAL_ESG_SCORE') }}</span></div>
          <div class="edash-summary-card"><span class="edash-summary-icon">♻️</span><span class="edash-summary-value">1.2 / 1.0 tCO₂e</span><span class="edash-summary-label">{{ getTranslatedText('SUSTAINABILITY.CARBON_FOOTPRINT') }}</span></div>
          <div class="edash-summary-card"><span class="edash-summary-icon">⚡</span><span class="edash-summary-value">150,000</span><span class="edash-summary-label">{{ getTranslatedText('SUSTAINABILITY.ENERGY_CONSUMPTION') }}</span></div>
          <div class="edash-summary-card"><span class="edash-summary-icon">🗑️</span><span class="edash-summary-value">85%</span><span class="edash-summary-label">{{ getTranslatedText('SUSTAINABILITY.WASTE_MANAGEMENT') }}</span></div>
          <div class="edash-summary-card"><span class="edash-summary-icon">💧</span><span class="edash-summary-value">92%</span><span class="edash-summary-label">{{ getTranslatedText('SUSTAINABILITY.WATER_USAGE') }}</span></div>
          <div class="edash-summary-card"><span class="edash-summary-icon">🤝</span><span class="edash-summary-value">88</span><span class="edash-summary-label">{{ getTranslatedText('SUSTAINABILITY.SOCIAL_IMPACT') }}</span></div>
          <div class="edash-summary-card"><span class="edash-summary-icon">🏛️</span><span class="edash-summary-value">95%</span><span class="edash-summary-label">{{ getTranslatedText('SUSTAINABILITY.GOVERNANCE_COMPLIANCE') }}</span></div>
        </div>
        <div class="edash-trends-section">
          <div class="edash-trends-title">{{ getTranslatedText('SUSTAINABILITY.YEAR_OVER_YEAR') }}</div>
          <app-sustainability-goals-radial></app-sustainability-goals-radial>
          <app-carbon-footprint-line-chart></app-carbon-footprint-line-chart>
          <div class="edash-trends-title">{{ getTranslatedText('SUSTAINABILITY.PROGRESS_GOALS') }}</div>
          <app-supply-chain-area-chart></app-supply-chain-area-chart>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .edash-root {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #f7f9ff 0%, #e0e7ff 100%);
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      color: #23284a;
      font-size: 16px;
    }
    .edash-root.dark-mode {
      background: linear-gradient(135deg, #181d2f 0%, #23284a 100%);
      color: #f3f6fa;
    }
    .edash-sidenav {
      background: #23284a;
      color: #fff;
      width: 250px;
      min-width: 250px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: 2px 0 12px 0 #0002;
      padding-bottom: 1.5rem;
      transition: background 0.3s, color 0.3s;
    }
    .edash-root.light-mode .edash-sidenav {
      background: #fff;
      color: #23284a;
      box-shadow: 2px 0 12px 0 #e0e7ff;
    }
    .edash-sidenav.collapsed {
      width: 70px;
      min-width: 70px;
    }
    .edash-sidenav-header {
      display: flex;
      align-items: center;
      padding: 2.2rem 1.2rem 1.2rem 1.2rem;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .edash-logo {
      width: 44px;
      height: 44px;
      margin-right: 0.7rem;
      border-radius: 8px;
      background: #fff;
      object-fit: contain;
    }
    .edash-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
    }
    .edash-root.light-mode .edash-title {
      color: #23284a;
    }
    .edash-nav {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .edash-nav-link {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.9rem 1.2rem;
      border-radius: 8px;
      color: #f3f6fa;
      font-size: 1.13rem;
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
      font-weight: 500;
    }
    .edash-nav-link.active, .edash-nav-link:hover {
      background: #2d3256;
      color: #fff;
    }
    .edash-root.light-mode .edash-nav-link {
      color: #23284a;
    }
    .edash-root.light-mode .edash-nav-link.active, .edash-root.light-mode .edash-nav-link:hover {
      background: #e0e7ff;
      color: #6c63ff;
    }
    .edash-nav-icon {
      font-size: 1.4rem;
    }
    .edash-sidenav-footer {
      margin-top: auto;
      padding: 1.2rem 0.5rem 0 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      align-items: center;
    }
    .edash-sidenav-toggle, .edash-dark-toggle, .edash-logout {
      background: #23284a;
      color: #f3f6fa;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1.2rem;
      font-size: 1.08rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      font-weight: 500;
    }
    .edash-sidenav-toggle:hover, .edash-dark-toggle:hover, .edash-logout:hover {
      background: #2d3256;
    }
    .edash-root.light-mode .edash-sidenav-toggle, .edash-root.light-mode .edash-dark-toggle, .edash-root.light-mode .edash-logout {
      background: #e0e7ff;
      color: #23284a;
    }
    .edash-main {
      flex: 1;
      padding: 2.5rem 2.5rem 5rem 2.5rem;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .edash-root.light-mode .edash-main {
      background: #f7f9ff;
      color: #23284a;
    }
    .edash-header-bar {
      background: none;
      padding: 2.2rem 2.5rem 0.5rem 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }
    .edash-header-title {
      font-size: 2.1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.2rem;
    }
    .edash-root.light-mode .edash-header-title {
      color: #23284a;
    }
    .edash-header-user {
      font-size: 1.1rem;
      color: #bfc8e6;
      margin-bottom: 1.2rem;
    }
    .edash-root.light-mode .edash-header-user {
      color: #4a4a68;
    }
    .edash-metrics-row {
      display: flex;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
      padding: 0 2.5rem;
      align-items: flex-start;
    }
    .edash-metric-card {
      background: #23284a;
      color: #fff;
      border-radius: 14px;
      padding: 1.2rem 2.2rem 1.2rem 1.2rem;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 1.15rem;
      font-weight: 500;
      box-shadow: 0 2px 12px 0 #0001;
      transition: background 0.3s, color 0.3s;
    }
    .edash-root.light-mode .edash-metric-card {
      background: #fff;
      color: #23284a;
      box-shadow: 0 2px 12px 0 #e0e7ff;
    }
    .edash-metric-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .edash-metric-value {
      font-size: 2.1rem;
      font-weight: 700;
      color: #6c63ff;
    }
    .edash-metric-card.green .edash-metric-value { color: #6ee7b7; }
    .edash-metric-card.pink .edash-metric-value { color: #f472b6; }
    .edash-metric-card.yellow .edash-metric-value { color: #fde68a; }
    .edash-metric-card.purple .edash-metric-value { color: #a78bfa; }
    .edash-metric-card.orange .edash-metric-value { color: #fdba74; }
    .edash-metric-label {
      font-size: 1.05rem;
      color: #bfc8e6;
      margin-bottom: 0.3rem;
    }
    .edash-root.light-mode .edash-metric-label {
      color: #4a4a68;
    }
    .edash-metric-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-left: 1.5rem;
      align-items: flex-start;
      justify-content: flex-end;
    }
    .edash-btn {
      border: none;
      border-radius: 6px;
      padding: 0.6rem 1.3rem;
      font-size: 1.05rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      margin-bottom: 0.3rem;
    }
    .edash-btn.blue { background: #2563eb; color: #fff; }
    .edash-btn.gray { background: #444c6e; color: #bfc8e6; }
    .edash-root.light-mode .edash-btn.blue { background: #6c63ff; color: #fff; }
    .edash-root.light-mode .edash-btn.gray { background: #e0e7ff; color: #23284a; }
    .edash-row {
      display: flex;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
      padding: 0 2.5rem;
    }
    .edash-card {
      background: #23284a;
      border-radius: 14px;
      padding: 1.2rem 1.5rem;
      flex: 1;
      min-width: 0;
      box-shadow: 0 2px 12px 0 #0001;
      color: #f3f6fa;
      display: flex;
      flex-direction: column;
      margin-bottom: 0;
      transition: background 0.3s, color 0.3s, box-shadow 0.3s, border 0.3s;
    }
    .edash-card.prominent {
      border: 2px solid #6c63ff;
      box-shadow: 0 4px 24px 0 #6c63ff33;
      z-index: 1;
    }
    .edash-root.light-mode .edash-card {
      background: #fff;
      color: #23284a;
      box-shadow: 0 2px 12px 0 #e0e7ff;
    }
    .edash-root.light-mode .edash-card.prominent {
      border: 2px solid #6c63ff;
      box-shadow: 0 4px 24px 0 #6c63ff33;
    }
    .edash-card-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 1.1rem;
      color: #fff;
    }
    .edash-root.light-mode .edash-card-title {
      color: #23284a;
    }
    .edash-activity-log, .edash-followups {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 1.05rem;
    }
    .edash-activity-log li, .edash-followups li {
      margin-bottom: 0.7rem;
      color: #bfc8e6;
      display: flex;
      align-items: center;
    }
    .edash-root.light-mode .edash-activity-log li, .edash-root.light-mode .edash-followups li {
      color: #4a4a68;
    }
    .edash-activity-log li strong { color: #fff; }
    .edash-root.light-mode .edash-activity-log li strong { color: #23284a; }
    .edash-followups li { color: #f3f6fa; }
    .edash-root.light-mode .edash-followups li { color: #23284a; }
    .followup-date {
      margin-left: auto;
      color: #bfc8e6;
      font-size: 0.98rem;
    }
    .edash-root.light-mode .followup-date {
      color: #4a4a68;
    }
    .edash-chart-label {
      font-size: 1.05rem;
      color: #bfc8e6;
      margin-top: 0.7rem;
      text-align: center;
    }
    .edash-root.light-mode .edash-chart-label {
      color: #4a4a68;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.5rem;
    }
    .dot.blue { background: #2563eb; }
    .dot.gray { background: #b0b0b0; }
    svg { background: none; }
    .edash-card svg text { font-size: 1.05rem; fill: #bfc8e6; }
    .edash-root.light-mode .edash-card svg text { fill: #4a4a68; }
    .edash-fines-chart { width: 100%; height: 240px; margin-bottom: 0.5rem; }
    .ai-badge {
      display: inline-block;
      background: linear-gradient(90deg, #6c63ff 60%, #43d67c 100%);
      color: #fff;
      font-size: 0.92em;
      font-weight: 600;
      border-radius: 6px;
      padding: 0.1em 0.7em;
      margin-left: 0.4em;
      letter-spacing: 0.5px;
      vertical-align: middle;
    }
    .edash-ai-note {
      font-size: 0.98em;
      color: #bfc8e6;
      margin-top: 0.2em;
      margin-bottom: 0.2em;
    }
    .edash-root.light-mode .edash-ai-note { color: #4a4a68; }
    .donut-chart-container { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.5em; }
    .donut-legend { margin-top: 0.7em; font-size: 1.05em; color: #bfc8e6; display: flex; gap: 1.2em; align-items: center; }
    .legend-dot { display: inline-block; width: 1.1em; height: 1.1em; border-radius: 50%; margin-right: 0.4em; box-shadow: 0 1px 4px #0002; }
    .edash-root.light-mode .donut-legend { color: #4a4a68; }
    .fines-chart-container { width: 100%; display: flex; flex-direction: column; align-items: center; margin-bottom: 0.5em; background: #fff; border-radius: 12px; }
    .fines-grid line { stroke: #e0e7ff; stroke-width: 1; }
    .fines-card { background: #fff; color: #23284a; box-shadow: 0 2px 12px 0 #e0e7ff; border-radius: 12px; }
    .fines-title { color: #23284a; }
    .dark-mode-card { background: #23284a !important; color: #f3f6fa !important; box-shadow: 0 2px 12px 0 #1a1a2a; }
    .dark-mode-title { color: #f3f6fa !important; }
    .dark-mode-fines { background: #23284a !important; }
    .dark-mode-grid line { stroke: #3a4a6e !important; }
    .impact-row { display: flex; flex-wrap: wrap; gap: 1.2rem; margin: 2.2rem 0 0 0; }
    .impact-card { background: #fff; color: #23284a; border-radius: 12px; box-shadow: 0 2px 12px 0 #e0e7ff; padding: 1.2rem 1.5rem; min-width: 220px; flex: 1 1 260px; display: flex; flex-direction: column; align-items: flex-start; }
    .impact-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5em; }
    .impact-value { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.3rem; }
    .impact-desc { font-size: 0.98rem; color: #4a4a68; }
    .iot-badge { display: inline-block; background: linear-gradient(90deg, #43d67c 60%, #6c63ff 100%); color: #fff; font-size: 0.92em; font-weight: 600; border-radius: 6px; padding: 0.1em 0.7em; margin-left: 0.4em; letter-spacing: 0.5px; vertical-align: middle; }
    .iot-status.online { color: #43d67c; font-weight: bold; }
    .dark-mode-impact { background: #23284a !important; color: #f3f6fa !important; box-shadow: 0 2px 12px 0 #1a1a2a; }
    .dark-mode-impact .impact-desc { color: #bfc8e6 !important; }
    .dashboard-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 2rem;
      margin-bottom: 2.5rem;
      width: 100%;
    }
    .metric-chart-card {
      background: #fff;
      color: #23284a;
      border-radius: 16px;
      box-shadow: 0 4px 24px 0 #e0e7ffcc;
      padding: 1.5rem 1.5rem 1.2rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
      min-height: 320px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .metric-chart-card:hover {
      box-shadow: 0 8px 32px 0 #4a6cff33;
      transform: translateY(-4px) scale(1.02);
    }
    .edash-root.dark-mode .metric-chart-card {
      background: #23284a;
      color: #f3f6fa;
      box-shadow: 0 4px 24px 0 #23284a99;
    }
    .metric-chart-title {
      font-size: 1.18em;
      font-weight: 600;
      margin-bottom: 0.7em;
      letter-spacing: 0.2px;
      display: flex;
      align-items: center;
      gap: 0.7em;
    }
    .edash-footer {
      width: 100vw;
      background: #23284a;
      color: #fff;
      font-size: 15px;
      padding: 1.2em 0 1.2em 0;
      text-align: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      box-shadow: 0 -2px 12px #23284a33;
      letter-spacing: 0.5px;
    }
    .edash-footer a { color: #7eaaff; text-decoration: underline; margin: 0 0.7em; }
    .edash-footer .esg-logo { font-weight: bold; color: #43d67c; margin-right: 0.7em; }
    @media (max-width: 900px) {
      .edash-main { padding: 1.2rem 0.5rem 5rem 0.5rem; }
      .dashboard-metrics-grid { gap: 1.2rem; }
      .metric-chart-card { padding: 1rem 0.7rem 1rem 0.7rem; min-height: 260px; }
    }
    @media (max-width: 600px) {
      .dashboard-metrics-grid { grid-template-columns: 1fr; }
      .edash-main { padding: 0.5rem 0.2rem 6rem 0.2rem; }
    }
  `],
})
export class EnvironmentalDashboardComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  currentLanguage = 'en';
  private themeSubscription!: Subscription;
  private translationSubscription?: Subscription;

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: SustainabilityTranslationService
  ) {}
  
  ngOnInit() {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.darkMode = isDark
    );

    // Initialize translation
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    
    this.translationSubscription = this.translationService.getLanguageChange$().subscribe(lang => {
      this.currentLanguage = lang;
      
      console.log('Sustainability language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Sustainability translations not loaded yet');
      } else {
        console.log('Sustainability translations loaded successfully');
      }
    }, 1000);
  }
  
  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    this.translationSubscription?.unsubscribe();
  }
  
  toggleDarkMode() { 
    this.themeService.toggleDarkMode(); 
  }

  getTranslatedText(key: string): string {
    const translated = this.translationService.translate(key);
    if (translated === key) {
      console.warn(`Sustainability translation failed for key: ${key}`);
    }
    return translated;
  }

  finesData = [
    { label: 'Jan', value: 12000 },
    { label: 'Feb', value: 18000 },
    { label: 'Mar', value: 25000 },
    { label: 'Apr', value: 32000 },
    { label: 'May', value: 40000 },
    { label: 'Jun', value: 47000 },
    { label: 'Jul', value: 54000 },
  ];
  finesPoints = [
    { x: 40, y: 180 },
    { x: 90, y: 160 },
    { x: 140, y: 140 },
    { x: 190, y: 120 },
    { x: 240, y: 100 },
    { x: 290, y: 80 },
    { x: 340, y: 60 },
  ];
  tooltipIndex: number | null = null;
  showTooltip(i: number) { this.tooltipIndex = i; }
  hideTooltip() { this.tooltipIndex = null; }

  directPercent = 30;
  indirectPercent = 60;
  otherPercent = 10;

  get finesPolyline(): string {
    return this.finesPoints.map(pt => pt.x + ',' + pt.y).join(' ');
  }

  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  carbonYears = [2022,2023,2024];
  selectedYear = 2024;
  carbonData: Record<string, {scope1:number,scope2:number,scope3:number}[]> = {
    '2022': [
      { scope1: 12000, scope2: 8000, scope3: 21000 },
      { scope1: 12500, scope2: 8200, scope3: 21500 },
      { scope1: 13000, scope2: 8500, scope3: 22000 },
      { scope1: 12800, scope2: 8300, scope3: 21800 },
      { scope1: 12700, scope2: 8100, scope3: 21700 },
      { scope1: 12600, scope2: 8000, scope3: 21600 },
      { scope1: 12500, scope2: 7900, scope3: 21500 },
      { scope1: 12400, scope2: 7800, scope3: 21400 },
      { scope1: 12300, scope2: 7700, scope3: 21300 },
      { scope1: 12200, scope2: 7600, scope3: 21200 },
      { scope1: 12100, scope2: 7500, scope3: 21100 },
      { scope1: 12000, scope2: 7400, scope3: 21000 },
    ],
    '2023': [
      { scope1: 11800, scope2: 7800, scope3: 20800 },
      { scope1: 12000, scope2: 8000, scope3: 21000 },
      { scope1: 12200, scope2: 8200, scope3: 21200 },
      { scope1: 12400, scope2: 8400, scope3: 21400 },
      { scope1: 12600, scope2: 8600, scope3: 21600 },
      { scope1: 12800, scope2: 8800, scope3: 21800 },
      { scope1: 13000, scope2: 9000, scope3: 22000 },
      { scope1: 13200, scope2: 9200, scope3: 22200 },
      { scope1: 13400, scope2: 9400, scope3: 22400 },
      { scope1: 13600, scope2: 9600, scope3: 22600 },
      { scope1: 13800, scope2: 9800, scope3: 22800 },
      { scope1: 14000, scope2: 10000, scope3: 23000 },
    ],
    '2024': [
      { scope1: 14000, scope2: 10000, scope3: 23000 },
      { scope1: 14200, scope2: 10200, scope3: 23200 },
      { scope1: 14400, scope2: 10400, scope3: 23400 },
      { scope1: 14600, scope2: 10600, scope3: 23600 },
      { scope1: 14800, scope2: 10800, scope3: 23800 },
      { scope1: 15000, scope2: 11000, scope3: 24000 },
      { scope1: 15200, scope2: 11200, scope3: 24200 },
      { scope1: 15400, scope2: 11400, scope3: 24400 },
      { scope1: 15600, scope2: 11600, scope3: 24600 },
      { scope1: 15800, scope2: 11800, scope3: 24800 },
      { scope1: 16000, scope2: 12000, scope3: 25000 },
      { scope1: 16200, scope2: 12200, scope3: 25200 },
    ],
  };
  animatedCarbonData = [...this.carbonData[this.selectedYear.toString()]];
  onYearChange() {
    this.animateCarbonChart();
  }
  animateCarbonChart() {
    const target = this.carbonData[this.selectedYear.toString()];
    let frame = 0, frames = 24;
    const start = this.animatedCarbonData.map(d => ({ ...d }));
    const animate = () => {
      frame++;
      this.animatedCarbonData = start.map((d, i) => ({
        scope1: d.scope1 + (target[i].scope1 - d.scope1) * (frame / frames),
        scope2: d.scope2 + (target[i].scope2 - d.scope2) * (frame / frames),
        scope3: d.scope3 + (target[i].scope3 - d.scope3) * (frame / frames),
      }));
      if (frame < frames) requestAnimationFrame(animate);
    };
    animate();
  }



  // Removed animateFinesChart()
  // Removed simulateLiveData()
  // Removed getLinePath()
  // Removed getAreaPath()
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
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