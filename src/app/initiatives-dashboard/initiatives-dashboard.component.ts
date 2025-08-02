import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InitiativesDashboardTranslationService } from '../services/initiatives-dashboard-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-initiatives-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, UnifiedLanguageToggleComponent],
  template: `
    <div class="initiatives-dashboard-root" [class.rtl]="isRTL">
      <aside class="initiatives-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="initiatives-sidebar-header">
          <div class="initiatives-logo">
            <span class="initiatives-logo-icon">🌱</span>
            <span class="initiatives-logo-text" *ngIf="!sidebarCollapsed">ESG Hub</span>
          </div>
          <button class="initiatives-sidebar-toggle" (click)="sidebarCollapsed = !sidebarCollapsed">
            <span>‹</span>
          </button>
        </div>
        
        <nav class="initiatives-nav">
          <a routerLink="/dashboard" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">📊</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Dashboard</span>
          </a>
          <a routerLink="/initiatives-dashboard" class="initiatives-nav-item active">
            <span class="initiatives-nav-icon">🎯</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Initiatives</span>
          </a>
          <a routerLink="/sustainability" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">🌿</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Sustainability</span>
          </a>
          <a routerLink="/materiality" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">⚖️</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Materiality</span>
          </a>
          <a routerLink="/manage-team" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">👥</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Team</span>
          </a>
          <a routerLink="/reporting" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">📈</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Reporting</span>
          </a>
          <a routerLink="/training" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">🎓</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Training</span>
          </a>
          <a routerLink="/stakeholder-engagement" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">🤝</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Stakeholder</span>
          </a>
          <a routerLink="/data-management" class="initiatives-nav-item">
            <span class="initiatives-nav-icon">💾</span>
            <span class="initiatives-nav-text" *ngIf="!sidebarCollapsed">Data</span>
          </a>
        </nav>
        
        <div class="initiatives-sidebar-footer">
          <button class="initiatives-sidebar-btn" (click)="toggleDarkMode()">
            <span class="initiatives-sidebar-btn-icon">{{ darkMode ? '☀️' : '🌙' }}</span>
            <span class="initiatives-sidebar-btn-text" *ngIf="!sidebarCollapsed">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
          <button class="initiatives-sidebar-btn" (click)="logout()">
            <span class="initiatives-sidebar-btn-icon">��</span>
            <span class="initiatives-sidebar-btn-text" *ngIf="!sidebarCollapsed">Logout</span>
          </button>
        </div>
      </aside>
      
      <main class="initiatives-main">
        <header class="initiatives-header">
          <div class="initiatives-header-content">
            <div class="initiatives-header-left">
              <h1 class="initiatives-title">{{ getTranslatedText('INITIATIVES_DASHBOARD.DASHBOARD_TITLE') }}</h1>
              <p class="initiatives-subtitle">{{ getTranslatedText('INITIATIVES_DASHBOARD.DASHBOARD_SUBTITLE') }}</p>
            </div>
            <div class="initiatives-header-right">
              <app-unified-language-toggle></app-unified-language-toggle>
              <div class="initiatives-last-updated">
                {{ getTranslatedText('INITIATIVES_DASHBOARD.LAST_UPDATED') }}: {{ getCurrentDate() }}
              </div>
            </div>
          </div>
        </header>

        <div class="initiatives-section">
          <h2>{{ getTranslatedText('INITIATIVES_DASHBOARD.ACTIVE_PROJECTS') }}</h2>
          <table class="initiatives-table">
            <thead>
              <tr>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.OVERVIEW') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.STATUS') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.OWNER') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.ACTIONS') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let project of activeProjects; let i = index">
                <td>{{ project.name }}</td>
                <td>{{ project.status }}</td>
                <td>{{ project.owner }}</td>
                <td>
                  <button (click)="openEditProject(i)">{{ getTranslatedText('INITIATIVES_DASHBOARD.EDIT') }}</button>
                  <button (click)="openMonitorProject(i)">{{ getTranslatedText('INITIATIVES_DASHBOARD.MONITOR') }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="initiatives-section">
          <h2>{{ getTranslatedText('INITIATIVES_DASHBOARD.PROPOSALS') }}</h2>
          <form class="proposal-form" (ngSubmit)="submitProposal()">
            <input [(ngModel)]="newProposal.title" name="title" [placeholder]="getTranslatedText('INITIATIVES_DASHBOARD.OVERVIEW')" required />
            <textarea [(ngModel)]="newProposal.description" name="description" [placeholder]="getTranslatedText('INITIATIVES_DASHBOARD.DASHBOARD_SUBTITLE')" required></textarea>
            <button type="submit">{{ getTranslatedText('INITIATIVES_DASHBOARD.SAVE') }}</button>
          </form>
          <table class="initiatives-table">
            <thead>
              <tr>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.OVERVIEW') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.DASHBOARD_SUBTITLE') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.STATUS') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let proposal of proposals">
                <td>{{ proposal.title }}</td>
                <td>{{ proposal.description }}</td>
                <td>{{ proposal.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="initiatives-section">
          <h2>{{ getTranslatedText('INITIATIVES_DASHBOARD.BUDGET_TRACKING') }}</h2>
          <table class="initiatives-table">
            <thead>
              <tr>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.OVERVIEW') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.BUDGET') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.SPENT') }}</th>
                <th>{{ getTranslatedText('INITIATIVES_DASHBOARD.FORECAST_IMPACT') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let budget of budgets">
                <td>{{ budget.project }}</td>
                <td>{{ budget.budget | currency }}</td>
                <td>{{ budget.spent | currency }}</td>
                <td>{{ budget.impact }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="initiatives-section">
          <h2>{{ getTranslatedText('INITIATIVES_DASHBOARD.MILESTONE_TRACKER') }}</h2>
          <div *ngFor="let milestone of milestones">
            <div>{{ milestone.name }} ({{ milestone.progress }}%)</div>
            <div class="milestone-progress">
              <div class="milestone-bar" [style.width.%]="milestone.progress">{{ milestone.progress }}%</div>
            </div>
            <div>{{ getTranslatedText('INITIATIVES_DASHBOARD.TARGET_DATE') }}: {{ milestone.targetDate }}</div>
          </div>
        </div>
        
        <!-- Edit Project Modal -->
        <div *ngIf="editProjectIndex !== null" class="modal-backdrop">
          <div class="modal" [class.dark-mode]="darkMode">
            <button class="modal-close" (click)="closeEditProject()">&times;</button>
            <h3>{{ getTranslatedText('INITIATIVES_DASHBOARD.EDIT_PROJECT') }}</h3>
            <form (ngSubmit)="saveEditProject()">
              <label>{{ getTranslatedText('INITIATIVES_DASHBOARD.PROJECT_NAME') }}
                <input [(ngModel)]="editProjectData.name" name="editName" required />
              </label>
              <label>{{ getTranslatedText('INITIATIVES_DASHBOARD.STATUS') }}
                <select [(ngModel)]="editProjectData.status" name="editStatus">
                  <option>{{ getTranslatedText('INITIATIVES_DASHBOARD.ONGOING') }}</option>
                  <option>{{ getTranslatedText('INITIATIVES_DASHBOARD.COMPLETED') }}</option>
                  <option>{{ getTranslatedText('INITIATIVES_DASHBOARD.ON_HOLD') }}</option>
                </select>
              </label>
              <label>{{ getTranslatedText('INITIATIVES_DASHBOARD.OWNER') }}
                <input [(ngModel)]="editProjectData.owner" name="editOwner" required />
              </label>
              <label>{{ getTranslatedText('INITIATIVES_DASHBOARD.PROGRESS_PERCENTAGE') }}
                <input type="number" [(ngModel)]="editProjectData.progress" name="editProgress" min="0" max="100" required />
              </label>
              <div class="modal-actions">
                <button type="submit">{{ getTranslatedText('INITIATIVES_DASHBOARD.SAVE') }}</button>
                <button type="button" (click)="closeEditProject()">{{ getTranslatedText('INITIATIVES_DASHBOARD.CANCEL') }}</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Monitor Project Modal -->
        <div *ngIf="monitorProjectIndex !== null" class="modal-backdrop">
          <div class="modal" [class.dark-mode]="darkMode">
            <button class="modal-close" (click)="closeMonitorProject()">&times;</button>
            <h3>{{ getTranslatedText('INITIATIVES_DASHBOARD.MONITOR_PROJECT') }}</h3>
            <div class="monitor-section">
              <div class="monitor-label">{{ getTranslatedText('INITIATIVES_DASHBOARD.OVERVIEW') }}: {{ activeProjects[monitorProjectIndex!].name }}</div>
              <div class="monitor-label">{{ getTranslatedText('INITIATIVES_DASHBOARD.STATUS') }}: {{ activeProjects[monitorProjectIndex!].status }}</div>
              <div class="monitor-label">{{ getTranslatedText('INITIATIVES_DASHBOARD.OWNER') }}: {{ activeProjects[monitorProjectIndex!].owner }}</div>
              <div class="monitor-label">{{ getTranslatedText('INITIATIVES_DASHBOARD.PROGRESS') }}:</div>
              <div class="monitor-progress">
                <div class="monitor-bar" [style.width.%]="getMonitorProgress(monitorProjectIndex!)">{{ getMonitorProgress(monitorProjectIndex!) }}%</div>
              </div>
              <div class="modal-actions">
                <button type="button" (click)="closeMonitorProject()">{{ getTranslatedText('INITIATIVES_DASHBOARD.CLOSE') }}</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .initiatives-dashboard-root {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .initiatives-sidebar {
      width: 260px;
      background: #fff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
    }

    .initiatives-sidebar.collapsed {
      width: 70px;
    }

    .initiatives-sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .initiatives-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .initiatives-logo-icon {
      font-size: 1.5rem;
    }

    .initiatives-logo-text {
      font-weight: 600;
      color: #2563eb;
    }

    .initiatives-nav {
      flex: 1;
      padding: 1rem 0;
    }

    .initiatives-nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .initiatives-nav-item:hover,
    .initiatives-nav-item.active {
      background: #f1f5f9;
      color: #2563eb;
    }

    .initiatives-sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .initiatives-sidebar-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 0.5rem;
    }

    .initiatives-sidebar-btn:hover {
      background: #f1f5f9;
      color: #2563eb;
    }

    .initiatives-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .initiatives-header {
      margin-bottom: 2rem;
    }

    .initiatives-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .initiatives-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .initiatives-subtitle {
      color: #64748b;
      margin: 0;
    }

    .initiatives-last-updated {
      color: #64748b;
      font-size: 0.875rem;
    }

    .initiatives-section {
      margin-bottom: 2rem;
    }

    .initiatives-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 1rem;
    }

    .initiatives-table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .initiatives-table th,
    .initiatives-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .initiatives-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .initiatives-table button {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
      transition: background 0.2s ease;
    }

    .initiatives-table button:hover {
      background: #1d4ed8;
    }

    .proposal-form {
      margin-bottom: 1rem;
    }

    .proposal-form input,
    .proposal-form textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .proposal-form button {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .proposal-form button:hover {
      background: #1d4ed8;
    }

    .milestone-progress {
      width: 100%;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5rem 0;
    }

    .milestone-bar {
      height: 20px;
      background: #2563eb;
      color: #fff;
      text-align: center;
      line-height: 20px;
      font-size: 0.75rem;
      transition: width 0.3s ease;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: #fff;
      border-radius: 8px;
      padding: 2rem;
      min-width: 400px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal.dark-mode {
      background: #1f2937;
      color: #f9fafb;
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
    }

    .modal h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .modal label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .modal input,
    .modal select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .modal-actions button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .modal-actions button[type="submit"] {
      background: #2563eb;
      color: #fff;
    }

    .modal-actions button[type="button"] {
      background: #6b7280;
      color: #fff;
    }

    .monitor-section {
      margin-top: 1rem;
    }

    .monitor-label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .monitor-progress {
      width: 100%;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5rem 0;
    }

    .monitor-bar {
      height: 20px;
      background: #2563eb;
      color: #fff;
      text-align: center;
      line-height: 20px;
      font-size: 0.75rem;
    }

    /* RTL Support */
    .initiatives-dashboard-root.rtl {
      direction: rtl;
    }

    .initiatives-dashboard-root.rtl .initiatives-sidebar {
      border-right: none;
      border-left: 1px solid #e2e8f0;
    }

    .initiatives-dashboard-root.rtl .initiatives-nav-item {
      text-align: right;
    }

    .initiatives-dashboard-root.rtl .initiatives-table th,
    .initiatives-dashboard-root.rtl .initiatives-table td {
      text-align: right;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .initiatives-sidebar {
        width: 70px;
      }

      .initiatives-main {
        padding: 1rem;
      }

      .initiatives-header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .initiatives-table {
        font-size: 0.875rem;
      }
    }
  `]
})

export class InitiativesDashboardComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  constructor(
    private router: Router, 
    private translationService: InitiativesDashboardTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Initiatives Dashboard language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Initiatives Dashboard translations not loaded yet');
      }
    }, 1000);
  }
  
  ngOnInit() {
    // Theme subscription removed as darkMode$ doesn't exist in this service
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

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }
  
  logout() { 
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }
  
  toggleDarkMode() { 
    // Toggle dark mode functionality removed as toggleDarkMode doesn't exist in this service
  }

  activeProjects = [
    { name: 'Renewable Energy Adoption', status: 'Ongoing', owner: 'Alice', progress: 60 },
    { name: 'Reforestation Program', status: 'Ongoing', owner: 'Bob', progress: 40 },
  ];

  // Edit Project Modal State
  editProjectIndex: number | null = null;
  editProjectData = { name: '', status: '', owner: '', progress: 0 };

  openEditProject(i: number) {
    this.editProjectIndex = i;
    this.editProjectData = { ...this.activeProjects[i] };
  }
  closeEditProject() {
    this.editProjectIndex = null;
  }
  saveEditProject() {
    if (this.editProjectIndex !== null) {
      this.activeProjects[this.editProjectIndex] = { ...this.editProjectData };
      this.closeEditProject();
    }
  }

  // Monitor Project Modal State
  monitorProjectIndex: number | null = null;
  openMonitorProject(i: number) {
    this.monitorProjectIndex = i;
  }
  closeMonitorProject() {
    this.monitorProjectIndex = null;
  }
  getMonitorProgress(i: number) {
    return this.activeProjects[i].progress || 0;
  }

  proposals = [
    { title: 'Solar Panel Expansion', description: 'Expand solar panel installation to new sites.', status: 'Pending' },
    { title: 'Water Conservation', description: 'Implement water-saving technologies.', status: 'Approved' },
  ];

  newProposal = { title: '', description: '', status: 'Pending' };

  budgets = [
    { project: 'Renewable Energy Adoption', budget: 100000, spent: 45000, impact: 'Reduce CO₂ by 20%' },
    { project: 'Reforestation Program', budget: 50000, spent: 12000, impact: 'Plant 10,000 trees' },
  ];

  milestones = [
    { name: 'Net Zero Target', progress: 60, targetDate: '2030-12-31' },
    { name: '50% Renewable Energy', progress: 40, targetDate: '2027-06-30' },
  ];

  submitProposal() {
    if (this.newProposal.title && this.newProposal.description) {
      this.proposals.push({ ...this.newProposal });
      this.newProposal = { title: '', description: '', status: 'Pending' };
    }
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