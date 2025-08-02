import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardDataService } from '../dashboard-data.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoleDetailsTranslationService } from '../services/role-details-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [CommonModule, FormsModule, UnifiedLanguageToggleComponent],
  template: `
    <main class="shm-main">
      <ng-container *ngIf="role === 'Sustainability Head Manager'; else analystDashboard">
        <!-- Enhanced Sustainability Head Manager Dashboard with header, footer, and real data -->
        <header class="shm-header">
          <div class="shm-header-content">
            <span class="shm-header-logo">🌱 {{ getTranslatedText('ROLE_DETAILS.ESG_PLATFORM') }}</span>
            <span class="shm-header-welcome">{{ getTranslatedText('ROLE_DETAILS.WELCOME') }}, {{ username }}! <span class="shm-header-role">({{ getTranslatedText('ROLE_DETAILS.SUSTAINABILITY_HEAD_MANAGER') }})</span></span>
            <app-unified-language-toggle></app-unified-language-toggle>
            <button class="shm-darkmode-toggle" (click)="toggleDarkMode()">{{ darkMode ? '🌙' : '☀️' }}</button>
          </div>
        </header>
        <div class="shm-quick-stats-bar">
          <div class="shm-quick-stat"><span class="stat-label">{{ getTranslatedText('ROLE_DETAILS.CO2') }}</span> <span class="stat-value">-3%</span></div>
          <div class="shm-quick-stat"><span class="stat-label">{{ getTranslatedText('ROLE_DETAILS.DIVERSITY') }}</span> <span class="stat-value">+2%</span></div>
          <div class="shm-quick-stat"><span class="stat-label">{{ getTranslatedText('ROLE_DETAILS.COMPLIANCE') }}</span> <span class="stat-value">99%</span></div>
          <div class="shm-quick-stat"><span class="stat-label">{{ getTranslatedText('ROLE_DETAILS.PROJECTS') }}</span> <span class="stat-value">5 {{ getTranslatedText('ROLE_DETAILS.ACTIVE') }}</span></div>
        </div>
        <div class="shm-progress-circles-row">
          <div class="shm-progress-circle-card">
            <svg class="shm-progress-circle" width="80" height="80">
              <circle cx="40" cy="40" r="34" stroke="#e0e7ff" stroke-width="8" fill="none" />
              <circle cx="40" cy="40" r="34" stroke="#6c63ff" stroke-width="8" fill="none" stroke-dasharray="213.6" [attr.stroke-dashoffset]="(1-0.87)*213.6" stroke-linecap="round" style="transition: stroke-dashoffset 1s;" />
            </svg>
            <div class="shm-progress-label">{{ getTranslatedText('ROLE_DETAILS.ESG_SCORE') }}</div>
            <div class="shm-progress-value">87</div>
          </div>
          <div class="shm-progress-circle-card">
            <svg class="shm-progress-circle" width="80" height="80">
              <circle cx="40" cy="40" r="34" stroke="#e0e7ff" stroke-width="8" fill="none" />
              <circle cx="40" cy="40" r="34" stroke="#388e3c" stroke-width="8" fill="none" stroke-dasharray="213.6" [attr.stroke-dashoffset]="(1-0.92)*213.6" stroke-linecap="round" style="transition: stroke-dashoffset 1s;" />
            </svg>
            <div class="shm-progress-label">{{ getTranslatedText('ROLE_DETAILS.COMPLIANCE') }}</div>
            <div class="shm-progress-value">92%</div>
          </div>
          <div class="shm-progress-circle-card">
            <svg class="shm-progress-circle" width="80" height="80">
              <circle cx="40" cy="40" r="34" stroke="#e0e7ff" stroke-width="8" fill="none" />
              <circle cx="40" cy="40" r="34" stroke="#e84393" stroke-width="8" fill="none" stroke-dasharray="213.6" [attr.stroke-dashoffset]="(1-0.45)*213.6" stroke-linecap="round" style="transition: stroke-dashoffset 1s;" />
            </svg>
            <div class="shm-progress-label">{{ getTranslatedText('ROLE_DETAILS.CO2_TARGET') }}</div>
            <div class="shm-progress-value">45%</div>
          </div>
        </div>
        <div class="shm-tasks-main">
          <section class="shm-tasks-row">
            <div class="shm-task-card animate-stagger">
              <div class="shm-task-icon">📋</div>
              <h3>{{ getTranslatedText('ROLE_DETAILS.REVIEW_PROJECTS') }}</h3>
              <p>3 {{ getTranslatedText('ROLE_DETAILS.PROJECTS_NEED_APPROVAL') }}</p>
              <ul class="shm-task-list">
                <li>{{ getTranslatedText('ROLE_DETAILS.SOLAR_PANEL_EXPANSION') }} <span class="pending">{{ getTranslatedText('ROLE_DETAILS.PENDING') }}</span></li>
                <li>{{ getTranslatedText('ROLE_DETAILS.WATER_CONSERVATION') }} <span class="pending">{{ getTranslatedText('ROLE_DETAILS.PENDING') }}</span></li>
                <li>{{ getTranslatedText('ROLE_DETAILS.ZERO_WASTE_OFFICE') }} <span class="in-review">{{ getTranslatedText('ROLE_DETAILS.IN_REVIEW') }}</span></li>
              </ul>
              <button class="shm-task-btn" (click)="openTaskModal('projects')">{{ getTranslatedText('ROLE_DETAILS.GO_TO_PROJECTS') }}</button>
            </div>
            <div class="shm-task-card animate-stagger">
              <div class="shm-task-icon">⚠️</div>
              <h3>{{ getTranslatedText('ROLE_DETAILS.COMPLIANCE_ALERTS') }}</h3>
              <p>2 {{ getTranslatedText('ROLE_DETAILS.COMPLIANCE_ISSUES') }}</p>
              <ul class="shm-task-list">
                <li>{{ getTranslatedText('ROLE_DETAILS.WATER_USAGE_ABOVE_TARGET') }} <span class="alert">{{ getTranslatedText('ROLE_DETAILS.DUE') }}: 2024-05-10</span></li>
                <li>{{ getTranslatedText('ROLE_DETAILS.SUPPLIER_AUDIT_OVERDUE') }} <span class="alert">{{ getTranslatedText('ROLE_DETAILS.DUE') }}: 2024-05-15</span></li>
              </ul>
              <button class="shm-task-btn" (click)="openTaskModal('compliance')">{{ getTranslatedText('ROLE_DETAILS.VIEW_COMPLIANCE') }}</button>
            </div>
            <div class="shm-task-card animate-stagger">
              <div class="shm-task-icon">🎯</div>
              <h3>{{ getTranslatedText('ROLE_DETAILS.SET_UPDATE_GOALS') }}</h3>
              <p>{{ getTranslatedText('ROLE_DETAILS.ANNUAL_CO2_TARGET') }}: <b>↓ 10%</b> | {{ getTranslatedText('ROLE_DETAILS.WATER_TARGET') }}: <b>↓ 8%</b></p>
              <button class="shm-task-btn" (click)="openTaskModal('goals')">{{ getTranslatedText('ROLE_DETAILS.UPDATE_GOALS') }}</button>
            </div>
            <div class="shm-task-card animate-stagger">
              <div class="shm-task-icon">🤝</div>
              <h3>{{ getTranslatedText('ROLE_DETAILS.TEAM_COLLABORATION') }}</h3>
              <p>2 {{ getTranslatedText('ROLE_DETAILS.NEW_COMMENTS') }}, 1 {{ getTranslatedText('ROLE_DETAILS.TASK_ASSIGNED') }}</p>
              <ul class="shm-task-list">
                <li>Priya: "Ready for Q2 report review."</li>
                <li>John: "Supplier audit scheduled."</li>
              </ul>
              <button class="shm-task-btn" (click)="openTaskModal('team')">Go to Team</button>
            </div>
            <div class="shm-task-card animate-stagger">
              <div class="shm-task-icon">📤</div>
              <h3>{{ getTranslatedText('ROLE_DETAILS.DOWNLOAD_SHARE_REPORT') }}</h3>
              <p>{{ getTranslatedText('ROLE_DETAILS.LATEST_ESG_REPORT') }}</p>
              <button class="shm-task-btn" (click)="openTaskModal('report')">{{ getTranslatedText('ROLE_DETAILS.DOWNLOAD_REPORT') }}</button>
              <button class="shm-task-btn alt" (click)="openTaskModal('share')">{{ getTranslatedText('ROLE_DETAILS.SHARE_WITH_BOARD') }}</button>
            </div>
          </section>
        </div>
        <div class="shm-activity-feed">
          <h4>Recent Activity</h4>
          <ul>
            <li>Priya updated Water Goal (2 min ago)</li>
            <li>Supplier audit completed (10 min ago)</li>
            <li>New project proposal: Green Roofs (30 min ago)</li>
            <li>CO₂ report shared with Board (1 hr ago)</li>
          </ul>
        </div>
        <div class="shm-features-main">
          <section class="shm-features-hero animate-fade-in">
            <div class="shm-features-hero-bg"></div>
            <div class="shm-features-hero-content">
              <div class="shm-features-hero-icon">🌍</div>
              <h1 class="shm-features-hero-title animate-slide-in">Sustainability Dashboard</h1>
              <span class="shm-features-hero-role animate-fade-in-delay">Sustainability Head Manager</span>
              <p class="shm-features-hero-lead animate-fade-in-delay2">Empowering you to drive sustainability with clarity, speed, and impact.</p>
            </div>
          </section>
          <section class="shm-features-grid">
            <!-- Centralized Data Card -->
            <div class="shm-feature-card animate-stagger">
              <div class="shm-feature-icon">📊</div>
              <h2>Centralized Data</h2>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <rect x="10" y="30" width="20" height="20" fill="#6c63ff" rx="4"/>
                <rect x="40" y="20" width="20" height="30" fill="#2d2e83" rx="4"/>
                <rect x="70" y="10" width="20" height="40" fill="#4bc0c0" rx="4"/>
                <rect x="100" y="25" width="20" height="25" fill="#ffce56" rx="4"/>
                <rect x="130" y="35" width="20" height="15" fill="#e84393" rx="4"/>
                <rect x="160" y="5" width="20" height="45" fill="#388e3c" rx="4"/>
              </svg>
              <p>All sustainability data is unified from 8+ sources: energy meters, water sensors, HR systems, supply chain, and more.</p>
              <ul class="shm-feature-list">
                <li>Energy: 2,300 MWh (YTD)</li>
                <li>Water: 1.1M m³ (YTD)</li>
                <li>CO₂: 4,800 tCO₂e (YTD)</li>
                <li>Suppliers: 120+ ESG-rated</li>
              </ul>
            </div>
            <!-- Real-time Monitoring Card -->
            <div class="shm-feature-card animate-stagger">
              <div class="shm-feature-icon">⏱️</div>
              <h2>Real-time Monitoring</h2>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <polyline points="0,50 40,30 80,40 120,10 160,30 200,20" style="fill:none;stroke:#6c63ff;stroke-width:4" />
                <circle cx="40" cy="30" r="5" fill="#6c63ff" />
                <circle cx="120" cy="10" r="5" fill="#388e3c" />
                <circle cx="200" cy="20" r="5" fill="#e84393" />
              </svg>
              <p>Live ESG Score: <b>88.1</b> (↑ 1.2% this quarter)</p>
              <ul class="shm-feature-list">
                <li>CO₂ Emissions: 4,800 tCO₂e (↓ 3% vs. last year)</li>
                <li>Water Usage: 1.1M m³ (↓ 2%)</li>
                <li>Employee Diversity: 47% women, 18% under 30</li>
                <li>Compliance Rate: 99.2%</li>
              </ul>
            </div>
            <!-- Customizable Views Card -->
            <div class="shm-feature-card animate-stagger">
              <div class="shm-feature-icon">🛠️</div>
              <h2>Customizable Views</h2>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <rect x="10" y="10" width="50" height="40" fill="#6c63ff" rx="8"/>
                <rect x="70" y="20" width="50" height="30" fill="#2d2e83" rx="8"/>
                <rect x="130" y="5" width="60" height="50" fill="#4bc0c0" rx="8"/>
              </svg>
              <p>Switch between global, regional, and site-level dashboards. Save custom views for Board, Operations, or HR.</p>
              <ul class="shm-feature-list">
                <li>Board View: Top 10 KPIs, risk map</li>
                <li>Operations: Real-time energy & waste</li>
                <li>HR: Diversity, training, well-being</li>
              </ul>
            </div>
            <!-- Visualizations Card -->
            <div class="shm-feature-card animate-stagger">
              <div class="shm-feature-icon">📈</div>
              <h2>Visualizations</h2>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <polyline points="0,50 40,40 80,30 120,20 160,10 200,5" style="fill:none;stroke:#388e3c;stroke-width:5" />
                <circle cx="80" cy="30" r="6" fill="#6c63ff" />
                <circle cx="160" cy="10" r="6" fill="#e84393" />
              </svg>
              <p>Interactive charts: ESG Score trend, CO₂ by site, water usage by month, supplier ESG ratings, and more.</p>
              <ul class="shm-feature-list">
                <li>ESG Score Trend: 85.4 → 88.1 (last 4 quarters)</li>
                <li>CO₂ by Site: HQ 1,200t, Plant 2,800t, Offices 800t</li>
                <li>Supplier ESG: 78% A-rated</li>
              </ul>
            </div>
            <!-- Improved Decision-Making Card -->
            <div class="shm-feature-card animate-stagger">
              <div class="shm-feature-icon">💡</div>
              <h2>Improved Decision-Making</h2>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <rect x="20" y="30" width="30" height="20" fill="#ffce56" rx="6"/>
                <rect x="60" y="20" width="30" height="30" fill="#388e3c" rx="6"/>
                <rect x="100" y="10" width="30" height="40" fill="#6c63ff" rx="6"/>
                <rect x="140" y="5" width="30" height="45" fill="#e84393" rx="6"/>
              </svg>
              <p>AI-driven insights: "Switching to LED lighting at Plant B will save $120K/year and cut 400t CO₂."</p>
              <ul class="shm-feature-list">
                <li>Scenario: 100% renewable energy by 2027</li>
                <li>Policy: New supplier code of conduct</li>
                <li>Initiative: Zero-waste offices by 2025</li>
              </ul>
            </div>
            <!-- Enhanced Transparency & Accountability Card -->
            <div class="shm-feature-card animate-stagger">
              <div class="shm-feature-icon">🔍</div>
              <h2>Enhanced Transparency & Accountability</h2>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <ellipse cx="60" cy="30" rx="50" ry="20" fill="#4bc0c0"/>
                <rect x="120" y="10" width="60" height="40" fill="#6c63ff" rx="10"/>
                <circle cx="150" cy="30" r="12" fill="#ffce56" />
              </svg>
              <p>All data changes are logged. Share dashboards with stakeholders and publish annual ESG reports with one click.</p>
              <ul class="shm-feature-list">
                <li>Audit Trail: 100% of changes tracked</li>
                <li>Public ESG Report: 2023 now available</li>
                <li>Stakeholder Portal: 350+ users</li>
              </ul>
            </div>
          </section>
        </div>
        <footer class="shm-footer">
          <div class="shm-footer-content">
            <span>© 2024 ESG Platform. All rights reserved.</span>
            <span class="shm-footer-socials">
              <a href="#" title="Email"><span>📧</span></a>
              <a href="#" title="LinkedIn"><span>🔗</span></a>
              <a href="#" title="Twitter"><span>🐦</span></a>
            </span>
          </div>
        </footer>
        <div *ngIf="showConfetti" class="shm-confetti">🎉 Goals Updated!</div>
      </ng-container>
      <ng-container *ngIf="role === 'Sustainability Risk and Compliance Technology Specialist'">
        <header class="src-header">
          <div class="src-header-content">
            <span class="src-header-logo">🛡️ ESG Platform</span>
            <span class="src-header-welcome">Welcome, {{ username }}! <span class="src-header-role">(Sustainability Risk & Compliance Tech Specialist)</span></span>
          </div>
        </header>
        <div class="src-dashboard-main">
          <section class="src-hero-section animate-fade-in">
            <div class="src-hero-bg"></div>
            <div class="src-hero-content">
              <div class="src-hero-icon">🛡️</div>
              <h1 class="src-hero-title animate-slide-in">Risk & Compliance Technology Dashboard</h1>
              <span class="src-hero-role animate-fade-in-delay">Sustainability Risk & Compliance Tech Specialist</span>
              <p class="src-hero-lead animate-fade-in-delay2">Empowering you to manage risk, compliance, and technology for a sustainable future.</p>
            </div>
          </section>
          <section class="src-responsibilities-grid">
            <div class="src-resp-card animate-stagger">
              <div class="src-resp-icon">💻</div>
              <h2>Developing & Implementing Sustainability Technology Strategies</h2>
              <p>Design and deploy technology solutions that support sustainability goals, such as IoT for energy monitoring, AI for predictive analytics, and cloud-based ESG data platforms.</p>
            </div>
            <div class="src-resp-card animate-stagger">
              <div class="src-resp-icon">📜</div>
              <h2>Ensuring Compliance with Sustainability Regulations</h2>
              <p>Monitor and ensure adherence to global and local sustainability regulations, automate compliance checks, and maintain audit-ready records.</p>
            </div>
            <div class="src-resp-card animate-stagger">
              <div class="src-resp-icon">⚠️</div>
              <h2>Managing Sustainability Risks</h2>
              <p>Identify, assess, and mitigate risks related to environmental, social, and governance factors using advanced risk management tools and dashboards.</p>
            </div>
            <div class="src-resp-card animate-stagger">
              <div class="src-resp-icon">🔗</div>
              <h2>Integrating Sustainability into Business Processes</h2>
              <p>Embed sustainability criteria into procurement, operations, and supply chain management systems for end-to-end ESG integration.</p>
            </div>
            <div class="src-resp-card animate-stagger">
              <div class="src-resp-icon">📊</div>
              <h2>Promoting Transparency and Reporting</h2>
              <p>Automate ESG data collection and reporting, generate real-time dashboards, and facilitate transparent communication with stakeholders.</p>
            </div>
            <div class="src-resp-card animate-stagger">
              <div class="src-resp-icon">🚀</div>
              <h2>Staying Abreast of Emerging Technologies and Trends</h2>
              <p>Continuously research and evaluate new technologies, such as blockchain for traceability or machine learning for risk prediction, to enhance sustainability initiatives.</p>
            </div>
          </section>
        </div>
        <footer class="src-footer">
          <div class="src-footer-content">
            <span>© 2024 ESG Platform. All rights reserved.</span>
          </div>
        </footer>
      </ng-container>
      <ng-template #analystDashboard>
        <!-- ESG Analyst Dashboard -->
        <div class="shm-kpi-row">
          <div class="shm-kpi-card" *ngFor="let kpi of analystKpis" (click)="openKpiDetail(kpi)" [@fadeIn]>
            <div class="shm-kpi-icon">{{ kpi.icon }}</div>
            <div class="shm-kpi-value">{{ kpi.value }}</div>
            <div class="shm-kpi-label">{{ kpi.label }}</div>
            <div class="shm-kpi-detail">{{ kpi.details }}</div>
          </div>
        </div>
        <div class="shm-content-row">
          <div class="shm-graph-card" [@slideIn]>
            <h3>Data Quality Trend</h3>
            <svg width="320" height="100" viewBox="0 0 320 100">
              <defs>
                <linearGradient id="analystTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2d2e83" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#6c63ff" stop-opacity="0.3"/>
                </linearGradient>
              </defs>
              <polyline points="0,90 40,80 80,60 120,50 160,60 200,55 240,50 280,45 320,40" style="fill:none;stroke:#2d2e83;stroke-width:4" />
              <polygon points="0,90 40,80 80,60 120,50 160,60 200,55 240,50 280,45 320,40 320,100 0,100" fill="url(#analystTrendGradient)" />
              <circle *ngFor="let pt of [40,80,120,160,200,240,280,320]; let i = index" [attr.cx]="pt" [attr.cy]="[80,60,50,60,55,50,45,40][i]" r="5" fill="#2d2e83" />
            </svg>
            <div class="shm-graph-label">Data quality and completeness over time</div>
          </div>
          <div class="shm-projects-card" [@slideIn]>
            <h3>Recent Analyses</h3>
            <div class="shm-project-list">
              <div class="shm-project-item" *ngFor="let a of analystAnalyses">
                <span class="shm-project-title">{{ a.title }}</span>
                <span class="shm-project-status" [ngClass]="a.status">{{ a.status }}</span>
              </div>
              <div class="shm-project-summary" *ngFor="let a of analystAnalyses">{{ a.summary }}</div>
            </div>
          </div>
          <div class="shm-compliance-card" [@slideIn]>
            <h3>Data Sources</h3>
            <ul class="shm-risk-list">
              <li *ngFor="let ds of compliance?.dataSources">{{ ds.type }}: {{ ds.count }}</li>
              <li>Last sync: {{ compliance?.lastSync }}</li>
            </ul>
            <h4>Data Issues</h4>
            <ul class="shm-risk-list">
              <li *ngFor="let issue of compliance?.dataIssues">{{ issue.issue }} <span [ngClass]="issue.severity">({{ issue.severity }})</span></li>
            </ul>
          </div>
          <div class="shm-team-card" [@slideIn]>
            <h3>Collaboration</h3>
            <div class="shm-team-list">
              <div class="shm-team-member" *ngFor="let m of analystTeam">
                <span class="shm-team-avatar">{{ m.avatar }}</span>
                <span class="shm-team-name">{{ m.name }}</span>
                <span class="shm-team-role">{{ m.role }}</span>
              </div>
            </div>
            <div class="shm-collab-activity">
              <span class="shm-collab-label">Recent:</span>
              <span class="shm-collab-desc">{{ analystRecentCollab }}</span>
            </div>
          </div>
        </div>
      </ng-template>
      <!-- KPI Detail Modal -->
      <div class="shm-kpi-modal-backdrop" *ngIf="kpiDetail">
        <div class="shm-kpi-modal">
          <button class="shm-kpi-modal-close" (click)="closeKpiDetail()">✖</button>
          <h3>{{ kpiDetail.label }} Details</h3>
          <p>{{ kpiDetailDetail }}</p>
        </div>
      </div>
    </main>
    <!-- Popup Modal for Task Details (should overlay the whole page) -->
    <div class="shm-modal-backdrop" *ngIf="taskModal">
      <div class="shm-modal">
        <button class="shm-modal-close" (click)="closeTaskModal()">✖</button>
        <ng-container [ngSwitch]="taskModal">
          <div *ngSwitchCase="'goals'">
            <h2>Set or Update Sustainability Goals</h2>
            <form class="shm-goals-form">
              <label>CO₂ Reduction Target (%)</label>
              <input type="number" min="0" max="100" [(ngModel)]="goalCO2" name="goalCO2" placeholder="e.g. 10" />
              <label>Water Reduction Target (%)</label>
              <input type="number" min="0" max="100" [(ngModel)]="goalWater" name="goalWater" placeholder="e.g. 8" />
              <label>Waste Reduction Target (%)</label>
              <input type="number" min="0" max="100" [(ngModel)]="goalWaste" name="goalWaste" placeholder="e.g. 15" />
              <label>Diversity Target (%)</label>
              <input type="number" min="0" max="100" [(ngModel)]="goalDiversity" name="goalDiversity" placeholder="e.g. 50" />
              <button class="shm-modal-btn" type="button" (click)="saveGoals()">Save Goals</button>
            </form>
            <div class="shm-modal-info">
              <b>Current Goals:</b>
              <ul>
                <li>CO₂: ↓ 10% (2024)</li>
                <li>Water: ↓ 8% (2024)</li>
                <li>Waste: ↓ 15% (2024)</li>
                <li>Diversity: 50% women in leadership</li>
              </ul>
            </div>
          </div>
          <div *ngSwitchCase="'projects'">
            <h2>Projects to Review</h2>
            <ul class="shm-modal-list">
              <li><b>Solar Panel Expansion:</b> Awaiting approval. <span class="pending">Pending</span></li>
              <li><b>Water Conservation:</b> Needs review. <span class="pending">Pending</span></li>
              <li><b>Zero-Waste Office:</b> In review. <span class="in-review">In Review</span></li>
            </ul>
            <button class="shm-modal-btn" (click)="closeTaskModal()">Close</button>
          </div>
          <div *ngSwitchCase="'compliance'">
            <h2>Compliance Alerts</h2>
            <ul class="shm-modal-list">
              <li>Water usage above target <span class="alert">Due: 2024-05-10</span></li>
              <li>Supplier audit overdue <span class="alert">Due: 2024-05-15</span></li>
            </ul>
            <button class="shm-modal-btn" (click)="closeTaskModal()">Close</button>
          </div>
          <div *ngSwitchCase="'team'">
            <h2>Team Collaboration</h2>
            <ul class="shm-modal-list">
              <li>Priya: "Ready for Q2 report review."</li>
              <li>John: "Supplier audit scheduled."</li>
              <li>Aisha: "Data for Plant B updated."</li>
            </ul>
            <button class="shm-modal-btn" (click)="closeTaskModal()">Close</button>
          </div>
          <div *ngSwitchCase="'report'">
            <h2>Download ESG Report</h2>
            <p>Your latest ESG report is ready for download.</p>
            <button class="shm-modal-btn" (click)="closeTaskModal()">Download PDF</button>
          </div>
          <div *ngSwitchCase="'share'">
            <h2>Share ESG Report</h2>
            <p>Share your ESG report with the board or stakeholders.</p>
            <button class="shm-modal-btn" (click)="closeTaskModal()">Share via Email</button>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .shm-main {
      padding: 2.5rem 1.5rem;
      max-width: 1200px;
      margin: 2rem auto;
      background: linear-gradient(120deg, #f0f4ff 0%, #e0e7ff 100%);
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: fadeInMain 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInMain {
      0% { opacity: 0; transform: translateY(40px) scale(0.97); }
      100% { opacity: 1; transform: none; }
    }
    .shm-header {
      width: 100%;
      background: linear-gradient(135deg, #6c63ff, #2d2e83);
      color: #fff;
      padding: 1.2rem 2rem;
      border-radius: 0 0 1.2rem 1.2rem;
      box-shadow: 0 4px 16px 0 #6c63ff22;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: fadeInHeader 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInHeader {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: none; }
    }
    .shm-header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .shm-header-logo {
      font-size: 1.8rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 2px 2px 4px #6c63ff88;
    }
    .shm-header-welcome {
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(90deg, #fff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .shm-header-role {
      font-weight: 700;
      color: #fff;
    }
    .shm-darkmode-toggle {
      background: #e84393;
      color: #fff;
      padding: 0.45rem 1rem;
      border-radius: 0.7rem;
      border: none;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 2px 8px 0 #e8439355;
    }
    .shm-darkmode-toggle:hover {
      background: #c53070;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px 0 #e8439366;
    }
    .shm-darkmode-toggle:active {
      background: #388e3c;
    }
    .shm-quick-stats-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
      margin-bottom: 2.5rem;
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    .shm-quick-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .stat-label {
      font-size: 0.9rem;
      color: #4a4a68;
      margin-bottom: 0.3rem;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2d2e83;
    }
    .shm-progress-circles-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 2rem;
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
      margin-bottom: 2.5rem;
      justify-content: center;
    }
    .shm-progress-circle-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      min-width: 120px;
      max-width: 150px;
      width: 100%;
      margin-bottom: 1.5rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    .shm-progress-circle-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px 0 #6c63ff33;
    }
    .shm-progress-circle {
      transform: rotate(-90deg); /* Start from the top */
      transform-origin: 50% 50%;
    }
    .shm-progress-circle circle {
      transition: stroke-dashoffset 1s;
    }
    .shm-progress-label {
      font-size: 0.9rem;
      color: #4a4a68;
      margin-top: 0.8rem;
    }
    .shm-progress-value {
      font-size: 1.8rem;
      font-weight: 900;
      color: #2d2e83;
      margin-top: 0.3rem;
    }
    .shm-tasks-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2.5rem;
      animation: fadeInTasks 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInTasks {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: none; }
    }
    .shm-tasks-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 2.2rem;
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
    }
    .shm-task-card {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      min-width: 280px;
      max-width: 370px;
      width: 100%;
      margin-bottom: 1.2rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInCard {
      0% { opacity: 0; transform: translateY(40px) scale(0.97); }
      100% { opacity: 1; transform: none; }
    }
    .shm-task-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px 0 #6c63ff33;
    }
    .shm-task-icon {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 0 8px #4bc0c0cc);
    }
    .shm-task-h3 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2d2e83;
      margin-bottom: 0.8rem;
      text-align: center;
    }
    .shm-task-p {
      font-size: 1rem;
      color: #4a4a68;
      margin-bottom: 1.2rem;
      text-align: center;
    }
    .shm-task-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      text-align: center;
    }
    .shm-task-list li {
      font-size: 0.95rem;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .shm-task-list li span {
      font-weight: 600;
      color: #2d2e83;
    }
    .pending {
      color: #6c63ff;
    }
    .in-review {
      color: #e84393;
    }
    .alert {
      color: #e84393;
      font-weight: 600;
    }
    .shm-task-btn {
      background: linear-gradient(120deg, #6c63ff, #2d2e83);
      color: #fff;
      padding: 0.45rem 1.1rem;
      border-radius: 0.7rem;
      border: none;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 2px 8px 0 #6c63ff22;
      margin-top: 1.2rem;
      margin-right: 0.7rem;
    }
    .shm-task-btn:hover {
      background: linear-gradient(120deg, #2d2e83, #6c63ff);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px 0 #6c63ff33;
    }
    .shm-task-btn:active {
      background: #388e3c;
      color: #fff;
    }
    .shm-task-btn.alt {
      background: #e84393;
      margin-left: 0.7rem;
    }
    .shm-task-btn.alt:hover {
      background: #c53070;
    }
    .shm-task-list {
      margin-bottom: 1.2rem;
    }
    .shm-features-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2.5rem;
      animation: fadeInFeatures 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInFeatures {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: none; }
    }
    .shm-features-hero {
      position: relative;
      width: 100%;
      height: 300px;
      border-radius: 1.2rem;
      overflow: hidden;
      margin-bottom: 2.5rem;
      box-shadow: 0 8px 32px 0 #6c63ff22;
      animation: fadeInHero 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInHero {
      0% { opacity: 0; transform: translateY(40px); }
      100% { opacity: 1; transform: none; }
    }
    .shm-features-hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('https://images.unsplash.com/photo-1517486803460-6396898505c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
      filter: blur(5px) brightness(0.7);
      z-index: -1;
    }
    .shm-features-hero-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      z-index: 1;
    }
    .shm-features-hero-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 15px #4bc0c0cc);
    }
    .shm-features-hero-title {
      font-size: 2.8rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      color: #fff;
      text-shadow: 2px 2px 4px #6c63ff88;
    }
    .shm-features-hero-role {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.5px;
      text-shadow: 1px 1px 2px #6c63ff88;
    }
    .shm-features-hero-lead {
      font-size: 1.1rem;
      color: #fff;
      margin-top: 0.8rem;
      max-width: 800px;
      padding: 0 1rem;
      text-shadow: 1px 1px 2px #6c63ff88;
    }
    .shm-features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.2rem;
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
    }
    .shm-feature-card {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      min-width: 320px;
      max-width: 420px;
      width: 100%;
      margin-bottom: 1.5rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInCard {
      0% { opacity: 0; transform: translateY(40px) scale(0.97); }
      100% { opacity: 1; transform: none; }
    }
    .shm-feature-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px 0 #6c63ff33;
    }
    .shm-feature-icon {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 0 8px #4bc0c0cc);
    }
    .shm-feature-icon.shm-feature-icon-large {
      font-size: 3rem;
      margin-bottom: 0.8rem;
    }
    .shm-feature-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: #2d2e83;
      margin-bottom: 0.8rem;
      text-align: center;
    }
    .shm-feature-title.shm-feature-title-small {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
    }
    .shm-feature-lead {
      font-size: 1rem;
      color: #4a4a68;
      margin-bottom: 1.2rem;
      text-align: center;
    }
    .shm-feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      text-align: center;
    }
    .shm-feature-list li {
      font-size: 0.95rem;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .shm-feature-list li i {
      margin-right: 0.5rem;
      color: #6c63ff;
    }
    .shm-feature-list li b {
      color: #2d2e83;
      font-weight: 700;
    }
    .shm-feature-list li span {
      color: #388e3c;
      font-weight: 600;
    }
    .shm-footer {
      width: 100%;
      background: linear-gradient(135deg, #2d2e83, #6c63ff);
      color: #fff;
      padding: 1.5rem 2rem;
      border-radius: 1.2rem 1.2rem 0 0;
      box-shadow: 0 -4px 16px 0 #6c63ff22;
      margin-top: 2rem;
      text-align: center;
      font-size: 0.9rem;
      animation: fadeInFooter 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInFooter {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: none; }
    }
    .shm-footer-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .shm-footer-content span {
      color: #e0e7ff;
      font-weight: 500;
    }
    .shm-footer-socials {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    .shm-footer-socials a {
      color: #fff;
      font-size: 1.8rem;
      transition: transform 0.2s, color 0.2s;
    }
    .shm-footer-socials a:hover {
      transform: translateY(-3px);
      color: #e0e7ff;
    }
    .shm-kpi-row {
      display: flex;
      gap: 2rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .shm-kpi-card {
      background: linear-gradient(120deg, #e0f7fa 0%, #e3e6ff 100%);
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.2rem 2rem;
      min-width: 160px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform 0.18s, box-shadow 0.18s;
      border: 2px solid #6c63ff22;
      animation: fadeInKPI 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    .shm-kpi-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px 0 #6c63ff33;
    }
    @keyframes fadeInKPI {
      0% { opacity: 0; transform: translateY(30px) scale(0.95); }
      100% { opacity: 1; transform: none; }
    }
    .shm-kpi-icon {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 0 8px #4bc0c0cc);
    }
    .shm-kpi-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2d2e83;
      margin-bottom: 0.3rem;
    }
    .shm-kpi-label {
      font-size: 1rem;
      color: #4a4a68;
      font-weight: 500;
    }
    .shm-kpi-detail {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.5rem;
      text-align: center;
    }
    .shm-content-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.2rem;
      width: 100%;
      margin-top: 1.5rem;
      justify-items: center;
    }
    .shm-graph-card, .shm-projects-card, .shm-compliance-card, .shm-team-card {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      min-width: 280px;
      max-width: 370px;
      width: 100%;
      margin-bottom: 1.2rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInCard {
      0% { opacity: 0; transform: translateY(40px) scale(0.97); }
      100% { opacity: 1; transform: none; }
    }
    .shm-graph-label {
      color: #388e3c;
      font-size: 1rem;
      margin-top: 0.5rem;
      font-style: italic;
    }
    .shm-project-list {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }
    .shm-project-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0f4ff;
      border-radius: 0.7rem;
      padding: 0.6rem 1rem;
      font-size: 1.05rem;
      font-weight: 500;
      box-shadow: 0 1px 4px 0 #6c63ff11;
      transition: background 0.2s;
    }
    .shm-project-title {
      color: #2d2e83;
    }
    .shm-project-status {
      border-radius: 1rem;
      padding: 0.2rem 0.8rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
      background: #6c63ff;
      &.Active { background: #388e3c; }
      &.Delayed { background: #e84393; }
      &.Completed { background: #2d2e83; }
    }
    .shm-compliance-legend {
      display: flex;
      gap: 1.2rem;
      justify-content: center;
      margin: 0.7rem 0 0.5rem 0;
      font-size: 0.98rem;
    }
    .shm-dot {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      margin-right: 0.3rem;
    }
    .shm-risk-list {
      margin-top: 0.7rem;
      color: #e84393;
      font-size: 1rem;
      text-align: left;
      padding-left: 1.2rem;
    }
    .shm-team-list {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      margin-bottom: 0.7rem;
    }
    .shm-team-member {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      background: #f0f4ff;
      border-radius: 0.7rem;
      padding: 0.5rem 1rem;
      font-size: 1.05rem;
      font-weight: 500;
      box-shadow: 0 1px 4px 0 #6c63ff11;
    }
    .shm-team-avatar {
      font-size: 1.5rem;
      background: #6c63ff;
      color: #fff;
      border-radius: 50%;
      width: 2.2rem;
      height: 2.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .shm-team-name {
      color: #2d2e83;
      font-weight: 700;
    }
    .shm-team-role {
      color: #388e3c;
      font-size: 0.98rem;
      font-weight: 600;
      margin-left: auto;
    }
    .shm-collab-activity {
      margin-top: 0.7rem;
      font-size: 0.98rem;
      color: #2d2e83;
      text-align: left;
    }
    .shm-collab-label {
      font-weight: 700;
      margin-right: 0.5rem;
    }
    .shm-collab-desc {
      color: #6c63ff;
      font-style: italic;
    }
    .shm-activity-feed {
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
      margin-bottom: 2.5rem;
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      min-width: 280px;
      max-width: 370px;
      width: 100%;
      margin-bottom: 1.2rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    .shm-activity-feed h4 {
      font-size: 1.2rem;
      font-weight: 800;
      color: #2d2e83;
      margin-bottom: 1rem;
      text-align: center;
    }
    .shm-activity-feed ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }
    .shm-activity-feed li {
      font-size: 0.95rem;
      color: #4a4a68;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .shm-activity-feed li span {
      font-weight: 600;
      color: #2d2e83;
    }
    .shm-confetti {
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 3rem;
      font-weight: 900;
      color: #6c63ff;
      opacity: 0.8;
      z-index: 10000;
      animation: confetti 3s ease-out;
    }
    @keyframes confetti {
      0% { transform: translateX(-50%) translateY(-50%) rotate(0deg); opacity: 0.8; }
      20% { opacity: 0.8; }
      100% { transform: translateX(-50%) translateY(-50%) rotate(360deg); opacity: 0; }
    }
    @media (max-width: 900px) {
      .shm-main {
        padding: 1rem 0.2rem;
      }
      .shm-header {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1rem;
      }
      .shm-header-content {
        flex-direction: column;
        align-items: center;
      }
      .shm-header-logo {
        font-size: 1.5rem;
      }
      .shm-header-welcome {
        font-size: 1rem;
      }
      .shm-header-role {
        font-size: 1rem;
      }
      .shm-darkmode-toggle {
        margin-top: 0.5rem;
      }
      .shm-quick-stats-bar {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .shm-progress-circles-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .shm-progress-circle-card {
        min-width: 100px;
      }
      .shm-tasks-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .shm-task-card {
        min-width: 250px;
      }
      .shm-features-grid {
        grid-template-columns: 1fr;
        padding: 0 0.5rem;
      }
      .shm-feature-card {
        min-width: 250px;
      }
      .shm-kpi-row {
        gap: 1rem;
      }
      .shm-content-row {
        gap: 1rem;
        grid-template-columns: 1fr;
      }
      .shm-activity-feed {
        min-width: 250px;
      }
    }
    /* New styles for modal and backdrop */
    .shm-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeInBackdrop 0.5s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInBackdrop {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .shm-modal {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 10px 30px 0 #6c63ff44;
      padding: 2.5rem;
      max-width: 500px;
      width: 90%;
      position: relative;
      animation: fadeInModal 0.5s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInModal {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: none; }
    }
    .shm-modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: #e84393;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      font-size: 1.5rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px 0 #e8439355;
      transition: background 0.2s, transform 0.1s;
    }
    .shm-modal-close:hover {
      background: #c53070;
      transform: rotate(90deg);
    }
    .shm-modal-close:active {
      background: #388e3c;
    }
    .shm-modal-btn {
      background: linear-gradient(120deg, #6c63ff, #2d2e83);
      color: #fff;
      padding: 0.7rem 1.5rem;
      border-radius: 0.7rem;
      border: none;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 2px 8px 0 #6c63ff22;
      margin-top: 1.5rem;
      margin-right: 0.7rem;
    }
    .shm-modal-btn:hover {
      background: linear-gradient(120deg, #2d2e83, #6c63ff);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px 0 #6c63ff33;
    }
    .shm-modal-btn:active {
      background: #388e3c;
      color: #fff;
    }
    .shm-modal-btn.alt {
      background: #e84393;
      margin-left: 0.7rem;
    }
    .shm-modal-btn.alt:hover {
      background: #c53070;
    }
    .shm-goals-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .shm-goals-form label {
      font-size: 1rem;
      font-weight: 600;
      color: #2d2e83;
      margin-bottom: 0.5rem;
    }
    .shm-goals-form input {
      padding: 0.8rem 1rem;
      border: 1px solid #ccc;
      border-radius: 0.7rem;
      font-size: 1rem;
      color: #333;
      transition: border-color 0.2s;
    }
    .shm-goals-form input:focus {
      outline: none;
      border-color: #6c63ff;
      box-shadow: 0 0 8px #6c63ff55;
    }
    .shm-modal-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }
    .shm-modal-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0f4ff;
      border-radius: 0.7rem;
      padding: 0.8rem 1.2rem;
      font-size: 1.05rem;
      font-weight: 500;
      box-shadow: 0 1px 4px 0 #6c63ff11;
    }
    .shm-modal-list li b {
      color: #2d2e83;
      font-weight: 700;
    }
    .shm-modal-list li span {
      color: #6c63ff;
      font-weight: 600;
    }
    .shm-modal-info {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }
    .shm-modal-info b {
      color: #2d2e83;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .shm-modal-info ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .shm-modal-info ul li {
      font-size: 0.95rem;
      color: #4a4a68;
    }
    /* New styles for .src-header, .src-dashboard-main, .src-hero-section, .src-responsibilities-grid, .src-resp-card, .src-footer */
    .src-header {
      width: 100%;
      background: linear-gradient(135deg, #2d2e83, #6c63ff);
      color: #fff;
      padding: 1.2rem 2rem;
      border-radius: 0 0 1.2rem 1.2rem;
      box-shadow: 0 4px 16px 0 #6c63ff22;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: fadeInHeader 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInHeader {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: none; }
    }
    .src-header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .src-header-logo {
      font-size: 1.8rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 2px 2px 4px #6c63ff88;
    }
    .src-header-welcome {
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(90deg, #fff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .src-header-role {
      font-weight: 700;
      color: #fff;
    }
    .src-dashboard-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2.5rem;
      animation: fadeInFeatures 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    .src-hero-section {
      position: relative;
      width: 100%;
      height: 300px;
      border-radius: 1.2rem;
      overflow: hidden;
      margin-bottom: 2.5rem;
      box-shadow: 0 8px 32px 0 #6c63ff22;
      animation: fadeInHero 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInHero {
      0% { opacity: 0; transform: translateY(40px); }
      100% { opacity: 1; transform: none; }
    }
    .src-hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('https://images.unsplash.com/photo-1517486803460-6396898505c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
      filter: blur(5px) brightness(0.7);
      z-index: -1;
    }
    .src-hero-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      z-index: 1;
    }
    .src-hero-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 15px #4bc0c0cc);
    }
    .src-hero-title {
      font-size: 2.8rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      color: #fff;
      text-shadow: 2px 2px 4px #6c63ff88;
    }
    .src-hero-role {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.5px;
      text-shadow: 1px 1px 2px #6c63ff88;
    }
    .src-hero-lead {
      font-size: 1.1rem;
      color: #fff;
      margin-top: 0.8rem;
      max-width: 800px;
      padding: 0 1rem;
      text-shadow: 1px 1px 2px #6c63ff88;
    }
    .src-responsibilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.2rem;
      width: 92%;
      max-width: 1200px;
      padding: 0 1.5rem;
    }
    .src-resp-card {
      background: #fff;
      border-radius: 1.2rem;
      box-shadow: 0 2px 12px 0 #6c63ff22;
      padding: 1.5rem 1.2rem 1.2rem 1.2rem;
      min-width: 320px;
      max-width: 420px;
      width: 100%;
      margin-bottom: 1.5rem;
      animation: fadeInCard 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInCard {
      0% { opacity: 0; transform: translateY(40px) scale(0.97); }
      100% { opacity: 1; transform: none; }
    }
    .src-resp-card:hover {
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px 0 #6c63ff33;
    }
    .src-resp-icon {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      filter: drop-shadow(0 0 8px #4bc0c0cc);
    }
    .src-resp-h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: #2d2e83;
      margin-bottom: 0.8rem;
      text-align: center;
    }
    .src-resp-p {
      font-size: 1rem;
      color: #4a4a68;
      margin-bottom: 1.2rem;
      text-align: center;
    }
    .src-footer {
      width: 100%;
      background: linear-gradient(135deg, #2d2e83, #6c63ff);
      color: #fff;
      padding: 1.5rem 2rem;
      border-radius: 1.2rem 1.2rem 0 0;
      box-shadow: 0 -4px 16px 0 #6c63ff22;
      margin-top: 2rem;
      text-align: center;
      font-size: 0.9rem;
      animation: fadeInFooter 1.2s cubic-bezier(.8,-0.6,0,1.5);
    }
    @keyframes fadeInFooter {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: none; }
    }
    .src-footer-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .src-footer-content span {
      color: #e0e7ff;
      font-weight: 500;
    }
  `],
  animations: [
    // Simple fade/slide animations for cards
    {
      trigger: 'fadeIn',
      transitions: [
        { type: 'enter', styles: { opacity: 0, transform: 'translateY(20px)' }, animate: '0.7s cubic-bezier(.8,-0.6,0,1.5)', to: { opacity: 1, transform: 'none' } }
      ]
    },
    {
      trigger: 'slideIn',
      transitions: [
        { type: 'enter', styles: { opacity: 0, transform: 'translateX(-40px)' }, animate: '0.7s cubic-bezier(.8,-0.6,0,1.5)', to: { opacity: 1, transform: 'none' } }
      ]
    }
  ]
})
export class RoleDetailsComponent implements OnInit, OnDestroy {
  role = '';
  username = '';
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  kpis: any[] = [];
  projects: any[] = [];
  team: any[] = [];
  recentCollab = '';

  analystKpis: any[] = [];
  analystAnalyses: any[] = [];
  analystTeam: any[] = [];
  analystRecentCollab = '';

  kpiDetail: any;
  kpiDetailDetail: string = '';

  compliance: any;
  stakeholderEngagement: any[] = [];
  news: any[] = [];

  staticKpis: any[] = [
    { icon: '📈', label: 'ESG Score', value: 87.2, detail: 'Composite score based on environmental, social, and governance metrics. Updated quarterly.' },
    { icon: '🌱', label: 'CO₂ Footprint', value: 120, detail: 'Total carbon emissions for the current year.' },
    { icon: '📊', label: 'Projects Overseen', value: 5, detail: 'Number of active sustainability projects under management.' },
    { icon: '⚖️', label: 'Compliance Rate', value: 98, detail: 'Percentage of compliance with ESG regulations and standards.' },
    { icon: '💰', label: 'Cost Savings', value: 1200000, detail: 'Estimated cost savings from sustainability initiatives.' },
  ];

  staticProjects: any[] = [
    { title: 'Solar Panel Expansion', progress: 70, status: 'Active', summary: 'Expanding solar capacity by 30% in 2024. Estimated annual savings: $400K.' },
    { title: 'Water Conservation', progress: 40, status: 'Delayed', summary: 'Reducing water usage by 15% through smart sensors and employee engagement.' },
    { title: 'Diversity Training', progress: 100, status: 'Completed', summary: 'All staff completed diversity & inclusion training. Improved workplace satisfaction by 12%.' },
    { title: 'Waste Reduction', progress: 55, status: 'Active', summary: 'Reducing landfill waste by 20% this year. Composting program launched.' },
  ];

  staticTeam: any[] = [
    { avatar: '👩‍💼', name: 'Priya Sharma', role: 'ESG Analyst' },
    { avatar: '👨‍🔬', name: 'Rahul Mehta', role: 'Sustainability Scientist' },
    { avatar: '👩‍💻', name: 'Aisha Khan', role: 'Data Engineer' },
    { avatar: '👨‍💼', name: 'John Lee', role: 'Compliance Officer' },
  ];

  taskModal: string | null = null;
  goalCO2: number = 10;
  goalWater: number = 8;
  goalWaste: number = 15;
  goalDiversity: number = 50;

  darkMode: boolean = false;
  showConfetti: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private dataService: DashboardDataService,
    private translationService: RoleDetailsTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Role Details language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Role Details translations not loaded yet');
      }
    }, 1000);
    this.route.queryParamMap.subscribe(params => {
      this.role = params.get('role') || '';
      this.username = params.get('user') || '';
      // Load all data after role is set
      this.dataService.getKpis(this.role).subscribe((kpis: any[]) => {
        if (this.role === 'ESG Analyst') this.analystKpis = kpis;
        else this.kpis = kpis;
      });
      this.dataService.getProjects(this.role).subscribe((projects: any[]) => {
        if (this.role === 'ESG Analyst') this.analystAnalyses = projects;
        else this.projects = projects;
      });
      this.dataService.getTeam(this.role).subscribe((team: any[]) => {
        if (this.role === 'ESG Analyst') this.analystTeam = team;
        else this.team = team;
      });
      this.dataService.getRecentCollab(this.role).subscribe((collab: string) => {
        if (this.role === 'ESG Analyst') this.analystRecentCollab = collab;
        else this.recentCollab = collab;
      });
      this.dataService.getCompliance(this.role).subscribe((compliance: any) => {
        this.compliance = compliance;
      });
      if (this.role === 'Sustainability Head Manager') {
        this.dataService.getStakeholderEngagement().subscribe((eng: any[]) => {
          this.stakeholderEngagement = eng;
        });
        this.dataService.getNews().subscribe((news: any[]) => {
          this.news = news;
        });
      }
    });
  }

  openKpiDetail(kpi: any) {
    this.kpiDetail = kpi;
    this.kpiDetailDetail = `This is a placeholder for the detail view of the ${kpi.label} KPI.`;
  }

  closeKpiDetail() {
    this.kpiDetail = null;
    this.kpiDetailDetail = '';
  }

  openTaskModal(type: string) {
    this.taskModal = type;
  }

  closeTaskModal() {
    this.taskModal = null;
  }

  saveGoals() {
    console.log('Saving goals:', {
      CO2: this.goalCO2,
      Water: this.goalWater,
      Waste: this.goalWaste,
      Diversity: this.goalDiversity
    });
    this.showConfetti = true;
    setTimeout(() => {
      this.showConfetti = false;
    }, 3000); // Hide confetti after 3 seconds
    this.closeTaskModal();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  ngOnInit() {
    // Component initialization logic can be added here if needed
  }

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
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