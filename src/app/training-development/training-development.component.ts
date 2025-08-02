import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TrainingDevelopmentTranslationService } from '../services/training-development-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

interface TeamMember {
  id: number;
  name: string;
  skills: string[];
  completed: number;
  pending: number;
  goals: string;
  feedback: string;
  skillScore: number;
  promotionReady: boolean;
}

interface TrainingRequest {
  id: number;
  name: string;
  request: string;
  type: 'Internal' | 'External';
  status: 'Pending' | 'Approved' | 'Rejected';
  cost: number;
}

interface Course {
  id: number;
  title: string;
  type: 'Internal' | 'External';
  completed: number;
  link: string;
}

interface KnowledgeResource {
  id: number;
  title: string;
  type: 'SOP' | 'Toolkit' | 'Report';
  tags: string[];
}

@Component({
  selector: 'app-training-development',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  templateUrl: './training-development.component.html',
  styleUrls: ['./training-development.component.css']
})
export class TrainingDevelopmentComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  // Training Dashboard Data
  activeTab = 'skillGap';
  upcomingSession = 'Google Ads Basics - 2024-04-20';
  
  // Team Performance Data
  teamPerformance = [
    { name: 'USA', completed: 5, pending: 2, skillGap: 'Analytics' },
    { name: 'USA', completed: 3, pending: 4, skillGap: 'Copywriting' }
  ];
  
  certificationStatus = [
    { name: 'USA', status: 'Certified', color: 'green' },
    { name: 'USA', status: 'Pending', color: 'orange' }
  ];
  
  // Team Member Skill Profiles
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'USA',
      skills: ['Google Ads', 'CRM'],
      completed: 5,
      pending: 2,
      goals: 'Improve Analytics',
      feedback: 'Great team player',
      skillScore: 82,
      promotionReady: true
    },
    {
      id: 2,
      name: 'USA',
      skills: ['Copywriting', 'Meta Ads'],
      completed: 3,
      pending: 4,
      goals: 'Master Meta Ads',
      feedback: 'Needs to improve deadlines',
      skillScore: 68,
      promotionReady: false
    }
  ];
  
  // Training Requests
  trainingRequests: TrainingRequest[] = [
    {
      id: 1,
      name: 'USA',
      request: 'Meta Ads Webinar',
      type: 'External',
      status: 'Pending',
      cost: 200
    },
    {
      id: 2,
      name: 'USA',
      request: 'HubSpot Certification',
      type: 'External',
      status: 'Approved',
      cost: 150
    }
  ];
  
  // Course Library
  courses: Course[] = [
    {
      id: 1,
      title: 'Google Ads Basics',
      type: 'Internal',
      completed: 8,
      link: 'View'
    },
    {
      id: 2,
      title: 'HubSpot Certification',
      type: 'External',
      completed: 5,
      link: 'View'
    },
    {
      id: 3,
      title: 'CRM Lead Nurturing',
      type: 'Internal',
      completed: 10,
      link: 'View'
    }
  ];
  
  // Knowledge Management
  knowledgeResources: KnowledgeResource[] = [
    {
      id: 1,
      title: 'How to Launch a Campaign',
      type: 'SOP',
      tags: ['Campaign', 'SOP']
    },
    {
      id: 2,
      title: 'Marketing Calendar Template',
      type: 'Toolkit',
      tags: ['Template', 'Calendar']
    },
    {
      id: 3,
      title: 'Failed Lead Campaign Insights',
      type: 'Report',
      tags: ['Report', 'Leads']
    }
  ];
  
  // Tab states
  trainingCalendarTab = 'smartRescheduling';
  courseLibraryTab = 'adaptiveLearning';
  skillProfilesTab = 'skillScore';
  
  constructor(
    private router: Router,
    private translationService: TrainingDevelopmentTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Training & Development language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Training & Development translations not loaded yet');
      }
    }, 1000);
  }
  
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
  
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  
  setTrainingCalendarTab(tab: string) {
    this.trainingCalendarTab = tab;
  }
  
  setCourseLibraryTab(tab: string) {
    this.courseLibraryTab = tab;
  }
  
  setSkillProfilesTab(tab: string) {
    this.skillProfilesTab = tab;
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