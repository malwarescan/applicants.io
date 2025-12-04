/**
 * Blog Feed Utilities
 * Generates NDJSON feeds for AI ingestion (ChatGPT, Claude, Perplexity)
 * Implements APPLICANTS_BLOG_SEO_CONTENT_KERNEL NDJSON directives
 */

import { BlogPost, BlogFeedItem, FAQItem } from '../types/blog';
import { generateCanonicalUrl } from './blogUtils';
import { generateJobsFeed } from './jobFeedUtils';

/**
 * Convert blog post to NDJSON feed item
 */
export function blogPostToFeedItem(post: BlogPost): BlogFeedItem {
  return {
    id: post.id,
    title: post.title,
    url: generateCanonicalUrl(post),
    summary: post.executiveSummary,
    key_points: post.keyInsights,
    role: post.role,
    industry: post.industry,
    entities: post.entities,
    faq: post.faqs,
    canonical: post.canonical || generateCanonicalUrl(post),
    last_updated: post.lastUpdated,
    pillar: post.pillar
  };
}

/**
 * Generate NDJSON feed content
 */
export function generateNDJSONFeed(posts: BlogPost[]): string {
  return posts
    .filter(post => post.status === 'published')
    .map(post => JSON.stringify(blogPostToFeedItem(post)))
    .join('\n');
}

/**
 * Generate articles feed
 */
export function generateArticlesFeed(posts: BlogPost[]): string {
  return generateNDJSONFeed(posts);
}

/**
 * Generate hiring guides feed
 */
export function generateHiringGuidesFeed(posts: BlogPost[]): string {
  const hiringGuides = posts.filter(
    post => post.pillar === 'hiring-guides' && post.status === 'published'
  );
  return generateNDJSONFeed(hiringGuides);
}

/**
 * Generate FAQs feed (atomic FAQ items)
 */
export function generateFAQsFeed(posts: BlogPost[]): string {
  const faqItems: Array<FAQItem & { articleId: string; articleUrl: string }> = [];
  
  posts
    .filter(post => post.status === 'published')
    .forEach(post => {
      post.faqs.forEach(faq => {
        faqItems.push({
          ...faq,
          articleId: post.id,
          articleUrl: generateCanonicalUrl(post)
        });
      });
    });
  
  return faqItems
    .map(item => JSON.stringify(item))
    .join('\n');
}

/**
 * Generate feed for specific pillar
 */
export function generatePillarFeed(posts: BlogPost[], pillar: BlogPost['pillar']): string {
  const pillarPosts = posts.filter(
    post => post.pillar === pillar && post.status === 'published'
  );
  return generateNDJSONFeed(pillarPosts);
}

/**
 * Generate feed for specific role
 */
export function generateRoleFeed(posts: BlogPost[], role: string): string {
  const rolePosts = posts.filter(
    post => post.role?.toLowerCase() === role.toLowerCase() && post.status === 'published'
  );
  return generateNDJSONFeed(rolePosts);
}

/**
 * Generate feed for specific industry
 */
export function generateIndustryFeed(posts: BlogPost[], industry: string): string {
  const industryPosts = posts.filter(
    post => post.industry?.toLowerCase() === industry.toLowerCase() && post.status === 'published'
  );
  return generateNDJSONFeed(industryPosts);
}

/**
 * Generate salaries feed (extract salary data from blog posts)
 */
export function generateSalariesFeed(posts: BlogPost[]): string {
  const salaryItems = posts
    .filter(post => post.status === 'published' && post.salaryData)
    .map(post => ({
      id: post.id,
      role: post.role,
      industry: post.industry,
      location: post.location,
      salary_min: post.salaryData!.min,
      salary_max: post.salaryData!.max,
      salary_median: post.salaryData!.median,
      currency: post.salaryData!.currency,
      url: generateCanonicalUrl(post),
      last_updated: post.lastUpdated
    }));
  
  return salaryItems
    .map(item => JSON.stringify(item))
    .join('\n');
}

/**
 * Generate roles feed (role-specific content)
 */
export function generateRolesFeed(posts: BlogPost[]): string {
  const roleItems = posts
    .filter(post => post.status === 'published' && post.role)
    .map(post => ({
      id: post.id,
      role: post.role,
      industry: post.industry,
      url: generateCanonicalUrl(post),
      summary: post.executiveSummary,
      key_points: post.keyInsights,
      responsibilities: post.responsibilities,
      required_skills: post.requiredSkills,
      last_updated: post.lastUpdated
    }));
  
  return roleItems
    .map(item => JSON.stringify(item))
    .join('\n');
}

