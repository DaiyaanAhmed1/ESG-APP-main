import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalTranslationService } from '../services/global-translation.service';
import { GlobalLanguageToggleComponent } from '../components/global-language-toggle/global-language-toggle.component';

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  views: number;
  helpful: number;
}

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GlobalLanguageToggleComponent],
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.css']
})
export class HelpSupportComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  darkMode = false;
  
  // Search and filter properties
  searchTerm = '';
  selectedCategory = '';
  selectedPriority = '';
  selectedStatus = '';
  
  // Support tickets
  tickets: SupportTicket[] = [
    {
      id: 1,
      title: 'Campaign Analytics Dashboard Not Loading',
      description: 'The campaign analytics dashboard is showing a blank screen when I try to access it. This started happening after the latest update.',
      category: 'technical',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Lead Import Feature Not Working',
      description: 'When I try to import leads from CSV, the system shows an error message. The file format is correct.',
      category: 'bug',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Tech Support',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      title: 'Request for New Reporting Feature',
      description: 'We need a new report that shows ESG campaign performance by region. This would help with our regional marketing strategy.',
      category: 'feature',
      priority: 'low',
      status: 'open',
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-13T16:45:00Z'
    },
    {
      id: 4,
      title: 'Billing Query - Invoice Discrepancy',
      description: 'There seems to be a discrepancy in our latest invoice. The charges don\'t match our usage.',
      category: 'billing',
      priority: 'medium',
      status: 'resolved',
      assignedTo: 'Billing Team',
      createdAt: '2024-01-12T11:10:00Z',
      updatedAt: '2024-01-14T15:30:00Z'
    },
    {
      id: 5,
      title: 'Team Management Dashboard Access Issue',
      description: 'I can\'t access the team management section. Getting a permission denied error.',
      category: 'technical',
      priority: 'urgent',
      status: 'open',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    }
  ];

  // FAQs
  faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I create a new ESG campaign?',
      answer: 'To create a new ESG campaign, navigate to the Campaign section in your dashboard. Click "Create Campaign" and fill in the required details including campaign name, target audience, and ESG goals.',
      category: 'Campaign Management',
      helpful: 45,
      notHelpful: 2
    },
    {
      id: 2,
      question: 'What are the different lead status options?',
      answer: 'Lead status options include: New, Contacted, Qualified, Proposal Sent, Negotiation, and Closed Won/Lost. You can update these statuses from the Leads dashboard.',
      category: 'Lead Management',
      helpful: 32,
      notHelpful: 1
    },
    {
      id: 3,
      question: 'How can I export campaign reports?',
      answer: 'You can export campaign reports by going to Report & Analytics section. Select your desired report type and click the export button. Reports can be downloaded in PDF, Excel, or PowerPoint format.',
      category: 'Reporting',
      helpful: 28,
      notHelpful: 3
    },
    {
      id: 4,
      question: 'How do I assign team members to campaigns?',
      answer: 'In the Team Management section, you can assign team members to campaigns by selecting the campaign and clicking "Assign Members". You can also set roles and responsibilities for each team member.',
      category: 'Team Management',
      helpful: 38,
      notHelpful: 1
    },
    {
      id: 5,
      question: 'What ESG metrics are tracked?',
      answer: 'The system tracks various ESG metrics including carbon footprint reduction, social impact scores, governance compliance, sustainability mentions, and stakeholder engagement levels.',
      category: 'ESG Metrics',
      helpful: 52,
      notHelpful: 0
    }
  ];

  // Knowledge articles
  knowledgeArticles: KnowledgeArticle[] = [
    {
      id: 1,
      title: 'Complete Guide to ESG Campaign Creation',
      content: 'This comprehensive guide covers everything you need to know about creating effective ESG campaigns...',
      category: 'Campaign Management',
      tags: ['ESG', 'Campaign', 'Guide', 'Best Practices'],
      author: 'Marketing Team',
      createdAt: '2024-01-10T10:00:00Z',
      views: 1250,
      helpful: 89
    },
    {
      id: 2,
      title: 'Understanding ESG Metrics and KPIs',
      content: 'Learn about the key ESG metrics and KPIs that matter for your marketing campaigns...',
      category: 'Analytics',
      tags: ['ESG', 'Metrics', 'KPIs', 'Analytics'],
      author: 'Analytics Team',
      createdAt: '2024-01-08T14:30:00Z',
      views: 980,
      helpful: 67
    },
    {
      id: 3,
      title: 'Team Management Best Practices',
      content: 'Discover the best practices for managing your marketing team effectively...',
      category: 'Team Management',
      tags: ['Team', 'Management', 'Leadership', 'Best Practices'],
      author: 'HR Team',
      createdAt: '2024-01-05T09:15:00Z',
      views: 756,
      helpful: 45
    }
  ];

  // Filtered data
  filteredTickets: SupportTicket[] = [...this.tickets];
  filteredFAQs: FAQ[] = [...this.faqs];
  filteredArticles: KnowledgeArticle[] = [...this.knowledgeArticles];

  // Translation properties
  currentLanguage = 'en';
  private translationSubscription?: Subscription;

  constructor(
    private router: Router,
    private translationService: GlobalTranslationService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    

    this.translationSubscription = this.translationService.getLanguageChange$().subscribe((lang: string) => {
      this.currentLanguage = lang;
      
      console.log('Help Support language changed to:', lang);
    });

    // Check if translations are loaded
    setTimeout(() => {
      if (!this.translationService.isTranslationsLoaded()) {
        console.warn('Help Support translations not loaded yet');
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  getCategoryTranslation(category: string): string {
    const categoryKey = category.toUpperCase();
    return this.translationService.translate(`HELP_SUPPORT.${categoryKey}`);
  }

  getPriorityTranslation(priority: string): string {
    const priorityKey = priority.toUpperCase();
    return this.translationService.translate(`HELP_SUPPORT.${priorityKey}`);
  }

  getStatusTranslation(status: string): string {
    const statusKey = status.toUpperCase().replace('-', '_');
    return this.translationService.translate(`HELP_SUPPORT.${statusKey}`);
  }

  // Methods
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) { localStorage.removeItem('currentUser'); };
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Ticket methods
  createTicket() {
    alert('Create Ticket functionality will be implemented here!');
  }

  updateTicket(ticket: SupportTicket) {
    alert(`Updating ticket: ${ticket.title}`);
  }

  deleteTicket(ticket: SupportTicket) {
    if (confirm(`Are you sure you want to delete ticket: ${ticket.title}?`)) {
      this.tickets = this.tickets.filter((t: SupportTicket): boolean => t.id !== ticket.id);
      this.filterTickets();
    }
  }

  filterTickets() {
    this.filteredTickets = this.tickets.filter((ticket: SupportTicket): boolean => {
      const searchTermLower = this.searchTerm.toLowerCase();
      const matchesSearch = ticket.title.toLowerCase().includes(searchTermLower) ||
                          ticket.description.toLowerCase().includes(searchTermLower);
      const matchesCategory = !this.selectedCategory || ticket.category === this.selectedCategory;
      const matchesPriority = !this.selectedPriority || ticket.priority === this.selectedPriority;
      const matchesStatus = !this.selectedStatus || ticket.status === this.selectedStatus;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }

  // FAQ methods
  markFAQHelpful(faq: FAQ) {
    faq.helpful++;
  }

  markFAQNotHelpful(faq: FAQ) {
    faq.notHelpful++;
  }

  // Article methods
  viewArticle(article: KnowledgeArticle) {
    alert(`Viewing article: ${article.title}`);
  }

  markArticleHelpful(article: KnowledgeArticle) {
    article.helpful++;
  }

  // Search methods
  searchContent() {
    this.filterTickets();
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredFAQs = this.faqs.filter((faq: FAQ): boolean => 
      faq.question.toLowerCase().includes(searchTermLower) ||
      faq.answer.toLowerCase().includes(searchTermLower)
    );
    this.filteredArticles = this.knowledgeArticles.filter((article: KnowledgeArticle): boolean =>
      article.title.toLowerCase().includes(searchTermLower) ||
      article.content.toLowerCase().includes(searchTermLower)
    );
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedPriority = '';
    this.selectedStatus = '';
    this.filterTickets();
    this.filteredFAQs = [...this.faqs];
    this.filteredArticles = [...this.knowledgeArticles];
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'open': return '#007bff';
      case 'in-progress': return '#ffc107';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'technical': return '🔧';
      case 'billing': return '💰';
      case 'feature': return '✨';
      case 'bug': return '🐛';
      case 'general': return '📋';
      default: return '📋';
    }
  }

  // Getter for open tickets count
  get openTicketsCount(): number {
    return this.tickets.filter((t: SupportTicket): boolean => t.status === 'open').length;
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