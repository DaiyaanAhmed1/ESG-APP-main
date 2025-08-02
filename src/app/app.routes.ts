import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'environmental-dashboard', loadComponent: () => import('./environmental-dashboard/environmental-dashboard.component').then(m => m.EnvironmentalDashboardComponent), canActivate: [authGuard] },
  { path: 'social-dashboard', loadComponent: () => import('./social-dashboard/social-dashboard.component').then(m => m.SocialDashboardComponent), canActivate: [authGuard] },
  { path: 'goverance-dashboard', loadComponent: () => import('./governance-dashboard/goverance-dashboard.component').then(m => m.GovernanceComponent), canActivate: [authGuard] },
  { path: 'initiatives-dashboard', loadComponent: () => import('./initiatives-dashboard/initiatives-dashboard.component').then(m => m.InitiativesDashboardComponent), canActivate: [authGuard] },
  { path: 'communication-hub', loadComponent: () => import('./communication-hub/communication-hub.component').then(m => m.CommunicationHubComponent), canActivate: [authGuard] },
  { path: 'stakeholder-engagement', loadComponent: () => import('./stakeholder-engagement/stakeholder-engagement.component').then(m => m.StakeholderEngagementComponent), canActivate: [authGuard] },
  { path: 'data-management', loadComponent: () => import('./data-management/data-management.component').then(m => m.DataManagementComponent), canActivate: [authGuard] },
  { path: 'esg-specialist', loadComponent: () => import('./esg-specialist/esg-specialist.component').then(m => m.EsgSpecialistComponent), canActivate: [authGuard] },
  { path: 'marketing-dashboard', loadComponent: () => import('./marketing-head/marketing-head.component').then(m => m.MarketingHeadComponent), canActivate: [authGuard] },
  { path: 'marketing-head', loadComponent: () => import('./marketing-head/marketing-head.component').then(m => m.MarketingHeadComponent), canActivate: [authGuard] },
  { path: 'marketing-team', loadComponent: () => import('./marketing-team/marketing-team.component').then(m => m.MarketingTeamComponent), canActivate: [authGuard] },
  { path: 'report-analytics', loadComponent: () => import('./report-analytics/report-analytics.component').then(m => m.ReportAnalyticsComponent), canActivate: [authGuard] },
  { path: 'leads', loadComponent: () => import('./leads/leads.component').then(m => m.LeadsComponent), canActivate: [authGuard] },
  { path: 'resource-management', loadComponent: () => import('./resource-management/resource-management.component').then(m => m.ResourceManagementComponent), canActivate: [authGuard] },
  { path: 'training-development', loadComponent: () => import('./training-development/training-development.component').then(m => m.TrainingDevelopmentComponent), canActivate: [authGuard] },
  { path: 'environmental-training', loadComponent: () => import('./environmental-training/environmental-training.component').then(m => m.EnvironmentalTrainingComponent), canActivate: [authGuard] },
  { path: 'help-support', loadComponent: () => import('./help-support/help-support.component').then(m => m.HelpSupportComponent), canActivate: [authGuard] },
  { path: 'reporting', loadComponent: () => import('./reporting/reporting.component').then(m => m.ReportingComponent), canActivate: [authGuard] },
  { path: 'materiality', loadComponent: () => import('./materiality/materiality.component').then(m => m.MaterialityComponent), canActivate: [authGuard] },
  // Placeholder routes for missing components
  { path: 'team', loadComponent: () => import('./manage-team/manage-team.component').then(m => m.ManageTeamComponent), canActivate: [authGuard] },
  // { path: 'training', loadComponent: () => import('./environmental-training/environmental-training.component').then(m => m.EnvironmentalTrainingComponent), canActivate: [authGuard] }, // Disabled: component missing
  { path: 'workspace', redirectTo: '/environmental-dashboard' },
  { path: 'user-role-management', redirectTo: '/environmental-dashboard' },
  { path: 'notifications', redirectTo: '/environmental-dashboard' },
  { path: 'calendar', redirectTo: '/environmental-dashboard' },
];
