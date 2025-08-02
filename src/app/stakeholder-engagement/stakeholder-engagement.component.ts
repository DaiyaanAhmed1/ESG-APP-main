import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { StakeholderEngagementTranslationService } from '../services/stakeholder-engagement-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-stakeholder-engagement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  template: `
    <div class="edash-root" [class.dark-mode]="darkMode" [class.rtl]="isRTL">
      <!-- Sidenav -->
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">Sustainability Head</span>
        </div>
        <nav class="edash-nav">
          <a routerLink="/environmental-dashboard" class="edash-nav-link" data-title="Sustainability Head">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('STAKEHOLDER_ENGAGEMENT.SUSTAINABILITY_HEAD') }}</span>
          </a>
          <a routerLink="/materiality" class="edash-nav-link" data-title="Materiality Assessment">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">Materiality Assessment</span>
          </a>
          <a routerLink="/team" class="edash-nav-link" data-title="Manage Team">
            <span class="edash-nav-icon">🧑‍🤝‍🧑</span>
            <span *ngIf="!sidebarCollapsed">Manage Team</span>
          </a>
          <a routerLink="/initiatives-dashboard" class="edash-nav-link" data-title="ESG Initiative">
            <span class="edash-nav-icon">📣</span>
            <span *ngIf="!sidebarCollapsed">ESG Initiative</span>
          </a>
          <a routerLink="/reporting" class="edash-nav-link" data-title="Reporting & Analysis">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">Reporting & Analysis</span>
          </a>
          
          <a routerLink="/environmental-training" class="edash-nav-link"><span class="edash-nav-icon">🎓</span><span *ngIf="!sidebarCollapsed">Training & Development</span></a>
          <a routerLink="/stakeholder-engagement" routerLinkActive="active" class="edash-nav-link active" data-title="Stakeholder Engagement">
            <span class="edash-nav-icon">🤝</span>
            <span *ngIf="!sidebarCollapsed">Stakeholder Engagement</span>
          </a>
          <a routerLink="/data-management" routerLinkActive="active" class="edash-nav-link" data-title="Data Management">
            <span class="edash-nav-icon">🗄️</span>
            <span *ngIf="!sidebarCollapsed">Data Management</span>
          </a>
          <a routerLink="/notifications" class="edash-nav-link" data-title="Notifications & Alerts">
            <span class="edash-nav-icon">🔔</span>
            <span *ngIf="!sidebarCollapsed">Notifications & Alerts</span>
          </a>
          
          <div class="edash-nav-actions">
            <app-unified-language-toggle></app-unified-language-toggle>
            <button class="edash-logout" (click)="logout()" aria-label="Logout" data-title="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('STAKEHOLDER_ENGAGEMENT.LOGOUT') }}</span>
            </button>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav" data-title="Collapse">
              <span class="icon">⬅️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('STAKEHOLDER_ENGAGEMENT.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode" data-title="Light Mode">
              <span class="icon">☀️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('STAKEHOLDER_ENGAGEMENT.LIGHT_MODE') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      
      <!-- Main Content -->
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
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
            background: #333;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1001;
            margin-left: 0.5rem;
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
          
          .edash-sidenav.dark-mode .edash-nav-link {
            color: #e0e0e0;
          }
          
          .edash-sidenav.dark-mode .edash-nav-link.active {
            background: #2a2a4e;
            color: #7eaaff;
            border-right: 3px solid #7eaaff;
          }
          
          .edash-nav-link:hover {
            background: #f1f5f9;
            color: #1e40af;
          }
          
          .edash-sidenav.dark-mode .edash-nav-link:hover {
            background: #2a2a4e;
            color: #7eaaff;
          }
          
          .edash-nav-icon {
            font-size: 1.25rem;
            width: 1.5rem;
            text-align: center;
          }
          
          .edash-nav-actions {
            padding: 1rem;
            border-top: 1px solid #ececec;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .edash-sidenav.dark-mode .edash-nav-actions {
            border-top: 1px solid #333;
          }
          
          .edash-logout, .edash-sidenav-toggle, .edash-dark-toggle {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            background: none;
            border: none;
            color: #333;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            border-radius: 8px;
            transition: background 0.2s, color 0.2s;
            width: 100%;
            text-align: left;
          }
          
          .edash-sidenav.dark-mode .edash-logout,
          .edash-sidenav.dark-mode .edash-sidenav-toggle,
          .edash-sidenav.dark-mode .edash-dark-toggle {
            color: #e0e0e0;
          }
          
          .edash-logout:hover, .edash-sidenav-toggle:hover, .edash-dark-toggle:hover {
            background: #f1f5f9;
            color: #1e40af;
          }
          
          .edash-sidenav.dark-mode .edash-logout:hover,
          .edash-sidenav.dark-mode .edash-sidenav-toggle:hover,
          .edash-sidenav.dark-mode .edash-dark-toggle:hover {
            background: #2a2a4e;
            color: #7eaaff;
          }
          
          .edash-main {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
            transition: margin-left 0.3s ease;
          }
          
          .edash-main.sidebar-collapsed {
            margin-left: 70px;
          }
          
          .edash-main.dark-mode {
            background: #0f172a;
            color: #e0e0e0;
          }

          /* Stakeholder Engagement specific styles */
          .stake-main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
            align-items: flex-start;
          }
          .stake-section-panel {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.07);
            padding: 2rem 1.5rem 1.5rem 1.5rem;
            margin-bottom: 0;
            display: flex;
            flex-direction: column;
            min-height: 350px;
          }
          .stake-section-panel h2 {
            font-size: 1.3rem;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 1.2rem;
          }
          .stake-btn {
            background: #2563eb;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 0.5rem 1.2rem;
            font-weight: 600;
            cursor: pointer;
            margin-left: 0.5rem;
            transition: background 0.2s;
          }
          .stake-btn:hover {
            background: #1746a2;
          }
          .stake-input, .stake-textarea {
            width: 100%;
            margin-bottom: 0.5rem;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 6px;
          }
          .stake-textarea { min-height: 60px; }
          .stake-list {
            list-style: none;
            padding: 0;
            margin: 0 0 1rem 0;
          }
          .stake-list-item {
            background: #f3f4f6;
            margin-bottom: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .stake-analytics {
            background: #e6f0ff;
            border-radius: 10px;
            padding: 1rem 1.5rem;
            margin-top: 1.5rem;
            color: #2563eb;
            font-weight: 600;
            font-size: 1.1rem;
          }
          .edash-main.dark-mode .stake-section-panel {
            background: #1e293b;
            color: #e0e0e0;
            border: 1px solid #334155;
          }
          .edash-main.dark-mode .stake-section-panel h2 {
            color: #7eaaff;
          }
          .edash-main.dark-mode .stake-list-item {
            background: #334155;
            color: #e0e0e0;
          }
          .edash-main.dark-mode .stake-input, .edash-main.dark-mode .stake-textarea {
            background: #1e293b;
            color: #e0e0e0;
            border: 1px solid #334155;
          }
          .edash-main.dark-mode .stake-analytics {
            background: #1e3a2e;
            color: #7eaaff;
          }
          @media (max-width: 1100px) {
            .stake-main-content {
              grid-template-columns: 1fr;
            }
          }
        </style>
        
        <div class="stake-header" style="margin-bottom:2.5rem;">Stakeholder Engagement</div>
        <div class="stake-main-content">
          <!-- Surveys & Feedback -->
          <div class="stake-section-panel">
            <h2>Surveys & Feedback</h2>
            <input class="stake-input" [(ngModel)]="newSurvey" placeholder="Survey title..." />
            <textarea class="stake-textarea" [(ngModel)]="newSurveyDesc" placeholder="Survey description..."></textarea>
            <button class="stake-btn" (click)="addSurvey()">Launch Survey</button>
            <ul class="stake-list">
              <li *ngFor="let s of surveys; let i = index" class="stake-list-item">
                <span><b>{{ s.title }}</b>: {{ s.desc }}</span>
                <button class="stake-btn" (click)="deleteSurvey(i)">Delete</button>
              </li>
            </ul>
            <div class="stake-analytics">
              <div><b>Engagement Analytics</b></div>
              <div>Total Surveys: {{ surveys.length }}</div>
              <div>Avg. Responses: {{ avgResponses }}</div>
              <div>Positive Feedback: {{ positiveFeedback }}%</div>
            </div>
          </div>

          <!-- Community Initiatives -->
          <div class="stake-section-panel">
            <h2>Community Initiatives</h2>
            <input class="stake-input" [(ngModel)]="newInitiative" placeholder="Initiative name..." />
            <textarea class="stake-textarea" [(ngModel)]="newInitiativeDesc" placeholder="Initiative description..."></textarea>
            <button class="stake-btn" (click)="addInitiative()">Add Initiative</button>
            <ul class="stake-list">
              <li *ngFor="let c of initiatives; let i = index" class="stake-list-item">
                <span><b>{{ c.name }}</b>: {{ c.desc }}</span>
                <button class="stake-btn" (click)="deleteInitiative(i)">Delete</button>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class StakeholderEngagementComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: StakeholderEngagementTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Stakeholder Engagement language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Stakeholder Engagement translations not loaded yet');
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

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }
  
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }
  
  toggleDarkMode() { 
    this.themeService.toggleDarkMode(); 
  }

  // Surveys & Feedback
  surveys: { title: string; desc: string }[] = [
    { title: 'Sustainability Awareness', desc: 'Quarterly survey on sustainability practices.' },
  ];
  newSurvey = '';
  newSurveyDesc = '';
  addSurvey() {
    if (this.newSurvey.trim() && this.newSurveyDesc.trim()) {
      this.surveys.unshift({ title: this.newSurvey.trim(), desc: this.newSurveyDesc.trim() });
      this.newSurvey = '';
      this.newSurveyDesc = '';
    }
  }
  deleteSurvey(i: number) {
    this.surveys.splice(i, 1);
  }
  get avgResponses() { return 42; }
  get positiveFeedback() { return 87; }

  // Community Initiatives
  initiatives: { name: string; desc: string }[] = [
    { name: 'Tree Planting Drive', desc: 'Annual community tree planting event.' },
  ];
  newInitiative = '';
  newInitiativeDesc = '';
  addInitiative() {
    if (this.newInitiative.trim() && this.newInitiativeDesc.trim()) {
      this.initiatives.unshift({ name: this.newInitiative.trim(), desc: this.newInitiativeDesc.trim() });
      this.newInitiative = '';
      this.newInitiativeDesc = '';
    }
  }
  deleteInitiative(i: number) {
    this.initiatives.splice(i, 1);
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