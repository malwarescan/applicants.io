import { EnhancedJob, JobFormData, ApplicationData, EmploymentType } from '../types/job';

// Simple localStorage-based storage (can be replaced with API later)
const STORAGE_KEY = 'enhanced_jobs';
const APPLICATIONS_KEY = 'job_applications';

export class EnhancedJobService {
  // Get all active jobs
  static getAllJobs(): EnhancedJob[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with existing jobs data
      return this.initializeWithExistingJobs();
    }
    const jobs = JSON.parse(stored);
    return jobs.filter((job: EnhancedJob) => job.isActive !== false);
  }

  // Get job by ID
  static getJobById(id: string): EnhancedJob | null {
    const jobs = this.getAllJobs();
    return jobs.find(job => job.id === id) || null;
  }

  // Save new job
  static saveJob(formData: JobFormData): EnhancedJob {
    const jobs = this.getAllJobs();
    
    // Convert form data to enhanced job
    const newJob: EnhancedJob = {
      id: this.generateId(),
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      industry: formData.industry,
      postedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      description: formData.description.trim(),
      contactEmail: formData.contactEmail.trim(),
      contactPhone: formData.contactPhone?.trim(),
      compensation: formData.compensation?.trim(),
      
      // Enhanced fields
      remote: formData.remote,
      employmentType: formData.employmentType,
      responsibilities: formData.responsibilities ? 
        formData.responsibilities.split('\n').filter(Boolean) : [],
      requirements: formData.requirements ? 
        formData.requirements.split('\n').filter(Boolean) : [],
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      currency: formData.currency || 'USD',
      applyUrl: formData.applyUrl?.trim(),
      applyEmail: formData.applyEmail?.trim(),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    jobs.unshift(newJob);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    return newJob;
  }

  // Search and filter jobs
  static searchJobs(params: {
    search?: string;
    employmentType?: EmploymentType;
    location?: string;
    remote?: boolean;
    industry?: string;
  }): EnhancedJob[] {
    let jobs = this.getAllJobs();

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    if (params.employmentType) {
      jobs = jobs.filter(job => job.employmentType === params.employmentType);
    }

    if (params.location) {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    if (params.remote !== undefined) {
      jobs = jobs.filter(job => job.remote === params.remote);
    }

    if (params.industry) {
      jobs = jobs.filter(job => job.industry === params.industry);
    }

    return jobs;
  }

  // Submit application
  static submitApplication(application: ApplicationData): void {
    const applications = this.getApplications();
    const newApplication = {
      ...application,
      id: this.generateId(),
      submittedAt: new Date().toISOString()
    };
    
    applications.unshift(newApplication);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }

  // Get applications for a specific job
  static getApplicationsForJob(jobId: string) {
    const applications = this.getApplications();
    return applications.filter(app => app.jobId === jobId);
  }

  // Get all applications (for admin purposes)
  static getApplications() {
    const stored = localStorage.getItem(APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Initialize with existing jobs data
  private static initializeWithExistingJobs(): EnhancedJob[] {
    // Create some sample jobs for testing
    const sampleJobs: EnhancedJob[] = [
      {
        id: 'sample-1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        industry: 'Technology',
        postedDate: 'December 18, 2024',
        description: `We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building beautiful, responsive user interfaces using React, TypeScript, and modern web technologies.

You'll work closely with our design and backend teams to create exceptional user experiences that delight our customers and drive business growth.`,
        contactEmail: 'careers@techcorp.com',
        contactPhone: '(555) 123-4567',
        compensation: '$120,000 - $160,000 per year + equity + benefits',
        remote: true,
        employmentType: 'full-time',
        responsibilities: [
          'Develop and maintain responsive web applications using React and TypeScript',
          'Collaborate with designers to implement pixel-perfect UI components',
          'Optimize applications for maximum speed and scalability',
          'Write clean, maintainable, and well-tested code'
        ],
        requirements: [
          '5+ years of experience with React and TypeScript',
          'Strong understanding of modern JavaScript (ES6+)',
          'Experience with state management libraries (Redux, Zustand, etc.)',
          'Proficiency with CSS preprocessors and responsive design'
        ],
        salaryMin: 120000,
        salaryMax: 160000,
        currency: 'USD',
        applyUrl: 'https://techcorp.com/careers/frontend-dev',
        applyEmail: 'jobs@techcorp.com',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-2',
        title: 'Marketing Manager',
        company: 'GrowthBrand Inc.',
        location: 'New York, NY',
        industry: 'Marketing',
        postedDate: 'December 17, 2024',
        description: `GrowthBrand is seeking a Marketing Manager to lead our digital marketing efforts and drive customer acquisition. You'll develop and execute marketing strategies that increase brand awareness and generate qualified leads.

This role offers the opportunity to work with a dynamic team in a fast-paced environment where your ideas can make a real impact on our growth trajectory.`,
        contactEmail: 'hr@growthbrand.com',
        compensation: '$80,000 - $100,000 per year + performance bonus',
        remote: false,
        employmentType: 'full-time',
        responsibilities: [
          'Develop and execute comprehensive digital marketing strategies',
          'Manage social media campaigns across multiple platforms',
          'Create compelling content for blogs, emails, and social media',
          'Analyze campaign performance and optimize for better results'
        ],
        requirements: [
          '3+ years of experience in digital marketing',
          'Proficiency with marketing automation tools (HubSpot, Marketo, etc.)',
          'Strong analytical skills and data-driven mindset',
          'Excellent written and verbal communication skills'
        ],
        salaryMin: 80000,
        salaryMax: 100000,
        currency: 'USD',
        applyUrl: 'https://growthbrand.com/careers/marketing-manager',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    // Save sample jobs to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleJobs));
    return sampleJobs;
  }

  // Generate unique ID
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
