import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EsgSpecialistTranslationService } from '../services/esg-specialist-translation.service';
import { UnifiedLanguageToggleComponent } from '../components/unified-language-toggle/unified-language-toggle.component';
@Component({
  selector: 'app-esg-specialist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UnifiedLanguageToggleComponent],
  template: `
    <style>
      .esg-specialist-root {
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
      
      .esg-specialist-root > .esg-main {
        margin-left: 260px;
        transition: margin-left 0.3s ease;
      }
      
      .esg-specialist-root > .esg-main.collapsed {
        margin-left: 70px;
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
      .edash-nav-section {
        margin-bottom: 1.5rem;
      }
      .edash-nav-section-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
        padding: 0 1rem;
      }
      .esg-specialist-root.dark-mode .edash-nav-section-title {
        color: #b0b0b0;
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
        transition: all 0.2s ease;
        cursor: pointer;
      }
      
      .edash-nav-icon {
        font-size: 1.2rem;
        min-width: 1.2rem;
        text-align: center;
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
        padding: 0 1rem 1rem 1rem;
      }
      .edash-nav-actions button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        border-radius: 6px;
        border: none;
        background: none;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #333;
        width: 100%;
        justify-content: flex-start;
      }
      .edash-nav-actions button:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
      .edash-nav-actions button:hover {
        background: #f3f4f6;
        color: #2563eb;
      }
      .edash-sidenav.dark-mode .edash-nav-actions button {
        color: #e0e0e0;
      }
      .edash-sidenav.dark-mode .edash-nav-actions button:hover {
        background: #23284a;
        color: #7eaaff;
      }
      .edash-nav-actions .icon {
        font-size: 1.2rem;
        display: inline-block;
      }
      .edash-nav-actions .edash-logout {
        color: #dc3545;
        font-weight: 600;
      }
      .edash-sidenav.dark-mode .edash-nav-actions .edash-logout {
        color: #ffb3b3;
      }
      .edash-nav-actions .edash-logout:hover {
        background: #ffe6e6;
        color: #a71d2a;
      }
      .edash-sidenav.dark-mode .edash-nav-actions .edash-logout:hover {
        background: #3a1a1a;
        color: #ff4d4d;
      }


      @media (max-width: 900px) {
        .esg-specialist-root { flex-direction: column; }
        .edash-sidenav {
          position: static;
          width: 100%;
          height: auto;
          margin-left: 0;
        }
        .esg-specialist-root > .esg-main {
          margin-left: 0;
        }
      }
      .esg-main {
        flex: 1;
        padding: 2rem;
        background: #f8fafc;
        transition: background 0.3s, color 0.3s;
      }
      .esg-specialist-root.dark-mode .esg-main {
        background: #181828;
        color: #e0e0e0;
      }
      .esg-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .esg-title {
        font-size: 2rem;
        font-weight: 700;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .esg-title {
        color: #7eaaff;
      }
      .esg-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 2rem;
      }
      .esg-specialist-root.dark-mode .esg-subtitle {
        color: #b0b0b0;
      }
      .dashboard-content {
        background: #fff;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        transition: background 0.3s, color 0.3s;
      }
      .esg-specialist-root.dark-mode .dashboard-content {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .dashboard-card {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 1.5rem;
        transition: background 0.3s, color 0.3s;
      }
      .esg-specialist-root.dark-mode .dashboard-card {
        background: #1a1a2e;
        color: #e0e0e0;
      }
      .dashboard-card h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .dashboard-card h3 {
        color: #7eaaff;
      }
      .metric-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .metric-label {
        color: #666;
      }
      .esg-specialist-root.dark-mode .metric-label {
        color: #b0b0b0;
      }
      .metric-value {
        font-weight: 600;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .metric-value {
        color: #7eaaff;
      }

      /* Environmental Dashboard Specific Styles */
      .env-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .env-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .env-subtitle {
        color: #b0b0b0;
      }
      .env-actions {
        display: flex;
        gap: 1rem;
      }
      .env-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .env-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .env-btn.primary:hover {
        background: #1746a2;
      }
      .env-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .env-btn.secondary:hover {
        background: #e5e7eb;
      }
      .esg-specialist-root.dark-mode .env-btn.secondary {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .env-btn.secondary:hover {
        background: #4b5563;
      }

      .env-kpi-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .env-kpi-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        transition: transform 0.2s, box-shadow 0.2s;
        border-top: 4px solid;
        text-align: center;
      }
      .env-kpi-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
      }
      .esg-specialist-root.dark-mode .env-kpi-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .env-kpi-card.emissions { border-top-color: #4a6cff; }
      .env-kpi-card.energy { border-top-color: #2ecc71; }
      .env-kpi-card.water { border-top-color: #fdba74; }
      .env-kpi-card.recycling { border-top-color: #e74c3c; }
      .env-kpi-card.roi { border-top-color: #9b59b6; }
      .env-kpi-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .env-kpi-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .env-kpi-value {
        color: #e0e0e0;
      }
      .env-kpi-label {
        font-size: 1rem;
        font-weight: 600;
        color: #23284a;
        line-height: 1.4;
      }
      .esg-specialist-root.dark-mode .env-kpi-label {
        color: #b0b0b0;
      }

      .env-charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .env-chart-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .env-chart-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .env-chart-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .env-chart-title {
        color: #e0e0e0;
      }
      .env-chart-legend {
        text-align: center;
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .env-chart-legend {
        color: #b0b0b0;
      }

      .env-bottom-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .env-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .env-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .env-card-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .env-card-title {
        color: #e0e0e0;
      }
      .env-activity-log {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .env-activity-log li {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .esg-specialist-root.dark-mode .env-activity-log li {
        border-bottom-color: #333;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 0.8rem;
      }
      .dot.blue { background: #4a6cff; }
      .dot.green { background: #2ecc71; }
      .dot.gray { background: #7a8a99; }
      .log-meta {
        margin-left: auto;
        font-size: 0.8rem;
        color: #7a8a99;
      }
      .esg-specialist-root.dark-mode .log-meta {
        color: #b0b0b0;
      }
      .env-followups {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .env-followups li {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .esg-specialist-root.dark-mode .env-followups li {
        border-bottom-color: #333;
      }
      .followup-date {
        margin-left: auto;
        font-size: 0.8rem;
        color: #7a8a99;
      }
      .esg-specialist-root.dark-mode .followup-date {
        color: #b0b0b0;
      }

      @media (max-width: 1200px) {
        .env-charts-row {
          grid-template-columns: 1fr;
        }
        .env-bottom-row {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 768px) {
        .env-header {
          flex-direction: column;
          gap: 1rem;
        }
        .env-actions {
          width: 100%;
          justify-content: stretch;
        }
        .env-btn {
          flex: 1;
        }
        .env-kpi-row {
          grid-template-columns: 1fr;
        }
      }

      /* Social Dashboard Specific Styles */
      .social-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .social-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .social-subtitle {
        color: #b0b0b0;
      }
      .social-actions {
        display: flex;
        gap: 1rem;
      }
      .social-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .social-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .social-btn.primary:hover {
        background: #1746a2;
      }
      .social-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .social-btn.secondary:hover {
        background: #e5e7eb;
      }
      .esg-specialist-root.dark-mode .social-btn.secondary {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .social-btn.secondary:hover {
        background: #4b5563;
      }

      .social-kpi-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .social-kpi-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        transition: transform 0.2s, box-shadow 0.2s;
        border-top: 4px solid;
        text-align: center;
        position: relative;
      }
      .social-kpi-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
      }
      .esg-specialist-root.dark-mode .social-kpi-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .social-kpi-card.diversity { border-top-color: #4a6cff; }
      .social-kpi-card.training { border-top-color: #2ecc71; }
      .social-kpi-card.safety { border-top-color: #e74c3c; }
      .social-kpi-card.saudization { border-top-color: #fdba74; }
      .social-kpi-card.csr { border-top-color: #9b59b6; }
      .social-kpi-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .social-kpi-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .social-kpi-value {
        color: #e0e0e0;
      }
      .social-kpi-label {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
        line-height: 1.4;
      }
      .esg-specialist-root.dark-mode .social-kpi-label {
        color: #b0b0b0;
      }
      .social-kpi-standard {
        font-size: 0.8rem;
        color: #666;
        font-weight: 500;
        background: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        display: inline-block;
      }
      .esg-specialist-root.dark-mode .social-kpi-standard {
        background: #374151;
        color: #b0b0b0;
      }

      .social-charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .social-chart-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .social-chart-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .social-chart-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .social-chart-title {
        color: #e0e0e0;
      }
      .social-chart-legend {
        text-align: center;
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .social-chart-legend {
        color: #b0b0b0;
      }

      .social-compliance-section {
        margin-bottom: 2rem;
      }
      .social-compliance-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .social-compliance-title {
        color: #e0e0e0;
      }
      .social-compliance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }
      .social-compliance-card {
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        text-align: center;
        transition: transform 0.2s;
      }
      .social-compliance-card:hover {
        transform: translateY(-2px);
      }
      .esg-specialist-root.dark-mode .social-compliance-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .compliance-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .compliance-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .compliance-title {
        color: #e0e0e0;
      }
      .compliance-standard {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .esg-specialist-root.dark-mode .compliance-standard {
        color: #b0b0b0;
      }
      .compliance-status {
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        display: inline-block;
      }
      .compliance-status.compliant {
        background: #d1fae5;
        color: #065f46;
      }
      .esg-specialist-root.dark-mode .compliance-status.compliant {
        background: #064e3b;
        color: #6ee7b7;
      }
      .compliance-status.warning {
        background: #fef3c7;
        color: #92400e;
      }
      .esg-specialist-root.dark-mode .compliance-status.warning {
        background: #78350f;
        color: #fbbf24;
      }

      .social-bottom-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .social-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .social-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .social-card-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .social-card-title {
        color: #e0e0e0;
      }

      /* Carbon Calculator Styles */
      .carbon-calculator-section {
        margin-bottom: 2rem;
      }
      .carbon-calculator-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .carbon-calculator-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #23284a;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .esg-specialist-root.dark-mode .carbon-calculator-title {
        color: #e0e0e0;
      }
      .carbon-calculator-actions {
        display: flex;
        gap: 1rem;
      }
      .carbon-calculator-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .carbon-calculator-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .carbon-calculator-btn.primary:hover {
        background: #1746a2;
      }
      .carbon-calculator-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .carbon-calculator-btn.secondary:hover {
        background: #e5e7eb;
      }
      .esg-specialist-root.dark-mode .carbon-calculator-btn.secondary {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .carbon-calculator-btn.secondary:hover {
        background: #4b5563;
      }

      .carbon-calculator-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .carbon-input-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .carbon-input-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .carbon-input-card h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .carbon-input-card h3 {
        color: #e0e0e0;
      }
      .carbon-input-group {
        margin-bottom: 1rem;
      }
      .carbon-input-label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .carbon-input-label {
        color: #e0e0e0;
      }
      .carbon-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 0.9rem;
        background: #fff;
      }
      .esg-specialist-root.dark-mode .carbon-input {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .carbon-input:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
      }
      .carbon-select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 0.9rem;
        background: #fff;
      }
      .esg-specialist-root.dark-mode .carbon-select {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }

      .carbon-results-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .carbon-results-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .carbon-results-card h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .carbon-results-card h3 {
        color: #e0e0e0;
      }
      .carbon-result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 0.75rem;
      }
      .esg-specialist-root.dark-mode .carbon-result-item {
        background: #374151;
      }
      .carbon-result-label {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .carbon-result-label {
        color: #e0e0e0;
      }
      .carbon-result-value {
        font-weight: 700;
        color: #2563eb;
        font-size: 1.1rem;
      }
      .esg-specialist-root.dark-mode .carbon-result-value {
        color: #7eaaff;
      }
      .carbon-total {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #fff;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        margin-top: 1rem;
      }
      .carbon-total-label {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        opacity: 0.9;
      }
      .carbon-total-value {
        font-size: 2rem;
        font-weight: 700;
      }

      .carbon-categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .carbon-category {
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        text-align: center;
        border-left: 4px solid #10b981;
      }
      .esg-specialist-root.dark-mode .carbon-category {
        background: #374151;
        border-left-color: #10b981;
      }
      .carbon-category-icon {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      .carbon-category-label {
        font-weight: 600;
        color: #23284a;
        margin-bottom: 0.25rem;
      }
      .esg-specialist-root.dark-mode .carbon-category-label {
        color: #e0e0e0;
      }
      .carbon-category-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: #10b981;
      }

      @media (max-width: 1200px) {
        .carbon-calculator-grid {
          grid-template-columns: 1fr;
        }
        .carbon-categories {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
      }
      @media (max-width: 768px) {
        .carbon-calculator-header {
          flex-direction: column;
          gap: 1rem;
        }
        .carbon-calculator-actions {
          width: 100%;
          justify-content: stretch;
        }
        .carbon-calculator-btn {
          flex: 1;
        }
        .carbon-categories {
          grid-template-columns: 1fr;
        }
      }
      .social-activity-log {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .social-activity-log li {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .esg-specialist-root.dark-mode .social-activity-log li {
        border-bottom-color: #333;
      }
      .dot.orange { background: #fdba74; }
      .dot.purple { background: #9b59b6; }
      .social-followups {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .social-followups li {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .esg-specialist-root.dark-mode .social-followups li {
        border-bottom-color: #333;
      }

      @media (max-width: 1200px) {
        .social-charts-row {
          grid-template-columns: 1fr;
        }
        .social-bottom-row {
          grid-template-columns: 1fr;
        }
        .social-compliance-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
      }
      @media (max-width: 768px) {
        .social-header {
          flex-direction: column;
          gap: 1rem;
        }
        .social-actions {
          width: 100%;
          justify-content: stretch;
        }
        .social-btn {
          flex: 1;
        }
        .social-kpi-row {
          grid-template-columns: 1fr;
        }
        .social-compliance-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Governance Dashboard Specific Styles */
      .gov-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .gov-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .gov-subtitle {
        color: #b0b0b0;
      }
      .gov-actions {
        display: flex;
        gap: 1rem;
      }
      .gov-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .gov-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .gov-btn.primary:hover {
        background: #1746a2;
      }
      .gov-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .gov-btn.secondary:hover {
        background: #e5e7eb;
      }
      .esg-specialist-root.dark-mode .gov-btn.secondary {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .gov-btn.secondary:hover {
        background: #4b5563;
      }

      .gov-kpi-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .gov-kpi-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        transition: transform 0.2s, box-shadow 0.2s;
        border-top: 4px solid;
        text-align: center;
        position: relative;
      }
      .gov-kpi-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.1);
      }
      .esg-specialist-root.dark-mode .gov-kpi-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .gov-kpi-card.board { border-top-color: #4a6cff; }
      .gov-kpi-card.diversity { border-top-color: #2ecc71; }
      .gov-kpi-card.compliance { border-top-color: #e74c3c; }
      .gov-kpi-card.risk { border-top-color: #fdba74; }
      .gov-kpi-card.ethics { border-top-color: #9b59b6; }
      .gov-kpi-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .gov-kpi-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .gov-kpi-value {
        color: #e0e0e0;
      }
      .gov-kpi-label {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
        line-height: 1.4;
      }
      .esg-specialist-root.dark-mode .gov-kpi-label {
        color: #b0b0b0;
      }
      .gov-kpi-standard {
        font-size: 0.8rem;
        color: #666;
        font-weight: 500;
        background: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        display: inline-block;
      }
      .esg-specialist-root.dark-mode .gov-kpi-standard {
        background: #374151;
        color: #b0b0b0;
      }

      .gov-charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .gov-chart-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .gov-chart-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .gov-chart-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .gov-chart-title {
        color: #e0e0e0;
      }

      .gov-framework-section {
        margin-bottom: 2rem;
      }
      .gov-framework-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .gov-framework-title {
        color: #e0e0e0;
      }
      .gov-framework-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }
      .gov-framework-card {
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        text-align: center;
        transition: transform 0.2s;
      }
      .gov-framework-card:hover {
        transform: translateY(-2px);
      }
      .esg-specialist-root.dark-mode .gov-framework-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .framework-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .framework-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
        line-height: 1.3;
      }
      .esg-specialist-root.dark-mode .framework-title {
        color: #e0e0e0;
      }
      .framework-standard {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .esg-specialist-root.dark-mode .framework-standard {
        color: #b0b0b0;
      }
      .framework-status {
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        display: inline-block;
      }
      .framework-status.compliant {
        background: #d1fae5;
        color: #065f46;
      }
      .esg-specialist-root.dark-mode .framework-status.compliant {
        background: #064e3b;
        color: #6ee7b7;
      }
      .framework-status.warning {
        background: #fef3c7;
        color: #92400e;
      }
      .esg-specialist-root.dark-mode .framework-status.warning {
        background: #78350f;
        color: #fbbf24;
      }

      .gov-bottom-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .gov-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .gov-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .gov-card-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .gov-card-title {
        color: #e0e0e0;
      }
      .gov-activity-log {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .gov-activity-log li {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .esg-specialist-root.dark-mode .gov-activity-log li {
        border-bottom-color: #333;
      }
      .gov-followups {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .gov-followups li {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }
      .esg-specialist-root.dark-mode .gov-followups li {
        border-bottom-color: #333;
      }

      @media (max-width: 1200px) {
        .gov-charts-row {
          grid-template-columns: 1fr;
        }
        .gov-bottom-row {
          grid-template-columns: 1fr;
        }
        .gov-framework-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
      }
      @media (max-width: 768px) {
        .gov-header {
          flex-direction: column;
          gap: 1rem;
        }
        .gov-actions {
          width: 100%;
          justify-content: stretch;
        }
        .gov-btn {
          flex: 1;
        }
        .gov-kpi-row {
          grid-template-columns: 1fr;
        }
        .gov-framework-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Overview Dashboard Styles */
      .overview-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .overview-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .overview-subtitle {
        color: #b0b0b0;
      }
      .overview-actions {
        display: flex;
        gap: 1rem;
      }
      .overview-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .overview-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .overview-btn.primary:hover {
        background: #1746a2;
      }
      .overview-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .overview-btn.secondary:hover {
        background: #e5e7eb;
      }
      .esg-specialist-root.dark-mode .overview-btn.secondary {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .overview-btn.secondary:hover {
        background: #4b5563;
      }

      .overview-score-section {
        margin-bottom: 2rem;
      }
      .overview-score-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        color: #fff;
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
      }
      .esg-specialist-root.dark-mode .overview-score-card {
        background: linear-gradient(135deg, #4a6cff 0%, #6b46c1 100%);
      }
      .overview-score-value {
        font-size: 4rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .overview-score-label {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        opacity: 0.9;
      }
      .overview-score-trend {
        font-size: 1rem;
        font-weight: 600;
      }
      .overview-score-trend.positive {
        color: #10b981;
      }

      .overview-pillars-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .overview-pillar-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        transition: transform 0.2s;
        border-top: 4px solid;
      }
      .overview-pillar-card:hover {
        transform: translateY(-4px);
      }
      .esg-specialist-root.dark-mode .overview-pillar-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .overview-pillar-card.environmental { border-top-color: #10b981; }
      .overview-pillar-card.social { border-top-color: #3b82f6; }
      .overview-pillar-card.governance { border-top-color: #8b5cf6; }
      .pillar-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      .pillar-score {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .pillar-score {
        color: #e0e0e0;
      }
      .pillar-label {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .pillar-label {
        color: #b0b0b0;
      }
      .pillar-trend {
        font-size: 1rem;
        font-weight: 600;
      }
      .pillar-trend.positive {
        color: #10b981;
      }

      .overview-metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .overview-metric-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .overview-metric-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .overview-metric-card h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .overview-metric-card h3 {
        color: #e0e0e0;
      }
      .metric-list, .compliance-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .metric-item, .compliance-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f8fafc;
        border-radius: 8px;
      }
      .esg-specialist-root.dark-mode .metric-item,
      .esg-specialist-root.dark-mode .compliance-item {
        background: #374151;
      }
      .metric-name, .compliance-name {
        font-weight: 500;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .metric-name,
      .esg-specialist-root.dark-mode .compliance-name {
        color: #e0e0e0;
      }
      .metric-value {
        font-weight: 600;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .metric-value {
        color: #7eaaff;
      }
      .compliance-status {
        font-weight: 600;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.9rem;
      }
      .compliance-status.compliant {
        background: #d1fae5;
        color: #065f46;
      }
      .esg-specialist-root.dark-mode .compliance-status.compliant {
        background: #064e3b;
        color: #6ee7b7;
      }
      .compliance-status.warning {
        background: #fef3c7;
        color: #92400e;
      }
      .esg-specialist-root.dark-mode .compliance-status.warning {
        background: #78350f;
        color: #fbbf24;
      }

      /* Placeholder Content Styles */
      .placeholder-content {
        text-align: center;
        padding: 3rem 2rem;
        max-width: 600px;
        margin: 0 auto;
      }
      .placeholder-content h2 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .placeholder-content h2 {
        color: #e0e0e0;
      }
      .placeholder-content p {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 2rem;
      }
      .esg-specialist-root.dark-mode .placeholder-content p {
        color: #b0b0b0;
      }
      .placeholder-features {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: left;
      }
      .feature-item {
        padding: 1rem;
        background: #f8fafc;
        border-radius: 12px;
        font-weight: 500;
        color: #23284a;
        border-left: 4px solid #2563eb;
      }
      .esg-specialist-root.dark-mode .feature-item {
        background: #374151;
        color: #e0e0e0;
        border-left-color: #7eaaff;
      }

      @media (max-width: 1200px) {
        .overview-metrics-grid {
          grid-template-columns: 1fr;
        }
        .overview-pillars-row {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
      }
      @media (max-width: 768px) {
        .overview-header {
          flex-direction: column;
          gap: 1rem;
        }
        .overview-actions {
          width: 100%;
          justify-content: stretch;
        }
        .overview-btn {
          flex: 1;
        }
        .overview-pillars-row {
          grid-template-columns: 1fr;
        }
        .placeholder-content {
          padding: 2rem 1rem;
        }
      }

      /* Data Entry Styles */
      .data-entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .data-entry-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .data-entry-subtitle {
        color: #b0b0b0;
      }
      .data-entry-actions {
        display: flex;
        gap: 1rem;
      }
      .data-entry-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .data-entry-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .data-entry-btn.primary:hover {
        background: #1746a2;
      }
      .data-entry-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .data-entry-btn.secondary:hover {
        background: #e5e7eb;
      }

      .data-entry-container {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
      }
      .data-entry-sidebar {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        height: fit-content;
      }
      .esg-specialist-root.dark-mode .data-entry-sidebar {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .entry-section {
        margin-bottom: 1.5rem;
      }
      .entry-section h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .entry-section h3 {
        color: #e0e0e0;
      }
      .entry-select, .entry-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 0.9rem;
        background: #fff;
      }
      .esg-specialist-root.dark-mode .entry-select,
      .esg-specialist-root.dark-mode .entry-input {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }

      .data-entry-main {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .entry-form-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .entry-form-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .form-header h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .form-header h3 {
        color: #e0e0e0;
      }
      .form-status {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
      }
      .form-status.valid {
        background: #d1fae5;
        color: #065f46;
      }
      .form-status.invalid {
        background: #fef3c7;
        color: #92400e;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .form-group {
        display: flex;
        flex-direction: column;
      }
      .form-group.full-width {
        grid-column: 1 / -1;
      }
      .form-group label {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .form-group label {
        color: #e0e0e0;
      }
      .form-input, .form-select, .form-textarea {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 0.9rem;
        background: #fff;
      }
      .esg-specialist-root.dark-mode .form-input,
      .esg-specialist-root.dark-mode .form-select,
      .esg-specialist-root.dark-mode .form-textarea {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }
      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
      .form-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .form-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .form-btn.primary:hover:not(:disabled) {
        background: #1746a2;
      }
      .form-btn.primary:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
      .form-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .form-btn.secondary:hover {
        background: #e5e7eb;
      }

      .recent-entries-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .recent-entries-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .recent-entries-card h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .recent-entries-card h3 {
        color: #e0e0e0;
      }
      .entries-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .entry-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        border-left: 4px solid #2563eb;
      }
      .esg-specialist-root.dark-mode .entry-item {
        background: #374151;
        border-left-color: #7eaaff;
      }
      .entry-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .entry-location {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .entry-location {
        color: #e0e0e0;
      }
      .entry-kpi {
        font-size: 0.9rem;
        color: #666;
      }
      .esg-specialist-root.dark-mode .entry-kpi {
        color: #b0b0b0;
      }
      .entry-value {
        font-weight: 600;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .entry-value {
        color: #7eaaff;
      }
      .entry-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
      }
      .entry-date {
        font-size: 0.8rem;
        color: #666;
      }
      .esg-specialist-root.dark-mode .entry-date {
        color: #b0b0b0;
      }
      .entry-status {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
      }
      .entry-status.validated {
        background: #d1fae5;
        color: #065f46;
      }
      .entry-status.pending {
        background: #fef3c7;
        color: #92400e;
      }

      /* Upload File Styles */
      .upload-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .upload-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .upload-subtitle {
        color: #b0b0b0;
      }
      .upload-actions {
        display: flex;
        gap: 1rem;
      }
      .upload-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .upload-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .upload-btn.primary:hover {
        background: #1746a2;
      }
      .upload-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .upload-btn.secondary:hover {
        background: #e5e7eb;
      }

      .upload-zones-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .upload-zone-card, .iot-sync-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .upload-zone-card,
      .esg-specialist-root.dark-mode .iot-sync-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .upload-zone-header, .iot-sync-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .upload-zone-header h3, .iot-sync-header h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .upload-zone-header h3,
      .esg-specialist-root.dark-mode .iot-sync-header h3 {
        color: #e0e0e0;
      }
      .upload-status {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        background: #f3f4f6;
        color: #666;
      }
      .upload-status.active {
        background: #dbeafe;
        color: #1e40af;
      }
      .sync-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        background: #f3f4f6;
        color: #333;
        cursor: pointer;
        font-size: 0.9rem;
      }

      .upload-drop-zone {
        border: 2px dashed #d1d5db;
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        transition: all 0.2s;
        cursor: pointer;
      }
      .upload-drop-zone:hover, .upload-drop-zone.dragover {
        border-color: #2563eb;
        background: #f0f9ff;
      }
      .upload-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .upload-drop-zone h4 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .upload-drop-zone p {
        color: #666;
        margin-bottom: 1rem;
      }
      .upload-browse-btn {
        padding: 0.75rem 1.5rem;
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      .upload-progress {
        margin-top: 1rem;
      }
      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: #2563eb;
        transition: width 0.3s ease;
      }
      .progress-text {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
      }

      .uploaded-files {
        margin-top: 1.5rem;
      }
      .uploaded-files h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .file-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .file-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
      }
      .esg-specialist-root.dark-mode .file-item {
        background: #374151;
      }
      .file-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .file-icon {
        font-size: 1.2rem;
      }
      .file-name {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .file-name {
        color: #e0e0e0;
      }
      .file-size {
        font-size: 0.9rem;
        color: #666;
      }
      .file-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .file-status {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
      }
      .file-status.processed {
        background: #d1fae5;
        color: #065f46;
      }
      .file-status.validating {
        background: #fef3c7;
        color: #92400e;
      }
      .file-status.uploaded {
        background: #dbeafe;
        color: #1e40af;
      }
      .file-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        background: #f3f4f6;
        color: #333;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .file-btn.delete {
        background: #fee2e2;
        color: #dc2626;
      }

      .iot-devices-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .iot-device {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
      }
      .esg-specialist-root.dark-mode .iot-device {
        background: #374151;
      }
      .device-icon {
        font-size: 1.5rem;
      }
      .device-info {
        flex: 1;
      }
      .device-name {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .device-name {
        color: #e0e0e0;
      }
      .device-location {
        font-size: 0.9rem;
        color: #666;
      }
      .device-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      .status-indicator.online {
        background: #10b981;
      }
      .status-indicator.offline {
        background: #ef4444;
      }
      .status-text {
        font-size: 0.9rem;
        font-weight: 600;
      }
      .status-text.online {
        color: #10b981;
      }
      .status-text.offline {
        color: #ef4444;
      }
      .device-data {
        text-align: right;
      }
      .data-value {
        font-weight: 600;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .data-value {
        color: #7eaaff;
      }
      .data-time {
        font-size: 0.8rem;
        color: #666;
      }

      .sync-summary {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }
      .esg-specialist-root.dark-mode .sync-summary {
        border-top-color: #4b5563;
      }
      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .summary-label {
        font-size: 0.9rem;
        color: #666;
      }
      .summary-value {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .summary-value {
        color: #e0e0e0;
      }

      .validation-results {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .validation-results {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .validation-results h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .validation-results h3 {
        color: #e0e0e0;
      }
      .validation-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }
      .validation-item {
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        border-left: 4px solid #2563eb;
      }
      .esg-specialist-root.dark-mode .validation-item {
        background: #374151;
        border-left-color: #7eaaff;
      }
      .validation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      .validation-file {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .validation-file {
        color: #e0e0e0;
      }
      .validation-status {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
      }
      .validation-status.valid {
        background: #d1fae5;
        color: #065f46;
      }
      .validation-status.processing {
        background: #fef3c7;
        color: #92400e;
      }
      .validation-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .detail-label {
        font-size: 0.8rem;
        color: #666;
      }
      .detail-value {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .detail-value {
        color: #e0e0e0;
      }
      .detail-value.valid {
        color: #10b981;
      }
      .detail-value.error {
        color: #ef4444;
      }
      .validation-actions {
        display: flex;
        gap: 0.5rem;
      }
      .validation-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        background: #f3f4f6;
        color: #333;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .validation-btn.primary {
        background: #2563eb;
        color: #fff;
      }

      /* Data Validation Styles */
      .validation-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
      }
      .validation-subtitle {
        font-size: 1.1rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .esg-specialist-root.dark-mode .validation-subtitle {
        color: #b0b0b0;
      }
      .validation-actions {
        display: flex;
        gap: 1rem;
      }
      .validation-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .validation-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .validation-btn.primary:hover {
        background: #1746a2;
      }
      .validation-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .validation-btn.secondary:hover {
        background: #e5e7eb;
      }

      .quality-overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .quality-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        transition: transform 0.2s;
        border-top: 4px solid;
      }
      .quality-card:hover {
        transform: translateY(-4px);
      }
      .esg-specialist-root.dark-mode .quality-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .quality-card.total { border-top-color: #6b7280; }
      .quality-card.valid { border-top-color: #10b981; }
      .quality-card.invalid { border-top-color: #ef4444; }
      .quality-card.missing { border-top-color: #f59e0b; }
      .quality-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .quality-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .quality-value {
        color: #e0e0e0;
      }
      .quality-label {
        font-size: 1rem;
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .quality-label {
        color: #b0b0b0;
      }

      .validation-dashboard {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .validation-main {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .quality-chart-card, .issues-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .quality-chart-card,
      .esg-specialist-root.dark-mode .issues-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .quality-chart-card h3, .issues-card h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .quality-chart-card h3,
      .esg-specialist-root.dark-mode .issues-card h3 {
        color: #e0e0e0;
      }
      .chart-container {
        margin-bottom: 1rem;
      }
      .chart-legend {
        text-align: center;
        font-size: 0.9rem;
        color: #666;
      }

      .issues-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .issue-item {
        padding: 1rem;
        background: #fef2f2;
        border-radius: 8px;
        border-left: 4px solid #ef4444;
      }
      .esg-specialist-root.dark-mode .issue-item {
        background: #3a1a1a;
        border-left-color: #f87171;
      }
      .issue-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .issue-type {
        font-weight: 600;
        color: #dc2626;
      }
      .esg-specialist-root.dark-mode .issue-type {
        color: #f87171;
      }
      .issue-priority {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        background: #ef4444;
        color: #fff;
        border-radius: 12px;
      }
      .issue-description {
        font-size: 0.9rem;
        color: #374151;
        margin-bottom: 0.75rem;
      }
      .esg-specialist-root.dark-mode .issue-description {
        color: #d1d5db;
      }
      .issue-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .issue-location, .issue-date {
        font-size: 0.8rem;
        color: #666;
      }
      .issue-actions {
        display: flex;
        gap: 0.5rem;
      }
      .issue-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        background: #f3f4f6;
        color: #333;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .issue-btn.secondary {
        background: #fee2e2;
        color: #dc2626;
      }

      .validation-sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .completeness-card, .outliers-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .completeness-card,
      .esg-specialist-root.dark-mode .outliers-card {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .completeness-card h3, .outliers-card h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .completeness-card h3,
      .esg-specialist-root.dark-mode .outliers-card h3 {
        color: #e0e0e0;
      }
      .completeness-item {
        margin-bottom: 1rem;
      }
      .completeness-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .completeness-kpi {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .completeness-kpi {
        color: #e0e0e0;
      }
      .completeness-percentage {
        font-weight: 600;
        color: #2563eb;
      }
      .completeness-bar {
        width: 100%;
        height: 6px;
        background: #e5e7eb;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }
      .completeness-fill {
        height: 100%;
        background: #2563eb;
        transition: width 0.3s ease;
      }
      .completeness-details {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #666;
      }
      .completeness-missing {
        color: #ef4444;
      }

      .outlier-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f8fafc;
        border-radius: 6px;
        margin-bottom: 0.75rem;
      }
      .esg-specialist-root.dark-mode .outlier-item {
        background: #374151;
      }
      .outlier-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .outlier-value {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .outlier-value {
        color: #e0e0e0;
      }
      .outlier-kpi, .outlier-location {
        font-size: 0.8rem;
        color: #666;
      }
      .outlier-severity {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
      }
      .outlier-severity.high {
        background: #fee2e2;
        color: #dc2626;
      }
      .outlier-severity.medium {
        background: #fef3c7;
        color: #d97706;
      }
      .outlier-severity.low {
        background: #d1fae5;
        color: #059669;
      }

      .validation-rules-section {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      }
      .esg-specialist-root.dark-mode .validation-rules-section {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .validation-rules-section h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .validation-rules-section h3 {
        color: #e0e0e0;
      }
      .rules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      .rule-card {
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }
      .esg-specialist-root.dark-mode .rule-card {
        background: #374151;
        border-color: #4b5563;
      }
      .rule-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      .rule-name {
        font-weight: 600;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .rule-name {
        color: #e0e0e0;
      }
      .rule-toggle {
        position: relative;
        width: 40px;
        height: 20px;
      }
      .rule-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 20px;
      }
      .toggle-slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .toggle-slider {
        background-color: #2563eb;
      }
      input:checked + .toggle-slider:before {
        transform: translateX(20px);
      }
      .rule-description {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.75rem;
      }
      .rule-stats {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #666;
      }
      .rule-violations {
        color: #ef4444;
        font-weight: 600;
      }

      @media (max-width: 1200px) {
        .data-entry-container {
          grid-template-columns: 1fr;
        }
        .upload-zones-container {
          grid-template-columns: 1fr;
        }
        .validation-dashboard {
          grid-template-columns: 1fr;
        }
        .quality-overview-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        .rules-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
      }
      @media (max-width: 768px) {
        .data-entry-header,
        .upload-header,
        .validation-header {
          flex-direction: column;
          gap: 1rem;
        }
        .data-entry-actions,
        .upload-actions,
        .validation-actions {
          width: 100%;
          justify-content: stretch;
        }
        .data-entry-btn,
        .upload-btn,
        .validation-btn {
          flex: 1;
        }
        .form-grid {
          grid-template-columns: 1fr;
        }
        .quality-overview-grid {
          grid-template-columns: 1fr;
        }
        .rules-grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Animations & Modern Styles for New Sections --- */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: none; }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-32px); }
        to { opacity: 1; transform: none; }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .dashboard-content {
        animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1);
      }
      .timeline-item, .report-card, .template-item, .list-item, .activity-card {
        animation: popIn 0.5s cubic-bezier(.4,0,.2,1);
        transition: box-shadow 0.2s, transform 0.2s;
      }
      .timeline-item:hover, .report-card:hover, .template-item:hover, .list-item:hover, .activity-card:hover {
        box-shadow: 0 8px 32px rgba(37,99,235,0.08);
        transform: translateY(-2px) scale(1.02);
        z-index: 2;
      }
      .timeline-marker {
        transition: background 0.3s, border 0.3s;
        border-radius: 50%;
        width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.3rem;
        background: #e6f0ff;
        border: 2px solid #2563eb;
        margin-right: 1rem;
        animation: slideInLeft 0.5s cubic-bezier(.4,0,.2,1);
      }
      .timeline-marker.create { background: #d1fae5; border-color: #10b981; }
      .timeline-marker.update { background: #fef3c7; border-color: #f59e0b; }
      .timeline-marker.delete { background: #fee2e2; border-color: #ef4444; }
      .timeline-marker.validate { background: #e0e7ff; border-color: #6366f1; }
      .esg-specialist-root.dark-mode .timeline-marker {
        background: #23284a;
        border-color: #7eaaff;
      }
      .timeline-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 2rem;
        background: #f8fafc;
        border-radius: 12px;
        padding: 1rem 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .esg-specialist-root.dark-mode .timeline-item {
        background: #23284a;
        color: #e0e0e0;
      }
      .timeline-content {
        flex: 1;
        animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
      }
      .timeline-header, .gallery-header, .reports-search, .past-reports-header, .changelog-header, .report-header, .templates-header {
        animation: slideInLeft 0.5s cubic-bezier(.4,0,.2,1);
      }
      .timeline-year, .year-header {
        animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
      }
      .report-card, .template-card, .activity-card {
        transition: box-shadow 0.2s, transform 0.2s;
      }
      .report-card.active, .template-card.active, .activity-card.active {
        box-shadow: 0 12px 32px rgba(37,99,235,0.12);
        transform: scale(1.03);
      }
      .category-tab, .view-btn, .sort-select, .filter-select, .filter-btn, .canvas-btn, .template-action-btn, .section-btn, .export-btn, .change-btn, .version-btn, .timeline-btn, .action-btn, .list-btn, .preview-btn, .add-component-btn, .placeholder-btn {
        transition: background 0.2s, color 0.2s, box-shadow 0.2s, border 0.2s;
      }
      .category-tab.active, .view-btn.active {
        background: #2563eb;
        color: #fff;
        box-shadow: 0 2px 8px rgba(37,99,235,0.08);
      }
      .esg-specialist-root.dark-mode .category-tab.active, .esg-specialist-root.dark-mode .view-btn.active {
        background: #7eaaff;
        color: #23284a;
      }
      .category-tab:hover, .view-btn:hover {
        background: #e6f0ff;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .category-tab:hover, .esg-specialist-root.dark-mode .view-btn:hover {
        background: #374151;
        color: #7eaaff;
      }
      .template-item, .report-card, .list-item {
        transition: box-shadow 0.2s, transform 0.2s;
      }
      .template-item:active, .report-card:active, .list-item:active {
        transform: scale(0.98);
      }
      .template-preview, .preview-content, .canvas-area, .page-preview, .component-placeholder {
        transition: box-shadow 0.2s, background 0.2s, border 0.2s;
      }
      .component-placeholder {
        animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1);
      }
      .component-placeholder.added {
        animation: popIn 0.4s cubic-bezier(.4,0,.2,1);
        background: #d1fae5;
      }
      .component-placeholder.removed {
        animation: fadeIn 0.3s reverse cubic-bezier(.4,0,.2,1);
        opacity: 0.5;
      }
      .canvas-area {
        min-height: 200px;
        background: #f3f4f6;
        border-radius: 12px;
        padding: 1rem;
        margin-top: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .esg-specialist-root.dark-mode .canvas-area {
        background: #23284a;
      }
      .template-item.selected, .report-card.selected {
        border: 2px solid #2563eb;
        box-shadow: 0 4px 16px rgba(37,99,235,0.12);
      }
      .esg-specialist-root.dark-mode .template-item.selected, .esg-specialist-root.dark-mode .report-card.selected {
        border-color: #7eaaff;
      }
      .template-action-btn.primary, .action-btn.primary, .change-btn.primary, .version-btn.primary, .export-btn.primary, .section-btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .template-action-btn.primary:hover, .action-btn.primary:hover, .change-btn.primary:hover, .version-btn.primary:hover, .export-btn.primary:hover, .section-btn.primary:hover {
        background: #1746a2;
      }
      .template-action-btn.secondary, .action-btn.secondary, .change-btn.secondary, .version-btn.secondary, .export-btn.secondary, .section-btn.secondary {
        background: #f3f4f6;
        color: #333;
        border: 1px solid #d1d5db;
      }
      .template-action-btn.secondary:hover, .action-btn.secondary:hover, .change-btn.secondary:hover, .version-btn.secondary:hover, .export-btn.secondary:hover, .section-btn.secondary:hover {
        background: #e5e7eb;
      }
      .esg-specialist-root.dark-mode .template-action-btn.secondary, .esg-specialist-root.dark-mode .action-btn.secondary, .esg-specialist-root.dark-mode .change-btn.secondary, .esg-specialist-root.dark-mode .version-btn.secondary, .esg-specialist-root.dark-mode .export-btn.secondary, .esg-specialist-root.dark-mode .section-btn.secondary {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .template-action-btn.secondary:hover, .esg-specialist-root.dark-mode .action-btn.secondary:hover, .esg-specialist-root.dark-mode .change-btn.secondary:hover, .esg-specialist-root.dark-mode .version-btn.secondary:hover, .esg-specialist-root.dark-mode .export-btn.secondary:hover, .esg-specialist-root.dark-mode .section-btn.secondary:hover {
        background: #4b5563;
      }
      /* Responsive Animations */
      @media (max-width: 900px) {
        .dashboard-content, .timeline-item, .report-card, .template-item, .list-item, .activity-card {
          animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1);
        }
      }

      /* --- Card Styles for New Sections --- */
      .changelog-header, .report-header, .past-reports-header, .templates-header {
        background: #f3f4f6;
        border-radius: 12px;
        padding: 1.5rem 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .esg-specialist-root.dark-mode .changelog-header,
      .esg-specialist-root.dark-mode .report-header,
      .esg-specialist-root.dark-mode .past-reports-header,
      .esg-specialist-root.dark-mode .templates-header {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .changelog-actions, .report-actions, .past-reports-actions, .templates-actions {
        display: flex;
        gap: 1rem;
      }
      /* Enhanced Button Styles */
      .changelog-btn, .report-btn, .past-reports-btn, .templates-btn, .data-entry-btn, .upload-btn, .validation-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        border: none;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      /* Primary Button Styles */
      .changelog-btn.primary, .report-btn.primary, .past-reports-btn.primary, .templates-btn.primary,
      .data-entry-btn.primary, .upload-btn.primary, .validation-btn.primary {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #fff;
        border: 1px solid #1d4ed8;
      }
      .changelog-btn.primary:hover, .report-btn.primary:hover, .past-reports-btn.primary:hover, .templates-btn.primary:hover,
      .data-entry-btn.primary:hover, .upload-btn.primary:hover, .validation-btn.primary:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37,99,235,0.3);
      }
      
      /* Secondary Button Styles */
      .changelog-btn.secondary, .report-btn.secondary, .past-reports-btn.secondary, .templates-btn.secondary,
      .data-entry-btn.secondary, .upload-btn.secondary, .validation-btn.secondary {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        color: #475569;
        border: 1px solid #cbd5e1;
      }
      .changelog-btn.secondary:hover, .report-btn.secondary:hover, .past-reports-btn.secondary:hover, .templates-btn.secondary:hover,
      .data-entry-btn.secondary:hover, .upload-btn.secondary:hover, .validation-btn.secondary:hover {
        background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
        color: #1e293b;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      /* Success Button Styles */
      .changelog-btn.success, .report-btn.success, .past-reports-btn.success, .templates-btn.success,
      .data-entry-btn.success, .upload-btn.success, .validation-btn.success {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #fff;
        border: 1px solid #059669;
      }
      .changelog-btn.success:hover, .report-btn.success:hover, .past-reports-btn.success:hover, .templates-btn.success:hover,
      .data-entry-btn.success:hover, .upload-btn.success:hover, .validation-btn.success:hover {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16,185,129,0.3);
      }
      
      /* Warning Button Styles */
      .changelog-btn.warning, .report-btn.warning, .past-reports-btn.warning, .templates-btn.warning,
      .data-entry-btn.warning, .upload-btn.warning, .validation-btn.warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
        border: 1px solid #d97706;
      }
      .changelog-btn.warning:hover, .report-btn.warning:hover, .past-reports-btn.warning:hover, .templates-btn.warning:hover,
      .data-entry-btn.warning:hover, .upload-btn.warning:hover, .validation-btn.warning:hover {
        background: linear-gradient(135deg, #d97706, #b45309);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(245,158,11,0.3);
      }
      
      /* Danger Button Styles */
      .changelog-btn.danger, .report-btn.danger, .past-reports-btn.danger, .templates-btn.danger,
      .data-entry-btn.danger, .upload-btn.danger, .validation-btn.danger {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #fff;
        border: 1px solid #dc2626;
      }
      .changelog-btn.danger:hover, .report-btn.danger:hover, .past-reports-btn.danger:hover, .templates-btn.danger:hover,
      .data-entry-btn.danger:hover, .upload-btn.danger:hover, .validation-btn.danger:hover {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(239,68,68,0.3);
      }
      
      /* Small Button Styles */
      .changelog-btn.small, .report-btn.small, .past-reports-btn.small, .templates-btn.small,
      .data-entry-btn.small, .upload-btn.small, .validation-btn.small {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        border-radius: 8px;
      }
      
      /* Dark Mode Button Adjustments */
      .esg-specialist-root.dark-mode .changelog-btn.secondary,
      .esg-specialist-root.dark-mode .report-btn.secondary,
      .esg-specialist-root.dark-mode .past-reports-btn.secondary,
      .esg-specialist-root.dark-mode .templates-btn.secondary,
      .esg-specialist-root.dark-mode .data-entry-btn.secondary,
      .esg-specialist-root.dark-mode .upload-btn.secondary,
      .esg-specialist-root.dark-mode .validation-btn.secondary {
        background: linear-gradient(135deg, #374151, #4b5563);
        color: #e5e7eb;
        border-color: #6b7280;
      }
      .esg-specialist-root.dark-mode .changelog-btn.secondary:hover,
      .esg-specialist-root.dark-mode .report-btn.secondary:hover,
      .esg-specialist-root.dark-mode .past-reports-btn.secondary:hover,
      .esg-specialist-root.dark-mode .templates-btn.secondary:hover,
      .esg-specialist-root.dark-mode .data-entry-btn.secondary:hover,
      .esg-specialist-root.dark-mode .upload-btn.secondary:hover,
      .esg-specialist-root.dark-mode .validation-btn.secondary:hover {
        background: linear-gradient(135deg, #4b5563, #6b7280);
        color: #f9fafb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      /* Filter/Search Bar Styles */
      .changelog-filters, .reports-search, .template-categories {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1rem 1.5rem;
        margin-bottom: 2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        align-items: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.03);
      }
      .esg-specialist-root.dark-mode .changelog-filters,
      .esg-specialist-root.dark-mode .reports-search,
      .esg-specialist-root.dark-mode .template-categories {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .filter-group, .search-bar, .search-filters, .category-tabs {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .filter-select, .filter-input, .search-input, .sort-select {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        font-size: 1rem;
        background: #fff;
        color: #23284a;
      }
      .esg-specialist-root.dark-mode .filter-select,
      .esg-specialist-root.dark-mode .filter-input,
      .esg-specialist-root.dark-mode .search-input,
      .esg-specialist-root.dark-mode .sort-select {
        background: #374151;
        color: #e0e0e0;
        border-color: #4b5563;
      }
      .filter-btn, .search-btn {
        padding: 0.5rem 1.2rem;
        border-radius: 6px;
        border: none;
        background: #2563eb;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .filter-btn:hover, .search-btn:hover {
        background: #1746a2;
      }
      /* Enhanced Content Styles */
      .timeline-item, .report-card, .template-item, .list-item, .activity-card, .data-entry-form, .upload-zone, .validation-panel {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        padding: 1.8rem 2.2rem;
        margin-bottom: 1.8rem;
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .timeline-item:hover, .report-card:hover, .template-item:hover, .list-item:hover, .activity-card:hover,
      .data-entry-form:hover, .upload-zone:hover, .validation-panel:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        border-color: #cbd5e1;
      }
      .esg-specialist-root.dark-mode .timeline-item,
      .esg-specialist-root.dark-mode .report-card,
      .esg-specialist-root.dark-mode .template-item,
      .esg-specialist-root.dark-mode .list-item,
      .esg-specialist-root.dark-mode .activity-card,
      .esg-specialist-root.dark-mode .data-entry-form,
      .esg-specialist-root.dark-mode .upload-zone,
      .esg-specialist-root.dark-mode .validation-panel {
        background: linear-gradient(135deg, #1e1e2e, #2d2d44);
        color: #e0e0e0;
        border: 1px solid #404040;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      .esg-specialist-root.dark-mode .timeline-item:hover,
      .esg-specialist-root.dark-mode .report-card:hover,
      .esg-specialist-root.dark-mode .template-item:hover,
      .esg-specialist-root.dark-mode .list-item:hover,
      .esg-specialist-root.dark-mode .activity-card:hover,
      .esg-specialist-root.dark-mode .data-entry-form:hover,
      .esg-specialist-root.dark-mode .upload-zone:hover,
      .esg-specialist-root.dark-mode .validation-panel:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        border-color: #555;
      }
      
      .timeline-item:last-child, .report-card:last-child, .template-item:last-child, .list-item:last-child, .activity-card:last-child {
        margin-bottom: 0;
      }
      
      /* Content Layout Enhancements */
      .timeline-content, .report-info, .template-info, .item-details, .form-content, .upload-content, .validation-content {
        margin-left: 0.8rem;
        flex: 1;
      }
      
      /* Enhanced Headers */
      .timeline-header h3, .gallery-header h3, .reports-analytics h3, .template-management h3,
      .data-entry-header h3, .upload-header h3, .validation-header h3 {
        font-size: 1.4rem;
        font-weight: 700;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 1.2rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }
      .esg-specialist-root.dark-mode .timeline-header h3,
      .esg-specialist-root.dark-mode .gallery-header h3,
      .esg-specialist-root.dark-mode .reports-analytics h3,
      .esg-specialist-root.dark-mode .template-management h3,
      .esg-specialist-root.dark-mode .data-entry-header h3,
      .esg-specialist-root.dark-mode .upload-header h3,
      .esg-specialist-root.dark-mode .validation-header h3 {
        background: linear-gradient(135deg, #7eaaff, #60a5fa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      /* Enhanced Text Styles */
      .timeline-item p, .report-card p, .template-item p, .list-item p, .activity-card p {
        color: #475569;
        line-height: 1.6;
        margin: 0.5rem 0;
      }
      .esg-specialist-root.dark-mode .timeline-item p,
      .esg-specialist-root.dark-mode .report-card p,
      .esg-specialist-root.dark-mode .template-item p,
      .esg-specialist-root.dark-mode .list-item p,
      .esg-specialist-root.dark-mode .activity-card p {
        color: #cbd5e1;
      }
      
      /* Status Indicators */
      .status-badge, .priority-badge, .type-badge {
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .status-badge.success {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #fff;
      }
      .status-badge.warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
      }
      .status-badge.danger {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #fff;
      }
      .status-badge.info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: #fff;
      }
      
      /* Enhanced Form Elements */
      .form-group, .input-group {
        margin-bottom: 1.5rem;
      }
      .form-label, .input-label {
        display: block;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
      }
      .esg-specialist-root.dark-mode .form-label,
      .esg-specialist-root.dark-mode .input-label {
        color: #e5e7eb;
      }
      .form-input, .form-select, .form-textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 1rem;
        background: #fff;
        color: #374151;
        transition: all 0.3s ease;
      }
      .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        transform: translateY(-1px);
      }
      .esg-specialist-root.dark-mode .form-input,
      .esg-specialist-root.dark-mode .form-select,
      .esg-specialist-root.dark-mode .form-textarea {
        background: #374151;
        color: #e5e7eb;
        border-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .form-input:focus,
      .esg-specialist-root.dark-mode .form-select:focus,
      .esg-specialist-root.dark-mode .form-textarea:focus {
        border-color: #7eaaff;
        box-shadow: 0 0 0 3px rgba(126,170,255,0.1);
      }
      
      /* Progress Bars */
      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin: 0.5rem 0;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #059669);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
      .esg-specialist-root.dark-mode .progress-bar {
        background: #374151;
      }
      
      /* Icons and Visual Elements */
      .icon {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 0.5rem;
      }
      .timeline-marker {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #2563eb;
        margin-right: 1rem;
        flex-shrink: 0;
      }
      .timeline-marker.success { background: #10b981; }
      .timeline-marker.warning { background: #f59e0b; }
      .timeline-marker.danger { background: #ef4444; }
      .timeline-marker.info { background: #3b82f6; }
      /* Section Spacing */
      .changelog-timeline, .version-history, .activity-summary, .report-builder, .report-preview, .report-stats, .export-options, .report-templates, .reports-timeline, .reports-analytics, .template-gallery, .template-builder, .template-management {
        margin-bottom: 2.5rem;
      }
      /* Additional Component Styles */
      .data-entry-sidebar, .report-config, .template-sidebar {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
        margin-bottom: 1.5rem;
      }
      .esg-specialist-root.dark-mode .data-entry-sidebar,
      .esg-specialist-root.dark-mode .report-config,
      .esg-specialist-root.dark-mode .template-sidebar {
        background: linear-gradient(135deg, #2d2d44, #23284a);
        border-color: #404040;
      }
      
      .data-entry-main, .report-preview-area, .template-canvas {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid #e2e8f0;
        min-height: 400px;
      }
      .esg-specialist-root.dark-mode .data-entry-main,
      .esg-specialist-root.dark-mode .report-preview-area,
      .esg-specialist-root.dark-mode .template-canvas {
        background: linear-gradient(135deg, #1e1e2e, #2d2d44);
        border-color: #404040;
      }
      
      /* Grid Layouts */
      .metrics-grid, .charts-grid, .templates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin: 1.5rem 0;
      }
      
      /* Tab Styles */
      .category-tab, .view-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        background: #f1f5f9;
        color: #64748b;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .category-tab.active, .view-btn.active {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #fff;
        box-shadow: 0 2px 8px rgba(37,99,235,0.2);
      }
      .category-tab:hover, .view-btn:hover {
        background: #e2e8f0;
        color: #374151;
        transform: translateY(-1px);
      }
      .category-tab.active:hover, .view-btn.active:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        color: #fff;
      }
      .esg-specialist-root.dark-mode .category-tab,
      .esg-specialist-root.dark-mode .view-btn {
        background: #374151;
        color: #cbd5e1;
      }
      .esg-specialist-root.dark-mode .category-tab:hover,
      .esg-specialist-root.dark-mode .view-btn:hover {
        background: #4b5563;
        color: #e5e7eb;
      }
      
      /* List Styles */
      .file-list, .issue-list, .template-list {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: #fff;
      }
      .esg-specialist-root.dark-mode .file-list,
      .esg-specialist-root.dark-mode .issue-list,
      .esg-specialist-root.dark-mode .template-list {
        background: #374151;
        border-color: #4b5563;
      }
      
      .file-item, .issue-item, .template-item {
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s ease;
      }
      .file-item:hover, .issue-item:hover, .template-item:hover {
        background: #f8fafc;
      }
      .esg-specialist-root.dark-mode .file-item,
      .esg-specialist-root.dark-mode .issue-item,
      .esg-specialist-root.dark-mode .template-item {
        border-bottom-color: #4b5563;
      }
      .esg-specialist-root.dark-mode .file-item:hover,
      .esg-specialist-root.dark-mode .issue-item:hover,
      .esg-specialist-root.dark-mode .template-item:hover {
        background: #4b5563;
      }
      
      /* Responsive Cards */
      @media (max-width: 900px) {
        .changelog-header, .report-header, .past-reports-header, .templates-header {
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }
        .timeline-item, .report-card, .template-item, .list-item, .activity-card {
          padding: 1rem;
        }
        .changelog-filters, .reports-search, .template-categories {
          padding: 0.75rem 1rem;
        }
        .metrics-grid, .charts-grid, .templates-grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 600px) {
        .timeline-item, .report-card, .template-item, .list-item, .activity-card {
          padding: 0.5rem;
        }
        .changelog-header, .report-header, .past-reports-header, .templates-header {
          padding: 0.5rem;
        }
        .data-entry-main, .report-preview-area, .template-canvas {
          padding: 1rem;
        }
      }

      /* Compliance Section Styles */
      .compliance-header, .deadlines-header, .evidence-header {
        background: #f3f4f6;
        border-radius: 12px;
        padding: 1.5rem 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .esg-specialist-root.dark-mode .compliance-header,
      .esg-specialist-root.dark-mode .deadlines-header,
      .esg-specialist-root.dark-mode .evidence-header {
        background: #23284a;
        color: #e0e0e0;
        border: 1px solid #333;
      }
      .compliance-actions, .deadlines-actions, .evidence-actions {
        display: flex;
        gap: 1rem;
      }
      .compliance-btn, .deadlines-btn, .evidence-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        border: none;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .compliance-btn.primary, .deadlines-btn.primary, .evidence-btn.primary {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #fff;
        border: 1px solid #1d4ed8;
      }
      .compliance-btn.secondary, .deadlines-btn.secondary, .evidence-btn.secondary {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        color: #475569;
        border: 1px solid #cbd5e1;
      }
      .compliance-btn.primary:hover, .deadlines-btn.primary:hover, .evidence-btn.primary:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37,99,235,0.3);
      }
      .compliance-btn.secondary:hover, .deadlines-btn.secondary:hover, .evidence-btn.secondary:hover {
        background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
        color: #1e293b;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      /* Compliance Standards Grid */
      .compliance-standards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .compliance-standard-card {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        padding: 2rem;
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;
      }
      .compliance-standard-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        border-color: #cbd5e1;
      }
      .esg-specialist-root.dark-mode .compliance-standard-card {
        background: linear-gradient(135deg, #1e1e2e, #2d2d44);
        color: #e0e0e0;
        border: 1px solid #404040;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      .standard-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .standard-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      .standard-info {
        flex: 1;
      }
      .standard-name {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .standard-name {
        color: #7eaaff;
      }
      .standard-description {
        color: #64748b;
        font-size: 0.95rem;
        line-height: 1.5;
      }
      .esg-specialist-root.dark-mode .standard-description {
        color: #cbd5e1;
      }
      .standard-status {
        flex-shrink: 0;
      }
      .status-badge {
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .status-badge.in-progress {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
      }
      .status-badge.pending {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #fff;
      }
      .status-badge.completed {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #fff;
      }
      .standard-progress {
        margin-bottom: 1.5rem;
      }
      .progress-text {
        font-size: 0.9rem;
        color: #64748b;
        margin-top: 0.5rem;
        display: block;
      }
      .esg-specialist-root.dark-mode .progress-text {
        color: #cbd5e1;
      }
      .requirements-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .requirements-list li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e2e8f0;
      }
      .esg-specialist-root.dark-mode .requirements-list li {
        border-bottom-color: #404040;
      }
      .requirements-list li:last-child {
        border-bottom: none;
      }
      .req-icon {
        flex-shrink: 0;
        font-size: 1.1rem;
      }
      .req-text {
        flex: 1;
        font-weight: 500;
      }
      .req-deadline {
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 500;
      }
      .esg-specialist-root.dark-mode .req-deadline {
        color: #cbd5e1;
      }
      .requirements-list li.completed .req-text {
        text-decoration: line-through;
        color: #64748b;
      }

      /* Calendar Styles */
      .deadlines-calendar {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        padding: 2rem;
        border: 1px solid #e2e8f0;
        margin-bottom: 2rem;
      }
      .esg-specialist-root.dark-mode .deadlines-calendar {
        background: linear-gradient(135deg, #1e1e2e, #2d2d44);
        color: #e0e0e0;
        border: 1px solid #404040;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .calendar-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .calendar-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #cbd5e1;
        background: #fff;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .esg-specialist-root.dark-mode .calendar-btn {
        background: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
      }
      .calendar-btn:hover {
        background: #f1f5f9;
        border-color: #94a3b8;
      }
      .esg-specialist-root.dark-mode .calendar-btn:hover {
        background: #4b5563;
        border-color: #6b7280;
      }
      .current-month {
        font-weight: 600;
        font-size: 1.1rem;
      }
      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
      }
      .calendar-day {
        aspect-ratio: 1;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }
      .esg-specialist-root.dark-mode .calendar-day {
        border-color: #404040;
      }
      .calendar-day:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }
      .esg-specialist-root.dark-mode .calendar-day:hover {
        background: #4b5563;
        border-color: #6b7280;
      }
      .calendar-day.has-deadline {
        background: #fef3c7;
        border-color: #f59e0b;
      }
      .esg-specialist-root.dark-mode .calendar-day.has-deadline {
        background: #451a03;
        border-color: #f59e0b;
      }
      .day-number {
        font-weight: 600;
        font-size: 1rem;
      }
      .day-deadlines {
        position: absolute;
        bottom: 0.25rem;
        left: 0.25rem;
        right: 0.25rem;
      }
      .deadline-item {
        background: #ef4444;
        color: #fff;
        padding: 0.1rem 0.3rem;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-bottom: 0.1rem;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .deadline-item.medium {
        background: #f59e0b;
      }
      .deadline-item.low {
        background: #10b981;
      }

      /* Deadlines List */
      .upcoming-deadlines-list {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        padding: 2rem;
        border: 1px solid #e2e8f0;
      }
      .esg-specialist-root.dark-mode .upcoming-deadlines-list {
        background: linear-gradient(135deg, #1e1e2e, #2d2d44);
        color: #e0e0e0;
        border: 1px solid #404040;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      .deadlines-list {
        margin-top: 1.5rem;
      }
      .deadline-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
      }
      .esg-specialist-root.dark-mode .deadline-card {
        border-color: #404040;
      }
      .deadline-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .esg-specialist-root.dark-mode .deadline-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      .deadline-card.high {
        border-left: 4px solid #ef4444;
      }
      .deadline-card.medium {
        border-left: 4px solid #f59e0b;
      }
      .deadline-card.low {
        border-left: 4px solid #10b981;
      }
      .deadline-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .deadline-date {
        text-align: center;
        flex-shrink: 0;
      }
      .date-day {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .date-day {
        color: #7eaaff;
      }
      .date-month {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
      }
      .esg-specialist-root.dark-mode .date-month {
        color: #cbd5e1;
      }
      .deadline-details {
        flex: 1;
      }
      .deadline-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #1e293b;
      }
      .esg-specialist-root.dark-mode .deadline-title {
        color: #e5e7eb;
      }
      .deadline-description {
        color: #64748b;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
      .esg-specialist-root.dark-mode .deadline-description {
        color: #cbd5e1;
      }
      .deadline-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
      }
      .deadline-standard, .deadline-assignee {
        color: #64748b;
        font-weight: 500;
      }
      .esg-specialist-root.dark-mode .deadline-standard,
      .esg-specialist-root.dark-mode .deadline-assignee {
        color: #cbd5e1;
      }
      .deadline-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .deadline-status {
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
      }
      .deadline-status.pending {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #fff;
      }
      .deadline-status.in-progress {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
      }
      .deadline-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #cbd5e1;
        background: #fff;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.85rem;
      }
      .esg-specialist-root.dark-mode .deadline-btn {
        background: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
      }
      .deadline-btn:hover {
        background: #f1f5f9;
        border-color: #94a3b8;
      }
      .esg-specialist-root.dark-mode .deadline-btn:hover {
        background: #4b5563;
        border-color: #6b7280;
      }

      /* Evidence Categories */
      .evidence-categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
      }
      .category-card {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        padding: 2rem;
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;
      }
      .esg-specialist-root.dark-mode .category-card {
        background: linear-gradient(135deg, #1e1e2e, #2d2d44);
        color: #e0e0e0;
        border: 1px solid #404040;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      .category-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        border-color: #cbd5e1;
      }
      .esg-specialist-root.dark-mode .category-card:hover {
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        border-color: #555;
      }
      .category-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .category-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      .category-info {
        flex: 1;
      }
      .category-name {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #2563eb;
      }
      .esg-specialist-root.dark-mode .category-name {
        color: #7eaaff;
      }
      .category-description {
        color: #64748b;
        font-size: 0.9rem;
        line-height: 1.5;
        margin-bottom: 0.5rem;
      }
      .esg-specialist-root.dark-mode .category-description {
        color: #cbd5e1;
      }
      .category-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        color: #64748b;
      }
      .esg-specialist-root.dark-mode .category-stats {
        color: #cbd5e1;
      }
      .category-files {
        border-top: 1px solid #e2e8f0;
        padding-top: 1rem;
      }
      .esg-specialist-root.dark-mode .category-files {
        border-top-color: #404040;
      }
      .category-files .file-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .esg-specialist-root.dark-mode .category-files .file-item {
        border-bottom-color: #374151;
      }
      .category-files .file-item:last-child {
        border-bottom: none;
      }
      .file-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }
      .file-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .file-name {
        font-weight: 600;
        color: #1e293b;
      }
      .esg-specialist-root.dark-mode .file-name {
        color: #e5e7eb;
      }
      .file-size, .file-date {
        font-size: 0.8rem;
        color: #64748b;
      }
      .esg-specialist-root.dark-mode .file-size,
      .esg-specialist-root.dark-mode .file-date {
        color: #cbd5e1;
      }
      .file-actions {
        display: flex;
        gap: 0.5rem;
      }
      .file-btn {
        padding: 0.3rem 0.6rem;
        border: 1px solid #cbd5e1;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.75rem;
      }
      .esg-specialist-root.dark-mode .file-btn {
        background: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
      }
      .file-btn:hover {
        background: #f1f5f9;
        border-color: #94a3b8;
      }
      .esg-specialist-root.dark-mode .file-btn:hover {
        background: #4b5563;
        border-color: #6b7280;
      }
      .file-btn.delete:hover {
        background: #fef2f2;
        border-color: #fca5a5;
        color: #dc2626;
      }
      .esg-specialist-root.dark-mode .file-btn.delete:hover {
        background: #450a0a;
        border-color: #fca5a5;
        color: #fca5a5;
      }
    </style>
    <div class="esg-specialist-root" [class.dark-mode]="darkMode">
      <aside class="edash-sidenav" [class.collapsed]="sidebarCollapsed" [class.dark-mode]="darkMode">
        <div class="edash-sidenav-header">
          <img src="https://lms-frontend-resources.s3.ap-south-1.amazonaws.com/marlnLogo.jpeg" alt="Logo" class="edash-logo" />
          <span *ngIf="!sidebarCollapsed" class="edash-title">ESG Specialist</span>
        </div>
                            <nav class="edash-nav">
                      <!-- Main Dashboard Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.DASHBOARD') }}</div>
                        <div class="edash-nav-link"
                             [class.active]="selectedDashboard === 'overview'"
                             (click)="selectDashboard('overview')"
                             data-title="ESG Metrics Overview">
                          <span class="edash-nav-icon">📊</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.ESG_METRICS_OVERVIEW') }}</span>
                        </div>
                        <div class="edash-nav-link"
                             [class.active]="selectedDashboard === 'environmental'"
                             (click)="selectDashboard('environmental')"
                             data-title="Environmental Dashboard">
                          <span class="edash-nav-icon">🌍</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.ENVIRONMENTAL_DASHBOARD') }}</span>
                        </div>
                        <div class="edash-nav-link"
                             [class.active]="selectedDashboard === 'social'"
                             (click)="selectDashboard('social')"
                             data-title="Social Dashboard">
                          <span class="edash-nav-icon">🤝</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.SOCIAL_DASHBOARD') }}</span>
                        </div>
                        <div class="edash-nav-link"
                             [class.active]="selectedDashboard === 'governance'"
                             (click)="selectDashboard('governance')"
                             data-title="Governance Dashboard">
                          <span class="edash-nav-icon">🏛️</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.GOVERNANCE_DASHBOARD') }}</span>
                        </div>
                      </div>

                      <!-- Data Management Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.DATA_MANAGEMENT') }}</div>
                        <div class="edash-nav-link" (click)="selectDashboard('enter-data')" data-title="Enter Data">
                          <span class="edash-nav-icon">✏️</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.ENTER_DATA') }}</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('upload-file')" data-title="Upload File">
                          <span class="edash-nav-icon">📤</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.UPLOAD_FILE') }}</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('data-validation')" data-title="Data Validation">
                          <span class="edash-nav-icon">✅</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.DATA_VALIDATION') }}</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('change-log')" data-title="Change Log">
                          <span class="edash-nav-icon">📋</span>
                          <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.CHANGE_LOG') }}</span>
                        </div>
                      </div>

                      <!-- Reports Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">Reports</div>
                        <div class="edash-nav-link" (click)="selectDashboard('generate-report')" data-title="Generate Report">
                          <span class="edash-nav-icon">📄</span>
                          <span *ngIf="!sidebarCollapsed">Generate Report</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('past-reports')" data-title="Past Reports">
                          <span class="edash-nav-icon">📚</span>
                          <span *ngIf="!sidebarCollapsed">Past Reports</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('report-templates')" data-title="Report Templates">
                          <span class="edash-nav-icon">📋</span>
                          <span *ngIf="!sidebarCollapsed">Report Templates</span>
                        </div>
                      </div>

                      <!-- Compliance & Standards Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">Compliance & Standards</div>
                        <div class="edash-nav-link" (click)="selectDashboard('compliance-checklist')" data-title="Compliance Checklist">
                          <span class="edash-nav-icon">✅</span>
                          <span *ngIf="!sidebarCollapsed">Compliance Checklist</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('upcoming-deadlines')" data-title="Upcoming Deadlines">
                          <span class="edash-nav-icon">📆</span>
                          <span *ngIf="!sidebarCollapsed">Upcoming Deadlines</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('upload-evidence')" data-title="Upload Supporting Evidence">
                          <span class="edash-nav-icon">📂</span>
                          <span *ngIf="!sidebarCollapsed">Upload Supporting Evidence</span>
                        </div>
                      </div>

                      <!-- Site/Department Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">Site/Department</div>
                        <div class="edash-nav-link" (click)="selectDashboard('site-view')" data-title="Site View">
                          <span class="edash-nav-icon">🌍</span>
                          <span *ngIf="!sidebarCollapsed">Site View</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('department-view')" data-title="Department View">
                          <span class="edash-nav-icon">🏢</span>
                          <span *ngIf="!sidebarCollapsed">Department View</span>
                        </div>
                      </div>

                      <!-- Tasks & Workflows Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">Tasks & Workflows</div>
                        <div class="edash-nav-link" (click)="selectDashboard('my-tasks')" data-title="My Tasks">
                          <span class="edash-nav-icon">📝</span>
                          <span *ngIf="!sidebarCollapsed">My Tasks</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('workflow-tracker')" data-title="Workflow Tracker">
                          <span class="edash-nav-icon">🔄</span>
                          <span *ngIf="!sidebarCollapsed">Workflow Tracker</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('notifications')" data-title="Notifications">
                          <span class="edash-nav-icon">🔔</span>
                          <span *ngIf="!sidebarCollapsed">Notifications</span>
                        </div>
                      </div>

                      <!-- Collaboration Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">Collaboration</div>
                        <div class="edash-nav-link" (click)="selectDashboard('comments')" data-title="Comments">
                          <span class="edash-nav-icon">💬</span>
                          <span *ngIf="!sidebarCollapsed">Comments</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('assign-tasks')" data-title="Assign Tasks">
                          <span class="edash-nav-icon">👥</span>
                          <span *ngIf="!sidebarCollapsed">Assign Tasks</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('review-logs')" data-title="Review Logs">
                          <span class="edash-nav-icon">📋</span>
                          <span *ngIf="!sidebarCollapsed">Review Logs</span>
                        </div>
                      </div>

                      <!-- Document Library Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">Document Library</div>
                        <div class="edash-nav-link" (click)="selectDashboard('document-repository')" data-title="Document Repository">
                          <span class="edash-nav-icon">📁</span>
                          <span *ngIf="!sidebarCollapsed">Document Repository</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('upload-download')" data-title="Upload/Download">
                          <span class="edash-nav-icon">📤</span>
                          <span *ngIf="!sidebarCollapsed">Upload/Download</span>
                        </div>
                      </div>

                      <!-- Help & Resources Section -->
                      <div class="edash-nav-section">
                        <div class="edash-nav-section-title" *ngIf="!sidebarCollapsed">Help & Resources</div>
                        <div class="edash-nav-link" (click)="selectDashboard('knowledge-base')" data-title="Knowledge Base">
                          <span class="edash-nav-icon">📘</span>
                          <span *ngIf="!sidebarCollapsed">Knowledge Base</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('training')" data-title="Training">
                          <span class="edash-nav-icon">🎓</span>
                          <span *ngIf="!sidebarCollapsed">Training</span>
                        </div>
                        <div class="edash-nav-link" (click)="selectDashboard('user-logs')" data-title="User Logs">
                          <span class="edash-nav-icon">👤</span>
                          <span *ngIf="!sidebarCollapsed">User Logs</span>
                        </div>
                      </div>
          <div class="edash-nav-actions">
            <app-unified-language-toggle></app-unified-language-toggle>
            <button class="edash-sidenav-toggle" (click)="sidebarCollapsed=!sidebarCollapsed" aria-label="Toggle sidenav">
              <span class="icon">{{ sidebarCollapsed ? '➡️' : '⬅️' }}</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.COLLAPSE') }}</span>
            </button>

            <button class="edash-dark-toggle" (click)="toggleDarkMode()" aria-label="Toggle dark mode">
              <span class="icon">{{ darkMode ? '☀️' : '🌙' }}</span>
              <span *ngIf="!sidebarCollapsed">{{ darkMode ? getTranslatedText('NAVIGATION.LIGHT_MODE') : getTranslatedText('NAVIGATION.DARK_MODE') }}</span>
            </button>
            <button class="edash-logout" (click)="logout()" aria-label="Logout">
              <span class="icon">🚪</span>
              <span *ngIf="!sidebarCollapsed">{{ getTranslatedText('NAVIGATION.LOGOUT') }}</span>
            </button>
          </div>
        </nav>
      </aside>
      <main class="esg-main" [class.collapsed]="sidebarCollapsed">
        <div class="esg-header">
          <div>
            <h1 class="esg-title">{{ getDashboardTitle() }}</h1>
            <p class="esg-subtitle">{{ getTranslatedText('ESG_SPECIALIST.WELCOME_MESSAGE') }}</p>
          </div>
        </div>

        <!-- Environmental Dashboard Content -->
        <div *ngIf="selectedDashboard === 'environmental'" class="dashboard-content">
          <div class="env-header">
            <div>
              <h2>Environmental Metrics Dashboard Overview</h2>
              <p class="env-subtitle">Welcome back, ESG Specialist</p>
            </div>
            <div class="env-actions">
              <button class="env-btn primary">Add new metrics</button>
              <button class="env-btn secondary">Export Report</button>
            </div>
          </div>

          <!-- KPI Summary Cards -->
          <div class="env-kpi-row">
            <div class="env-kpi-card emissions">
              <div class="env-kpi-icon">🎯</div>
              <div class="env-kpi-value">12255</div>
              <div class="env-kpi-label">Total Emissions (tCO₂e)</div>
            </div>
            <div class="env-kpi-card energy">
              <div class="env-kpi-icon">📊</div>
              <div class="env-kpi-value">150000</div>
              <div class="env-kpi-label">Energy consumption (GWh)</div>
            </div>
            <div class="env-kpi-card water">
              <div class="env-kpi-icon">📢</div>
              <div class="env-kpi-value">Infinite</div>
              <div class="env-kpi-label">Water uses (m³)</div>
            </div>
            <div class="env-kpi-card recycling">
              <div class="env-kpi-icon">🧑‍🤝‍🧑</div>
              <div class="env-kpi-value">15%</div>
              <div class="env-kpi-label">Recycling rate</div>
            </div>
            <div class="env-kpi-card roi">
              <div class="env-kpi-icon">💰</div>
              <div class="env-kpi-value">285%</div>
              <div class="env-kpi-label">ROI</div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="env-charts-row">
            <!-- Environmental Fines Chart -->
            <div class="env-chart-card">
              <div class="env-chart-title">Environmental Fines ($)</div>
              <div class="env-chart-content">
                <svg width="100%" height="200" viewBox="0 0 400 200">
                  <!-- Grid lines -->
                  <line x1="50" y1="40" x2="350" y2="40" stroke="#e0e7ff" stroke-width="1" />
                  <line x1="50" y1="80" x2="350" y2="80" stroke="#e0e7ff" stroke-width="1" />
                  <line x1="50" y1="120" x2="350" y2="120" stroke="#e0e7ff" stroke-width="1" />
                  <line x1="50" y1="160" x2="350" y2="160" stroke="#e0e7ff" stroke-width="1" />
                  
                  <!-- Fines line -->
                  <polyline points="50,160 100,140 150,120 200,100 250,90 300,80" 
                            fill="none" stroke="#4a6cff" stroke-width="3" />
                  
                  <!-- Data points -->
                  <circle cx="50" cy="160" r="4" fill="#4a6cff" />
                  <circle cx="100" cy="140" r="4" fill="#4a6cff" />
                  <circle cx="150" cy="120" r="4" fill="#4a6cff" />
                  <circle cx="200" cy="100" r="4" fill="#4a6cff" />
                  <circle cx="250" cy="90" r="4" fill="#4a6cff" />
                  <circle cx="300" cy="80" r="4" fill="#4a6cff" />
                  
                  <!-- X axis labels -->
                  <text x="50" y="190" font-size="12" fill="#23284a">Jan</text>
                  <text x="100" y="190" font-size="12" fill="#23284a">Feb</text>
                  <text x="150" y="190" font-size="12" fill="#23284a">Mar</text>
                  <text x="200" y="190" font-size="12" fill="#23284a">Apr</text>
                  <text x="250" y="190" font-size="12" fill="#23284a">May</text>
                  <text x="300" y="190" font-size="12" fill="#23284a">Jun</text>
                  
                  <!-- Y axis labels -->
                  <text x="10" y="40" font-size="12" fill="#23284a">60000</text>
                  <text x="10" y="80" font-size="12" fill="#23284a">45000</text>
                  <text x="10" y="120" font-size="12" fill="#23284a">30000</text>
                  <text x="10" y="160" font-size="12" fill="#23284a">15000</text>
                </svg>
                <div class="env-chart-legend">→ Fines</div>
              </div>
            </div>

            <!-- Scope of Emission Chart -->
            <div class="env-chart-card">
              <div class="env-chart-title">Scope of emission</div>
              <div class="env-chart-content">
                <svg width="100%" height="200" viewBox="0 0 400 200">
                  <!-- Pie chart segments -->
                  <circle cx="200" cy="100" r="60" fill="#2ecc71" />
                  <circle cx="200" cy="100" r="60" fill="#4a6cff" 
                          stroke-dasharray="188.5 377" stroke-dashoffset="113.1" />
                  <circle cx="200" cy="100" r="60" fill="#fdba74" 
                          stroke-dasharray="113.1 377" stroke-dashoffset="301.6" />
                  
                  <!-- Center circle -->
                  <circle cx="200" cy="100" r="20" fill="#fff" />
                  
                  <!-- Labels -->
                  <text x="200" y="50" font-size="14" fill="#2ecc71" text-anchor="middle">Indirect Emission 60%</text>
                  <text x="200" y="170" font-size="14" fill="#4a6cff" text-anchor="middle">Direct Emission 30%</text>
                  <text x="120" y="100" font-size="14" fill="#fdba74" text-anchor="middle">Other Indirect 10%</text>
                </svg>
              </div>
            </div>
          </div>

          <!-- Bottom Sections -->
          <div class="env-bottom-row">
            <div class="env-card">
              <div class="env-card-title">Activity Log</div>
              <ul class="env-activity-log">
                <li><span class="dot blue"></span>New metrics added <span class="log-meta">2 hours ago by Sara Khalid</span></li>
                <li><span class="dot green"></span>Reduce indirect emission initiative deploy <span class="log-meta">5 hours ago by Jane Smith</span></li>
                <li><span class="dot gray"></span>Performance Report Created <span class="log-meta">1 day ago by Mike Johnson</span></li>
              </ul>
            </div>
            
            <div class="env-card">
              <div class="env-card-title">Upcoming Key Follow-ups</div>
              <ul class="env-followups">
                <li><input type="checkbox" /> Evaluate Mid year Environmental metrics <span class="followup-date">June 15, 2025</span></li>
                <li><input type="checkbox" /> GHG Intensity (per revenue/employee) Review <span class="followup-date">June 16, 2025</span></li>
                <li><input type="checkbox" /> Budget Planning Meeting <span class="followup-date">June 17, 2025</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Social Dashboard Content -->
        <div *ngIf="selectedDashboard === 'social'" class="dashboard-content">
          <div class="social-header">
            <div>
              <h2>Social Metrics Dashboard Overview</h2>
              <p class="social-subtitle">Welcome back, ESG Specialist</p>
            </div>
            <div class="social-actions">
              <button class="social-btn primary">Add new metrics</button>
              <button class="social-btn secondary">Export Report</button>
            </div>
          </div>

          <!-- KPI Summary Cards -->
          <div class="social-kpi-row">
            <div class="social-kpi-card diversity">
              <div class="social-kpi-icon">👥</div>
              <div class="social-kpi-value">52%</div>
              <div class="social-kpi-label">Workforce Diversity</div>
              <div class="social-kpi-standard">GRI 404</div>
            </div>
            <div class="social-kpi-card training">
              <div class="social-kpi-icon">🎓</div>
              <div class="social-kpi-value">120</div>
              <div class="social-kpi-label">Training Hours/Employee</div>
              <div class="social-kpi-standard">GRI 404</div>
            </div>
            <div class="social-kpi-card safety">
              <div class="social-kpi-icon">🛡️</div>
              <div class="social-kpi-value">0.8</div>
              <div class="social-kpi-label">LTIR Rate</div>
              <div class="social-kpi-standard">GRI 403, CRDS</div>
            </div>
            <div class="social-kpi-card saudization">
              <div class="social-kpi-icon">🇸🇦</div>
              <div class="social-kpi-value">78%</div>
              <div class="social-kpi-label">Saudization Rate</div>
              <div class="social-kpi-standard">Tadawul, CRDS</div>
            </div>
            <div class="social-kpi-card csr">
              <div class="social-kpi-icon">🤝</div>
              <div class="social-kpi-value">$2.5M</div>
              <div class="social-kpi-label">CSR Investment</div>
              <div class="social-kpi-standard">GRI 413, CRDS</div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="social-charts-row">
            <!-- Diversity & Inclusion Chart -->
            <div class="social-chart-card">
              <div class="social-chart-title">Workforce Diversity & Inclusion</div>
              <div class="social-chart-content">
                <svg width="100%" height="200" viewBox="0 0 400 200">
                  <!-- Gender Diversity Bar Chart -->
                  <rect x="50" y="120" width="60" height="60" fill="#4a6cff" />
                  <rect x="130" y="100" width="60" height="80" fill="#2ecc71" />
                  <rect x="210" y="80" width="60" height="100" fill="#fdba74" />
                  <rect x="290" y="60" width="60" height="120" fill="#e74c3c" />
                  
                  <!-- Labels -->
                  <text x="80" y="190" font-size="12" fill="#23284a" text-anchor="middle">Gender</text>
                  <text x="160" y="190" font-size="12" fill="#23284a" text-anchor="middle">Nationality</text>
                  <text x="240" y="190" font-size="12" fill="#23284a" text-anchor="middle">Age</text>
                  <text x="320" y="190" font-size="12" fill="#23284a" text-anchor="middle">Leadership</text>
                  
                  <!-- Values -->
                  <text x="80" y="115" font-size="10" fill="#fff" text-anchor="middle">52%</text>
                  <text x="160" y="95" font-size="10" fill="#fff" text-anchor="middle">65%</text>
                  <text x="240" y="75" font-size="10" fill="#fff" text-anchor="middle">78%</text>
                  <text x="320" y="55" font-size="10" fill="#fff" text-anchor="middle">45%</text>
                </svg>
                <div class="social-chart-legend">Diversity Metrics by Category</div>
              </div>
            </div>

            <!-- Training & Development Chart -->
            <div class="social-chart-card">
              <div class="social-chart-title">Training & Development Progress</div>
              <div class="social-chart-content">
                <svg width="100%" height="200" viewBox="0 0 400 200">
                  <!-- Progress circles -->
                  <circle cx="200" cy="100" r="60" fill="none" stroke="#e0e7ff" stroke-width="8" />
                  <circle cx="200" cy="100" r="60" fill="none" stroke="#4a6cff" stroke-width="8" 
                          stroke-dasharray="339.3" stroke-dashoffset="67.86" />
                  
                  <!-- Center text -->
                  <text x="200" y="95" font-size="16" fill="#4a6cff" text-anchor="middle" font-weight="bold">80%</text>
                  <text x="200" y="115" font-size="12" fill="#666" text-anchor="middle">Complete</text>
                  
                  <!-- Legend -->
                  <circle cx="100" cy="160" r="4" fill="#4a6cff" />
                  <text x="110" y="165" font-size="12" fill="#23284a">Completed</text>
                  <circle cx="250" cy="160" r="4" fill="#e0e7ff" />
                  <text x="260" y="165" font-size="12" fill="#23284a">Remaining</text>
                </svg>
              </div>
            </div>
          </div>

          <!-- Compliance Standards Section -->
          <div class="social-compliance-section">
            <div class="social-compliance-title">Compliance Standards & Policies</div>
            <div class="social-compliance-grid">
              <div class="social-compliance-card">
                <div class="compliance-icon">🔒</div>
                <div class="compliance-title">Data Privacy</div>
                <div class="compliance-standard">PDPL, GRI 418</div>
                <div class="compliance-status compliant">Compliant</div>
              </div>
              <div class="social-compliance-card">
                <div class="compliance-icon">⚖️</div>
                <div class="compliance-title">Human Rights</div>
                <div class="compliance-standard">GRI 412</div>
                <div class="compliance-status compliant">Compliant</div>
              </div>
              <div class="social-compliance-card">
                <div class="compliance-icon">🛡️</div>
                <div class="compliance-title">Health & Safety</div>
                <div class="compliance-standard">GRI 403, CRDS</div>
                <div class="compliance-status compliant">Compliant</div>
              </div>
              <div class="social-compliance-card">
                <div class="compliance-icon">🇸🇦</div>
                <div class="compliance-title">Saudization</div>
                <div class="compliance-standard">Tadawul, CRDS</div>
                <div class="compliance-status warning">Review Required</div>
              </div>
            </div>
          </div>

          <!-- Carbon Calculator Section -->
          <div class="carbon-calculator-section">
            <div class="carbon-calculator-header">
              <h3 class="carbon-calculator-title">🌱 Carbon Footprint Calculator</h3>
              <div class="carbon-calculator-actions">
                <button class="carbon-calculator-btn secondary" (click)="resetCarbonCalculator()">🔄 Reset</button>
                <button class="carbon-calculator-btn primary" (click)="calculateCarbonFootprint()">🧮 Calculate</button>
              </div>
            </div>
            
            <div class="carbon-calculator-grid">
              <!-- Input Card -->
              <div class="carbon-input-card">
                <h3>📝 Input Data</h3>
                
                <div class="carbon-input-group">
                  <label class="carbon-input-label">Energy Consumption (kWh/month)</label>
                  <input type="number" class="carbon-input" [(ngModel)]="carbonData.energyConsumption" placeholder="Enter monthly energy consumption">
                </div>
                
                <div class="carbon-input-group">
                  <label class="carbon-input-label">Transportation Type</label>
                  <select class="carbon-select" [(ngModel)]="carbonData.transportType">
                    <option value="">Select transportation type</option>
                    <option value="car">Car (Gasoline)</option>
                    <option value="car_electric">Car (Electric)</option>
                    <option value="public_transit">Public Transit</option>
                    <option value="bicycle">Bicycle/Walking</option>
                  </select>
                </div>
                
                <div class="carbon-input-group">
                  <label class="carbon-input-label">Distance Traveled (km/month)</label>
                  <input type="number" class="carbon-input" [(ngModel)]="carbonData.distanceTraveled" placeholder="Enter monthly distance">
                </div>
                
                <div class="carbon-input-group">
                  <label class="carbon-input-label">Waste Generated (kg/month)</label>
                  <input type="number" class="carbon-input" [(ngModel)]="carbonData.wasteGenerated" placeholder="Enter monthly waste">
                </div>
                
                <div class="carbon-input-group">
                  <label class="carbon-input-label">Water Consumption (liters/month)</label>
                  <input type="number" class="carbon-input" [(ngModel)]="carbonData.waterConsumption" placeholder="Enter monthly water usage">
                </div>
                
                <div class="carbon-input-group">
                  <label class="carbon-input-label">Diet Type</label>
                  <select class="carbon-select" [(ngModel)]="carbonData.dietType">
                    <option value="">Select diet type</option>
                    <option value="meat_heavy">Meat-heavy diet</option>
                    <option value="balanced">Balanced diet</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>
              
              <!-- Results Card -->
              <div class="carbon-results-card">
                <h3>📊 Carbon Footprint Results</h3>
                
                <div class="carbon-result-item">
                  <span class="carbon-result-label">Energy Emissions</span>
                  <span class="carbon-result-value">{{carbonResults.energyEmissions | number:'1.1-1'}} kg CO₂</span>
                </div>
                
                <div class="carbon-result-item">
                  <span class="carbon-result-label">Transportation Emissions</span>
                  <span class="carbon-result-value">{{carbonResults.transportEmissions | number:'1.1-1'}} kg CO₂</span>
                </div>
                
                <div class="carbon-result-item">
                  <span class="carbon-result-label">Waste Emissions</span>
                  <span class="carbon-result-value">{{carbonResults.wasteEmissions | number:'1.1-1'}} kg CO₂</span>
                </div>
                
                <div class="carbon-result-item">
                  <span class="carbon-result-label">Water Emissions</span>
                  <span class="carbon-result-value">{{carbonResults.waterEmissions | number:'1.1-1'}} kg CO₂</span>
                </div>
                
                <div class="carbon-result-item">
                  <span class="carbon-result-label">Diet Emissions</span>
                  <span class="carbon-result-value">{{carbonResults.dietEmissions | number:'1.1-1'}} kg CO₂</span>
                </div>
                
                <div class="carbon-total">
                  <div class="carbon-total-label">Total Monthly Carbon Footprint</div>
                  <div class="carbon-total-value">{{carbonResults.totalEmissions | number:'1.0-0'}} kg CO₂</div>
                </div>
                
                <div class="carbon-categories">
                  <div class="carbon-category">
                    <div class="carbon-category-icon">⚡</div>
                    <div class="carbon-category-label">Energy</div>
                    <div class="carbon-category-value">{{carbonResults.energyPercentage | number:'1.0-0'}}%</div>
                  </div>
                  <div class="carbon-category">
                    <div class="carbon-category-icon">🚗</div>
                    <div class="carbon-category-label">Transport</div>
                    <div class="carbon-category-value">{{carbonResults.transportPercentage | number:'1.0-0'}}%</div>
                  </div>
                  <div class="carbon-category">
                    <div class="carbon-category-icon">🗑️</div>
                    <div class="carbon-category-label">Waste</div>
                    <div class="carbon-category-value">{{carbonResults.wastePercentage | number:'1.0-0'}}%</div>
                  </div>
                  <div class="carbon-category">
                    <div class="carbon-category-icon">💧</div>
                    <div class="carbon-category-label">Water</div>
                    <div class="carbon-category-value">{{carbonResults.waterPercentage | number:'1.0-0'}}%</div>
                  </div>
                  <div class="carbon-category">
                    <div class="carbon-category-icon">🍽️</div>
                    <div class="carbon-category-label">Diet</div>
                    <div class="carbon-category-value">{{carbonResults.dietPercentage | number:'1.0-0'}}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Sections -->
          <div class="social-bottom-row">
            <div class="social-card">
              <div class="social-card-title">Recent Activities</div>
              <ul class="social-activity-log">
                <li><span class="dot blue"></span>Diversity training completed <span class="log-meta">2 hours ago by HR Team</span></li>
                <li><span class="dot green"></span>Safety audit passed <span class="log-meta">5 hours ago by Safety Officer</span></li>
                <li><span class="dot orange"></span>CSR project launched <span class="log-meta">1 day ago by Community Manager</span></li>
                <li><span class="dot purple"></span>Data privacy review <span class="log-meta">2 days ago by Legal Team</span></li>
              </ul>
            </div>
            
            <div class="social-card">
              <div class="social-card-title">Upcoming Compliance Deadlines</div>
              <ul class="social-followups">
                <li><input type="checkbox" /> GRI 404 Diversity Report <span class="followup-date">June 20, 2025</span></li>
                <li><input type="checkbox" /> CRDS Health & Safety Review <span class="followup-date">June 25, 2025</span></li>
                <li><input type="checkbox" /> PDPL Compliance Audit <span class="followup-date">July 1, 2025</span></li>
                <li><input type="checkbox" /> Tadawul Saudization Report <span class="followup-date">July 15, 2025</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Governance Dashboard Content -->
        <div *ngIf="selectedDashboard === 'governance'" class="dashboard-content">
          <div class="gov-header">
            <div>
              <h2>Governance Metrics Dashboard Overview</h2>
              <p class="gov-subtitle">Welcome back, ESG Specialist</p>
            </div>
            <div class="gov-actions">
              <button class="gov-btn primary">Add new metrics</button>
              <button class="gov-btn secondary">Export Report</button>
            </div>
          </div>

          <!-- KPI Summary Cards -->
          <div class="gov-kpi-row">
            <div class="gov-kpi-card board">
              <div class="gov-kpi-icon">🏛️</div>
              <div class="gov-kpi-value">75%</div>
              <div class="gov-kpi-label">Board Independence</div>
              <div class="gov-kpi-standard">CRDS, Tadawul</div>
            </div>
            <div class="gov-kpi-card diversity">
              <div class="gov-kpi-icon">👥</div>
              <div class="gov-kpi-value">60%</div>
              <div class="gov-kpi-label">Board Diversity</div>
              <div class="gov-kpi-standard">CRDS, Tadawul</div>
            </div>
            <div class="gov-kpi-card compliance">
              <div class="gov-kpi-icon">✅</div>
              <div class="gov-kpi-value">98%</div>
              <div class="gov-kpi-label">Compliance Rate</div>
              <div class="gov-kpi-standard">Tadawul, CRDS</div>
            </div>
            <div class="gov-kpi-card risk">
              <div class="gov-kpi-icon">🛡️</div>
              <div class="gov-kpi-value">Low</div>
              <div class="gov-kpi-label">Risk Rating</div>
              <div class="gov-kpi-standard">CRDS, Tadawul</div>
            </div>
            <div class="gov-kpi-card ethics">
              <div class="gov-kpi-icon">⚖️</div>
              <div class="gov-kpi-value">95%</div>
              <div class="gov-kpi-label">Ethics Score</div>
              <div class="gov-kpi-standard">GRI 205, CRDS</div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="gov-charts-row">
            <!-- Board Composition Chart -->
            <div class="gov-chart-card">
              <div class="gov-chart-title">Board Composition & Independence</div>
              <div class="gov-chart-content">
                <svg width="100%" height="200" viewBox="0 0 400 200">
                  <!-- Pie chart for board composition -->
                  <circle cx="200" cy="100" r="60" fill="#4a6cff" />
                  <circle cx="200" cy="100" r="60" fill="#2ecc71" 
                          stroke-dasharray="188.5 377" stroke-dashoffset="75.4" />
                  <circle cx="200" cy="100" r="60" fill="#fdba74" 
                          stroke-dasharray="113.1 377" stroke-dashoffset="263.9" />
                  
                  <!-- Center circle -->
                  <circle cx="200" cy="100" r="20" fill="#fff" />
                  
                  <!-- Labels -->
                  <text x="200" y="50" font-size="14" fill="#4a6cff" text-anchor="middle">Independent 50%</text>
                  <text x="200" y="170" font-size="14" fill="#2ecc71" text-anchor="middle">Executive 30%</text>
                  <text x="120" y="100" font-size="14" fill="#fdba74" text-anchor="middle">Non-Exec 20%</text>
                </svg>
              </div>
            </div>

            <!-- Risk Management Chart -->
            <div class="gov-chart-card">
              <div class="gov-chart-title">ESG Risk Management Framework</div>
              <div class="gov-chart-content">
                <svg width="100%" height="200" viewBox="0 0 400 200">
                  <!-- Risk categories -->
                  <rect x="50" y="150" width="80" height="30" fill="#4a6cff" />
                  <rect x="150" y="120" width="80" height="60" fill="#2ecc71" />
                  <rect x="250" y="90" width="80" height="90" fill="#fdba74" />
                  <rect x="350" y="60" width="40" height="120" fill="#e74c3c" />
                  
                  <!-- Labels -->
                  <text x="90" y="175" font-size="10" fill="#fff" text-anchor="middle">Climate</text>
                  <text x="190" y="155" font-size="10" fill="#fff" text-anchor="middle">Social</text>
                  <text x="290" y="140" font-size="10" fill="#fff" text-anchor="middle">Governance</text>
                  <text x="370" y="125" font-size="10" fill="#fff" text-anchor="middle">Financial</text>
                  
                  <!-- Risk levels -->
                  <text x="90" y="190" font-size="8" fill="#666" text-anchor="middle">Low</text>
                  <text x="190" y="190" font-size="8" fill="#666" text-anchor="middle">Medium</text>
                  <text x="290" y="190" font-size="8" fill="#666" text-anchor="middle">High</text>
                  <text x="370" y="190" font-size="8" fill="#666" text-anchor="middle">Critical</text>
                </svg>
              </div>
            </div>
          </div>

          <!-- Governance Framework Section -->
          <div class="gov-framework-section">
            <div class="gov-framework-title">Governance Framework & Policies</div>
            <div class="gov-framework-grid">
              <div class="gov-framework-card">
                <div class="framework-icon">👑</div>
                <div class="framework-title">ESG Roles & Responsibilities</div>
                <div class="framework-standard">Tadawul, CRDS</div>
                <div class="framework-status compliant">Implemented</div>
              </div>
              <div class="gov-framework-card">
                <div class="framework-icon">🏛️</div>
                <div class="framework-title">Board Composition & Diversity</div>
                <div class="framework-standard">CRDS, Tadawul</div>
                <div class="framework-status compliant">Compliant</div>
              </div>
              <div class="gov-framework-card">
                <div class="framework-icon">🚨</div>
                <div class="framework-title">Anti-corruption & Whistleblower</div>
                <div class="framework-standard">GRI 205, CRDS</div>
                <div class="framework-status compliant">Active</div>
              </div>
              <div class="gov-framework-card">
                <div class="framework-icon">📋</div>
                <div class="framework-title">CGR & Tadawul Compliance</div>
                <div class="framework-standard">Tadawul, CRDS</div>
                <div class="framework-status compliant">Compliant</div>
              </div>
              <div class="gov-framework-card">
                <div class="framework-icon">🛡️</div>
                <div class="framework-title">ESG Risk Management</div>
                <div class="framework-standard">CRDS, Tadawul</div>
                <div class="framework-status compliant">Implemented</div>
              </div>
              <div class="gov-framework-card">
                <div class="framework-icon">💰</div>
                <div class="framework-title">ESG-linked Remuneration</div>
                <div class="framework-standard">CRDS</div>
                <div class="framework-status warning">Under Review</div>
              </div>
            </div>
          </div>

          <!-- Bottom Sections -->
          <div class="gov-bottom-row">
            <div class="gov-card">
              <div class="gov-card-title">Governance Activities</div>
              <ul class="gov-activity-log">
                <li><span class="dot blue"></span>Board diversity review completed <span class="log-meta">2 hours ago by Governance Team</span></li>
                <li><span class="dot green"></span>ESG risk assessment updated <span class="log-meta">5 hours ago by Risk Manager</span></li>
                <li><span class="dot orange"></span>Whistleblower policy revised <span class="log-meta">1 day ago by Legal Team</span></li>
                <li><span class="dot purple"></span>Anti-corruption training launched <span class="log-meta">2 days ago by Compliance Officer</span></li>
              </ul>
            </div>
            
            <div class="gov-card">
              <div class="gov-card-title">Upcoming Governance Deadlines</div>
              <ul class="gov-followups">
                <li><input type="checkbox" /> Board Independence Review <span class="followup-date">June 22, 2025</span></li>
                <li><input type="checkbox" /> ESG Risk Framework Update <span class="followup-date">June 28, 2025</span></li>
                <li><input type="checkbox" /> Tadawul Governance Report <span class="followup-date">July 5, 2025</span></li>
                <li><input type="checkbox" /> CGR Compliance Audit <span class="followup-date">July 20, 2025</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ESG Metrics Overview Content -->
        <div *ngIf="selectedDashboard === 'overview'" class="dashboard-content">
          <div class="overview-header">
            <div>
              <h2>ESG Metrics Overview</h2>
              <p class="overview-subtitle">Welcome back, ESG Specialist</p>
            </div>
            <div class="overview-actions">
              <button class="overview-btn primary">Generate Report</button>
              <button class="overview-btn secondary">Export Data</button>
            </div>
          </div>

          <!-- Overall ESG Score -->
          <div class="overview-score-section">
            <div class="overview-score-card">
              <div class="overview-score-value">A+</div>
              <div class="overview-score-label">Overall ESG Score</div>
              <div class="overview-score-trend positive">+5% vs Last Year</div>
            </div>
          </div>

          <!-- ESG Pillars Summary -->
          <div class="overview-pillars-row">
            <div class="overview-pillar-card environmental">
              <div class="pillar-icon">🌍</div>
              <div class="pillar-score">92%</div>
              <div class="pillar-label">Environmental</div>
              <div class="pillar-trend positive">+3%</div>
            </div>
            <div class="overview-pillar-card social">
              <div class="pillar-icon">🤝</div>
              <div class="pillar-score">88%</div>
              <div class="pillar-label">Social</div>
              <div class="pillar-trend positive">+7%</div>
            </div>
            <div class="overview-pillar-card governance">
              <div class="pillar-icon">🏛️</div>
              <div class="pillar-score">95%</div>
              <div class="pillar-label">Governance</div>
              <div class="pillar-trend positive">+2%</div>
            </div>
          </div>

          <!-- Key Metrics Grid -->
          <div class="overview-metrics-grid">
            <div class="overview-metric-card">
              <h3>📊 Key Performance Indicators</h3>
              <div class="metric-list">
                <div class="metric-item">
                  <span class="metric-name">Carbon Footprint</span>
                  <span class="metric-value">12,255 tCO₂e</span>
                </div>
                <div class="metric-item">
                  <span class="metric-name">Energy Consumption</span>
                  <span class="metric-value">150,000 GWh</span>
                </div>
                <div class="metric-item">
                  <span class="metric-name">Water Usage</span>
                  <span class="metric-value">Infinite m³</span>
                </div>
                <div class="metric-item">
                  <span class="metric-name">Waste Recycling</span>
                  <span class="metric-value">15%</span>
                </div>
              </div>
            </div>
            <div class="overview-metric-card">
              <h3>🎯 Compliance Status</h3>
              <div class="compliance-list">
                <div class="compliance-item compliant">
                  <span class="compliance-name">GRI Standards</span>
                  <span class="compliance-status">Compliant</span>
                </div>
                <div class="compliance-item compliant">
                  <span class="compliance-name">Tadawul</span>
                  <span class="compliance-status">Compliant</span>
                </div>
                <div class="compliance-item compliant">
                  <span class="compliance-name">CRDS</span>
                  <span class="compliance-status">Compliant</span>
                </div>
                <div class="compliance-item warning">
                  <span class="compliance-name">CDP</span>
                  <span class="compliance-status">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enter Data Section -->
        <div *ngIf="selectedDashboard === 'enter-data'" class="dashboard-content">
          <div class="data-entry-header">
            <div>
              <h2>✏️ Manual Data Entry</h2>
              <p class="data-entry-subtitle">Enter ESG data by KPI and location</p>
            </div>
            <div class="data-entry-actions">
              <button class="data-entry-btn primary" (click)="saveDataEntry()">Save All Data</button>
              <button class="data-entry-btn secondary" (click)="validateData()">Validate Data</button>
            </div>
          </div>

          <!-- Data Entry Form -->
          <div class="data-entry-container">
            <div class="data-entry-sidebar">
              <div class="entry-section">
                <h3>📍 Location</h3>
                <select [(ngModel)]="selectedLocation" class="entry-select">
                  <option value="">Select Location</option>
                  <option value="headquarters">Headquarters</option>
                  <option value="factory-1">Factory 1</option>
                  <option value="factory-2">Factory 2</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
              
              <div class="entry-section">
                <h3>📊 KPI Category</h3>
                <select [(ngModel)]="selectedKPI" class="entry-select">
                  <option value="">Select KPI</option>
                  <option value="carbon">Carbon Emissions</option>
                  <option value="energy">Energy Consumption</option>
                  <option value="water">Water Usage</option>
                  <option value="waste">Waste Management</option>
                  <option value="diversity">Workforce Diversity</option>
                  <option value="safety">Health & Safety</option>
                </select>
              </div>

              <div class="entry-section">
                <h3>📅 Reporting Period</h3>
                <input type="month" [(ngModel)]="reportingPeriod" class="entry-input">
              </div>
            </div>

            <div class="data-entry-main">
              <div class="entry-form-card">
                <div class="form-header">
                  <h3>📝 Data Entry Form</h3>
                  <div class="form-status" [class.valid]="formValid" [class.invalid]="!formValid">
                    {{ formValid ? '✅ Valid' : '⚠️ Incomplete' }}
                  </div>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>Metric Value</label>
                    <input type="number" [(ngModel)]="metricValue" placeholder="Enter value" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Unit</label>
                    <select [(ngModel)]="selectedUnit" class="form-select">
                      <option value="">Select Unit</option>
                      <option value="tCO2e">tCO₂e</option>
                      <option value="kWh">kWh</option>
                      <option value="m3">m³</option>
                      <option value="tons">Tons</option>
                      <option value="percentage">%</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Data Source</label>
                    <select [(ngModel)]="dataSource" class="form-select">
                      <option value="">Select Source</option>
                      <option value="manual">Manual Entry</option>
                      <option value="iot">IoT Sensors</option>
                      <option value="meter">Utility Meters</option>
                      <option value="hr">HR System</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Confidence Level</label>
                    <select [(ngModel)]="confidenceLevel" class="form-select">
                      <option value="">Select Level</option>
                      <option value="high">High (90-100%)</option>
                      <option value="medium">Medium (70-89%)</option>
                      <option value="low">Low (50-69%)</option>
                    </select>
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>Notes/Comments</label>
                  <textarea [(ngModel)]="notes" placeholder="Add any notes or comments..." class="form-textarea"></textarea>
                </div>

                <div class="form-actions">
                  <button class="form-btn secondary" (click)="clearForm()">Clear Form</button>
                  <button class="form-btn primary" (click)="addDataEntry()" [disabled]="!formValid">Add Entry</button>
                </div>
              </div>

              <!-- Recent Entries -->
              <div class="recent-entries-card">
                <h3>📋 Recent Entries</h3>
                <div class="entries-list">
                  <div class="entry-item" *ngFor="let entry of recentEntries">
                    <div class="entry-info">
                      <div class="entry-location">{{ entry.location }}</div>
                      <div class="entry-kpi">{{ entry.kpi }}</div>
                      <div class="entry-value">{{ entry.value }} {{ entry.unit }}</div>
                    </div>
                    <div class="entry-meta">
                      <span class="entry-date">{{ entry.date }}</span>
                      <span class="entry-status" [class]="entry.status">{{ entry.status }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compliance Checklist Section -->
        <div *ngIf="selectedDashboard === 'compliance-checklist'" class="dashboard-content">
          <div class="compliance-header">
            <div>
              <h2>✅ Compliance Checklist</h2>
              <p class="compliance-subtitle">Track compliance with GRI, CSRD, Tadawul, SDGs, and other standards</p>
            </div>
            <div class="compliance-actions">
              <button class="compliance-btn primary">Export Checklist</button>
              <button class="compliance-btn secondary">Update Status</button>
            </div>
          </div>

          <!-- Compliance Standards Grid -->
          <div class="compliance-standards-grid">
            <div class="compliance-standard-card" *ngFor="let standard of complianceStandards">
              <div class="standard-header">
                <div class="standard-icon">{{ standard.icon }}</div>
                <div class="standard-info">
                  <h3 class="standard-name">{{ standard.name }}</h3>
                  <p class="standard-description">{{ standard.description }}</p>
                </div>
                <div class="standard-status" [class]="standard.status">
                  <span class="status-badge">{{ standard.status }}</span>
                </div>
              </div>
              <div class="standard-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="standard.progress"></div>
                </div>
                <span class="progress-text">{{ standard.progress }}% Complete</span>
              </div>
              <div class="standard-requirements">
                <h4>Requirements:</h4>
                <ul class="requirements-list">
                  <li *ngFor="let req of standard.requirements" [class.completed]="req.completed">
                    <span class="req-icon">{{ req.completed ? '✅' : '⭕' }}</span>
                    <span class="req-text">{{ req.text }}</span>
                    <span class="req-deadline">{{ req.deadline }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Deadlines Section -->
        <div *ngIf="selectedDashboard === 'upcoming-deadlines'" class="dashboard-content">
          <div class="deadlines-header">
            <div>
              <h2>📆 Upcoming Deadlines</h2>
              <p class="deadlines-subtitle">Reporting calendar and compliance deadlines</p>
            </div>
            <div class="deadlines-actions">
              <button class="deadlines-btn primary">Add Deadline</button>
              <button class="deadlines-btn secondary">Export Calendar</button>
            </div>
          </div>

          <!-- Calendar View -->
          <div class="deadlines-calendar">
            <div class="calendar-header">
              <h3>📅 Reporting Calendar</h3>
              <div class="calendar-controls">
                <button class="calendar-btn">← Previous</button>
                <span class="current-month">January 2025</span>
                <button class="calendar-btn">Next →</button>
              </div>
            </div>
            
            <div class="calendar-grid">
              <div class="calendar-day" *ngFor="let day of calendarDays" [class.has-deadline]="day.hasDeadline">
                <div class="day-number">{{ day.number }}</div>
                <div class="day-deadlines" *ngIf="day.deadlines">
                  <div class="deadline-item" *ngFor="let deadline of day.deadlines" [class]="deadline.priority">
                    <span class="deadline-time">{{ deadline.time }}</span>
                    <span class="deadline-title">{{ deadline.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Deadlines List -->
          <div class="upcoming-deadlines-list">
            <h3>⏰ Upcoming Deadlines</h3>
            <div class="deadlines-list">
              <div class="deadline-card" *ngFor="let deadline of upcomingDeadlines" [class]="deadline.priority">
                <div class="deadline-info">
                  <div class="deadline-date">
                    <span class="date-day">{{ deadline.day }}</span>
                    <span class="date-month">{{ deadline.month }}</span>
                  </div>
                  <div class="deadline-details">
                    <h4 class="deadline-title">{{ deadline.title }}</h4>
                    <p class="deadline-description">{{ deadline.description }}</p>
                    <div class="deadline-meta">
                      <span class="deadline-standard">{{ deadline.standard }}</span>
                      <span class="deadline-assignee">{{ deadline.assignee }}</span>
                    </div>
                  </div>
                </div>
                <div class="deadline-actions">
                  <span class="deadline-status" [class]="deadline.status">{{ deadline.status }}</span>
                  <button class="deadline-btn">View Details</button>
                  <button class="deadline-btn">Mark Complete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Supporting Evidence Section -->
        <div *ngIf="selectedDashboard === 'upload-evidence'" class="dashboard-content">
          <div class="evidence-header">
            <div>
              <h2>📂 Upload Supporting Evidence</h2>
              <p class="evidence-subtitle">Attach policies, certificates, documents for audits</p>
            </div>
            <div class="evidence-actions">
              <button class="evidence-btn primary">Upload Files</button>
              <button class="evidence-btn secondary">Create Folder</button>
            </div>
          </div>

          <!-- Evidence Categories -->
          <div class="evidence-categories">
            <div class="category-card" *ngFor="let category of evidenceCategories">
              <div class="category-header">
                <div class="category-icon">{{ category.icon }}</div>
                <div class="category-info">
                  <h3 class="category-name">{{ category.name }}</h3>
                  <p class="category-description">{{ category.description }}</p>
                </div>
                <div class="category-stats">
                  <span class="file-count">{{ category.fileCount }} files</span>
                  <span class="total-size">{{ category.totalSize }}</span>
                </div>
              </div>
              <div class="category-files">
                <div class="file-item" *ngFor="let file of category.files">
                  <div class="file-icon">{{ file.icon }}</div>
                  <div class="file-info">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ file.size }}</span>
                    <span class="file-date">{{ file.uploadDate }}</span>
                  </div>
                  <div class="file-actions">
                    <button class="file-btn">View</button>
                    <button class="file-btn">Download</button>
                    <button class="file-btn delete">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload File Section -->
        <div *ngIf="selectedDashboard === 'upload-file'" class="dashboard-content">
          <div class="upload-header">
            <div>
              <h2>📤 File Upload & Data Sync</h2>
              <p class="upload-subtitle">Upload Excel/CSV files and monitor IoT data sync</p>
            </div>
            <div class="upload-actions">
              <button class="upload-btn primary" (click)="downloadUploadTemplate()">Download Template</button>
              <button class="upload-btn secondary" (click)="syncIoTData()">Sync IoT Data</button>
            </div>
          </div>

          <!-- Upload Zones -->
          <div class="upload-zones-container">
            <!-- File Upload Zone -->
            <div class="upload-zone-card">
              <div class="upload-zone-header">
                <h3>📄 File Upload</h3>
                <div class="upload-status" [class.active]="uploadInProgress">
                  {{ uploadInProgress ? '🔄 Uploading...' : '📤 Ready to Upload' }}
                </div>
              </div>
              
              <div class="upload-drop-zone" 
                   (dragover)="onDragOver($event)" 
                   (dragleave)="onDragLeave($event)"
                   (drop)="onFileDrop($event)"
                   [class.dragover]="isDragOver">
                <div class="upload-icon">📁</div>
                <h4>Drag & Drop Files Here</h4>
                <p>or click to browse</p>
                <input type="file" #fileInput (change)="onFileSelect($event)" multiple accept=".xlsx,.xls,.csv" style="display: none;">
                <button class="upload-browse-btn" (click)="fileInput.click()">Browse Files</button>
              </div>

              <div class="upload-progress" *ngIf="uploadInProgress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="uploadProgress"></div>
                </div>
                <span class="progress-text">{{ uploadProgress }}% Complete</span>
              </div>

              <div class="uploaded-files" *ngIf="uploadedFiles.length > 0">
                <h4>📋 Uploaded Files</h4>
                <div class="file-list">
                  <div class="file-item" *ngFor="let file of uploadedFiles">
                    <div class="file-info">
                      <span class="file-icon">📄</span>
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ file.size }}</span>
                    </div>
                    <div class="file-actions">
                      <span class="file-status" [class]="file.status">{{ file.status }}</span>
                      <button class="file-btn" (click)="processFile(file)">Process</button>
                      <button class="file-btn delete" (click)="removeFile(file)">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- IoT Data Sync Zone -->
            <div class="iot-sync-card">
              <div class="iot-sync-header">
                <h3>🔗 IoT Data Sync Status</h3>
                <button class="sync-btn" (click)="refreshSyncStatus()">🔄 Refresh</button>
              </div>
              
              <div class="iot-devices-grid">
                <div class="iot-device" *ngFor="let device of iotDevices">
                  <div class="device-icon">{{ device.icon }}</div>
                  <div class="device-info">
                    <div class="device-name">{{ device.name }}</div>
                    <div class="device-location">{{ device.location }}</div>
                  </div>
                  <div class="device-status">
                    <div class="status-indicator" [class]="device.status"></div>
                    <span class="status-text">{{ device.status }}</span>
                  </div>
                  <div class="device-data">
                    <div class="data-value">{{ device.lastValue }}</div>
                    <div class="data-time">{{ device.lastUpdate }}</div>
                  </div>
                </div>
              </div>

              <div class="sync-summary">
                <div class="summary-item">
                  <span class="summary-label">Connected Devices:</span>
                  <span class="summary-value">{{ connectedDevices }}/{{ totalDevices }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Last Sync:</span>
                  <span class="summary-value">{{ lastSyncTime }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Data Points Today:</span>
                  <span class="summary-value">{{ dataPointsToday }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Validation Results -->
          <div class="validation-results" *ngIf="validationResults.length > 0">
            <h3>✅ Validation Results</h3>
            <div class="validation-grid">
              <div class="validation-item" *ngFor="let result of validationResults">
                <div class="validation-header">
                  <span class="validation-file">{{ result.fileName }}</span>
                  <span class="validation-status" [class]="result.status">{{ result.status }}</span>
                </div>
                <div class="validation-details">
                  <div class="detail-item">
                    <span class="detail-label">Records:</span>
                    <span class="detail-value">{{ result.records }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Valid:</span>
                    <span class="detail-value valid">{{ result.valid }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Errors:</span>
                    <span class="detail-value error">{{ result.errors }}</span>
                  </div>
                </div>
                <div class="validation-actions">
                  <button class="validation-btn" (click)="viewErrors(result)">View Errors</button>
                  <button class="validation-btn primary" (click)="importData(result)">Import Data</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Validation Section -->
        <div *ngIf="selectedDashboard === 'data-validation'" class="dashboard-content">
          <div class="validation-header">
            <div>
              <h2>✅ Data Quality & Validation</h2>
              <p class="validation-subtitle">Monitor data quality and identify issues</p>
            </div>
            <div class="validation-actions">
              <button class="validation-btn primary" (click)="runFullValidation()">Run Full Validation</button>
              <button class="validation-btn secondary" (click)="exportValidationReport()">Export Report</button>
            </div>
          </div>

          <!-- Data Quality Overview -->
          <div class="quality-overview-grid">
            <div class="quality-card total">
              <div class="quality-icon">📊</div>
              <div class="quality-value">{{ totalDataPoints }}</div>
              <div class="quality-label">Total Data Points</div>
            </div>
            <div class="quality-card valid">
              <div class="quality-icon">✅</div>
              <div class="quality-value">{{ validDataPoints }}</div>
              <div class="quality-label">Valid Data</div>
            </div>
            <div class="quality-card invalid">
              <div class="quality-icon">❌</div>
              <div class="quality-value">{{ invalidDataPoints }}</div>
              <div class="quality-label">Invalid Data</div>
            </div>
            <div class="quality-card missing">
              <div class="quality-icon">⚠️</div>
              <div class="quality-value">{{ missingDataPoints }}</div>
              <div class="quality-label">Missing Data</div>
            </div>
          </div>

          <!-- Validation Dashboard -->
          <div class="validation-dashboard">
            <div class="validation-main">
              <!-- Data Quality Chart -->
              <div class="quality-chart-card">
                <h3>📈 Data Quality Trends</h3>
                <div class="chart-container">
                  <svg width="100%" height="200" viewBox="0 0 400 200">
                    <!-- Quality trend line -->
                    <polyline points="50,150 100,120 150,100 200,80 250,90 300,70 350,60"
                              fill="none" stroke="#10b981" stroke-width="3" />
                    <circle cx="50" cy="150" r="4" fill="#10b981" />
                    <circle cx="100" cy="120" r="4" fill="#10b981" />
                    <circle cx="150" cy="100" r="4" fill="#10b981" />
                    <circle cx="200" cy="80" r="4" fill="#10b981" />
                    <circle cx="250" cy="90" r="4" fill="#10b981" />
                    <circle cx="300" cy="70" r="4" fill="#10b981" />
                    <circle cx="350" cy="60" r="4" fill="#10b981" />
                    
                    <!-- Grid lines -->
                    <line x1="50" y1="40" x2="350" y2="40" stroke="#e5e7eb" stroke-width="1" />
                    <line x1="50" y1="80" x2="350" y2="80" stroke="#e5e7eb" stroke-width="1" />
                    <line x1="50" y1="120" x2="350" y2="120" stroke="#e5e7eb" stroke-width="1" />
                    <line x1="50" y1="160" x2="350" y2="160" stroke="#e5e7eb" stroke-width="1" />
                    
                    <!-- Labels -->
                    <text x="50" y="190" font-size="10" fill="#666">Jan</text>
                    <text x="100" y="190" font-size="10" fill="#666">Feb</text>
                    <text x="150" y="190" font-size="10" fill="#666">Mar</text>
                    <text x="200" y="190" font-size="10" fill="#666">Apr</text>
                    <text x="250" y="190" font-size="10" fill="#666">May</text>
                    <text x="300" y="190" font-size="10" fill="#666">Jun</text>
                    <text x="350" y="190" font-size="10" fill="#666">Jul</text>
                  </svg>
                </div>
                <div class="chart-legend">Data Quality Score (%)</div>
              </div>

              <!-- Validation Issues -->
              <div class="issues-card">
                <h3>🚨 Critical Issues</h3>
                <div class="issues-list">
                  <div class="issue-item critical" *ngFor="let issue of criticalIssues">
                    <div class="issue-header">
                      <span class="issue-type">{{ issue.type }}</span>
                      <span class="issue-priority">Critical</span>
                    </div>
                    <div class="issue-description">{{ issue.description }}</div>
                    <div class="issue-meta">
                      <span class="issue-location">{{ issue.location }}</span>
                      <span class="issue-date">{{ issue.date }}</span>
                    </div>
                    <div class="issue-actions">
                      <button class="issue-btn" (click)="fixIssue(issue)">Fix Issue</button>
                      <button class="issue-btn secondary" (click)="ignoreIssue(issue)">Ignore</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="validation-sidebar">
              <!-- Data Completeness -->
              <div class="completeness-card">
                <h3>📋 Data Completeness</h3>
                <div class="completeness-item" *ngFor="let item of completenessData">
                  <div class="completeness-header">
                    <span class="completeness-kpi">{{ item.kpi }}</span>
                    <span class="completeness-percentage">{{ item.percentage }}%</span>
                  </div>
                  <div class="completeness-bar">
                    <div class="completeness-fill" [style.width.%]="item.percentage"></div>
                  </div>
                  <div class="completeness-details">
                    <span class="completeness-missing">{{ item.missing }} missing</span>
                    <span class="completeness-total">{{ item.total }} total</span>
                  </div>
                </div>
              </div>

              <!-- Outlier Detection -->
              <div class="outliers-card">
                <h3>🔍 Outlier Detection</h3>
                <div class="outlier-item" *ngFor="let outlier of outliers">
                  <div class="outlier-info">
                    <div class="outlier-value">{{ outlier.value }}</div>
                    <div class="outlier-kpi">{{ outlier.kpi }}</div>
                    <div class="outlier-location">{{ outlier.location }}</div>
                  </div>
                  <div class="outlier-severity" [class]="outlier.severity">
                    {{ outlier.severity }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Validation Rules -->
          <div class="validation-rules-section">
            <h3>⚙️ Validation Rules</h3>
            <div class="rules-grid">
              <div class="rule-card" *ngFor="let rule of validationRules">
                <div class="rule-header">
                  <span class="rule-name">{{ rule.name }}</span>
                  <div class="rule-toggle">
                    <input type="checkbox" [checked]="rule.active" (change)="toggleRule(rule)">
                    <span class="toggle-slider"></span>
                  </div>
                </div>
                <div class="rule-description">{{ rule.description }}</div>
                <div class="rule-stats">
                  <span class="rule-violations">{{ rule.violations }} violations</span>
                  <span class="rule-last-run">{{ rule.lastRun }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Change Log Section -->
        <div *ngIf="selectedDashboard === 'change-log'" class="dashboard-content">
          <div class="changelog-header">
            <div>
              <h2>📋 Change Log & Version History</h2>
              <p class="changelog-subtitle">Track all data changes, user activities, and version history</p>
            </div>
            <div class="changelog-actions">
              <button class="changelog-btn primary" (click)="exportChangeLog()">Export Log</button>
              <button class="changelog-btn secondary" (click)="clearOldLogs()">Clear Old Logs</button>
            </div>
          </div>

          <!-- Change Log Filters -->
          <div class="changelog-filters">
            <div class="filter-group">
              <label>Filter by User:</label>
              <select [(ngModel)]="selectedUser" class="filter-select">
                <option value="">All Users</option>
                <option value="admin">Admin</option>
                <option value="esg-specialist">ESG Specialist</option>
                <option value="data-analyst">Data Analyst</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Filter by Action:</label>
              <select [(ngModel)]="selectedAction" class="filter-select">
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="validate">Validate</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Date Range:</label>
              <input type="date" [(ngModel)]="startDate" class="filter-input">
              <span>to</span>
              <input type="date" [(ngModel)]="endDate" class="filter-input">
            </div>
            <button class="filter-btn" (click)="applyFilters()">Apply Filters</button>
          </div>

          <!-- Change Log Timeline -->
          <div class="changelog-timeline">
            <div class="timeline-header">
              <h3>🕒 Activity Timeline</h3>
              <div class="timeline-stats">
                <span class="stat-item">Total Changes: {{ totalChanges }}</span>
                <span class="stat-item">Today: {{ todayChanges }}</span>
                <span class="stat-item">This Week: {{ weekChanges }}</span>
              </div>
            </div>

            <div class="timeline-container">
              <div class="timeline-item" *ngFor="let change of changeLogs">
                <div class="timeline-marker" [class]="change.action">
                  <div class="marker-icon">{{ change.icon }}</div>
                </div>
                <div class="timeline-content">
                  <div class="change-header">
                    <div class="change-info">
                      <span class="change-action" [class]="change.action">{{ change.action }}</span>
                      <span class="change-user">{{ change.user }}</span>
                      <span class="change-time">{{ change.timestamp }}</span>
                    </div>
                    <div class="change-actions">
                      <button class="change-btn" (click)="viewChangeDetails(change)">View Details</button>
                      <button class="change-btn secondary" (click)="revertChange(change)">Revert</button>
                    </div>
                  </div>
                  <div class="change-description">{{ change.description }}</div>
                  <div class="change-details">
                    <span class="detail-item">
                      <strong>Field:</strong> {{ change.field }}
                    </span>
                    <span class="detail-item">
                      <strong>Old Value:</strong> {{ change.oldValue }}
                    </span>
                    <span class="detail-item">
                      <strong>New Value:</strong> {{ change.newValue }}
                    </span>
                    <span class="detail-item">
                      <strong>Location:</strong> {{ change.location }}
                    </span>
                  </div>
                  <div class="change-metadata">
                    <span class="metadata-item">IP: {{ change.ipAddress }}</span>
                    <span class="metadata-item">Session: {{ change.sessionId }}</span>
                    <span class="metadata-item">Version: {{ change.version }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Version History -->
          <div class="version-history">
            <h3>📚 Version History</h3>
            <div class="version-grid">
              <div class="version-card" *ngFor="let version of versionHistory">
                <div class="version-header">
                  <div class="version-info">
                    <span class="version-number">v{{ version.number }}</span>
                    <span class="version-date">{{ version.date }}</span>
                  </div>
                  <div class="version-status" [class]="version.status">{{ version.status }}</div>
                </div>
                <div class="version-description">{{ version.description }}</div>
                <div class="version-changes">
                  <div class="change-summary">
                    <span class="summary-item">Added: {{ version.added }}</span>
                    <span class="summary-item">Modified: {{ version.modified }}</span>
                    <span class="summary-item">Removed: {{ version.removed }}</span>
                  </div>
                </div>
                <div class="version-actions">
                  <button class="version-btn" (click)="compareVersion(version)">Compare</button>
                  <button class="version-btn secondary" (click)="restoreVersion(version)">Restore</button>
                  <button class="version-btn" (click)="downloadVersion(version)">Download</button>
                </div>
              </div>
            </div>
          </div>

          <!-- User Activity Summary -->
          <div class="activity-summary">
            <h3>👥 User Activity Summary</h3>
            <div class="activity-grid">
              <div class="activity-card" *ngFor="let user of userActivity">
                <div class="user-info">
                  <div class="user-avatar">{{ user.avatar }}</div>
                  <div class="user-details">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-role">{{ user.role }}</div>
                  </div>
                </div>
                <div class="activity-stats">
                  <div class="stat-row">
                    <span class="stat-label">Changes Made:</span>
                    <span class="stat-value">{{ user.changes }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Last Active:</span>
                    <span class="stat-value">{{ user.lastActive }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Session Time:</span>
                    <span class="stat-value">{{ user.sessionTime }}</span>
                  </div>
                </div>
                <div class="activity-chart">
                  <svg width="100%" height="60" viewBox="0 0 200 60">
                    <polyline points="10,50 40,30 70,40 100,20 130,35 160,15 190,25"
                              fill="none" stroke="#2563eb" stroke-width="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Generate Report Section -->
        <div *ngIf="selectedDashboard === 'generate-report'" class="dashboard-content">
          <div class="report-header">
            <div>
              <h2>📄 Report Generator</h2>
              <p class="report-subtitle">Create comprehensive ESG reports with multiple framework templates</p>
            </div>
            <div class="report-actions">
              <button class="report-btn primary" (click)="generateReport()">Generate Report</button>
              <button class="report-btn secondary" (click)="saveReportTemplate()">Save Template</button>
            </div>
          </div>

          <!-- Report Builder -->
          <div class="report-builder">
            <div class="builder-sidebar">
              <h3>📋 Report Configuration</h3>
              
              <!-- Framework Selection -->
              <div class="config-section">
                <h4>🎯 Framework</h4>
                <div class="framework-options">
                  <div class="framework-option" 
                       *ngFor="let framework of frameworks"
                       [class.selected]="selectedFramework === framework.id"
                       (click)="selectFramework(framework.id)">
                    <div class="framework-icon">{{ framework.icon }}</div>
                    <div class="framework-info">
                      <div class="framework-name">{{ framework.name }}</div>
                      <div class="framework-desc">{{ framework.description }}</div>
                    </div>
                    <div class="framework-status" [class]="framework.status">{{ framework.status }}</div>
                  </div>
                </div>
              </div>

              <!-- Report Type -->
              <div class="config-section">
                <h4>📊 Report Type</h4>
                <select [(ngModel)]="selectedReportType" class="config-select">
                  <option value="">Select Report Type</option>
                  <option value="annual">Annual ESG Report</option>
                  <option value="quarterly">Quarterly Update</option>
                  <option value="sustainability">Sustainability Report</option>
                  <option value="compliance">Compliance Report</option>
                  <option value="custom">Custom Report</option>
                </select>
              </div>

              <!-- Date Range -->
              <div class="config-section">
                <h4>📅 Reporting Period</h4>
                <div class="date-range">
                  <div class="date-input">
                    <label>Start Date:</label>
                    <input type="date" [(ngModel)]="reportStartDate" class="config-input">
                  </div>
                  <div class="date-input">
                    <label>End Date:</label>
                    <input type="date" [(ngModel)]="reportEndDate" class="config-input">
                  </div>
                </div>
              </div>

              <!-- Scope Selection -->
              <div class="config-section">
                <h4>🌍 Scope</h4>
                <div class="scope-options">
                  <label class="scope-option">
                    <input type="checkbox" [(ngModel)]="includeEnvironmental" class="scope-checkbox">
                    <span class="scope-label">Environmental</span>
                  </label>
                  <label class="scope-option">
                    <input type="checkbox" [(ngModel)]="includeSocial" class="scope-checkbox">
                    <span class="scope-label">Social</span>
                  </label>
                  <label class="scope-option">
                    <input type="checkbox" [(ngModel)]="includeGovernance" class="scope-checkbox">
                    <span class="scope-label">Governance</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="builder-main">
              <!-- Report Preview -->
              <div class="report-preview">
                <div class="preview-header">
                  <h3>👁️ Report Preview</h3>
                  <div class="preview-controls">
                    <button class="preview-btn" (click)="refreshPreview()">🔄 Refresh</button>
                    <button class="preview-btn" (click)="fullscreenPreview()">⛶ Fullscreen</button>
                  </div>
                </div>
                
                <div class="preview-content">
                  <div class="report-cover">
                    <div class="cover-header">
                      <h1 class="report-title">{{ reportTitle }}</h1>
                      <p class="report-subtitle">{{ reportSubtitle }}</p>
                      <div class="report-meta">
                        <span class="meta-item">Period: {{ reportStartDate }} - {{ reportEndDate }}</span>
                        <span class="meta-item">Framework: {{ selectedFrameworkName }}</span>
                        <span class="meta-item">Generated: {{ currentDate }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="report-sections">
                    <div class="section-item" *ngFor="let section of reportSections">
                      <div class="section-header">
                        <h4 class="section-title">{{ section.title }}</h4>
                        <span class="section-status" [class]="section.status">{{ section.status }}</span>
                      </div>
                      <div class="section-content">
                        <div class="content-summary">
                          <span class="summary-item">Pages: {{ section.pages }}</span>
                          <span class="summary-item">Charts: {{ section.charts }}</span>
                          <span class="summary-item">Tables: {{ section.tables }}</span>
                        </div>
                        <div class="section-actions">
                          <button class="section-btn" (click)="editSection(section)">Edit</button>
                          <button class="section-btn secondary" (click)="previewSection(section)">Preview</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Report Statistics -->
              <div class="report-stats">
                <h3>📈 Report Statistics</h3>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-icon">📄</div>
                    <div class="stat-value">{{ totalPages }}</div>
                    <div class="stat-label">Total Pages</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-value">{{ totalCharts }}</div>
                    <div class="stat-label">Charts & Graphs</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon">📋</div>
                    <div class="stat-value">{{ totalTables }}</div>
                    <div class="stat-label">Data Tables</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon">📝</div>
                    <div class="stat-value">{{ totalMetrics }}</div>
                    <div class="stat-label">ESG Metrics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Options -->
          <div class="export-options">
            <h3>💾 Export Options</h3>
            <div class="export-grid">
              <div class="export-option" *ngFor="let format of exportFormats">
                <div class="export-icon">{{ format.icon }}</div>
                <div class="export-info">
                  <div class="export-name">{{ format.name }}</div>
                  <div class="export-desc">{{ format.description }}</div>
                </div>
                <div class="export-actions">
                  <button class="export-btn" (click)="exportReport(format.type)">Export</button>
                  <button class="export-btn secondary" (click)="previewFormat(format.type)">Preview</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Report Templates -->
          <div class="report-templates">
            <h3>📋 Saved Templates</h3>
            <div class="templates-grid">
              <div class="template-card" *ngFor="let template of savedTemplates">
                <div class="template-header">
                  <div class="template-info">
                    <div class="template-name">{{ template.name }}</div>
                    <div class="template-framework">{{ template.framework }}</div>
                  </div>
                  <div class="template-actions">
                    <button class="template-btn" (click)="loadTemplate(template)">Load</button>
                    <button class="template-btn secondary" (click)="editTemplate(template)">Edit</button>
                    <button class="template-btn delete" (click)="deleteTemplate(template)">Delete</button>
                  </div>
                </div>
                <div class="template-meta">
                  <span class="meta-item">Created: {{ template.created }}</span>
                  <span class="meta-item">Last Used: {{ template.lastUsed }}</span>
                  <span class="meta-item">Used: {{ template.usageCount }} times</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Reports Section -->
        <div *ngIf="selectedDashboard === 'past-reports'" class="dashboard-content">
          <div class="past-reports-header">
            <div>
              <h2>📚 Historical Reports Library</h2>
              <p class="past-reports-subtitle">Access and manage all previously generated ESG reports</p>
            </div>
            <div class="past-reports-actions">
              <button class="past-reports-btn primary" (click)="bulkDownload()">Bulk Download</button>
              <button class="past-reports-btn secondary" (click)="archiveReports()">Archive Old</button>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="reports-search">
            <div class="search-bar">
              <input type="text" [(ngModel)]="searchQuery" placeholder="Search reports by title, framework, or content..." class="search-input">
              <button class="search-btn" (click)="searchReports()">🔍 Search</button>
            </div>
            <div class="search-filters">
              <select [(ngModel)]="filterFramework" class="filter-select">
                <option value="">All Frameworks</option>
                <option value="gri">GRI</option>
                <option value="tcfd">TCFD</option>
                <option value="sasb">SASB</option>
                <option value="cdp">CDP</option>
                <option value="tadawul">Tadawul</option>
              </select>
              <select [(ngModel)]="filterYear" class="filter-select">
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <select [(ngModel)]="filterType" class="filter-select">
                <option value="">All Types</option>
                <option value="annual">Annual</option>
                <option value="quarterly">Quarterly</option>
                <option value="sustainability">Sustainability</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
          </div>

          <!-- Reports Timeline -->
          <div class="reports-timeline">
            <div class="timeline-header">
              <h3>📅 Reports Timeline</h3>
              <div class="timeline-view">
                <button class="view-btn" [class.active]="viewMode === 'grid'" (click)="setViewMode('grid')">Grid</button>
                <button class="view-btn" [class.active]="viewMode === 'list'" (click)="setViewMode('list')">List</button>
                <button class="view-btn" [class.active]="viewMode === 'timeline'" (click)="setViewMode('timeline')">Timeline</button>
              </div>
            </div>

            <!-- Grid View -->
            <div class="reports-grid" *ngIf="viewMode === 'grid'">
              <div class="report-card" *ngFor="let report of pastReports">
                <div class="report-cover">
                  <div class="cover-icon">{{ report.icon }}</div>
                  <div class="cover-framework">{{ report.framework }}</div>
                </div>
                <div class="report-info">
                  <h4 class="report-title">{{ report.title }}</h4>
                  <p class="report-description">{{ report.description }}</p>
                  <div class="report-meta">
                    <span class="meta-item">📅 {{ report.date }}</span>
                    <span class="meta-item">📄 {{ report.pages }} pages</span>
                    <span class="meta-item">📊 {{ report.charts }} charts</span>
                  </div>
                  <div class="report-status" [class]="report.status">{{ report.status }}</div>
                </div>
                <div class="report-actions">
                  <button class="action-btn primary" (click)="viewReport(report)">View</button>
                  <button class="action-btn secondary" (click)="downloadReport(report)">Download</button>
                  <button class="action-btn" (click)="shareReport(report)">Share</button>
                  <button class="action-btn delete" (click)="deleteReport(report)">Delete</button>
                </div>
              </div>
            </div>

            <!-- List View -->
            <div class="reports-list" *ngIf="viewMode === 'list'">
              <div class="list-header">
                <div class="header-item">Report</div>
                <div class="header-item">Framework</div>
                <div class="header-item">Date</div>
                <div class="header-item">Size</div>
                <div class="header-item">Status</div>
                <div class="header-item">Actions</div>
              </div>
              <div class="list-item" *ngFor="let report of pastReports">
                <div class="item-info">
                  <div class="item-icon">{{ report.icon }}</div>
                  <div class="item-details">
                    <div class="item-title">{{ report.title }}</div>
                    <div class="item-desc">{{ report.description }}</div>
                  </div>
                </div>
                <div class="item-framework">{{ report.framework }}</div>
                <div class="item-date">{{ report.date }}</div>
                <div class="item-size">{{ report.size }}</div>
                <div class="item-status" [class]="report.status">{{ report.status }}</div>
                <div class="item-actions">
                  <button class="list-btn" (click)="viewReport(report)">👁️</button>
                  <button class="list-btn" (click)="downloadReport(report)">📥</button>
                  <button class="list-btn" (click)="shareReport(report)">📤</button>
                  <button class="list-btn delete" (click)="deleteReport(report)">🗑️</button>
                </div>
              </div>
            </div>

            <!-- Timeline View -->
            <div class="reports-timeline-view" *ngIf="viewMode === 'timeline'">
              <div class="timeline-year" *ngFor="let year of timelineYears">
                <div class="year-header">
                  <h4>{{ year.year }}</h4>
                  <span class="year-count">{{ year.count }} reports</span>
                </div>
                <div class="year-reports">
                  <div class="timeline-report" *ngFor="let report of year.reports">
                    <div class="timeline-marker" [class]="report.framework.toLowerCase()"></div>
                    <div class="timeline-content">
                      <div class="timeline-title">{{ report.title }}</div>
                      <div class="timeline-meta">
                        <span class="timeline-framework">{{ report.framework }}</span>
                        <span class="timeline-date">{{ report.date }}</span>
                        <span class="timeline-size">{{ report.size }}</span>
                      </div>
                      <div class="timeline-actions">
                        <button class="timeline-btn" (click)="viewReport(report)">View</button>
                        <button class="timeline-btn" (click)="downloadReport(report)">Download</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Report Analytics -->
          <div class="reports-analytics">
            <h3>📊 Reports Analytics</h3>
            <div class="analytics-grid">
              <div class="analytics-card">
                <h4>📈 Generation Trends</h4>
                <div class="trend-chart">
                  <svg width="100%" height="120" viewBox="0 0 300 120">
                    <polyline points="20,100 60,80 100,60 140,70 180,40 220,50 260,30 280,20"
                              fill="none" stroke="#2563eb" stroke-width="3" />
                    <circle cx="20" cy="100" r="3" fill="#2563eb" />
                    <circle cx="60" cy="80" r="3" fill="#2563eb" />
                    <circle cx="100" cy="60" r="3" fill="#2563eb" />
                    <circle cx="140" cy="70" r="3" fill="#2563eb" />
                    <circle cx="180" cy="40" r="3" fill="#2563eb" />
                    <circle cx="220" cy="50" r="3" fill="#2563eb" />
                    <circle cx="260" cy="30" r="3" fill="#2563eb" />
                    <circle cx="280" cy="20" r="3" fill="#2563eb" />
                  </svg>
                </div>
                <div class="trend-labels">
                  <span>2022</span>
                  <span>2023</span>
                  <span>2024</span>
                  <span>2025</span>
                </div>
              </div>

              <div class="analytics-card">
                <h4>🎯 Framework Distribution</h4>
                <div class="framework-distribution">
                  <div class="framework-item" *ngFor="let framework of frameworkStats">
                    <div class="framework-bar">
                      <div class="bar-fill" [style.width.%]="framework.percentage"></div>
                    </div>
                    <div class="framework-info">
                      <span class="framework-name">{{ framework.name }}</span>
                      <span class="framework-count">{{ framework.count }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="analytics-card">
                <h4>📊 Report Statistics</h4>
                <div class="stats-list">
                  <div class="stat-item">
                    <span class="stat-label">Total Reports:</span>
                    <span class="stat-value">{{ totalReports }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Total Pages:</span>
                    <span class="stat-value">{{ totalPagesGenerated }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Average Size:</span>
                    <span class="stat-value">{{ averageReportSize }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Storage Used:</span>
                    <span class="stat-value">{{ storageUsed }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Templates Section -->
        <div *ngIf="selectedDashboard === 'report-templates'" class="dashboard-content">
          <div class="templates-header">
            <div>
              <h2>📋 Report Templates Library</h2>
              <p class="templates-subtitle">Browse and manage pre-built templates for different ESG frameworks</p>
            </div>
            <div class="templates-actions">
              <button class="templates-btn primary" (click)="createTemplate()">Create Template</button>
              <button class="templates-btn secondary" (click)="importTemplate()">Import Template</button>
            </div>
          </div>

          <!-- Template Categories -->
          <div class="template-categories">
            <div class="category-tabs">
              <button class="category-tab" 
                      *ngFor="let category of templateCategories"
                      [class.active]="selectedCategory === category.id"
                      (click)="selectCategory(category.id)">
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </button>
            </div>
          </div>

          <!-- Template Gallery -->
          <div class="template-gallery">
            <div class="gallery-header">
              <h3>🎨 Template Gallery</h3>
              <div class="gallery-controls">
                <div class="sort-controls">
                  <label>Sort by:</label>
                  <select [(ngModel)]="sortBy" class="sort-select">
                    <option value="name">Name</option>
                    <option value="popularity">Popularity</option>
                    <option value="date">Date Created</option>
                    <option value="framework">Framework</option>
                  </select>
                </div>
                <div class="view-controls">
                  <button class="view-btn" [class.active]="galleryView === 'grid'" (click)="setGalleryView('grid')">Grid</button>
                  <button class="view-btn" [class.active]="galleryView === 'list'" (click)="setGalleryView('list')">List</button>
                </div>
              </div>
            </div>

            <!-- Grid View -->
            <div class="templates-grid" *ngIf="galleryView === 'grid'">
              <div class="template-item" *ngFor="let template of filteredTemplates">
                <div class="template-preview">
                  <div class="preview-header">
                    <div class="preview-framework">{{ template.framework }}</div>
                    <div class="preview-actions">
                      <button class="preview-btn" (click)="previewTemplate(template)">👁️</button>
                      <button class="preview-btn" (click)="favoriteTemplate(template)">⭐</button>
                    </div>
                  </div>
                  <div class="preview-content">
                    <div class="preview-pages">
                      <div class="page-preview" *ngFor="let page of template.previewPages">
                        <div class="page-content">{{ page.content }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="preview-footer">
                    <span class="preview-pages-count">{{ template.pages }} pages</span>
                    <span class="preview-rating">⭐ {{ template.rating }}</span>
                  </div>
                </div>
                <div class="template-info">
                  <h4 class="template-name">{{ template.name }}</h4>
                  <p class="template-description">{{ template.description }}</p>
                  <div class="template-tags">
                    <span class="tag" *ngFor="let tag of template.tags">{{ tag }}</span>
                  </div>
                  <div class="template-meta">
                    <span class="meta-item">👤 {{ template.author }}</span>
                    <span class="meta-item">📅 {{ template.created }}</span>
                    <span class="meta-item">📊 {{ template.downloads }} downloads</span>
                  </div>
                </div>
                <div class="template-actions">
                  <button class="template-action-btn primary" (click)="useTemplate(template)">Use Template</button>
                  <button class="template-action-btn secondary" (click)="customizeTemplate(template)">Customize</button>
                  <button class="template-action-btn" (click)="downloadTemplate(template)">Download</button>
                </div>
              </div>
            </div>

            <!-- List View -->
            <div class="templates-list" *ngIf="galleryView === 'list'">
              <div class="list-header">
                <div class="header-item">Template</div>
                <div class="header-item">Framework</div>
                <div class="header-item">Pages</div>
                <div class="header-item">Rating</div>
                <div class="header-item">Downloads</div>
                <div class="header-item">Actions</div>
              </div>
              <div class="list-item" *ngFor="let template of filteredTemplates">
                <div class="item-template">
                  <div class="item-icon">{{ template.icon }}</div>
                  <div class="item-details">
                    <div class="item-name">{{ template.name }}</div>
                    <div class="item-desc">{{ template.description }}</div>
                    <div class="item-tags">
                      <span class="tag" *ngFor="let tag of template.tags">{{ tag }}</span>
                    </div>
                  </div>
                </div>
                <div class="item-framework">{{ template.framework }}</div>
                <div class="item-pages">{{ template.pages }}</div>
                <div class="item-rating">⭐ {{ template.rating }}</div>
                <div class="item-downloads">{{ template.downloads }}</div>
                <div class="item-actions">
                  <button class="list-btn" (click)="useTemplate(template)">Use</button>
                  <button class="list-btn" (click)="previewTemplate(template)">Preview</button>
                  <button class="list-btn" (click)="downloadTemplate(template)">Download</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Template Builder -->
          <div class="template-builder" *ngIf="showBuilder">
            <h3>🔧 Template Builder</h3>
            <div class="builder-container">
              <div class="builder-sidebar">
                <h4>📋 Components</h4>
                <div class="component-library">
                  <div class="component-category">
                    <h5>📊 Charts & Graphs</h5>
                    <div class="component-item" *ngFor="let component of chartComponents">
                      <div class="component-icon">{{ component.icon }}</div>
                      <div class="component-info">
                        <div class="component-name">{{ component.name }}</div>
                        <div class="component-desc">{{ component.description }}</div>
                      </div>
                      <button class="add-component-btn" (click)="addComponent(component)">+</button>
                    </div>
                  </div>
                  <div class="component-category">
                    <h5>📋 Data Tables</h5>
                    <div class="component-item" *ngFor="let component of tableComponents">
                      <div class="component-icon">{{ component.icon }}</div>
                      <div class="component-info">
                        <div class="component-name">{{ component.name }}</div>
                        <div class="component-desc">{{ component.description }}</div>
                      </div>
                      <button class="add-component-btn" (click)="addComponent(component)">+</button>
                    </div>
                  </div>
                  <div class="component-category">
                    <h5>📝 Text Elements</h5>
                    <div class="component-item" *ngFor="let component of textComponents">
                      <div class="component-icon">{{ component.icon }}</div>
                      <div class="component-info">
                        <div class="component-name">{{ component.name }}</div>
                        <div class="component-desc">{{ component.description }}</div>
                      </div>
                      <button class="add-component-btn" (click)="addComponent(component)">+</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="builder-canvas">
                <div class="canvas-header">
                  <h4>🎨 Design Canvas</h4>
                  <div class="canvas-controls">
                    <button class="canvas-btn" (click)="undoAction()">↶ Undo</button>
                    <button class="canvas-btn" (click)="redoAction()">↷ Redo</button>
                    <button class="canvas-btn" (click)="saveBuilderTemplate()">💾 Save</button>
                  </div>
                </div>
                <div class="canvas-area">
                  <div class="page-container" *ngFor="let page of builderPages">
                    <div class="page-header">
                      <h5>Page {{ page.number }}</h5>
                      <button class="page-btn" (click)="deletePage(page)">🗑️</button>
                    </div>
                    <div class="page-content">
                      <div class="component-placeholder" *ngFor="let component of page.components">
                        <div class="placeholder-content">{{ component.name }}</div>
                        <div class="placeholder-actions">
                          <button class="placeholder-btn" (click)="editComponent(component)">Edit</button>
                          <button class="placeholder-btn delete" (click)="removeComponent(component)">Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Template Management -->
          <div class="template-management">
            <h3>⚙️ Template Management</h3>
            <div class="management-grid">
              <div class="management-card">
                <h4>📊 Usage Statistics</h4>
                <div class="usage-stats">
                  <div class="stat-item">
                    <span class="stat-label">Total Templates:</span>
                    <span class="stat-value">{{ totalTemplates }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Custom Templates:</span>
                    <span class="stat-value">{{ customTemplates }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Most Popular:</span>
                    <span class="stat-value">{{ mostPopularTemplate }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Total Downloads:</span>
                    <span class="stat-value">{{ totalDownloads }}</span>
                  </div>
                </div>
              </div>

              <div class="management-card">
                <h4>🎯 Framework Distribution</h4>
                <div class="framework-chart">
                  <svg width="100%" height="150" viewBox="0 0 200 150">
                    <circle cx="100" cy="75" r="60" fill="none" stroke="#e5e7eb" stroke-width="20"/>
                    <circle cx="100" cy="75" r="60" fill="none" stroke="#2563eb" stroke-width="20" 
                            stroke-dasharray="188.5" stroke-dashoffset="94.25"/>
                    <text x="100" y="75" text-anchor="middle" dy=".3em" font-size="12" fill="#666">GRI 40%</text>
                  </svg>
                </div>
              </div>

              <div class="management-card">
                <h4>📈 Template Trends</h4>
                <div class="trend-chart">
                  <svg width="100%" height="100" viewBox="0 0 200 100">
                    <polyline points="20,80 60,60 100,40 140,50 180,30"
                              fill="none" stroke="#10b981" stroke-width="2" />
                    <circle cx="20" cy="80" r="3" fill="#10b981" />
                    <circle cx="60" cy="60" r="3" fill="#10b981" />
                    <circle cx="100" cy="40" r="3" fill="#10b981" />
                    <circle cx="140" cy="50" r="3" fill="#10b981" />
                    <circle cx="180" cy="30" r="3" fill="#10b981" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'compliance-checklist'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>✅ Compliance Checklist</h2>
            <p>GRI, CSRD, Tadawul, SDGs, etc.</p>
            <div class="placeholder-features">
              <div class="feature-item">✅ GRI, CSRD, Tadawul compliance</div>
              <div class="feature-item">🌍 SDGs alignment</div>
              <div class="feature-item">📋 Interactive checklists</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'upload-evidence'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>📎 Upload Evidence</h2>
            <p>Attach policies, certificates, documents for audits</p>
            <div class="placeholder-features">
              <div class="feature-item">📎 Attach policies and certificates</div>
              <div class="feature-item">📄 Document management</div>
              <div class="feature-item">🔍 Audit trail</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'deadlines'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>📅 Deadlines</h2>
            <p>Reporting calendar and upcoming deadlines</p>
            <div class="placeholder-features">
              <div class="feature-item">📅 Reporting calendar</div>
              <div class="feature-item">⏰ Upcoming deadlines</div>
              <div class="feature-item">🔔 Automated reminders</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'site-view'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>🌍 Site View</h2>
            <p>Facility-wise ESG view</p>
            <div class="placeholder-features">
              <div class="feature-item">🏭 Carbon, water, energy by site</div>
              <div class="feature-item">📊 Site performance metrics</div>
              <div class="feature-item">🗺️ Geographic visualization</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'department-view'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>🏢 Department View</h2>
            <p>Departmental ESG contribution</p>
            <div class="placeholder-features">
              <div class="feature-item">👥 HR, Ops, Supply Chain data</div>
              <div class="feature-item">📊 Departmental metrics</div>
              <div class="feature-item">🎯 Performance tracking</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'my-tasks'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>📝 My Tasks</h2>
            <p>Assigned actions and responsibilities</p>
            <div class="placeholder-features">
              <div class="feature-item">📝 Assigned actions</div>
              <div class="feature-item">✅ Task completion tracking</div>
              <div class="feature-item">📅 Due date management</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'workflow-tracker'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>🔄 Workflow Tracker</h2>
            <p>Data entry → validation → approval → reporting</p>
            <div class="placeholder-features">
              <div class="feature-item">🔄 Workflow stages</div>
              <div class="feature-item">✅ Approval processes</div>
              <div class="feature-item">📊 Progress tracking</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'notifications'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>🔔 Notifications</h2>
            <p>For overdue or upcoming tasks</p>
            <div class="placeholder-features">
              <div class="feature-item">🔔 Task notifications</div>
              <div class="feature-item">⏰ Deadline reminders</div>
              <div class="feature-item">📧 Email alerts</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'comments'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>💬 Comments</h2>
            <p>On data entries or reports</p>
            <div class="placeholder-features">
              <div class="feature-item">💬 Comment system</div>
              <div class="feature-item">📝 Notes and feedback</div>
              <div class="feature-item">👥 Team collaboration</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'assign-tasks'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>👥 Assign Tasks</h2>
            <p>To other team members or site leads</p>
            <div class="placeholder-features">
              <div class="feature-item">👥 Task assignment</div>
              <div class="feature-item">👤 Team member management</div>
              <div class="feature-item">📋 Responsibility tracking</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'review-logs'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>📋 Review Logs</h2>
            <p>Track who reviewed or approved what</p>
            <div class="placeholder-features">
              <div class="feature-item">📋 Review tracking</div>
              <div class="feature-item">✅ Approval logs</div>
              <div class="feature-item">👤 User activity</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'document-repository'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>📁 Document Repository</h2>
            <p>Access to ESG documents</p>
            <div class="placeholder-features">
              <div class="feature-item">📁 Document storage</div>
              <div class="feature-item">📚 Past reports access</div>
              <div class="feature-item">🔍 Search functionality</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'upload-download'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>📤 Upload/Download</h2>
            <p>For audits, disclosures, etc.</p>
            <div class="placeholder-features">
              <div class="feature-item">📤 File upload/download</div>
              <div class="feature-item">📄 Document management</div>
              <div class="feature-item">🔒 Secure storage</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'knowledge-base'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>📘 Knowledge Base</h2>
            <p>ESG reporting guides and best practices</p>
            <div class="placeholder-features">
              <div class="feature-item">📘 ESG reporting guides</div>
              <div class="feature-item">📊 KPI calculation formulas</div>
              <div class="feature-item">🎯 Best practices</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'training'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>🎓 Training</h2>
            <p>Training videos and documentation</p>
            <div class="placeholder-features">
              <div class="feature-item">🎓 Training videos</div>
              <div class="feature-item">📚 Documentation</div>
              <div class="feature-item">📖 Learning resources</div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedDashboard === 'user-logs'" class="dashboard-content">
          <div class="placeholder-content">
            <h2>👤 User Logs</h2>
            <p>Audit trail of actions for transparency</p>
            <div class="placeholder-features">
              <div class="feature-item">👤 User activity logs</div>
              <div class="feature-item">🕵️‍♀️ Audit trail</div>
              <div class="feature-item">📊 Action transparency</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})

export class EsgSpecialistComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  currentLanguage = 'en';
  selectedDashboard = 'overview';
  private translationSubscription?: Subscription;

  // Data Entry Properties
  selectedLocation = '';
  selectedKPI = '';
  reportingPeriod = '';
  metricValue = '';
  selectedUnit = '';
  dataSource = '';
  confidenceLevel = '';
  notes = '';
  formValid = false;
  recentEntries = [
    { location: 'Headquarters', kpi: 'Carbon Emissions', value: '1,250', unit: 'tCO₂e', date: '2025-01-15', status: 'validated' },
    { location: 'Factory 1', kpi: 'Energy Consumption', value: '45,000', unit: 'kWh', date: '2025-01-14', status: 'pending' },
    { location: 'Warehouse', kpi: 'Water Usage', value: '2,500', unit: 'm³', date: '2025-01-13', status: 'validated' }
  ];

  // Upload File Properties
  uploadInProgress = false;
  uploadProgress = 0;
  isDragOver = false;
  uploadedFiles = [
    { name: 'carbon_data_jan2025.xlsx', size: '2.3 MB', status: 'processed' },
    { name: 'energy_consumption.csv', size: '1.8 MB', status: 'validating' }
  ];
  iotDevices = [
    { icon: '🌡️', name: 'Temperature Sensor', location: 'Factory 1', status: 'online', lastValue: '24°C', lastUpdate: '2 min ago' },
    { icon: '⚡', name: 'Energy Meter', location: 'Headquarters', status: 'online', lastValue: '45.2 kWh', lastUpdate: '5 min ago' },
    { icon: '💧', name: 'Water Flow Meter', location: 'Warehouse', status: 'offline', lastValue: '0 L/min', lastUpdate: '1 hour ago' },
    { icon: '🌱', name: 'Air Quality Sensor', location: 'Factory 2', status: 'online', lastValue: 'Good', lastUpdate: '10 min ago' }
  ];
  connectedDevices = 3;
  totalDevices = 4;
  lastSyncTime = '2025-01-15 14:30';
  dataPointsToday = 1247;
  validationResults = [
    { fileName: 'carbon_data_jan2025.xlsx', status: 'valid', records: 150, valid: 148, errors: 2 },
    { fileName: 'energy_consumption.csv', status: 'processing', records: 89, valid: 87, errors: 2 }
  ];

  // Data Validation Properties
  totalDataPoints = 12450;
  validDataPoints = 11890;
  invalidDataPoints = 320;
  missingDataPoints = 240;
  criticalIssues = [
    { type: 'Missing Data', description: 'Energy consumption data missing for Factory 2 - January 2025', location: 'Factory 2', date: '2025-01-15' },
    { type: 'Outlier Detected', description: 'Water usage spike detected - 500% above normal', location: 'Warehouse', date: '2025-01-14' },
    { type: 'Data Inconsistency', description: 'Carbon emissions data inconsistent with energy consumption', location: 'Headquarters', date: '2025-01-13' }
  ];
  completenessData = [
    { kpi: 'Carbon Emissions', percentage: 95, missing: 12, total: 240 },
    { kpi: 'Energy Consumption', percentage: 87, missing: 23, total: 180 },
    { kpi: 'Water Usage', percentage: 92, missing: 8, total: 100 },
    { kpi: 'Waste Management', percentage: 78, missing: 15, total: 68 }
  ];
  outliers = [
    { value: '2,500 m³', kpi: 'Water Usage', location: 'Warehouse', severity: 'high' },
    { value: '150 kWh', kpi: 'Energy Consumption', location: 'Factory 1', severity: 'medium' },
    { value: '500 tCO₂e', kpi: 'Carbon Emissions', location: 'Headquarters', severity: 'low' }
  ];
  validationRules = [
    { name: 'Range Validation', description: 'Check if values are within acceptable ranges', active: true, violations: 5, lastRun: '2 hours ago' },
    { name: 'Completeness Check', description: 'Ensure all required fields are filled', active: true, violations: 12, lastRun: '1 hour ago' },
    { name: 'Consistency Check', description: 'Verify data consistency across related metrics', active: false, violations: 3, lastRun: '3 hours ago' },
    { name: 'Outlier Detection', description: 'Identify statistical outliers in the data', active: true, violations: 8, lastRun: '30 min ago' }
  ];

  // Change Log Properties
  selectedUser = '';
  selectedAction = '';
  startDate = '';
  endDate = '';
  totalChanges = 1247;
  todayChanges = 45;
  weekChanges = 234;
  changeLogs = [
    { icon: '➕', action: 'create', user: 'ESG Specialist', timestamp: '2025-01-15 14:30', description: 'Added new carbon emission data entry', field: 'Carbon Emissions', oldValue: '', newValue: '1,250 tCO₂e', location: 'Headquarters', ipAddress: '192.168.1.100', sessionId: 'SESS001', version: '1.2.3' },
    { icon: '✏️', action: 'update', user: 'Data Analyst', timestamp: '2025-01-15 13:45', description: 'Updated energy consumption values', field: 'Energy Consumption', oldValue: '45,000 kWh', newValue: '47,200 kWh', location: 'Factory 1', ipAddress: '192.168.1.101', sessionId: 'SESS002', version: '1.2.3' },
    { icon: '🗑️', action: 'delete', user: 'Admin', timestamp: '2025-01-15 12:20', description: 'Removed duplicate water usage entry', field: 'Water Usage', oldValue: '2,500 m³', newValue: '', location: 'Warehouse', ipAddress: '192.168.1.102', sessionId: 'SESS003', version: '1.2.3' },
    { icon: '✅', action: 'validate', user: 'ESG Specialist', timestamp: '2025-01-15 11:15', description: 'Validated waste management data', field: 'Waste Management', oldValue: 'Pending', newValue: 'Validated', location: 'Factory 2', ipAddress: '192.168.1.100', sessionId: 'SESS001', version: '1.2.3' }
  ];
  versionHistory = [
    { number: '2.1.0', date: '2025-01-15', status: 'current', description: 'Added new ESG metrics and improved validation', added: 15, modified: 8, removed: 3 },
    { number: '2.0.5', date: '2025-01-10', status: 'stable', description: 'Bug fixes and performance improvements', added: 2, modified: 12, removed: 1 },
    { number: '2.0.0', date: '2025-01-01', status: 'archived', description: 'Major update with new framework support', added: 45, modified: 23, removed: 8 }
  ];
  userActivity = [
    { avatar: '👤', name: 'ESG Specialist', role: 'ESG Specialist', changes: 45, lastActive: '2 min ago', sessionTime: '4h 23m' },
    { avatar: '👨‍💼', name: 'Data Analyst', role: 'Data Analyst', changes: 23, lastActive: '15 min ago', sessionTime: '2h 15m' },
    { avatar: '👩‍💻', name: 'Admin User', role: 'Administrator', changes: 12, lastActive: '1 hour ago', sessionTime: '1h 45m' }
  ];

  // Generate Report Properties
  selectedFramework = 'gri';
  selectedReportType = '';
  reportStartDate = '';
  reportEndDate = '';
  includeEnvironmental = true;
  includeSocial = true;
  includeGovernance = true;
  frameworks = [
    { id: 'gri', icon: '📊', name: 'GRI Standards', description: 'Global Reporting Initiative', status: 'active' },
    { id: 'tcfd', icon: '🌍', name: 'TCFD Framework', description: 'Task Force on Climate-related Financial Disclosures', status: 'active' },
    { id: 'sasb', icon: '📈', name: 'SASB Standards', description: 'Sustainability Accounting Standards Board', status: 'active' },
    { id: 'cdp', icon: '🌱', name: 'CDP Framework', description: 'Carbon Disclosure Project', status: 'active' },
    { id: 'tadawul', icon: '🏛️', name: 'Tadawul ESG', description: 'Saudi Stock Exchange ESG Guidelines', status: 'active' }
  ];
  reportTitle = 'ESG Sustainability Report 2025';
  reportSubtitle = 'Comprehensive Environmental, Social, and Governance Performance';
  currentDate = new Date().toISOString().split('T')[0];
  selectedFrameworkName = 'GRI Standards';
  reportSections = [
    { title: 'Executive Summary', status: 'complete', pages: 3, charts: 2, tables: 1 },
    { title: 'Environmental Performance', status: 'complete', pages: 8, charts: 5, tables: 3 },
    { title: 'Social Impact', status: 'in-progress', pages: 6, charts: 4, tables: 2 },
    { title: 'Governance & Compliance', status: 'pending', pages: 5, charts: 3, tables: 2 },
    { title: 'Risk Management', status: 'pending', pages: 4, charts: 2, tables: 1 }
  ];
  totalPages = 26;
  totalCharts = 16;
  totalTables = 9;
  totalMetrics = 45;
  exportFormats = [
    { icon: '📄', name: 'PDF Report', description: 'High-quality printable document', type: 'pdf' },
    { icon: '📊', name: 'Excel Spreadsheet', description: 'Data tables and calculations', type: 'excel' },
    { icon: '📋', name: 'Word Document', description: 'Editable text document', type: 'word' },
    { icon: '🌐', name: 'HTML Web Page', description: 'Interactive web version', type: 'html' }
  ];
  savedTemplates = [
    { name: 'Annual ESG Report', framework: 'GRI', created: '2025-01-10', lastUsed: '2025-01-15', usageCount: 5 },
    { name: 'Quarterly Update', framework: 'TCFD', created: '2025-01-05', lastUsed: '2025-01-12', usageCount: 3 },
    { name: 'Sustainability Summary', framework: 'SASB', created: '2024-12-20', lastUsed: '2025-01-08', usageCount: 8 }
  ];

  // Past Reports Properties
  searchQuery = '';
  filterFramework = '';
  filterYear = '';
  filterType = '';
  viewMode = 'grid';
  pastReports = [
    { icon: '📊', title: 'Annual ESG Report 2024', description: 'Comprehensive sustainability report for 2024', framework: 'GRI', date: '2024-12-31', pages: 45, charts: 23, size: '12.5 MB', status: 'published' },
    { icon: '🌍', title: 'TCFD Climate Report', description: 'Climate-related financial disclosures', framework: 'TCFD', date: '2024-11-15', pages: 28, charts: 15, size: '8.2 MB', status: 'published' },
    { icon: '📈', title: 'Q3 Sustainability Update', description: 'Third quarter sustainability performance', framework: 'SASB', date: '2024-10-31', pages: 18, charts: 12, size: '5.8 MB', status: 'published' },
    { icon: '🏛️', title: 'Tadawul Compliance Report', description: 'Saudi market compliance documentation', framework: 'Tadawul', date: '2024-09-30', pages: 32, charts: 8, size: '9.1 MB', status: 'published' }
  ];
  timelineYears = [
    { year: '2025', count: 2, reports: [
      { title: 'Q1 ESG Update', framework: 'GRI', date: '2025-01-15', size: '6.2 MB' },
      { title: 'Sustainability Brief', framework: 'SASB', date: '2025-01-10', size: '3.8 MB' }
    ]},
    { year: '2024', count: 8, reports: [
      { title: 'Annual ESG Report 2024', framework: 'GRI', date: '2024-12-31', size: '12.5 MB' },
      { title: 'TCFD Climate Report', framework: 'TCFD', date: '2024-11-15', size: '8.2 MB' }
    ]}
  ];
  frameworkStats = [
    { name: 'GRI', count: 12, percentage: 40 },
    { name: 'TCFD', count: 8, percentage: 27 },
    { name: 'SASB', count: 6, percentage: 20 },
    { name: 'Tadawul', count: 4, percentage: 13 }
  ];
  totalReports = 30;
  totalPagesGenerated = 1250;
  averageReportSize = '8.5 MB';
  storageUsed = '256 GB';

  // Report Templates Properties
  selectedCategory = 'all';
  sortBy = 'name';
  galleryView = 'grid';
  showBuilder = false;
  templateCategories = [
    { id: 'all', icon: '📋', name: 'All Templates', count: 25 },
    { id: 'gri', icon: '📊', name: 'GRI Templates', count: 8 },
    { id: 'tcfd', icon: '🌍', name: 'TCFD Templates', count: 6 },
    { id: 'sasb', icon: '📈', name: 'SASB Templates', count: 5 },
    { id: 'custom', icon: '🎨', name: 'Custom Templates', count: 6 }
  ];
  filteredTemplates = [
    { icon: '📊', name: 'GRI Annual Report Template', description: 'Comprehensive GRI-compliant annual report template', framework: 'GRI', pages: 45, rating: 4.8, downloads: 156, tags: ['Annual', 'Comprehensive', 'GRI'], author: 'ESG Team', created: '2024-12-01', previewPages: [{ content: 'Executive Summary' }, { content: 'Environmental Performance' }] },
    { icon: '🌍', name: 'TCFD Climate Report', description: 'Climate-related financial disclosures template', framework: 'TCFD', pages: 28, rating: 4.6, downloads: 89, tags: ['Climate', 'Financial', 'TCFD'], author: 'Climate Team', created: '2024-11-15', previewPages: [{ content: 'Governance' }, { content: 'Strategy' }] },
    { icon: '📈', name: 'SASB Industry Template', description: 'Industry-specific SASB metrics template', framework: 'SASB', pages: 32, rating: 4.7, downloads: 123, tags: ['Industry', 'Metrics', 'SASB'], author: 'Analytics Team', created: '2024-10-20', previewPages: [{ content: 'Industry Metrics' }, { content: 'Performance Data' }] }
  ];
  chartComponents = [
    { icon: '📊', name: 'Bar Chart', description: 'Vertical or horizontal bar charts' },
    { icon: '📈', name: 'Line Chart', description: 'Trend analysis and time series data' },
    { icon: '🥧', name: 'Pie Chart', description: 'Proportional data visualization' },
    { icon: '📉', name: 'Area Chart', description: 'Cumulative data representation' }
  ];
  tableComponents = [
    { icon: '📋', name: 'Data Table', description: 'Structured data presentation' },
    { icon: '📊', name: 'Pivot Table', description: 'Multi-dimensional data analysis' },
    { icon: '📈', name: 'Comparison Table', description: 'Side-by-side data comparison' }
  ];
  textComponents = [
    { icon: '📝', name: 'Text Block', description: 'Rich text content area' },
    { icon: '📋', name: 'Bullet List', description: 'Unordered list items' },
    { icon: '📊', name: 'Numbered List', description: 'Ordered list items' },
    { icon: '📄', name: 'Quote Block', description: 'Highlighted quote or statement' }
  ];
  builderPages = [
    { number: 1, components: [
      { name: 'Executive Summary', type: 'text' },
      { name: 'ESG Score Overview', type: 'chart' }
    ]},
    { number: 2, components: [
      { name: 'Environmental Metrics', type: 'table' },
      { name: 'Carbon Footprint Trend', type: 'chart' }
    ]}
  ];
  totalTemplates = 25;
  customTemplates = 6;
  mostPopularTemplate = 'GRI Annual Report';
  totalDownloads = 1247;

  // Compliance Data
  complianceStandards = [
    {
      icon: '📊',
      name: 'GRI Standards',
      description: 'Global Reporting Initiative Standards for sustainability reporting',
      status: 'in-progress',
      progress: 75,
      requirements: [
        { text: 'GRI 101: Foundation', completed: true, deadline: 'Completed' },
        { text: 'GRI 102: General Disclosures', completed: true, deadline: 'Completed' },
        { text: 'GRI 201: Economic Performance', completed: true, deadline: 'Completed' },
        { text: 'GRI 301: Materials', completed: false, deadline: 'March 15, 2025' },
        { text: 'GRI 302: Energy', completed: false, deadline: 'March 15, 2025' },
        { text: 'GRI 303: Water', completed: false, deadline: 'March 15, 2025' }
      ]
    },
    {
      icon: '🇪🇺',
      name: 'CSRD',
      description: 'Corporate Sustainability Reporting Directive (EU)',
      status: 'pending',
      progress: 45,
      requirements: [
        { text: 'Double Materiality Assessment', completed: true, deadline: 'Completed' },
        { text: 'ESG Strategy & Business Model', completed: false, deadline: 'April 30, 2025' },
        { text: 'Sustainability Risk Management', completed: false, deadline: 'April 30, 2025' },
        { text: 'Sustainability Performance Metrics', completed: false, deadline: 'May 15, 2025' }
      ]
    },
    {
      icon: '🇸🇦',
      name: 'Tadawul',
      description: 'Saudi Stock Exchange ESG Reporting Requirements',
      status: 'in-progress',
      progress: 60,
      requirements: [
        { text: 'Board ESG Oversight', completed: true, deadline: 'Completed' },
        { text: 'ESG Strategy & Objectives', completed: true, deadline: 'Completed' },
        { text: 'ESG Risk Management', completed: false, deadline: 'June 30, 2025' },
        { text: 'ESG Performance Metrics', completed: false, deadline: 'June 30, 2025' }
      ]
    },
    {
      icon: '🌍',
      name: 'SDGs',
      description: 'United Nations Sustainable Development Goals',
      status: 'completed',
      progress: 100,
      requirements: [
        { text: 'SDG Mapping & Alignment', completed: true, deadline: 'Completed' },
        { text: 'SDG Impact Assessment', completed: true, deadline: 'Completed' },
        { text: 'SDG Reporting Framework', completed: true, deadline: 'Completed' }
      ]
    }
  ];

  calendarDays = [
    { number: 1, hasDeadline: false },
    { number: 2, hasDeadline: false },
    { number: 3, hasDeadline: false },
    { number: 4, hasDeadline: false },
    { number: 5, hasDeadline: false },
    { number: 6, hasDeadline: false },
    { number: 7, hasDeadline: false },
    { number: 8, hasDeadline: false },
    { number: 9, hasDeadline: false },
    { number: 10, hasDeadline: false },
    { number: 11, hasDeadline: false },
    { number: 12, hasDeadline: false },
    { number: 13, hasDeadline: false },
    { number: 14, hasDeadline: false },
    { number: 15, hasDeadline: true, deadlines: [
      { time: '09:00', title: 'GRI 301 Materials Report', priority: 'high' }
    ]},
    { number: 16, hasDeadline: false },
    { number: 17, hasDeadline: false },
    { number: 18, hasDeadline: false },
    { number: 19, hasDeadline: false },
    { number: 20, hasDeadline: true, deadlines: [
      { time: '14:00', title: 'CSRD Strategy Review', priority: 'medium' }
    ]},
    { number: 21, hasDeadline: false },
    { number: 22, hasDeadline: false },
    { number: 23, hasDeadline: false },
    { number: 24, hasDeadline: false },
    { number: 25, hasDeadline: false },
    { number: 26, hasDeadline: false },
    { number: 27, hasDeadline: false },
    { number: 28, hasDeadline: false },
    { number: 29, hasDeadline: false },
    { number: 30, hasDeadline: true, deadlines: [
      { time: '16:00', title: 'Tadawul ESG Metrics', priority: 'high' }
    ]},
    { number: 31, hasDeadline: false }
  ];

  upcomingDeadlines = [
    {
      day: '15',
      month: 'JAN',
      title: 'GRI 301 Materials Report',
      description: 'Submit materials consumption and efficiency data',
      standard: 'GRI Standards',
      assignee: 'Environmental Manager',
      status: 'pending',
      priority: 'high'
    },
    {
      day: '20',
      month: 'JAN',
      title: 'CSRD Strategy Review',
      description: 'Review and update ESG strategy alignment',
      standard: 'CSRD',
      assignee: 'ESG Specialist',
      status: 'in-progress',
      priority: 'medium'
    },
    {
      day: '30',
      month: 'JAN',
      title: 'Tadawul ESG Metrics',
      description: 'Submit quarterly ESG performance metrics',
      standard: 'Tadawul',
      assignee: 'ESG Specialist',
      status: 'pending',
      priority: 'high'
    },
    {
      day: '15',
      month: 'FEB',
      title: 'GRI 302 Energy Report',
      description: 'Submit energy consumption and efficiency data',
      standard: 'GRI Standards',
      assignee: 'Environmental Manager',
      status: 'pending',
      priority: 'medium'
    }
  ];

  evidenceCategories = [
    {
      icon: '📋',
      name: 'Policies & Procedures',
      description: 'ESG policies, procedures, and governance documents',
      fileCount: 12,
      totalSize: '45.2 MB',
      files: [
        { icon: '📄', name: 'ESG Policy Framework.pdf', size: '2.3 MB', uploadDate: '2025-01-10' },
        { icon: '📄', name: 'Sustainability Strategy.pdf', size: '1.8 MB', uploadDate: '2025-01-08' },
        { icon: '📄', name: 'Risk Management Policy.pdf', size: '3.1 MB', uploadDate: '2025-01-05' }
      ]
    },
    {
      icon: '🏆',
      name: 'Certificates & Awards',
      description: 'ESG certifications, awards, and recognition documents',
      fileCount: 8,
      totalSize: '28.7 MB',
      files: [
        { icon: '🏆', name: 'ISO 14001 Certificate.pdf', size: '1.2 MB', uploadDate: '2025-01-12' },
        { icon: '🏆', name: 'Green Building Certification.pdf', size: '2.5 MB', uploadDate: '2025-01-09' },
        { icon: '🏆', name: 'Sustainability Award 2024.pdf', size: '0.8 MB', uploadDate: '2025-01-03' }
      ]
    },
    {
      icon: '📊',
      name: 'Audit Reports',
      description: 'ESG audit reports, assessments, and compliance reviews',
      fileCount: 15,
      totalSize: '67.3 MB',
      files: [
        { icon: '📊', name: 'ESG Audit Report 2024.pdf', size: '5.2 MB', uploadDate: '2025-01-15' },
        { icon: '📊', name: 'Compliance Assessment.pdf', size: '3.8 MB', uploadDate: '2025-01-11' },
        { icon: '📊', name: 'Risk Assessment Report.pdf', size: '4.1 MB', uploadDate: '2025-01-07' }
      ]
    },
    {
      icon: '📈',
      name: 'Performance Data',
      description: 'ESG performance data, metrics, and historical reports',
      fileCount: 25,
      totalSize: '89.1 MB',
      files: [
        { icon: '📈', name: 'ESG Performance Report 2024.pdf', size: '6.7 MB', uploadDate: '2025-01-14' },
        { icon: '📈', name: 'Carbon Footprint Data.xlsx', size: '2.1 MB', uploadDate: '2025-01-13' },
        { icon: '📈', name: 'Sustainability Metrics Q4.pdf', size: '3.2 MB', uploadDate: '2025-01-06' }
      ]
    }
  ];

  // Carbon Calculator Data
  carbonData = {
    energyConsumption: 0,
    transportType: '',
    distanceTraveled: 0,
    wasteGenerated: 0,
    waterConsumption: 0,
    dietType: ''
  };

  carbonResults = {
    energyEmissions: 0,
    transportEmissions: 0,
    wasteEmissions: 0,
    waterEmissions: 0,
    dietEmissions: 0,
    totalEmissions: 0,
    energyPercentage: 0,
    transportPercentage: 0,
    wastePercentage: 0,
    waterPercentage: 0,
    dietPercentage: 0
  };

  constructor(
    private router: Router,
    private translationService: EsgSpecialistTranslationService
  ) {}

  ngOnInit() {
    // Initialize translation
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    
    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('ESG Specialist language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('ESG Specialist translations not loaded yet');
      } else {
        console.log('ESG Specialist translations loaded successfully');
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.translationSubscription?.unsubscribe();
  }

  logout() { 
    if (typeof window !== 'undefined' && window.localStorage) {
      if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    }
    this.router.navigate(['/login']);
  }
  toggleDarkMode() { this.darkMode = !this.darkMode; }

  getTranslatedText(key: string): string {
    const translated = this.translationService.translate(key);
    if (translated === key) {
      console.warn(`ESG Specialist translation failed for key: ${key}`);
    }
    return translated;
  }

  selectDashboard(dashboard: string) {
    this.selectedDashboard = dashboard;
  }

  getDashboardTitle(): string {
    switch (this.selectedDashboard) {
      case 'overview':
        return this.getTranslatedText('ESG_SPECIALIST.OVERVIEW');
      case 'environmental':
        return this.getTranslatedText('ESG_SPECIALIST.ENVIRONMENTAL_DASHBOARD');
      case 'social':
        return this.getTranslatedText('ESG_SPECIALIST.SOCIAL_DASHBOARD');
      case 'governance':
        return this.getTranslatedText('ESG_SPECIALIST.GOVERNANCE_DASHBOARD');
      case 'enter-data':
        return this.getTranslatedText('NAVIGATION.ENTER_DATA');
      case 'upload-file':
        return this.getTranslatedText('NAVIGATION.UPLOAD_FILE');
      case 'data-validation':
        return this.getTranslatedText('NAVIGATION.DATA_VALIDATION');
      case 'change-log':
        return this.getTranslatedText('NAVIGATION.CHANGE_LOG');
      case 'generate-report':
        return this.getTranslatedText('ESG_SPECIALIST.GENERATE_REPORT');
      case 'past-reports':
        return 'Past Reports';
      case 'report-templates':
        return 'Report Templates';
      case 'compliance-checklist':
        return 'Compliance Checklist';
      case 'upload-evidence':
        return 'Upload Evidence';
      case 'upcoming-deadlines':
        return 'Upcoming Deadlines';
      case 'site-view':
        return 'Site View';
      case 'department-view':
        return 'Department View';
      case 'my-tasks':
        return 'My Tasks';
      case 'workflow-tracker':
        return 'Workflow Tracker';
      case 'notifications':
        return 'Notifications';
      case 'comments':
        return 'Comments';
      case 'assign-tasks':
        return 'Assign Tasks';
      case 'review-logs':
        return 'Review Logs';
      case 'document-repository':
        return 'Document Repository';
      case 'upload-download':
        return 'Upload/Download';
      case 'knowledge-base':
        return 'Knowledge Base';
      case 'training':
        return this.getTranslatedText('NAVIGATION.TRAINING');
      case 'user-logs':
        return this.getTranslatedText('NAVIGATION.USER_LOGS');
      default:
        return this.getTranslatedText('ESG_SPECIALIST.OVERVIEW');
    }
  }

  // Data Entry Methods
  saveDataEntry() {
    console.log('Saving all data entries...');
    // Implementation for saving data
  }

  validateData() {
    console.log('Validating data...');
    // Implementation for data validation
  }

  clearForm() {
    this.selectedLocation = '';
    this.selectedKPI = '';
    this.reportingPeriod = '';
    this.metricValue = '';
    this.selectedUnit = '';
    this.dataSource = '';
    this.confidenceLevel = '';
    this.notes = '';
  }

  addDataEntry() {
    if (this.formValid) {
      const newEntry = {
        location: this.selectedLocation,
        kpi: this.selectedKPI,
        value: this.metricValue,
        unit: this.selectedUnit,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      this.recentEntries.unshift(newEntry);
      this.clearForm();
    }
  }

  // Upload File Methods
  downloadUploadTemplate() {
    console.log('Downloading upload template...');
    // Implementation for template download
  }

  syncIoTData() {
    console.log('Syncing IoT data...');
    // Implementation for IoT data sync
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    this.uploadInProgress = true;
    this.uploadProgress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.uploadInProgress = false;
        // Add files to uploaded files list
        Array.from(files).forEach(file => {
          this.uploadedFiles.push({
            name: file.name,
            size: this.formatFileSize(file.size),
            status: 'uploaded'
          });
        });
      }
    }, 200);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  processFile(file: any) {
    console.log('Processing file:', file.name);
    file.status = 'processing';
  }

  removeFile(file: any) {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  refreshSyncStatus() {
    console.log('Refreshing sync status...');
    // Implementation for refreshing sync status
  }

  viewErrors(result: any) {
    console.log('Viewing errors for:', result.fileName);
    // Implementation for viewing errors
  }

  importData(result: any) {
    console.log('Importing data from:', result.fileName);
    // Implementation for importing data
  }

  // Data Validation Methods
  runFullValidation() {
    console.log('Running full validation...');
    // Implementation for full validation
  }

  exportValidationReport() {
    console.log('Exporting validation report...');
    // Implementation for exporting report
  }

  fixIssue(issue: any) {
    console.log('Fixing issue:', issue.type);
    // Implementation for fixing issues
  }

  ignoreIssue(issue: any) {
    console.log('Ignoring issue:', issue.type);
    // Implementation for ignoring issues
  }

  toggleRule(rule: any) {
    rule.active = !rule.active;
    console.log('Toggled rule:', rule.name, 'Active:', rule.active);
  }

  // Change Log Methods
  exportChangeLog() {
    console.log('Exporting change log...');
    // Implementation for exporting change log
  }

  clearOldLogs() {
    console.log('Clearing old logs...');
    // Implementation for clearing old logs
  }

  applyFilters() {
    console.log('Applying filters:', { user: this.selectedUser, action: this.selectedAction, startDate: this.startDate, endDate: this.endDate });
    // Implementation for applying filters
  }

  viewChangeDetails(change: any) {
    console.log('Viewing change details:', change);
    // Implementation for viewing change details
  }

  revertChange(change: any) {
    console.log('Reverting change:', change);
    // Implementation for reverting change
  }

  compareVersion(version: any) {
    console.log('Comparing version:', version);
    // Implementation for comparing versions
  }

  restoreVersion(version: any) {
    console.log('Restoring version:', version);
    // Implementation for restoring version
  }

  downloadVersion(version: any) {
    console.log('Downloading version:', version);
    // Implementation for downloading version
  }

  // Generate Report Methods
  generateReport() {
    console.log('Generating report with framework:', this.selectedFramework);
    // Implementation for generating report
  }

  saveReportTemplate() {
    console.log('Saving report template...');
    // Implementation for saving template
  }

  selectFramework(frameworkId: string) {
    this.selectedFramework = frameworkId;
    const framework = this.frameworks.find(f => f.id === frameworkId);
    if (framework) {
      this.selectedFrameworkName = framework.name;
    }
  }

  refreshPreview() {
    console.log('Refreshing preview...');
    // Implementation for refreshing preview
  }

  fullscreenPreview() {
    console.log('Opening fullscreen preview...');
    // Implementation for fullscreen preview
  }

  editSection(section: any) {
    console.log('Editing section:', section);
    // Implementation for editing section
  }

  previewSection(section: any) {
    console.log('Previewing section:', section);
    // Implementation for previewing section
  }

  exportReport(format: string) {
    console.log('Exporting report in format:', format);
    // Implementation for exporting report
  }

  previewFormat(format: string) {
    console.log('Previewing format:', format);
    // Implementation for previewing format
  }

  loadTemplate(template: any) {
    console.log('Loading template:', template);
    // Implementation for loading template
  }

  editTemplate(template: any) {
    console.log('Editing template:', template);
    // Implementation for editing template
  }

  deleteTemplate(template: any) {
    console.log('Deleting template:', template);
    // Implementation for deleting template
  }

  // Past Reports Methods
  bulkDownload() {
    console.log('Bulk downloading reports...');
    // Implementation for bulk download
  }

  archiveReports() {
    console.log('Archiving old reports...');
    // Implementation for archiving reports
  }

  searchReports() {
    console.log('Searching reports with query:', this.searchQuery);
    // Implementation for searching reports
  }

  setViewMode(mode: string) {
    this.viewMode = mode;
    console.log('Set view mode to:', mode);
  }

  viewReport(report: any) {
    console.log('Viewing report:', report);
    // Implementation for viewing report
  }

  downloadReport(report: any) {
    console.log('Downloading report:', report);
    // Implementation for downloading report
  }

  shareReport(report: any) {
    console.log('Sharing report:', report);
    // Implementation for sharing report
  }

  deleteReport(report: any) {
    console.log('Deleting report:', report);
    // Implementation for deleting report
  }

  // Report Templates Methods
  createTemplate() {
    console.log('Creating new template...');
    this.showBuilder = true;
  }

  importTemplate() {
    console.log('Importing template...');
    // Implementation for importing template
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    console.log('Selected category:', categoryId);
    // Implementation for filtering templates by category
  }

  setGalleryView(view: string) {
    this.galleryView = view;
    console.log('Set gallery view to:', view);
  }

  previewTemplate(template: any) {
    console.log('Previewing template:', template);
    // Implementation for previewing template
  }

  favoriteTemplate(template: any) {
    console.log('Favoriting template:', template);
    // Implementation for favoriting template
  }

  useTemplate(template: any) {
    console.log('Using template:', template);
    // Implementation for using template
  }

  customizeTemplate(template: any) {
    console.log('Customizing template:', template);
    this.showBuilder = true;
  }

  downloadTemplate(template: any) {
    console.log('Downloading template:', template);
    // Implementation for downloading template
  }

  addComponent(component: any) {
    console.log('Adding component:', component);
    // Implementation for adding component to builder
  }

  editComponent(component: any) {
    console.log('Editing component:', component);
    // Implementation for editing component
  }

  removeComponent(component: any) {
    console.log('Removing component:', component);
    // Implementation for removing component
  }

  undoAction() {
    console.log('Undoing action...');
    // Implementation for undo action
  }

  redoAction() {
    console.log('Redoing action...');
    // Implementation for redo action
  }

  saveBuilderTemplate() {
    console.log('Saving builder template...');
    // Implementation for saving template
  }

  deletePage(page: any) {
    console.log('Deleting page:', page);
    // Implementation for deleting page
  }

  // Carbon Calculator Methods
  calculateCarbonFootprint() {
    // Energy emissions (kWh to kg CO2)
    this.carbonResults.energyEmissions = this.carbonData.energyConsumption * 0.5;

    // Transportation emissions
    let transportFactor = 0;
    switch (this.carbonData.transportType) {
      case 'car':
        transportFactor = 0.2; // kg CO2 per km
        break;
      case 'car_electric':
        transportFactor = 0.05; // kg CO2 per km
        break;
      case 'public_transit':
        transportFactor = 0.08; // kg CO2 per km
        break;
      case 'bicycle':
        transportFactor = 0; // No emissions
        break;
      default:
        transportFactor = 0;
    }
    this.carbonResults.transportEmissions = this.carbonData.distanceTraveled * transportFactor;

    // Waste emissions (kg waste to kg CO2)
    this.carbonResults.wasteEmissions = this.carbonData.wasteGenerated * 0.5;

    // Water emissions (liters to kg CO2)
    this.carbonResults.waterEmissions = this.carbonData.waterConsumption * 0.0003;

    // Diet emissions
    let dietFactor = 0;
    switch (this.carbonData.dietType) {
      case 'meat_heavy':
        dietFactor = 2.5; // kg CO2 per day
        break;
      case 'balanced':
        dietFactor = 1.5; // kg CO2 per day
        break;
      case 'vegetarian':
        dietFactor = 1.0; // kg CO2 per day
        break;
      case 'vegan':
        dietFactor = 0.5; // kg CO2 per day
        break;
      default:
        dietFactor = 0;
    }
    this.carbonResults.dietEmissions = dietFactor * 30; // Monthly

    // Calculate total emissions
    this.carbonResults.totalEmissions = 
      this.carbonResults.energyEmissions +
      this.carbonResults.transportEmissions +
      this.carbonResults.wasteEmissions +
      this.carbonResults.waterEmissions +
      this.carbonResults.dietEmissions;

    // Calculate percentages
    if (this.carbonResults.totalEmissions > 0) {
      this.carbonResults.energyPercentage = (this.carbonResults.energyEmissions / this.carbonResults.totalEmissions) * 100;
      this.carbonResults.transportPercentage = (this.carbonResults.transportEmissions / this.carbonResults.totalEmissions) * 100;
      this.carbonResults.wastePercentage = (this.carbonResults.wasteEmissions / this.carbonResults.totalEmissions) * 100;
      this.carbonResults.waterPercentage = (this.carbonResults.waterEmissions / this.carbonResults.totalEmissions) * 100;
      this.carbonResults.dietPercentage = (this.carbonResults.dietEmissions / this.carbonResults.totalEmissions) * 100;
    }
  }

  resetCarbonCalculator() {
    this.carbonData = {
      energyConsumption: 0,
      transportType: '',
      distanceTraveled: 0,
      wasteGenerated: 0,
      waterConsumption: 0,
      dietType: ''
    };

    this.carbonResults = {
      energyEmissions: 0,
      transportEmissions: 0,
      wasteEmissions: 0,
      waterEmissions: 0,
      dietEmissions: 0,
      totalEmissions: 0,
      energyPercentage: 0,
      transportPercentage: 0,
      wastePercentage: 0,
      waterPercentage: 0,
      dietPercentage: 0
    };
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