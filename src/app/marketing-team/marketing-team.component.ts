import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { GlobalTranslationService } from '../services/global-translation.service';
import { ThemeService } from '../services/theme.service';
import { GlobalLanguageToggleComponent } from '../components/global-language-toggle/global-language-toggle.component';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'on leave' | 'overdue';
  campaignsManaged: number;
  contentPublished: number;
  engagementScore: number;
  avatar: string;
}

interface Task {
  id: number;
  title: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  deadline: string;
}

interface TrainingRecord {
  memberName: string;
  training: string;
  status: 'certified' | 'in-progress' | 'not-attended';
}

interface Issue {
  id: number;
  memberName: string;
  description: string;
  status: 'pending' | 'resolved';
}

interface Goal {
  memberName: string;
  goal: string;
  target: string;
}

@Component({
  selector: 'marketing-team',
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

      .edash-root.dark-mode {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: #e0e0e0;
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
        background: #181828;
        color: #e0e0e0;
      }
      .edash-root.dark-mode .edash-main {
        background: #181828;
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
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
      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
      }

      .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }

      .btn:hover::before {
        left: 100%;
      }
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      .btn-primary:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }
      .btn-secondary {
        background: rgba(255, 255, 255, 0.9);
        color: #374151;
        border: 2px solid #e5e7eb;
        backdrop-filter: blur(10px);
      }
      .btn-secondary:hover {
        background: rgba(255, 255, 255, 1);
        border-color: #d1d5db;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        margin-right: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }
      .action-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      .action-btn:hover::before {
        left: 100%;
      }
      .action-btn.edit {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
      }
      .action-btn.edit:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
      .action-btn.delete {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
      }
      .action-btn.delete:hover {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .dashboard-section {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        overflow: hidden;
        word-wrap: break-word;
      }

      .dashboard-section:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.15);
      }
      .edash-root.dark-mode .dashboard-section {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
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
      .ai-tag {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 500;
        margin-left: 1rem;
      }
      .ai-suggestion {
        background: #dbeafe;
        color: #1e40af;
      }
      .ai-smart-assignment {
        background: #dcfce7;
        color: #166534;
      }
      .ai-leaderboard {
        background: #fce7f3;
        color: #be185d;
      }
      .ai-recommendations {
        background: #fef3c7;
        color: #92400e;
      }
      .ai-summary {
        background: #dbeafe;
        color: #1e40af;
      }
      .ai-prioritization {
        background: #fee2e2;
        color: #991b1b;
      }
      .ai-forecast {
        background: #dcfce7;
        color: #166534;
      }
      .ai-goal-setting {
        background: #f3e8ff;
        color: #7c3aed;
      }

      .team-member {
        padding: 0.75rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .team-member:last-child {
        border-bottom: none;
      }
      .member-name {
        font-weight: 600;
        color: #1f2937;
      }
      .edash-root.dark-mode .member-name {
        color: #e0e0e0;
      }
      .member-role {
        color: #6b7280;
        font-size: 0.875rem;
      }
      .edash-root.dark-mode .member-role {
        color: #9ca3af;
      }

      .task-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      .task-table th,
      .task-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      .edash-root.dark-mode .task-table th,
      .edash-root.dark-mode .task-table td {
        border-bottom: 1px solid #374151;
      }
      .task-table th {
        background: #f8fafc;
        font-weight: 600;
        color: #1f2937;
      }
      .edash-root.dark-mode .task-table th {
        background: #1a1a2e;
        color: #e0e0e0;
      }
      .task-table tr:hover {
        background: #f8fafc;
      }
      .edash-root.dark-mode .task-table tr:hover {
        background: #1a1a2e;
      }

      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
      }
      .status-pending {
        background: #fef3c7;
        color: #92400e;
      }
      .status-in-progress {
        background: #dbeafe;
        color: #1e40af;
      }
      .status-completed {
        background: #dcfce7;
        color: #166534;
      }
      .status-certified {
        background: #dcfce7;
        color: #166534;
      }
      .status-resolved {
        background: #dcfce7;
        color: #166534;
      }
      .edash-root.dark-mode .status-pending {
        background: #92400e;
        color: #fef3c7;
      }
      .edash-root.dark-mode .status-in-progress {
        background: #1e40af;
        color: #dbeafe;
      }
      .edash-root.dark-mode .status-completed {
        background: #166534;
        color: #dcfce7;
      }
      .edash-root.dark-mode .status-certified {
        background: #166534;
        color: #dcfce7;
      }
      .edash-root.dark-mode .status-resolved {
        background: #166534;
        color: #dcfce7;
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
      .progress-text {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.75rem;
        color: #333;
      }
      .edash-root.dark-mode .progress-text {
        color: #e0e0e0;
      }

      .kpi-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .kpi-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .kpi-item:last-child {
        border-bottom: none;
      }
      .kpi-label {
        font-weight: 600;
        color: #1f2937;
      }
      .edash-root.dark-mode .kpi-label {
        color: #e0e0e0;
      }
      .kpi-value {
        color: #6b7280;
        font-size: 0.875rem;
      }
      .edash-root.dark-mode .kpi-value {
        color: #9ca3af;
      }

      .leaderboard {
        list-style: none;
        padding: 0;
        margin: 1rem 0 0 0;
      }
      .leaderboard-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .leaderboard-item:last-child {
        border-bottom: none;
      }
      .leaderboard-rank {
        font-weight: 600;
        color: #1f2937;
      }
      .edash-root.dark-mode .leaderboard-rank {
        color: #e0e0e0;
      }
      .leaderboard-score {
        color: #6b7280;
        font-size: 0.875rem;
      }
      .edash-root.dark-mode .leaderboard-score {
        color: #9ca3af;
      }

      .ai-suggestion-text {
        color: #1e40af;
        font-size: 0.875rem;
        font-style: italic;
        margin-top: 1rem;
        padding: 0.75rem;
        background: #eff6ff;
        border-radius: 8px;
        border-left: 4px solid #2563eb;
      }
      .edash-root.dark-mode .ai-suggestion-text {
        background: #1e3a8a;
        color: #dbeafe;
        border-left-color: #3b82f6;
      }

      .full-width-section {
        grid-column: 1 / -1;
      }

      @media (max-width: 768px) {
        .edash-root {
          flex-direction: column;
        }
        .edash-sidenav {
          position: static;
          width: 100%;
          height: auto;
        }
        .edash-root > .edash-main {
          margin-left: 0;
          width: 100%;
          padding: 1rem;
        }
        .edash-root > .edash-main.sidebar-collapsed {
          margin-left: 0;
          width: 100%;
        }
        .dashboard-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .dashboard-section {
          padding: 1.5rem;
        }
        .dashboard-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        .header-content h1 {
          font-size: 2rem;
        }
        .header-content p {
          font-size: 1rem;
        }
        .header-actions {
          flex-direction: column;
          gap: 0.5rem;
        }
        .btn {
          width: 100%;
          justify-content: center;
        }
        .section-title {
          font-size: 1.25rem;
        }
        .task-table {
          font-size: 0.9rem;
        }
        .task-table th,
        .task-table td {
          padding: 0.5rem;
        }
      }

      @media (max-width: 480px) {
        .edash-main {
          padding: 0.5rem;
        }
        .dashboard-section {
          padding: 1rem;
        }
        .header-content h1 {
          font-size: 1.5rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }
        .task-table {
          font-size: 0.8rem;
        }
        .task-table th,
        .task-table td {
          padding: 0.25rem;
        }
      }
    </style>
    <div class="edash-root" [class.dark-mode]="darkMode">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.DASHBOARD_TITLE') }}</span>
        </div>
        <nav class="edash-nav">
          <a routerLink="/dashboard" class="edash-nav-link">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.DASHBOARD') }}</span>
          </a>
          <a routerLink="/marketing-team" class="edash-nav-link active">
            <span class="edash-nav-icon">👥</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.TEAM') }}</span>
          </a>
          <a routerLink="/campaigns" class="edash-nav-link">
            <span class="edash-nav-icon">📢</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.CAMPAIGNS') }}</span>
          </a>
          <a routerLink="/content" class="edash-nav-link">
            <span class="edash-nav-icon">📝</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.CONTENT') }}</span>
          </a>
          <a routerLink="/analytics" class="edash-nav-link">
            <span class="edash-nav-icon">📈</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ANALYTICS') }}</span>
          </a>
          <a routerLink="/reports" class="edash-nav-link">
            <span class="edash-nav-icon">📋</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.REPORTS') }}</span>
          </a>
          <a routerLink="/settings" class="edash-nav-link">
            <span class="edash-nav-icon">⚙️</span>
            <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.SETTINGS') }}</span>
          </a>
          
          <div class="edash-nav-actions">
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav">
              <span class="icon">{{ sidebarCollapsed ? '➡️' : '⬅️' }}</span>
              <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode">
              <span class="icon">{{ darkMode ? '☀️' : '🌙' }}</span>
              <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ darkMode ? getTranslatedText('MARKETING_TEAM.LIGHT_MODE') : getTranslatedText('MARKETING_TEAM.DARK_MODE') }}</span>
            </button>
            <button class="edash-logout" (click)="logout()" aria-label="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.LOGOUT') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed">
        <div class="edash-summary-actions">
          <app-global-language-toggle></app-global-language-toggle>
          <button (click)="exportReport()">{{ getTranslatedText('MARKETING_TEAM.EXPORT_REPORT') }}</button>
        </div>
        <div class="edash-summary-row">
          <div class="edash-summary-card">
            <div class="edash-summary-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.TEAM_MEMBERS') }}</div>
            <div class="edash-summary-value">12</div>
            <div class="edash-summary-change">+2</div>
          </div>
          <div class="edash-summary-card">
            <div class="edash-summary-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.TASKS') }}</div>
            <div class="edash-summary-value">45</div>
            <div class="edash-summary-change">+8</div>
          </div>
          <div class="edash-summary-card">
            <div class="edash-summary-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.CAMPAIGNS') }}</div>
            <div class="edash-summary-value">8</div>
            <div class="edash-summary-change">+3</div>
          </div>
          <div class="edash-summary-card">
            <div class="edash-summary-label" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ENGAGEMENT_SCORE') }}</div>
            <div class="edash-summary-value">87%</div>
            <div class="edash-summary-change">+5%</div>
          </div>
        </div>
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-content">
            <h1 [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">👥 {{ getTranslatedText('MARKETING_TEAM.MANAGE_TEAM') }}</h1>
            <p [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.MANAGE_TEAM_SUBTITLE') }}</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="addTeamMember()" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
              ➕ {{ getTranslatedText('MARKETING_TEAM.ADD_TEAM_MEMBER') }}
            </button>
            <button class="btn btn-secondary" (click)="exportReport()" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
              📊 {{ getTranslatedText('MARKETING_TEAM.EXPORT_REPORT') }}
            </button>
          </div>
        </div>

        <!-- Team Members Section -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.TEAM_MEMBERS') }}</h2>
            <button class="add-btn" (click)="addTeamMember()" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ADD_MEMBER') }}</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.MEMBER_NAME') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ROLE') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.STATUS') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.CAMPAIGNS_MANAGED') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.CONTENT_PUBLISHED') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ENGAGEMENT_SCORE') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ACTIONS') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let member of teamMembers">
                  <td>
                    <div class="member-info">
                      <img [src]="member.avatar" [alt]="member.name" class="member-avatar" />
                      <span>{{ member.name }}</span>
                    </div>
                  </td>
                  <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getRoleTranslation(member.role) }}</td>
                  <td>
                    <span class="status-badge" [class]="member.status" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
                      {{ getStatusTranslation(member.status) }}
                    </span>
                  </td>
                  <td>{{ member.campaignsManaged }}</td>
                  <td>{{ member.contentPublished }}</td>
                  <td>{{ member.engagementScore }}%</td>
                  <td>
                    <button class="action-btn edit" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.EDIT') }}</button>
                    <button class="action-btn delete" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.DELETE') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reporting Hierarchy -->
        <div class="dashboard-section">
          <div class="section-title">
            <span class="section-icon">📋</span>
            <span [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.REPORTING_HIERARCHY') }}</span>
          </div>
          <div class="team-member">
            <div class="member-name" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">Abdullah Al-Rashid (Supervisor) → Khalid Al-Sayed, Noura Al-Zahra</div>
          </div>
          <div class="ai-suggestion-text" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
            AI: {{ getTranslatedText('MARKETING_TEAM.MOVING_DIGITAL') }}
          </div>
        </div>

        <!-- Tasks Section -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.TASKS') }}</h2>
            <button class="add-btn" (click)="addTask()" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ADD_TASK') }}</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.TASK_TITLE') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ASSIGNED_TO') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.STATUS') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.PROGRESS') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.DEADLINE') }}</th>
                  <th [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.ACTIONS') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let task of tasks">
                  <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ task.title }}</td>
                  <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ task.assignedTo }}</td>
                  <td>
                    <span class="status-badge" [class]="task.status" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">
                      {{ getStatusTranslation(task.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="task.progress"></div>
                      <span class="progress-text">{{ task.progress }}%</span>
                    </div>
                  </td>
                  <td [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ task.deadline }}</td>
                  <td>
                    <button class="action-btn edit" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.EDIT') }}</button>
                    <button class="action-btn delete" [class.rtl-text]="isRTL" [class.ltr-text]="!isRTL">{{ getTranslatedText('MARKETING_TEAM.DELETE') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Performance Dashboard -->
        <div class="dashboard-section">
          <div class="section-title">
            <span class="section-icon">📊</span>
            Performance Dashboard
            <span class="ai-tag ai-leaderboard">AI Leaderboard</span>
          </div>
          <ul class="kpi-list">
            <li class="kpi-item">
              <div class="kpi-label">Social Media Handled:</div>
              <div class="kpi-value">Abdullah Al-Rashid (120), Noura Al-Zahra (90), Khalid Al-Sayed (80)</div>
            </li>
            <li class="kpi-item">
              <div class="kpi-label">Governance:</div>
              <div class="kpi-value">Abdullah Al-Rashid (30), Noura Al-Zahra (25), Khalid Al-Sayed (20)</div>
            </li>
            <li class="kpi-item">
              <div class="kpi-label">Initiative ROI:</div>
              <div class="kpi-value">Abdullah Al-Rashid (3.2x), Noura Al-Zahra (2.8x), Khalid Al-Sayed (2.5x)</div>
            </li>
          </ul>
          <div class="section-title" style="margin-top: 1.5rem; font-size: 1.25rem;">Leaderboard</div>
          <ul class="leaderboard">
            <li class="leaderboard-item">
              <span class="leaderboard-rank">1. Abdullah Al-Rashid</span>
              <span class="leaderboard-score">Score: 92</span>
            </li>
            <li class="leaderboard-item">
              <span class="leaderboard-rank">2. Noura Al-Zahra</span>
              <span class="leaderboard-score">Score: 88</span>
            </li>
            <li class="leaderboard-item">
              <span class="leaderboard-rank">3. Khalid Al-Sayed</span>
              <span class="leaderboard-score">Score: 85</span>
            </li>
          </ul>
          <div class="ai-suggestion-text">
            AI: Predicts Khalid Al-Sayed at risk of burnout
          </div>
        </div>

        <!-- Communication Center -->
        <div class="dashboard-section">
          <div class="section-title">
            <span class="section-icon">💬</span>
            Communication Center
            <span class="ai-tag ai-summary">AI Summary</span>
          </div>
          <ul class="kpi-list">
            <li class="kpi-item">
              <div class="kpi-label">Announcement:</div>
              <div class="kpi-value">'Q2 Initiative Launch on July 10'</div>
            </li>
            <li class="kpi-item">
              <div class="kpi-label">Reminder:</div>
              <div class="kpi-value">'Submit weekly report by Friday'</div>
            </li>
            <li class="kpi-item">
              <div class="kpi-label">Brief:</div>
              <div class="kpi-value">'SOP for Event Coordination uploaded'</div>
            </li>
          </ul>
          <div class="ai-suggestion-text">
            AI: Top 3 updates for Abdullah Al-Rashid: Campaign Launch, Report Reminder, SOP Upload
          </div>
        </div>

        <!-- Issues Section -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2>{{ getTranslatedText('MARKETING_TEAM.ISSUES') }}</h2>
            <button class="add-btn" (click)="addIssue()">{{ getTranslatedText('MARKETING_TEAM.ADD_ISSUE') }}</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ getTranslatedText('MARKETING_TEAM.MEMBER_NAME') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.ISSUE_DESCRIPTION') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.STATUS') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.ACTIONS') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let issue of issues">
                  <td>{{ issue.memberName }}</td>
                  <td>{{ issue.description }}</td>
                  <td>
                    <span class="status-badge" [class]="issue.status">
                      {{ getTranslatedText('MARKETING_TEAM.' + issue.status.toUpperCase()) }}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn edit">{{ getTranslatedText('MARKETING_TEAM.EDIT') }}</button>
                    <button class="action-btn delete">{{ getTranslatedText('MARKETING_TEAM.DELETE') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Attendance & Availability -->
        <div class="dashboard-section">
          <div class="section-title">
            <span class="section-icon">📅</span>
            Attendance & Availability
            <span class="ai-tag ai-forecast">AI Forecast</span>
          </div>
          <div class="team-member">
            <div class="member-name">Abdullah Al-Rashid: Present</div>
          </div>
          <div class="team-member">
            <div class="member-name">Noura Al-Zahra: On Leave (July 8-10)</div>
          </div>
          <div class="team-member">
            <div class="member-name">Khalid Al-Sayed: Present</div>
          </div>
          <div class="ai-suggestion-text">
            AI: Predicts resource gap on July 8-10
          </div>
        </div>

        <!-- Goals Section -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2>{{ getTranslatedText('MARKETING_TEAM.GOALS') }}</h2>
            <button class="add-btn" (click)="addGoal()">{{ getTranslatedText('MARKETING_TEAM.ADD_GOAL') }}</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ getTranslatedText('MARKETING_TEAM.MEMBER_NAME') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.GOAL') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.TARGET') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.ACTIONS') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let goal of goals">
                  <td>{{ goal.memberName }}</td>
                  <td>{{ goal.goal }}</td>
                  <td>{{ goal.target }}</td>
                  <td>
                    <button class="action-btn edit">{{ getTranslatedText('MARKETING_TEAM.EDIT') }}</button>
                    <button class="action-btn delete">{{ getTranslatedText('MARKETING_TEAM.DELETE') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Training & Development Tracker -->
        <div class="dashboard-section full-width-section">
          <div class="section-title">
            <span class="section-icon">📚</span>
            Training & Development Tracker
            <span class="ai-tag ai-recommendations">AI Recommendations</span>
          </div>
          <div class="team-member">
            <div class="member-name">Abdullah Al-Rashid: Attended "Digital Initiative Bootcamp"</div>
            <span class="status-badge status-certified">Certified</span>
          </div>
          <div class="team-member">
            <div class="member-name">Noura Al-Zahra: Attended "Content Strategy Seminar"</div>
            <span class="status-badge status-pending">In Progress</span>
          </div>
          <div class="team-member">
            <div class="member-name">Khalid Al-Sayed: Not attended recent training</div>
          </div>
          <div class="ai-suggestion-text">
            AI: Recommends "Social Media Analytics" for Khalid Al-Sayed
          </div>
        </div>

        <!-- Training Records Section -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2>{{ getTranslatedText('MARKETING_TEAM.TRAINING_RECORDS') }}</h2>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ getTranslatedText('MARKETING_TEAM.MEMBER_NAME') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.TRAINING') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.STATUS') }}</th>
                  <th>{{ getTranslatedText('MARKETING_TEAM.ACTIONS') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of trainingRecords">
                  <td>{{ record.memberName }}</td>
                  <td>{{ record.training }}</td>
                  <td>
                    <span class="status-badge" [class]="record.status">
                      {{ getTranslatedText('MARKETING_TEAM.' + record.status.toUpperCase().replace('-', '_')) }}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn edit">{{ getTranslatedText('MARKETING_TEAM.EDIT') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `
})
export class MarketingTeamComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  tasks: Task[] = [
    { id: 1, title: 'Create Q4 Campaign Strategy', assignedTo: 'Sarah Johnson', status: 'in-progress', progress: 75, deadline: '2024-12-15' },
    { id: 2, title: 'Design Social Media Content', assignedTo: 'Mike Chen', status: 'pending', progress: 0, deadline: '2024-12-10' },
    { id: 3, title: 'Update Website Copy', assignedTo: 'Emily Davis', status: 'completed', progress: 100, deadline: '2024-12-05' },
    { id: 4, title: 'Prepare Marketing Report', assignedTo: 'Alex Rodriguez', status: 'in-progress', progress: 60, deadline: '2024-12-20' },
    { id: 5, title: 'Review Brand Guidelines', assignedTo: 'Lisa Wang', status: 'pending', progress: 0, deadline: '2024-12-12' }
  ];

  teamMembers: TeamMember[] = [
    { id: 1, name: 'Sarah Johnson', role: 'Marketing Manager', status: 'active', campaignsManaged: 5, contentPublished: 12, engagementScore: 92, avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Mike Chen', role: 'Content Creator', status: 'active', campaignsManaged: 3, contentPublished: 8, engagementScore: 88, avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Emily Davis', role: 'Social Media Specialist', status: 'on leave', campaignsManaged: 2, contentPublished: 15, engagementScore: 95, avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Alex Rodriguez', role: 'Digital Marketing Analyst', status: 'active', campaignsManaged: 4, contentPublished: 6, engagementScore: 87, avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, name: 'Lisa Wang', role: 'Brand Manager', status: 'overdue', campaignsManaged: 1, contentPublished: 3, engagementScore: 78, avatar: 'https://i.pravatar.cc/150?img=5' }
  ];

  trainingRecords: TrainingRecord[] = [
    { memberName: 'Sarah Johnson', training: 'Advanced Analytics', status: 'certified' },
    { memberName: 'Mike Chen', training: 'Content Strategy', status: 'in-progress' },
    { memberName: 'Emily Davis', training: 'Social Media Management', status: 'certified' },
    { memberName: 'Alex Rodriguez', training: 'SEO Fundamentals', status: 'not-attended' },
    { memberName: 'Lisa Wang', training: 'Brand Development', status: 'in-progress' }
  ];

  issues: Issue[] = [
    { id: 1, memberName: 'Mike Chen', description: 'Need access to design software', status: 'pending' },
    { id: 2, memberName: 'Lisa Wang', description: 'Brand guidelines need updating', status: 'resolved' },
    { id: 3, memberName: 'Alex Rodriguez', description: 'Analytics platform access issue', status: 'pending' }
  ];

  goals: Goal[] = [
    { memberName: 'Sarah Johnson', goal: 'Increase campaign ROI by 25%', target: 'Q1 2025' },
    { memberName: 'Mike Chen', goal: 'Publish 20 high-quality content pieces', target: 'Q1 2025' },
    { memberName: 'Emily Davis', goal: 'Grow social media following by 50%', target: 'Q1 2025' },
    { memberName: 'Alex Rodriguez', goal: 'Improve conversion rates by 15%', target: 'Q1 2025' },
    { memberName: 'Lisa Wang', goal: 'Launch new brand campaign', target: 'Q1 2025' }
  ];

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: GlobalTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Marketing Team language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Marketing Team translations not loaded yet');
      }
    }, 1000);
  }
  
  ngOnInit() {
    this.themeSubscription = this.themeService.darkMode$.subscribe(
      (isDark: boolean) => this.darkMode = isDark
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

  addTeamMember() {
    console.log('Add team member functionality');
  }

  addTask() {
    console.log('Add task functionality');
  }

  addIssue() {
    console.log('Add issue functionality');
  }

  addGoal() {
    console.log('Add goal functionality');
  }

  exportReport() {
    console.log('Export report functionality');
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  getRoleTranslation(role: string): string {
    const roleKey = role.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(`MARKETING_TEAM.${roleKey}`);
  }

  getStatusTranslation(status: string): string {
    const statusKey = status.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(`MARKETING_TEAM.${statusKey}`);
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
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