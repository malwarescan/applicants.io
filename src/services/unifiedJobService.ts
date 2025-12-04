/**
 * Unified Job Service
 * Combines all job sources: EnhancedJobService, jobs.ts, seoJobService, and external jobs
 * This ensures blog and enhanced-jobs use the same data source
 */

import { EnhancedJob } from '../types/job';
import { EnhancedJobService } from './enhancedJobService';
import { jobs } from '../data/jobs';
import { seoJobService } from './seoJobService';
import { jobIntegrationService } from './jobIntegrationService';

/**
 * Convert legacy Job to EnhancedJob
 */
function convertToEnhancedJob(job: typeof jobs[0]): EnhancedJob {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    industry: job.industry,
    postedDate: job.postedDate,
    description: job.description,
    contactEmail: job.contactEmail,
    contactPhone: job.contactPhone,
    compensation: job.compensation,
    isActive: true
  };
}

/**
 * Get all jobs from all sources
 */
export function getAllUnifiedJobs(): EnhancedJob[] {
  // Get jobs from EnhancedJobService (localStorage)
  const enhancedJobs = EnhancedJobService.getAllJobs();
  
  // Get legacy jobs and convert them
  const legacyJobs = jobs.map(convertToEnhancedJob);
  
  // Get SEO jobs
  const seoJobs = seoJobService.getEnhancedJobs();
  
  // Get external jobs from localStorage (if available)
  let externalJobs: EnhancedJob[] = [];
  try {
    const externalJobsData = localStorage.getItem('external_jobs');
    if (externalJobsData) {
      externalJobs = JSON.parse(externalJobsData);
    }
  } catch (e) {
    // Ignore errors
  }
  
  // Combine all jobs, removing duplicates by ID
  const allJobsMap = new Map<string, EnhancedJob>();
  
  // Add enhanced jobs first (they take priority)
  enhancedJobs.forEach(job => {
    allJobsMap.set(job.id, job);
  });
  
  // Add legacy jobs
  legacyJobs.forEach(job => {
    if (!allJobsMap.has(job.id)) {
      allJobsMap.set(job.id, job);
    }
  });
  
  // Add SEO jobs
  seoJobs.forEach(job => {
    if (!allJobsMap.has(job.id)) {
      allJobsMap.set(job.id, job);
    }
  });
  
  // Add external jobs
  externalJobs.forEach(job => {
    if (!allJobsMap.has(job.id)) {
      allJobsMap.set(job.id, job);
    }
  });
  
  return Array.from(allJobsMap.values());
}

/**
 * Get jobs by role/title
 */
export function getJobsByRole(role: string): EnhancedJob[] {
  const allJobs = getAllUnifiedJobs();
  const roleLower = role.toLowerCase();
  
  return allJobs.filter(job => 
    job.title.toLowerCase().includes(roleLower) ||
    job.title.toLowerCase() === roleLower
  );
}

/**
 * Get jobs by industry
 */
export function getJobsByIndustry(industry: string): EnhancedJob[] {
  const allJobs = getAllUnifiedJobs();
  const industryLower = industry.toLowerCase();
  
  return allJobs.filter(job => 
    job.industry.toLowerCase() === industryLower
  );
}

/**
 * Search jobs with filters
 */
export function searchUnifiedJobs(params: {
  search?: string;
  role?: string;
  industry?: string;
  location?: string;
  remote?: boolean;
}): EnhancedJob[] {
  let results = getAllUnifiedJobs();
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    results = results.filter(job =>
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (params.role) {
    results = getJobsByRole(params.role);
  }
  
  if (params.industry) {
    results = results.filter(job => 
      job.industry.toLowerCase() === params.industry!.toLowerCase()
    );
  }
  
  if (params.location) {
    results = results.filter(job =>
      job.location.toLowerCase().includes(params.location!.toLowerCase())
    );
  }
  
  if (params.remote !== undefined) {
    results = results.filter(job => job.remote === params.remote);
  }
  
  return results;
}

/**
 * Get jobs related to a blog post
 */
export function getRelatedJobsForBlogPost(role?: string, industry?: string): EnhancedJob[] {
  const allJobs = getAllUnifiedJobs();
  let related: EnhancedJob[] = [];
  
  if (role) {
    const roleJobs = getJobsByRole(role);
    related = [...related, ...roleJobs];
  }
  
  if (industry) {
    const industryJobs = getJobsByIndustry(industry);
    // Avoid duplicates
    const existingIds = new Set(related.map(j => j.id));
    industryJobs.forEach(job => {
      if (!existingIds.has(job.id)) {
        related.push(job);
      }
    });
  }
  
  // Return up to 6 related jobs
  return related.slice(0, 6);
}

