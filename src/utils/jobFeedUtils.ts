/**
 * Job Feed Utilities
 * Generates NDJSON feeds for jobs (connected to unified job service)
 */

import { EnhancedJob } from '../types/job';
import { getAllUnifiedJobs, searchUnifiedJobs } from '../services/unifiedJobService';

const BASE_URL = 'https://applicants.io';

export interface JobFeedItem {
  id: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  url: string;
  description: string;
  compensation?: string;
  employment_type?: string;
  remote?: boolean;
  posted_date: string;
  canonical: string;
  last_updated: string;
}

/**
 * Convert job to feed item
 */
export function jobToFeedItem(job: EnhancedJob): JobFeedItem {
  const jobUrl = `/enhanced-jobs/${job.id}`;
  
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    industry: job.industry,
    url: `${BASE_URL}${jobUrl}`,
    description: job.description,
    compensation: job.compensation,
    employment_type: job.employmentType,
    remote: job.remote,
    posted_date: job.postedDate,
    canonical: `${BASE_URL}${jobUrl}`,
    last_updated: job.lastUpdated || job.createdAt || new Date().toISOString()
  };
}

/**
 * Generate NDJSON feed for all jobs
 */
export function generateJobsFeed(): string {
  const jobs = getAllUnifiedJobs();
  return jobs
    .filter(job => job.isActive !== false)
    .map(job => JSON.stringify(jobToFeedItem(job)))
    .join('\n');
}

/**
 * Generate feed for jobs by industry
 */
export function generateIndustryJobsFeed(industry: string): string {
  const jobs = searchUnifiedJobs({ industry });
  return jobs
    .filter(job => job.isActive !== false)
    .map(job => JSON.stringify(jobToFeedItem(job)))
    .join('\n');
}

/**
 * Generate feed for jobs by role
 */
export function generateRoleJobsFeed(role: string): string {
  const jobs = searchUnifiedJobs({ role });
  return jobs
    .filter(job => job.isActive !== false)
    .map(job => JSON.stringify(jobToFeedItem(job)))
    .join('\n');
}

/**
 * Generate feed for remote jobs
 */
export function generateRemoteJobsFeed(): string {
  const jobs = searchUnifiedJobs({ remote: true });
  return jobs
    .filter(job => job.isActive !== false)
    .map(job => JSON.stringify(jobToFeedItem(job)))
    .join('\n');
}

