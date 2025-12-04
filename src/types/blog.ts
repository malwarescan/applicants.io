/**
 * Blog Content Taxonomy Types
 * Implements APPLICANTS_BLOG_SEO_CONTENT_KERNEL
 */

export type ContentPillar = 
  | 'hiring-guides'
  | 'interview-questions'
  | 'hr-operations'
  | 'compliance'
  | 'compensation';

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  // Core identification
  id: string;
  slug: string;
  pillar: ContentPillar;
  status: ContentStatus;
  
  // Content metadata
  title: string;
  metaDescription: string;
  publishedDate: string;
  lastUpdated: string;
  author: string;
  
  // Role/Industry mapping
  role?: string;
  industry?: string;
  seniority?: 'entry-level' | 'mid-level' | 'senior' | 'executive';
  location?: string;
  
  // Content structure (mandatory per kernel)
  executiveSummary: string;
  keyInsights: string[];
  primaryAnswer: string;
  stepByStepBreakdown: string[];
  content: string; // Full article content
  
  // Salary/Compensation data
  salaryData?: {
    min: number;
    max: number;
    median: number;
    currency: string;
    location?: string;
  };
  
  // Role-specific data
  responsibilities?: string[];
  requiredSkills?: string[];
  certifications?: string[];
  redFlags?: string[];
  sampleJobDescription?: string;
  
  // FAQ data (NewFAQ integration)
  faqs: FAQItem[];
  
  // Internal linking
  relatedRoles?: string[];
  relatedTemplates?: string[];
  parentCategory?: string;
  
  // SEO targeting
  targetKeywords: string[];
  longTailKeywords: string[];
  
  // Schema entities
  entities?: {
    occupation?: string;
    industry?: string;
    location?: string;
  };
  
  // Word count tracking
  wordCount: number;
  
  // Canonical URL
  canonical: string;
  
  // Content audience (for 60/40 split tracking)
  contentAudience?: 'job-seeker' | 'employer';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  role?: string;
  industry?: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
  pillar: ContentPillar;
  description: string;
  articleCount: number;
}

export interface BlogFeedItem {
  id: string;
  title: string;
  url: string;
  summary: string;
  key_points: string[];
  role?: string;
  industry?: string;
  entities?: Record<string, string>;
  faq: FAQItem[];
  canonical: string;
  last_updated: string;
  pillar: ContentPillar;
}

export interface BlogSitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

