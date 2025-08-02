import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialityTranslationService } from '../services/materiality-translation.service';
import { ThemeService } from '../services/theme.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

interface MaterialityTopic {
  name: string;
  financialMateriality: number; // 1-5
  environmentalSocialMateriality: number; // 1-5
  aiFinancialSuggestion: number;
  aiEnvSocSuggestion: number;
  aiExplanation: string;
  history: number[];
}

@Component({
  selector: 'app-materiality',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
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
      
      /* Dark mode styles for main content */
      .edash-root.dark-mode .materiality-main {
        background: #1a1a2e;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .purpose-section {
        background: #16213e;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .materiality-customization,
      .edash-root.dark-mode .stakeholder-section,
      .edash-root.dark-mode .import-section,
      .edash-root.dark-mode .materiality-toggle,
      .edash-root.dark-mode .scenario-bar,
      .edash-root.dark-mode .add-topic-row,
      .edash-root.dark-mode .trend-section,
      .edash-root.dark-mode .materiality-overview,
      .edash-root.dark-mode .priority-categories,
      .edash-root.dark-mode .stakeholder-weights,
      .edash-root.dark-mode .export-actions,
      .edash-root.dark-mode .ai-summary,
      .edash-root.dark-mode .stakeholder-engagement-dashboard {
        background: #16213e;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      
      .edash-root.dark-mode .materiality-customization h4,
      .edash-root.dark-mode .stakeholder-section h4,
      .edash-root.dark-mode .import-section h4,
      .edash-root.dark-mode .materiality-toggle h4,
      .edash-root.dark-mode .scenario-bar h4,
      .edash-root.dark-mode .add-topic-row h4,
      .edash-root.dark-mode .trend-section h4,
      .edash-root.dark-mode .materiality-overview h4,
      .edash-root.dark-mode .priority-categories h4,
      .edash-root.dark-mode .stakeholder-weights h4,
      .edash-root.dark-mode .export-actions h4,
      .edash-root.dark-mode .ai-summary h4 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .materiality-customization label,
      .edash-root.dark-mode .stakeholder-section label,
      .edash-root.dark-mode .scenario-bar label {
        color: #b8c5d6;
      }
      
      .edash-root.dark-mode .materiality-customization select,
      .edash-root.dark-mode .materiality-customization input,
      .edash-root.dark-mode .stakeholder-section input,
      .edash-root.dark-mode .add-topic-row input,
      .edash-root.dark-mode .import-section input {
        background: #0f3460;
        border: 1px solid #333;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .overview-card {
        background: #0f3460;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .overview-card h5 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .overview-card p {
        color: #4bc0c0;
      }
      
      .edash-root.dark-mode .weight-item {
        background: #0f3460;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .weight-item label {
        color: #b8c5d6;
      }
      
      .edash-root.dark-mode .chart-container {
        background: #0f3460;
        border: 1px solid #333;
      }
      
      .edash-root.dark-mode .chart-title {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .legend-item {
        color: #b8c5d6;
      }
      
      .edash-root.dark-mode .chart-y-axis span,
      .edash-root.dark-mode .chart-x-axis span {
        color: #b8c5d6;
      }
      
      .edash-root.dark-mode .topic-label {
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .grid-line {
        background: #333;
      }
      
      /* Dark Mode Styles for Stakeholder Engagement Dashboard */
      .edash-root.dark-mode .stakeholder-engagement-dashboard {
        background: #16213e;
        border: 1px solid #334155;
      }
      
      .edash-root.dark-mode .stakeholder-header {
        border-bottom-color: #334155;
      }
      
      .edash-root.dark-mode .header-content h4 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .subtitle {
        color: #94a3b8;
      }
      
      .edash-root.dark-mode .action-btn.secondary {
        background: #1e293b;
        color: #94a3b8;
        border-color: #475569;
      }
      
      .edash-root.dark-mode .action-btn.secondary:hover {
        background: #334155;
        color: #cbd5e1;
      }
      
      .edash-root.dark-mode .management-header h5 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .stakeholder-input {
        background: #0f3460;
        border-color: #475569;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .stakeholder-input:focus {
        border-color: #6c63ff;
        box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
      }
      
      .edash-root.dark-mode .stakeholder-card {
        background: #1e293b;
        border-color: #475569;
      }
      
      .edash-root.dark-mode .stakeholder-card:hover {
        border-color: #6c63ff;
        box-shadow: 0 8px 25px rgba(108, 99, 255, 0.3);
      }
      
      .edash-root.dark-mode .stakeholder-details h6 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .weight-badge {
        background: rgba(108, 99, 255, 0.2);
        color: #6c63ff;
      }
      
      .edash-root.dark-mode .weight-slider label {
        color: #94a3b8;
      }
      
      .edash-root.dark-mode .weight-range {
        background: #475569;
      }
      
      .edash-root.dark-mode .weight-value {
        color: #6c63ff;
      }
      
      .edash-root.dark-mode .stat-item {
        background: #0f3460;
        border-color: #475569;
      }
      
      .edash-root.dark-mode .stat-label {
        color: #94a3b8;
      }
      
      .edash-root.dark-mode .stat-value {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .empty-state {
        background: #1e293b;
        border-color: #475569;
      }
      
      .edash-root.dark-mode .empty-state h5 {
        color: #94a3b8;
      }
      
      .edash-root.dark-mode .empty-state p {
        color: #64748b;
      }
      
      .edash-root.dark-mode .matrix-header h5 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .matrix-header p {
        color: #94a3b8;
      }
      
      .edash-root.dark-mode .matrix-container {
        background: #1e293b;
      }
      
      .edash-root.dark-mode .materiality-matrix-table th {
        background: linear-gradient(135deg, #6c63ff, #5a52d5);
      }
      
      .edash-root.dark-mode .materiality-matrix-table td {
        border-bottom-color: #475569;
      }
      
      .edash-root.dark-mode .stakeholder-cell {
        background: #0f3460;
      }
      
      .edash-root.dark-mode .stakeholder-name {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .score-input {
        background: #0f3460;
        border-color: #475569;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .score-input:focus {
        border-color: #6c63ff;
        box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
      }
      
      .edash-root.dark-mode .matrix-action-btn {
        background: #0f3460;
        color: #94a3b8;
      }
      
      .edash-root.dark-mode .matrix-action-btn:hover {
        background: #6c63ff;
        color: white;
      }
      
      .edash-root.dark-mode .insights-header h5 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .insight-card {
        background: linear-gradient(135deg, #1e293b, #0f3460);
        border-color: #475569;
      }
      
      .edash-root.dark-mode .insight-card:hover {
        border-color: #6c63ff;
        box-shadow: 0 8px 25px rgba(108, 99, 255, 0.3);
      }
      
      .edash-root.dark-mode .insight-content h6 {
        color: #7eaaff;
      }
      
      .edash-root.dark-mode .insight-content p {
        color: #94a3b8;
      }
      
      .edash-root.dark-mode .insight-value {
        color: #6c63ff;
      }
      
      .edash-root.dark-mode .import-section.compact {
        background: #16213e;
        border: 1px solid #334155;
      }
      
      .edash-root.dark-mode .import-btn {
        background: linear-gradient(135deg, #4bc0c0, #3aa8a8);
      }
      
      .edash-root.dark-mode .materiality-matrix-section.full-width-section {
        background: #16213e;
        border: 1px solid #334155;
      }
      
      .edash-root.dark-mode .chart-x-axis {
        border-top: 1px solid #333;
      }
      
      .edash-root.dark-mode .materiality-table th {
        background: #0f3460;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .materiality-table tr:nth-child(even) {
        background: #16213e;
      }
      
      .edash-root.dark-mode .materiality-table tr:nth-child(odd) {
        background: #0f3460;
      }
      
      .edash-root.dark-mode .stakeholder-table th {
        background: #0f3460;
        color: #e0e0e0;
      }
      
      .edash-root.dark-mode .stakeholder-table tr:nth-child(even) {
        background: #16213e;
      }
      
      .edash-root.dark-mode .stakeholder-table tr:nth-child(odd) {
        background: #0f3460;
      }
      
      /* Dark mode styles for purpose and scope descriptions */
      .edash-root.dark-mode .purpose-desc,
      .edash-root.dark-mode .scope-desc {
        color: #e0e0e0;
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
      @media (max-width: 900px) {
        .edash-sidenav {
          position: fixed;
          transform: translateX(-100%);
          width: 260px;
          height: 100vh;
        }
        .edash-sidenav.mobile-open {
          transform: translateX(0);
        }
        .edash-root > .edash-main {
          margin-left: 0;
          width: 100%;
        }
        .edash-root > .edash-main.sidebar-collapsed {
          margin-left: 0;
          width: 100%;
        }
        .materiality-main {
          padding: 1rem;
        }
        .mobile-menu-toggle {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          background: #6c63ff;
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        /* Mobile Styles for Stakeholder Engagement Dashboard */
        .stakeholder-engagement-dashboard {
          padding: 1rem;
        }
        
        .stakeholder-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }
        
        .header-actions {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .action-btn {
          justify-content: center;
        }
        
        .management-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }
        
        .add-stakeholder-form {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .stakeholder-input {
          min-width: auto;
        }
        
        .stakeholder-cards-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .stakeholder-card {
          padding: 1rem;
        }
        
        .card-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }
        
        .stakeholder-info {
          justify-content: center;
        }
        
        .card-actions {
          justify-content: center;
        }
        
        .engagement-stats {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .matrix-container {
          padding: 1rem;
        }
        
        .materiality-matrix-table {
          min-width: 600px;
          font-size: 0.8rem;
        }
        
        .materiality-matrix-table th,
        .materiality-matrix-table td {
          padding: 0.5rem;
        }
        
        .score-input {
          width: 40px;
          padding: 0.25rem;
        }
        
        .insights-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .insight-card {
          padding: 1rem;
        }
        
              .edash-root.dark-mode .mobile-menu-toggle {
        background: #7eaaff;
        color: #1a1a2e;
      }
      
      /* RTL Support */
      .edash-root.rtl {
        direction: rtl;
      }
      .edash-root.rtl .edash-sidenav {
        left: auto;
        right: 0;
        border-right: none;
        border-left: 1px solid #ececec;
      }
      .edash-root.rtl .edash-nav-link {
        border-right: none;
        border-left: 3px solid transparent;
      }
      .edash-root.rtl .edash-nav-link.active {
        border-right: none;
        border-left: 3px solid #2563eb;
      }
      .edash-root.rtl.dark-mode .edash-nav-link.active {
        border-right: none;
        border-left: 3px solid #7eaaff;
      }
      .edash-root.rtl .edash-main {
        margin-left: 0;
        margin-right: 260px;
      }
      .edash-root.rtl .edash-main.sidebar-collapsed {
        margin-right: 70px;
      }
    }
    </style>
    <div class="edash-root" [class.dark-mode]="darkMode" [class.light-mode]="!darkMode" [class.rtl]="isRTL">
      <!-- Mobile menu toggle -->
      <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" *ngIf="isMobile">
        <span class="icon">☰</span>
      </button>
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode" [class.mobile-open]="mobileMenuOpen">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">Sustainability Head</span>
        </div>
        <nav class="edash-nav">
        <a routerLink="/environmental-dashboard" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">Sustainability Head</span></a>
          <a routerLink="/materiality" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">Materiality Assessment</span></a>
          <a routerLink="/team" class="edash-nav-link"><span class="edash-nav-icon">🧑‍🤝‍🧑</span><span *ngIf="!sidebarCollapsed">Manage Team</span></a>
          <a routerLink="/initiatives-dashboard" class="edash-nav-link"><span class="edash-nav-icon">📣</span><span *ngIf="!sidebarCollapsed">ESG Initiative</span></a>
          <a routerLink="/reporting" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">Reporting & Analysis</span></a>
          
          <a routerLink="/environmental-training" class="edash-nav-link"><span class="edash-nav-icon">🎓</span><span *ngIf="!sidebarCollapsed">Training & Development</span></a>
          
          <a routerLink="/stakeholder-engagement" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🤝</span><span *ngIf="!sidebarCollapsed">Stakeholder Engagement</span></a>
          <a routerLink="/data-management" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🗄️</span><span *ngIf="!sidebarCollapsed">Data Management</span></a>
  
          
          <div class="edash-nav-actions">
            <app-unified-language-toggle></app-unified-language-toggle>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav">
              <span class="icon">{{ sidebarCollapsed ? '➡️' : '⬅️' }}</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode">
              <span class="icon">{{ darkMode ? '☀️' : '🌙' }}</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LIGHT_MODE') }}</span>
            </button>
            <button class="edash-logout" (click)="logout()" aria-label="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LOGOUT') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed">
    <main class="materiality-main">
      <section class="purpose-section full-width-section">
        <h2>Materiality Assessment Dashboard</h2>
        <p class="purpose-desc">
          <b>Purpose:</b> This materiality assessment helps your organization identify, prioritize, and visualize the most relevant ESG (Environmental, Social, and Governance) factors for your business. It supports both single and double materiality perspectives, enabling you to assess how ESG topics impact your company financially and how your company impacts the environment and society.
        </p>
        <p class="scope-desc">
          <b>Scope:</b> The assessment covers key ESG factors including: Climate Change, Water Usage, Diversity & Inclusion, Data Privacy, Supply Chain, Waste Management, and Board Diversity. You can also add custom topics relevant to your industry or region.
        </p>
      </section>
      
      <div class="dashboard-grid">
        <div class="materiality-customization">
          <h4>Configuration</h4>
          <label>Industry:
            <select [(ngModel)]="industry">
              <option *ngFor="let ind of industries" [value]="ind">{{ ind }}</option>
            </select>
          </label>
          <label>Stakeholder Group:
            <select [(ngModel)]="selectedStakeholder">
              <option *ngFor="let s of stakeholderGroups" [value]="s">{{ s }}</option>
            </select>
          </label>
          <label>In-house ESG Goal:
            <input [(ngModel)]="inHouseGoal" placeholder="e.g. Net Zero by 2030" />
          </label>
        </div>
        
        <div class="materiality-overview">
          <h4>Assessment Overview</h4>
          <div class="overview-grid">
            <div class="overview-card">
              <h5>Assessment Status</h5>
              <p>{{ assessmentStatus }}</p>
            </div>
            <div class="overview-card">
              <h5>Last Updated</h5>
              <p>{{ lastUpdated }}</p>
            </div>
            <div class="overview-card">
              <h5>Priority Matrix</h5>
              <p>{{ materialityMatrix }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard-grid stakeholder-focused">
        <div class="stakeholder-engagement-dashboard full-width">
          <div class="stakeholder-header">
            <div class="header-content">
              <h4>🎯 Stakeholder Engagement Dashboard</h4>
              <p class="subtitle">Manage stakeholder groups and their materiality assessments</p>
            </div>
            <div class="header-actions">
              <button class="action-btn primary" (click)="generateStakeholderSurvey()">
                📋 Generate Survey
              </button>
              <button class="action-btn secondary" (click)="exportStakeholderReport()">
                📊 Export Report
              </button>
            </div>
          </div>

          <!-- Stakeholder Management Section -->
          <div class="stakeholder-management">
            <div class="management-header">
              <h5>👥 Stakeholder Groups</h5>
              <div class="add-stakeholder-form">
                <input 
                  [(ngModel)]="newStakeholder" 
                  placeholder="Enter stakeholder group name..." 
                  class="stakeholder-input"
                  (keyup.enter)="addStakeholder()" />
                <button class="add-btn" (click)="addStakeholder()">
                  <span class="icon">+</span>
                  <span class="text">Add Group</span>
                </button>
              </div>
            </div>

            <!-- Stakeholder Cards Grid -->
            <div class="stakeholder-cards-grid" *ngIf="stakeholderGroups.length">
              <div class="stakeholder-card" *ngFor="let stakeholder of stakeholderGroups; let i = index">
                <div class="card-header">
                  <div class="stakeholder-info">
                    <div class="stakeholder-icon">{{ getStakeholderIcon(stakeholder) }}</div>
                    <div class="stakeholder-details">
                      <h6>{{ stakeholder }}</h6>
                      <span class="weight-badge">{{ stakeholderWeights[i] }}% Weight</span>
                    </div>
                  </div>
                  <div class="card-actions">
                    <button class="edit-btn" (click)="editStakeholder(i)">
                      ✏️
                    </button>
                    <button class="delete-btn" (click)="removeStakeholder(i)">
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div class="weight-slider">
                  <label>Influence Weight:</label>
                  <div class="slider-container">
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      [(ngModel)]="stakeholderWeights[i]" 
                      (change)="updateStakeholderWeight(i, stakeholderWeights[i])"
                      class="weight-range" />
                    <span class="weight-value">{{ stakeholderWeights[i] }}%</span>
                  </div>
                </div>

                <div class="engagement-stats">
                  <div class="stat-item">
                    <span class="stat-label">Avg Score</span>
                    <span class="stat-value">{{ getStakeholderAverageScore(i) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Topics Rated</span>
                    <span class="stat-value">{{ getStakeholderRatedTopics(i) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="!stakeholderGroups.length">
              <div class="empty-icon">👥</div>
              <h5>No Stakeholder Groups</h5>
              <p>Add your first stakeholder group to begin materiality assessment</p>
            </div>
          </div>

          <!-- Materiality Assessment Matrix -->
          <div class="materiality-matrix-section full-width-section" *ngIf="stakeholderGroups.length">
            <div class="matrix-header">
              <h5>📊 Materiality Assessment Matrix</h5>
              <p>Stakeholder ratings for each ESG topic (1-5 scale)</p>
            </div>
            
            <div class="matrix-container">
              <div class="matrix-table-wrapper">
                <table class="materiality-matrix-table">
                  <thead>
                    <tr>
                      <th class="stakeholder-col">Stakeholder Group</th>
                      <th *ngFor="let topic of topics" class="topic-col">
                        <div class="topic-header">
                          <span class="topic-name">{{ topic.name }}</span>
                          <span class="topic-score">{{ getTopicAverageScore(topic) }}</span>
                        </div>
                      </th>
                      <th class="actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let stakeholder of stakeholderGroups; let i = index">
                      <td class="stakeholder-cell">
                        <div class="stakeholder-cell-content">
                          <span class="stakeholder-icon-small">{{ getStakeholderIcon(stakeholder) }}</span>
                          <span class="stakeholder-name">{{ stakeholder }}</span>
                        </div>
                      </td>
                      <td *ngFor="let topic of topics; let j = index" class="score-cell">
                        <div class="score-input-container">
                          <input 
                            type="number" 
                            min="1" 
                            max="5" 
                            [(ngModel)]="stakeholderScores[i][j]" 
                            class="score-input"
                            [class.high-score]="stakeholderScores[i][j] >= 4"
                            [class.medium-score]="stakeholderScores[i][j] === 3"
                            [class.low-score]="stakeholderScores[i][j] <= 2" />
                          <div class="score-indicator" [class]="getScoreIndicatorClass(stakeholderScores[i][j])"></div>
                        </div>
                      </td>
                      <td class="actions-cell">
                        <button class="matrix-action-btn" (click)="copyStakeholderScores(i)">
                          📋
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Stakeholder Insights -->
          <div class="stakeholder-insights" *ngIf="stakeholderGroups.length">
            <div class="insights-header">
              <h5>💡 Stakeholder Insights</h5>
            </div>
            <div class="insights-grid">
              <div class="insight-card">
                <div class="insight-icon">🎯</div>
                <div class="insight-content">
                  <h6>Most Influential</h6>
                  <p>{{ getMostInfluentialStakeholder() }}</p>
                  <span class="insight-value">{{ getHighestWeight() }}% weight</span>
                </div>
              </div>
              <div class="insight-card">
                <div class="insight-icon">📈</div>
                <div class="insight-content">
                  <h6>Highest Rated Topic</h6>
                  <p>{{ getHighestRatedTopic() }}</p>
                  <span class="insight-value">{{ getHighestTopicScore() }} avg score</span>
                </div>
              </div>
              <div class="insight-card">
                <div class="insight-icon">⚖️</div>
                <div class="insight-content">
                  <h6>Consensus Level</h6>
                  <p>{{ getConsensusLevel() }}</p>
                  <span class="insight-value">{{ getConsensusPercentage() }}% agreement</span>
                </div>
              </div>
              <div class="insight-card">
                <div class="insight-icon">🔄</div>
                <div class="insight-content">
                  <h6>Last Updated</h6>
                  <p>{{ getLastStakeholderUpdate() }}</p>
                  <span class="insight-value">{{ getStakeholderUpdateCount() }} changes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="import-section compact">
          <h4>📁 Import External Materiality Analysis</h4>
          <div class="import-controls">
            <input type="file" (change)="importCSV($event)" accept=".csv" class="file-input" />
            <button class="import-btn" (click)="triggerFileInput()">
              <span class="icon">📂</span>
              <span class="text">Choose File</span>
            </button>
          </div>
        </div>
      </div>
      <div class="dashboard-grid">
        <div class="materiality-toggle">
          <h4>Materiality Mode</h4>
          <button [class.active]="mode==='single'" (click)="mode='single'">Single Materiality</button>
          <button [class.active]="mode==='double'" (click)="mode='double'">Double Materiality</button>
        </div>
        
        <div class="scenario-bar">
          <h4>Risk Scenario</h4>
          <label>Global Risk Scenario: </label>
          <input type="range" min="-2" max="2" step="1" [(ngModel)]="scenario" (change)="applyScenario()" />
          <span>{{ scenarioLabel }}</span>
        </div>
        
        <div class="add-topic-row">
          <h4>Add New Topic</h4>
          <input [(ngModel)]="newTopicName" placeholder="Add ESG Topic..." />
          <button (click)="addTopic()">Add</button>
        </div>
      </div>
      <div *ngIf="mode==='single'" class="full-width-section">
        <h3>Single Materiality: Financial Impact</h3>
        <table class="materiality-table">
          <thead>
            <tr><th>ESG Topic</th><th>Financial Impact</th><th>AI Suggestion</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let topic of topics; let i = index">
              <td>{{ topic.name }}</td>
              <td>
                <input type="range" min="1" max="5" [(ngModel)]="topic.financialMateriality" />
                <span class="score">{{ topic.financialMateriality }}</span>
              </td>
              <td>
                <span class="ai-badge" (mouseenter)="showExplanation(i, 'fin')" (mouseleave)="hideExplanation()">{{ topic.aiFinancialSuggestion }}
                  <span class="ai-info">?</span>
                </span>
                <div class="ai-explanation" *ngIf="explanationIndex===i && explanationType==='fin'">{{ topic.aiExplanation }}</div>
              </td>
              <td><button (click)="removeTopic(i)">🗑️</button></td>
            </tr>
          </tbody>
        </table>
        <div class="heatmap">
          <h4>Materiality Heatmap</h4>
          <div class="heatmap-row">
            <div *ngFor="let topic of topics" class="heatmap-cell" [style.background]="getColor(topic.financialMateriality)">
              {{ topic.name }}<br><b>{{ topic.financialMateriality }}</b>
            </div>
          </div>
        </div>
        <div class="trend-section">
          <h4>Historical Trends Analysis Dashboard</h4>
          
          <!-- Chart Type Selector -->
          <div class="chart-controls">
            <button 
              *ngFor="let chartType of chartTypes" 
              [class.active]="selectedChartType === chartType.value"
              (click)="selectedChartType = chartType.value"
              class="chart-type-btn">
              {{ chartType.label }}
            </button>
          </div>

          <!-- Multi-Chart Layout -->
          <div class="charts-grid">
            
            <!-- Main Chart Area -->
            <div class="main-chart-area">
              <div class="chart-container">
                <div class="chart-header">
                  <h3 class="chart-title">{{ getChartTitle() }}</h3>
                  <p class="chart-subtitle">{{ getChartSubtitle() }}</p>
                </div>
                


                <!-- Line Chart -->
                <div *ngIf="selectedChartType === 'line'" class="line-chart">
                  <svg width="100%" height="300">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#6c63ff;stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#6c63ff;stop-opacity:0.1" />
                      </linearGradient>
                    </defs>
                    
                    <!-- Grid Lines -->
                    <g class="grid-lines">
                      <line *ngFor="let i of [1,2,3,4,5]" 
                            [attr.x1]="0" [attr.y1]="i * 50" 
                            [attr.x2]="700" [attr.y2]="i * 50" 
                            class="grid-line" />
                    </g>
                    
                    <!-- Line Paths -->
                    <g *ngFor="let topic of topics.slice(0, 5); let i = index">
                      <path [attr.d]="getLinePath(topic.history, i)" 
                            class="line-path" 
                            [style.stroke]="getTopicColor(i)" />
                      <path [attr.d]="getAreaPath(topic.history, i)" 
                            class="area-path" 
                            [style.fill]="getTopicColor(i)" />
                      
                      <!-- Data Points -->
                      <g *ngFor="let value of topic.history; let j = index">
                        <circle [attr.cx]="j * 140 + 50" 
                                [attr.cy]="300 - value * 50" 
                                r="4" 
                                class="data-point"
                                [style.fill]="getTopicColor(i)" />
                      </g>
                    </g>
                    
                    <!-- Axis Labels -->
                    <g class="axis-labels">
                      <text *ngFor="let i of [1,2,3,4,5]; let j = index" 
                            [attr.x]="j * 140 + 50" 
                            y="320" 
                            class="x-label">Q{{ i }}</text>
                      <text *ngFor="let i of [1,2,3,4,5]" 
                            x="10" 
                            [attr.y]="i * 50 + 5" 
                            class="grid-label">{{ 6 - i }}</text>
                    </g>
                  </svg>
                </div>

                <!-- Radar Chart -->
                <div *ngIf="selectedChartType === 'radar'" class="radar-chart">
                  <svg width="100%" height="400">
                    <!-- Radar Circles -->
                    <g class="radar-circles">
                      <circle *ngFor="let i of [1,2,3,4,5]" 
                              cx="200" cy="200" 
                              [attr.r]="i * 30" 
                              class="radar-circle" />
                    </g>
                    
                    <!-- Axis Lines -->
                    <g class="axis-lines">
                      <line *ngFor="let i of [0,1,2,3,4,5]" 
                            [attr.x1]="200" [attr.y1]="200"
                            [attr.x2]="200 + Math.cos(i * Math.PI / 3 - Math.PI / 2) * 150"
                            [attr.y2]="200 + Math.sin(i * Math.PI / 3 - Math.PI / 2) * 150"
                            class="axis-line" />
                    </g>
                    
                    <!-- Radar Polygon -->
                    <polygon [attr.points]="getRadarPoints(topics.slice(0, 6), 'financial')" 
                             class="radar-polygon"
                             style="fill: rgba(108, 99, 255, 0.3); stroke: #6c63ff; stroke-width: 2;" />
                    
                    <!-- Labels -->
                    <g class="radar-labels">
                      <text *ngFor="let topic of topics.slice(0, 6); let i = index"
                            [attr.x]="200 + Math.cos(i * Math.PI / 3 - Math.PI / 2) * 170"
                            [attr.y]="200 + Math.sin(i * Math.PI / 3 - Math.PI / 2) * 170"
                            class="radar-label">{{ topic.name }}</text>
                    </g>
                  </svg>
                </div>

                <!-- Heatmap Chart -->
                <div *ngIf="selectedChartType === 'heatmap'" class="heatmap-chart">
                  <div class="heatmap-grid">
                    <div class="heatmap-header">
                      <div class="heatmap-cell header">Topic</div>
                      <div class="heatmap-cell header" *ngFor="let i of [1,2,3,4,5]">Q{{ i }}</div>
                    </div>
                    <div class="heatmap-row" *ngFor="let topic of topics.slice(0, 8)">
                      <div class="heatmap-cell label">{{ topic.name }}</div>
                      <div class="heatmap-cell" 
                           *ngFor="let value of topic.history"
                           [class]="getHeatmapClass(value)">
                        {{ value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar with Statistics -->
            <div class="chart-sidebar">
              <div class="stats-container">
                <h4>Chart Statistics</h4>
                <div class="chart-stats">
                  <div class="stat-item">
                    <span class="stat-label">Average Score</span>
                    <span class="stat-value">{{ getAverageScore() }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">High Priority</span>
                    <span class="stat-value">{{ getHighPriorityCount() }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Trend</span>
                    <span class="stat-value" [class.positive]="getTrend() > 0" [class.negative]="getTrend() < 0">
                      {{ getTrend() > 0 ? '+' : '' }}{{ getTrend() }}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="legend-container">
                <h4>Priority Legend</h4>
                <div class="chart-legend">
                  <span class="legend-item">
                    <span class="legend-color high"></span>
                    <span>High Priority (4-5)</span>
                  </span>
                  <span class="legend-item">
                    <span class="legend-color medium"></span>
                    <span>Medium Priority (3)</span>
                  </span>
                  <span class="legend-item">
                    <span class="legend-color low"></span>
                    <span>Low Priority (1-2)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="mode==='double'" class="full-width-section">
        <h3>Double Materiality: Financial & Environmental/Social Impact</h3>
        <table class="materiality-table">
          <thead>
            <tr><th>ESG Topic</th><th>Financial Impact</th><th>AI</th><th>Env/Soc Impact</th><th>AI</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let topic of topics; let i = index">
              <td>{{ topic.name }}</td>
              <td>
                <input type="range" min="1" max="5" [(ngModel)]="topic.financialMateriality" />
                <span class="score">{{ topic.financialMateriality }}</span>
              </td>
              <td>
                <span class="ai-badge" (mouseenter)="showExplanation(i, 'fin')" (mouseleave)="hideExplanation()">{{ topic.aiFinancialSuggestion }}
                  <span class="ai-info">?</span>
                </span>
                <div class="ai-explanation" *ngIf="explanationIndex===i && explanationType==='fin'">{{ topic.aiExplanation }}</div>
              </td>
              <td>
                <input type="range" min="1" max="5" [(ngModel)]="topic.environmentalSocialMateriality" />
                <span class="score">{{ topic.environmentalSocialMateriality }}</span>
              </td>
              <td>
                <span class="ai-badge" (mouseenter)="showExplanation(i, 'env')" (mouseleave)="hideExplanation()">{{ topic.aiEnvSocSuggestion }}
                  <span class="ai-info">?</span>
                </span>
                <div class="ai-explanation" *ngIf="explanationIndex===i && explanationType==='env'">{{ topic.aiExplanation }}</div>
              </td>
              <td><button (click)="removeTopic(i)">🗑️</button></td>
            </tr>
          </tbody>
        </table>
        <div class="double-materiality-section">
          <h4>Double Materiality Analysis Dashboard</h4>
          
          <!-- Chart Type Selector -->
          <div class="chart-controls">
            <button 
              *ngFor="let chartType of doubleMaterialityChartTypes" 
              [class.active]="selectedDoubleMaterialityChartType === chartType.value"
              (click)="selectedDoubleMaterialityChartType = chartType.value"
              class="chart-type-btn">
              {{ chartType.label }}
            </button>
          </div>

          <!-- Multi-Chart Layout -->
          <div class="charts-grid">
            
            <!-- Main Chart Area -->
            <div class="main-chart-area">
              <div class="chart-container">
                <div class="chart-header">
                  <h3 class="chart-title">{{ getDoubleMaterialityChartTitle() }}</h3>
                  <p class="chart-subtitle">{{ getDoubleMaterialityChartSubtitle() }}</p>
                </div>
                
                <!-- Line Chart for Double Materiality -->
                <div *ngIf="selectedDoubleMaterialityChartType === 'line'" class="line-chart">
                  <svg width="100%" height="300">
                    <defs>
                      <linearGradient id="doubleLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#6c63ff;stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#6c63ff;stop-opacity:0.1" />
                      </linearGradient>
                    </defs>
                    
                    <!-- Grid Lines -->
                    <g class="grid-lines">
                      <line *ngFor="let i of [1,2,3,4,5]" 
                            [attr.x1]="0" [attr.y1]="i * 50" 
                            [attr.x2]="700" [attr.y2]="i * 50" 
                            class="grid-line" />
                    </g>
                    
                    <!-- Financial Materiality Line -->
                    <g>
                      <path [attr.d]="getDoubleMaterialityLinePath('financial')" 
                            class="line-path" 
                            style="stroke: #6c63ff; stroke-width: 3;" />
                      
                      <!-- Financial Data Points -->
                      <g *ngFor="let topic of topics.slice(0, 5); let i = index">
                        <circle [attr.cx]="i * 140 + 50" 
                                [attr.cy]="300 - topic.financialMateriality * 50" 
                                r="6" 
                                class="data-point"
                                style="fill: #6c63ff;" />
                        <text [attr.x]="i * 140 + 50" 
                              [attr.y]="300 - topic.financialMateriality * 50 - 10" 
                              text-anchor="middle" 
                              class="data-label">{{ topic.financialMateriality }}</text>
                      </g>
                    </g>
                    
                    <!-- Environmental/Social Materiality Line -->
                    <g>
                      <path [attr.d]="getDoubleMaterialityLinePath('environmental')" 
                            class="line-path" 
                            style="stroke: #4bc0c0; stroke-width: 3;" />
                      
                      <!-- Environmental Data Points -->
                      <g *ngFor="let topic of topics.slice(0, 5); let i = index">
                        <circle [attr.cx]="i * 140 + 50" 
                                [attr.cy]="300 - topic.environmentalSocialMateriality * 50" 
                                r="6" 
                                class="data-point"
                                style="fill: #4bc0c0;" />
                        <text [attr.x]="i * 140 + 50" 
                              [attr.y]="300 - topic.environmentalSocialMateriality * 50 - 10" 
                              text-anchor="middle" 
                              class="data-label">{{ topic.environmentalSocialMateriality }}</text>
                      </g>
                    </g>
                    
                    <!-- Axis Labels -->
                    <g class="axis-labels">
                      <text *ngFor="let topic of topics.slice(0, 5); let i = index" 
                            [attr.x]="i * 140 + 50" 
                            y="320" 
                            class="x-label">{{ topic.name.substring(0, 15) }}</text>
                      <text *ngFor="let i of [1,2,3,4,5]" 
                            x="10" 
                            [attr.y]="i * 50 + 5" 
                            class="grid-label">{{ 6 - i }}</text>
                    </g>
                    
                    <!-- Legend -->
                    <g class="chart-legend-svg">
                      <circle cx="50" cy="30" r="4" style="fill: #6c63ff;" />
                      <text x="60" y="35" class="legend-text">Financial Materiality</text>
                      <circle cx="200" cy="30" r="4" style="fill: #4bc0c0;" />
                      <text x="210" y="35" class="legend-text">Environmental/Social Materiality</text>
                    </g>
                  </svg>
                </div>

                <!-- Radar Chart for Double Materiality -->
                <div *ngIf="selectedDoubleMaterialityChartType === 'radar'" class="radar-chart">
                  <svg width="100%" height="400">
                    <!-- Radar Circles -->
                    <g class="radar-circles">
                      <circle *ngFor="let i of [1,2,3,4,5]" 
                              cx="200" cy="200" 
                              [attr.r]="i * 30" 
                              class="radar-circle" />
                    </g>
                    
                    <!-- Axis Lines -->
                    <g class="axis-lines">
                      <line *ngFor="let i of [0,1,2,3,4,5]" 
                            [attr.x1]="200" [attr.y1]="200"
                            [attr.x2]="200 + Math.cos(i * Math.PI / 3 - Math.PI / 2) * 150"
                            [attr.y2]="200 + Math.sin(i * Math.PI / 3 - Math.PI / 2) * 150"
                            class="axis-line" />
                    </g>
                    
                    <!-- Financial Materiality Polygon -->
                    <polygon [attr.points]="getRadarPoints(topics.slice(0, 6), 'financial')" 
                             class="radar-polygon"
                             style="fill: rgba(108, 99, 255, 0.3); stroke: #6c63ff; stroke-width: 2;" />
                    
                    <!-- Environmental/Social Materiality Polygon -->
                    <polygon [attr.points]="getRadarPoints(topics.slice(0, 6), 'environmental')" 
                             class="radar-polygon"
                             style="fill: rgba(75, 192, 192, 0.3); stroke: #4bc0c0; stroke-width: 2;" />
                    
                    <!-- Labels -->
                    <g class="radar-labels">
                      <text *ngFor="let topic of topics.slice(0, 6); let i = index"
                            [attr.x]="200 + Math.cos(i * Math.PI / 3 - Math.PI / 2) * 170"
                            [attr.y]="200 + Math.sin(i * Math.PI / 3 - Math.PI / 2) * 170"
                            class="radar-label">{{ topic.name.substring(0, 12) }}</text>
                    </g>
                    
                    <!-- Legend -->
                    <g class="chart-legend-svg">
                      <polygon points="50,30 60,25 70,30 60,35" style="fill: rgba(108, 99, 255, 0.3); stroke: #6c63ff;" />
                      <text x="80" y="35" class="legend-text">Financial</text>
                      <polygon points="200,30 210,25 220,30 210,35" style="fill: rgba(75, 192, 192, 0.3); stroke: #4bc0c0;" />
                      <text x="230" y="35" class="legend-text">Environmental/Social</text>
                    </g>
                  </svg>
                </div>

                <!-- Heatmap Chart for Double Materiality -->
                <div *ngIf="selectedDoubleMaterialityChartType === 'heatmap'" class="heatmap-chart">
                  <div class="heatmap-grid">
                    <div class="heatmap-header">
                      <div class="heatmap-cell header">Topic</div>
                      <div class="heatmap-cell header">Financial</div>
                      <div class="heatmap-cell header">Env/Soc</div>
                      <div class="heatmap-cell header">AI Financial</div>
                      <div class="heatmap-cell header">AI Env/Soc</div>
                      <div class="heatmap-cell header">Priority</div>
                    </div>
                    <div class="heatmap-row" *ngFor="let topic of topics.slice(0, 8)">
                      <div class="heatmap-cell label">{{ topic.name }}</div>
                      <div class="heatmap-cell" [class]="getHeatmapClass(topic.financialMateriality)">
                        {{ topic.financialMateriality }}
                      </div>
                      <div class="heatmap-cell" [class]="getHeatmapClass(topic.environmentalSocialMateriality)">
                        {{ topic.environmentalSocialMateriality }}
                      </div>
                      <div class="heatmap-cell" [class]="getHeatmapClass(topic.aiFinancialSuggestion)">
                        {{ topic.aiFinancialSuggestion }}
                      </div>
                      <div class="heatmap-cell" [class]="getHeatmapClass(topic.aiEnvSocSuggestion)">
                        {{ topic.aiEnvSocSuggestion }}
                      </div>
                      <div class="heatmap-cell" [class]="getMaterialityCategoryClass(topic)">
                        {{ getMaterialityCategory(topic) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar with Statistics -->
            <div class="chart-sidebar">
              <div class="stats-container">
                <h4>Double Materiality Stats</h4>
                <div class="chart-stats">
                  <div class="stat-item">
                    <span class="stat-label">Avg Financial</span>
                    <span class="stat-value">{{ getAverageFinancialScore() }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Avg Env/Soc</span>
                    <span class="stat-value">{{ getAverageEnvSocScore() }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">High Priority</span>
                    <span class="stat-value">{{ getHighPriorityDoubleCount() }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Balance Score</span>
                    <span class="stat-value" [class.positive]="getBalanceScore() > 0" [class.negative]="getBalanceScore() < 0">
                      {{ getBalanceScore() > 0 ? '+' : '' }}{{ getBalanceScore() }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="legend-container">
                <h4>Materiality Categories</h4>
                <div class="chart-legend">
                  <span class="legend-item">
                    <span class="legend-color high"></span>
                    <span>High Priority (4-5)</span>
                  </span>
                  <span class="legend-item">
                    <span class="legend-color medium"></span>
                    <span>Medium Priority (3)</span>
                  </span>
                  <span class="legend-item">
                    <span class="legend-color low"></span>
                    <span>Low Priority (1-2)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="materiality-overview full-width-section">
        <h4>Materiality Assessment Overview</h4>
        <div class="overview-grid">
          <div class="overview-card">
            <h5>Assessment Status</h5>
            <p>{{ assessmentStatus }}</p>
          </div>
          <div class="overview-card">
            <h5>Last Updated</h5>
            <p>{{ lastUpdated }}</p>
          </div>
          <div class="overview-card">
            <h5>Priority Matrix</h5>
            <p>{{ materialityMatrix }}</p>
          </div>
        </div>
      </div>

      <div class="priority-categories full-width-section">
        <h4>Topics by Priority Category</h4>
        <div class="category-grid">
          <div class="category-card high-priority">
            <h5>High Priority ({{ getTopicsByCategory('High Priority').length }})</h5>
            <ul>
              <li *ngFor="let topic of getTopicsByCategory('High Priority')">{{ topic.name }}</li>
            </ul>
          </div>
          <div class="category-card financial-priority">
            <h5>Financial Priority ({{ getTopicsByCategory('Financial Priority').length }})</h5>
            <ul>
              <li *ngFor="let topic of getTopicsByCategory('Financial Priority')">{{ topic.name }}</li>
            </ul>
          </div>
          <div class="category-card sustainability-priority">
            <h5>Sustainability Priority ({{ getTopicsByCategory('Sustainability Priority').length }})</h5>
            <ul>
              <li *ngFor="let topic of getTopicsByCategory('Sustainability Priority')">{{ topic.name }}</li>
            </ul>
          </div>
          <div class="category-card monitor">
            <h5>Monitor ({{ getTopicsByCategory('Monitor').length }})</h5>
            <ul>
              <li *ngFor="let topic of getTopicsByCategory('Monitor')">{{ topic.name }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="stakeholder-weights full-width-section">
        <h4>Stakeholder Weights</h4>
        <div class="weights-grid">
          <div *ngFor="let stakeholder of stakeholderGroups; let i = index" class="weight-item">
            <label>{{ stakeholder }}: {{ stakeholderWeights[i] }}%</label>
            <input type="range" min="0" max="50" [(ngModel)]="stakeholderWeights[i]" (change)="updateStakeholderWeight(i, stakeholderWeights[i])" />
          </div>
        </div>
      </div>

      <div class="export-actions full-width-section">
        <h4>Export & Actions</h4>
        <button (click)="exportCSV()">Export to CSV</button>
        <button (click)="generateStakeholderSurvey()">Generate Survey</button>
        <button (click)="exportMaterialityReport()">Export Full Report</button>
      </div>

      <div class="ai-summary full-width-section">
        <h4>AI-Powered Insights & Recommendations</h4>
        <div class="insights-content">
          <p><strong>Current Assessment:</strong> {{ aiSummary }}</p>
          <div class="actionable-insights">
            <h5>Actionable Insights:</h5>
            <ul>
              <li *ngFor="let topic of getTopicsByCategory('High Priority')">
                <strong>{{ topic.name }}:</strong> Requires immediate attention for both financial and sustainability aspects
              </li>
              <li *ngFor="let topic of getTopicsByCategory('Financial Priority')">
                <strong>{{ topic.name }}:</strong> Focus on financial risk mitigation and compliance
              </li>
              <li *ngFor="let topic of getTopicsByCategory('Sustainability Priority')">
                <strong>{{ topic.name }}:</strong> Prioritize environmental and social impact management
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .materiality-main { 
      padding: 2rem; 
      width: 100%; 
      max-width: none; 
      margin: 0; 
      background: #f8fafc;
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .dashboard-grid.stakeholder-focused {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
    
    .full-width-section {
      grid-column: 1 / -1;
    }
    .purpose-section { background: #f7f9ff; border-radius: 1.2rem; padding: 1.2rem 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 8px #6c63ff11; }
    .purpose-desc, .scope-desc { font-size: 1.08rem; color: #2d2e83; margin-bottom: 0.5rem; }
    .materiality-customization { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .materiality-customization h4 { color: #2d2e83; margin-bottom: 1rem; }
    .materiality-customization label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2d2e83; }
    .materiality-customization select, .materiality-customization input { 
      width: 100%; 
      padding: 0.4rem 1rem; 
      border-radius: 0.7rem; 
      border: 1px solid #ccc; 
      margin-bottom: 0.7rem; 
    }
    .stakeholder-section { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .stakeholder-section h4 { color: #2d2e83; margin-bottom: 1rem; }
    .stakeholder-row { display: flex; gap: 0.7rem; margin-bottom: 0.7rem; }
    .stakeholder-row input { flex-grow: 1; }
    .stakeholder-row button { padding: 0.4rem 1.2rem; border-radius: 0.7rem; border: none; background: #4bc0c0; color: #fff; font-weight: 600; }
    .stakeholder-table { width: 100%; border-collapse: collapse; margin-top: 0.7rem; }
    .stakeholder-table th, .stakeholder-table td { padding: 0.5em 1em; text-align: left; }
    .stakeholder-table th { background: #6c63ff; color: #fff; }
    .stakeholder-table tr:nth-child(even) { background: #f7f9ff; }
    .stakeholder-table tr:nth-child(odd) { background: #e3e6ff22; }
    .import-section { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .import-section.compact { 
      padding: 1rem; 
      min-height: auto;
    }
    .import-section h4 { 
      color: #2d2e83; 
      margin-bottom: 0.75rem; 
      font-size: 1rem;
    }
    .import-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .file-input {
      display: none;
    }
    .import-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #4bc0c0, #3aa8a8);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }
    .import-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(75, 192, 192, 0.3);
    }
    .import-btn .icon {
      font-size: 1rem;
    }
    .materiality-toggle { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .materiality-toggle h4 { color: #2d2e83; margin-bottom: 1rem; }
    .materiality-toggle button { 
      margin-right: 1rem; 
      padding: 0.5rem 1.2rem; 
      border-radius: 1rem; 
      border: none; 
      background: #e3e6ff; 
      color: #2d2e83; 
      font-weight: 600; 
      cursor: pointer; 
    }
    .materiality-toggle button.active { background: #6c63ff; color: #fff; }
    .scenario-bar { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .scenario-bar h4 { color: #2d2e83; margin-bottom: 1rem; }
    .add-topic-row { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .add-topic-row h4 { color: #2d2e83; margin-bottom: 1rem; }
    .add-topic-row input { padding: 0.4rem 1rem; border-radius: 0.7rem; border: 1px solid #ccc; margin-right: 0.7rem; }
    .add-topic-row button { padding: 0.4rem 1.2rem; border-radius: 0.7rem; border: none; background: #4bc0c0; color: #fff; font-weight: 600; }
    .materiality-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
    .materiality-table th, .materiality-table td { padding: 0.7em 1em; text-align: left; }
    .materiality-table th { background: #6c63ff; color: #fff; }
    .materiality-table tr:nth-child(even) { background: #f7f9ff; }
    .materiality-table tr:nth-child(odd) { background: #e3e6ff22; }
    .ai-badge { background: #4bc0c0; color: #fff; border-radius: 0.7em; padding: 0.1em 0.6em; font-size: 0.85em; font-weight: 600; position: relative; cursor: pointer; }
    .ai-info { margin-left: 0.3em; font-size: 1em; color: #fff; background: #2d2e83; border-radius: 50%; padding: 0 0.4em; }
    .ai-explanation { position: absolute; background: #fff; color: #2d2e83; border: 1px solid #6c63ff; border-radius: 0.7em; padding: 0.7em 1em; font-size: 0.95em; z-index: 10; margin-top: 0.5em; min-width: 180px; box-shadow: 0 2px 8px #6c63ff22; }
    .score { font-weight: 700; margin-left: 0.5em; }
    .heatmap { margin-top: 2rem; }
    .heatmap-row, .heatmap-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
    .heatmap-cell { min-width: 120px; min-height: 70px; border-radius: 1rem; color: #fff; font-weight: 700; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 2px 8px #6c63ff22; text-align: center; font-size: 1rem; }
    .trend-section { 
      margin-top: 2rem; 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .trend-section h4 { color: #2d2e83; margin-bottom: 1rem; }
    
    /* Chart Controls */
    .chart-controls {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    
    .chart-type-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      background: #fff;
      color: #64748b;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .chart-type-btn:hover {
      border-color: #6c63ff;
      color: #6c63ff;
    }
    
    .chart-type-btn.active {
      background: #6c63ff;
      color: white;
      border-color: #6c63ff;
    }
    
    /* Multi-Chart Layout */
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      height: 500px;
    }
    
    .main-chart-area {
      background: #f8fafc;
      border-radius: 0.8rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    
    .chart-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .stats-container, .legend-container {
      background: #fff;
      border-radius: 0.8rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .stats-container h4, .legend-container h4 {
      color: #2d2e83;
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    .chart-stats {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .stat-item:last-child {
      border-bottom: none;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2d2e83;
    }
    
    .stat-value.positive {
      color: #10b981;
    }
    
    .stat-value.negative {
      color: #ef4444;
    }
    
    /* Modern Chart Styles */
    .chart-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .chart-header {
      margin-bottom: 1.5rem;
    }
    
    .chart-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #2d2e83;
      margin: 0 0 0.5rem 0;
    }
    
    .chart-subtitle {
      font-size: 0.95rem;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }
    
    /* Modern Bar Chart */
    .modern-bar-chart {
      display: flex;
      gap: 1rem;
      height: 300px;
      flex: 1;
    }
    
    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 600;
      padding-right: 1rem;
      min-width: 30px;
    }
    
    .y-label {
      text-align: right;
    }
    
    .chart-content {
      flex: 1;
      display: flex;
      align-items: end;
      justify-content: space-around;
      padding: 1rem 0;
    }
    
    .bars-container {
      display: flex;
      align-items: end;
      gap: 1.5rem;
      width: 100%;
      height: 100%;
    }
    
    .bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      position: relative;
    }
    
    .bar-value-label {
      background: rgba(25, 118, 210, 0.9);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      position: absolute;
      top: -2rem;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .modern-bar {
      width: 100%;
      max-width: 60px;
      border-radius: 0.5rem 0.5rem 0 0;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      position: relative;
      overflow: hidden;
    }
    
    .modern-bar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
      pointer-events: none;
    }
    
    .modern-bar:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    
    .bar-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      text-align: center;
      margin-top: 0.5rem;
    }
    
    /* Line Chart Styles */
    .line-chart svg {
      width: 100%;
      height: auto;
    }
    
    .line-path {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    
    .area-path {
      opacity: 0.3;
    }
    
    .data-point {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .data-point:hover {
      r: 6;
      stroke: white;
      stroke-width: 2;
    }
    
    .grid-line {
      stroke: #e2e8f0;
      stroke-width: 1;
    }
    
    .grid-label {
      font-size: 12px;
      fill: #64748b;
      font-weight: 500;
    }
    
    .x-label {
      font-size: 12px;
      fill: #64748b;
      font-weight: 500;
    }
    
    /* Radar Chart Styles */
    .radar-chart svg {
      width: 100%;
      height: auto;
    }
    
    .radar-circle {
      fill: none;
      stroke: #e2e8f0;
      stroke-width: 1;
    }
    
    .radar-label {
      font-size: 12px;
      fill: #64748b;
      font-weight: 500;
    }
    
    .axis-line {
      stroke: #e2e8f0;
      stroke-width: 1;
    }
    
    .radar-polygon {
      transition: all 0.3s ease;
    }
    
    .radar-polygon:hover {
      opacity: 0.8;
    }
    
    /* Heatmap Chart Styles */
    .heatmap-chart {
      overflow-x: auto;
    }
    
    .heatmap-grid {
      min-width: 600px;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .heatmap-header {
      display: grid;
      grid-template-columns: 200px repeat(5, 1fr);
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .heatmap-row {
      display: grid;
      grid-template-columns: 200px repeat(5, 1fr);
      border-bottom: 1px solid #e2e8f0;
    }
    
    .heatmap-row:last-child {
      border-bottom: none;
    }
    
    .heatmap-cell {
      padding: 0.75rem;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      border-right: 1px solid #e2e8f0;
    }
    
    .heatmap-cell:last-child {
      border-right: none;
    }
    
    .heatmap-cell.header {
      background: #f1f5f9;
      font-weight: 600;
      color: #475569;
    }
    
    .heatmap-cell.label {
      background: #f8fafc;
      text-align: left;
      font-weight: 600;
      color: #374151;
    }
    
    .heatmap-cell.high {
      background: #dcfce7;
      color: #166534;
    }
    
    .heatmap-cell.medium {
      background: #fef3c7;
      color: #92400e;
    }
    
    .heatmap-cell.low {
      background: #fee2e2;
      color: #991b1b;
    }
    
    /* Double Materiality Section Styles */
    .double-materiality-section {
      background: #fff;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px #6c63ff11;
      margin-top: 2rem;
    }
    
    .double-materiality-section h4 {
      color: #2d2e83;
      margin-bottom: 1rem;
    }
    
    /* SVG Chart Legend Styles */
    .chart-legend-svg {
      font-size: 12px;
    }
    
    .legend-text {
      fill: #64748b;
      font-weight: 500;
    }
    
    .data-label {
      font-size: 10px;
      fill: #374151;
      font-weight: 600;
    }
    
    /* Stakeholder Engagement Dashboard Styles */
    .stakeholder-engagement-dashboard {
      background: #fff;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(108, 99, 255, 0.1);
      margin-bottom: 2rem;
    }
    
    .stakeholder-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #f1f5f9;
    }
    
    .header-content h4 {
      color: #2d2e83;
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .subtitle {
      color: #64748b;
      margin: 0;
      font-size: 0.95rem;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
    }
    
    .action-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .action-btn.primary {
      background: linear-gradient(135deg, #6c63ff, #5a52d5);
      color: white;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
    }
    
    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(108, 99, 255, 0.4);
    }
    
    .action-btn.secondary {
      background: #f8fafc;
      color: #64748b;
      border: 2px solid #e2e8f0;
    }
    
    .action-btn.secondary:hover {
      background: #f1f5f9;
      color: #475569;
    }
    
    /* Stakeholder Management Section */
    .stakeholder-management {
      margin-bottom: 2rem;
    }
    
    .management-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .management-header h5 {
      color: #2d2e83;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .add-stakeholder-form {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .stakeholder-input {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      min-width: 250px;
      transition: border-color 0.2s ease;
    }
    
    .stakeholder-input:focus {
      outline: none;
      border-color: #6c63ff;
      box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    }
    
    .add-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #4bc0c0, #3aa8a8);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .add-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(75, 192, 192, 0.3);
    }
    
    .add-btn .icon {
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    /* Stakeholder Cards Grid */
    .stakeholder-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    
    .stakeholder-card {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .stakeholder-card:hover {
      border-color: #6c63ff;
      box-shadow: 0 8px 25px rgba(108, 99, 255, 0.15);
      transform: translateY(-2px);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .stakeholder-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .stakeholder-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #6c63ff, #5a52d5);
      color: white;
      border-radius: 50%;
    }
    
    .stakeholder-details h6 {
      margin: 0 0 0.25rem 0;
      color: #2d2e83;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .weight-badge {
      background: rgba(108, 99, 255, 0.1);
      color: #6c63ff;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .card-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .edit-btn, .delete-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }
    
    .edit-btn {
      background: #fef3c7;
      color: #d97706;
    }
    
    .edit-btn:hover {
      background: #fde68a;
      transform: scale(1.1);
    }
    
    .delete-btn {
      background: #fee2e2;
      color: #dc2626;
    }
    
    .delete-btn:hover {
      background: #fecaca;
      transform: scale(1.1);
    }
    
    /* Weight Slider */
    .weight-slider {
      margin-bottom: 1rem;
    }
    
    .weight-slider label {
      display: block;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .slider-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .weight-range {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: #e2e8f0;
      outline: none;
      -webkit-appearance: none;
    }
    
    .weight-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #6c63ff;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(108, 99, 255, 0.3);
    }
    
    .weight-range::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #6c63ff;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 6px rgba(108, 99, 255, 0.3);
    }
    
    .weight-value {
      color: #6c63ff;
      font-weight: 600;
      font-size: 0.9rem;
      min-width: 40px;
    }
    
    /* Engagement Stats */
    .engagement-stats {
      display: flex;
      gap: 1rem;
    }
    
    .stat-item {
      flex: 1;
      text-align: center;
      padding: 0.75rem;
      background: white;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
    }
    
    .stat-label {
      display: block;
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .stat-value {
      display: block;
      color: #2d2e83;
      font-size: 1.1rem;
      font-weight: 700;
    }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 1rem;
    }
    
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .empty-state h5 {
      color: #64748b;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    
    .empty-state p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.9rem;
    }
    
    /* Materiality Matrix Section */
    .materiality-matrix-section {
      margin-bottom: 2rem;
    }
    
    .materiality-matrix-section.full-width-section {
      grid-column: 1 / -1;
      margin-top: 2rem;
      padding: 2rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(108, 99, 255, 0.1);
    }
    
    .matrix-header {
      margin-bottom: 1.5rem;
    }
    
    .matrix-header h5 {
      color: #2d2e83;
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .matrix-header p {
      color: #64748b;
      margin: 0;
      font-size: 0.9rem;
    }
    
    .matrix-container {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 1.5rem;
      overflow-x: auto;
    }
    
    .materiality-matrix-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }
    
    .materiality-matrix-table th {
      background: linear-gradient(135deg, #6c63ff, #5a52d5);
      color: white;
      padding: 1rem;
      text-align: center;
      font-weight: 600;
      border-radius: 0.5rem;
    }
    
    .stakeholder-col {
      min-width: 150px;
    }
    
    .topic-col {
      min-width: 120px;
    }
    
    .actions-col {
      min-width: 80px;
    }
    
    .topic-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .topic-name {
      font-size: 0.85rem;
      line-height: 1.2;
    }
    
    .topic-score {
      font-size: 0.75rem;
      opacity: 0.9;
    }
    
    .materiality-matrix-table td {
      padding: 0.75rem;
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .stakeholder-cell {
      background: #f1f5f9;
      font-weight: 600;
    }
    
    .stakeholder-cell-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .stakeholder-icon-small {
      font-size: 1.2rem;
    }
    
    .stakeholder-name {
      font-size: 0.9rem;
      color: #2d2e83;
    }
    
    .score-input-container {
      position: relative;
      display: inline-block;
    }
    
    .score-input {
      width: 50px;
      padding: 0.5rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      text-align: center;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    
    .score-input:focus {
      outline: none;
      border-color: #6c63ff;
      box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    }
    
    .score-input.high-score {
      border-color: #10b981;
      background: #f0fdf4;
      color: #059669;
    }
    
    .score-input.medium-score {
      border-color: #f59e0b;
      background: #fffbeb;
      color: #d97706;
    }
    
    .score-input.low-score {
      border-color: #ef4444;
      background: #fef2f2;
      color: #dc2626;
    }
    
    .score-indicator {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .score-indicator.high {
      background: #10b981;
    }
    
    .score-indicator.medium {
      background: #f59e0b;
    }
    
    .score-indicator.low {
      background: #ef4444;
    }
    
    .score-indicator.empty {
      background: #cbd5e1;
    }
    
    .matrix-action-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: #f1f5f9;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .matrix-action-btn:hover {
      background: #6c63ff;
      color: white;
      transform: scale(1.1);
    }
    
    /* Stakeholder Insights */
    .stakeholder-insights {
      margin-top: 2rem;
    }
    
    .insights-header {
      margin-bottom: 1.5rem;
    }
    
    .insights-header h5 {
      color: #2d2e83;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .insight-card {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }
    
    .insight-card:hover {
      border-color: #6c63ff;
      box-shadow: 0 8px 25px rgba(108, 99, 255, 0.15);
      transform: translateY(-2px);
    }
    
    .insight-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #6c63ff, #5a52d5);
      color: white;
      border-radius: 50%;
    }
    
    .insight-content h6 {
      margin: 0 0 0.25rem 0;
      color: #2d2e83;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .insight-content p {
      margin: 0 0 0.25rem 0;
      color: #64748b;
      font-size: 0.85rem;
    }
    
    .insight-value {
      color: #6c63ff;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .chart-container {
      background: #f8fafc;
      border-radius: 0.8rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .chart-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2d2e83;
    }
    
    .chart-legend {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #64748b;
    }
    
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
    
    .legend-color.high { background: #10b981; }
    .legend-color.medium { background: #f59e0b; }
    .legend-color.low { background: #ef4444; }
    
    .bar-chart {
      display: flex;
      gap: 1rem;
      height: 400px;
    }
    
    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
      padding-right: 0.5rem;
      min-width: 20px;
    }
    
    .chart-content {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    
    .chart-grid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;
    }
    
    .grid-line {
      height: 1px;
      background: #e2e8f0;
      width: 100%;
    }
    
    .bars-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }
    
    .topic-bars {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-height: 40px;
    }
    
    .topic-label {
      min-width: 200px;
      font-size: 0.85rem;
      color: #374151;
      font-weight: 500;
      line-height: 1.2;
    }
    
    .bars-row {
      display: flex;
      gap: 0.5rem;
      align-items: end;
      flex: 1;
      height: 100px;
    }
    
    .bar {
      flex: 1;
      min-width: 30px;
      background: linear-gradient(to top, #6c63ff, #8b5cf6);
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .bar:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
    }
    
    .bar.high { background: linear-gradient(to top, #10b981, #059669); }
    .bar.medium { background: linear-gradient(to top, #f59e0b, #d97706); }
    .bar.low { background: linear-gradient(to top, #ef4444, #dc2626); }
    
    .bar-value {
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    
    .chart-x-axis {
      display: flex;
      justify-content: space-around;
      padding-top: 0.5rem;
      border-top: 1px solid #e2e8f0;
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }
    .scatter-section { margin-top: 2rem; }
    .materiality-overview { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .materiality-overview h4 { color: #2d2e83; margin-bottom: 1rem; }
    .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .overview-card { background: #f7f9ff; border-radius: 0.7rem; padding: 1rem; box-shadow: 0 2px 8px #6c63ff11; text-align: center; }
    .overview-card h5 { color: #2d2e83; margin-bottom: 0.5rem; }
    .overview-card p { color: #6c63ff; font-weight: 600; }
    
    .priority-categories { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .priority-categories h4 { color: #2d2e83; margin-bottom: 1rem; }
    .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .category-card { border-radius: 0.7rem; padding: 1rem; box-shadow: 0 2px 8px #6c63ff11; }
    .category-card.high-priority { background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: #fff; }
    .category-card.financial-priority { background: linear-gradient(135deg, #4ecdc4, #44a08d); color: #fff; }
    .category-card.sustainability-priority { background: linear-gradient(135deg, #45b7d1, #96c93d); color: #fff; }
    .category-card.monitor { background: linear-gradient(135deg, #f7f9ff, #e3e6ff); color: #2d2e83; }
    .category-card h5 { margin-bottom: 0.5rem; font-weight: 600; }
    .category-card ul { list-style: none; padding: 0; }
    .category-card li { padding: 0.2rem 0; font-size: 0.9rem; }
    
    .stakeholder-weights { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .stakeholder-weights h4 { color: #2d2e83; margin-bottom: 1rem; }
    .weights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .weight-item { background: #fff; border-radius: 0.7rem; padding: 1rem; box-shadow: 0 2px 8px #6c63ff11; }
    .weight-item label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2d2e83; }
    .weight-item input[type="range"] { width: 100%; }
    
    .export-actions { 
      background: #fff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
      text-align: center; 
    }
    .export-actions h4 { color: #2d2e83; margin-bottom: 1rem; }
    .export-actions button { margin: 0 0.5rem; padding: 0.5rem 1.2rem; border-radius: 0.7rem; border: none; background: #6c63ff; color: #fff; font-weight: 600; cursor: pointer; }
    .export-actions button:hover { background: #5a52d4; }
    
    .ai-summary { 
      background: #f7f9ff; 
      border-radius: 1rem; 
      padding: 1.5rem; 
      box-shadow: 0 2px 8px #6c63ff11; 
    }
    .ai-summary h4 { color: #2d2e83; margin-bottom: 1rem; }
    .insights-content { margin-top: 1rem; }
    .actionable-insights { margin-top: 1rem; }
    .actionable-insights h5 { color: #2d2e83; margin-bottom: 0.5rem; }
    .actionable-insights ul { list-style: none; padding: 0; }
    .actionable-insights li { padding: 0.3rem 0; border-bottom: 1px solid #e3e6ff; }
    .actionable-insights li:last-child { border-bottom: none; }
    @media (max-width: 900px) {
      .trend-section svg, .scatter-section svg { width: 100% !important; height: auto !important; }
      
      .charts-grid {
        grid-template-columns: 1fr;
        height: auto;
      }
      
      .chart-controls {
        justify-content: center;
      }
      
      .chart-type-btn {
        font-size: 0.875rem;
        padding: 0.4rem 0.8rem;
      }
      
      .modern-bar-chart {
        height: 250px;
      }
      
      .bars-container {
        gap: 1rem;
      }
      
      .bar-value-label {
        font-size: 0.75rem;
        padding: 0.2rem 0.4rem;
      }
      
      .modern-bar {
        max-width: 50px;
      }
      
      .chart-stats {
        gap: 1rem;
      }
      
      .stat-value {
        font-size: 1.1rem;
      }
      
      .heatmap-grid {
        min-width: 400px;
        font-size: 0.75rem;
      }
      
      .heatmap-cell {
        padding: 0.5rem;
      }
      
      .line-chart svg,
      .radar-chart svg {
        max-width: 100%;
        height: auto;
      }
    }
    
    @media (max-width: 600px) {
      .chart-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .chart-type-btn {
        text-align: center;
      }
      
      .modern-bar-chart {
        height: 200px;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .chart-y-axis {
        flex-direction: row;
        justify-content: space-between;
        padding-right: 0;
        padding-bottom: 0.5rem;
        min-width: auto;
      }
      
      .bars-container {
        gap: 0.5rem;
      }
      
      .bar-group {
        gap: 0.25rem;
      }
      
      .bar-value-label {
        font-size: 0.7rem;
        padding: 0.15rem 0.3rem;
        top: -1.5rem;
      }
      
      .modern-bar {
        max-width: 40px;
      }
      
      .chart-stats {
        flex-direction: column;
        gap: 1rem;
      }
      
      .stat-item {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      }
      
      .heatmap-grid {
        min-width: 300px;
        font-size: 0.7rem;
      }
      
      .heatmap-cell {
        padding: 0.25rem;
      }
    }
  `],
})
export class MaterialityComponent implements OnInit, OnDestroy {
  darkMode = false;
  sidebarCollapsed = false;
  mobileMenuOpen = false;
  isMobile = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  selectedChartType = 'line';
  chartTypes = [
    { value: 'line', label: '📈 Line Chart' },
    { value: 'radar', label: '🎯 Radar Chart' },
    { value: 'heatmap', label: '🔥 Heatmap' }
  ];
  
  // Make Math available in template
  Math = Math;
  
  // Double Materiality Chart Properties
  selectedDoubleMaterialityChartType = 'line';
  doubleMaterialityChartTypes = [
    { value: 'line', label: '📈 Line Chart' },
    { value: 'radar', label: '🎯 Radar Chart' },
    { value: 'heatmap', label: '🔥 Heatmap' }
  ];
  private themeSubscription!: Subscription;
  
  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: MaterialityTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Materiality language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Materiality translations not loaded yet');
      }
    }, 1000);
    
    this.updateSummary(); 
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
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
  
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
  }
  mode: 'single' | 'double' = 'single';
  scenario = 0;
  scenarioLabel = 'Neutral';
  newTopicName = '';
  explanationIndex: number|null = null;
  explanationType: 'fin'|'env'|null = null;
  aiSummary = '';
  selectedStakeholder = '';
  assessmentStatus = 'In Progress';
  lastUpdated = new Date().toLocaleDateString();
  materialityMatrix = 'High Priority';
  
  // Enhanced topics with more comprehensive ESG coverage
  topics: MaterialityTopic[] = [
    { name: 'Climate Change & Carbon Emissions', financialMateriality: 4, environmentalSocialMateriality: 5, aiFinancialSuggestion: 4, aiEnvSocSuggestion: 5, aiExplanation: 'High regulatory pressure, carbon pricing, and investor expectations make this highly material for financial performance and environmental impact.', history: [3,4,4,4,4] },
    { name: 'Water Management & Scarcity', financialMateriality: 3, environmentalSocialMateriality: 4, aiFinancialSuggestion: 3, aiEnvSocSuggestion: 4, aiExplanation: 'Water scarcity risks, regulatory compliance, and operational continuity concerns.', history: [2,3,3,3,3] },
    { name: 'Diversity, Equity & Inclusion', financialMateriality: 4, environmentalSocialMateriality: 5, aiFinancialSuggestion: 4, aiEnvSocSuggestion: 5, aiExplanation: 'Talent attraction, regulatory requirements, and social license to operate.', history: [3,3,4,4,4] },
    { name: 'Data Privacy & Cybersecurity', financialMateriality: 5, environmentalSocialMateriality: 3, aiFinancialSuggestion: 5, aiEnvSocSuggestion: 3, aiExplanation: 'High financial and reputational risks from data breaches and regulatory fines.', history: [4,4,4,5,5] },
    { name: 'Supply Chain Sustainability', financialMateriality: 4, environmentalSocialMateriality: 4, aiFinancialSuggestion: 4, aiEnvSocSuggestion: 4, aiExplanation: 'Operational resilience, regulatory compliance, and stakeholder expectations.', history: [3,3,4,4,4] },
    { name: 'Waste Management & Circular Economy', financialMateriality: 3, environmentalSocialMateriality: 4, aiFinancialSuggestion: 3, aiEnvSocSuggestion: 4, aiExplanation: 'Regulatory requirements, cost savings opportunities, and environmental impact reduction.', history: [2,2,3,3,3] },
    { name: 'Board Diversity & Governance', financialMateriality: 4, environmentalSocialMateriality: 3, aiFinancialSuggestion: 4, aiEnvSocSuggestion: 3, aiExplanation: 'Investor expectations, regulatory scrutiny, and decision-making quality.', history: [3,3,3,4,4] },
    { name: 'Energy Efficiency & Renewable Energy', financialMateriality: 4, environmentalSocialMateriality: 4, aiFinancialSuggestion: 4, aiEnvSocSuggestion: 4, aiExplanation: 'Cost reduction, regulatory compliance, and climate action alignment.', history: [3,3,4,4,4] },
    { name: 'Human Rights & Labor Standards', financialMateriality: 3, environmentalSocialMateriality: 5, aiFinancialSuggestion: 3, aiEnvSocSuggestion: 5, aiExplanation: 'Reputational risks, regulatory compliance, and social impact considerations.', history: [3,3,3,3,3] },
    { name: 'Biodiversity & Ecosystem Impact', financialMateriality: 2, environmentalSocialMateriality: 4, aiFinancialSuggestion: 2, aiEnvSocSuggestion: 4, aiExplanation: 'Regulatory requirements, stakeholder concerns, and long-term sustainability.', history: [2,2,2,3,2] },
    { name: 'Product Safety & Quality', financialMateriality: 5, environmentalSocialMateriality: 3, aiFinancialSuggestion: 5, aiEnvSocSuggestion: 3, aiExplanation: 'Legal liability, brand reputation, and customer trust.', history: [4,4,5,5,5] },
    { name: 'Community Relations & Social Impact', financialMateriality: 3, environmentalSocialMateriality: 4, aiFinancialSuggestion: 3, aiEnvSocSuggestion: 4, aiExplanation: 'Social license to operate, stakeholder relationships, and long-term business sustainability.', history: [3,3,3,3,3] }
  ];
  // Enhanced stakeholder groups with weights
  stakeholderGroups: string[] = ['Customers', 'Employees', 'Investors', 'Regulators', 'Suppliers', 'Communities', 'Media', 'NGOs'];
  stakeholderWeights: number[] = [25, 20, 20, 15, 10, 5, 3, 2]; // Percentage weights
  stakeholderScores: number[][] = [
    [4, 3, 4, 5, 3, 4, 3, 4, 4, 3, 2, 3], // Customers
    [5, 4, 5, 4, 4, 4, 4, 5, 4, 4, 3, 4], // Employees
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // Investors
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // Regulators
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // Suppliers
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // Communities
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // Media
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]  // NGOs
  ];
  newStakeholder = '';
  industry = 'Technology';
  inHouseGoal = 'Net Zero by 2030';
  industries = ['Technology', 'Energy', 'Financial Services', 'Manufacturing', 'Retail', 'Healthcare', 'Other'];

  showExplanation(i: number, type: 'fin'|'env') { this.explanationIndex = i; this.explanationType = type; }
  hideExplanation() { this.explanationIndex = null; this.explanationType = null; }

  addTopic() {
    if (!this.newTopicName.trim()) return;
    this.topics.push({
      name: this.newTopicName,
      financialMateriality: 3,
      environmentalSocialMateriality: 3,
      aiFinancialSuggestion: 3,
      aiEnvSocSuggestion: 3,
      aiExplanation: 'AI will analyze this topic soon.',
      history: [3,3,3,3,3]
    });
    this.newTopicName = '';
    this.updateSummary();
  }
  removeTopic(i: number) {
    this.topics.splice(i, 1);
    this.updateSummary();
  }
  getColor(score: number): string {
    if (score >= 4) return '#388e3c';
    if (score === 3) return '#ffce56';
    return '#e84343';
  }
  getDoubleColor(topic: MaterialityTopic): string {
    const avg = (topic.financialMateriality + topic.environmentalSocialMateriality) / 2;
    if (avg >= 4) return '#388e3c';
    if (avg >= 3) return '#ffce56';
    return '#e84343';
  }
  getTrendLine(): string {
    // Demo: average of first topic's history
    if (!this.topics.length) return '';
    return this.topics[0].history.map((v, i) => `${i*60+30},${110-v*20}`).join(' ');
  }
  
  getBarClass(value: number): string {
    if (value >= 4) return 'high';
    if (value === 3) return 'medium';
    return 'low';
  }
  
  getTopicColor(index: number): string {
    const colors = ['#6c63ff', '#4bc0c0', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
    return colors[index % colors.length];
  }
  
  getBarColor(value: number): string {
    if (value >= 4) return '#10b981';
    if (value === 3) return '#f59e0b';
    return '#ef4444';
  }
  
  getLinePath(history: number[], topicIndex: number): string {
    return history.map((value, index) => {
      const x = 50 + index * 140;
      const y = 300 - value * 50;
      return (index === 0 ? 'M' : 'L') + x + ',' + y;
    }).join(' ');
  }
  
  getAreaPath(history: number[], topicIndex: number): string {
    const linePath = this.getLinePath(history, topicIndex);
    const lastPoint = history[history.length - 1];
    const firstPoint = history[0];
    return linePath + ' L' + (50 + (history.length - 1) * 140) + ',300 L' + 50 + ',300 Z';
  }
  
  getRadarPoints(topics: MaterialityTopic[], type: 'financial' | 'environmental'): string {
    return topics.map((topic, index) => {
      const angle = (index * Math.PI / 3) - Math.PI / 2;
      const value = type === 'financial' ? topic.financialMateriality : topic.environmentalSocialMateriality;
      const radius = value * 30;
      const x = 200 + Math.cos(angle) * radius;
      const y = 200 + Math.sin(angle) * radius;
      return x + ',' + y;
    }).join(' ');
  }
  
  getHeatmapClass(value: number): string {
    if (value >= 4) return 'high';
    if (value === 3) return 'medium';
    return 'low';
  }
  
  getModernBarColor(value: number): string {
    if (value >= 4) return 'linear-gradient(180deg, #1976d2, #1565c0)';
    if (value === 3) return 'linear-gradient(180deg, #ff9800, #f57c00)';
    return 'linear-gradient(180deg, #f44336, #d32f2f)';
  }
  
  getDayLabel(index: number): string {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[index] || `Q${index + 1}`;
  }
  
  getAverageScore(): number {
    const scores = this.topics.slice(0, 7).map(t => t.financialMateriality);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 10) / 10;
  }
  
  getHighPriorityCount(): number {
    return this.topics.slice(0, 7).filter(t => t.financialMateriality >= 4).length;
  }
  
  getTrend(): number {
    // Simulate trend calculation based on historical data
    const currentScores = this.topics.slice(0, 7).map(t => t.financialMateriality);
    const avgCurrent = currentScores.reduce((sum, score) => sum + score, 0) / currentScores.length;
    
    // Simulate previous period average (slightly lower for demo)
    const avgPrevious = avgCurrent - 0.3;
    
    const trend = ((avgCurrent - avgPrevious) / avgPrevious) * 100;
    return Math.round(trend);
  }
  
  getChartTitle(): string {
    const titles: { [key: string]: string } = {
      'line': 'Trend Analysis Over Time',
      'radar': 'Multi-Dimensional Materiality View',
      'heatmap': 'Quarterly Performance Heatmap'
    };
    return titles[this.selectedChartType] || 'Chart Analysis';
  }
  
  getChartSubtitle(): string {
    const subtitles: { [key: string]: string } = {
      'line': 'Historical progression of materiality scores over 5 quarters',
      'radar': 'Comprehensive view of financial materiality across topics',
      'heatmap': 'Quarterly performance matrix showing score evolution'
    };
    return subtitles[this.selectedChartType] || 'Data visualization';
  }
  
  // Double Materiality Chart Methods
  getDoubleMaterialityLinePath(type: 'financial' | 'environmental'): string {
    const values = this.topics.slice(0, 5).map(topic => 
      type === 'financial' ? topic.financialMateriality : topic.environmentalSocialMateriality
    );
    return values.map((value, index) => {
      const x = index * 140 + 50;
      const y = 300 - value * 50;
      return (index === 0 ? 'M' : 'L') + x + ',' + y;
    }).join(' ');
  }
  
  getDoubleMaterialityChartTitle(): string {
    const titles: { [key: string]: string } = {
      'line': 'Financial vs Environmental/Social Materiality Trends',
      'radar': 'Multi-Dimensional Double Materiality View',
      'heatmap': 'Double Materiality Performance Matrix'
    };
    return titles[this.selectedDoubleMaterialityChartType] || 'Double Materiality Analysis';
  }
  
  getDoubleMaterialityChartSubtitle(): string {
    const subtitles: { [key: string]: string } = {
      'line': 'Comparison of financial and environmental/social materiality scores',
      'radar': 'Comprehensive view of both materiality dimensions across topics',
      'heatmap': 'Detailed matrix showing all materiality dimensions and AI suggestions'
    };
    return subtitles[this.selectedDoubleMaterialityChartType] || 'Double materiality analysis';
  }
  
  getAverageFinancialScore(): number {
    const scores = this.topics.map(t => t.financialMateriality);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 10) / 10;
  }
  
  getAverageEnvSocScore(): number {
    const scores = this.topics.map(t => t.environmentalSocialMateriality);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 10) / 10;
  }
  
  getHighPriorityDoubleCount(): number {
    return this.topics.filter(t => 
      t.financialMateriality >= 4 || t.environmentalSocialMateriality >= 4
    ).length;
  }
  
  getBalanceScore(): number {
    const financialAvg = this.getAverageFinancialScore();
    const envSocAvg = this.getAverageEnvSocScore();
    const balance = financialAvg - envSocAvg;
    return Math.round(balance * 10) / 10;
  }
  
  getMaterialityCategoryClass(topic: MaterialityTopic): string {
    const category = this.getMaterialityCategory(topic);
    switch (category) {
      case 'High Priority': return 'high';
      case 'Financial Priority': return 'medium';
      case 'Sustainability Priority': return 'medium';
      default: return 'low';
    }
  }
  exportCSV() {
    let csv = 'Topic,Financial,Env/Soc,AI Financial,AI Env/Soc\n';
    for (const t of this.topics) {
      csv += `${t.name},${t.financialMateriality},${t.environmentalSocialMateriality},${t.aiFinancialSuggestion},${t.aiEnvSocSuggestion}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materiality.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  applyScenario() {
    // Demo: adjust all scores by scenario
    for (const t of this.topics) {
      t.financialMateriality = Math.max(1, Math.min(5, t.aiFinancialSuggestion + this.scenario));
      t.environmentalSocialMateriality = Math.max(1, Math.min(5, t.aiEnvSocSuggestion + this.scenario));
    }
    this.updateSummary();
    this.scenarioLabel = this.scenario === 0 ? 'Neutral' : (this.scenario > 0 ? 'High Risk' : 'Low Risk');
  }
  updateSummary() {
    // Demo: summarize top 3 topics by average materiality
    const sorted = [...this.topics].sort((a, b) => ((b.financialMateriality + b.environmentalSocialMateriality) - (a.financialMateriality + a.environmentalSocialMateriality)));
    this.aiSummary = 'Top material topics: ' + sorted.slice(0, 3).map(t => t.name).join(', ') + '.';
  }
  addStakeholder() {
    if (!this.newStakeholder.trim()) return;
    this.stakeholderGroups.push(this.newStakeholder);
    this.stakeholderScores.push(this.topics.map(() => 3)); // Initialize scores for new stakeholder
    this.newStakeholder = '';
  }
  removeStakeholder(index: number) {
    this.stakeholderGroups.splice(index, 1);
    this.stakeholderScores.splice(index, 1);
  }
  importCSV(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const csv = e.target.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const data: MaterialityTopic[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',');
          if (row.length === 5) {
            data.push({
              name: row[0].trim(),
              financialMateriality: parseInt(row[1].trim(), 10),
              environmentalSocialMateriality: parseInt(row[2].trim(), 10),
              aiFinancialSuggestion: parseInt(row[3].trim(), 10),
              aiEnvSocSuggestion: parseInt(row[4].trim(), 10),
              aiExplanation: 'Imported from CSV',
              history: [3,3,3,3,3] // Placeholder for history
            });
          }
        }
        this.topics = data;
        this.updateSummary();
        alert('Topics imported successfully!');
      }
    };
    reader.readAsText(file);
  }
  getWeightedFinancial(topicIndex: number): number {
    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < this.stakeholderGroups.length; i++) {
      weightedSum += this.stakeholderScores[i][topicIndex] * this.topics[topicIndex].financialMateriality;
      totalWeight += this.stakeholderScores[i][topicIndex];
    }
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }
  getWeightedEnvSoc(topicIndex: number): number {
    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < this.stakeholderGroups.length; i++) {
      weightedSum += this.stakeholderScores[i][topicIndex] * this.topics[topicIndex].environmentalSocialMateriality;
      totalWeight += this.stakeholderScores[i][topicIndex];
    }
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  // Enhanced stakeholder survey functionality
  generateStakeholderSurvey() {
    let survey = 'Materiality Assessment Stakeholder Survey\n\n';
    survey += 'Dear Stakeholder,\n\n';
    survey += 'We are conducting a materiality assessment to identify and prioritize the most important ESG (Environmental, Social, and Governance) topics for our organization. Your input is valuable in helping us understand stakeholder perspectives.\n\n';
    survey += 'Please rate the importance of each topic on a scale of 1-5:\n';
    survey += '1 = Not Important, 2 = Low Importance, 3 = Moderate Importance, 4 = High Importance, 5 = Critical Importance\n\n';
    
    this.topics.forEach((topic, index) => {
      survey += `${index + 1}. ${topic.name}\n`;
      survey += `   Financial Impact: ___ (1-5)\n`;
      survey += `   Environmental/Social Impact: ___ (1-5)\n\n`;
    });
    
    survey += 'Additional Comments:\n';
    survey += '_________________________________\n\n';
    survey += 'Thank you for your participation!\n';
    
    const blob = new Blob([survey], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stakeholder_survey.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Materiality matrix categorization
  getMaterialityCategory(topic: MaterialityTopic): string {
    const finScore = topic.financialMateriality;
    const envSocScore = topic.environmentalSocialMateriality;
    
    if (finScore >= 4 && envSocScore >= 4) return 'High Priority';
    if (finScore >= 4 && envSocScore < 4) return 'Financial Priority';
    if (finScore < 4 && envSocScore >= 4) return 'Sustainability Priority';
    return 'Monitor';
  }

  // Get topics by category
  getTopicsByCategory(category: string): MaterialityTopic[] {
    return this.topics.filter(topic => this.getMaterialityCategory(topic) === category);
  }

  // Enhanced AI summary with actionable insights
  generateActionableInsights() {
    const highPriority = this.getTopicsByCategory('High Priority');
    const financialPriority = this.getTopicsByCategory('Financial Priority');
    const sustainabilityPriority = this.getTopicsByCategory('Sustainability Priority');
    
    let insights = 'Materiality Assessment Insights & Recommendations\n\n';
    insights += `Assessment Date: ${new Date().toLocaleDateString()}\n`;
    insights += `Industry: ${this.industry}\n\n`;
    
    insights += 'HIGH PRIORITY TOPICS (Immediate Action Required):\n';
    highPriority.forEach(topic => {
      insights += `• ${topic.name}: Focus on both financial and sustainability aspects\n`;
    });
    
    insights += '\nFINANCIAL PRIORITY TOPICS (Financial Risk Management):\n';
    financialPriority.forEach(topic => {
      insights += `• ${topic.name}: Prioritize financial risk mitigation\n`;
    });
    
    insights += '\nSUSTAINABILITY PRIORITY TOPICS (Environmental/Social Impact):\n';
    sustainabilityPriority.forEach(topic => {
      insights += `• ${topic.name}: Focus on environmental and social impact management\n`;
    });
    
    insights += '\nSTRATEGIC RECOMMENDATIONS:\n';
    insights += '1. Develop action plans for high-priority topics\n';
    insights += '2. Integrate materiality findings into strategic planning\n';
    insights += '3. Establish KPIs for priority topics\n';
    insights += '4. Regular stakeholder engagement for ongoing assessment\n';
    insights += '5. Annual materiality review and update\n';
    
    return insights;
  }

  // Export comprehensive materiality report
  exportMaterialityReport() {
    const report = this.generateActionableInsights();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materiality_assessment_report.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Update stakeholder weights
  updateStakeholderWeight(index: number, weight: number) {
    this.stakeholderWeights[index] = weight;
    this.updateSummary();
  }
  
  // New Stakeholder Dashboard Methods
  getStakeholderIcon(stakeholder: string): string {
    const icons: { [key: string]: string } = {
      'Customers': '👥',
      'Employees': '👨‍💼',
      'Investors': '💰',
      'Regulators': '⚖️',
      'Suppliers': '🏭',
      'Communities': '🏘️',
      'Media': '📰',
      'NGOs': '🌍'
    };
    return icons[stakeholder] || '👤';
  }
  
  getStakeholderAverageScore(index: number): number {
    const scores = this.stakeholderScores[index] || [];
    const validScores = scores.filter(score => score > 0);
    if (validScores.length === 0) return 0;
    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return Math.round(average * 10) / 10;
  }
  
  getStakeholderRatedTopics(index: number): number {
    const scores = this.stakeholderScores[index] || [];
    return scores.filter(score => score > 0).length;
  }
  
  getTopicAverageScore(topic: MaterialityTopic): number {
    const topicIndex = this.topics.indexOf(topic);
    if (topicIndex === -1) return 0;
    
    const scores = this.stakeholderGroups.map((_, i) => this.stakeholderScores[i]?.[topicIndex] || 0);
    const validScores = scores.filter(score => score > 0);
    if (validScores.length === 0) return 0;
    
    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return Math.round(average * 10) / 10;
  }
  
  getScoreIndicatorClass(score: number): string {
    if (score >= 4) return 'high';
    if (score === 3) return 'medium';
    if (score <= 2) return 'low';
    return 'empty';
  }
  
  getMostInfluentialStakeholder(): string {
    const maxWeight = Math.max(...this.stakeholderWeights);
    const index = this.stakeholderWeights.indexOf(maxWeight);
    return this.stakeholderGroups[index] || 'None';
  }
  
  getHighestWeight(): number {
    return Math.max(...this.stakeholderWeights);
  }
  
  getHighestRatedTopic(): string {
    const topicScores = this.topics.map(topic => this.getTopicAverageScore(topic));
    const maxScore = Math.max(...topicScores);
    const index = topicScores.indexOf(maxScore);
    return this.topics[index]?.name || 'None';
  }
  
  getHighestTopicScore(): number {
    const topicScores = this.topics.map(topic => this.getTopicAverageScore(topic));
    return Math.max(...topicScores);
  }
  
  getConsensusLevel(): string {
    const topicScores = this.topics.map(topic => this.getTopicAverageScore(topic));
    const variance = this.calculateVariance(topicScores);
    if (variance < 0.5) return 'High Consensus';
    if (variance < 1.0) return 'Moderate Consensus';
    return 'Low Consensus';
  }
  
  getConsensusPercentage(): number {
    const topicScores = this.topics.map(topic => this.getTopicAverageScore(topic));
    const variance = this.calculateVariance(topicScores);
    const maxVariance = 4; // Maximum possible variance for 1-5 scale
    const consensus = Math.max(0, 100 - (variance / maxVariance) * 100);
    return Math.round(consensus);
  }
  
  getLastStakeholderUpdate(): string {
    return new Date().toLocaleDateString();
  }
  
  getStakeholderUpdateCount(): number {
    return this.stakeholderGroups.length * this.topics.length;
  }
  
  calculateVariance(scores: number[]): number {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
    return variance;
  }
  
  editStakeholder(index: number) {
    // Placeholder for edit functionality
    console.log('Edit stakeholder:', this.stakeholderGroups[index]);
  }
  
  copyStakeholderScores(index: number) {
    const scores = this.stakeholderScores[index];
    const scoreText = scores.join(', ');
    navigator.clipboard.writeText(scoreText);
    // You could add a toast notification here
  }
  
  exportStakeholderReport() {
    let csv = 'Stakeholder Group,Weight,';
    csv += this.topics.map(topic => topic.name).join(',') + '\n';
    
    this.stakeholderGroups.forEach((stakeholder, i) => {
      csv += `${stakeholder},${this.stakeholderWeights[i]},`;
      csv += this.stakeholderScores[i].join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stakeholder-engagement-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  triggerFileInput() {
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
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