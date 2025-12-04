/**
 * Authority Cluster Service
 * Implements APPLICANTS_CONTENT_AUTHORITY_KERNEL cluster directives
 * Manages pillar pages, blog posts, and job descriptions as interconnected clusters
 */

import { BlogPost } from '../types/blog';
import { EnhancedJob } from '../types/job';
import { getPublishedPosts, getPostsByRole } from '../data/blogPosts';
import { getAllUnifiedJobs, getJobsByRole } from './unifiedJobService';

export interface AuthorityCluster {
  role: string;
  industry?: string;
  pillar: {
    url: string;
    title: string;
  };
  blogPosts: {
    whatDoes: BlogPost | null; // "What does a {role} do?"
    salaryGuide: BlogPost | null; // "{Role} salary guide"
    interviewQuestions: BlogPost | null; // "{Role} interview questions"
    howToHire: BlogPost | null; // "How to hire a {role}"
    jobDescriptionGuide: BlogPost | null; // "How to write a {role} job description"
  };
  jobDescriptions: EnhancedJob[];
  relatedRoles: string[];
}

/**
 * Get authority cluster for a specific role
 */
export function getAuthorityCluster(role: string, industry?: string): AuthorityCluster {
  const allPosts = getPublishedPosts();
  const allJobs = getAllUnifiedJobs();
  
  const roleLower = role.toLowerCase();
  
  // Find blog posts for this role
  const rolePosts = allPosts.filter(post => 
    post.role?.toLowerCase() === roleLower
  );
  
  // Find job descriptions for this role
  const roleJobs = getJobsByRole(role);
  
  // Categorize blog posts by type
  const whatDoes = rolePosts.find(p => 
    p.title.toLowerCase().includes('what does') || 
    p.title.toLowerCase().includes('do?')
  ) || null;
  
  const salaryGuide = rolePosts.find(p => 
    p.pillar === 'compensation' || 
    p.title.toLowerCase().includes('salary')
  ) || null;
  
  const interviewQuestions = rolePosts.find(p => 
    p.pillar === 'interview-questions'
  ) || null;
  
  const howToHire = rolePosts.find(p => 
    p.pillar === 'hiring-guides'
  ) || null;
  
  const jobDescriptionGuide = rolePosts.find(p => 
    p.title.toLowerCase().includes('write') && 
    p.title.toLowerCase().includes('job description')
  ) || null;
  
  // Get related roles from blog posts
  const relatedRoles = Array.from(
    new Set(
      rolePosts
        .flatMap(p => p.relatedRoles || [])
        .filter(r => r.toLowerCase() !== roleLower)
    )
  );
  
  return {
    role,
    industry,
    pillar: {
      url: `/jobs/category/${industry?.toLowerCase().replace(/\s+/g, '-') || 'all'}`,
      title: `${role} Jobs`
    },
    blogPosts: {
      whatDoes,
      salaryGuide,
      interviewQuestions,
      howToHire,
      jobDescriptionGuide
    },
    jobDescriptions: roleJobs,
    relatedRoles
  };
}

/**
 * Get all clusters for a specific industry
 */
export function getIndustryClusters(industry: string): AuthorityCluster[] {
  const allJobs = getAllUnifiedJobs();
  const industryJobs = allJobs.filter(job => 
    job.industry?.toLowerCase() === industry.toLowerCase()
  );
  
  // Get unique roles from jobs
  const roles = Array.from(
    new Set(industryJobs.map(job => job.title))
  );
  
  return roles.map(role => getAuthorityCluster(role, industry));
}

/**
 * Get internal links for a job description (from cluster)
 */
export function getJobDescriptionInternalLinks(job: EnhancedJob): Array<{
  url: string;
  text: string;
  type: 'blog' | 'category' | 'similar-job';
}> {
  const cluster = getAuthorityCluster(job.title, job.industry);
  const links: Array<{ url: string; text: string; type: 'blog' | 'category' | 'similar-job' }> = [];
  
  // Add blog post links
  if (cluster.blogPosts.howToHire) {
    links.push({
      url: cluster.blogPosts.howToHire.canonical,
      text: `How to Hire a ${job.title}`,
      type: 'blog'
    });
  }
  
  if (cluster.blogPosts.salaryGuide) {
    links.push({
      url: cluster.blogPosts.salaryGuide.canonical,
      text: `${job.title} Salary Guide`,
      type: 'blog'
    });
  }
  
  if (cluster.blogPosts.interviewQuestions) {
    links.push({
      url: cluster.blogPosts.interviewQuestions.canonical,
      text: `${job.title} Interview Questions`,
      type: 'blog'
    });
  }
  
  // Add category link
  if (job.industry) {
    links.push({
      url: `/jobs/category/${job.industry.toLowerCase().replace(/\s+/g, '-')}`,
      text: `${job.industry} Jobs`,
      type: 'category'
    });
  }
  
  // Add similar jobs (related roles)
  const similarJobs = getAllUnifiedJobs()
    .filter(j => 
      j.id !== job.id &&
      j.industry === job.industry &&
      cluster.relatedRoles.some(role => 
        j.title.toLowerCase().includes(role.toLowerCase())
      )
    )
    .slice(0, 3);
  
  similarJobs.forEach(similarJob => {
    links.push({
      url: `/enhanced-jobs/${similarJob.id}`,
      text: similarJob.title,
      type: 'similar-job'
    });
  });
  
  return links;
}

/**
 * Get internal links for a blog post (to job descriptions)
 */
export function getBlogPostToJobLinks(post: BlogPost): Array<{
  url: string;
  text: string;
  job: EnhancedJob;
}> {
  if (!post.role) return [];
  
  const jobs = getJobsByRole(post.role);
  
  return jobs.slice(0, 3).map(job => ({
    url: `/enhanced-jobs/${job.id}`,
    text: `${post.role} Job at ${job.company}`,
    job
  }));
}

/**
 * Validate cluster completeness
 */
export function validateCluster(cluster: AuthorityCluster): {
  complete: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!cluster.blogPosts.howToHire) {
    missing.push('How to hire blog post');
  }
  
  if (!cluster.blogPosts.salaryGuide) {
    missing.push('Salary guide blog post');
  }
  
  if (cluster.jobDescriptions.length === 0) {
    missing.push('Job descriptions');
  }
  
  return {
    complete: missing.length === 0,
    missing
  };
}


