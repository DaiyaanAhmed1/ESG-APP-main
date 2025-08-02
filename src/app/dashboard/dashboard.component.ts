import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { DashboardTranslationService } from '../services/dashboard-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-60px)' }),
        animate('700ms cubic-bezier(.8,-0.6,0,1.5)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private _stats = [
    { icon: '🌱', value: '120t', label: 'CO₂ Emissions', key: 'co2' },
    { icon: '🤝', value: '45%', label: 'Employee Diversity', key: 'diversity' },
    { icon: '⚖️', value: '98%', label: 'Compliance Score', key: 'compliance' },
    { icon: '🔗', value: '10', label: 'Active Integrations', key: 'integrations' },
    { icon: '🤖', value: '92%', label: 'AI Accuracy', key: 'ai' }
  ];

  get stats() {
    return this._stats.map(stat => ({
      ...stat,
      label: this.getTranslatedText(`STATS.${stat.key.toUpperCase()}`)
    }));
  }

  private _modules = [
    { title: 'Environmental', icon: '🌱', route: 'environmental', description: 'Track emissions, energy, waste, and resource usage to drive sustainability.', graph: '0,30 20,10 40,20 60,5 80,25 100,10', extra: 'Last month: -8% CO₂, 80MWh energy saved', key: 'environmental' },
    { title: 'Social', icon: '🤝', route: 'social', description: 'Monitor diversity, labor practices, and community engagement for social impact.', graph: '0,40 20,30 40,10 60,30 80,20 100,40', extra: 'Employee engagement: High, Diversity: 45%', key: 'social' },
    { title: 'Governance', icon: '🏛️', route: 'governance', description: 'Ensure strong leadership, ethics, and transparency in governance.', graph: '0,30 20,10 40,40 60,20 80,50 100,30', extra: 'Board size: 8, Ethics rating: A+', key: 'governance' },
    { title: 'Reporting & Analytics', icon: '📊', route: 'reporting', description: 'Generate ESG reports and analytics for compliance and insights.', graph: '0,50 20,40 40,20 60,30 80,10 100,40', extra: 'Reports generated: 312, Analytics: 5', key: 'reporting' },
    { title: 'Integrations & Data Sources', icon: '🔗', route: 'integrations', description: 'Connect and unify data from multiple sources and APIs.', graph: '0,20 20,30 40,50 60,40 80,10 100,30', extra: 'APIs: 6, Data sources: 10', key: 'integrations' },
    { title: 'Compliance & Risk Management', icon: '⚖️', route: 'compliance', description: 'Monitor compliance and manage risks with automated tools.', graph: '0,30 20,50 40,20 60,40 80,30 100,10', extra: 'Risks: 2, Compliance: 98%', key: 'compliance' },
    { title: 'AI & Predictive Features', icon: '🤖', route: 'ai', description: 'Leverage AI for predictive analytics and actionable ESG insights.', graph: '0,10 20,30 40,20 60,50 80,40 100,30', extra: 'Predictions: 3, Accuracy: 92%', key: 'ai' },
    { title: 'Localization & Globalization', icon: '🌍', route: 'localization', description: 'Support multiple languages and regions for global teams.', graph: '0,30 20,20 40,40 60,10 80,50 100,30', extra: 'Languages: 5, Regions: 4', key: 'localization' },
    { title: 'Security & Data Governance', icon: '🔒', route: 'security', description: 'Protect data privacy and ensure robust security controls.', graph: '0,50 20,30 40,40 60,20 80,10 100,30', extra: 'Incidents: 0, Audits: 2', key: 'security' },
    { title: 'User Experience & Collaboration', icon: '👥', route: 'ux', description: 'Enhance collaboration and user experience across teams.', graph: '0,20 20,40 40,30 60,50 80,30 100,10', extra: 'Users: 120, Teams: 8', key: 'ux' }
  ];

  get modules() {
    return this._modules.map(module => ({
      ...module,
      title: this.getTranslatedText(`MODULES.${module.key.toUpperCase()}_TITLE`),
      description: this.getTranslatedText(`MODULES.${module.key.toUpperCase()}_DESC`),
      extra: this.getTranslatedText(`MODULES.${module.key.toUpperCase()}_EXTRA`)
    }));
  }

  private _highlights = [
    { key: 'region', title: 'Top Performing Region', value: 'Europe (Avg ESG Score: 91.4)' },
    { key: 'achievement', title: 'Recent Achievement', value: 'Zero data breaches in the last 12 months' },
    { key: 'feature', title: 'Upcoming Feature', value: 'Automated ESG Risk Alerts (Beta)' }
  ];

  get highlights() {
    return this._highlights.map(highlight => ({
      ...highlight,
      title: this.getTranslatedText(`HIGHLIGHTS.${highlight.key.toUpperCase()}_TITLE`),
      value: this.getTranslatedText(`HIGHLIGHTS.${highlight.key.toUpperCase()}_VALUE`)
    }));
  }

  aiModalOpen = false;
  aiModalTitle = '';
  aiModalContent = '';
  aiModalType = '';
  aiModalKey = '';

  private sub: Subscription = new Subscription();
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  chatOpen = false;
  chatInput = '';
  get chatHistory(): { user: boolean, text: string }[] {
    return [
      { user: false, text: this.getTranslatedText('AI_ASSISTANT.WELCOME_MESSAGE') }
    ];
  }

  // Advanced features
  moduleSearch = '';
  chartType: 'bar' | 'line' = 'bar';

  showGraphPopup = false;
  showLoginPopup = false;
  loginUsername = '';
  loginPassword = '';
  loginRole = 'Sustainability Head Manager';
  roles = [
    'Sustainability Head Manager',
    'ESG Analyst',
    'Sustainability Risk and Compliance Technology Specialist',
    'Green Building and Energy Modelling Specialist',
    'ESG IoT and Smart Tech Engineer'
  ];

  openGraphPopup() {
    this.showGraphPopup = true;
  }

  closeGraphPopup() {
    this.showGraphPopup = false;
  }

  openLoginPopup() {
    this.showLoginPopup = true;
  }
  closeLoginPopup() {
    this.showLoginPopup = false;
  }
  handleLogin() {
    if (this.loginRole === 'Sustainability Head Manager') {
      window.location.href = '/environmental-dashboard';
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

  filteredModules() {
    const search = this.moduleSearch.toLowerCase();
    return this.modules.filter(m =>
      m.title.toLowerCase().includes(search) ||
      m.description.toLowerCase().includes(search)
    );
  }

  toggleChartType() {
    this.chartType = this.chartType === 'bar' ? 'line' : 'bar';
  }

  openFeedback() {
    alert('Feedback form coming soon!');
  }

  constructor(
    private router: Router,
    private translationService: DashboardTranslationService
  ) {}

  ngOnInit() {
    // Initialize translation
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    
    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Dashboard language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Dashboard translations not loaded yet');
      } else {
        console.log('Dashboard translations loaded successfully');
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.translationSubscription?.unsubscribe();
  }

  getTranslatedText(key: string): string {
    const translated = this.translationService.translate(key);
    if (translated === key) {
      console.warn(`Dashboard translation failed for key: ${key}`);
    }
    return translated;
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  sendMessage() {
    if (!this.chatInput.trim()) return;
    this.chatHistory.push({ user: true, text: this.chatInput });
    const userMsg = this.chatInput;
    this.chatInput = '';
    setTimeout(() => {
      this.chatHistory.push({ user: false, text: this.mockAIResponse(userMsg) });
    }, 700);
  }

  mockAIResponse(msg: string): string {
    // Simple mock responses for demo
    if (msg.toLowerCase().includes('environmental')) return 'The Environmental module helps you track emissions, energy, and waste.';
    if (msg.toLowerCase().includes('social')) return 'The Social module covers diversity, labor, and community engagement.';
    if (msg.toLowerCase().includes('governance')) return 'The Governance module focuses on leadership, ethics, and transparency.';
    if (msg.toLowerCase().includes('report')) return 'Reporting & Analytics lets you generate ESG reports and insights.';
    if (msg.toLowerCase().includes('ai')) return 'Our AI provides predictive analytics and smart ESG recommendations.';
    return 'I am here to help with any ESG-related questions!';
  }

  regulatoryData: any[] = [];
  showRegModal = false;
  selectedReg: any = null;

  sectorModules: any[] = [
    { key: 'energy', sector: 'Energy', aiFeatures: 'Predictive emissions tracking, asset-level carbon analytics', complianceFocus: 'Scope 1/2/3 Emissions, Flaring, Methane' },
    { key: 'finance', sector: 'Finance', aiFeatures: 'Portfolio ESG scoring with GenAI, climate risk modeling', complianceFocus: 'Green Sukuk, AML/ESG audits, GHG ratio' },
    { key: 'education', sector: 'Education', aiFeatures: 'Campus emissions sensors + sentiment analysis (staff/students)', complianceFocus: 'Diversity metrics, Social impact' },
    { key: 'manufacturing', sector: 'Manufacturing', aiFeatures: 'IoT + AI for waste, water, emissions; ESG violation detection', complianceFocus: 'Worker safety, water usage, circular economy KPIs' }
  ];
  sectorModalOpen = false;
  sectorModalContent = '';
  sectorModalTitle = '';
  editingSector: any = null;
  newSector = { sector: '', aiFeatures: '', complianceFocus: '' };

  // KPI Builder interactive fields
  kpiName = '';
  kpiTarget: number | null = null;
  kpiUnit = '';
  kpiValue: number | null = null;

  // GenAI Dashboard modal state
  showGenaiDashboardModal = false;
  genaiDashboardTeam = '';
  genaiDashboardKPIs: any[] = [];
  genaiDashboardInsight = '';

  kpiList = [
    { name: 'Carbon Intensity', value: 56, target: 50, unit: 'tCO₂e', alert: true },
    { name: 'Diversity Ratio', value: 0.42, target: 0.5, unit: '', alert: true },
    { name: 'Water Usage', value: 1200, target: 1000, unit: 'm³', alert: false },
    { name: 'Compliance Score', value: 98, target: 100, unit: '%', alert: false }
  ];

  // Add KPI
  addKPI() {
    if (!this.kpiName.trim() || this.kpiTarget === null || !this.kpiUnit.trim() || this.kpiValue === null) return;
    const alert = this.kpiValue < this.kpiTarget; // Simple ML alert logic
    this.kpiList.push({
      name: this.kpiName,
      value: this.kpiValue,
      target: this.kpiTarget,
      unit: this.kpiUnit,
      alert
    });
    this.kpiName = '';
    this.kpiTarget = null;
    this.kpiUnit = '';
    this.kpiValue = null;
  }

  // Remove KPI
  removeKPI(idx: number) {
    this.kpiList.splice(idx, 1);
  }

  // Open GenAI Dashboard Modal
  openGenaiDashboard(team: string) {
    this.genaiDashboardTeam = team;
    // Example KPIs and insights per team
    if (team === 'Board') {
      this.genaiDashboardKPIs = [
        { name: 'ESG Score', value: 87.2, trend: '+2.1%' },
        { name: 'Governance Index', value: 92, trend: '+1.5%' }
      ];
      this.genaiDashboardInsight = 'GenAI: Board should focus on governance and risk trends.';
    } else if (team === 'Finance') {
      this.genaiDashboardKPIs = [
        { name: 'Carbon Cost', value: '$120k', trend: '-5%' },
        { name: 'Green Investments', value: '$2.1M', trend: '+12%' }
      ];
      this.genaiDashboardInsight = 'GenAI: Optimize green investments and monitor carbon cost.';
    } else if (team === 'HR') {
      this.genaiDashboardKPIs = [
        { name: 'Diversity Ratio', value: '0.42', trend: '+0.02' },
        { name: 'Employee Well-being', value: 'High', trend: 'Stable' }
      ];
      this.genaiDashboardInsight = 'GenAI: Maintain diversity and employee well-being.';
    } else if (team === 'Compliance') {
      this.genaiDashboardKPIs = [
        { name: 'Compliance Score', value: '98%', trend: '+1%' },
        { name: 'Regulatory Alerts', value: 1, trend: 'New' }
      ];
      this.genaiDashboardInsight = 'GenAI: Watch for new regulatory alerts and maintain high compliance.';
    }
    this.showGenaiDashboardModal = true;
  }

  closeGenaiDashboard() {
    this.showGenaiDashboardModal = false;
    this.genaiDashboardTeam = '';
    this.genaiDashboardKPIs = [];
    this.genaiDashboardInsight = '';
  }

  ngAfterViewInit() {
    this.handleScrollAnimations();
    this.updateRegulatoryData();
    this.autoUpdateAllData();
    this.sub.add(interval(10000).subscribe(() => {
      this.autoUpdateAllData();
      this.updateRegulatoryData();
      this.autoUpdateSectorModules();
    }));
  }

  updateRegulatoryData() {
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

  autoUpdateAllData() {
    // Simulate AI/ML-powered updates for stats
    this._stats = this._stats.map(stat => {
      let value = stat.value;
      switch (stat.key) {
        case 'co2': value = Math.round(110 + Math.random() * 20) + 't'; break;
        case 'diversity': value = Math.round(40 + Math.random() * 10) + '%'; break;
        case 'compliance': value = Math.round(95 + Math.random() * 5) + '%'; break;
        case 'integrations': value = Math.round(8 + Math.random() * 4).toString(); break;
        case 'ai': value = Math.round(90 + Math.random() * 10) + '%'; break;
      }
      return { ...stat, value };
    });
    // Simulate AI/ML-powered updates for highlights
    this._highlights = [
      { key: 'region', title: 'Top Performing Region', value: ['Europe', 'KSA', 'US', 'Asia'][Math.floor(Math.random() * 4)] + ' (Avg ESG Score: ' + (88 + Math.random() * 6).toFixed(1) + ')' },
      { key: 'achievement', title: 'Recent Achievement', value: ['Zero data breaches in the last 12 months', 'New ESG reporting standard adopted', '100% renewable energy in HQ'][Math.floor(Math.random() * 3)] },
      { key: 'feature', title: 'Upcoming Feature', value: ['Automated ESG Risk Alerts (Beta)', 'GenAI-powered ESG Chat', 'Real-time IoT ESG Sensors'][Math.floor(Math.random() * 3)] }
    ];
    // Simulate AI/ML-powered updates for modules
    this._modules = this._modules.map(module => {
      let extra = module.extra;
      switch (module.key) {
        case 'environmental': extra = 'Last month: ' + (Math.random() > 0.5 ? '-' : '+') + Math.round(Math.random() * 10) + '% CO₂, ' + Math.round(70 + Math.random() * 20) + 'MWh energy saved'; break;
        case 'social': extra = 'Employee engagement: ' + ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] + ', Diversity: ' + (40 + Math.round(Math.random() * 10)) + '%'; break;
        case 'governance': extra = 'Board size: ' + (7 + Math.round(Math.random() * 2)) + ', Ethics rating: ' + ['A+', 'A', 'B'][Math.floor(Math.random() * 3)]; break;
        case 'reporting': extra = 'Reports generated: ' + (300 + Math.round(Math.random() * 20)) + ', Analytics: ' + (4 + Math.round(Math.random() * 2)); break;
        case 'integrations': extra = 'APIs: ' + (5 + Math.round(Math.random() * 3)) + ', Data sources: ' + (8 + Math.round(Math.random() * 4)); break;
        case 'compliance': extra = 'Risks: ' + Math.round(Math.random() * 3) + ', Compliance: ' + (95 + Math.round(Math.random() * 5)) + '%'; break;
        case 'ai': extra = 'Predictions: ' + (2 + Math.round(Math.random() * 2)) + ', Accuracy: ' + (90 + Math.round(Math.random() * 10)) + '%'; break;
        case 'localization': extra = 'Languages: ' + (4 + Math.round(Math.random() * 2)) + ', Regions: ' + (3 + Math.round(Math.random() * 2)); break;
        case 'security': extra = 'Incidents: ' + Math.round(Math.random() * 2) + ', Audits: ' + (1 + Math.round(Math.random() * 2)); break;
        case 'ux': extra = 'Users: ' + (100 + Math.round(Math.random() * 30)) + ', Teams: ' + (6 + Math.round(Math.random() * 3)); break;
      }
      return { ...module, extra };
    });
  }

  openAiModal(type: string, key: string, title: string) {
    this.aiModalType = type;
    this.aiModalKey = key;
    this.aiModalTitle = title;
    this.aiModalContent = this.genAiInsight(type, key);
    this.aiModalOpen = true;
  }
  closeAiModal() {
    this.aiModalOpen = false;
    this.aiModalTitle = '';
    this.aiModalContent = '';
    this.aiModalType = '';
    this.aiModalKey = '';
  }
  genAiInsight(type: string, key: string): string {
    // Simulate GenAI explanations for each stat/module/analytics/highlight
    if (type === 'stat') {
      switch (key) {
        case 'co2': return 'AI detected a downward trend in CO₂ emissions due to recent energy efficiency projects.';
        case 'diversity': return 'GenAI analysis shows diversity initiatives are improving workforce balance.';
        case 'compliance': return 'ML models predict compliance will remain above 95% for the next quarter.';
        case 'integrations': return 'AI recommends integrating with two new ESG data sources for richer insights.';
        case 'ai': return 'GenAI accuracy is validated by cross-checking with external benchmarks.';
      }
    }
    if (type === 'module') {
      switch (key) {
        case 'environmental': return 'AI/ML models forecast a 10% reduction in emissions by year-end.';
        case 'social': return 'GenAI recommends new employee engagement programs for higher retention.';
        case 'governance': return 'AI flags board diversity as a key area for improvement.';
        case 'reporting': return 'GenAI automates ESG report generation, saving 30% analyst time.';
        case 'integrations': return 'ML suggests connecting to new IoT sensors for real-time ESG data.';
        case 'compliance': return 'AI predicts regulatory changes in KSA and recommends proactive alignment.';
        case 'ai': return 'GenAI is continuously learning from new ESG datasets.';
        case 'localization': return 'AI recommends adding Arabic and Turkish for regional expansion.';
        case 'security': return 'ML anomaly detection has prevented 2 potential data breaches.';
        case 'ux': return 'GenAI suggests new collaboration features based on user feedback.';
      }
    }
    if (type === 'highlight') {
      switch (key) {
        case 'region': return 'AI/ML analysis shows Europe leads in ESG due to strong regulations.';
        case 'achievement': return 'GenAI confirms zero data breaches via continuous monitoring.';
        case 'feature': return 'AI/ML-powered risk alerts will launch in the next release.';
      }
    }
    return 'GenAI is analyzing this data for new insights.';
  }

  autoUpdateSectorModules() {
    // Simulate AI/ML-powered updates for sector modules
    this.sectorModules = this.sectorModules.map(mod => {
      let aiFeatures = mod.aiFeatures;
      let complianceFocus = mod.complianceFocus;
      switch (mod.key) {
        case 'energy':
          aiFeatures = Math.random() > 0.5 ? 'Predictive emissions tracking, asset-level carbon analytics' : 'AI-powered flaring detection, real-time carbon analytics';
          complianceFocus = Math.random() > 0.5 ? 'Scope 1/2/3 Emissions, Flaring, Methane' : 'Methane, Flaring, Carbon Intensity';
          break;
        case 'finance':
          aiFeatures = Math.random() > 0.5 ? 'Portfolio ESG scoring with GenAI, climate risk modeling' : 'GenAI for Green Sukuk, ESG fraud detection';
          complianceFocus = Math.random() > 0.5 ? 'Green Sukuk, AML/ESG audits, GHG ratio' : 'ESG audits, AML, Climate Risk';
          break;
        case 'education':
          aiFeatures = Math.random() > 0.5 ? 'Campus emissions sensors + sentiment analysis (staff/students)' : 'AI for campus energy, student sentiment analysis';
          complianceFocus = Math.random() > 0.5 ? 'Diversity metrics, Social impact' : 'Social impact, Campus emissions';
          break;
        case 'manufacturing':
          aiFeatures = Math.random() > 0.5 ? 'IoT + AI for waste, water, emissions; ESG violation detection' : 'AI for circular economy, real-time safety monitoring';
          complianceFocus = Math.random() > 0.5 ? 'Worker safety, water usage, circular economy KPIs' : 'Water usage, ESG violations, Safety';
          break;
        default:
          break;
      }
      return { ...mod, aiFeatures, complianceFocus };
    });
  }

  openSectorAiModal(mod: any) {
    this.sectorModalTitle = mod.sector + ' (AI/GenAI Insight)';
    this.sectorModalContent = this.genSectorAiInsight(mod.key);
    this.sectorModalOpen = true;
  }
  closeSectorAiModal() {
    this.sectorModalOpen = false;
    this.sectorModalTitle = '';
    this.sectorModalContent = '';
  }
  genSectorAiInsight(key: string): string {
    switch (key) {
      case 'energy': return 'AI/ML models predict a 12% reduction in flaring events and improved methane tracking for the next quarter.';
      case 'finance': return 'GenAI recommends integrating climate risk modeling for Green Sukuk portfolios and automating ESG audits.';
      case 'education': return 'AI detects positive sentiment trends among students and recommends new diversity initiatives.';
      case 'manufacturing': return 'IoT+AI flagged 2 ESG violations and optimized water usage by 8% this month.';
      default: return 'GenAI is analyzing sector data for new insights.';
    }
  }
  addSector() {
    if (!this.newSector.sector.trim()) return;
    const key = this.newSector.sector.toLowerCase().replace(/\s+/g, '-');
    this.sectorModules.push({
      key,
      sector: this.newSector.sector,
      aiFeatures: this.newSector.aiFeatures,
      complianceFocus: this.newSector.complianceFocus
    });
    this.newSector = { sector: '', aiFeatures: '', complianceFocus: '' };
  }
  removeSector(mod: any) {
    this.sectorModules = this.sectorModules.filter(m => m !== mod);
  }
  editSector(mod: any) {
    this.editingSector = { ...mod };
  }
  saveSectorEdit() {
    const idx = this.sectorModules.findIndex(m => m.key === this.editingSector.key);
    if (idx > -1) this.sectorModules[idx] = { ...this.editingSector };
    this.editingSector = null;
  }
  cancelSectorEdit() {
    this.editingSector = null;
  }

  // Data for GenAI Personalized Dashboards (ESG Pillars)
  genaiPillars = [
    {
      name: 'Environmental pillar',
      color: '#ff5500',
      categories: [
        {
          name: 'Climate change',
          topics: [
            'Carbon emissions',
            'Product carbon footprint',
            'Financing environmental impact',
            'Climate change vulnerability'
          ]
        },
        {
          name: 'Natural resources',
          topics: [
            'Water stress',
            'Biodiversity & land use',
            'Raw material sourcing'
          ]
        },
        {
          name: 'Pollution & waste',
          topics: [
            'Toxic emissions & waste',
            'Packaging material & waste',
            'Electronic waste'
          ]
        },
        {
          name: 'Environment opportunity',
          topics: [
            'Opportunities in clean tech',
            'Opportunities in green building',
            'Opportunities in renewable energy'
          ]
        }
      ]
    },
    {
      name: 'Social pillar',
      color: '#ff5500',
      categories: [
        {
          name: 'Human capital',
          topics: [
            'Labour management',
            'Health & safety',
            'Human capital development',
            'Supply chain labour standards'
          ]
        },
        {
          name: 'Product liability',
          topics: [
            'Product safety & quality',
            'Chemical safety',
            'Financial product safety',
            'Privacy & data security',
            'Responsible investment',
            'Health & demo. risk'
          ]
        },
        {
          name: 'Stakeholder opposition',
          topics: [
            'Controversial sourcing'
          ]
        },
        {
          name: 'Social opportunity',
          topics: [
            'Access to communication',
            'Access to finance',
            'Access to health care',
            'Opportunities in nutrition & health'
          ]
        }
      ]
    },
    {
      name: 'Governance pillar',
      color: '#ff5500',
      categories: [
        {
          name: 'Corporate governance',
          topics: [
            'Board diversity',
            'Executive pay',
            'Ownership',
            'Accounting'
          ]
        },
        {
          name: 'Corporate behaviour',
          topics: [
            'Business ethics',
            'Anti-competitive practices',
            'Corruption & instability',
            'Financial system instability',
            'Tax transparency'
          ]
        }
      ]
    }
  ];

  // Data for GenAI Personalized Dashboards for teams (Board, Finance, HR, Compliance)
  genaiTeams = [
    {
      name: 'Board',
      color: '#2d2e83',
      categories: [
        {
          name: 'Key Metrics',
          topics: ['ESG Score', 'Governance Index', 'Board Diversity']
        },
        {
          name: 'Risks',
          topics: ['Regulatory Risk', 'Reputation Risk']
        },
        {
          name: 'Opportunities',
          topics: ['Sustainability Leadership', 'Long-term Value Creation']
        },
        {
          name: 'Alerts',
          topics: ['Compliance Alert', 'Ethics Alert']
        }
      ]
    },
    {
      name: 'Finance',
      color: '#388e3c',
      categories: [
        {
          name: 'Key Metrics',
          topics: ['Carbon Cost', 'Green Investments', 'Financial Impact']
        },
        {
          name: 'Risks',
          topics: ['Cost Overruns', 'Non-compliance Fines']
        },
        {
          name: 'Opportunities',
          topics: ['ESG-linked Loans', 'Tax Incentives']
        },
        {
          name: 'Alerts',
          topics: ['Budget Alert', 'Audit Alert']
        }
      ]
    },
    {
      name: 'HR',
      color: '#ff5500',
      categories: [
        {
          name: 'Key Metrics',
          topics: ['Diversity Ratio', 'Employee Well-being', 'Training Hours']
        },
        {
          name: 'Risks',
          topics: ['Turnover Risk', 'Workplace Safety']
        },
        {
          name: 'Opportunities',
          topics: ['Talent Attraction', 'Inclusion Initiatives']
        },
        {
          name: 'Alerts',
          topics: ['Well-being Alert', 'Diversity Alert']
        }
      ]
    },
    {
      name: 'Compliance',
      color: '#6c63ff',
      categories: [
        {
          name: 'Key Metrics',
          topics: ['Compliance Score', 'Audit Pass Rate', 'Policy Updates']
        },
        {
          name: 'Risks',
          topics: ['Regulatory Change', 'Data Privacy']
        },
        {
          name: 'Opportunities',
          topics: ['Automated Reporting', 'GenAI Compliance Insights']
        },
        {
          name: 'Alerts',
          topics: ['Non-compliance Alert', 'Policy Breach']
        }
      ]
    }
  ];

  // State for GenAI topic and team modals
  showGenaiTopicModal = false;
  showGenaiTeamModal = false;
  selectedGenaiTeam: any = null;
  selectedGenaiTopic: string = '';
  selectedGenaiCategory: string = '';
  genaiTopicInsight: string = '';

  // Open topic insight modal
  openGenaiTopicModal(team: any, category: string, topic: string) {
    this.selectedGenaiTeam = team;
    this.selectedGenaiCategory = category;
    this.selectedGenaiTopic = topic;
    // Example GenAI insight logic (could be replaced with real API call)
    this.genaiTopicInsight = `GenAI Insight for ${team.name} - ${category} - ${topic}:\n\n` +
      `AI recommends focusing on ${topic.toLowerCase()} to improve ${category.toLowerCase()} for the ${team.name} team.`;
    this.showGenaiTopicModal = true;
  }
  closeGenaiTopicModal() {
    this.showGenaiTopicModal = false;
    this.selectedGenaiTeam = null;
    this.selectedGenaiTopic = '';
    this.selectedGenaiCategory = '';
    this.genaiTopicInsight = '';
  }

  // Open team dashboard modal
  openGenaiTeamModal(team: any) {
    this.selectedGenaiTeam = team;
    this.showGenaiTeamModal = true;
  }
  closeGenaiTeamModal() {
    this.showGenaiTeamModal = false;
    this.selectedGenaiTeam = null;
  }

  // Add modal state for Materiality Matrix Builder
  materialityMatrixModalOpen = false;
  materialityMatrixData: any = null;

  openMaterialityMatrixModal() {
    // Simulate AI/ML-powered materiality matrix generation
    this.materialityMatrixData = {
      issues: [
        { name: 'Climate Change', sentiment: 0.82, regulatoryWeight: 0.9, businessRisk: 0.8 },
        { name: 'Diversity & Inclusion', sentiment: 0.75, regulatoryWeight: 0.7, businessRisk: 0.6 },
        { name: 'Data Privacy', sentiment: 0.68, regulatoryWeight: 0.8, businessRisk: 0.7 },
        { name: 'Supply Chain', sentiment: 0.6, regulatoryWeight: 0.6, businessRisk: 0.5 }
      ],
      generated: new Date().toLocaleString()
    };
    this.materialityMatrixModalOpen = true;
  }
  closeMaterialityMatrixModal() {
    this.materialityMatrixModalOpen = false;
    this.materialityMatrixData = null;
  }

  onLanguageChange(event: any) {
    const lang = event.target.value;
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.handleScrollAnimations();
  }

  handleScrollAnimations() {
    const animatedEls = document.querySelectorAll('.esg-anim-on-scroll');
    animatedEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60 && rect.bottom > 60) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    // Tree animation trigger
    const treeSection = document.querySelector('.why-esg-matters-section');
    const treeAnim = document.querySelector('.tree-anim-on-scroll');
    if (treeSection && treeAnim) {
      const rect = treeSection.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60 && rect.bottom > 60) {
        treeAnim.classList.add('active');
      } else {
        treeAnim.classList.remove('active');
      }
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
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