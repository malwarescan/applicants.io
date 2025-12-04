/**
 * Content Audience Utilities
 * Tracks and validates 60/40 job-seeker/employer content split
 * Implements APPLICANTS_CONTENT_AUTHORITY_KERNEL blog system directives
 */

import { BlogPost } from '../types/blog';
import { getPublishedPosts } from '../data/blogPosts';

export interface ContentAudienceStats {
  total: number;
  jobSeeker: number;
  employer: number;
  jobSeekerPercentage: number;
  employerPercentage: number;
  targetMet: boolean;
}

/**
 * Get content audience statistics
 */
export function getContentAudienceStats(): ContentAudienceStats {
  const allPosts = getPublishedPosts();
  const total = allPosts.length;
  
  const jobSeeker = allPosts.filter(p => p.contentAudience === 'job-seeker').length;
  const employer = allPosts.filter(p => p.contentAudience === 'employer').length;
  
  const jobSeekerPercentage = total > 0 ? (jobSeeker / total) * 100 : 0;
  const employerPercentage = total > 0 ? (employer / total) * 100 : 0;
  
  // Target: 60% job-seeker, 40% employer (with 5% tolerance)
  const targetMet = jobSeekerPercentage >= 55 && jobSeekerPercentage <= 65 && 
                    employerPercentage >= 35 && employerPercentage <= 45;
  
  return {
    total,
    jobSeeker,
    employer,
    jobSeekerPercentage: Math.round(jobSeekerPercentage * 10) / 10,
    employerPercentage: Math.round(employerPercentage * 10) / 10,
    targetMet
  };
}

/**
 * Get posts by audience
 */
export function getPostsByAudience(audience: 'job-seeker' | 'employer'): BlogPost[] {
  return getPublishedPosts().filter(post => post.contentAudience === audience);
}

/**
 * Validate 60/40 split
 */
export function validateContentSplit(): {
  valid: boolean;
  message: string;
  stats: ContentAudienceStats;
} {
  const stats = getContentAudienceStats();
  
  if (stats.total === 0) {
    return {
      valid: false,
      message: 'No published posts found',
      stats
    };
  }
  
  if (stats.targetMet) {
    return {
      valid: true,
      message: `Content split is optimal: ${stats.jobSeekerPercentage}% job-seeker, ${stats.employerPercentage}% employer`,
      stats
    };
  }
  
  let message = `Content split needs adjustment: ${stats.jobSeekerPercentage}% job-seeker, ${stats.employerPercentage}% employer. `;
  
  if (stats.jobSeekerPercentage < 55) {
    message += `Need more job-seeker content (target: 60%). `;
  }
  
  if (stats.employerPercentage < 35) {
    message += `Need more employer content (target: 40%). `;
  }
  
  return {
    valid: false,
    message,
    stats
  };
}


