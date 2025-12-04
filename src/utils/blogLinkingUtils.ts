/**
 * Blog Internal Linking Utilities
 * Implements APPLICANTS_BLOG_SEO_CONTENT_KERNEL internal linking directives
 */

import { BlogPost } from '../types/blog';
import { generateBlogUrl, getPillarBasePath, generateCanonicalUrl } from './blogUtils';

const BASE_URL = 'https://applicants.io';

export interface InternalLink {
  url: string;
  text: string;
  type: 'parent' | 'sibling' | 'template' | 'category' | 'role' | 'interview';
}

/**
 * Generate internal links for a blog post
 */
export function generateInternalLinks(
  post: BlogPost,
  allPosts: BlogPost[]
): InternalLink[] {
  const links: InternalLink[] = [];
  
  // 1. Parent category link
  if (post.parentCategory) {
    links.push({
      url: `${BASE_URL}${getPillarBasePath(post.pillar)}`,
      text: post.parentCategory,
      type: 'parent'
    });
  }
  
  // 2. Related roles (sibling articles)
  if (post.relatedRoles && post.relatedRoles.length > 0) {
    post.relatedRoles.forEach(role => {
      const relatedPost = allPosts.find(
        p => p.role?.toLowerCase() === role.toLowerCase() && 
             p.pillar === post.pillar &&
             p.id !== post.id &&
             p.status === 'published'
      );
      
      if (relatedPost) {
        links.push({
          url: generateCanonicalUrl(relatedPost),
          text: `How to Hire a ${role}`,
          type: 'sibling'
        });
      }
    });
  }
  
  // 3. Interview questions for the same role
  if (post.role && post.pillar === 'hiring-guides') {
    const interviewPost = allPosts.find(
      p => p.role?.toLowerCase() === post.role?.toLowerCase() &&
           p.pillar === 'interview-questions' &&
           p.status === 'published'
    );
    
    if (interviewPost) {
      links.push({
        url: generateCanonicalUrl(interviewPost),
        text: `${post.role} Interview Questions`,
        type: 'interview'
      });
    }
  }
  
  // 4. Related templates (job postings)
  if (post.relatedTemplates && post.relatedTemplates.length > 0) {
    post.relatedTemplates.forEach(templateId => {
      links.push({
        url: `${BASE_URL}/jobs/${templateId}`,
        text: `View ${post.role || 'Job'} Template`,
        type: 'template'
      });
    });
  }
  
  // 5. Industry category link
  if (post.industry) {
    links.push({
      url: `${BASE_URL}/jobs/category/${post.industry.toLowerCase().replace(/\s+/g, '-')}`,
      text: `${post.industry} Jobs`,
      type: 'category'
    });
  }
  
  return links;
}

/**
 * Get links for first 200 words (required placement)
 */
export function getFirstSectionLinks(
  post: BlogPost,
  allPosts: BlogPost[]
): InternalLink[] {
  const allLinks = generateInternalLinks(post, allPosts);
  
  // Return parent category and one related role
  return allLinks
    .filter(link => link.type === 'parent' || link.type === 'sibling')
    .slice(0, 2);
}

/**
 * Get links for FAQ section
 */
export function getFAQSectionLinks(
  post: BlogPost,
  allPosts: BlogPost[]
): InternalLink[] {
  const allLinks = generateInternalLinks(post, allPosts);
  
  // Return interview questions and related templates
  return allLinks
    .filter(link => link.type === 'interview' || link.type === 'template')
    .slice(0, 2);
}

/**
 * Get links for conclusion section
 */
export function getConclusionLinks(
  post: BlogPost,
  allPosts: BlogPost[]
): InternalLink[] {
  const allLinks = generateInternalLinks(post, allPosts);
  
  // Return parent category and industry link
  return allLinks
    .filter(link => link.type === 'parent' || link.type === 'category')
    .slice(0, 2);
}

/**
 * Validate internal linking requirements
 */
export function validateInternalLinking(
  post: BlogPost,
  allPosts: BlogPost[]
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const links = generateInternalLinks(post, allPosts);
  
  // Check for parent category link
  if (!links.some(link => link.type === 'parent')) {
    errors.push('Missing parent category link');
  }
  
  // Check for at least 3 sibling articles
  const siblingLinks = links.filter(link => link.type === 'sibling');
  if (siblingLinks.length < 3) {
    errors.push(`Only ${siblingLinks.length} sibling links found, need at least 3`);
  }
  
  // Check for at least 1 template link
  const templateLinks = links.filter(link => link.type === 'template');
  if (templateLinks.length === 0) {
    errors.push('Missing template link');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

