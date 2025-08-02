import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialTranslationService } from '../services/social-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule, UnifiedLanguageToggleComponent],
  template: `
    <main class="module-main" [class.rtl]="isRTL">
      <div class="header-row">
        <div>
          <h2 class="module-title">{{ getTranslatedText('SOCIAL.TITLE') }}</h2>
          <p class="module-desc">{{ getTranslatedText('SOCIAL.SUBTITLE') }}</p>
        </div>
        <app-unified-language-toggle></app-unified-language-toggle>
      </div>
      <div class="last-updated">{{ getTranslatedText('SOCIAL.LAST_UPDATED') }}: {{ lastUpdated }}</div>
      <div class="dashboard-cards">
        <div class="dashboard-card">
          <h3>🌍 {{ getTranslatedText('SOCIAL.DEI_OVERVIEW') }}</h3>
          <div class="chart-row">
            <div class="pie-chart" title="Diversity Index">
              <svg width="60" height="60" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="#f0f4ff" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#6c63ff" stroke-width="4" stroke-dasharray="45 55" stroke-linecap="round" transform="rotate(-90 18 18)" />
                <text x="18" y="22" text-anchor="middle" font-size="12" fill="#2d2e83">45%</text>
              </svg>
              <div class="chart-label">{{ getTranslatedText('SOCIAL.DIVERSITY') }}</div>
            </div>
            <div class="progress-bar-group">
              <div class="progress-label">{{ getTranslatedText('SOCIAL.EQUITY_SCORE') }} <span class="ai-badge">{{ getTranslatedText('SOCIAL.AI_BADGE') }}</span></div>
              <div class="progress-bar"><div class="progress" style="width:78%"></div></div>
              <div class="progress-label">{{ getTranslatedText('SOCIAL.INCLUSION_SENTIMENT') }} <span class="iot-badge">{{ getTranslatedText('SOCIAL.IOT_BADGE') }}</span></div>
              <div class="progress-bar"><div class="progress" style="width:90%"></div></div>
            </div>
          </div>
        </div>
        <div class="dashboard-card">
          <h3>🧑‍⚖️ {{ getTranslatedText('SOCIAL.LABOR_HUMAN_RIGHTS') }}</h3>
          <div class="progress-label">Compliance Rate <span class="ai-badge">AI</span></div>
          <div class="progress-bar"><div class="progress" style="width:98%"></div></div>
          <div class="progress-label">Incident Reports <span class="iot-badge">IoT</span></div>
          <div class="progress-bar"><div class="progress" style="width:4%"></div></div>
        </div>
        <div class="dashboard-card">
          <h3>🏥 {{ getTranslatedText('SOCIAL.HEALTH_SAFETY_WELLBEING') }}</h3>
          <div class="progress-label">Safety Score <span class="iot-badge">IoT</span></div>
          <div class="progress-bar"><div class="progress" style="width:92%"></div></div>
          <div class="progress-label">Wellbeing Index <span class="ai-badge">AI</span></div>
          <div class="progress-bar"><div class="progress" style="width:87%"></div></div>
        </div>
      </div>
      <div class="table-section">
        <h3 class="table-title">{{ getTranslatedText('SOCIAL.SOCIAL_METRICS_OVERVIEW') }}</h3>
        <table class="metrics-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Metric</th>
              <th>Value</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DEI Dashboards</td>
              <td>Diversity Index</td>
              <td>45%</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>DEI Dashboards</td>
              <td>Equity Score</td>
              <td>78/100</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>DEI Dashboards</td>
              <td>Inclusion Sentiment</td>
              <td>Positive</td>
              <td><span class="iot-badge">IoT</span></td>
            </tr>
            <tr>
              <td>Labor Practices</td>
              <td>Compliance Rate</td>
              <td>98%</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>Labor Practices</td>
              <td>Incident Reports</td>
              <td>2</td>
              <td><span class="iot-badge">IoT</span></td>
            </tr>
            <tr>
              <td>Health & Wellbeing</td>
              <td>Safety Score</td>
              <td>92/100</td>
              <td><span class="iot-badge">IoT</span></td>
            </tr>
            <tr>
              <td>Health & Wellbeing</td>
              <td>Wellbeing Index</td>
              <td>8.7/10</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>Community Impact</td>
              <td>CSR Projects</td>
              <td>5 active</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>Community Impact</td>
              <td>Volunteer Hours</td>
              <td>320</td>
              <td><span class="iot-badge">IoT</span></td>
            </tr>
            <tr>
              <td>Whistleblower Hotline</td>
              <td>Hotline Reports</td>
              <td>1 this month</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>Whistleblower Hotline</td>
              <td>Avg. Response Time</td>
              <td>2h</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>Training Programs</td>
              <td>Completed Trainings</td>
              <td>87%</td>
              <td><span class="ai-badge">AI</span></td>
            </tr>
            <tr>
              <td>Training Programs</td>
              <td>Upcoming Sessions</td>
              <td>3</td>
              <td><span class="iot-badge">IoT</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="data-source-note">Data powered by <span class="ai-badge">AI</span> and <span class="iot-badge">IoT</span> integrations.</div>
      <footer class="footer-updated">Last updated: {{ lastUpdated }}</footer>
    </main>
  `,
  styles: [`
    .module-main { padding: 2rem; max-width: 900px; margin: auto; }
    
    // RTL support
    .module-main.rtl {
      direction: rtl;
      text-align: right;
    }
    
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .module-main.rtl .header-row {
      flex-direction: row-reverse;
    }
    .module-title { font-size: 2rem; font-weight: 800; color: #2d2e83; margin-bottom: 0.5rem; }
    .module-desc { font-size: 1.1rem; color: #4a4a68; margin-bottom: 2rem; }
    .dashboard-cards { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .dashboard-card { background: #f7f9ff; border-radius: 1.2rem; box-shadow: 0 2px 8px #6c63ff11; padding: 1.2rem 1.5rem; flex: 1 1 260px; min-width: 260px; max-width: 320px; }
    .dashboard-card h3 { margin-top: 0; font-size: 1.1rem; color: #2d2e83; margin-bottom: 1rem; }
    .chart-row { display: flex; align-items: center; gap: 1.2rem; }
    .pie-chart { display: flex; flex-direction: column; align-items: center; margin-right: 1.2rem; }
    .pie-chart svg { display: block; margin-bottom: 0.2rem; }
    .chart-label { font-size: 0.95rem; color: #6c63ff; font-weight: 600; }
    .progress-bar-group { flex: 1; }
    .progress-label { font-size: 0.95rem; color: #4a4a68; margin-top: 0.5rem; margin-bottom: 0.2rem; font-weight: 500; }
    .progress-bar { background: #e3e6ff; border-radius: 0.7em; height: 0.9em; width: 100%; margin-bottom: 0.6em; overflow: hidden; }
    .progress { background: linear-gradient(90deg, #6c63ff 0%, #4bc0c0 100%); height: 100%; border-radius: 0.7em; }
    .table-section { margin-top: 2.5rem; }
    .table-title { font-size: 1.2rem; color: #2d2e83; font-weight: 700; margin-bottom: 0.7rem; }
    .metrics-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 12px #6c63ff11; }
    .metrics-table th, .metrics-table td { padding: 0.7em 1em; text-align: left; }
    .metrics-table th { background: #6c63ff; color: #fff; font-weight: 700; }
    .metrics-table tr:nth-child(even) { background: #f7f9ff; }
    .metrics-table tr:nth-child(odd) { background: #e3e6ff22; }
    .ai-badge { background: #6c63ff; color: #fff; border-radius: 0.7em; padding: 0.1em 0.6em; font-size: 0.85em; margin-left: 0.4em; font-weight: 600; }
    .iot-badge { background: #4bc0c0; color: #fff; border-radius: 0.7em; padding: 0.1em 0.6em; font-size: 0.85em; margin-left: 0.4em; font-weight: 600; }
    .data-source-note { margin-top: 2rem; font-size: 0.98rem; color: #205c20; text-align: center; font-style: italic; }
    .last-updated { font-size: 0.98rem; color: #6c63ff; margin-bottom: 1.2rem; font-style: italic; text-align: right; }
    .footer-updated {
      margin-top: 2.5rem;
      padding: 1rem 0 0.5rem 0;
      font-size: 1rem;
      color: #fff;
      background: linear-gradient(90deg, #6c63ff 0%, #4bc0c0 100%);
      text-align: center;
      border-radius: 0 0 1.2rem 1.2rem;
      box-shadow: 0 -2px 12px #6c63ff22;
      font-style: italic;
    }
    @media (max-width: 900px) {
      .dashboard-cards { flex-direction: column; gap: 1.2rem; }
      .dashboard-card { max-width: 100%; }
    }
  `]
})
export class SocialComponent implements OnInit, OnDestroy {
  lastUpdated = new Date().toLocaleString();
  private intervalId: any;
  
  // Translation properties
  currentLanguage = 'en';
  isRTL = false;
  private translationSubscription?: Subscription;

  constructor(private translationService: SocialTranslationService) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.isRTL = this.translationService.isRTL();

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.isRTL = this.translationService.isRTL();
      console.log('Social language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Social translations not loaded yet');
      }
    }, 1000);
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.lastUpdated = new Date().toLocaleString();
    }, 60000); // update every minute
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }


} 