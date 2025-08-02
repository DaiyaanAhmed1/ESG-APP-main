import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  // Governance-specific data methods
  getGovernanceKpis(): Observable<any[]> {
    return of([
      { icon: '🏛️', value: '98%', label: 'Compliance Score', details: 'Overall governance compliance rating' },
      { icon: '👥', value: '8', label: 'Board Members', details: 'Total board members with diversity metrics' },
      { icon: '💰', value: 'A+', label: 'Ethics Rating', details: 'Corporate ethics and transparency score' },
      { icon: '🛡️', value: '95%', label: 'Risk Management', details: 'Anti-corruption and risk control effectiveness' },
      { icon: '🔒', value: '100%', label: 'Data Security', details: 'Cybersecurity and privacy compliance' }
    ]);
  }

  getBoardComposition(): Observable<any> {
    return of({
      totalMembers: 8,
      independentDirectors: 6,
      executiveDirectors: 2,
      genderDiversity: {
        male: 40,
        female: 60
      },
      ageDistribution: {
        '35-45': 25,
        '46-55': 50,
        '56-65': 25
      },
      expertise: {
        'Finance': 2,
        'Technology': 1,
        'Sustainability': 2,
        'Legal': 1,
        'Industry': 2
      }
    });
  }

  getExecutiveCompensation(): Observable<any[]> {
    return of([
      {
        position: 'CEO',
        name: 'Sarah Johnson',
        baseSalary: 850000,
        performanceBonus: 425000,
        esgBonus: 127500,
        totalCompensation: 1402500,
        esgMetrics: {
          carbonReduction: 85,
          diversityTarget: 70,
          complianceScore: 98
        }
      },
      {
        position: 'CFO',
        name: 'Robert Smith',
        baseSalary: 650000,
        performanceBonus: 325000,
        esgBonus: 97500,
        totalCompensation: 1072500,
        esgMetrics: {
          carbonReduction: 80,
          diversityTarget: 65,
          complianceScore: 95
        }
      }
    ]);
  }

  getRiskManagement(): Observable<any> {
    return of({
      highRisks: [
        {
          title: 'Regulatory Compliance',
          level: 'High',
          description: 'New ESG regulations in KSA require immediate attention',
          impact: 'Financial and reputational',
          mitigation: 'Enhanced compliance monitoring'
        },
        {
          title: 'Data Privacy',
          level: 'Medium',
          description: 'PDPL compliance needs enhancement',
          impact: 'Legal and operational',
          mitigation: 'Privacy framework update'
        },
        {
          title: 'Supply Chain Ethics',
          level: 'Medium',
          description: 'Supplier audit reveals potential issues',
          impact: 'Reputational and operational',
          mitigation: 'Supplier code of conduct'
        }
      ],
      antiCorruptionMeasures: [
        { title: 'Code of Ethics', status: 'Active', lastUpdated: '2024-01-15' },
        { title: 'Training Programs', status: 'Completed', lastUpdated: '2024-02-20' },
        { title: 'Due Diligence', status: 'Ongoing', lastUpdated: '2024-03-10' },
        { title: 'Whistleblower Hotline', status: 'Active', lastUpdated: '2024-01-30' }
      ]
    });
  }

  getPolicyManagement(): Observable<any[]> {
    return of([
      {
        title: 'Code of Ethics',
        status: 'Active',
        description: 'Comprehensive ethical guidelines for all employees',
        lastUpdated: '2024-01-15',
        owner: 'Legal Team',
        version: 'v3.2',
        category: 'Ethics',
        reviewDate: '2024-07-15'
      },
      {
        title: 'ESG Policy',
        status: 'Active',
        description: 'Environmental, Social, and Governance framework',
        lastUpdated: '2024-02-20',
        owner: 'ESG Team',
        version: 'v2.1',
        category: 'Sustainability',
        reviewDate: '2024-08-20'
      },
      {
        title: 'Data Privacy Policy',
        status: 'Active',
        description: 'PDPL compliant data protection guidelines',
        lastUpdated: '2024-03-10',
        owner: 'IT Security',
        version: 'v1.8',
        category: 'Privacy',
        reviewDate: '2024-09-10'
      },
      {
        title: 'Anti-Corruption Policy',
        status: 'Active',
        description: 'Anti-bribery and corruption prevention',
        lastUpdated: '2024-01-30',
        owner: 'Compliance',
        version: 'v2.0',
        category: 'Compliance',
        reviewDate: '2024-07-30'
      }
    ]);
  }

  getAuditTrail(): Observable<any[]> {
    return of([
      {
        icon: '📝',
        title: 'Policy Updated',
        description: 'ESG Policy updated to include new regulations',
        time: '2 hours ago',
        user: 'Sarah Johnson',
        category: 'Policy',
        impact: 'Medium'
      },
      {
        icon: '🔍',
        title: 'Compliance Audit',
        description: 'Annual compliance audit completed',
        time: '1 day ago',
        user: 'Compliance Team',
        category: 'Audit',
        impact: 'High'
      },
      {
        icon: '📊',
        title: 'Board Meeting',
        description: 'Q1 governance review meeting',
        time: '3 days ago',
        user: 'Board Secretary',
        category: 'Meeting',
        impact: 'Medium'
      },
      {
        icon: '🔒',
        title: 'Security Scan',
        description: 'Cybersecurity assessment completed',
        time: '1 week ago',
        user: 'IT Security',
        category: 'Security',
        impact: 'High'
      }
    ]);
  }

  getSecurityControls(): Observable<any> {
    return of({
      privacyControls: [
        { title: 'Data Encryption', status: 'Active', progress: 95, lastUpdated: '2024-03-15' },
        { title: 'Access Controls', status: 'Active', progress: 88, lastUpdated: '2024-03-10' },
        { title: 'Data Retention', status: 'Active', progress: 92, lastUpdated: '2024-03-05' },
        { title: 'Privacy Training', status: 'Active', progress: 85, lastUpdated: '2024-02-28' }
      ],
      cyberStatus: [
        { icon: '🛡️', title: 'Firewall Status', value: 'Protected', lastCheck: '2024-04-15' },
        { icon: '🔐', title: 'Encryption', value: 'AES-256', lastCheck: '2024-04-15' },
        { icon: '👥', title: 'Access Logs', value: 'Monitored', lastCheck: '2024-04-15' },
        { icon: '🚨', title: 'Incident Response', value: 'Ready', lastCheck: '2024-04-15' }
      ]
    });
  }

  getShariahCompliance(): Observable<any> {
    return of({
      overallScore: 95,
      breakdown: {
        financialProducts: 98,
        investmentCriteria: 92,
        ethicalStandards: 96
      },
      boardMembers: [
        {
          name: 'Sheikh Abdullah Al-Rashid',
          role: 'Chairman',
          expertise: 'Islamic Finance',
          experience: '15 years',
          certifications: ['Shariah Advisor', 'Islamic Banking']
        },
        {
          name: 'Dr. Mohammed Al-Hassan',
          role: 'Member',
          expertise: 'Shariah Law',
          experience: '12 years',
          certifications: ['Shariah Scholar', 'Islamic Economics']
        },
        {
          name: 'Sheikh Omar Al-Zahra',
          role: 'Member',
          expertise: 'Islamic Economics',
          experience: '10 years',
          certifications: ['Islamic Finance', 'Shariah Compliance']
        }
      ],
      recentDecisions: [
        {
          date: '2024-04-10',
          decision: 'Approved ESG-linked Sukuk structure',
          compliance: 'Fully Compliant',
          impact: 'High'
        },
        {
          date: '2024-03-25',
          decision: 'Reviewed investment portfolio for Shariah compliance',
          compliance: 'Fully Compliant',
          impact: 'Medium'
        }
      ]
    });
  }

  getCompliance(role: string): Observable<any> {
    return of({ role, compliance: 'Compliant', score: 98 });
  }

  getKpis(role: string): Observable<any[]> {
    return of([]);
  }

  getProjects(role: string): Observable<any[]> {
    return of([]);
  }

  getTeam(role: string): Observable<any[]> {
    return of([]);
  }

  getRecentCollab(role: string): Observable<string> {
    return of('No recent collaboration');
  }

  getStakeholderEngagement(): Observable<any[]> {
    return of([]);
  }

  getNews(): Observable<any[]> {
    return of([]);
  }
}