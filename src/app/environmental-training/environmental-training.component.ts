import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EnvironmentalTrainingTranslationService } from '../services/environmental-training-translation.service';
import { ThemeService } from '../services/theme.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';

interface TrainingModule {
  id: number;
  title: string;
  description: string;
  type: 'Sustainability' | 'Environmental' | 'Compliance' | 'Leadership';
  duration: string;
  status: 'Active' | 'Completed' | 'Pending';
  attachments: string[];
  progress: number;
}

interface TrainingSession {
  id: number;
  title: string;
  date: string;
  time: string;
  instructor: string;
  participants: number;
  maxParticipants: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  attachments: string[];
}

@Component({
  selector: 'app-environmental-training',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  template: `
    <div class="edash-root" [class.dark-mode]="darkMode" [class.rtl]="isRTL">
      <!-- Sidenav -->
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.SUSTAINABILITY_HEAD') }}</span>
        </div>
        <nav class="edash-nav">
          <a routerLink="/environmental-dashboard" class="edash-nav-link" data-title="Sustainability Head">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.SUSTAINABILITY_HEAD') }}</span>
          </a>
          <a routerLink="/materiality" class="edash-nav-link" data-title="Materiality Assessment">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.MATERIALITY_ASSESSMENT') }}</span>
          </a>
          <a routerLink="/team" class="edash-nav-link" data-title="Manage Team">
            <span class="edash-nav-icon">🧑‍🤝‍🧑</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.MANAGE_TEAM') }}</span>
          </a>
          <a routerLink="/initiatives-dashboard" class="edash-nav-link" data-title="ESG Initiative">
            <span class="edash-nav-icon">📣</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.ESG_INITIATIVE') }}</span>
          </a>
          <a routerLink="/reporting" class="edash-nav-link" data-title="Reporting & Analysis">
            <span class="edash-nav-icon">📊</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.REPORTING_ANALYSIS') }}</span>
          </a>
          
          <a routerLink="/environmental-training" routerLinkActive="active" class="edash-nav-link active" data-title="Training & Development">
            <span class="edash-nav-icon">🎓</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.TRAINING_DEVELOPMENT') }}</span>
          </a>
          <a routerLink="/stakeholder-engagement" routerLinkActive="active" class="edash-nav-link" data-title="Stakeholder Engagement">
            <span class="edash-nav-icon">🤝</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.STAKEHOLDER_ENGAGEMENT') }}</span>
          </a>
          <a routerLink="/data-management" routerLinkActive="active" class="edash-nav-link" data-title="Data Management">
            <span class="edash-nav-icon">🗄️</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.DATA_MANAGEMENT') }}</span>
          </a>
          <a routerLink="/notifications" class="edash-nav-link" data-title="Notifications & Alerts">
            <span class="edash-nav-icon">🔔</span>
            <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.NOTIFICATIONS_ALERTS') }}</span>
          </a>
          
          <div class="edash-nav-actions">
            <app-unified-language-toggle></app-unified-language-toggle>
            <button class="edash-logout" (click)="logout()" aria-label="Logout" data-title="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.LOGOUT') }}</span>
            </button>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav" data-title="Collapse">
              <span class="icon">⬅️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.COLLAPSE') }}</span>
            </button>
            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode" data-title="Light Mode">
              <span class="icon">☀️</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('ENVIRONMENTAL_TRAINING.LIGHT_MODE') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      
      <!-- Main Content -->
      <main class="edash-main" [class.sidebar-collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <style>
    .edash-root {
      min-height: 100vh;
      background: #f8fafc;
      color: #222;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: row;
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
    
    .edash-sidenav.collapsed .edash-nav-link:hover::after {
      content: attr(data-title);
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      background: #333;
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      white-space: nowrap;
      z-index: 1001;
      margin-left: 0.5rem;
    }
    
    .edash-root > .edash-main {
      margin-left: 260px;
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
    
    .edash-sidenav.dark-mode .edash-nav-link {
      color: #e0e0e0;
    }
    
    .edash-sidenav.dark-mode .edash-nav-link.active {
      background: #2a2a4e;
      color: #7eaaff;
      border-right: 3px solid #7eaaff;
    }
    
    .edash-nav-link:hover {
      background: #f1f5f9;
      color: #1e40af;
    }
    
    .edash-sidenav.dark-mode .edash-nav-link:hover {
      background: #2a2a4e;
      color: #7eaaff;
    }
    
    .edash-nav-icon {
      font-size: 1.25rem;
      width: 1.5rem;
      text-align: center;
    }
    
    .edash-nav-actions {
      padding: 1rem;
      border-top: 1px solid #ececec;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .edash-sidenav.dark-mode .edash-nav-actions {
      border-top: 1px solid #333;
    }
    
    .edash-logout, .edash-sidenav-toggle, .edash-dark-toggle {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      color: #333;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s, color 0.2s;
      width: 100%;
      text-align: left;
    }
    
    .edash-sidenav.dark-mode .edash-logout,
    .edash-sidenav.dark-mode .edash-sidenav-toggle,
    .edash-sidenav.dark-mode .edash-dark-toggle {
      color: #e0e0e0;
    }
    
    .edash-logout:hover, .edash-sidenav-toggle:hover, .edash-dark-toggle:hover {
      background: #f1f5f9;
      color: #1e40af;
    }
    
    .edash-sidenav.dark-mode .edash-logout:hover,
    .edash-sidenav.dark-mode .edash-sidenav-toggle:hover,
    .edash-sidenav.dark-mode .edash-dark-toggle:hover {
      background: #2a2a4e;
      color: #7eaaff;
    }
    
    .edash-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      transition: margin-left 0.3s ease;
    }
    
    .edash-main.sidebar-collapsed {
      margin-left: 70px;
    }
    
    .edash-main.dark-mode {
      background: #0f172a;
      color: #e0e0e0;
    }
    
          /* Training specific styles */
          .training-header {
      margin-bottom: 2rem;
    }
    
          .training-header h1 {
      font-size: 2rem;
      font-weight: 700;
            color: #2563eb;
      margin-bottom: 0.5rem;
    }
    
          .training-header p {
            color: #666;
            font-size: 1.1rem;
    }
    
          .edash-main.dark-mode .training-header h1 {
            color: #7eaaff;
    }
    
          .edash-main.dark-mode .training-header p {
            color: #b0b0b0;
    }
    
          .training-grid {
      display: grid;
            grid-template-columns: 1fr 1fr;
      gap: 2rem;
            margin-bottom: 2rem;
          }
          
          .training-card {
            background: #fff;
      border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
          }
          
          .edash-main.dark-mode .training-card {
            background: #1e293b;
            color: #e0e0e0;
            border: 1px solid #334155;
          }
          
          .training-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #2563eb;
      margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .edash-main.dark-mode .training-card h3 {
            color: #7eaaff;
          }
          
          .training-form {
            display: flex;
            flex-direction: column;
      gap: 1rem;
    }
    
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .form-group label {
            font-weight: 500;
            color: #374151;
          }
          
          .edash-main.dark-mode .form-group label {
            color: #d1d5db;
          }
          
          .form-control {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
          }
          
          .form-control:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          .edash-main.dark-mode .form-control {
            background: #374151;
            color: #e0e0e0;
            border-color: #4b5563;
          }
          
          .file-upload {
            border: 2px dashed #d1d5db;
            border-radius: 6px;
      padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.2s;
          }
          
          .file-upload:hover {
            border-color: #2563eb;
          }
          
          .edash-main.dark-mode .file-upload {
            border-color: #4b5563;
          }
          
          .file-upload.dragover {
            border-color: #2563eb;
            background: rgba(37, 99, 235, 0.05);
          }
          
          .file-list {
            margin-top: 1rem;
          }
          
          .file-item {
      display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem;
            background: #f9fafb;
            border-radius: 4px;
            margin-bottom: 0.5rem;
          }
          
          .edash-main.dark-mode .file-item {
            background: #374151;
          }
          
          .file-item .file-name {
            display: flex;
            align-items: center;
      gap: 0.5rem;
          }
          
          .file-item .file-remove {
            background: #ef4444;
            color: white;
      border: none;
            border-radius: 4px;
            padding: 0.25rem 0.5rem;
      cursor: pointer;
            font-size: 0.875rem;
          }
          
          .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 1rem;
          }
          
          .btn-primary {
      background: #2563eb;
      color: white;
    }
    
          .btn-primary:hover {
      background: #1d4ed8;
    }
    
          .btn-secondary {
            background: #6b7280;
            color: white;
          }
          
          .btn-secondary:hover {
            background: #4b5563;
          }
          
          .training-modules {
            margin-top: 2rem;
          }
          
          .module-item {
            background: #fff;
            border-radius: 8px;
            padding: 1rem;
      margin-bottom: 1rem;
            border: 1px solid #e5e7eb;
            transition: box-shadow 0.2s;
          }
          
          .module-item:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          
          .edash-main.dark-mode .module-item {
      background: #1e293b;
            border: 1px solid #334155;
    }
    
          .module-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
      margin-bottom: 0.5rem;
    }
    
          .module-title {
            font-weight: 600;
            color: #111827;
          }
          
          .edash-main.dark-mode .module-title {
            color: #f9fafb;
          }
          
          .module-status {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
      font-size: 0.875rem;
            font-weight: 500;
          }
          
          .status-active {
            background: #dcfce7;
            color: #166534;
          }
          
          .status-completed {
            background: #dbeafe;
            color: #1e40af;
    }
    
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    
          .module-description {
            color: #6b7280;
            margin-bottom: 0.5rem;
          }
          
          .edash-main.dark-mode .module-description {
            color: #9ca3af;
          }
          
          .module-progress {
      width: 100%;
      height: 8px;
            background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
            margin-bottom: 0.5rem;
          }
          
          .progress-bar {
      height: 100%;
      background: #2563eb;
            transition: width 0.3s;
          }
          
          .module-attachments {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
          
          .attachment-tag {
            background: #f3f4f6;
            color: #374151;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
          }
          
          .edash-main.dark-mode .attachment-tag {
            background: #374151;
            color: #d1d5db;
          }
          
          @media (max-width: 768px) {
            .training-grid {
        grid-template-columns: 1fr;
      }
    }
        </style>
        
        <div class="training-header">
          <h1>🎓 Training & Development</h1>
          <p>Enhance sustainability knowledge and skills through comprehensive training programs</p>
        </div>
        
        <div class="training-grid">
          <!-- Create New Training Module -->
          <div class="training-card">
            <h3>📝 Create New Training Module</h3>
            <form class="training-form" (ngSubmit)="createTrainingModule()">
              <div class="form-group">
                <label for="title">Module Title</label>
                <input type="text" id="title" class="form-control" [(ngModel)]="newModule.title" name="title" required>
              </div>
              
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" class="form-control" [(ngModel)]="newModule.description" name="description" rows="3" required></textarea>
              </div>
              
              <div class="form-group">
                <label for="type">Training Type</label>
                <select id="type" class="form-control" [(ngModel)]="newModule.type" name="type" required>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="duration">Duration</label>
                <input type="text" id="duration" class="form-control" [(ngModel)]="newModule.duration" name="duration" placeholder="e.g., 2 hours" required>
              </div>
              
              <div class="form-group">
                <label>Attachments</label>
                <div class="file-upload" 
                     (click)="fileInput.click()" 
                     (dragover)="onDragOver($event)" 
                     (dragleave)="onDragLeave($event)" 
                     (drop)="onDrop($event)"
                     [class.dragover]="isDragOver">
                  <p>📎 Click to upload or drag and drop files here</p>
                  <p style="font-size: 0.875rem; color: #6b7280;">Supports: PDF, DOC, PPT, Images</p>
                </div>
                <input #fileInput type="file" multiple (change)="onFileSelected($event)" style="display: none;">
                
                <div class="file-list" *ngIf="newModule.attachments.length > 0">
                  <div class="file-item" *ngFor="let file of newModule.attachments; let i = index">
                    <div class="file-name">
                      <span>📄</span>
                      <span>{{ file }}</span>
                    </div>
                    <button type="button" class="file-remove" (click)="removeFile(i)">Remove</button>
                  </div>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary">Create Module</button>
            </form>
          </div>
          
          <!-- Schedule Training Session -->
          <div class="training-card">
            <h3>📅 Schedule Training Session</h3>
            <form class="training-form" (ngSubmit)="scheduleTrainingSession()">
              <div class="form-group">
                <label for="sessionTitle">Session Title</label>
                <input type="text" id="sessionTitle" class="form-control" [(ngModel)]="newSession.title" name="sessionTitle" required>
              </div>
              
              <div class="form-group">
                <label for="sessionDate">Date</label>
                <input type="date" id="sessionDate" class="form-control" [(ngModel)]="newSession.date" name="sessionDate" required>
              </div>
              
              <div class="form-group">
                <label for="sessionTime">Time</label>
                <input type="time" id="sessionTime" class="form-control" [(ngModel)]="newSession.time" name="sessionTime" required>
              </div>
              
              <div class="form-group">
                <label for="instructor">Instructor</label>
                <input type="text" id="instructor" class="form-control" [(ngModel)]="newSession.instructor" name="instructor" required>
              </div>
              
              <div class="form-group">
                <label for="maxParticipants">Max Participants</label>
                <input type="number" id="maxParticipants" class="form-control" [(ngModel)]="newSession.maxParticipants" name="maxParticipants" required>
              </div>
              
              <div class="form-group">
                <label>Session Materials</label>
                <div class="file-upload" 
                     (click)="sessionFileInput.click()" 
                     (dragover)="onSessionDragOver($event)" 
                     (dragleave)="onSessionDragLeave($event)" 
                     (drop)="onSessionDrop($event)"
                     [class.dragover]="isSessionDragOver">
                  <p>📎 Upload session materials</p>
                  <p style="font-size: 0.875rem; color: #6b7280;">Supports: PDF, DOC, PPT, Images</p>
                </div>
                <input #sessionFileInput type="file" multiple (change)="onSessionFileSelected($event)" style="display: none;">
                
                <div class="file-list" *ngIf="newSession.attachments.length > 0">
                  <div class="file-item" *ngFor="let file of newSession.attachments; let i = index">
                    <div class="file-name">
                      <span>📄</span>
                      <span>{{ file }}</span>
                    </div>
                    <button type="button" class="file-remove" (click)="removeSessionFile(i)">Remove</button>
                  </div>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary">Schedule Session</button>
            </form>
          </div>
        </div>
        
        <!-- Training Modules -->
        <div class="training-modules">
          <h3>📚 Available Training Modules</h3>
          <div class="module-item" *ngFor="let module of trainingModules">
            <div class="module-header">
              <span class="module-title">{{ module.title }}</span>
              <span class="module-status" [class]="'status-' + module.status.toLowerCase()">
                {{ module.status }}
              </span>
            </div>
            <p class="module-description">{{ module.description }}</p>
            <div class="module-progress">
              <div class="progress-bar" [style.width.%]="module.progress"></div>
            </div>
            <p style="font-size: 0.875rem; color: #6b7280;">
              Type: {{ module.type }} | Duration: {{ module.duration }} | Progress: {{ module.progress }}%
            </p>
            <div class="module-attachments" *ngIf="module.attachments.length > 0">
              <span class="attachment-tag" *ngFor="let attachment of module.attachments">
                📎 {{ attachment }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Training Sessions -->
        <div class="training-modules">
          <h3>📅 Scheduled Training Sessions</h3>
          <div class="module-item" *ngFor="let session of trainingSessions">
            <div class="module-header">
              <span class="module-title">{{ session.title }}</span>
              <span class="module-status" [class]="'status-' + session.status.toLowerCase()">
                {{ session.status }}
              </span>
            </div>
            <p class="module-description">
              Instructor: {{ session.instructor }} | Date: {{ session.date }} | Time: {{ session.time }}
            </p>
            <p style="font-size: 0.875rem; color: #6b7280;">
              Participants: {{ session.participants }}/{{ session.maxParticipants }}
            </p>
            <div class="module-attachments" *ngIf="session.attachments.length > 0">
              <span class="attachment-tag" *ngFor="let attachment of session.attachments">
                📎 {{ attachment }}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class EnvironmentalTrainingComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  private themeSubscription!: Subscription;
  
  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;
  
  // File upload states
  isDragOver = false;
  isSessionDragOver = false;
  
  // New module form
  newModule = {
    title: '',
    description: '',
    type: 'Sustainability' as 'Sustainability' | 'Environmental' | 'Compliance' | 'Leadership',
    duration: '',
    attachments: [] as string[]
  };
  
  // New session form
  newSession = {
    title: '',
    date: '',
    time: '',
    instructor: '',
    maxParticipants: 20,
    attachments: [] as string[]
  };
  
  // Sample training modules
  trainingModules: TrainingModule[] = [
    {
      id: 1,
      title: 'ESG Fundamentals',
      description: 'Introduction to Environmental, Social, and Governance principles',
      type: 'Sustainability',
      duration: '3 hours',
      status: 'Active',
      attachments: ['ESG_Handbook.pdf', 'Case_Studies.pptx'],
      progress: 75
    },
    {
      id: 2,
      title: 'Carbon Footprint Management',
      description: 'Learn to measure and reduce organizational carbon emissions',
      type: 'Environmental',
      duration: '4 hours',
      status: 'Completed',
      attachments: ['Carbon_Calculator.xlsx', 'Best_Practices.pdf'],
      progress: 100
    },
    {
      id: 3,
      title: 'Sustainability Reporting Standards',
      description: 'Understanding GRI, SASB, and TCFD reporting frameworks',
      type: 'Compliance',
      duration: '2.5 hours',
      status: 'Pending',
      attachments: ['Reporting_Guidelines.pdf'],
      progress: 0
    }
  ];
  
  // Sample training sessions
  trainingSessions: TrainingSession[] = [
    {
      id: 1,
      title: 'ESG Fundamentals Workshop',
      date: '2024-04-15',
      time: '10:00',
      instructor: 'Dr. Sarah Johnson',
      participants: 15,
      maxParticipants: 25,
      status: 'Scheduled',
      attachments: ['Workshop_Agenda.pdf', 'Pre_Reading_Materials.pdf']
    },
    {
      id: 2,
      title: 'Carbon Management Training',
      date: '2024-04-20',
      time: '14:00',
      instructor: 'Michael Chen',
      participants: 8,
      maxParticipants: 20,
      status: 'In Progress',
      attachments: ['Training_Manual.pdf']
    }
  ];
  
  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private translationService: EnvironmentalTrainingTranslationService
  ) {
    // Translation setup
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Environmental Training language changed to:', lang);
    });

    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Environmental Training translations not loaded yet');
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
  
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }
  
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
  
  // File upload methods for training modules
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files, this.newModule.attachments);
    }
  }
  
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.handleFiles(target.files, this.newModule.attachments);
    }
  }
  
  removeFile(index: number) {
    this.newModule.attachments.splice(index, 1);
  }
  
  // File upload methods for training sessions
  onSessionDragOver(event: DragEvent) {
    event.preventDefault();
    this.isSessionDragOver = true;
  }
  
  onSessionDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isSessionDragOver = false;
  }
  
  onSessionDrop(event: DragEvent) {
    event.preventDefault();
    this.isSessionDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files, this.newSession.attachments);
    }
  }
  
  onSessionFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.handleFiles(target.files, this.newSession.attachments);
    }
  }
  
  removeSessionFile(index: number) {
    this.newSession.attachments.splice(index, 1);
  }
  
  // Handle file uploads
  private handleFiles(files: FileList, attachmentsArray: string[]) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // In a real application, you would upload the file to a server
      // For now, we'll just add the filename to the attachments array
      attachmentsArray.push(file.name);
    }
  }
  
  // Form submission methods
  createTrainingModule() {
    if (this.newModule.title && this.newModule.description && this.newModule.duration) {
      const newModule: TrainingModule = {
        id: this.trainingModules.length + 1,
        title: this.newModule.title,
        description: this.newModule.description,
        type: this.newModule.type,
        duration: this.newModule.duration,
        status: 'Active',
        attachments: [...this.newModule.attachments],
        progress: 0
      };
      
      this.trainingModules.unshift(newModule);
      
      // Reset form
      this.newModule = {
        title: '',
        description: '',
        type: 'Sustainability',
        duration: '',
        attachments: []
      };
    }
  }
  
  scheduleTrainingSession() {
    if (this.newSession.title && this.newSession.date && this.newSession.time && this.newSession.instructor) {
      const newSession: TrainingSession = {
        id: this.trainingSessions.length + 1,
        title: this.newSession.title,
        date: this.newSession.date,
        time: this.newSession.time,
        instructor: this.newSession.instructor,
        participants: 0,
        maxParticipants: this.newSession.maxParticipants,
        status: 'Scheduled',
        attachments: [...this.newSession.attachments]
      };
      
      this.trainingSessions.unshift(newSession);
      
      // Reset form
      this.newSession = {
        title: '',
        date: '',
        time: '',
        instructor: '',
        maxParticipants: 20,
        attachments: []
      };
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