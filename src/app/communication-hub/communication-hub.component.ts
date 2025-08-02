import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { CommunicationHubTranslationService } from '../services/communication-hub-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-communication-hub',
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
      
      /* RTL support */
      .edash-root.rtl {
        direction: rtl;
      }
      
      .edash-root.rtl .edash-sidenav {
        border-right: none;
        border-left: 1px solid #ececec;
      }
      
      .edash-root.rtl .edash-main {
        margin-left: 0;
        margin-right: 260px;
      }
      
      .edash-root.rtl .edash-nav-actions {
        flex-direction: row-reverse;
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
      /* Remove old navigation action styles as they're now handled by edash-nav-actions */
      /* Communication Hub specific dark mode styles */
      .edash-main.dark-mode .comm-main-content {
        background: #0f172a;
        color: #e0e0e0;
      }
      .edash-main.dark-mode .comm-header {
        color: #e0e0e0;
      }
      .edash-main.dark-mode .comm-section h2 {
        color: #7eaaff;
      }
      .edash-main.dark-mode .comm-section {
        background: #1e293b;
        border: 1px solid #334155;
      }
      .edash-main.dark-mode .comm-input {
        background: #1e293b;
        color: #e0e0e0;
        border: 1px solid #334155;
      }
      .edash-main.dark-mode .comm-btn {
        background: #2563eb;
        color: #e0e0e0;
      }
      .edash-main.dark-mode .comm-btn:hover {
        background: #1d4ed8;
      }
      .edash-main.dark-mode .comm-news-item,
      .edash-main.dark-mode .comm-msg-item,
      .edash-main.dark-mode .comm-doc-item,
      .edash-main.dark-mode .comm-calendar-item,
      .edash-main.dark-mode .comm-contact-item,
      .edash-main.dark-mode .comm-risk-item {
        background: #334155;
        color: #e0e0e0;
        border: 1px solid #475569;
      }
      .edash-main.dark-mode .comm-search-input {
        background: #1e293b;
        color: #e0e0e0;
        border: 1px solid #334155;
      }
      .edash-main.dark-mode .comm-msg-user {
        color: #7eaaff;
      }
      .edash-main.dark-mode .comm-doc-link {
        color: #7eaaff;
      }
      .edash-main.dark-mode .comm-doc-link:hover {
        color: #93c5fd;
      }
      .comm-main-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 6px 32px rgba(0,0,0,0.07);
        color: #222;
      }
      .comm-header {
        font-size: 2rem;
        font-weight: 700;
        color: #2563eb;
        margin-bottom: 2rem;
      }
      .comm-section {
        margin-bottom: 2.5rem;
      }
      .comm-section h2 {
        font-size: 1.3rem;
        font-weight: 600;
        color: #2563eb;
        margin-bottom: 1rem;
      }
      .comm-table, .comm-table th, .comm-table td {
        border: 1px solid #ececec;
        border-collapse: collapse;
      }
      .comm-table {
        width: 100%;
        margin-bottom: 1rem;
      }
      .comm-table th, .comm-table td {
        padding: 0.75rem 1rem;
        text-align: left;
      }
      .comm-table th {
        background: #f3f4f6;
      }
      .heatmap {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .heatmap-cell {
        width: 120px;
        height: 80px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #fff;
        font-size: 1rem;
      }
      .heatmap-low { background: #22c55e; }
      .heatmap-medium { background: #facc15; color: #222; }
      .heatmap-high { background: #ef4444; }
      @media (max-width: 900px) {
        .comm-main-content {
          padding: 0.5rem;
        }
      }
      .comm-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .comm-btn {
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
      .comm-btn:hover {
        background: #1746a2;
      }
      .comm-input, .comm-textarea {
        width: 100%;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
      .comm-textarea { min-height: 60px; }
      .comm-news-list, .comm-msg-list, .comm-doc-list, .comm-calendar-list, .comm-contact-list, .comm-audit-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem 0;
      }
      .comm-news-item, .comm-msg-item, .comm-doc-item, .comm-calendar-item, .comm-contact-item, .comm-audit-item {
        background: #f3f4f6;
        margin-bottom: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .comm-news-title { font-weight: 600; }
      .comm-msg-user { font-weight: 600; color: #2563eb; margin-right: 0.5rem; }
      .comm-doc-link { color: #2563eb; text-decoration: underline; cursor: pointer; }
      .comm-calendar-date { font-weight: 600; margin-right: 0.5rem; }
      .comm-contact-email, .comm-contact-phone { margin-left: 0.5rem; color: #2563eb; text-decoration: underline; cursor: pointer; }
      .comm-heatmap-cell.selected { outline: 2px solid #2563eb; }
      .comm-search-bar { margin-bottom: 1rem; }
      .comm-search-input { width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid #ccc; }
    </style>
    <div class="edash-root" [class.dark-mode]="darkMode" [class.rtl]="isRTL">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">Sustainability Head</span>
        </div>
        <nav class="edash-nav">
          <a routerLink="/environmental-dashboard" class="edash-nav-link" data-title="Sustainability Head">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">Sustainability Head</span>
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
          
          <a routerLink="/training" class="edash-nav-link" data-title="Training & Development">
            <span class="edash-nav-icon">🎓</span>
            <span *ngIf="!sidebarCollapsed">Training & Development</span>
          </a>
          <a routerLink="/stakeholder-engagement" routerLinkActive="active" class="edash-nav-link" data-title="Stakeholder Engagement">
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
          <a routerLink="/calendar" class="edash-nav-link" data-title="Calendar & Events">
            <span class="edash-nav-icon">📅</span>
            <span *ngIf="!sidebarCollapsed">Calendar & Events</span>
          </a>
          <div class="edash-nav-actions">
            <app-unified-language-toggle></app-unified-language-toggle>
            <button class="edash-logout" (click)="logout()" aria-label="Logout" data-title="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('COMMUNICATION_HUB.LOGOUT') }}</span>
            </button>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav" data-title="Collapse">
              <span class="icon">⬅️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('COMMUNICATION_HUB.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode" data-title="Light Mode">
              <span class="icon">☀️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('COMMUNICATION_HUB.LIGHT_MODE') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="comm-main-content">
          <div class="comm-header">Communication Hub</div>

          <!-- Search and Filter -->
          <div class="comm-search-bar">
            <input class="comm-search-input" [(ngModel)]="searchTerm" placeholder="Search announcements, docs, messages..." />
          </div>

          <!-- Announcements/News Feed -->
          <div class="comm-section">
            <div class="comm-section-header">
              <h2>Announcements & News</h2>
              <button class="comm-btn" (click)="addAnnouncement()">Add</button>
            </div>
            <input class="comm-input" [(ngModel)]="newAnnouncement" placeholder="New announcement..." />
            <ul class="comm-news-list">
              <li *ngFor="let ann of filteredAnnouncements(); let i = index" class="comm-news-item">
                <span class="comm-news-title">{{ ann }}</span>
                <button class="comm-btn" (click)="deleteAnnouncement(i)">Delete</button>
              </li>
            </ul>
          </div>

          <!-- Message Center -->
          <div class="comm-section">
            <div class="comm-section-header">
              <h2>Message Center</h2>
              <span *ngIf="unreadCount > 0" style="color:#ef4444;font-weight:600">{{ unreadCount }} unread</span>
            </div>
            <input class="comm-input" [(ngModel)]="newMessage" placeholder="Type a message..." (keyup.enter)="sendMessage()" />
            <ul class="comm-msg-list">
              <li *ngFor="let msg of filteredMessages(); let i = index" class="comm-msg-item">
                <span><span class="comm-msg-user">{{ msg.user }}:</span> {{ msg.text }}</span>
                <button class="comm-btn" (click)="markRead(i)" *ngIf="!msg.read">Mark Read</button>
              </li>
            </ul>
          </div>

          <!-- Document Sharing -->
          <div class="comm-section">
            <div class="comm-section-header">
              <h2>Document Sharing</h2>
              <button class="comm-btn" (click)="addDocument()">Upload</button>
            </div>
            <input class="comm-input" [(ngModel)]="newDocName" placeholder="Document name..." />
            <ul class="comm-doc-list">
              <li *ngFor="let doc of filteredDocs(); let i = index" class="comm-doc-item">
                <span>{{ doc.name }}</span>
                <span>
                  <span class="comm-doc-link" (click)="downloadDoc(doc)">Download</span>
                  <button class="comm-btn" (click)="deleteDoc(i)">Delete</button>
                </span>
              </li>
            </ul>
          </div>

          <!-- Compliance Calendar -->
          <div class="comm-section">
            <div class="comm-section-header">
              <h2>Compliance Calendar</h2>
              <button class="comm-btn" (click)="addCalendarEvent()">Add Event</button>
            </div>
            <input class="comm-input" [(ngModel)]="newCalendarEvent" placeholder="Event (e.g. Audit, Deadline)..." />
            <input class="comm-input" [(ngModel)]="newCalendarDate" type="date" />
            <ul class="comm-calendar-list">
              <li *ngFor="let ev of filteredCalendar(); let i = index" class="comm-calendar-item">
                <span class="comm-calendar-date">{{ ev.date }}</span> {{ ev.event }}
                <button class="comm-btn" (click)="deleteCalendarEvent(i)">Delete</button>
              </li>
            </ul>
          </div>

          <!-- Contact Directory -->
          <div class="comm-section">
            <div class="comm-section-header">
              <h2>Contact Directory</h2>
              <button class="comm-btn" (click)="addContact()">Add</button>
            </div>
            <input class="comm-input" [(ngModel)]="newContactName" placeholder="Name..." />
            <input class="comm-input" [(ngModel)]="newContactEmail" placeholder="Email..." />
            <input class="comm-input" [(ngModel)]="newContactPhone" placeholder="Phone..." />
            <ul class="comm-contact-list">
              <li *ngFor="let c of filteredContacts(); let i = index" class="comm-contact-item">
                <span>{{ c.name }}</span>
                <a class="comm-contact-email" [href]="'mailto:' + c.email">{{ c.email }}</a>
                <a class="comm-contact-phone" [href]="'tel:' + c.phone">{{ c.phone }}</a>
                <button class="comm-btn" (click)="deleteContact(i)">Delete</button>
              </li>
            </ul>
          </div>

          <!-- Interactive Risk Heatmap -->
          <div class="comm-section">
            <div class="comm-section-header">
              <h2>Risk Heatmap</h2>
              <button class="comm-btn" (click)="addRisk()">Add Risk</button>
            </div>
            <input class="comm-input" [(ngModel)]="newRiskName" placeholder="Risk name..." />
            <select class="comm-input" [(ngModel)]="newRiskLevel">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div class="heatmap">
              <div *ngFor="let risk of risks; let i = index" class="heatmap-cell heatmap-{{ risk.level }}" [class.selected]="selectedRisk === i" (click)="selectRisk(i)">
                {{ risk.name }}<br/>{{ risk.level | titlecase }}
                <button class="comm-btn" (click)="deleteRisk(i); $event.stopPropagation();">Delete</button>
              </div>
            </div>
            <div *ngIf="selectedRisk !== null" style="margin-top:1rem;">
              <b>Selected Risk:</b> {{ risks[selectedRisk].name }} ({{ risks[selectedRisk].level | titlecase }})
              <button class="comm-btn" (click)="selectedRisk = null">Deselect</button>
            </div>
          </div>

          <!-- Audit Trail -->
          <div class="comm-section">
            <div class="comm-section-header">
              <h2>Audit Trail</h2>
            </div>
            <ul class="comm-audit-list">
              <li *ngFor="let log of filteredAuditTrail()" class="comm-audit-item">{{ log }}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  `,
})

export class CommunicationHubComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: CommunicationHubTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Communication Hub language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Communication Hub translations not loaded yet');
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

  // Announcements/News Feed
  announcements: string[] = ['Welcome to the ESG Communication Hub!', 'Q2 Compliance Report Released'];
  newAnnouncement = '';
  addAnnouncement() {
    if (this.newAnnouncement.trim()) {
      this.announcements.unshift(this.newAnnouncement.trim());
      this.auditTrail.unshift('Announcement added: ' + this.newAnnouncement.trim());
      this.newAnnouncement = '';
    }
  }
  deleteAnnouncement(i: number) {
    this.auditTrail.unshift('Announcement deleted: ' + this.announcements[i]);
    this.announcements.splice(i, 1);
  }
  filteredAnnouncements() {
    return this.announcements.filter(a => a.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Message Center
  messages: { user: string; text: string; read: boolean }[] = [
    { user: 'Alice', text: 'Please review the new compliance policy.', read: false },
    { user: 'Bob', text: 'Audit scheduled for next week.', read: true },
  ];
  newMessage = '';
  unreadCount = 1;
  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.unshift({ user: 'You', text: this.newMessage.trim(), read: false });
      this.auditTrail.unshift('Message sent: ' + this.newMessage.trim());
      this.newMessage = '';
      this.unreadCount++;
    }
  }
  markRead(i: number) {
    this.messages[i].read = true;
    this.unreadCount = this.messages.filter(m => !m.read).length;
    this.auditTrail.unshift('Message marked as read: ' + this.messages[i].text);
  }
  filteredMessages() {
    return this.messages.filter(m => m.text.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Document Sharing
  docs: { name: string }[] = [
    { name: 'GRI Compliance.pdf' },
    { name: 'Audit2024.xlsx' },
  ];
  newDocName = '';
  addDocument() {
    if (this.newDocName.trim()) {
      this.docs.unshift({ name: this.newDocName.trim() });
      this.auditTrail.unshift('Document uploaded: ' + this.newDocName.trim());
      this.newDocName = '';
    }
  }
  deleteDoc(i: number) {
    this.auditTrail.unshift('Document deleted: ' + this.docs[i].name);
    this.docs.splice(i, 1);
  }
  downloadDoc(doc: { name: string }) {
    alert('Download: ' + doc.name);
    this.auditTrail.unshift('Document downloaded: ' + doc.name);
  }
  filteredDocs() {
    return this.docs.filter(d => d.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Compliance Calendar
  calendar: { event: string; date: string }[] = [
    { event: 'GRI Audit', date: '2024-06-15' },
    { event: 'CSRD Deadline', date: '2024-07-01' },
  ];
  newCalendarEvent = '';
  newCalendarDate = '';
  addCalendarEvent() {
    if (this.newCalendarEvent.trim() && this.newCalendarDate) {
      this.calendar.unshift({ event: this.newCalendarEvent.trim(), date: this.newCalendarDate });
      this.auditTrail.unshift('Calendar event added: ' + this.newCalendarEvent.trim() + ' on ' + this.newCalendarDate);
      this.newCalendarEvent = '';
      this.newCalendarDate = '';
    }
  }
  deleteCalendarEvent(i: number) {
    this.auditTrail.unshift('Calendar event deleted: ' + this.calendar[i].event);
    this.calendar.splice(i, 1);
  }
  filteredCalendar() {
    return this.calendar.filter(ev => ev.event.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Contact Directory
  contacts: { name: string; email: string; phone: string }[] = [
    { name: 'Compliance Officer', email: 'compliance@company.com', phone: '123-456-7890' },
    { name: 'Lead Auditor', email: 'auditor@company.com', phone: '987-654-3210' },
  ];
  newContactName = '';
  newContactEmail = '';
  newContactPhone = '';
  addContact() {
    if (this.newContactName.trim() && this.newContactEmail.trim() && this.newContactPhone.trim()) {
      this.contacts.unshift({ name: this.newContactName.trim(), email: this.newContactEmail.trim(), phone: this.newContactPhone.trim() });
      this.auditTrail.unshift('Contact added: ' + this.newContactName.trim());
      this.newContactName = '';
      this.newContactEmail = '';
      this.newContactPhone = '';
    }
  }
  deleteContact(i: number) {
    this.auditTrail.unshift('Contact deleted: ' + this.contacts[i].name);
    this.contacts.splice(i, 1);
  }
  filteredContacts() {
    return this.contacts.filter(c => c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || c.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Interactive Risk Heatmap
  risks: { name: string; level: 'high' | 'medium' | 'low' }[] = [
    { name: 'Climate Risk', level: 'high' },
    { name: 'Social Unrest', level: 'medium' },
    { name: 'Regulatory', level: 'low' },
    { name: 'Supply Chain', level: 'medium' },
    { name: 'Reputation', level: 'low' },
  ];
  newRiskName = '';
  newRiskLevel: 'high' | 'medium' | 'low' = 'high';
  selectedRisk: number | null = null;
  addRisk() {
    if (this.newRiskName.trim()) {
      this.risks.unshift({ name: this.newRiskName.trim(), level: this.newRiskLevel });
      this.auditTrail.unshift('Risk added: ' + this.newRiskName.trim() + ' (' + this.newRiskLevel + ')');
      this.newRiskName = '';
      this.newRiskLevel = 'high';
    }
  }
  deleteRisk(i: number) {
    this.auditTrail.unshift('Risk deleted: ' + this.risks[i].name);
    this.risks.splice(i, 1);
    if (this.selectedRisk === i) this.selectedRisk = null;
  }
  selectRisk(i: number) {
    this.selectedRisk = i;
  }

  // Audit Trail
  auditTrail: string[] = [
    'User logged in',
    'Initial data loaded',
  ];
  filteredAuditTrail() {
    return this.auditTrail.filter(a => a.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Search
  searchTerm = '';

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