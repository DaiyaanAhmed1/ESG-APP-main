import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { DataManagementTranslationService } from '../services/data-management-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  template: `
    <style>
      .dm-root {
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
      .dm-root > .dm-main {
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
      @media (max-width: 900px) {
        .dm-root { flex-direction: column; }
        .edash-sidenav {
          position: static;
          width: 100%;
          height: auto;
          margin-left: 0;
        }
        .dm-root > .dm-main {
          margin-left: 0;
        }
      }
      .dm-main {
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
      .dm-root.dark-mode .dm-main {
        background: #181828;
        color: #e0e0e0;
      }
      
      /* RTL Support */
      .dm-root.rtl {
        direction: rtl;
      }
      .dm-root.rtl .dm-main {
        margin-left: 0;
        margin-right: 260px;
      }
      .dm-root.rtl .edash-sidenav {
        left: auto;
        right: 0;
      }
      .dm-root.rtl .edash-nav-link {
        border-right: none;
        border-left: 3px solid transparent;
      }
      .dm-root.rtl .edash-nav-link.active {
        border-right: none;
        border-left: 3px solid #2563eb;
      }
      .dm-root.rtl.dark-mode .edash-nav-link.active {
        border-right: none;
        border-left: 3px solid #7eaaff;
      }
      .dm-main-content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2.5rem;
        align-items: flex-start;
      }
      .dm-panel {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        padding: 2rem 1.5rem 1.5rem 1.5rem;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        min-height: 350px;
        transition: background 0.3s, color 0.3s;
      }
      .dm-root.dark-mode .dm-panel {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .dm-panel h2 {
        font-size: 1.3rem;
        font-weight: 700;
        color: #2563eb;
        margin-bottom: 1.2rem;
      }
      .dm-root.dark-mode .dm-panel h2 {
        color: #7eaaff;
      }
      .dm-btn {
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
      .dm-btn:hover {
        background: #1746a2;
      }
      .dm-input {
        width: 100%;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        transition: background 0.3s, color 0.3s, border 0.3s;
      }
      .dm-root.dark-mode .dm-input {
        background: #181828;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .dm-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem 0;
      }
      .dm-list-item {
        background: #f3f4f6;
        margin-bottom: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.3s, color 0.3s;
      }
      .dm-root.dark-mode .dm-list-item {
        background: #23284a;
        color: #e0e0e0;
      }
      .dm-status {
        font-weight: 600;
        border-radius: 6px;
        padding: 0.2rem 0.7rem;
        font-size: 0.95rem;
      }
      .dm-status.good { background: #e6fce6; color: #22c55e; }
      .dm-status.warn { background: #fffbe6; color: #facc15; }
      .dm-status.bad { background: #ffe6e6; color: #ef4444; }
      .dm-root.dark-mode .dm-status.good { background: #223c2c; color: #22c55e; }
      .dm-root.dark-mode .dm-status.warn { background: #23284a; color: #facc15; }
      .dm-root.dark-mode .dm-status.bad { background: #3a1a1a; color: #ef4444; }
      @media (max-width: 1100px) {
        .dm-main-content {
          grid-template-columns: 1fr;
        }
      }
    </style>
    <div class="dm-root" [class.dark-mode]="darkMode" [class.rtl]="isRTL">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">Sustainability Head</span>
        </div>
        <nav class="edash-nav">
          <a routerLink="/materiality" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">Materiality Assessment</span></a>
          <a routerLink="/team" class="edash-nav-link"><span class="edash-nav-icon">🧑‍🤝‍🧑</span><span *ngIf="!sidebarCollapsed">Manage Team</span></a>
          <a routerLink="/initiatives-dashboard" class="edash-nav-link"><span class="edash-nav-icon">📣</span><span *ngIf="!sidebarCollapsed">ESG Initiative</span></a>
          <a routerLink="/reporting" class="edash-nav-link"><span class="edash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">Reporting & Analysis</span></a>
          
          <a routerLink="/environmental-training" class="edash-nav-link"><span class="edash-nav-icon">🎓</span><span *ngIf="!sidebarCollapsed">Training & Development</span></a>
          <a routerLink="/workspace" class="edash-nav-link"><span class="edash-nav-icon">📁</span><span *ngIf="!sidebarCollapsed">Workspace</span></a>
          <a routerLink="/stakeholder-engagement" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🤝</span><span *ngIf="!sidebarCollapsed">Stakeholder Engagement</span></a>
          <a routerLink="/data-management" routerLinkActive="active" class="edash-nav-link"><span class="edash-nav-icon">🗄️</span><span *ngIf="!sidebarCollapsed">Data Management</span></a>
          
         
          <a routerLink="/calendar" class="edash-nav-link"><span class="edash-nav-icon">📅</span><span *ngIf="!sidebarCollapsed">Calendar & Events</span></a>
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
      <main class="dm-main">
        <div class="dm-header" style="font-size:2rem;font-weight:700;color:#2563eb;margin-bottom:2.5rem;">{{ getTranslatedText('DATA_MANAGEMENT.TITLE') }}</div>
        <div class="dm-main-content">
          <!-- Data Sources -->
          <div class="dm-panel">
            <h2>{{ getTranslatedText('DATA_MANAGEMENT.DATA_SOURCES') }}</h2>
            <input class="dm-input" [(ngModel)]="newSource" [placeholder]="getTranslatedText('DATA_MANAGEMENT.ADD_SOURCE')" />
            <button class="dm-btn" (click)="addSource()">{{ getTranslatedText('DATA_MANAGEMENT.ADD_SOURCE') }}</button>
            <ul class="dm-list">
              <li *ngFor="let s of dataSources; let i = index" class="dm-list-item">
                <span>{{ s }}</span>
                <button class="dm-btn" (click)="deleteSource(i)">{{ getTranslatedText('DATA_MANAGEMENT.DELETE') }}</button>
              </li>
            </ul>
          </div>

          <!-- Manual Upload -->
          <div class="dm-panel">
            <h2>{{ getTranslatedText('DATA_MANAGEMENT.UPLOAD_FILES') }}</h2>
            <input class="dm-input" type="file" (change)="handleFileUpload($event)" />
            <ul class="dm-list">
              <li *ngFor="let f of uploads; let i = index" class="dm-list-item">
                <span>{{ f.name }}</span>
                <button class="dm-btn" (click)="deleteUpload(i)">{{ getTranslatedText('DATA_MANAGEMENT.DELETE') }}</button>
              </li>
            </ul>
          </div>

          <!-- Data Validation -->
          <div class="dm-panel">
            <h2>{{ getTranslatedText('DATA_MANAGEMENT.VALIDATION_RULES') }}</h2>
            <ul class="dm-list">
              <li *ngFor="let v of validations; let i = index" class="dm-list-item">
                <span>{{ v.name }}</span>
                <span class="dm-status" [ngClass]="{
                  'good': v.status === 'Good',
                  'warn': v.status === 'Warning',
                  'bad': v.status === 'Error'
                }">{{ getTranslatedText('DATA_MANAGEMENT.' + v.status.toUpperCase()) }}</span>
                <button class="dm-btn" (click)="deleteValidation(i)">{{ getTranslatedText('DATA_MANAGEMENT.DELETE') }}</button>
              </li>
            </ul>
          </div>

          <!-- Data Analytics -->
          <div class="dm-panel">
            <h2>{{ getTranslatedText('DATA_MANAGEMENT.ANALYTICS') }}</h2>
            <div style="font-size:1.1rem;margin-bottom:1rem;">{{ getTranslatedText('DATA_MANAGEMENT.TOTAL_RECORDS') }}: <b>{{ analytics.totalRecords }}</b></div>
            <div style="font-size:1.1rem;margin-bottom:1rem;">{{ getTranslatedText('DATA_MANAGEMENT.LAST_SYNC') }}: <b>{{ analytics.lastSync }}</b></div>
            <div style="font-size:1.1rem;margin-bottom:1rem;">{{ getTranslatedText('DATA_MANAGEMENT.DATA_GROWTH') }}: <b>{{ analytics.dataGrowth }}%</b></div>
            <div style="font-size:1.1rem;margin-bottom:1rem;">{{ getTranslatedText('DATA_MANAGEMENT.MOST_ACTIVE_SOURCE') }}: <b>{{ analytics.mostActiveSource }}</b></div>
          </div>

          <!-- Integration Status -->
          <div class="dm-panel">
            <h2>{{ getTranslatedText('DATA_MANAGEMENT.INTEGRATION_STATUS') }}</h2>
            <ul class="dm-list">
              <li *ngFor="let sys of integrationStatus" class="dm-list-item">
                <span>{{ sys.name }}</span>
                <span class="dm-status" [ngClass]="{
                  'good': sys.status === 'Connected',
                  'warn': sys.status === 'Warning',
                  'bad': sys.status === 'Disconnected'
                }">{{ getTranslatedText('DATA_MANAGEMENT.' + sys.status.toUpperCase()) }}</span>
              </li>
            </ul>
          </div>

          <!-- Data Access Logs -->
          <div class="dm-panel">
            <h2>{{ getTranslatedText('DATA_MANAGEMENT.ACCESS_LOGS') }}</h2>
            <ul class="dm-list">
              <li *ngFor="let log of accessLogs" class="dm-list-item">
                <span>{{ log.user }} {{ getTranslatedText('DATA_MANAGEMENT.ACCESSED') }} <b>{{ log.source }}</b></span>
                <span style="font-size:0.95rem;color:#888;">{{ log.time }}</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  `,
})

export class DataManagementComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: DataManagementTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Data Management language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Data Management translations not loaded yet');
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

  // Data Sources
  dataSources: string[] = ['IoT Sensors', 'Utility Bills', 'HR System', 'ERP System', 'Weather API'];
  newSource = '';
  addSource() {
    if (this.newSource.trim()) {
      this.dataSources.unshift(this.newSource.trim());
      this.newSource = '';
    }
  }
  deleteSource(i: number) {
    this.dataSources.splice(i, 1);
  }

  // Manual Upload
  uploads: { name: string }[] = [
    { name: 'Q1_2024_Utility.csv' },
    { name: 'HR_Employee_List.xlsx' },
    { name: 'IoT_Sensor_Data_March.csv' }
  ];
  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploads.unshift({ name: file.name });
    }
  }
  deleteUpload(i: number) {
    this.uploads.splice(i, 1);
  }

  // Data Validation
  validations: { name: string; status: 'Good' | 'Warning' | 'Error' }[] = [
    { name: 'IoT Sensors', status: 'Good' },
    { name: 'Utility Bills', status: 'Warning' },
    { name: 'HR System', status: 'Error' },
    { name: 'ERP System', status: 'Good' },
    { name: 'Weather API', status: 'Good' }
  ];
  deleteValidation(i: number) {
    this.validations.splice(i, 1);
  }

  // Data Analytics
  analytics = {
    totalRecords: 124567,
    lastSync: '2024-06-10 14:32',
    dataGrowth: 12.5,
    mostActiveSource: 'IoT Sensors'
  };

  // Integration Status
  integrationStatus = [
    { name: 'IoT Sensors', status: 'Connected' },
    { name: 'Utility Bills', status: 'Warning' },
    { name: 'HR System', status: 'Disconnected' },
    { name: 'ERP System', status: 'Connected' },
    { name: 'Weather API', status: 'Connected' }
  ];

  // Data Access Logs
  accessLogs = [
    { user: 'Alice', source: 'IoT Sensors', time: '2024-06-10 13:45' },
    { user: 'Bob', source: 'Utility Bills', time: '2024-06-10 12:30' },
    { user: 'Charlie', source: 'ERP System', time: '2024-06-10 11:10' },
    { user: 'Diana', source: 'Weather API', time: '2024-06-10 10:05' },
    { user: 'Eve', source: 'HR System', time: '2024-06-09 17:20' }
  ];

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