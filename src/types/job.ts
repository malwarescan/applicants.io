export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';

// Enhanced Job interface that extends your existing one
export interface EnhancedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  postedDate: string;
  compensation?: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  
  // New enhanced fields
  remote?: boolean;
  employmentType?: EmploymentType;
  responsibilities?: string[];
  requirements?: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  applyUrl?: string;
  applyEmail?: string;
  isActive?: boolean;
  createdAt?: string;
  
  // SEO fields (optional for backward compatibility)
  urlSlug?: string;
  seoTitle?: string;
  metaDescription?: string;
  searchVolume?: 'high' | 'medium' | 'low';
  competitionLevel?: 'high' | 'low';
}

// Form data for job posting
export interface JobFormData {
  title: string;
  company: string;
  location: string;
  industry: string;
  remote: boolean;
  employmentType: EmploymentType;
  description: string;
  responsibilities: string;
  requirements: string;
  compensation?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  contactEmail: string;
  contactPhone?: string;
  applyUrl?: string;
  applyEmail?: string;
}

// Application form data
export interface ApplicationData {
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  coverLetter?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  experience?: string;
  availability?: string;
}
