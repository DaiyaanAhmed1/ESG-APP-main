import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GovernanceLeadTranslationService } from '../services/governance-lead-translation.service';
import { GovernanceLeadSidebarLanguageToggleComponent } from '../components/governance-lead-sidebar-language-toggle/governance-lead-sidebar-language-toggle.component';


@Component({
  selector: 'app-governance',

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GovernanceLeadSidebarLanguageToggleComponent
  ],
  template: `
  <style>
    .governance-dashboard {
      min-height: 100vh;
      background: #fff;
      color: #222;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: row;
      padding-left: 280px;
      transition: padding-left 0.3s;
    }
    .governance-dashboard .gdash-sidenav.collapsed ~ .gov-content {
      padding-left: 70px;
    }
    @media (max-width: 900px) {
      .governance-dashboard {
        padding-left: 70px;
      }
      .gdash-sidenav {
        width: 70px;
      }
    }
    .gov-content {
      flex: 1;
      background: #fafbfc;
      min-height: 100vh;
      padding-top: 0;
      transition: margin-left 0.3s;
    }
    .gov-main {
      padding: 2.5rem 2rem 2rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      .gov-main { padding: 1rem; }
    }
    .gov-section {
      background: #f7f8fa;
      border-radius: 18px;
      padding: 2.5rem 2rem;
      margin-bottom: 2.5rem;
      box-shadow: 0 6px 32px rgba(0,0,0,0.07);
      border: 1px solid #ececec;
      animation: fadeInUp 0.6s ease-out;
    }
    @media (max-width: 768px) {
      .gov-section { padding: 1.5rem; }
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }
    .section-header h2 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #222;
    }
    @media (max-width: 768px) {
      .section-header h2 { font-size: 1.5rem; }
    }
    .section-header button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }
    .section-header .refresh-btn { background: #2563eb; color: #fff; }
    .section-header .add-btn { background: #059669; color: #fff; }
    .section-header .alert-btn { background: #dc3545; color: #fff; }
    .section-header .export-btn { background: #a21caf; color: #fff; }
    .section-header .security-btn { background: #6f42c1; color: #fff; }
    .section-header .shariah-btn { background: #fd7e14; color: #fff; }
    .section-header button:hover { opacity: 0.9; }
    .board-card, .compensation-card, .risk-card, .policy-card, .audit-card, .security-card, .shariah-card {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      padding: 1.5rem 1.25rem;
      margin-bottom: 1.5rem;
      border: 1px solid #ececec;
    }
    .gdash-overview .gdash-stats-row .gdash-stat-card {
      background: #f3f4f6;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 1.25rem 1rem;
      margin-bottom: 0;
      border: 1px solid #ececec;
      align-items: flex-start;
    }
    .board-grid, .compensation-grid, .risk-grid, .audit-grid, .security-grid, .shariah-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 1200px) {
      .board-grid, .compensation-grid, .risk-grid, .audit-grid, .security-grid, .shariah-grid {
        grid-template-columns: 1fr;
      }
    }
    .policy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .gdash-sidenav {
      z-index: 1000;
      background: #fff;
      border-right: 1px solid #ececec;
      box-shadow: 2px 0 8px rgba(0,0,0,0.03);
    }
    .gdash-sidenav .gdash-sidenav-header {
      padding: 1.5rem 1rem 1rem 1rem;
    }
    .gdash-sidenav .gdash-nav-link.active {
      background: #e6f0ff;
      color: #2563eb;
      border-right: 3px solid #2563eb;
    }
    .gdash-sidenav .gdash-nav-link:hover {
      background: #f3f4f6;
      color: #2563eb;
    }
    .gov-section .board-card, .gov-section .compensation-card, .gov-section .risk-card, .gov-section .policy-card, .gov-section .audit-card, .gov-section .security-card, .gov-section .shariah-card {
      border: none;
    }
    @media (max-width: 900px) {
      .governance-dashboard {
        flex-direction: column;
        padding-left: 0;
      }
      .gdash-sidenav {
        position: static;
        width: 100%;
        height: auto;
        border-right: none;
        box-shadow: none;
      }
      .gov-content {
        margin-left: 0;
        padding-left: 0;
      }
    }
  </style>
  <div class="governance-dashboard" [class.dark-mode]="darkMode">
  <div class="gdash-overview">
    <div class="gdash-header-row">
      <div>
        <h2>G. Dashboard Overview</h2>
        <p>Welcome back, Head of Marketing Operations</p>
      </div>
      <div class="gdash-actions">
        <button class="gdash-btn gdash-btn-primary">New Campaign Launch</button>
        <button class="gdash-btn gdash-btn-secondary">Export Report</button>
      </div>
    </div>
    <div class="gdash-stats-row">
      <div class="gdash-stat-card gdash-stat-blue">
        <span class="gdash-stat-icon">🎯</span>
        <span class="gdash-stat-value">2240</span>
        <span class="gdash-stat-label">Incidents due to No Code of Ethics</span>
      </div>
      <div class="gdash-stat-card gdash-stat-green">
          <span class="gdash-stat-icon">��</span>
        <span class="gdash-stat-value">32%</span>
        <span class="gdash-stat-label">Board Diversity (%) Gender, age, nationality representation</span>
      </div>
      <div class="gdash-stat-card gdash-stat-purple">
        <span class="gdash-stat-icon">📢</span>
        <span class="gdash-stat-value">108</span>
        <span class="gdash-stat-label">Cybersecurity Incidents</span>
      </div>
      <div class="gdash-stat-card gdash-stat-yellow">
        <span class="gdash-stat-icon">👥</span>
        <span class="gdash-stat-value">65</span>
        <span class="gdash-stat-label">Anti-corruption Training Coverage (%)</span>
      </div>
      <div class="gdash-stat-card gdash-stat-pink">
        <span class="gdash-stat-icon">💰</span>
        <span class="gdash-stat-value">85%</span>
        <span class="gdash-stat-label">ROI</span>
      </div>
    </div>
  </div>
  <!-- Side Navigation -->
  <aside class="gdash-sidenav" [class.collapsed]="sidebarCollapsed">
    <div class="gdash-sidenav-header">
      <div class="gdash-logo">MARLN</div>
      <div class="gdash-user-title">Governance Lead</div>
    </div>
    <nav class="gdash-nav">
      <a routerLink="/environmental-dashboard" class="gdash-nav-link"><span class="gdash-nav-icon">🌱</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.ENVIRONMENTAL_DASHBOARD') }}</span></a>
      <a routerLink="/social-dashboard" class="gdash-nav-link"><span class="gdash-nav-icon">🤝</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.SOCIAL_DASHBOARD') }}</span></a>
      <a routerLink="/governance" class="gdash-nav-link active"><span class="gdash-nav-icon">🏛️</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.GOVERNANCE_DASHBOARD') }}</span></a>
      <a routerLink="/materiality" class="gdash-nav-link"><span class="gdash-nav-icon">📊</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.MATERIALITY_ASSESSMENT') }}</span></a>
      <a routerLink="/team" class="gdash-nav-link"><span class="gdash-nav-icon">👥</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.MANAGE_TEAM') }}</span></a>
      <a routerLink="/initiatives" class="gdash-nav-link"><span class="gdash-nav-icon">📣</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.ESG_INITIATIVE') }}</span></a>
      <a routerLink="/reporting" class="gdash-nav-link"><span class="gdash-nav-icon">📈</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.REPORTING_ANALYSIS') }}</span></a>
      <a routerLink="/communication" class="gdash-nav-link"><span class="gdash-nav-icon">💬</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.COMMUNICATION_HUB') }}</span></a>
      <a routerLink="/training" class="gdash-nav-link"><span class="gdash-nav-icon">🎓</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.TRAINING_DEVELOPMENT') }}</span></a>
      <a routerLink="/workspace" class="gdash-nav-link"><span class="gdash-nav-icon">📁</span><span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.WORKSPACE') }}</span></a>
    </nav>
    <div class="gdash-sidenav-footer">
      <app-governance-lead-sidebar-language-toggle></app-governance-lead-sidebar-language-toggle>
      <button class="gdash-sidenav-toggle" (click)="sidebarCollapsed = !sidebarCollapsed">{{ sidebarCollapsed ? '→' : '←' }}</button>
      <button class="gdash-dark-toggle" (click)="toggleDarkMode()">{{ darkMode ? '☀️' : '🌙' }}<span *ngIf="!sidebarCollapsed"> {{ darkMode ? getTranslatedText('NAVIGATION.LIGHT_MODE') : getTranslatedText('NAVIGATION.DARK_MODE') }}</span></button>
      <button class="gdash-logout" *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LOGOUT') }}</button>
    </div>
  </aside>
  <!-- Main Content -->
  <div class="gov-content">
    <main class="gov-main">
    <!-- Board Composition & Independence Analysis -->
    <section class="gov-section board-section">
      <div class="section-header">
        <h2>👥 {{ getTranslatedText('GOVERNANCE_LEAD.BOARD_COMPOSITION') }}</h2>
        <button class="refresh-btn" (click)="refreshBoardData()">🔄 Refresh</button>
      </div>
      <div class="board-grid">
        <div class="board-card">
          <h3>{{ getTranslatedText('METRICS.BOARD_DIVERSITY_TITLE') }}</h3>
          <div class="diversity-chart">
            <div class="chart-item">
              <span class="chart-label">{{ getTranslatedText('METRICS.GENDER') }}</span>
              <div class="chart-bar">
                <div class="bar-fill" [style.width.%]="60"></div>
              </div>
              <span class="chart-value">60% Female</span>
            </div>
            <div class="chart-item">
              <span class="chart-label">{{ getTranslatedText('METRICS.AGE_RANGE') }}</span>
              <div class="chart-bar">
                <div class="bar-fill" [style.width.%]="75"></div>
              </div>
              <span class="chart-value">35-65 years</span>
            </div>
            <div class="chart-item">
              <span class="chart-label">{{ getTranslatedText('METRICS.INDEPENDENCE') }}</span>
              <div class="chart-bar">
                <div class="bar-fill" [style.width.%]="85"></div>
              </div>
              <span class="chart-value">85% Independent</span>
            </div>
          </div>
        </div>
        <div class="board-card">
          <h3>{{ getTranslatedText('METRICS.BOARD_MEMBERS') }}</h3>
          <div class="board-members">
            <div class="member-item" *ngFor="let member of boardMembers">
              <div class="member-avatar">{{member.avatar}}</div>
              <div class="member-info">
                <div class="member-name">{{member.name}}</div>
                <div class="member-role">{{member.role}}</div>
                <div class="member-status" [class]="member.status">{{member.status}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Executive Compensation Tracking -->
    <section class="gov-section compensation-section">
      <div class="section-header">
        <h2>💰 {{ getTranslatedText('GOVERNANCE_LEAD.EXECUTIVE_COMPENSATION') }}</h2>
        <button class="add-btn" (click)="addCompensation()">➕ Add</button>
      </div>
      <div class="compensation-grid">
        <div class="compensation-card">
          <h3>{{ getTranslatedText('METRICS.CEO_COMPENSATION') }}</h3>
          <div class="comp-details">
            <div class="comp-item">
              <span class="comp-label">{{ getTranslatedText('METRICS.BASE_SALARY') }}</span>
              <span class="comp-value">$850,000</span>
            </div>
            <div class="comp-item">
              <span class="comp-label">{{ getTranslatedText('METRICS.PERFORMANCE_BONUS') }}</span>
              <span class="comp-value">$425,000</span>
            </div>
            <div class="comp-item">
              <span class="comp-label">{{ getTranslatedText('METRICS.ESG_LINKED_BONUS') }}</span>
              <span class="comp-value">$127,500</span>
            </div>
            <div class="comp-item total">
              <span class="comp-label">{{ getTranslatedText('METRICS.TOTAL') }}</span>
              <span class="comp-value">$1,402,500</span>
            </div>
          </div>
        </div>
        <div class="compensation-card">
          <h3>ESG Performance Metrics</h3>
          <div class="esg-metrics">
            <div class="metric-item">
              <span class="metric-label">Carbon Reduction</span>
              <div class="metric-progress">
                <div class="progress-fill" [style.width.%]="85"></div>
              </div>
              <span class="metric-value">85%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Diversity Target</span>
              <div class="metric-progress">
                <div class="progress-fill" [style.width.%]="70"></div>
              </div>
              <span class="metric-value">70%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Compliance Score</span>
              <div class="metric-progress">
                <div class="progress-fill" [style.width.%]="98"></div>
              </div>
              <span class="metric-value">98%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Anti-Corruption & Risk Management -->
    <section class="gov-section risk-section">
      <div class="section-header">
        <h2>🛡️ Anti-Corruption & Risk Management</h2>
        <button class="alert-btn" (click)="showRiskAlerts()">🚨 Alerts</button>
      </div>
      <div class="risk-grid">
        <div class="risk-card">
          <h3>Risk Assessment</h3>
          <div class="risk-matrix">
            <div class="risk-item high" *ngFor="let risk of highRisks">
              <div class="risk-header">
                <span class="risk-title">{{risk.title}}</span>
                <span class="risk-level">{{risk.level}}</span>
              </div>
              <p class="risk-desc">{{risk.description}}</p>
              <div class="risk-actions">
                <button class="action-btn">Mitigate</button>
                <button class="action-btn">Monitor</button>
              </div>
            </div>
          </div>
        </div>
        <div class="risk-card">
          <h3>Anti-Corruption Measures</h3>
          <div class="corruption-measures">
            <div class="measure-item" *ngFor="let measure of antiCorruptionMeasures">
              <div class="measure-icon">{{measure.icon}}</div>
              <div class="measure-info">
                <div class="measure-title">{{measure.title}}</div>
                <div class="measure-status" [class]="measure.status">{{measure.status}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Policy Management -->
    <section class="gov-section policy-section">
      <div class="section-header">
        <h2>📋 Policy Management</h2>
        <button class="add-btn" (click)="addPolicy()">➕ New Policy</button>
      </div>
      <div class="policy-grid">
        <div class="policy-card" *ngFor="let policy of policies">
          <div class="policy-header">
            <h3>{{policy.title}}</h3>
            <span class="policy-status" [class]="policy.status">{{policy.status}}</span>
          </div>
          <p class="policy-desc">{{policy.description}}</p>
          <div class="policy-meta">
            <span class="meta-item">📅 {{policy.lastUpdated}}</span>
            <span class="meta-item">👤 {{policy.owner}}</span>
            <span class="meta-item">📄 {{policy.version}}</span>
          </div>
          <div class="policy-actions">
            <button class="action-btn">View</button>
            <button class="action-btn">Edit</button>
            <button class="action-btn">Archive</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Audit Trail & Documentation -->
    <section class="gov-section audit-section">
      <div class="section-header">
        <h2>📚 Audit Trail & Documentation Archive</h2>
        <button class="export-btn" (click)="exportAuditTrail()">📤 Export</button>
      </div>
      <div class="audit-grid">
        <div class="audit-card">
          <h3>Recent Activities</h3>
          <div class="audit-timeline">
            <div class="timeline-item" *ngFor="let activity of auditActivities">
              <div class="timeline-icon">{{activity.icon}}</div>
              <div class="timeline-content">
                <div class="timeline-title">{{activity.title}}</div>
                <div class="timeline-desc">{{activity.description}}</div>
                <div class="timeline-meta">
                  <span class="meta-time">{{activity.time}}</span>
                  <span class="meta-user">{{activity.user}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="audit-card">
          <h3>Document Archive</h3>
          <div class="document-list">
            <div class="doc-item" *ngFor="let doc of documents">
              <div class="doc-icon">{{doc.icon}}</div>
              <div class="doc-info">
                <div class="doc-title">{{doc.title}}</div>
                <div class="doc-meta">
                  <span class="doc-size">{{doc.size}}</span>
                  <span class="doc-date">{{doc.date}}</span>
                </div>
              </div>
              <button class="doc-action">📥</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Data Privacy & Cybersecurity -->
    <section class="gov-section security-section">
      <div class="section-header">
        <h2>🔒 Data Privacy & Cybersecurity Controls</h2>
        <button class="security-btn" (click)="runSecurityScan()">🔍 Scan</button>
      </div>
      <div class="security-grid">
        <div class="security-card">
          <h3>Privacy Controls</h3>
          <div class="privacy-controls">
            <div class="control-item" *ngFor="let control of privacyControls">
              <div class="control-header">
                <span class="control-title">{{control.title}}</span>
                <span class="control-status" [class]="control.status">{{control.status}}</span>
              </div>
              <div class="control-progress">
                <div class="progress-fill" [style.width.%]="control.progress"></div>
              </div>
              <span class="control-value">{{control.progress}}%</span>
            </div>
          </div>
        </div>
        <div class="security-card">
          <h3>Cybersecurity Status</h3>
          <div class="cyber-status">
            <div class="status-item" *ngFor="let status of cyberStatus">
              <div class="status-icon">{{status.icon}}</div>
              <div class="status-info">
                <div class="status-title">{{status.title}}</div>
                <div class="status-value">{{status.value}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Shariah Compliance Module -->
    <section class="gov-section shariah-section">
      <div class="section-header">
        <h2>☪️ Shariah Compliance Module (GCC)</h2>
        <button class="shariah-btn" (click)="runShariahAudit()">📋 Audit</button>
      </div>
      <div class="shariah-grid">
        <div class="shariah-card">
          <h3>Shariah Compliance Score</h3>
          <div class="shariah-score">
            <div class="score-circle">
              <span class="score-value">95%</span>
              <span class="score-label">Compliant</span>
            </div>
            <div class="score-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">Financial Products</span>
                <span class="breakdown-value">98%</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Investment Criteria</span>
                <span class="breakdown-value">92%</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Ethical Standards</span>
                <span class="breakdown-value">96%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="shariah-card">
          <h3>Shariah Board</h3>
          <div class="shariah-board">
            <div class="board-member" *ngFor="let member of shariahBoard">
              <div class="member-avatar">{{member.avatar}}</div>
              <div class="member-info">
                <div class="member-name">{{member.name}}</div>
                <div class="member-role">{{member.role}}</div>
                <div class="member-expertise">{{member.expertise}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </main>
  </div>
</div> `,

styles: [`.governance-dashboard {
  min-height: 100vh;
  background: #fff; // Set background to white
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;

  // Dark mode styles
  &.dark-mode {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;

    .gov-sidenav {
      background: rgba(26, 26, 46, 0.95);
      border-right: 1px solid rgba(255, 255, 255, 0.1);

      .sidenav-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .logo-text {
          color: #ffffff;
        }
      }

      .menu-title {
        color: #ffffff;
      }

      .menu-item {
        a {
          color: #e0e0e0;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
          }
        }

        &.active a {
          background: rgba(102, 126, 234, 0.3);
          color: #ffffff;
        }
      }

      .theme-toggle {
        color: #e0e0e0;
      }
    }

    .gov-content {
      .gov-header {
        background: rgba(26, 26, 46, 0.95);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .header-text {
          h1 {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          p {
            color: #e0e0e0;
          }
        }

        .header-actions {
          .return-dashboard-btn {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);

            &:hover {
              box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
            }
          }
        }

        .header-stats .stat-item {
          background: rgba(26, 26, 46, 0.8);
          color: #ffffff;

          .stat-value {
            color: #667eea;
          }

          .stat-label {
            color: #e0e0e0;
          }
        }
      }

      .gov-section {
        background: rgba(26, 26, 46, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);

        .section-header {
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);

          h2 {
            color: #ffffff;
          }
        }

        .board-card,
        .compensation-card,
        .risk-card,
        .policy-card,
        .audit-card,
        .security-card,
        .shariah-card {
          background: rgba(26, 26, 46, 0.8);
          color: #ffffff;

          h3 {
            color: #ffffff;
          }
        }

        .chart-label,
        .comp-label,
        .metric-label,
        .risk-title,
        .measure-title,
        .policy-desc,
        .timeline-desc,
        .doc-title,
        .control-title,
        .status-title,
        .breakdown-label {
          color: #e0e0e0;
        }

        .member-name,
        .timeline-title,
        .doc-title {
          color: #ffffff;
        }

        .member-role,
        .member-expertise,
        .timeline-meta,
        .doc-meta {
          color: #b0b0b0;
        }

        .chart-bar {
          background: rgba(255, 255, 255, 0.1);
        }

        .metric-progress,
        .control-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .board-members .member-item,
        .corruption-measures .measure-item,
        .audit-timeline .timeline-item,
        .document-list .doc-item,
        .cyber-status .status-item,
        .shariah-board .board-member {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);

          &:hover {
            background: rgba(102, 126, 234, 0.1);
          }
        }
      }
    }
  }
}

// Sidenav Styles
.gov-sidenav {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
  overflow-y: auto;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    width: 100%;
    max-width: 320px;

    &.sidenav-open {
      transform: translateX(0);
    }
  }

  .sidenav-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .esg-leaf {
        font-size: 1.5rem;
      }

      .logo-text {
        font-weight: 700;
        font-size: 1.2rem;
        color: #333;
      }
    }

    .sidenav-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #333;

      @media (max-width: 768px) {
        display: block;
      }
    }
  }

  .sidenav-menu {
    padding: 1rem 0;

    .menu-section {
      margin-bottom: 2rem;

      .menu-title {
        padding: 0 1.5rem 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .menu-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .menu-item {
          a {
            display: block;
            padding: 0.75rem 1.5rem;
            color: #333;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            font-weight: 500;

            &:hover {
              background: rgba(102, 126, 234, 0.1);
              color: #667eea;
            }
          }

          &.active a {
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
            border-right: 3px solid #667eea;
          }

          .theme-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1.5rem;
            color: #333;
            font-weight: 500;

            .switch {
              position: relative;
              display: inline-block;
              width: 50px;
              height: 24px;

              input {
                opacity: 0;
                width: 0;
                height: 0;

                &:checked + .slider {
                  background-color: #667eea;
                }

                &:checked + .slider:before {
                  transform: translateX(26px);
                }
              }

              .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.3s;
                border-radius: 24px;

                &:before {
                  position: absolute;
                  content: "";
                  height: 18px;
                  width: 18px;
                  left: 3px;
                  bottom: 3px;
                  background-color: white;
                  transition: 0.3s;
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
    }
  }

  .main-dashboard-link {
    margin-bottom: 1.5rem;
    .dashboard-link {
      a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 700;
        font-size: 1.1rem;
        color: #28a745;
        background: linear-gradient(90deg, #e9ffe7 0%, #e0f7fa 100%);
        border-radius: 8px;
        padding: 1rem 1.5rem;
        margin: 0.5rem 1rem;
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.08);
        text-decoration: none;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      }
      a:hover, a:focus {
        background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
        color: #fff;
        box-shadow: 0 4px 16px rgba(40, 167, 69, 0.18);
      }
      .menu-icon {
        font-size: 1.3rem;
      }
      .menu-label {
        font-size: 1rem;
      }
    }
  }
}

// Dark mode for dashboard link
.governance-dashboard.dark-mode {
  .gov-sidenav {
    .main-dashboard-link {
      .dashboard-link a {
        background: linear-gradient(90deg, #223c2c 0%, #1a3a36 100%);
        color: #7fffaf;
      }
      .dashboard-link a:hover, .dashboard-link a:focus {
        background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
        color: #fff;
      }
    }
  }
}

// Main Content
.gov-content {
  flex: 1;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;

    &.content-shifted {
      margin-left: 0;
    }
  }
}

.gov-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #333;
      padding: 0.5rem;

      @media (max-width: 768px) {
        display: block;
      }
    }

    .header-text {
      h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        @media (max-width: 768px) {
          font-size: 2rem;
        }
      }

      p {
        margin: 0.5rem 0 0 0;
        color: #666;
        font-size: 1.1rem;

        @media (max-width: 768px) {
          font-size: 1rem;
        }
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
      order: -1;
      margin-bottom: 1rem;
    }

    .return-dashboard-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
      }

      .btn-icon {
        font-size: 1.2rem;
      }

      .btn-text {
        font-size: 0.9rem;

        @media (max-width: 768px) {
          display: none;
        }
      }

      @media (max-width: 768px) {
        padding: 0.75rem;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        justify-content: center;
      }
    }
  }

  .header-stats {
    display: flex;
    gap: 2rem;

    @media (max-width: 768px) {
      justify-content: center;
      flex-wrap: wrap;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      min-width: 120px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 0.25rem;
      }

      .stat-label {
        font-size: 0.9rem;
        color: #666;
        font-weight: 500;
      }
    }
  }
}

.gov-main {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.gov-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    h2 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;

      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;

      &.refresh-btn {
        background: #667eea;
        color: white;
        &:hover { background: #5a6fd8; }
      }

      &.add-btn {
        background: #28a745;
        color: white;
        &:hover { background: #218838; }
      }

      &.alert-btn {
        background: #dc3545;
        color: white;
        &:hover { background: #c82333; }
      }

      &.export-btn {
        background: #17a2b8;
        color: white;
        &:hover { background: #138496; }
      }

      &.security-btn {
        background: #6f42c1;
        color: white;
        &:hover { background: #5a32a3; }
      }

      &.shariah-btn {
        background: #fd7e14;
        color: white;
        &:hover { background: #e8690b; }
      }
    }
  }
}

// Board Section
.board-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  .board-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  .diversity-chart {
    .chart-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;

      .chart-label {
        min-width: 100px;
        font-weight: 500;
        color: #555;
      }

      .chart-bar {
        flex: 1;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 4px;
          transition: width 0.8s ease;
        }
      }

      .chart-value {
        min-width: 80px;
        text-align: right;
        font-weight: 600;
        color: #667eea;
      }
    }
  }

  .board-members {
    max-height: 400px;
    overflow-y: auto;

    .member-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.1);
      }

      .member-avatar {
        font-size: 2rem;
        margin-right: 1rem;
      }

      .member-info {
        flex: 1;

        .member-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .member-role {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .member-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;

          &.Independent {
            background: #d4edda;
            color: #155724;
          }

          &.Executive {
            background: #d1ecf1;
            color: #0c5460;
          }
        }
      }
    }
  }
}

// Compensation Section
.compensation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  .compensation-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  .comp-details {
    .comp-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;

      &.total {
        border-top: 2px solid #667eea;
        border-bottom: none;
        font-weight: 700;
        color: #667eea;
        font-size: 1.1rem;
      }

      .comp-label {
        color: #555;
        font-weight: 500;
      }

      .comp-value {
        font-weight: 600;
        color: #333;
      }
    }
  }

  .esg-metrics {
    .metric-item {
      margin-bottom: 1rem;

      .metric-label {
        display: block;
        font-weight: 500;
        color: #555;
        margin-bottom: 0.5rem;
      }

      .metric-progress {
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #28a745, #20c997);
          border-radius: 4px;
          transition: width 0.8s ease;
        }
      }

      .metric-value {
        font-weight: 600;
        color: #28a745;
        font-size: 0.9rem;
      }
    }
  }
}

// Risk Section
.risk-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  .risk-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  .risk-matrix {
    .risk-item {
      background: #fff;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      border-left: 4px solid #dc3545;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &.high {
        border-left-color: #dc3545;
      }

      &.medium {
        border-left-color: #ffc107;
      }

      .risk-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .risk-title {
          font-weight: 600;
          color: #333;
        }

        .risk-level {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;

          &.High {
            background: #f8d7da;
            color: #721c24;
          }

          &.Medium {
            background: #fff3cd;
            color: #856404;
          }
        }
      }

      .risk-desc {
        color: #666;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .risk-actions {
        display: flex;
        gap: 0.5rem;

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;

          &:first-child {
            background: #dc3545;
            color: white;
            &:hover { background: #c82333; }
          }

          &:last-child {
            background: #6c757d;
            color: white;
            &:hover { background: #5a6268; }
          }
        }
      }
    }
  }

  .corruption-measures {
    .measure-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;

      .measure-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
      }

      .measure-info {
        flex: 1;

        .measure-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .measure-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;

          &.Active {
            background: #d4edda;
            color: #155724;
          }

          &.Completed {
            background: #d1ecf1;
            color: #0c5460;
          }

          &.Ongoing {
            background: #fff3cd;
            color: #856404;
          }
        }
      }
    }
  }
}

// Policy Section
.policy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .policy-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }

    .policy-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        color: #333;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .policy-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;

        &.Active {
          background: #d4edda;
          color: #155724;
        }
      }
    }

    .policy-desc {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .policy-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #888;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }

    .policy-actions {
      display: flex;
      gap: 0.5rem;

      .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #667eea;
        color: white;

        &:hover {
          background: #5a6fd8;
        }
      }
    }
  }
}

// Audit Section
.audit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  .audit-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  .audit-timeline {
    max-height: 400px;
    overflow-y: auto;

    .timeline-item {
      display: flex;
      align-items: flex-start;
      padding: 1rem 0;
      border-bottom: 1px solid #f0f0f0;

      .timeline-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
        margin-top: 0.25rem;
      }

      .timeline-content {
        flex: 1;

        .timeline-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .timeline-desc {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .timeline-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #888;

          .meta-time, .meta-user {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
        }
      }
    }
  }

  .document-list {
    max-height: 400px;
    overflow-y: auto;

    .doc-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.1);
      }

      .doc-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
      }

      .doc-info {
        flex: 1;

        .doc-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .doc-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #888;
        }
      }

      .doc-action {
        padding: 0.5rem;
        border: none;
        background: none;
        font-size: 1.2rem;
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.3s ease;

        &:hover {
          background: rgba(102, 126, 234, 0.2);
        }
      }
    }
  }
}

// Security Section
.security-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  .security-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  .privacy-controls {
    .control-item {
      margin-bottom: 1rem;

      .control-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .control-title {
          font-weight: 500;
          color: #555;
        }

        .control-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          background: #d4edda;
          color: #155724;
        }
      }

      .control-progress {
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #28a745, #20c997);
          border-radius: 4px;
          transition: width 0.8s ease;
        }
      }

      .control-value {
        font-weight: 600;
        color: #28a745;
        font-size: 0.9rem;
      }
    }
  }

  .cyber-status {
    .status-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;

      .status-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
      }

      .status-info {
        flex: 1;

        .status-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .status-value {
          color: #28a745;
          font-weight: 600;
          font-size: 0.9rem;
        }
      }
    }
  }
}

// Shariah Section
.shariah-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  .shariah-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  .shariah-score {
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }

    .score-circle {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #fd7e14, #ff8c42);
      border-radius: 50%;
      width: 120px;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 25px rgba(253, 126, 20, 0.3);

      .score-value {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }

      .score-label {
        font-size: 0.8rem;
        opacity: 0.9;
      }
    }

    .score-breakdown {
      flex: 1;

      .breakdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .breakdown-label {
          color: #555;
          font-weight: 500;
        }

        .breakdown-value {
          font-weight: 600;
          color: #fd7e14;
        }
      }
    }
  }

  .shariah-board {
    .board-member {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;

      .member-avatar {
        font-size: 2rem;
        margin-right: 1rem;
      }

      .member-info {
        flex: 1;

        .member-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .member-role {
          color: #fd7e14;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .member-expertise {
          color: #666;
          font-size: 0.8rem;
        }
      }
    }
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gov-section {
  animation: fadeInUp 0.6s ease-out;
}

// Scrollbar Styling
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a6fd8;
}

// Overlay for mobile sidenav
.sidenav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    &.active {
      display: block;
    }
  }
}

// Remove header return-dashboard-btn styles if present
.header-actions, .return-dashboard-btn { display: none !important; } 

.gdash-sidenav {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
  overflow-y: auto;

  &.collapsed {
    width: 70px;
    .gdash-nav-link span:not(.gdash-nav-icon), .gdash-user-title, .gdash-logo, .gdash-title, .gdash-sidenav-footer span {
      display: none;
    }
    .gdash-nav-link {
      justify-content: center;
    }
  }

  .gdash-sidenav-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .gdash-logo {
        font-weight: 700;
        font-size: 1.2rem;
        color: #333;
      margin-bottom: 0.5rem;
    }
    .gdash-user-title {
      font-size: 1rem;
      color: #666;
    }
  }

  .gdash-nav {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    .gdash-nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
            padding: 0.75rem 1.5rem;
            color: #333;
            text-decoration: none;
            font-weight: 500;
      font-size: 1rem;
      transition: background 0.2s, color 0.2s;
      border-right: 3px solid transparent;
      &.active {
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
            border-right: 3px solid #667eea;
          }
      &:hover {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
      }
      .gdash-nav-icon {
        font-size: 1.3rem;
      }
    }
  }

  .gdash-sidenav-footer {
  display: flex;
      flex-direction: column;
      gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    .gdash-sidenav-toggle, .gdash-dark-toggle, .gdash-logout {
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
      &:hover {
        color: #667eea;
      }
    }
    .gdash-sidenav-toggle {
      font-size: 1.2rem;
    }
    .gdash-dark-toggle {
        font-size: 1.2rem;
    }
    .gdash-logout {
      color: #dc3545;
        &:hover {
        color: #a71d2a;
      }
    }
  }
}

.governance-dashboard.dark-mode .gdash-sidenav {
  background: rgba(26, 26, 46, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  .gdash-logo, .gdash-user-title, .gdash-nav-link, .gdash-sidenav-toggle, .gdash-dark-toggle {
    color: #e0e0e0;
  }
  .gdash-nav-link.active {
    color: #7eaaff;
    background: rgba(102, 126, 234, 0.3);
    border-right: 3px solid #7eaaff;
  }
  .gdash-sidenav-footer .gdash-logout {
    color: #ffb3b3;
      &:hover {
      color: #ff4d4d;
    }
  }
}

.governance-dashboard {
  padding-left: 280px;
}
.governance-dashboard .gdash-sidenav.collapsed ~ .gov-content {
  padding-left: 70px;
}
@media (max-width: 900px) {
  .governance-dashboard {
    padding-left: 70px;
  }
  .gdash-sidenav {
    width: 70px;
  }
}

.gdash-overview {
  margin-bottom: 2rem;
  .gdash-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    h2 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }
    p {
      margin: 0.25rem 0 0 0;
      color: #666;
      font-size: 1.1rem;
    }
    .gdash-actions {
      display: flex;
      gap: 1rem;
      .gdash-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s, color 0.2s;
        &.gdash-btn-primary {
          background: #2563eb;
          color: #fff;
        }
        &.gdash-btn-secondary {
          background: #f3f4f6;
          color: #333;
        }
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
  .gdash-stats-row {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    .gdash-stat-card {
      flex: 1 1 200px;
      min-width: 200px;
      max-width: 260px;
      background: #f3f4f6;
      border-radius: 16px;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      position: relative;
      .gdash-stat-icon {
        font-size: 1.6rem;
        margin-bottom: 0.5rem;
      }
      .gdash-stat-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }
      .gdash-stat-label {
        font-size: 1rem;
        color: #333;
        margin-top: 0.5rem;
      }
    }
    .gdash-stat-blue { background: #e6f0ff; color: #2563eb; }
    .gdash-stat-green { background: #e6fff3; color: #059669; }
    .gdash-stat-purple { background: #f3e8ff; color: #a21caf; }
    .gdash-stat-yellow { background: #fffbe6; color: #b45309; }
    .gdash-stat-pink { background: #ffe6f0; color: #db2777; }
    .gdash-stat-card .gdash-stat-value { color: inherit; }
  }
}
@media (max-width: 900px) {
  .gdash-overview .gdash-stats-row {
    flex-direction: column;
    gap: 1rem;
    .gdash-stat-card {
      max-width: 100%;
      width: 100%;
    }
  }
}`],
})
export class GovernanceComponent implements OnInit, AfterViewInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  currentLanguage = 'en';
  isRTL = false;
  private sub: Subscription = new Subscription();
  private translationSubscription?: Subscription;

  // Board Composition Data
  boardMembers = [
    { avatar: '👨‍💼', name: 'Ahmed Al-Rashid', role: 'Chairman', status: 'Independent' },
    { avatar: '👩‍💼', name: 'Sarah Johnson', role: 'CEO', status: 'Executive' },
    { avatar: '👨‍💼', name: 'Mohammed Hassan', role: 'Independent Director', status: 'Independent' },
    { avatar: '👩‍💼', name: 'Fatima Al-Zahra', role: 'Independent Director', status: 'Independent' },
    { avatar: '👨‍💼', name: 'David Chen', role: 'Independent Director', status: 'Independent' },
    { avatar: '👩‍💼', name: 'Aisha Khan', role: 'Independent Director', status: 'Independent' },
    { avatar: '👨‍💼', name: 'Robert Smith', role: 'CFO', status: 'Executive' },
    { avatar: '👩‍💼', name: 'Layla Al-Mansouri', role: 'Independent Director', status: 'Independent' }
  ];

  // Risk Management Data
  highRisks = [
    { title: 'Regulatory Compliance', level: 'High', description: 'New ESG regulations in KSA require immediate attention' },
    { title: 'Data Privacy', level: 'Medium', description: 'PDPL compliance needs enhancement' },
    { title: 'Supply Chain Ethics', level: 'Medium', description: 'Supplier audit reveals potential issues' }
  ];

  antiCorruptionMeasures = [
    { icon: '📋', title: 'Code of Ethics', status: 'Active' },
    { icon: '🎓', title: 'Training Programs', status: 'Completed' },
    { icon: '🔍', title: 'Due Diligence', status: 'Ongoing' },
    { icon: '📞', title: 'Whistleblower Hotline', status: 'Active' }
  ];

  // Policy Management Data
  policies = [
    { title: 'Code of Ethics', status: 'Active', description: 'Comprehensive ethical guidelines for all employees', lastUpdated: '2024-01-15', owner: 'Legal Team', version: 'v3.2' },
    { title: 'ESG Policy', status: 'Active', description: 'Environmental, Social, and Governance framework', lastUpdated: '2024-02-20', owner: 'ESG Team', version: 'v2.1' },
    { title: 'Data Privacy Policy', status: 'Active', description: 'PDPL compliant data protection guidelines', lastUpdated: '2024-03-10', owner: 'IT Security', version: 'v1.8' },
    { title: 'Anti-Corruption Policy', status: 'Active', description: 'Anti-bribery and corruption prevention', lastUpdated: '2024-01-30', owner: 'Compliance', version: 'v2.0' }
  ];

  // Audit Trail Data
  auditActivities = [
    { icon: '📝', title: 'Policy Updated', description: 'ESG Policy updated to include new regulations', time: '2 hours ago', user: 'Sarah Johnson' },
    { icon: '🔍', title: 'Compliance Audit', description: 'Annual compliance audit completed', time: '1 day ago', user: 'Compliance Team' },
    { icon: '📊', title: 'Board Meeting', description: 'Q1 governance review meeting', time: '3 days ago', user: 'Board Secretary' },
    { icon: '🔒', title: 'Security Scan', description: 'Cybersecurity assessment completed', time: '1 week ago', user: 'IT Security' }
  ];

  documents = [
    { icon: '📄', title: 'Board Minutes Q1 2024', size: '2.3 MB', date: '2024-03-31' },
    { icon: '📋', title: 'Compliance Report', size: '1.8 MB', date: '2024-03-28' },
    { icon: '🔒', title: 'Security Audit Report', size: '3.1 MB', date: '2024-03-25' },
    { icon: '📊', title: 'ESG Performance Report', size: '4.2 MB', date: '2024-03-20' }
  ];

  // Privacy & Security Data
  privacyControls = [
    { title: 'Data Encryption', status: 'Active', progress: 95 },
    { title: 'Access Controls', status: 'Active', progress: 88 },
    { title: 'Data Retention', status: 'Active', progress: 92 },
    { title: 'Privacy Training', status: 'Active', progress: 85 }
  ];

  cyberStatus = [
    { icon: '🛡️', title: 'Firewall Status', value: 'Protected' },
    { icon: '🔐', title: 'Encryption', value: 'AES-256' },
    { icon: '👥', title: 'Access Logs', value: 'Monitored' },
    { icon: '🚨', title: 'Incident Response', value: 'Ready' }
  ];

  // Shariah Compliance Data
  shariahBoard = [
    { avatar: '👨‍💼', name: 'Sheikh Abdullah Al-Rashid', role: 'Chairman', expertise: 'Islamic Finance' },
    { avatar: '👨‍💼', name: 'Dr. Mohammed Al-Hassan', role: 'Member', expertise: 'Shariah Law' },
    { avatar: '👨‍💼', name: 'Sheikh Omar Al-Zahra', role: 'Member', expertise: 'Islamic Economics' }
  ];

  constructor(private translationService: GovernanceLeadTranslationService) {}

  ngOnInit() {
    // Initialize translation
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();
    
    this.translationSubscription = this.translationService.getLanguageChange$().subscribe(lang => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Governance Lead language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Governance Lead translations not loaded yet');
      } else {
        console.log('Governance Lead translations loaded successfully');
      }
    }, 1000);

    this.startAutoUpdates();
  }

  ngAfterViewInit() {
    // Initialize any view-dependent logic
  }

  startAutoUpdates() {
    this.sub.add(interval(30000).subscribe(() => {
      this.updateGovernanceData();
    }));
  }

  updateGovernanceData() {
    // Simulate real-time updates
    console.log('Updating governance data...');
  }

  refreshBoardData() {
    // Refresh board composition data
    console.log('Refreshing board data...');
  }

  addCompensation() {
    // Add new compensation record
    console.log('Adding compensation record...');
  }

  showRiskAlerts() {
    // Show risk alerts modal
    console.log('Showing risk alerts...');
  }

  addPolicy() {
    // Add new policy
    console.log('Adding new policy...');
  }

  exportAuditTrail() {
    // Export audit trail
    console.log('Exporting audit trail...');
  }

  runSecurityScan() {
    // Run security scan
    console.log('Running security scan...');
  }

  runShariahAudit() {
    // Run Shariah compliance audit
    console.log('Running Shariah audit...');
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  getTranslatedText(key: string): string {
    const translated = this.translationService.translate(key);
    if (translated === key) {
      console.warn(`Governance Lead translation failed for key: ${key}`);
    }
    return translated;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.translationSubscription?.unsubscribe();
  }
} 