import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { GlobalTranslationService } from '../services/global-translation.service';
import { ThemeService } from '../services/theme.service';
import { GlobalLanguageToggleComponent } from '../components/global-language-toggle/global-language-toggle.component';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  supervisor?: string;
  subordinates?: string[];
  socialMediaHandled: number;
  governance: number;
  initiativeROI: number;
  score: number;
  trainingStatus: string;
  trainingCourse?: string;
  availability: string;
  leaveDates?: string;
  goals: string;
}

interface Task {
  id: string;
  name: string;
  assignedTo: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  progress: number;
  deadline: string;
}

interface Communication {
  type: 'announcement' | 'reminder' | 'brief';
  title: string;
  content: string;
  date: string;
}

interface Issue {
  id: string;
  reporter: string;
  description: string;
  status: 'Pending' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-manage-team',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GlobalLanguageToggleComponent],
  template: `
         <style>
               .manage-team-root {
          min-height: 100vh;
          background: #f8fafc;
          color: #222;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: row;
          overflow-x: hidden;
        }
        
        .manage-team-root.dark-mode {
          background: #181828;
          color: #e0e0e0;
        }

        /* RTL Support */
        .manage-team-root[dir="rtl"] {
          direction: rtl;
        }

        .manage-team-root[dir="rtl"] .edash-sidenav {
          right: 0;
          left: auto;
          border-right: none;
          border-left: 1px solid #ececec;
        }

        .manage-team-root[dir="rtl"] .edash-main {
          margin-right: 260px;
          margin-left: 0;
        }

        .manage-team-root[dir="rtl"] .edash-main.sidebar-collapsed {
          margin-right: 70px;
          margin-left: 0;
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
               .manage-team-root > .edash-main {
          margin-left: 260px;
          transition: margin-left 0.3s ease;
          width: calc(100% - 260px);
        }
        
        .edash-sidenav.collapsed {
          width: 70px;
        }
        
        .edash-sidenav.collapsed .edash-nav-link span:not(.edash-nav-icon),
        .edash-sidenav.collapsed .edash-nav-actions span:not(.icon) {
          display: none;
        }
        
        .edash-sidenav.collapsed .edash-title {
          display: none;
        }
        
        .manage-team-root > .edash-main.sidebar-collapsed {
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
               .edash-main {
          flex: 1;
          padding: 2rem;
          background: #f8fafc;
          transition: background 0.3s, color 0.3s;
          min-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          max-width: 100%;
        }
        
        .manage-team-root.dark-mode .edash-main {
          background: #181828;
          color: #e0e0e0;
        }

             .manage-team-header {
         display: flex;
         justify-content: space-between;
         align-items: flex-start;
         margin-bottom: 2rem;
         padding-bottom: 1rem;
         border-bottom: 2px solid #e5e7eb;
       }
       
       .manage-team-root.dark-mode .manage-team-header {
         border-bottom-color: #333;
       }

      .header-content h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #2563eb;
        margin-bottom: 0.5rem;
      }

      .header-content p {
        font-size: 1.1rem;
        color: #666;
        margin: 0;
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-primary {
        background: #2563eb;
        color: #fff;
      }

      .btn-primary:hover {
        background: #1746a2;
      }

      .btn-secondary {
        background: #fff;
        color: #2563eb;
        border: 2px solid #2563eb;
      }

      .btn-secondary:hover {
        background: #f3f4f6;
      }

      .dashboard-grid {
        display: grid;
        gap: 2rem;
        margin-bottom: 2rem;
      }

             .section-card {
         background: #fff;
         border-radius: 16px;
         padding: 2rem;
         box-shadow: 0 4px 20px rgba(0,0,0,0.06);
         border: 1px solid #e5e7eb;
         margin-bottom: 2rem;
         transition: all 0.3s ease;
         overflow: hidden;
         word-wrap: break-word;
       }
       
       .manage-team-root.dark-mode .section-card {
         background: #23284a;
         color: #e0e0e0;
         border: 1px solid #333;
       }

      .section-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }

      .section-header .section-title {
        flex: 1;
        min-width: 200px;
      }

      .section-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .ai-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .ai-badge.suggestion {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .ai-badge.smart-assignment {
        background: #dcfce7;
        color: #166534;
      }

      .ai-badge.leaderboard {
        background: #fce7f3;
        color: #be185d;
      }

      .ai-badge.recommendations {
        background: #fef3c7;
        color: #d97706;
      }

      .ai-badge.summary {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .ai-badge.prioritization {
        background: #fee2e2;
        color: #dc2626;
      }

      .ai-badge.forecast {
        background: #dcfce7;
        color: #166534;
      }

      .ai-badge.goal-setting {
        background: #e9d5ff;
        color: #7c3aed;
      }

             .team-structure {
         display: grid;
         grid-template-columns: 1fr 1fr;
         gap: 2rem;
         margin-bottom: 1rem;
       }
       
       @media (max-width: 768px) {
         .team-structure {
           grid-template-columns: 1fr;
           gap: 1rem;
         }
       }

      .structure-section h4 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1rem;
      }

      .member-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .member-list li {
        padding: 0.75rem;
        background: #f9fafb;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        border-left: 4px solid #2563eb;
      }

      .member-name {
        font-weight: 600;
        color: #1f2937;
      }

      .member-role {
        font-size: 0.9rem;
        color: #6b7280;
        margin-top: 0.25rem;
      }

      .hierarchy-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .hierarchy-item:last-child {
        border-bottom: none;
      }

      .supervisor {
        font-weight: 600;
        color: #2563eb;
      }

      .subordinates {
        margin-left: 1rem;
        color: #6b7280;
      }

      .ai-suggestion {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .manage-team-root.dark-mode .ai-suggestion {
        background: #1e3a8a;
        border-color: #3b82f6;
        color: #e0e0e0;
      }

      .ai-suggestion strong {
        color: #0369a1;
      }

             .task-table {
         width: 100%;
         border-collapse: collapse;
         margin-top: 1rem;
         background: #fff;
         border-radius: 8px;
         overflow: hidden;
         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
         table-layout: fixed;
       }

       .task-table-container {
         overflow-x: auto;
         border-radius: 8px;
         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
       }
       
       .manage-team-root.dark-mode .task-table {
         background: #1a1a2e;
         color: #e0e0e0;
       }
       
       .manage-team-root.dark-mode .task-table th {
         background: #23284a;
         color: #e0e0e0;
       }
       
       .manage-team-root.dark-mode .task-table td {
         border-bottom-color: #333;
       }

      .task-table th,
      .task-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 200px;
      }

      .task-table th:nth-child(1),
      .task-table td:nth-child(1) {
        width: 25%;
      }

      .task-table th:nth-child(2),
      .task-table td:nth-child(2) {
        width: 15%;
      }

      .task-table th:nth-child(3),
      .task-table td:nth-child(3) {
        width: 12%;
      }

      .task-table th:nth-child(4),
      .task-table td:nth-child(4) {
        width: 15%;
      }

      .task-table th:nth-child(5),
      .task-table td:nth-child(5) {
        width: 15%;
      }

      .task-table th:nth-child(6),
      .task-table td:nth-child(6) {
        width: 18%;
      }

      .task-table th {
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .status-in-progress {
        background: #fef3c7;
        color: #d97706;
      }

      .status-pending {
        background: #fee2e2;
        color: #dc2626;
      }

      .status-completed {
        background: #dcfce7;
        color: #166534;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: #2563eb;
        transition: width 0.3s ease;
      }

             .performance-grid {
         display: grid;
         grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
         gap: 1.5rem;
         margin-bottom: 1.5rem;
       }
       
       .manage-team-root.dark-mode .kpi-card {
         background: #1a1a2e;
         color: #e0e0e0;
       }
       
       .manage-team-root.dark-mode .kpi-title {
         color: #b0b0b0;
       }
       
       .manage-team-root.dark-mode .kpi-value {
         color: #e0e0e0;
       }

      .kpi-card {
        background: #f9fafb;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
      }

      .kpi-title {
        font-size: 0.9rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
      }

      .kpi-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
      }

      .leaderboard {
        background: #f9fafb;
        border-radius: 12px;
        padding: 1.5rem;
      }

      .leaderboard h4 {
        margin-bottom: 1rem;
        color: #374151;
      }

      .leaderboard-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .leaderboard-item:last-child {
        border-bottom: none;
      }

      .rank {
        font-weight: 600;
        color: #2563eb;
        min-width: 30px;
      }

      .member-score {
        font-weight: 600;
        color: #1f2937;
      }

      .training-status {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .training-status li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .training-status li:last-child {
        border-bottom: none;
      }

      .training-info {
        flex: 1;
      }

      .training-course {
        font-weight: 600;
        color: #1f2937;
      }

      .training-member {
        font-size: 0.9rem;
        color: #6b7280;
      }

      .certification-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .certified {
        background: #dcfce7;
        color: #166534;
      }

      .in-progress {
        background: #fef3c7;
        color: #d97706;
      }

             .communication-grid {
         display: grid;
         grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
         gap: 1.5rem;
         margin-bottom: 1rem;
       }
       
       .manage-team-root.dark-mode .communication-card {
         background: #1a1a2e;
         color: #e0e0e0;
       }
       
       .manage-team-root.dark-mode .communication-title {
         color: #e0e0e0;
       }
       
       .manage-team-root.dark-mode .communication-content {
         color: #b0b0b0;
       }

      .communication-card {
        background: #f9fafb;
        border-radius: 12px;
        padding: 1.5rem;
        border-left: 4px solid;
      }

      .communication-card.announcement {
        border-left-color: #2563eb;
      }

      .communication-card.reminder {
        border-left-color: #dc2626;
      }

      .communication-card.brief {
        border-left-color: #059669;
      }

      .communication-type {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        color: #6b7280;
        margin-bottom: 0.5rem;
      }

      .communication-title {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
      }

      .communication-content {
        color: #6b7280;
        font-size: 0.9rem;
      }

      .issue-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .issue-item {
        background: #f9fafb;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        border-left: 4px solid #dc2626;
      }

      .issue-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .issue-reporter {
        font-weight: 600;
        color: #1f2937;
      }

      .issue-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .issue-pending {
        background: #fef3c7;
        color: #d97706;
      }

      .issue-resolved {
        background: #dcfce7;
        color: #166534;
      }

      .issue-description {
        color: #6b7280;
        font-size: 0.9rem;
      }

      .availability-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .availability-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .availability-item:last-child {
        border-bottom: none;
      }

      .availability-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .present {
        background: #dcfce7;
        color: #166534;
      }

      .on-leave {
        background: #fee2e2;
        color: #dc2626;
      }

      .goals-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .goal-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .goal-item:last-child {
        border-bottom: none;
      }

      .goal-member {
        font-weight: 600;
        color: #1f2937;
      }

      .goal-target {
        color: #6b7280;
      }

             @media (max-width: 768px) {
         .manage-team-root {
           flex-direction: column;
         }
         
         .edash-sidenav {
           position: static;
           width: 100%;
           height: auto;
         }
         
         .manage-team-root > .edash-main {
           margin-left: 0;
           width: 100%;
           padding: 1rem;
         }
         
         .manage-team-root > .edash-main.sidebar-collapsed {
           margin-left: 0;
           width: 100%;
         }

        .manage-team-header {
          flex-direction: column;
          gap: 1rem;
        }

        .header-content h1 {
          font-size: 1.5rem;
        }

        .header-content p {
          font-size: 1rem;
        }

        .header-actions {
          width: 100%;
          justify-content: stretch;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn {
          flex: 1;
          justify-content: center;
        }

        .section-card {
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.1rem;
        }

        .team-structure {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .communication-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .performance-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .task-table {
          font-size: 0.8rem;
        }

        .task-table th,
        .task-table td {
          padding: 0.5rem 0.25rem;
        }

        .task-table-container {
          margin: 0 -1rem;
          padding: 0 1rem;
        }

        .kpi-card {
          padding: 1rem;
        }

        .kpi-value {
          font-size: 1.2rem;
        }

        .leaderboard {
          padding: 1rem;
        }

        .communication-card {
          padding: 1rem;
        }

        .ai-suggestion {
          padding: 0.75rem;
          font-size: 0.9rem;
        }
      }

      @media (max-width: 480px) {
        .edash-main {
          padding: 0.5rem;
        }

        .section-card {
          padding: 0.75rem;
        }

        .manage-team-header {
          margin-bottom: 1rem;
        }

        .header-content h1 {
          font-size: 1.25rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .task-table {
          font-size: 0.75rem;
        }

        .task-table th,
        .task-table td {
          padding: 0.25rem;
        }
      }
    </style>

         <div class="manage-team-root" [class.dark-mode]="darkMode">
       <!-- Sidenav -->
       <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
         <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">Sustainability Head</span>
        </div>
        <nav class="edash-nav">
        <a routerLink="/environmental-dashboard" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.DASHBOARD') }}</span></a>
          <a routerLink="/materiality" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.MATERIALITY_ASSESSMENT') }}</span></a>
          <a routerLink="/team" class="edash-nav-link"><span class="edash-nav-icon">🧑‍🤝‍🧑</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.TEAM_MANAGEMENT') }}</span></a>
          <a routerLink="/initiatives-dashboard" class="edash-nav-link"><span class="edash-nav-icon">📣</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.ESG_INITIATIVE') }}</span></a>
          <a routerLink="/reporting" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.REPORT_ANALYTICS') }}</span></a>
          
          <a routerLink="/environmental-training" class="edash-nav-link"><span class="edash-nav-icon">🎓</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.TRAINING_DEVELOP') }}</span></a>
          
          <a routerLink="/stakeholder-engagement" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🤝</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.STAKEHOLDER_ENGAGEMENT') }}</span></a>
          <a routerLink="/data-management" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🗄️</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.DATA_MANAGEMENT') }}</span></a>
          
         
          <div class="edash-nav-actions">
            <app-global-language-toggle></app-global-language-toggle>
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
       
               <!-- Main Content -->
        <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed">
         <!-- Header -->
         <div class="manage-team-header">
        <div class="header-content">
          <h1>👥 {{ getTranslatedText('MANAGE_TEAM.TITLE') }}</h1>
          <p>{{ getTranslatedText('MANAGE_TEAM.SUBTITLE') }}</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="addTeamMember()">
            <span>➕</span>
            {{ getTranslatedText('MANAGE_TEAM.ADD_MEMBER') }}
          </button>
          <button class="btn btn-secondary" (click)="exportReport()">
            <span>📊</span>
            {{ getTranslatedText('MANAGE_TEAM.EXPORT_REPORT') }}
          </button>
        </div>
      </div>

      <!-- Team Structure & Hierarchy -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">👥 {{ getTranslatedText('MANAGE_TEAM.TEAM_STRUCTURE') }}</h2>
          <span class="ai-badge suggestion">{{ getTranslatedText('MANAGE_TEAM.AI_SUGGESTION') }}</span>
        </div>
        <div class="team-structure">
          <div class="structure-section">
            <h4>{{ getTranslatedText('MANAGE_TEAM.BY_ROLE') }}</h4>
            <ul class="member-list">
              <li *ngFor="let member of teamMembers">
                <div class="member-name">{{ member.name }}</div>
                <div class="member-role">{{ member.role }}</div>
              </li>
            </ul>
          </div>
          <div class="structure-section">
            <h4>{{ getTranslatedText('MANAGE_TEAM.REPORTING_HIERARCHY') }}</h4>
            <div class="hierarchy-item">
                              <div class="supervisor">{{ getSupervisor() }} ({{ getTranslatedText('MANAGE_TEAM.SUPERVISOR') }})</div>
              <div class="subordinates">
                → {{ getSubordinates().join(', ') }}
              </div>
            </div>
          </div>
        </div>
        <div class="ai-suggestion">
          <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.MOVING_DIGITAL') }}
        </div>
      </div>

      <!-- Task Assignment & Tracking -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">✅ {{ getTranslatedText('MANAGE_TEAM.TASK_ASSIGNMENT') }}</h2>
          <span class="ai-badge smart-assignment">{{ getTranslatedText('MANAGE_TEAM.AI_SMART_ASSIGNMENT') }}</span>
        </div>
        <div class="task-table-container">
          <table class="task-table">
          <thead>
            <tr>
              <th>{{ getTranslatedText('MANAGE_TEAM.TASK_NAME') }}</th>
              <th>{{ getTranslatedText('MANAGE_TEAM.ASSIGNED_TO') }}</th>
              <th>{{ getTranslatedText('MANAGE_TEAM.STATUS') }}</th>
              <th>{{ getTranslatedText('MANAGE_TEAM.PROGRESS') }}</th>
              <th>{{ getTranslatedText('MANAGE_TEAM.DEADLINE') }}</th>
              <th>{{ getTranslatedText('MANAGE_TEAM.ACTIONS') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of tasks">
              <td>{{ getTaskNameTranslation(task.name) }}</td>
              <td>{{ task.assignedTo }}</td>
              <td>
                <span class="status-badge" [ngClass]="'status-' + task.status.toLowerCase().replace(' ', '-')">
                  {{ getStatusTranslation(task.status) }}
                </span>
              </td>
              <td>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="task.progress"></div>
                </div>
                <span>{{ task.progress }}%</span>
              </td>
              <td>{{ task.deadline }}</td>
              <td>
                <a href="#" (click)="editTask(task)">{{ getTranslatedText('MANAGE_TEAM.EDIT') }}</a>
              </td>
            </tr>
                      </tbody>
          </table>
        </div>
        <div class="ai-suggestion">
          <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.ASSIGNS_BLOG_SERIES') }}
        </div>
      </div>

      <!-- Performance Dashboard -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">📊 {{ getTranslatedText('MANAGE_TEAM.PERFORMANCE_DASHBOARD') }}</h2>
          <span class="ai-badge leaderboard">{{ getTranslatedText('MANAGE_TEAM.AI_LEADERBOARD') }}</span>
        </div>
        <div class="performance-grid">
          <div class="kpi-card">
            <div class="kpi-title">{{ getTranslatedText('MANAGE_TEAM.SOCIAL_MEDIA_HANDLED') }}</div>
            <div class="kpi-value">
              <div *ngFor="let member of teamMembers">
                {{ member.name }}: {{ member.socialMediaHandled }}
              </div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">{{ getTranslatedText('MANAGE_TEAM.GOVERNANCE') }}</div>
            <div class="kpi-value">
              <div *ngFor="let member of teamMembers">
                {{ member.name }}: {{ member.governance }}
              </div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">{{ getTranslatedText('MANAGE_TEAM.INITIATIVE_ROI') }}</div>
            <div class="kpi-value">
              <div *ngFor="let member of teamMembers">
                {{ member.name }}: {{ member.initiativeROI }}x
              </div>
            </div>
          </div>
        </div>
        <div class="leaderboard">
          <h4>{{ getTranslatedText('MANAGE_TEAM.LEADERBOARD') }}</h4>
          <div class="leaderboard-item" *ngFor="let member of getSortedMembers(); let i = index">
            <div>
              <span class="rank">{{ i + 1 }}.</span>
              <span>{{ member.name }}</span>
            </div>
            <span class="member-score">{{ getTranslatedText('MANAGE_TEAM.SCORE') }}: {{ member.score }}</span>
          </div>
        </div>
        <div class="ai-suggestion">
          <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.PREDICTS_BURNOUT') }}
        </div>
      </div>

      <!-- Training & Development Tracker -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">📚 {{ getTranslatedText('MANAGE_TEAM.TRAINING_TRACKER') }}</h2>
          <span class="ai-badge recommendations">{{ getTranslatedText('MANAGE_TEAM.AI_RECOMMENDATIONS') }}</span>
        </div>
        <ul class="training-status">
          <li *ngFor="let member of teamMembers">
            <div class="training-info">
              <div class="training-course">{{ member.trainingCourse || getTranslatedText('MANAGE_TEAM.NOT_ATTENDED') }}</div>
              <div class="training-member">{{ member.name }}</div>
            </div>
                          <span *ngIf="member.trainingStatus !== 'Not attended'" 
                  class="certification-badge" 
                  [ngClass]="member.trainingStatus === 'Certified' ? 'certified' : 'in-progress'">
              {{ getTrainingStatusTranslation(member.trainingStatus) }}
            </span>
          </li>
        </ul>
        <div class="ai-suggestion">
          <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.RECOMMENDS_TRAINING') }}
        </div>
      </div>

      <!-- Communication Center -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">💬 {{ getTranslatedText('MANAGE_TEAM.COMMUNICATION_CENTER') }}</h2>
          <span class="ai-badge summary">{{ getTranslatedText('MANAGE_TEAM.AI_SUMMARY') }}</span>
        </div>
        <div class="communication-grid">
          <div class="communication-card announcement">
            <div class="communication-type">{{ getTranslatedText('MANAGE_TEAM.ANNOUNCEMENT') }}</div>
            <div class="communication-title">{{ getTranslatedText('MANAGE_TEAM.Q2_INITIATIVE_LAUNCH') }}</div>
            <div class="communication-content">{{ getTranslatedText('MANAGE_TEAM.IMPORTANT_MILESTONE') }}</div>
          </div>
          <div class="communication-card reminder">
            <div class="communication-type">{{ getTranslatedText('MANAGE_TEAM.REMINDER') }}</div>
            <div class="communication-title">{{ getTranslatedText('MANAGE_TEAM.SUBMIT_WEEKLY_REPORT') }}</div>
            <div class="communication-content">{{ getTranslatedText('MANAGE_TEAM.DEADLINE_APPROACHING') }}</div>
          </div>
          <div class="communication-card brief">
            <div class="communication-type">{{ getTranslatedText('MANAGE_TEAM.BRIEF') }}</div>
            <div class="communication-title">{{ getTranslatedText('MANAGE_TEAM.SOP_EVENT_COORDINATION') }}</div>
            <div class="communication-content">{{ getTranslatedText('MANAGE_TEAM.NEW_PROCEDURE_AVAILABLE') }}</div>
          </div>
        </div>
        <div class="ai-suggestion">
          <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.TOP_3_UPDATES') }}
        </div>
      </div>

      <!-- Issue Escalation Panel -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">⚠️ {{ getTranslatedText('MANAGE_TEAM.ISSUE_ESCALATION') }}</h2>
          <span class="ai-badge prioritization">{{ getTranslatedText('MANAGE_TEAM.AI_PRIORITIZATION') }}</span>
        </div>
        <ul class="issue-list">
          <li class="issue-item" *ngFor="let issue of issues">
            <div class="issue-header">
              <span class="issue-reporter">{{ issue.reporter }}: "{{ getIssueDescriptionTranslation(issue.description) }}"</span>
                              <span class="issue-status" [ngClass]="'issue-' + issue.status.toLowerCase()">
                  {{ getStatusTranslation(issue.status) }}
                </span>
            </div>
          </li>
        </ul>
        <div class="ai-suggestion">
          <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.PRIORITIZES_URGENT') }}
        </div>
      </div>

      <!-- Attendance & Availability -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">📅 {{ getTranslatedText('MANAGE_TEAM.ATTENDANCE_AVAILABILITY') }}</h2>
          <span class="ai-badge forecast">{{ getTranslatedText('MANAGE_TEAM.AI_FORECAST') }}</span>
        </div>
        <ul class="availability-list">
          <li class="availability-item" *ngFor="let member of teamMembers">
            <span>{{ member.name }}: {{ getAvailabilityTranslation(member.availability) }}</span>
                          <span *ngIf="member.leaveDates" class="availability-status on-leave">
                {{ getLeaveDatesTranslation(member.leaveDates) }}
              </span>
              <span *ngIf="!member.leaveDates" class="availability-status present">
                {{ getTranslatedText('MANAGE_TEAM.PRESENT') }}
              </span>
          </li>
        </ul>
        <div class="ai-suggestion">
          <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.RESOURCE_GAP') }}
        </div>
      </div>

      <!-- Goal Planning & Reviews -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">🎯 {{ getTranslatedText('MANAGE_TEAM.GOAL_PLANNING') }}</h2>
          <span class="ai-badge goal-setting">{{ getTranslatedText('MANAGE_TEAM.AI_GOAL_SETTING') }}</span>
        </div>
        <ul class="goals-list">
          <li class="goal-item" *ngFor="let member of teamMembers">
            <span class="goal-member">{{ member.name }}: {{ getGoalsTranslation(member.goals) }}</span>
          </li>
        </ul>
                 <div class="ai-suggestion">
           <strong>AI:</strong> {{ getTranslatedText('MANAGE_TEAM.HIGHER_GOAL') }}
         </div>
       </div>
         </main>
       </div>
  `
})
 export class ManageTeamComponent implements OnInit, OnDestroy {
  darkMode = false;
  sidebarCollapsed = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
   
   teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Abdullah Al-Rashid',
      role: 'Life Cycle Assessment Specialist',
      supervisor: 'Abdullah Al-Rashid',
      subordinates: ['Khalid Al-Sayed', 'Noura Al-Zahra'],
      socialMediaHandled: 120,
      governance: 30,
      initiativeROI: 3.2,
      score: 92,
      trainingStatus: 'Certified',
      trainingCourse: 'Digital Initiative Bootcamp',
      availability: 'Present',
      goals: '40 Accounts'
    },
    {
      id: '2',
      name: 'Khalid Al-Sayed',
      role: 'ESG IoT and smart Tech engineer',
      socialMediaHandled: 80,
      governance: 20,
      initiativeROI: 2.5,
      score: 85,
      trainingStatus: 'Not attended',
      availability: 'Present',
      goals: '20 social Initiative'
    },
    {
      id: '3',
      name: 'Noura Al-Zahra',
      role: 'Content Strategist',
      socialMediaHandled: 90,
      governance: 25,
      initiativeROI: 2.8,
      score: 88,
      trainingStatus: 'In Progress',
      trainingCourse: 'Content Strategy Seminar',
      availability: 'On Leave',
      leaveDates: 'July 8-10',
      goals: '10 blog posts'
    }
  ];

  tasks: Task[] = [
    {
      id: '1',
      name: 'Launch Q2 Initiative',
      assignedTo: 'Abdullah Al-Rashid',
      status: 'In Progress',
      progress: 70,
      deadline: '2024-07-10'
    },
    {
      id: '2',
      name: 'Write Blog Series',
      assignedTo: 'Noura Al-Zahra',
      status: 'Pending',
      progress: 0,
      deadline: '2024-07-12'
    },
    {
      id: '3',
      name: 'Social Media Audit',
      assignedTo: 'Khalid Al-Sayed',
      status: 'Completed',
      progress: 100,
      deadline: '2024-06-30'
    }
  ];

  issues: Issue[] = [
    {
      id: '1',
      reporter: 'Khalid Al-Sayed',
      description: 'Cannot access Initiative analytics',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: '2',
      reporter: 'Noura Al-Zahra',
      description: 'Need approval for blog series',
      status: 'Resolved',
      priority: 'Medium'
    }
  ];

  addTeamMember() {
    // Implementation for adding team member
    console.log('Add team member clicked');
  }

  exportReport() {
    // Implementation for exporting report
    console.log('Export report clicked');
  }

  editTask(task: Task) {
    // Implementation for editing task
    console.log('Edit task:', task);
  }

  getSupervisor(): string {
    const supervisor = this.teamMembers.find(member => member.supervisor);
    return supervisor ? supervisor.name : '';
  }

  getSubordinates(): string[] {
    const supervisor = this.teamMembers.find(member => member.supervisor);
    return supervisor ? supervisor.subordinates || [] : [];
  }

     getSortedMembers(): TeamMember[] {
     return [...this.teamMembers].sort((a, b) => b.score - a.score);
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

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  getTaskNameTranslation(taskName: string): string {
    const key = 'MANAGE_TEAM.' + taskName.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(key);
  }

  getStatusTranslation(status: string): string {
    const key = 'MANAGE_TEAM.' + status.toUpperCase().replace(/ /g, '_') + '_STATUS';
    return this.translationService.translate(key);
  }

  getTrainingStatusTranslation(status: string): string {
    const key = 'MANAGE_TEAM.' + status.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(key);
  }

  getIssueDescriptionTranslation(description: string): string {
    const key = 'MANAGE_TEAM.' + description.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(key);
  }

  getAvailabilityTranslation(availability: string): string {
    const key = 'MANAGE_TEAM.' + availability.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(key);
  }

  getLeaveDatesTranslation(dates: string): string {
    const key = 'MANAGE_TEAM.' + dates.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(key);
  }

  getGoalsTranslation(goals: string): string {
    const key = 'MANAGE_TEAM.' + goals.toUpperCase().replace(/ /g, '_');
    return this.translationService.translate(key);
  }
   
   toggleDarkMode() {
     this.themeService.toggleDarkMode();
   }
 
   logout() {
     if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
     this.router.navigate(['/login']);
   }
 
   constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: GlobalTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Manage Team language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Manage Team translations not loaded yet');
      }
    }, 1000);
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