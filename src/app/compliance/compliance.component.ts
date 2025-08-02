import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ComplianceTranslationService } from '../services/compliance-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';
import { DashboardDataService } from '../dashboard-data.service';

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule, UnifiedLanguageToggleComponent],
  template: `
    <main class="compliance-main">
      <div class="compliance-header">
        <div class="header-content">
          <h2>{{ getTranslatedText('COMPLIANCE.TITLE') }} <span class="ai-badge">{{ getTranslatedText('COMPLIANCE.AI_BADGE') }}</span></h2>
          <p>{{ getTranslatedText('COMPLIANCE.SUBTITLE') }}</p>
        </div>
        <app-unified-language-toggle></app-unified-language-toggle>
      </div>
      <section class="compliance-cards">
        <div class="compliance-card compliance-status">
          <h3>{{ getTranslatedText('COMPLIANCE.AUDIT_STATUS') }}</h3>
          <div class="audit-status" [ngClass]="complianceData?.auditStatus?.toLowerCase()">{{ complianceData?.auditStatus }}</div>
        </div>
        <div class="compliance-card compliance-breakdown">
          <h3>{{ getTranslatedText('COMPLIANCE.COMPLIANCE_BREAKDOWN') }}</h3>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <ng-container *ngIf="complianceData?.complianceBreakdown as breakdown">
              <ng-container *ngFor="let slice of breakdown; let i = index">
                <path [attr.d]="describeArc(60, 60, 50, getStartAngle(i, breakdown), getEndAngle(i, breakdown))"
                      [attr.fill]="'none'" [attr.stroke]="slice.color" stroke-width="18" />
              </ng-container>
            </ng-container>
          </svg>
          <div class="breakdown-legend">
            <div *ngFor="let slice of complianceData?.complianceBreakdown">
              <span class="legend-dot" [style.background]="slice.color"></span> {{ slice.label }} ({{ slice.value }}%)
            </div>
          </div>
        </div>
        <div class="compliance-card risk-alerts">
          <h3>{{ getTranslatedText('COMPLIANCE.RISK_ALERTS') }} <span class="live-dot"></span></h3>
          <ul>
            <li *ngFor="let alert of complianceData?.riskAlerts" (click)="openAlertModal(alert)">
              <span [ngClass]="'alert-' + alert.severity.toLowerCase()">{{ alert.alert }}</span>
              <span class="alert-severity">{{ alert.severity }}</span>
            </li>
            <li *ngIf="!complianceData?.riskAlerts?.length">{{ getTranslatedText('COMPLIANCE.NO_ACTIVE_ALERTS') }}</li>
          </ul>
        </div>
        <div class="compliance-card ai-prediction">
          <h3>{{ getTranslatedText('COMPLIANCE.AI_PREDICTION') }}</h3>
          <div class="ai-prediction-value">{{ aiPrediction }}</div>
          <button class="simulate-btn" (click)="simulateAiInsight()">{{ getTranslatedText('COMPLIANCE.SIMULATE_AI') }}</button>
        </div>
      </section>
      <!-- Regulatory Alignment Section -->
      <section class="regulatory-alignment-section">
        <div class="reg-alignment-card">
          <h3>{{ getTranslatedText('COMPLIANCE.REGULATORY_ALIGNMENT') }} <span class="ai-badge">{{ getTranslatedText('COMPLIANCE.AI_BADGE') }}</span></h3>
          <table class="reg-table">
            <thead>
              <tr>
                <th>{{ getTranslatedText('COMPLIANCE.STANDARD') }}</th>
                <th>{{ getTranslatedText('COMPLIANCE.REGION') }}</th>
                <th>{{ getTranslatedText('COMPLIANCE.COMPLIANCE') }}</th>
                <th>{{ getTranslatedText('COMPLIANCE.LAST_AUDIT') }}</th>
                <th>{{ getTranslatedText('COMPLIANCE.AI_RECOMMENDATIONS') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let reg of regulatoryData">
                <td>{{ reg.name }}</td>
                <td>{{ reg.region }}</td>
                <td>
                  <span class="reg-compliance-bar">
                    <span class="reg-compliance-fill" [style.width.%]="reg.compliance"></span>
                  </span>
                  <span class="reg-compliance-label">{{ reg.compliance }}%</span>
                </td>
                <td>{{ reg.lastAudit }}</td>
                <td>
                  <button class="reg-recommend-btn" (click)="openRegModal(reg)">{{ getTranslatedText('COMPLIANCE.VIEW') }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <div class="compliance-footer">
        <span>{{ getTranslatedText('COMPLIANCE.DATA_UPDATE') }}</span>
      </div>
      <div class="alert-modal" *ngIf="showAlertModal">
        <div class="alert-modal-content">
          <button class="close-btn" (click)="closeAlertModal()">✖</button>
          <h3>{{ getTranslatedText('COMPLIANCE.RISK_ALERT_DETAILS') }}</h3>
          <div *ngIf="selectedAlert">
            <p><strong>{{ getTranslatedText('COMPLIANCE.ALERT') }}:</strong> {{ selectedAlert.alert }}</p>
            <p><strong>{{ getTranslatedText('COMPLIANCE.SEVERITY') }}:</strong> {{ selectedAlert.severity }}</p>
            <p><em>{{ getTranslatedText('COMPLIANCE.AI_INSIGHT') }}</em></p>
          </div>
        </div>
      </div>
      <div class="reg-modal" *ngIf="showRegModal">
        <div class="reg-modal-content">
          <button class="close-btn" (click)="closeRegModal()">✖</button>
          <h3>{{ selectedReg?.name }} {{ getTranslatedText('COMPLIANCE.RECOMMENDATIONS') }}</h3>
          <div *ngIf="selectedReg">
            <p><strong>{{ getTranslatedText('COMPLIANCE.REGION') }}:</strong> {{ selectedReg.region }}</p>
            <p><strong>{{ getTranslatedText('COMPLIANCE.COMPLIANCE') }}:</strong> {{ selectedReg.compliance }}%</p>
            <p><strong>{{ getTranslatedText('COMPLIANCE.LAST_AUDIT') }}:</strong> {{ selectedReg.lastAudit }}</p>
            <p class="genai-recommend">{{ selectedReg.recommendation }}</p>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .compliance-main { padding: 2.5rem 1rem; max-width: 1100px; margin: 0 auto; }
    .compliance-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 2rem; 
      gap: 1rem;
    }
    .header-content { 
      text-align: left; 
      flex: 1;
    }
    .ai-badge { background: linear-gradient(90deg, #6c63ff, #2d2e83); color: #fff; border-radius: 1rem; padding: 0.2rem 0.8rem; font-size: 0.9rem; margin-left: 0.7rem; }
    .compliance-cards { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; }
    .compliance-card { background: #fff; border-radius: 1.2rem; box-shadow: 0 4px 24px #6c63ff22; padding: 1.5rem 2rem; min-width: 240px; min-height: 180px; display: flex; flex-direction: column; align-items: center; position: relative; transition: box-shadow 0.2s; }
    .compliance-card:hover { box-shadow: 0 8px 32px #2d2e8333; }
    .audit-status { font-size: 1.5rem; font-weight: 600; margin-top: 1rem; text-transform: capitalize; }
    .audit-status.passed { color: #4bc0c0; }
    .audit-status.failed { color: #e84393; }
    .compliance-breakdown svg { margin: 1rem 0; }
    .breakdown-legend { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.95rem; }
    .legend-dot { display: inline-block; width: 1rem; height: 1rem; border-radius: 50%; margin-right: 0.5rem; }
    .risk-alerts ul { list-style: none; padding: 0; margin: 0; width: 100%; }
    .risk-alerts li { cursor: pointer; margin: 0.5rem 0; padding: 0.5rem 0.7rem; border-radius: 0.6rem; transition: background 0.15s; display: flex; justify-content: space-between; align-items: center; }
    .risk-alerts li:hover { background: #f3f0ff; }
    .alert-severity { font-size: 0.9rem; font-weight: 500; margin-left: 1rem; }
    .alert-medium { color: #ffce56; }
    .alert-major { color: #e84393; }
    .alert-minor { color: #6c63ff; }
    .live-dot { display: inline-block; width: 0.7rem; height: 0.7rem; background: #e84393; border-radius: 50%; margin-left: 0.5rem; animation: blink 1s infinite alternate; }
    @keyframes blink { 0% { opacity: 1; } 100% { opacity: 0.3; } }
    .ai-prediction-value { font-size: 1.3rem; font-weight: 600; margin: 1rem 0; color: #2d2e83; }
    .simulate-btn { background: #6c63ff; color: #fff; border: none; border-radius: 0.7rem; padding: 0.5rem 1.2rem; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
    .simulate-btn:hover { background: #2d2e83; }
    .compliance-footer { text-align: center; margin-top: 2.5rem; color: #888; font-size: 0.95rem; }
    .alert-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0008; display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .alert-modal-content { background: #fff; border-radius: 1.2rem; padding: 2rem 2.5rem; min-width: 320px; position: relative; box-shadow: 0 8px 32px #2d2e8333; }
    .close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #888; }
    .regulatory-alignment-section { margin: 2.5rem 0 0 0; display: flex; justify-content: center; }
    .reg-alignment-card { background: #fff; border-radius: 1.2rem; box-shadow: 0 4px 24px #6c63ff22; padding: 2rem 2.5rem; min-width: 700px; }
    .reg-table { width: 100%; border-collapse: collapse; font-size: 1rem; }
    .reg-table th, .reg-table td { padding: 0.7rem 0.6rem; text-align: left; }
    .reg-table th { color: #2d2e83; font-weight: 600; border-bottom: 2px solid #e0e7ff; }
    .reg-table tr:not(:last-child) td { border-bottom: 1px solid #f3f0ff; }
    .reg-compliance-bar { display: inline-block; width: 80px; height: 12px; background: #f3f0ff; border-radius: 6px; margin-right: 0.5rem; vertical-align: middle; }
    .reg-compliance-fill { display: inline-block; height: 100%; background: linear-gradient(90deg, #6c63ff, #4bc0c0); border-radius: 6px; transition: width 0.7s; }
    .reg-compliance-label { font-weight: 500; color: #2d2e83; font-size: 0.98rem; }
    .reg-recommend-btn { background: #6c63ff; color: #fff; border: none; border-radius: 0.7rem; padding: 0.3rem 1.1rem; font-size: 0.98rem; cursor: pointer; transition: background 0.2s; }
    .reg-recommend-btn:hover { background: #2d2e83; }
    .reg-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0008; display: flex; align-items: center; justify-content: center; z-index: 1001; }
    .reg-modal-content { background: #fff; border-radius: 1.2rem; padding: 2rem 2.5rem; min-width: 340px; position: relative; box-shadow: 0 8px 32px #2d2e8333; }
    .genai-recommend { background: #f3f0ff; border-left: 4px solid #6c63ff; padding: 1rem; border-radius: 0.7rem; margin-top: 1rem; color: #2d2e83; font-style: italic; }
  `]
})
export class ComplianceComponent implements OnInit, OnDestroy {
  complianceData: any;
  aiPrediction = 'No anomaly detected';
  showAlertModal = false;
  selectedAlert: any = null;
  private sub: Subscription = new Subscription();
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  regulatoryData: any[] = [];
  showRegModal = false;
  selectedReg: any = null;

  constructor(
    private dataService: DashboardDataService,
    private translationService: ComplianceTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Compliance language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Compliance translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    this.fetchData();
    this.sub.add(interval(10000).subscribe(() => this.fetchData()));
    this.updateRegulatoryData();
    this.sub.add(interval(10000).subscribe(() => this.updateRegulatoryData()));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  fetchData() {
    this.dataService.getCompliance('Sustainability Head Manager').subscribe(data => {
      // Simulate AI/ML: randomize risk alerts and compliance breakdown
      if (Math.random() < 0.4) {
        data.riskAlerts = [
          { alert: 'New anomaly detected in water usage', severity: 'Major' },
          { alert: 'Minor delay in waste reporting', severity: 'Minor' }
        ];
        this.aiPrediction = 'Anomaly detected: Water usage spike';
      } else if (Math.random() < 0.5) {
        data.riskAlerts = [
          { alert: 'Compliance at risk: Data sync delay', severity: 'Medium' }
        ];
        this.aiPrediction = 'Potential compliance risk: Data sync';
      } else {
        data.riskAlerts = [
          { alert: 'All systems normal', severity: 'Minor' }
        ];
        this.aiPrediction = 'No anomaly detected';
      }
      // Simulate compliance breakdown changes
      data.complianceBreakdown = data.complianceBreakdown.map((slice: any) => ({
        ...slice,
        value: Math.max(0, Math.min(100, slice.value + Math.round((Math.random() - 0.5) * 4)))
      }));
      this.complianceData = data;
    });
  }

  simulateAiInsight() {
    this.aiPrediction = 'AI Insight: Detected unusual pattern in supplier data.';
    this.complianceData.riskAlerts = [
      { alert: 'Supplier data anomaly', severity: 'Major' },
      { alert: 'Review supplier compliance', severity: 'Medium' }
    ];
  }

  openAlertModal(alert: any) {
    this.selectedAlert = alert;
    this.showAlertModal = true;
  }

  closeAlertModal() {
    this.showAlertModal = false;
    this.selectedAlert = null;
  }

  updateRegulatoryData() {
    // Simulate AI/ML-powered compliance for each standard
    const now = new Date();
    const standards = [
      { name: 'GRI Standards', region: 'Global', key: 'GRI' },
      { name: 'SASB', region: 'Global', key: 'SASB' },
      { name: 'Tadawul ESG Disclosure', region: 'KSA', key: 'Tadawul' },
      { name: 'PDPL', region: 'KSA', key: 'PDPL' },
      { name: 'CSRD', region: 'EU', key: 'CSRD' },
      { name: 'SEC Climate Rule', region: 'US', key: 'SEC' },
      { name: 'Shariah Governance', region: 'Islamic Finance', key: 'Shariah' }
    ];
    this.regulatoryData = standards.map(std => {
      const compliance = Math.round(80 + Math.random() * 20); // 80-100%
      const lastAudit = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 90)
        .toLocaleDateString('en-GB');
      const recommendation = this.genAiRecommendation(std.key, compliance);
      return { ...std, compliance, lastAudit, recommendation };
    });
  }
  openRegModal(reg: any) {
    this.selectedReg = reg;
    this.showRegModal = true;
  }
  closeRegModal() {
    this.showRegModal = false;
    this.selectedReg = null;
  }
  genAiRecommendation(key: string, compliance: number): string {
    switch (key) {
      case 'GRI': return compliance < 90 ? 'Increase disclosure on GRI 305-1 (GHG emissions) and GRI 403 (Occupational Health & Safety).' : 'GRI alignment is strong. Maintain regular updates.';
      case 'SASB': return compliance < 90 ? 'Review SASB sector-specific metrics for material gaps.' : 'SASB compliance is robust. Continue sector engagement.';
      case 'Tadawul': return compliance < 90 ? 'Address gaps in Tadawul ESG Disclosure, especially Board Diversity and Environmental Impact.' : 'Tadawul ESG Disclosure is well-aligned.';
      case 'PDPL': return compliance < 90 ? 'Enhance data privacy controls to meet PDPL requirements.' : 'PDPL compliance is satisfactory.';
      case 'CSRD': return compliance < 90 ? 'Prepare for CSRD double materiality and digital taxonomy.' : 'CSRD readiness is high.';
      case 'SEC': return compliance < 90 ? 'Improve climate risk disclosures for SEC compliance.' : 'SEC Climate Rule compliance is strong.';
      case 'Shariah': return compliance < 90 ? 'Review Shariah governance for Fiqh Muamalat compliance.' : 'Shariah governance is in good standing.';
      default: return 'No recommendation available.';
    }
  }

  // Donut chart helpers
  getStartAngle(i: number, breakdown: any[]) {
    let total = breakdown.reduce((sum, s) => sum + s.value, 0);
    let angle = 0;
    for (let j = 0; j < i; j++) angle += breakdown[j].value / total * 360;
    return angle;
  }
  getEndAngle(i: number, breakdown: any[]) {
    let total = breakdown.reduce((sum, s) => sum + s.value, 0);
    let angle = 0;
    for (let j = 0; j <= i; j++) angle += breakdown[j].value / total * 360;
    return angle;
  }
  describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = this.polarToCartesian(cx, cy, r, endAngle);
    const end = this.polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  }
  polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInDegrees)
    };
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