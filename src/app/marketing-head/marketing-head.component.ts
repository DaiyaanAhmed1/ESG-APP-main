import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { MarketingTranslationService } from '../services/marketing-translation.service';
import { ThemeService } from '../services/theme.service';
import { GlobalLanguageToggleComponent } from '../components/global-language-toggle/global-language-toggle.component';

@Component({
  selector: 'marketing-head',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GlobalLanguageToggleComponent],
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
        overflow-y: auto;
        overflow-x: hidden;
        transition: all 0.3s ease;
      }
      
      /* Custom scrollbar styling */
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
      
      /* Collapsed state styles */
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
      
      /* Tooltip for collapsed state */
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
        background: #f8fafc;
        transition: background 0.3s, color 0.3s;
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

      /* Dark mode styles */
      .edash-root.dark-mode {
        background: #181828;
        color: #e0e0e0;
      }
      .edash-root.dark-mode .edash-main {
        background: #181828;
        color: #e0e0e0;
      }

      /* Header styles */
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
      
      /* Language toggle styling in header */
      .header-actions app-global-language-toggle {
        margin-right: 0.5rem;
      }
      .new-campaign-btn {
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
      .new-campaign-btn:hover {
        background: #1d4ed8;
      }
      .export-link {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
      }
      .export-link:hover {
        color: #1d4ed8;
      }
      .edash-root.dark-mode .export-link {
        color: #7eaaff;
      }
      .edash-root.dark-mode .export-link:hover {
        color: #60a5fa;
      }

      /* KPI Cards */
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .kpi-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #ececec;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .kpi-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .kpi-card.blue {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border-color: #93c5fd;
      }
      .kpi-card.green {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        border-color: #86efac;
      }
      .kpi-card.purple {
        background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
        border-color: #c084fc;
      }
      .kpi-card.yellow {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-color: #fbbf24;
      }
      .kpi-card.pink {
        background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
        border-color: #f9a8d4;
      }
      .edash-root.dark-mode .kpi-card.blue {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        border-color: #3b82f6;
      }
      .edash-root.dark-mode .kpi-card.green {
        background: linear-gradient(135deg, #166534 0%, #15803d 100%);
        border-color: #22c55e;
      }
      .edash-root.dark-mode .kpi-card.purple {
        background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
        border-color: #a855f7;
      }
      .edash-root.dark-mode .kpi-card.yellow {
        background: linear-gradient(135deg, #a16207 0%, #ca8a04 100%);
        border-color: #eab308;
      }
      .edash-root.dark-mode .kpi-card.pink {
        background: linear-gradient(135deg, #be185d 0%, #ec4899 100%);
        border-color: #f472b6;
      }
      .kpi-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .kpi-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }
      .edash-root.dark-mode .kpi-value {
        color: #e0e0e0;
      }
      .kpi-label {
        font-size: 1rem;
        color: #6b7280;
        font-weight: 500;
      }
      .edash-root.dark-mode .kpi-label {
        color: #9ca3af;
      }

      /* Charts Section */
      .charts-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .chart-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #ececec;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .chart-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .chart-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
      }
      .edash-root.dark-mode .chart-title {
        color: #e0e0e0;
      }
      .chart-container {
        height: 300px;
        background: #f8fafc;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .edash-root.dark-mode .chart-container {
        background: #1a1a2e;
      }

      /* Line Chart */
      .line-chart {
          width: 100%;
        height: 100%;
        position: relative;
      }
      .chart-line {
        stroke: #3b82f6;
        stroke-width: 3;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .chart-line.conversions {
        stroke: #22c55e;
      }
      .chart-point {
        fill: #3b82f6;
        stroke: white;
        stroke-width: 2;
      }
      .chart-point.conversions {
        fill: #22c55e;
      }
      .chart-axis {
        stroke: #d1d5db;
        stroke-width: 1;
      }
      .edash-root.dark-mode .chart-axis {
        stroke: #4b5563;
      }
      .chart-label {
        font-size: 0.75rem;
        fill: #6b7280;
        text-anchor: middle;
      }
      .edash-root.dark-mode .chart-label {
        fill: #9ca3af;
      }
      .chart-legend {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
      }
      .edash-root.dark-mode .legend-item {
        color: #9ca3af;
      }
      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .legend-color.leads {
        background: #3b82f6;
      }
      .legend-color.conversions {
        background: #22c55e;
      }

      /* Pie Chart */
      .pie-chart {
        width: 200px;
        height: 200px;
        margin: 0 auto;
        position: relative;
      }
      .pie-segment {
        transform-origin: center;
      }
      .pie-segment.social { fill: #3b82f6; }
      .pie-segment.email { fill: #22c55e; }
      .pie-segment.events { fill: #f59e0b; }
      .pie-segment.direct { fill: #eab308; }
      .pie-segment.other { fill: #6b7280; }
      .pie-center {
        fill: white;
      }
      .edash-root.dark-mode .pie-center {
        fill: #1a1a2e;
      }
      .pie-labels {
        position: absolute;
        top: 0;
        left: 0;
          width: 100%;
        height: 100%;
      }
      .pie-label {
        position: absolute;
        font-size: 0.75rem;
        font-weight: 500;
        color: #1f2937;
        text-align: center;
      }
      .edash-root.dark-mode .pie-label {
        color: #e0e0e0;
      }

      /* Activity and Tasks Section */
      .bottom-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .activity-card, .tasks-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #ececec;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .activity-card,
      .edash-root.dark-mode .tasks-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .section-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
      }
      .edash-root.dark-mode .section-title {
        color: #e0e0e0;
      }
      .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .edash-root.dark-mode .activity-item {
        border-bottom: 1px solid #374151;
      }
      .activity-item:last-child {
        border-bottom: none;
      }
      .activity-dot {
        width: 8px;
        height: 8px;
        background: #3b82f6;
        border-radius: 50%;
        margin-top: 0.5rem;
        flex-shrink: 0;
      }
      .activity-content {
        flex: 1;
      }
      .activity-text {
        font-size: 0.875rem;
        color: #1f2937;
        margin-bottom: 0.25rem;
      }
      .edash-root.dark-mode .activity-text {
        color: #e0e0e0;
      }
      .activity-time {
        font-size: 0.75rem;
        color: #6b7280;
      }
      .edash-root.dark-mode .activity-time {
        color: #9ca3af;
      }
      .task-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .edash-root.dark-mode .task-item {
        border-bottom: 1px solid #374151;
      }
      .task-item:last-child {
        border-bottom: none;
      }
      .task-checkbox {
        width: 18px;
        height: 18px;
        border: 2px solid #d1d5db;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
      }
      .edash-root.dark-mode .task-checkbox {
        border-color: #4b5563;
        background: #1a1a2e;
      }
      .task-checkbox:checked {
        background: #3b82f6;
        border-color: #3b82f6;
      }
      .task-content {
        flex: 1;
      }
      .task-text {
        font-size: 0.875rem;
        color: #1f2937;
        margin-bottom: 0.25rem;
      }
      .edash-root.dark-mode .task-text {
        color: #e0e0e0;
      }
      .task-date {
        font-size: 0.75rem;
        color: #6b7280;
      }
      .edash-root.dark-mode .task-date {
        color: #9ca3af;
      }

      @media (max-width: 1200px) {
        .charts-section {
          grid-template-columns: 1fr;
        }
        .bottom-section {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 768px) {
        .kpi-grid {
          grid-template-columns: 1fr;
        }
        .dashboard-header {
          flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
        .header-actions {
        width: 100%;
        justify-content: space-between;
        }
      }
    </style>
    <div class="edash-root" [class.dark-mode]="darkMode">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">Marketing Head</span>
        </div>
                            <nav class="edash-nav">
          <a routerLink="/marketing-head" class="edash-nav-link active" data-title="Dashboard">
                          <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.DASHBOARD') }}</span>
          </a>
                     <a routerLink="/marketing-team" class="edash-nav-link" data-title="Team Management">
                          <span class="edash-nav-icon">👥</span>
             <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.TEAM_MANAGEMENT') }}</span>
           </a>
          <a routerLink="/leads" class="edash-nav-link" data-title="Leads">
            <span class="edash-nav-icon">🎯</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LEADS') }}</span>
          </a>
          
          
          <a routerLink="/resource-management" class="edash-nav-link" data-title="Resource Management">
            <span class="edash-nav-icon">📦</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.RESOURCE_MANAGEMENT') }}</span>
          </a>
          <a routerLink="/report-analytics" class="edash-nav-link" data-title="Report & Analytics">
            <span class="edash-nav-icon">📈</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.REPORT_ANALYTICS') }}</span>
          </a>
          
          <a routerLink="/training-development" class="edash-nav-link" data-title="Training & Develop">
                          <span class="edash-nav-icon">🎓</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.TRAINING_DEVELOP') }}</span>
          </a>
         
          <a routerLink="/help-support" class="edash-nav-link" data-title="Help & Support">
            <span class="edash-nav-icon">🆘</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.HELP_SUPPORT') }}</span>
          </a>
          <div class="edash-nav-actions">
            <app-global-language-toggle></app-global-language-toggle>
            <button class="edash-logout" (click)="logout()" aria-label="Logout" data-title="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LOGOUT') }}</span>
            </button>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav" data-title="Collapse">
              <span class="icon">⬅️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode" data-title="Light Mode">
              <span class="icon">☀️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LIGHT_MODE') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-content">
            <h1>{{ getTranslatedText('MARKETING.OVERVIEW') }}</h1>
            <p>{{ getTranslatedText('MARKETING.WELCOME_MESSAGE') }}</p>
          </div>
          <div class="header-actions">
            <app-global-language-toggle></app-global-language-toggle>
            <button class="new-campaign-btn" (click)="launchNewCampaign()">{{ getTranslatedText('MARKETING.NEW_CAMPAIGN_BUTTON') }}</button>
            <a href="#" class="export-link" (click)="exportReport($event)">{{ getTranslatedText('MARKETING.EXPORT_REPORT') }}</a>
          </div>
          </div>

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card blue">
            <div class="kpi-icon">🎯</div>
            <div class="kpi-value">1240</div>
            <div class="kpi-label">{{ getTranslatedText('MARKETING.TOTAL_QUALIFIED_LEADS') }}</div>
            </div>
          <div class="kpi-card green">
            <div class="kpi-icon">📈</div>
            <div class="kpi-value">32%</div>
            <div class="kpi-label">{{ getTranslatedText('MARKETING.CONVERSION_RATE') }}</div>
            </div>
          <div class="kpi-card purple">
            <div class="kpi-icon">📢</div>
            <div class="kpi-value">8</div>
            <div class="kpi-label">{{ getTranslatedText('MARKETING.ACTIVE_CAMPAIGNS') }}</div>
            </div>
          <div class="kpi-card yellow">
            <div class="kpi-icon">👥</div>
            <div class="kpi-value">15</div>
            <div class="kpi-label">{{ getTranslatedText('MARKETING.TEAM_MEMBERS') }}</div>
            </div>
          <div class="kpi-card pink">
            <div class="kpi-icon">💰</div>
            <div class="kpi-value">285%</div>
            <div class="kpi-label">{{ getTranslatedText('MARKETING.ROI') }}</div>
            </div>
          </div>

          <!-- Charts Section -->
        <div class="charts-section">
          <!-- Line Chart -->
          <div class="chart-card">
            <div class="chart-title">{{ getTranslatedText('MARKETING.LEAD_GENERATION') }}</div>
            <div class="chart-container">
              <svg class="line-chart" viewBox="0 0 600 300">
                  <!-- Grid lines -->
                <line class="chart-axis" x1="50" y1="50" x2="50" y2="250"></line>
                <line class="chart-axis" x1="50" y1="250" x2="550" y2="250"></line>
                
                <!-- Y-axis labels -->
                <text class="chart-label" x="30" y="250">0</text>
                <text class="chart-label" x="30" y="200">150</text>
                <text class="chart-label" x="30" y="150">300</text>
                <text class="chart-label" x="30" y="100">450</text>
                <text class="chart-label" x="30" y="50">600</text>
                
                <!-- X-axis labels -->
                <text class="chart-label" x="50" y="270">Jan</text>
                <text class="chart-label" x="150" y="270">Feb</text>
                <text class="chart-label" x="250" y="270">Mar</text>
                <text class="chart-label" x="350" y="270">Apr</text>
                <text class="chart-label" x="450" y="270">May</text>
                <text class="chart-label" x="550" y="270">Jun</text>
                
                <!-- Leads line -->
                <polyline class="chart-line" points="50,200 150,180 250,160 350,140 450,120 550,100"></polyline>
                <circle class="chart-point" cx="50" cy="200" r="4"></circle>
                <circle class="chart-point" cx="150" cy="180" r="4"></circle>
                <circle class="chart-point" cx="250" cy="160" r="4"></circle>
                <circle class="chart-point" cx="350" cy="140" r="4"></circle>
                <circle class="chart-point" cx="450" cy="120" r="4"></circle>
                <circle class="chart-point" cx="550" cy="100" r="4"></circle>
                
                <!-- Conversions line -->
                <polyline class="chart-line conversions" points="50,240 150,230 250,220 350,210 450,200 550,190"></polyline>
                <circle class="chart-point conversions" cx="50" cy="240" r="4"></circle>
                <circle class="chart-point conversions" cx="150" cy="230" r="4"></circle>
                <circle class="chart-point conversions" cx="250" cy="220" r="4"></circle>
                <circle class="chart-point conversions" cx="350" cy="210" r="4"></circle>
                <circle class="chart-point conversions" cx="450" cy="200" r="4"></circle>
                <circle class="chart-point conversions" cx="550" cy="190" r="4"></circle>
                </svg>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color leads"></div>
                  <span>Leads</span>
              </div>
                <div class="legend-item">
                  <div class="legend-color conversions"></div>
                  <span>Conversions</span>
            </div>
              </div>
            </div>
          </div>

          <!-- Pie Chart -->
          <div class="chart-card">
            <div class="chart-title">{{ getTranslatedText('MARKETING.MARKETING_CHANNEL') }}</div>
            <div class="chart-container">
              <div class="pie-chart">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <!-- Pie segments -->
                  <path class="pie-segment social" d="M100,100 L100,20 A80,80 0 0,1 180,100 Z"></path>
                  <path class="pie-segment email" d="M100,100 L180,100 A80,80 0 0,1 140,160 Z"></path>
                  <path class="pie-segment events" d="M100,100 L140,160 A80,80 0 0,1 60,160 Z"></path>
                  <path class="pie-segment direct" d="M100,100 L60,160 A80,80 0 0,1 20,100 Z"></path>
                  <path class="pie-segment other" d="M100,100 L20,100 A80,80 0 0,1 100,20 Z"></path>
                  
                  <!-- Center circle -->
                  <circle class="pie-center" cx="100" cy="100" r="30"></circle>
                </svg>
                <div class="pie-labels">
                  <div class="pie-label" style="top: 15%; left: 70%;">Social Media 35%</div>
                  <div class="pie-label" style="top: 60%; left: 85%;">Email 25%</div>
                  <div class="pie-label" style="top: 85%; left: 60%;">Events 20%</div>
                  <div class="pie-label" style="top: 85%; left: 25%;">Direct Outreach 15%</div>
                  <div class="pie-label" style="top: 60%; left: 10%;">Other 5%</div>
              </div>
            </div>
              </div>
            </div>
          </div>

        <!-- Activity and Tasks Section -->
        <div class="bottom-section">
          <!-- Activity Log -->
          <div class="activity-card">
            <div class="section-title">{{ getTranslatedText('MARKETING.ACTIVITY_LOG') }}</div>
            <div class="activity-item">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <div class="activity-text">{{ getTranslatedText('MARKETING.NEW_LEAD_ADDED') }}</div>
                <div class="activity-time">2 {{ getTranslatedText('MARKETING.HOURS_AGO') }} {{ getTranslatedText('MARKETING.BY') }} Sara Khalid</div>
              </div>
              </div>
            <div class="activity-item">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <div class="activity-text">{{ getTranslatedText('MARKETING.MARKETING_INITIATIVE_DEPLOYED') }}</div>
                <div class="activity-time">5 {{ getTranslatedText('MARKETING.HOURS_AGO') }} {{ getTranslatedText('MARKETING.BY') }} Jane Smith</div>
              </div>
              </div>
            <div class="activity-item">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <div class="activity-text">{{ getTranslatedText('MARKETING.PERFORMANCE_REPORT_CREATED') }}</div>
                <div class="activity-time">1 {{ getTranslatedText('MARKETING.DAYS_AGO') }} {{ getTranslatedText('MARKETING.BY') }} Mike Johnson</div>
              </div>
            </div>
          </div>

          <!-- Upcoming Tasks -->
          <div class="tasks-card">
            <div class="section-title">{{ getTranslatedText('MARKETING.UPCOMING_FOLLOW_UPS') }}</div>
            <div class="task-item">
              <input type="checkbox" class="task-checkbox">
              <div class="task-content">
                <div class="task-text">{{ getTranslatedText('MARKETING.EVALUATE_MID_YEAR_DIRECTION') }}</div>
                <div class="task-date">June 15, 2025</div>
            </div>
            </div>
            <div class="task-item">
              <input type="checkbox" class="task-checkbox">
              <div class="task-content">
                <div class="task-text">{{ getTranslatedText('MARKETING.TEAM_PERFORMANCE_REVIEW') }}</div>
                <div class="task-date">June 16, 2025</div>
          </div>
        </div>
            <div class="task-item">
              <input type="checkbox" class="task-checkbox">
              <div class="task-content">
                <div class="task-text">{{ getTranslatedText('MARKETING.BUDGET_PLANNING_MEETING') }}</div>
                <div class="task-date">June 17, 2025</div>
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class MarketingHeadComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  currentLanguage = 'en';
  private themeSubscription!: Subscription;
  private translationSubscription?: Subscription;

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: MarketingTranslationService
  ) {}
  
  ngOnInit() {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      isDark => this.darkMode = isDark
    );

    // Initialize translation
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    
    this.translationSubscription = this.translationService.getLanguageChange$().subscribe(lang => {
      this.currentLanguage = lang;
      
      console.log('Marketing language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Marketing translations not loaded yet');
      } else {
        console.log('Marketing translations loaded successfully');
      }
    }, 1000);
  }
  
  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    this.translationSubscription?.unsubscribe();
  }

  logout() { 
    if (typeof window !== 'undefined' && window.localStorage) {
      if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    }
    this.router.navigate(['/login']);
  }

  toggleDarkMode() { 
    this.themeService.toggleDarkMode(); 
  }

  launchNewCampaign() {
    // Show campaign creation modal or navigate to campaign creation page
    alert('Launching New Campaign Creation Wizard...\n\nThis will open a step-by-step campaign creation form with:\n• Campaign details and objectives\n• Target audience selection\n• Budget allocation\n• Timeline planning\n• Channel selection\n• Content strategy');
    
    // In a real application, you would:
    // 1. Open a modal with campaign creation form
    // 2. Or navigate to a dedicated campaign creation page
    // 3. Or show a wizard interface
    console.log('New Campaign Launch initiated');
  }

  getTranslatedText(key: string): string {
    const translated = this.translationService.translate(key);
    if (translated === key) {
      console.warn(`Marketing translation failed for key: ${key}`);
    }
    return translated;
  }

  exportReport(event: Event) {
    event.preventDefault();
    
    // Generate and download marketing report
    const reportData = {
      timestamp: new Date().toISOString(),
      kpis: {
        totalLeads: 1240,
        conversionRate: '32%',
        activeCampaigns: 8,
        teamMembers: 15,
        roi: '285%'
      },
      charts: {
        leadGeneration: 'Lead Generation Actionable chart data',
        channelPerformance: 'Marketing Channel Performance data'
      },
      activities: [
        'New lead added - 2 hours ago by Sara Khalid',
        'Marketing Initiative Deployed - 5 hours ago by Jane Smith',
        'Performance Report Created - 1 day ago by Mike Johnson'
      ],
      tasks: [
        'Evaluate Mid-Year Marketing Direction - June 15, 2025',
        'Team Performance Review - June 16, 2025',
        'Budget Planning Meeting - June 17, 2025'
      ]
    };

    // Create downloadable file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `marketing-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Marketing Report exported successfully!\n\nFile: marketing-report-' + new Date().toISOString().split('T')[0] + '.json\n\nReport includes:\n• Current KPIs and metrics\n• Chart data and performance indicators\n• Recent activities and tasks\n• Team performance overview');
    
    console.log('Marketing report exported:', reportData);
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