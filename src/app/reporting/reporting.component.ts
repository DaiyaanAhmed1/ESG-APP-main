import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ReportingTranslationService } from '../services/reporting-translation.service';
import { ThemeService } from '../services/theme.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reporting',
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
      
      /* Dark mode styles for main content */
      .edash-root.dark-mode .edash-main {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
        .report-root { flex-direction: column; }
        .edash-sidenav {
          position: static;
          width: 100%;
          height: auto;
          margin-left: 0;
        }
        .report-root > .report-main {
          margin-left: 0;
        }
      }
      .report-main {
        flex: 1;
        padding: 2rem;
        background: #f8fafc;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .report-main {
        background: #181828;
        color: #e0e0e0;
      }
      .report-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .report-title {
        font-size: 2rem;
        font-weight: 700;
        color: #2563eb;
      }
      .edash-root.dark-mode .report-title {
        color: #7eaaff;
      }
      .report-filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }
      .filter-select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: #fff;
        color: #333;
        transition: background 0.3s, color 0.3s, border 0.3s;
      }
      .edash-root.dark-mode .filter-select {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .kpi-card {
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .kpi-card {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e0e0e0;
        border: 1px solid #475569;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .kpi-icon {
        font-size: 2rem;
      }
      .kpi-value {
        font-size: 2rem;
        font-weight: 700;
        color: #2563eb;
        margin-bottom: 0.5rem;
      }
      .edash-root.dark-mode .kpi-value {
        color: #7eaaff;
      }
      .kpi-label {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.5rem;
      }
      .edash-root.dark-mode .kpi-label {
        color: #b0b0b0;
      }
      .kpi-trend {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-weight: 600;
      }
      .kpi-trend.positive {
        background: #e6fce6;
        color: #22c55e;
      }
      .kpi-trend.negative {
        background: #ffe6e6;
        color: #ef4444;
      }
      .edash-root.dark-mode .kpi-trend.positive {
        background: #223c2c;
        color: #22c55e;
      }
      .edash-root.dark-mode .kpi-trend.negative {
        background: #3a1a1a;
        color: #ef4444;
      }
      .chart-section {
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .chart-section {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #e0e0e0;
        border: 1px solid #334155;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }
      .chart-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #2563eb;
      }
      .edash-root.dark-mode .chart-title {
        color: #7eaaff;
      }
      .chart-container {
        height: 300px;
        background: #f8f9fa;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        transition: background 0.3s;
      }
      .edash-root.dark-mode .chart-container {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border: 1px solid #475569;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .location-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .location-card {
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .location-card {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e0e0e0;
        border: 1px solid #475569;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .location-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .location-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: #2563eb;
      }
      .edash-root.dark-mode .location-name {
        color: #7eaaff;
      }
      .location-score {
        font-size: 1.5rem;
        font-weight: 700;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        color: #fff;
      }
      .score-excellent { background: #22c55e; }
      .score-good { background: #facc15; }
      .score-poor { background: #ef4444; }
      .report-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }
      .report-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .report-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .report-btn.primary:hover {
        background: #1746a2;
      }
      .report-btn.secondary {
        background: #f3f4f6;
        color: #333;
      }
      .report-btn.secondary:hover {
        background: #e5e7eb;
      }
      .edash-root.dark-mode .report-btn.secondary {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e0e0e0;
      }
      .edash-root.dark-mode .report-btn.secondary:hover {
        background: linear-gradient(135deg, #334155 0%, #475569 100%);
      }
      .compliance-list {
        list-style: none;
        padding: 0;
      }
      .compliance-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .compliance-item {
        border-bottom: 1px solid #333;
      }
      .compliance-item:hover {
        background: #f8f9fa;
      }
      .edash-root.dark-mode .compliance-item:hover {
        background: #1a1a2e;
      }
      .compliance-status {
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .status-compliant { background: #e6fce6; color: #22c55e; }
      .status-pending { background: #fffbe6; color: #facc15; }
      .status-overdue { background: #ffe6e6; color: #ef4444; }
      .edash-root.dark-mode .status-compliant { background: #223c2c; color: #22c55e; }
      .edash-root.dark-mode .status-pending { background: #23284a; color: #facc15; }
      .edash-root.dark-mode .status-overdue { background: #3a1a1a; color: #ef4444; }
      .ai-insight {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
      }
      .ai-insight h3 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
      .ai-suggestion {
        background: rgba(255,255,255,0.1);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 0.5rem;
      }
      .data-source-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .source-card {
        background: #fff;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .source-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .source-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      .source-status {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        margin-left: 0.5rem;
      }
      .status-online { background: #22c55e; }
      .status-offline { background: #ef4444; }
      .status-warning { background: #facc15; }
      .custom-report-card {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        padding: 2rem 2.5rem 2rem 2.5rem;
        margin-bottom: 2.5rem;
        max-width: 100%;
        position: relative;
        transition: background 0.3s, color 0.3s;
      }
      .edash-root.dark-mode .custom-report-card {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #e0e0e0;
        border: 1px solid #334155;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }
      .custom-report-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .custom-report-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2563eb;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .edash-root.dark-mode .custom-report-title {
        color: #7eaaff;
      }
      .custom-report-tab {
        background: #f3f4f6;
        color: #2563eb;
        border-radius: 8px;
        padding: 0.25rem 0.9rem;
        font-size: 0.95rem;
        font-weight: 600;
        margin-left: 1rem;
      }
      .edash-root.dark-mode .custom-report-tab {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #7eaaff;
      }
      .custom-report-form {
        display: flex;
        gap: 1.2rem;
        flex-wrap: wrap;
        margin-bottom: 1.2rem;
      }
      .custom-report-form input[type="date"],
      .custom-report-form select {
        padding: 0.6rem 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        background: #fff;
        color: #23284a;
        min-width: 180px;
        transition: background 0.3s, color 0.3s, border 0.3s;
      }
      .edash-root.dark-mode .custom-report-form input[type="date"],
      .edash-root.dark-mode .custom-report-form select {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e0e0e0;
        border: 1px solid #475569;
      }
      .custom-report-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.2rem;
      }
      .custom-btn {
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        padding: 0.7rem 1.7rem;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .custom-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .custom-btn.primary:hover {
        background: #1746a2;
      }
      .custom-btn.secondary {
        background: #f3f4f6;
        color: #23284a;
      }
      .custom-btn.secondary:hover {
        background: #e5e7eb;
      }
      .custom-btn.success {
        background: #22c55e;
        color: #fff;
      }
      .custom-btn.success:hover {
        background: #15803d;
      }
      .edash-root.dark-mode .custom-btn.secondary {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e0e0e0;
      }
      .edash-root.dark-mode .custom-btn.secondary:hover {
        background: linear-gradient(135deg, #334155 0%, #475569 100%);
      }
      .custom-narrative {
        background: #f8f6ff;
        color: #7c3aed;
        border-radius: 10px;
        padding: 1.2rem 1rem;
        margin-top: 1.2rem;
        font-size: 1.05rem;
        font-weight: 500;
      }
      .edash-root.dark-mode .custom-narrative {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #a78bfa;
        border: 1px solid #475569;
      }
      /* Modal styles */
      .modal-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.25);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .custom-modal {
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        padding: 2rem 2.5rem;
        min-width: 340px;
        max-width: 95vw;
        z-index: 2100;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }
      .edash-root.dark-mode .custom-modal {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #e0e0e0;
        border: 1px solid #334155;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }
      .custom-modal-title {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .custom-modal select {
        padding: 0.6rem 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        background: #fff;
        color: #23284a;
        min-width: 220px;
        transition: background 0.3s, color 0.3s, border 0.3s;
      }
      .edash-root.dark-mode .custom-modal select {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: #e0e0e0;
        border: 1px solid #475569;
      }
      .custom-modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: flex-end;
      }
    </style>
    <div class="edash-root" [class.dark-mode]="darkMode" [class.rtl]="isRTL">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
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
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="report-header">
          <h1 class="report-title">{{ getTranslatedText('REPORTING.TITLE') }}</h1>
        </div>

        <!-- Custom Report Builder Section - MOVED TO TOP -->
        <div class="custom-report-card">
          <div class="custom-report-header">
            <span class="custom-report-title"><span style="font-size:1.3rem;">⚙️</span> Custom Report Builder</span>
            <span class="custom-report-tab">AI-Generated Reports</span>
          </div>
          <form class="custom-report-form" autocomplete="off" (submit)="$event.preventDefault()">
            <input type="date" [(ngModel)]="customStartDate" name="startDate" placeholder="mm/dd/yyyy" />
            <input type="date" [(ngModel)]="customEndDate" name="endDate" placeholder="mm/dd/yyyy" />
            <select [(ngModel)]="customInitiative" name="initiative">
              <option value="all">All Initiatives</option>
              <option value="carbon">Carbon Reduction</option>
              <option value="energy">Energy Efficiency</option>
              <option value="water">Water Conservation</option>
              <option value="waste">Waste Management</option>
            </select>
            <select [(ngModel)]="customStatus" name="status">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <select [(ngModel)]="customChannel" name="channel">
              <option value="all">All Channels</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </form>
          <div class="custom-report-actions">
            <button class="custom-btn primary" (click)="openFormatModal()">Generate</button>
            <button class="custom-btn secondary" disabled>Export</button>
            <button class="custom-btn success" type="button">Schedule</button>
          </div>
          <div class="custom-narrative">
            <b>AI-Generated Narrative Report</b><br>
            This week, your LinkedIn campaign brought in 20% more leads at 10% lower cost. Facebook campaign ROI dropped by 5% due to higher CPC.
          </div>
        </div>

        <!-- Filters -->
        <div class="report-filters">
          <select class="filter-select" [(ngModel)]="selectedPeriod">
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select class="filter-select" [(ngModel)]="selectedLocation">
            <option value="all">All Locations</option>
            <option value="hq">Headquarters</option>
            <option value="plant1">Plant 1</option>
            <option value="plant2">Plant 2</option>
          </select>
          <select class="filter-select" [(ngModel)]="selectedDepartment">
            <option value="all">All Departments</option>
            <option value="operations">Operations</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="office">Office</option>
          </select>
        </div>

        <!-- 1. Summary Overview (KPIs) -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-icon">🌍</span>
              <span class="kpi-trend" [ngClass]="{'positive': carbonTrend > 0, 'negative': carbonTrend < 0}">
                {{ carbonTrend > 0 ? '+' : '' }}{{ carbonTrend }}%
              </span>
            </div>
            <div class="kpi-value">{{ carbonFootprint }}</div>
            <div class="kpi-label">Carbon Footprint (tCO₂e)</div>
            <div class="kpi-label">Per Unit: {{ carbonPerUnit }} tCO₂e</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-icon">⚡</span>
              <span class="kpi-trend" [ngClass]="{'positive': energyTrend > 0, 'negative': energyTrend < 0}">
                {{ energyTrend > 0 ? '+' : '' }}{{ energyTrend }}%
              </span>
            </div>
            <div class="kpi-value">{{ energyConsumption }}</div>
            <div class="kpi-label">Energy Consumption (kWh)</div>
            <div class="kpi-label">Renewable: {{ renewableEnergy }}%</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-icon">💧</span>
              <span class="kpi-trend" [ngClass]="{'positive': waterTrend > 0, 'negative': waterTrend < 0}">
                {{ waterTrend > 0 ? '+' : '' }}{{ waterTrend }}%
              </span>
            </div>
            <div class="kpi-value">{{ waterUsage }}</div>
            <div class="kpi-label">Water Usage (m³)</div>
            <div class="kpi-label">Efficiency: {{ waterEfficiency }}%</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-icon">🗑️</span>
              <span class="kpi-trend" [ngClass]="{'positive': wasteTrend < 0, 'negative': wasteTrend > 0}">
                {{ wasteTrend > 0 ? '+' : '' }}{{ wasteTrend }}%
              </span>
            </div>
            <div class="kpi-value">{{ wasteGenerated }}</div>
            <div class="kpi-label">Waste Generated (tons)</div>
            <div class="kpi-label">Recycled: {{ wasteRecycled }}%</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-icon">📊</span>
              <span class="kpi-trend" [ngClass]="{'positive': esgTrend > 0, 'negative': esgTrend < 0}">
                {{ esgTrend > 0 ? '+' : '' }}{{ esgTrend }}%
              </span>
            </div>
            <div class="kpi-value">{{ esgScore }}</div>
            <div class="kpi-label">ESG Rating</div>
            <div class="kpi-label">Grade: {{ esgGrade }}</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-icon">✅</span>
              <span class="kpi-trend" [ngClass]="{'positive': complianceTrend > 0, 'negative': complianceTrend < 0}">
                {{ complianceTrend > 0 ? '+' : '' }}{{ complianceTrend }}%
              </span>
            </div>
            <div class="kpi-value">{{ complianceStatus }}%</div>
            <div class="kpi-label">Compliance Status</div>
            <div class="kpi-label">GRI, CDP, SASB</div>
          </div>
        </div>

        <!-- 2. Interactive Charts & Trends -->
        <div class="chart-section">
          <h3 class="chart-title">📊 ESG Metrics Trends (Year-over-Year)</h3>
          <div class="chart-container">
            <div style="text-align: center; color: #666;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
              <div>Interactive Chart: Carbon Emissions, Energy & Water Usage Trends</div>
              <div style="font-size: 0.9rem; margin-top: 1rem;">Hover for details • Click to drill down</div>
            </div>
          </div>
        </div>

        <!-- 3. Location-wise Breakdown -->
        <div class="location-grid">
          <div class="location-card" *ngFor="let location of locations">
            <div class="location-header">
              <span class="location-name">{{ location.name }}</span>
              <span class="location-score" [ngClass]="{
                'score-excellent': location.score >= 80,
                'score-good': location.score >= 60 && location.score < 80,
                'score-poor': location.score < 60
              }">{{ location.score }}</span>
            </div>
            <div style="margin-bottom: 1rem;">
              <div>Carbon: {{ location.carbon }} tCO₂e</div>
              <div>Energy: {{ location.energy }} kWh</div>
              <div>Water: {{ location.water }} m³</div>
            </div>
            <div style="font-size: 0.9rem; color: #666;">
              {{ location.department }} • {{ location.region }}
            </div>
          </div>
        </div>

        <!-- 4. Report Generation & Downloads -->
        <div class="report-actions">
          <button class="report-btn primary" (click)="generateReport()">📄 Generate Report</button>
          <button class="report-btn secondary" (click)="customReport()">🔧 Custom Report Builder</button>
          <button class="report-btn secondary" (click)="exportData()">📊 Export Data</button>
          <button class="report-btn secondary" (click)="shareReport()">📤 Share Report</button>
        </div>

        <!-- 5. Compliance & Audit Trail -->
        <div class="chart-section">
          <h3 class="chart-title">📅 Compliance & Audit Trail</h3>
          <ul class="compliance-list">
            <li class="compliance-item" *ngFor="let item of complianceItems">
              <div>
                <div style="font-weight: 600;">{{ item.report }}</div>
                <div style="font-size: 0.9rem; color: #666;">Generated by {{ item.user }} on {{ item.date }}</div>
              </div>
              <span class="compliance-status" [ngClass]="{
                'status-compliant': item.status === 'Compliant',
                'status-pending': item.status === 'Pending',
                'status-overdue': item.status === 'Overdue'
              }">{{ item.status }}</span>
            </li>
          </ul>
        </div>

        <!-- 6. Benchmarking & Scoring -->
        <div class="chart-section">
          <h3 class="chart-title">🏆 Benchmarking & Industry Comparison</h3>
          <div class="chart-container">
            <div style="text-align: center; color: #666;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
              <div>Industry Benchmarking Dashboard</div>
              <div style="font-size: 0.9rem; margin-top: 1rem;">vs Industry Average • vs Internal Goals • vs Peers</div>
            </div>
          </div>
        </div>

        <!-- 7. Predictive & AI Insights -->
        <div class="ai-insight">
          <h3>🧠 AI-Powered Insights</h3>
          <div class="ai-suggestion">
            <strong>📈 Forecast:</strong> Carbon footprint expected to decrease by 8% next quarter based on current trends.
          </div>
          <div class="ai-suggestion">
            <strong>💡 Recommendation:</strong> Increase renewable energy usage by 15% to meet 2030 sustainability goals.
          </div>
          <div class="ai-suggestion">
            <strong>⚠️ Risk Alert:</strong> Water consumption trending upward - potential compliance risk in Q3.
          </div>
        </div>

        <!-- 8. Data Sources & Integrations -->
        <div class="chart-section">
          <h3 class="chart-title">🔗 Data Sources & Integrations</h3>
          <div class="data-source-grid">
            <div class="source-card" *ngFor="let source of dataSources">
              <div class="source-icon">{{ source.icon }}</div>
              <div style="font-weight: 600;">{{ source.name }}</div>
              <div style="font-size: 0.9rem; color: #666;">{{ source.type }}</div>
              <span class="source-status" [ngClass]="{
                'status-online': source.status === 'Online',
                'status-offline': source.status === 'Offline',
                'status-warning': source.status === 'Warning'
              }"></span>
            </div>
          </div>
        </div>

        <!-- 9. Sustainability Initiative Tracker -->
        <div class="chart-section">
          <h3 class="chart-title">🌱 Sustainability Initiative Tracker</h3>
          <div class="chart-container">
            <div style="text-align: center; color: #666;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🌳</div>
              <div>Initiative Impact Analysis</div>
              <div style="font-size: 0.9rem; margin-top: 1rem;">Tree Planting • Solar Energy • Waste Reduction</div>
            </div>
          </div>
        </div>

        <!-- 10. Filters & Drill-down Options -->
        <div class="chart-section">
          <h3 class="chart-title">🔍 Advanced Filters & Drill-down</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <strong>Date Range:</strong>
              <div>Last 30 days • Last quarter • Custom range</div>
            </div>
            <div>
              <strong>Business Unit:</strong>
              <div>Operations • Manufacturing • Office • All</div>
            </div>
            <div>
              <strong>ESG Dimension:</strong>
              <div>Environmental • Social • Governance • All</div>
            </div>
            <div>
              <strong>Drill-down:</strong>
              <div>Summary → Department → Individual → Raw Data</div>
            </div>
          </div>
        </div>


        <!-- Modal for format selection -->
        <div *ngIf="showFormatModal" class="modal-backdrop">
          <div class="custom-modal">
            <div class="custom-modal-title">Select Report Format</div>
            <select [(ngModel)]="selectedFormat">
              <option *ngFor="let f of reportFormats" [value]="f.value">{{ f.label }}</option>
            </select>
            <div class="custom-modal-actions">
              <button class="custom-btn primary" (click)="generatePDF()">Generate</button>
              <button class="custom-btn secondary" (click)="closeFormatModal()">Cancel</button>
            </div>
          </div>
      </div>
    </main>
    </div>
  `,
})

export class ReportingComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  isRTL = false;
  private translationSubscription?: Subscription;
  
  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: ReportingTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Reporting language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Reporting translations not loaded yet');
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
  
  logout() { 
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }
  
  toggleDarkMode() { 
    this.themeService.toggleDarkMode(); 
  }

  // Filters
  selectedPeriod = 'month';
  selectedLocation = 'all';
  selectedDepartment = 'all';

  // KPIs Data
  carbonFootprint = '1,247';
  carbonPerUnit = '0.85';
  carbonTrend = -12;
  energyConsumption = '2.4M';
  renewableEnergy = 35;
  energyTrend = -8;
  waterUsage = '45,230';
  waterEfficiency = 92;
  waterTrend = -5;
  wasteGenerated = '1,890';
  wasteRecycled = 78;
  wasteTrend = -15;
  esgScore = 'A+';
  esgGrade = 'Excellent';
  esgTrend = 5;
  complianceStatus = 94;
  complianceTrend = 2;

  // Location Data
  locations = [
    { name: 'Headquarters', score: 85, carbon: 245, energy: '450K', water: '8,500', department: 'Office', region: 'North' },
    { name: 'Plant 1', score: 72, carbon: 456, energy: '890K', water: '15,200', department: 'Manufacturing', region: 'South' },
    { name: 'Plant 2', score: 91, carbon: 198, energy: '320K', water: '6,800', department: 'Operations', region: 'East' },
    { name: 'Distribution Center', score: 68, carbon: 348, energy: '740K', water: '14,500', department: 'Logistics', region: 'West' }
  ];

  // Compliance Items
  complianceItems = [
    { report: 'Q1 2024 ESG Report', user: 'Alice Johnson', date: '2024-04-15', status: 'Compliant' },
    { report: 'CDP Climate Disclosure', user: 'Bob Smith', date: '2024-04-10', status: 'Pending' },
    { report: 'GRI Sustainability Report', user: 'Charlie Brown', date: '2024-03-28', status: 'Compliant' },
    { report: 'SASB Metrics Report', user: 'Diana Prince', date: '2024-03-15', status: 'Overdue' }
  ];

  // Data Sources
  dataSources = [
    { name: 'IoT Sensors', type: 'Real-time', status: 'Online', icon: '📡' },
    { name: 'Utility Bills', type: 'Monthly', status: 'Online', icon: '⚡' },
    { name: 'HR System', type: 'Daily', status: 'Warning', icon: '👥' },
    { name: 'ERP System', type: 'Real-time', status: 'Online', icon: '💼' },
    { name: 'Weather API', type: 'Hourly', status: 'Online', icon: '🌤️' },
    { name: 'Waste Management', type: 'Weekly', status: 'Offline', icon: '🗑️' }
  ];

  // Custom Report Builder state
  customStartDate = '';
  customEndDate = '';
  customInitiative = 'all';
  customStatus = 'all';
  customChannel = 'all';

  showFormatModal = false;
  selectedFormat = 'sabic';
  reportFormats = [
    { value: 'sabic', label: 'SABIC (Saudi Basic Industries Corporation)' },
    { value: 'tadawul', label: 'Tadawul' },
    { value: 'gri', label: 'GRI (Global Reporting Initiative)' },
    { value: 'sasb', label: 'SASB (Sustainability Accounting Standards Board)' },
    { value: 'cdp', label: 'CDP (Carbon Disclosure Project)' },
    { value: 'csrd', label: 'CSRD (Corporate Sustainability Reporting Directive – EU)' }
  ];

  openFormatModal() { this.showFormatModal = true; }
  closeFormatModal() { this.showFormatModal = false; }

  generatePDF() {
    // Special handling for SABIC - use existing PDF from assets
    if (this.selectedFormat === 'sabic') {
      this.downloadSABICReport();
      this.closeFormatModal();
      return;
    }

    const frameworkDetails: any = {
      sabic: {
        framework: 'SABIC',
        type: 'SABIC ESG & Sustainability Report',
        focus: 'Saudi Basic Industries Corporation Standards',
        logo: '🏭',
        color: [0, 100, 0] // Green color for SABIC
      },
      tadawul: {
        framework: 'Tadawul',
        type: 'ESG Compliance & Sustainability Report',
        focus: 'Saudi Market ESG Transparency',
        logo: '📊',
        color: [44, 99, 235]
      },
      gri: {
        framework: 'GRI',
        type: 'GRI Sustainability Report',
        focus: 'Broad ESG (Global)',
        logo: '🌍',
        color: [34, 197, 94]
      },
      sasb: {
        framework: 'SASB',
        type: 'Industry-specific ESG Disclosure',
        focus: 'Financially Material ESG Data',
        logo: '💼',
        color: [168, 85, 247]
      },
      cdp: {
        framework: 'CDP',
        type: 'Climate, Water, Forest Impact Report',
        focus: 'Environmental Impact Disclosure',
        logo: '🌱',
        color: [59, 130, 246]
      },
      csrd: {
        framework: 'CSRD (EU)',
        type: 'EU-Compliant Sustainability Report',
        focus: 'Regulatory ESG (Europe)',
        logo: '🇪🇺',
        color: [239, 68, 68]
      }
    };
    
    const f = frameworkDetails[this.selectedFormat];
    const doc = new jsPDF();

    if (this.selectedFormat === 'sabic') {
      // SABIC Special Report - Page 1
      doc.setFillColor(f.color[0], f.color[1], f.color[2]);
      doc.rect(0, 0, 210, 40, 'F');
      
      // SABIC Logo and Header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text(f.logo + ' SABIC', 105, 25, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('ESG & Sustainability Report', 105, 35, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Company Information
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Saudi Basic Industries Corporation', 14, 55);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Leading Global Diversified Chemicals Company', 14, 63);
      doc.text('Headquarters: Riyadh, Saudi Arabia', 14, 71);
      doc.text('Founded: 1976 | Listed: Saudi Stock Exchange (Tadawul)', 14, 79);
      
      // Report Details
      doc.setFont('helvetica', 'bold');
      doc.text('Report Period:', 14, 95);
      doc.setFont('helvetica', 'normal');
      doc.text((this.customStartDate || 'N/A') + ' to ' + (this.customEndDate || 'N/A'), 50, 95);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Generated:', 14, 103);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date().toLocaleDateString(), 50, 103);
      
      // SABIC ESG Performance Summary
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('ESG Performance Summary', 14, 120);
      
      // Performance Metrics
      const sabicMetrics = [
        ['Environmental Score', 'A+', '92/100'],
        ['Social Responsibility', 'A', '88/100'],
        ['Governance Excellence', 'A+', '95/100'],
        ['Overall ESG Rating', 'A+', '91.7/100'],
        ['Carbon Intensity', '0.85 tCO₂e/ton', 'Industry Leader'],
        ['Energy Efficiency', '15% improvement', 'vs 2020 baseline'],
        ['Water Management', 'Exemplary', 'Zero discharge'],
        ['Waste Recycling', '94%', 'Circular economy leader']
      ];
      
      let y = 130;
      doc.setFontSize(10);
      sabicMetrics.forEach(([metric, value, detail]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(metric, 16, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, y);
        doc.text(detail, 120, y);
        y += 6;
      });
      
      // SABIC Sustainability Goals
      y += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SABIC 2030 Sustainability Goals', 14, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const goals = [
        '🌱 Carbon Neutrality: Achieve net-zero emissions by 2050',
        '⚡ Renewable Energy: 50% renewable energy by 2030',
        '💧 Water Stewardship: 100% water recycling by 2030',
        '♻️ Circular Economy: 100% recyclable products by 2030',
        '👥 Social Impact: 1 million lives improved through initiatives',
        '🏛️ Governance: Maintain highest governance standards'
      ];
      
      goals.forEach((goal, i) => {
        doc.text(goal, 18, y + i * 6);
      });
      
      // Footer for Page 1
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text('SABIC ESG Report - Page 1 of 2', 105, 290, { align: 'center' });
      
      // Page 2
      doc.addPage();
      
      // Page 2 Header
      doc.setFillColor(f.color[0], f.color[1], f.color[2]);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('SABIC ESG & Sustainability Report - Detailed Analysis', 105, 15, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      
      // Environmental Performance
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Environmental Performance', 14, 40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const envMetrics = [
        'Carbon Emissions: 1,247 tCO₂e (12% reduction vs 2023)',
        'Energy Consumption: 2.4M kWh (8% efficiency improvement)',
        'Renewable Energy: 35% of total energy mix',
        'Water Usage: 45,230 m³ (5% reduction through efficiency)',
        'Waste Management: 1,890 tons (78% recycled)',
        'Biodiversity: 15 conservation projects implemented'
      ];
      
      let envY = 50;
      envMetrics.forEach((metric, i) => {
        doc.text('• ' + metric, 18, envY + i * 6);
      });
      
      // Social Performance
      envY += envMetrics.length * 6 + 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Social Performance', 14, envY);
      envY += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const socialMetrics = [
        'Employee Safety: Zero lost-time incidents in 2024',
        'Diversity & Inclusion: 45% female workforce representation',
        'Community Investment: $15M in local community projects',
        'Training & Development: 120 hours average per employee',
        'Supplier Standards: 100% suppliers meet ESG criteria',
        'Stakeholder Engagement: 95% satisfaction rate'
      ];
      
      socialMetrics.forEach((metric, i) => {
        doc.text('• ' + metric, 18, envY + i * 6);
      });
      
      // Governance Performance
      let govY = envY + socialMetrics.length * 6 + 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Governance Performance', 14, govY);
      govY += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const govMetrics = [
        'Board Independence: 75% independent directors',
        'ESG Oversight: Dedicated ESG committee',
        'Risk Management: Comprehensive ESG risk framework',
        'Transparency: 100% disclosure compliance',
        'Ethics & Compliance: Zero violations reported',
        'Innovation: $500M R&D investment in green technologies'
      ];
      
      govMetrics.forEach((metric, i) => {
        doc.text('• ' + metric, 18, govY + i * 6);
      });
      
      // Recommendations
      let recY = govY + govMetrics.length * 6 + 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Strategic Recommendations', 14, recY);
      recY += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const recommendations = [
        'Accelerate renewable energy adoption to meet 2030 targets',
        'Expand circular economy initiatives across all product lines',
        'Enhance biodiversity conservation programs',
        'Strengthen stakeholder engagement in emerging markets',
        'Invest in advanced carbon capture technologies',
        'Develop next-generation sustainable materials'
      ];
      
      recommendations.forEach((rec, i) => {
        doc.text((i + 1) + '. ' + rec, 18, recY + i * 6);
      });
      
      // Footer for Page 2
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text('SABIC ESG Report - Page 2 of 2 | Confidential - For authorized use only', 105, 290, { align: 'center' });
      
    } else {
      // Standard Report Format for other frameworks
      // Cover Page
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('ESG & Sustainability Report', 105, 30, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Framework: ' + f.framework, 105, 45, { align: 'center' });
      doc.text('Type: ' + f.type, 105, 53, { align: 'center' });
      doc.text('Focus: ' + f.focus, 105, 61, { align: 'center' });
      doc.text('Date Range: ' + (this.customStartDate || 'N/A') + ' to ' + (this.customEndDate || 'N/A'), 105, 69, { align: 'center' });
      doc.setDrawColor(f.color[0], f.color[1], f.color[2]);
      doc.setLineWidth(1.2);
      doc.line(40, 75, 170, 75);
      doc.setFontSize(12);
      doc.text('Prepared for: Your Organization Name', 105, 85, { align: 'center' });
      doc.text('Generated: ' + new Date().toLocaleDateString(), 105, 93, { align: 'center' });
      doc.addPage();

      // Executive Summary
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 14, 20);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('This report provides a comprehensive overview of ESG (Environmental, Social, Governance) performance and compliance for the selected period and framework.', 14, 28, { maxWidth: 180 });
      doc.text('It includes key metrics, compliance status, and recommendations for improvement.', 14, 36, { maxWidth: 180 });

      // Key Metrics Table
      doc.setFont('helvetica', 'bold');
      doc.text('Key Metrics', 14, 48);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const metrics = [
        ['Carbon Footprint (tCO₂e)', '1,247'],
        ['Energy Consumption (kWh)', '2,400,000'],
        ['Water Usage (m³)', '45,230'],
        ['Waste Generated (tons)', '1,890'],
        ['ESG Rating', 'A+'],
        ['Compliance Status (%)', '94'],
      ];
      let y = 54;
      metrics.forEach(([label, value]) => {
        doc.text(label, 16, y);
        doc.text(value, 100, y);
        y += 7;
      });

      // Compliance/Standards Section
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Compliance & Standards', 14, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const standards = [
        '• GRI (Global Reporting Initiative)',
        '• SASB (Sustainability Accounting Standards Board)',
        '• CDP (Carbon Disclosure Project)',
        '• CSRD (Corporate Sustainability Reporting Directive – EU)',
        '• TCFD (Climate-related Financial Disclosure)',
        '• Tadawul (Saudi Market ESG Transparency)',
      ];
      standards.forEach((s, i) => {
        doc.text(s, 18, y + i * 6);
      });
      y += standards.length * 6 + 8;

      // Recommendations
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Recommendations', 14, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('• Increase renewable energy usage by 15% to meet 2030 sustainability goals.', 18, y);
      y += 6;
      doc.text('• Monitor water consumption to avoid compliance risk in Q3.', 18, y);
      y += 6;
      doc.text('• Continue improving waste recycling rates.', 18, y);

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text('Confidential - For internal use only', 14, 290);
        doc.text('Page ' + i + ' of ' + pageCount, 180, 290, { align: 'right' });
      }
    }

    doc.save('ESG_Report_' + f.framework + '.pdf');
    this.closeFormatModal();
  }

  // SABIC Report Download Method
  downloadSABICReport() {
    // Create a link element to download the existing SABIC PDF
    const link = document.createElement('a');
    link.href = 'assets/SABIC-Integrated-Annual-Report-2024-EN-Updated_tcm1010-46870.pdf';
    link.download = 'SABIC_ESG_Sustainability_Report_2024.pdf';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    alert('SABIC ESG & Sustainability Report downloaded successfully!');
  }



  // Report Generation Methods
  generateReport() {
    alert('Generating comprehensive ESG report...');
  }

  customReport() {
    alert('Opening custom report builder...');
  }

  exportData() {
    alert('Exporting data to Excel/CSV...');
  }

  shareReport() {
    alert('Sharing report with stakeholders...');
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }


} 