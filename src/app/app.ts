import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(.8,-0.6,0,1.5)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class App {
  protected readonly title = signal('esg-app');
  public loginRole: string = '';
  public loginUsername: string = '';



  modules = [
    { title: 'Environmental', icon: '🌱', route: 'environmental', details: 'Track emissions, energy, waste, and more.', data: 'CO₂: 120t, Energy: 80MWh' },
    { title: 'Social', icon: '🤝', route: 'social', details: 'Diversity, labor, community engagement.', data: 'Diversity: 45%, Engagement: High' },
    { title: 'Governance', icon: '🏛️', route: 'governance', details: 'Board, ethics, transparency.', data: 'Board: 8, Ethics: A+' },
    { title: 'Reporting & Analytics', icon: '📊', route: 'reporting', details: 'Generate ESG reports, analytics.', data: 'Reports: 12, Analytics: 5' },
    { title: 'Integrations & Data Sources', icon: '🔗', route: 'integrations', details: 'Connect to external data sources.', data: 'APIs: 6, Sources: 10' },
    { title: 'Compliance & Risk Management', icon: '⚖️', route: 'compliance', details: 'Monitor compliance, manage risk.', data: 'Risks: 2, Compliance: 98%' },
    { title: 'AI & Predictive Features', icon: '🤖', route: 'ai', details: 'AI-driven insights and predictions.', data: 'Predictions: 3, Accuracy: 92%' },
    { title: 'Localization & Globalization', icon: '🌍', route: 'localization', details: 'Multi-language, region support.', data: 'Languages: 5, Regions: 4' },
    { title: 'Security & Data Governance', icon: '🔒', route: 'security', details: 'Data privacy, security controls.', data: 'Incidents: 0, Audits: 2' },
    { title: 'User Experience & Collaboration', icon: '👥', route: 'ux', details: 'Collaboration tools, UX.', data: 'Users: 120, Teams: 8' }
  ];

  constructor(private router: Router) {}

  // Public getters for template access
  get isLoginPage(): boolean {
    try {
      return this.router.url === '/login';
    } catch {
      return false;
    }
  }



  goToModule(route: string) {
    this.router.navigate([route]);
  }

  handleLogin() {
    if (this.loginRole === 'Sustainability Head Manager') {
      this.router.navigate(['/environmental-dashboard']);
    } else if (this.loginRole === 'Sustainability Risk and Compliance Technology Specialist') {
      window.location.href = `/sustainability-risk-specialist?user=${encodeURIComponent(this.loginUsername)}`;
    } else if (this.loginRole === 'Green Building and Energy Modelling Specialist') {
      window.location.href = `/green-building-energy-modelling?user=${encodeURIComponent(this.loginUsername)}`;
    } else if (this.loginRole === 'ESG IoT and Smart Tech Engineer') {
      window.location.href = `/esg-iot-smart-tech?user=${encodeURIComponent(this.loginUsername)}`;
    } else {
      window.location.href = `/role-details?role=${encodeURIComponent(this.loginRole)}&user=${encodeURIComponent(this.loginUsername)}`;
    }
  }
}
