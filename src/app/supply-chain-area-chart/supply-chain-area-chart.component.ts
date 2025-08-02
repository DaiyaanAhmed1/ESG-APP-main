import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-supply-chain-area-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="width:100%;height:180px;position:relative;">
      <svg [attr.width]="'100%'" height="180" viewBox="0 0 400 180">
        <g>
          <polygon [attr.points]="getArea(emissions)" [attr.fill]="darkMode ? 'rgba(126,170,255,0.3)' : 'rgba(74,108,255,0.18)'" />
          <polyline [attr.points]="getLine(emissions)" fill="none" [attr.stroke]="darkMode ? '#7eaaff' : '#4a6cff'" stroke-width="2.5" />
        </g>
        <g>
          <text *ngFor="let m of months; let i = index" [attr.x]="40+i*50" y="170" font-size="12" [attr.fill]="darkMode ? '#bfc8e6' : '#23284a'">{{m}}</text>
        </g>
        <g>
          <text x="5" y="30" font-size="12" [attr.fill]="darkMode ? '#bfc8e6' : '#23284a'">tCO₂e</text>
          <text x="5" y="60" font-size="12" [attr.fill]="darkMode ? '#bfc8e6' : '#23284a'">100</text>
          <text x="5" y="110" font-size="12" [attr.fill]="darkMode ? '#bfc8e6' : '#23284a'">50</text>
          <text x="5" y="160" font-size="12" [attr.fill]="darkMode ? '#bfc8e6' : '#23284a'">0</text>
        </g>
      </svg>
      <div style="position:absolute;top:8px;right:12px;font-size:12px;">
        <span class="ai-badge">AI/ML</span>
      </div>
      <div style="position:absolute;bottom:4px;right:12px;font-size:11px;color:#888;">Data powered by AI/ML</div>
      <div style="display:flex;gap:1em;position:absolute;bottom:4px;left:12px;font-size:12px;">
        <span style="color:#4a6cff">● Emissions</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ai-badge { background: linear-gradient(90deg,#7b61ff,#43d67c); color: #fff; font-weight: 600; border-radius: 6px; padding: 0.1em 0.7em; margin-left: 0.4em; letter-spacing: 0.5px; vertical-align: middle; font-size: 12px; }
  `]
})
export class SupplyChainAreaChartComponent {
  @Input() darkMode = false;
  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  emissions = [40, 50, 45, 55, 60, 58, 65, 62];
  getLine(data: number[]): string {
    // Y axis: 0-100, X: 40 + i*50
    return data.map((v,i) => `${40+i*50},${170-(v/100)*140}`).join(' ');
  }
  getArea(data: number[]): string {
    let points = data.map((v,i) => `${40+i*50},${170-(v/100)*140}`).join(' ');
    return `40,170 ${points} ${40+(data.length-1)*50},170`;
  }


} 