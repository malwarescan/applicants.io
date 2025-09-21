import { EnhancedJob } from '../types/job';

// SEO Job data from CSV import
export interface SEOJobData {
  job_type: string;
  job_title: string;
  search_volume: 'high' | 'medium' | 'low';
  competition_level: 'high' | 'low';
  url_slug: string;
  seo_title: string;
  meta_description: string;
}

// CSV data converted to TypeScript
const seoJobsData: SEOJobData[] = [
  {
    job_type: 'sales',
    job_title: 'Sales Associate',
    search_volume: 'high',
    competition_level: 'high',
    url_slug: 'sales-associate-jobs',
    seo_title: 'Sales Associate Jobs | AI-Powered Hiring | Applicants.io',
    meta_description: 'Find Sales Associate jobs with AI-powered matching. Applicants.io showcases your strengths to get you hired fast. Apply today.'
  },
  {
    job_type: 'customer-service',
    job_title: 'Customer Service Representative',
    search_volume: 'high',
    competition_level: 'high',
    url_slug: 'customer-service-representative-jobs',
    seo_title: 'Customer Service Jobs | Remote & Local | Applicants.io',
    meta_description: 'Apply for Customer Service Representative jobs. AI-powered platform matches you with employers who value your skills. Start your application now.'
  },
  {
    job_type: 'IT',
    job_title: 'Software Developer',
    search_volume: 'high',
    competition_level: 'high',
    url_slug: 'software-developer-jobs',
    seo_title: 'Software Developer Jobs | AI-Matched Opportunities | Applicants.io',
    meta_description: 'Discover Software Developer positions with AI-powered job matching. Showcase your coding skills to top employers. Apply today.'
  },
  {
    job_type: 'healthcare',
    job_title: 'Registered Nurse',
    search_volume: 'high',
    competition_level: 'high',
    url_slug: 'registered-nurse-jobs',
    seo_title: 'Registered Nurse Jobs | Healthcare Careers | Applicants.io',
    meta_description: 'Find Registered Nurse positions with AI-powered matching. Applicants.io helps nurses connect with healthcare employers. Apply now.'
  },
  {
    job_type: 'retail',
    job_title: 'Retail Sales Associate',
    search_volume: 'high',
    competition_level: 'medium',
    url_slug: 'retail-sales-associate-jobs',
    seo_title: 'Retail Sales Jobs | Flexible Hours | Applicants.io',
    meta_description: 'Explore Retail Sales Associate opportunities with AI-powered job matching. Flexible schedules available. Apply today.'
  },
  {
    job_type: 'admin',
    job_title: 'Administrative Assistant',
    search_volume: 'high',
    competition_level: 'medium',
    url_slug: 'administrative-assistant-jobs',
    seo_title: 'Admin Assistant Jobs | Office Support Roles | Applicants.io',
    meta_description: 'Find Administrative Assistant positions with AI-powered matching. Office support roles with growth opportunities. Apply now.'
  },
  {
    job_type: 'drivers',
    job_title: 'Delivery Driver',
    search_volume: 'high',
    competition_level: 'medium',
    url_slug: 'delivery-driver-jobs',
    seo_title: 'Delivery Driver Jobs | Flexible Schedule | Applicants.io',
    meta_description: 'Apply for Delivery Driver positions with flexible schedules. AI-powered matching connects you with local employers. Start today.'
  },
  {
    job_type: 'healthcare',
    job_title: 'Medical Assistant',
    search_volume: 'high',
    competition_level: 'medium',
    url_slug: 'medical-assistant-jobs',
    seo_title: 'Medical Assistant Jobs | Healthcare Support | Applicants.io',
    meta_description: 'Discover Medical Assistant careers with AI-powered job matching. Healthcare support roles with training opportunities. Apply now.'
  },
  {
    job_type: 'IT',
    job_title: 'IT Support Specialist',
    search_volume: 'high',
    competition_level: 'medium',
    url_slug: 'it-support-specialist-jobs',
    seo_title: 'IT Support Jobs | Tech Careers | Applicants.io',
    meta_description: 'Find IT Support Specialist positions with AI-powered matching. Tech careers with growth potential. Apply today.'
  },
  {
    job_type: 'sales',
    job_title: 'Sales Manager',
    search_volume: 'high',
    competition_level: 'high',
    url_slug: 'sales-manager-jobs',
    seo_title: 'Sales Manager Jobs | Leadership Roles | Applicants.io',
    meta_description: 'Apply for Sales Manager positions with AI-powered matching. Leadership opportunities with competitive packages. Apply now.'
  },
  {
    job_type: 'internship',
    job_title: 'Marketing Intern',
    search_volume: 'low',
    competition_level: 'low',
    url_slug: 'marketing-internship-jobs',
    seo_title: 'Marketing Intern Jobs | Entry-Level Experience | Applicants.io',
    meta_description: 'Start your marketing career with Marketing Intern positions. AI-powered matching for entry-level opportunities. Apply today.'
  },
  {
    job_type: 'entry-level',
    job_title: 'Data Entry Clerk',
    search_volume: 'medium',
    competition_level: 'low',
    url_slug: 'data-entry-clerk-jobs',
    seo_title: 'Data Entry Jobs | Remote & Office | Applicants.io',
    meta_description: 'Find Data Entry Clerk positions with flexible work options. AI-powered matching for entry-level candidates. Apply now.'
  },
  {
    job_type: 'bilingual',
    job_title: 'Customer Service Rep - Bilingual',
    search_volume: 'medium',
    competition_level: 'low',
    url_slug: 'bilingual-customer-service-jobs',
    seo_title: 'Bilingual Customer Service Jobs | Spanish/English | Applicants.io',
    meta_description: 'Apply for Bilingual Customer Service positions. Spanish/English speakers needed. AI-powered matching connects you with employers. Apply today.'
  },
  {
    job_type: 'seasonal',
    job_title: 'Seasonal Retail Associate',
    search_volume: 'medium',
    competition_level: 'low',
    url_slug: 'seasonal-retail-jobs',
    seo_title: 'Seasonal Retail Jobs | Holiday & Summer | Applicants.io',
    meta_description: 'Find Seasonal Retail Associate positions for holidays and summer. Flexible temporary work with AI-powered matching. Apply today.'
  },
  {
    job_type: 'trades',
    job_title: 'Maintenance Technician',
    search_volume: 'medium',
    competition_level: 'low',
    url_slug: 'maintenance-technician-jobs',
    seo_title: 'Maintenance Tech Jobs | Skilled Trades | Applicants.io',
    meta_description: 'Discover Maintenance Technician positions with competitive pay. Skilled trades opportunities with AI-powered matching. Apply now.'
  },
  {
    job_type: 'remote',
    job_title: 'Virtual Assistant',
    search_volume: 'medium',
    competition_level: 'low',
    url_slug: 'virtual-assistant-jobs',
    seo_title: 'Remote Virtual Assistant Jobs | Work from Home | Applicants.io',
    meta_description: 'Apply for Virtual Assistant positions and work from home. AI-powered matching for remote opportunities. Start today.'
  },
  {
    job_type: 'entry-level',
    job_title: 'Receptionist',
    search_volume: 'medium',
    competition_level: 'low',
    url_slug: 'receptionist-jobs',
    seo_title: 'Receptionist Jobs | Front Desk Positions | Applicants.io',
    meta_description: 'Find Receptionist positions with AI-powered matching. Front desk roles with customer service opportunities. Apply now.'
  },
  {
    job_type: 'local',
    job_title: 'Local Restaurant Server',
    search_volume: 'low',
    competition_level: 'low',
    url_slug: 'restaurant-server-jobs',
    seo_title: 'Restaurant Server Jobs | Local Dining | Applicants.io',
    meta_description: 'Apply for Local Restaurant Server positions. Part-time and full-time opportunities with tips. AI-powered matching available. Apply today.'
  },
  {
    job_type: 'trades',
    job_title: 'Plumber Assistant',
    search_volume: 'low',
    competition_level: 'low',
    url_slug: 'plumber-assistant-jobs',
    seo_title: 'Plumber Assistant Jobs | Trade Apprenticeship | Applicants.io',
    meta_description: 'Start your plumbing career with Plumber Assistant positions. Trade apprenticeship opportunities with AI-powered matching. Apply now.'
  },
  {
    job_type: 'remote',
    job_title: 'Online Chat Support',
    search_volume: 'low',
    competition_level: 'low',
    url_slug: 'online-chat-support-jobs',
    seo_title: 'Online Chat Support Jobs | Remote Work | Applicants.io',
    meta_description: 'Work from home as Online Chat Support representative. AI-powered matching for remote customer service roles. Apply today.'
  }
];

// Convert SEO job data to EnhancedJob format for integration
export const convertSEOJobToEnhancedJob = (seoJob: SEOJobData, index: number): EnhancedJob => {
  // Generate sample locations and other required fields
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'];
  const companies = ['TechCorp', 'Healthcare Plus', 'Retail Solutions', 'Service First', 'Innovation Labs', 'Growth Partners', 'Success Systems', 'Future Works', 'Prime Solutions', 'Elite Services'];
  
  return {
    id: `seo-job-${index + 1}`,
    title: seoJob.job_title,
    company: companies[index % companies.length],
    location: locations[index % locations.length],
    remote: seoJob.job_type === 'remote',
    employmentType: 'full-time',
    description: `We're looking for a ${seoJob.job_title} to join our growing team. This position offers excellent growth opportunities and competitive benefits.`,
    responsibilities: [
      'Execute daily tasks with attention to detail',
      'Collaborate with team members effectively',
      'Maintain high quality standards',
      'Support company objectives and goals'
    ],
    requirements: [
      'Relevant experience preferred',
      'Strong communication skills',
      'Ability to work independently',
      'Commitment to excellence'
    ],
    salaryMin: 35000 + (index * 2000),
    salaryMax: 55000 + (index * 3000),
    currency: 'USD',
    contactEmail: 'jobs@applicants.io',
    postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    industry: seoJob.job_type,
    // SEO-specific fields
    urlSlug: seoJob.url_slug,
    seoTitle: seoJob.seo_title,
    metaDescription: seoJob.meta_description,
    searchVolume: seoJob.search_volume,
    competitionLevel: seoJob.competition_level
  };
};

// Enhanced job type with SEO fields
export interface SEOEnhancedJob extends EnhancedJob {
  urlSlug: string;
  seoTitle: string;
  metaDescription: string;
  searchVolume: 'high' | 'medium' | 'low';
  competitionLevel: 'high' | 'low';
}

// Service functions
export const seoJobService = {
  // Get all SEO job data
  getAllSEOJobs: (): SEOJobData[] => {
    return seoJobsData;
  },

  // Get jobs by type/category
  getJobsByType: (jobType: string): SEOJobData[] => {
    return seoJobsData.filter(job => job.job_type === jobType);
  },

  // Get high-volume jobs
  getHighVolumeJobs: (): SEOJobData[] => {
    return seoJobsData.filter(job => job.search_volume === 'high');
  },

  // Get low-competition jobs
  getLowCompetitionJobs: (): SEOJobData[] => {
    return seoJobsData.filter(job => job.competition_level === 'low');
  },

  // Get job by slug
  getJobBySlug: (slug: string): SEOJobData | undefined => {
    return seoJobsData.find(job => job.url_slug === slug);
  },

  // Convert to enhanced jobs for integration
  getEnhancedJobs: (): SEOEnhancedJob[] => {
    return seoJobsData.map((seoJob, index) => convertSEOJobToEnhancedJob(seoJob, index) as SEOEnhancedJob);
  },

  // Get unique job types for navigation
  getJobTypes: (): string[] => {
    const types = [...new Set(seoJobsData.map(job => job.job_type))];
    return types.sort();
  },

  // Get job type display name
  getJobTypeDisplayName: (jobType: string): string => {
    const displayNames: { [key: string]: string } = {
      'sales': 'Sales',
      'customer-service': 'Customer Service',
      'IT': 'Information Technology',
      'healthcare': 'Healthcare',
      'retail': 'Retail',
      'admin': 'Administrative',
      'drivers': 'Transportation',
      'internship': 'Internships',
      'entry-level': 'Entry Level',
      'bilingual': 'Bilingual',
      'seasonal': 'Seasonal',
      'trades': 'Skilled Trades',
      'remote': 'Remote Work',
      'local': 'Local Jobs'
    };
    return displayNames[jobType] || jobType.charAt(0).toUpperCase() + jobType.slice(1);
  }
};

export default seoJobService;
