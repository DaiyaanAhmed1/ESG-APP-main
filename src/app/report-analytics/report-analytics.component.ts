import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalTranslationService } from '../services/global-translation.service';
import { ThemeService } from '../services/theme.service';
import { GlobalLanguageToggleComponent } from '../components/global-language-toggle/global-language-toggle.component';

interface CampaignReport {
  id: number;
  name: string;
  platform: string;
  reach: number;
  impressions: number;
  conversions: number;
  sustainabilityMentions: number;
  climateActionReach: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
}

interface AudienceInsight {
  demographic: string;
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface ContentPerformance {
  id: number;
  title: string;
  type: 'blog' | 'video' | 'infographic';
  reach: number;
  likes: number;
  shares: number;
  watchThroughRate?: number;
  bounceRate?: number;
  ctaConversions: number;
  topic: string;
}

interface BrandSentiment {
  period: string;
  score: number;
  positive: number;
  neutral: number;
  negative: number;
  shareOfVoice: number;
}

interface ComplianceReport {
  id: number;
  disclosure: string;
  status: 'compliant' | 'flagged' | 'pending';
  standard: string;
  lastUpdated: string;
  alerts: string[];
}

interface TeamEfficiency {
  memberName: string;
  campaignsCompleted: number;
  budgetUtilization: number;
  roi: number;
  timelineAdherence: number;
  performanceScore: number;
}

interface LeadConversion {
  source: string;
  leads: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  attribution: string;
}

@Component({
  selector: 'report-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GlobalLanguageToggleComponent],
  template: `
    <style>
      .edash-root {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #222;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        flex-direction: row;
        overflow-x: hidden;
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
        transition: all 0.3s ease;
      }
      
      .edash-sidenav::-webkit-scrollbar {
        width: 6px;
      }
      .edash-sidenav::-webkit-scrollbar-track {
        background: transparent;
      }
      .edash-sidenav::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }
      .edash-sidenav::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      .edash-sidenav.dark-mode::-webkit-scrollbar-thumb {
        background: #475569;
      }
      .edash-sidenav.dark-mode::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
      
      .edash-sidenav.collapsed {
        width: 70px;
      }
      .edash-sidenav.collapsed .edash-nav-link {
        justify-content: center;
        padding: 0.75rem 0.5rem;
      }
      .edash-sidenav.collapsed .edash-nav-icon {
        margin-right: 0;
      }
      .edash-sidenav.collapsed .edash-nav-actions {
        padding: 0 0.5rem 1rem 0.5rem;
      }
      .edash-sidenav.collapsed .edash-nav-actions button {
        justify-content: center;
        padding: 0.5rem;
        width: auto;
      }
      .edash-sidenav.collapsed .edash-nav-actions .icon {
        margin-right: 0;
      }
      
      .edash-sidenav.collapsed .edash-nav-link {
        position: relative;
      }
      .edash-sidenav.collapsed .edash-nav-link:hover::after {
        content: attr(data-title);
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        background: #1f2937;
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 1001;
        margin-left: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .edash-sidenav.collapsed .edash-nav-link span:not(.edash-nav-icon),
      .edash-sidenav.collapsed .edash-nav-actions span:not(.icon) {
        display: none;
      }
      .edash-sidenav.collapsed .edash-title {
        display: none;
      }
      
      .edash-root > .edash-main {
        margin-left: 260px;
        transition: margin-left 0.3s ease;
        width: calc(100% - 260px);
        min-height: 100vh;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        transition: background 0.3s, color 0.3s;
        overflow-x: hidden;
        max-width: 100%;
      }
      .edash-root > .edash-main.sidebar-collapsed {
        margin-left: 70px;
        width: calc(100% - 70px);
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
        background: #dc2626;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
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
        overflow-y: auto;
        max-height: calc(100vh - 200px);
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
        padding: 0 1rem 1rem 1rem;
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
        transition: all 0.2s ease;
        color: #333;
        width: 100%;
        justify-content: flex-start;
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

      .edash-root.dark-mode {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #e0e0e0;
      }
      .edash-root.dark-mode .edash-main {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #e0e0e0;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .header-content h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
        margin-bottom: 0.5rem;
      }
      .edash-root.dark-mode .header-content h1 {
        color: #e0e0e0;
      }
      .header-content p {
        font-size: 1.1rem;
        color: #6b7280;
        margin: 0;
      }
      .edash-root.dark-mode .header-content p {
        color: #9ca3af;
      }
      .header-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .export-btn {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
      }
      .export-btn:hover {
        background: #1d4ed8;
      }
      
      .edash-root.dark-mode .export-btn {
        background: #3b82f6;
        color: white;
      }
      
      .edash-root.dark-mode .export-btn:hover {
        background: #2563eb;
      }

      .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .analytics-section {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #ececec;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .analytics-section {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #e0e0e0;
        border: 1px solid #334155;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }
      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .edash-root.dark-mode .section-title {
        color: #e0e0e0;
      }
      .section-icon {
        font-size: 1.5rem;
      }

      .metric-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .metric-card {
        background: #f8fafc;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        border: 1px solid #e2e8f0;
      }
      .edash-root.dark-mode .metric-card {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border: 1px solid #475569;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .metric-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.25rem;
      }
      .edash-root.dark-mode .metric-value {
        color: #e0e0e0;
      }
      .metric-label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
      }
      .edash-root.dark-mode .metric-label {
        color: #9ca3af;
      }

      .chart-container {
        height: 300px;
        background: #f8fafc;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e2e8f0;
        margin-bottom: 1rem;
      }
      .edash-root.dark-mode .chart-container {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border: 1px solid #475569;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .chart-placeholder {
        text-align: center;
        color: #6b7280;
      }
      .edash-root.dark-mode .chart-placeholder {
        color: #9ca3af;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      .data-table th,
      .data-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      .edash-root.dark-mode .data-table th,
      .edash-root.dark-mode .data-table td {
        border-bottom: 1px solid #374151;
      }
      .data-table th {
        background: #f8fafc;
        font-weight: 600;
        color: #1f2937;
      }
      .edash-root.dark-mode .data-table th {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e0e0e0;
      }
      .data-table tr:hover {
        background: #f8fafc;
      }
      .edash-root.dark-mode .data-table tr:hover {
        background: linear-gradient(135deg, #334155 0%, #475569 100%);
      }

      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
      }
      .status-active {
        background: #dcfce7;
        color: #166534;
      }
      .status-completed {
        background: #dbeafe;
        color: #1e40af;
      }
      .status-paused {
        background: #fef3c7;
        color: #92400e;
      }
      .status-compliant {
        background: #dcfce7;
        color: #166534;
      }
      .status-flagged {
        background: #fee2e2;
        color: #991b1b;
      }
      .status-pending {
        background: #fef3c7;
        color: #92400e;
      }
      .edash-root.dark-mode .status-active {
        background: #166534;
        color: #dcfce7;
      }
      .edash-root.dark-mode .status-completed {
        background: #1e40af;
        color: #dbeafe;
      }
      .edash-root.dark-mode .status-paused {
        background: #92400e;
        color: #fef3c7;
      }
      .edash-root.dark-mode .status-compliant {
        background: #166534;
        color: #dcfce7;
      }
      .edash-root.dark-mode .status-flagged {
        background: #991b1b;
        color: #fee2e2;
      }
      .edash-root.dark-mode .status-pending {
        background: #92400e;
        color: #fef3c7;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }
      .edash-root.dark-mode .progress-bar {
        background: #374151;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #2563eb, #1d4ed8);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .insight-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
      }
      .insight-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      .insight-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .insight-description {
        font-size: 0.9rem;
        opacity: 0.9;
      }
      
      .edash-root.dark-mode .insight-card {
        background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
        color: white;
      }

      .trend-indicator {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .trend-up {
        color: #10b981;
      }
      .trend-down {
        color: #ef4444;
      }
      .trend-stable {
        color: #6b7280;
      }

      @media (max-width: 768px) {
        .analytics-grid {
          grid-template-columns: 1fr;
        }
        .metric-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .dashboard-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
      }
      

    </style>
    <div class="edash-root" [class.dark-mode]="darkMode">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.MARKETING_HEAD') }}</span>
        </div>
        <nav class="edash-nav">
          <a routerLink="/marketing-head" class="edash-nav-link" data-title="Dashboard">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.DASHBOARD') }}</span>
          </a>
          <a routerLink="/marketing-team" class="edash-nav-link" data-title="Team Management">
            <span class="edash-nav-icon">👥</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.TEAM_MANAGEMENT') }}</span>
          </a>
          <a routerLink="/leads" class="edash-nav-link" data-title="Leads">
            <span class="edash-nav-icon">🎯</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.LEADS') }}</span>
          </a>
          
          <a routerLink="/resource-management" class="edash-nav-link" data-title="Resource Management">
            <span class="edash-nav-icon">📦</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.RESOURCE_MANAGEMENT') }}</span>
          </a>
          <a routerLink="/report-analytics" class="edash-nav-link active" data-title="Report & Analytics">
            <span class="edash-nav-icon">📈</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.REPORT_ANALYTICS') }}</span>
          </a>
          
          <a routerLink="/training" class="edash-nav-link" data-title="Training & Develop">
            <span class="edash-nav-icon">🎓</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.TRAINING_DEVELOP') }}</span>
          </a>
          
          <a routerLink="/help-support" class="edash-nav-link" data-title="Help & Support">
            <span class="edash-nav-icon">🆘</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.HELP_SUPPORT') }}</span>
          </a>
          <div class="edash-nav-actions">
            <app-global-language-toggle></app-global-language-toggle>
            <button class="edash-logout" (click)="logout()" aria-label="Logout" data-title="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.LOGOUT') }}</span>
            </button>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav" data-title="Collapse">
              <span class="icon">⬅️</span>
              <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode" data-title="Light Mode">
              <span class="icon">☀️</span>
              <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('NAVIGATION.LIGHT_MODE') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-content">
                    <h1 [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TITLE') }}</h1>
        <p [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.SUBTITLE') }}</p>
          </div>
          <div class="header-actions">
            <button class="export-btn" (click)="exportReport()" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.EXPORT_REPORT') }}</button>
          </div>
        </div>

        <!-- Key Insights -->
        <div class="analytics-section">
          <div class="section-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
            <span class="section-icon">💡</span>
            <span [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.KEY_INSIGHTS') }}</span>
          </div>
          <div class="metric-grid">
            <div class="insight-card">
              <div class="insight-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TOTAL_CAMPAIGN_REACH') }}</div>
              <div class="insight-value">{{ getTotalReach().toLocaleString() }}</div>
              <div class="insight-description" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.ACROSS_ALL_ESG_CAMPAIGNS') }}</div>
            </div>
            <div class="insight-card">
              <div class="insight-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.CONVERSION_RATE') }}</div>
              <div class="insight-value">23%</div>
              <div class="insight-description" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.ESG_CONTENT_PERFORMANCE') }}</div>
            </div>
            <div class="insight-card">
              <div class="insight-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.BRAND_SENTIMENT_SCORE') }}</div>
              <div class="insight-value">8.2/10</div>
              <div class="insight-description" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.POSITIVE_ESG_PERCEPTION') }}</div>
            </div>
            <div class="insight-card">
              <div class="insight-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.ROI') }}</div>
              <div class="insight-value">3.2x</div>
              <div class="insight-description" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.MARKETING_INVESTMENT_RETURN') }}</div>
            </div>
          </div>
        </div>

        <!-- Campaign Performance Reports -->
        <div class="analytics-section">
          <div class="section-title">
            <span class="section-icon">📊</span>
            {{ getTranslatedText('REPORT_ANALYTICS.CAMPAIGN_REPORTS') }}
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-value">{{ getTotalReach() }}</div>
              <div class="metric-label">{{ getTranslatedText('REPORT_ANALYTICS.TOTAL_REACH') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{{ getTotalImpressions() }}</div>
              <div class="metric-label">{{ getTranslatedText('REPORT_ANALYTICS.TOTAL_IMPRESSIONS') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{{ getTotalConversions() }}</div>
              <div class="metric-label">{{ getTranslatedText('REPORT_ANALYTICS.TOTAL_CONVERSIONS') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{{ getSustainabilityMentions() }}</div>
              <div class="metric-label">{{ getTranslatedText('REPORT_ANALYTICS.TOTAL_SUSTAINABILITY_MENTIONS') }}</div>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
              📈 {{ getTranslatedText('REPORT_ANALYTICS.CAMPAIGN_PERFORMANCE_TIMELINE') }}
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ getTranslatedText('REPORT_ANALYTICS.CONTENT_TITLE') }}</th>
                <th>{{ getTranslatedText('REPORT_ANALYTICS.PLATFORM') }}</th>
                <th>{{ getTranslatedText('REPORT_ANALYTICS.REACH') }}</th>
                <th>{{ getTranslatedText('REPORT_ANALYTICS.IMPRESSIONS') }}</th>
                <th>{{ getTranslatedText('REPORT_ANALYTICS.CONVERSIONS') }}</th>
                <th>{{ getTranslatedText('REPORT_ANALYTICS.STATUS') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let campaign of campaignReports">
                <td>{{ campaign.name }}</td>
                <td>{{ campaign.platform }}</td>
                <td>{{ campaign.reach.toLocaleString() }}</td>
                <td>{{ campaign.impressions.toLocaleString() }}</td>
                <td>{{ campaign.conversions.toLocaleString() }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + campaign.status">
                    {{ getTranslatedText('REPORT_ANALYTICS.' + campaign.status.toUpperCase()) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Audience Insights -->
        <div class="analytics-section">
          <div class="section-title">
            <span class="section-icon">👥</span>
            {{ getTranslatedText('REPORT_ANALYTICS.AUDIENCE_INSIGHTS') }}
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-value">25-34</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.PRIMARY_AGE_GROUP') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">68%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.ESG_ENGAGEMENT_RATE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">
                +12%
                <span class="trend-indicator trend-up">↗️</span>
              </div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.POSITIVE_SENTIMENT') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">Tech</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TOP_INDUSTRY') }}</div>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
              📊 {{ getTranslatedText('REPORT_ANALYTICS.AUDIENCE_DEMOGRAPHICS') }}
            </div>
          </div>
        </div>

        <!-- Content Effectiveness Analytics -->
        <div class="analytics-section">
          <div class="section-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
            <span class="section-icon">📝</span>
            {{ getTranslatedText('REPORT_ANALYTICS.CONTENT_EFFECTIVENESS_ANALYTICS') }}
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-value">87%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.AVG_WATCH_THROUGH_RATE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">Net Zero</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TOP_PERFORMING_TOPIC') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">23%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.CTA_CONVERSION_RATE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">156</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.CONTENT_PIECES_PUBLISHED') }}</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.CONTENT_TITLE') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TYPE') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.REACH') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.ENGAGEMENT') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TOPIC') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let content of contentPerformance">
                <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ content.title }}</td>
                <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTypeTranslation(content.type) }}</td>
                <td>{{ content.reach.toLocaleString() }}</td>
                <td>{{ content.likes + content.shares }}</td>
                <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTopicTranslation(content.topic) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Brand Sentiment Tracking -->
        <div class="analytics-section">
          <div class="section-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
            <span class="section-icon">🎯</span>
            {{ getTranslatedText('REPORT_ANALYTICS.BRAND_SENTIMENT') }}
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-value">8.2</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.BRAND_PERCEPTION_SCORE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">
                +15%
                <span class="trend-indicator trend-up">↗️</span>
              </div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.SENTIMENT_IMPROVEMENT') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">23%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.SHARE_OF_VOICE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">89%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.POSITIVE_MENTIONS') }}</div>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
              📈 {{ getTranslatedText('REPORT_ANALYTICS.BRAND_SENTIMENT_TRENDS') }}
            </div>
          </div>
        </div>

        <!-- Compliance & Regulatory Reporting -->
        <div class="analytics-section">
          <div class="section-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
            <span class="section-icon">✅</span>
            {{ getTranslatedText('REPORT_ANALYTICS.COMPLIANCE_REPORTS') }}
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-value">98%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.COMPLIANCE_RATE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">2</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.FLAGGED_CONTENT') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">GRI</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.PRIMARY_STANDARD') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">0</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.GREENWASHING_ALERTS') }}</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.DISCLOSURE') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.STANDARD') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.STATUS') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.LAST_UPDATED') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let compliance of complianceReports">
                <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getDisclosureTranslation(compliance.disclosure) }}</td>
                <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getStandardTranslation(compliance.standard) }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + compliance.status" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
                    {{ getStatusTranslation(compliance.status) }}
                  </span>
                </td>
                <td>{{ compliance.lastUpdated }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Team & Campaign Efficiency Reports -->
        <div class="analytics-section">
          <div class="section-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
            <span class="section-icon">👥</span>
            {{ getTranslatedText('REPORT_ANALYTICS.TEAM_EFFICIENCY') }}
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-value">94%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.BUDGET_UTILIZATION') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">3.2x</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.AVERAGE_ROI') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">87%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TIMELINE_ADHERENCE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">8.5</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.AVG_PERFORMANCE_SCORE') }}</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TEAM_MEMBER') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.CAMPAIGNS') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.BUDGET_UTIL') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.ROI') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.PERFORMANCE') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let member of teamEfficiency">
                <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ member.memberName }}</td>
                <td>{{ member.campaignsCompleted }}</td>
                <td>{{ member.budgetUtilization }}%</td>
                <td>{{ member.roi }}x</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="member.performanceScore * 10"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Lead & Conversion Analysis -->
        <div class="analytics-section">
          <div class="section-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
            <span class="section-icon">🎯</span>
            {{ getTranslatedText('REPORT_ANALYTICS.LEAD_CONVERSION_ANALYSIS') }}
          </div>
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-value">1,247</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.ESG_LEADS_GENERATED') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">23%</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.CONVERSION_RATE') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">$45K</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.REVENUE_GENERATED') }}</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">Whitepapers</div>
              <div class="metric-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.TOP_CONVERTING_CONTENT') }}</div>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
              📊 {{ getTranslatedText('REPORT_ANALYTICS.LEAD_CONVERSION_FUNNEL') }}
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.SOURCE') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.LEADS') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.CONVERSIONS') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.RATE') }}</th>
                <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('REPORT_ANALYTICS.REVENUE') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let lead of leadConversions">
                <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getSourceTranslation(lead.source) }}</td>
                <td>{{ lead.leads.toLocaleString() }}</td>
                <td>{{ lead.conversions.toLocaleString() }}</td>
                <td>{{ lead.conversionRate }}%</td>
                <td>{{ '$' + lead.revenue.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
})
export class ReportAnalyticsComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: GlobalTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Report Analytics language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Report Analytics translations not loaded yet');
      }
    }, 1000);
  }
  
  ngOnInit() {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.darkMode = isDark
    );
  }
  
  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  campaignReports: CampaignReport[] = [
    {
      id: 1,
      name: 'Net Zero Initiative',
      platform: 'LinkedIn',
      reach: 45000,
      impressions: 125000,
      conversions: 1200,
      sustainabilityMentions: 450,
      climateActionReach: 38000,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'completed'
    },
    {
      id: 2,
      name: 'ESG Sustainability',
      platform: 'Twitter',
      reach: 32000,
      impressions: 89000,
      conversions: 850,
      sustainabilityMentions: 320,
      climateActionReach: 28000,
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      status: 'active'
    },
    {
      id: 3,
      name: 'Circular Economy',
      platform: 'Instagram',
      reach: 28000,
      impressions: 75000,
      conversions: 650,
      sustainabilityMentions: 280,
      climateActionReach: 24000,
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      status: 'completed'
    }
  ];

  contentPerformance: ContentPerformance[] = [
    {
      id: 1,
      title: 'Net Zero Roadmap Guide',
      type: 'blog',
      reach: 15000,
      likes: 450,
      shares: 120,
      ctaConversions: 89,
      topic: 'Net Zero'
    },
    {
      id: 2,
      title: 'ESG Investment Trends',
      type: 'video',
      reach: 22000,
      likes: 680,
      shares: 210,
      watchThroughRate: 78,
      bounceRate: 12,
      ctaConversions: 156,
      topic: 'ESG Investment'
    },
    {
      id: 3,
      title: 'Sustainability Metrics',
      type: 'infographic',
      reach: 18000,
      likes: 520,
      shares: 180,
      ctaConversions: 98,
      topic: 'Sustainability'
    }
  ];

  complianceReports: ComplianceReport[] = [
    {
      id: 1,
      disclosure: 'ESG Marketing Standards',
      status: 'compliant',
      standard: 'GRI',
      lastUpdated: '2024-03-15',
      alerts: []
    },
    {
      id: 2,
      disclosure: 'Sustainability Claims',
      status: 'flagged',
      standard: 'SASB',
      lastUpdated: '2024-03-10',
      alerts: ['Review required for accuracy']
    },
    {
      id: 3,
      disclosure: 'Climate Action Reporting',
      status: 'compliant',
      standard: 'GRI',
      lastUpdated: '2024-03-12',
      alerts: []
    }
  ];

  teamEfficiency: TeamEfficiency[] = [
    {
      memberName: 'Sarah Johnson',
      campaignsCompleted: 8,
      budgetUtilization: 95,
      roi: 3.2,
      timelineAdherence: 92,
      performanceScore: 8.5
    },
    {
      memberName: 'Michael Chen',
      campaignsCompleted: 6,
      budgetUtilization: 88,
      roi: 2.8,
      timelineAdherence: 85,
      performanceScore: 7.8
    },
    {
      memberName: 'David Kim',
      campaignsCompleted: 10,
      budgetUtilization: 97,
      roi: 4.1,
      timelineAdherence: 94,
      performanceScore: 9.2
    }
  ];

  leadConversions: LeadConversion[] = [
    {
      source: 'ESG Landing Pages',
      leads: 450,
      conversions: 108,
      conversionRate: 24,
      revenue: 18000,
      attribution: 'Direct'
    },
    {
      source: 'Whitepaper Downloads',
      leads: 320,
      conversions: 89,
      conversionRate: 28,
      revenue: 14500,
      attribution: 'Content'
    },
    {
      source: 'Webinar Signups',
      leads: 280,
      conversions: 67,
      conversionRate: 24,
      revenue: 12500,
      attribution: 'Events'
    }
  ];

  logout() { 
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }

  toggleDarkMode() { 
    this.themeService.toggleDarkMode(); 
  }

  exportReport() {
    alert('Report exported successfully!');
  }

  getTotalReach(): number {
    return this.campaignReports.reduce((sum, campaign) => sum + campaign.reach, 0);
  }

  getTotalImpressions(): number {
    return this.campaignReports.reduce((sum, campaign) => sum + campaign.impressions, 0);
  }

  getTotalConversions(): number {
    return this.campaignReports.reduce((sum, campaign) => sum + campaign.conversions, 0);
  }

  getSustainabilityMentions(): number {
    return this.campaignReports.reduce((sum, campaign) => sum + campaign.sustainabilityMentions, 0);
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  getStatusTranslation(status: string): string {
    const statusKey = status.toUpperCase();
    return this.translationService.translate(`REPORT_ANALYTICS.${statusKey}`);
  }

  getTypeTranslation(type: string): string {
    const typeKey = type.toUpperCase();
    return this.translationService.translate(`REPORT_ANALYTICS.${typeKey}`);
  }

  getTopicTranslation(topic: string): string {
    const topicKey = topic.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(`REPORT_ANALYTICS.${topicKey}`);
  }

  getStandardTranslation(standard: string): string {
    const standardKey = standard.toUpperCase();
    return this.translationService.translate(`REPORT_ANALYTICS.${standardKey}`);
  }

  getDisclosureTranslation(disclosure: string): string {
    const disclosureKey = disclosure.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(`REPORT_ANALYTICS.${disclosureKey}`);
  }

  getSourceTranslation(source: string): string {
    const sourceKey = source.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(`REPORT_ANALYTICS.${sourceKey}`);
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