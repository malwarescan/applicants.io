/**
 * Blog Utilities
 * Implements APPLICANTS_BLOG_SEO_CONTENT_KERNEL URL, Meta, and Schema directives
 */

import { BlogPost, FAQItem, ContentPillar } from '../types/blog';

const BASE_URL = 'https://applicants.io';

/**
 * Generate blog post URL based on pillar
 */
export function generateBlogUrl(post: BlogPost): string {
  const slug = post.slug.toLowerCase().replace(/\s+/g, '-');
  
  switch (post.pillar) {
    case 'hiring-guides':
      return `/how-to-hire/${slug}`;
    case 'interview-questions':
      return `/interview-questions/${slug}`;
    case 'hr-operations':
      return `/hr/${slug}`;
    case 'compliance':
      return `/compliance/${slug}`;
    case 'compensation':
      return `/compensation/${slug}`;
    default:
      return `/blog/${slug}`;
  }
}

/**
 * Generate full canonical URL
 */
export function generateCanonicalUrl(post: BlogPost): string {
  return `${BASE_URL}${post.canonical || generateBlogUrl(post)}`;
}

/**
 * Generate title tag (under 60 characters)
 */
export function generateBlogTitle(post: BlogPost, year?: number): string {
  const currentYear = year || new Date().getFullYear();
  
  if (post.pillar === 'hiring-guides' && post.role) {
    return `How to Hire a ${post.role}: Complete Guide for ${currentYear}`;
  }
  
  if (post.pillar === 'interview-questions' && post.role) {
    return `${post.role} Interview Questions: Complete Guide`;
  }
  
  // Fallback to post title, truncated if needed
  return post.title.length > 60 
    ? post.title.substring(0, 57) + '...'
    : post.title;
}

/**
 * Generate meta description (under 155 characters)
 */
export function generateBlogMetaDescription(post: BlogPost): string {
  if (post.metaDescription) {
    return post.metaDescription.length > 155
      ? post.metaDescription.substring(0, 152) + '...'
      : post.metaDescription;
  }
  
  // Auto-generate from role and pillar
  if (post.role) {
    const base = `Learn how to hire a ${post.role.toLowerCase()}. Steps, salary data, interview questions, compliance notes, and employer FAQs.`;
    return base.length > 155 ? base.substring(0, 152) + '...' : base;
  }
  
  return post.executiveSummary.length > 155
    ? post.executiveSummary.substring(0, 152) + '...'
    : post.executiveSummary;
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(post: BlogPost): object {
  const url = generateCanonicalUrl(post);
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.executiveSummary,
    "image": `${BASE_URL}/logo.png`,
    "datePublished": post.publishedDate,
    "dateModified": post.lastUpdated,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Applicants.IO",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": post.pillar,
    ...(post.industry && { "articleSection": post.industry }),
    "keywords": post.targetKeywords.join(', '),
    "wordCount": post.wordCount
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQPageSchema(post: BlogPost): object {
  if (!post.faqs || post.faqs.length === 0) {
    return {};
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map((faq: FAQItem) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(post: BlogPost): object {
  const url = generateCanonicalUrl(post);
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": BASE_URL
    }
  ];
  
  // Add pillar category
  const pillarNames: Record<ContentPillar, string> = {
    'hiring-guides': 'Hiring Guides',
    'interview-questions': 'Interview Questions',
    'hr-operations': 'HR Operations',
    'compliance': 'Compliance',
    'compensation': 'Compensation'
  };
  
  items.push({
    "@type": "ListItem",
    "position": items.length + 1,
    "name": pillarNames[post.pillar],
    "item": `${BASE_URL}${getPillarBasePath(post.pillar)}`
  });
  
  // Add role if present
  if (post.role) {
    items.push({
      "@type": "ListItem",
      "position": items.length + 1,
      "name": post.role,
      "item": url
    });
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

/**
 * Generate Occupation schema (for hiring guides)
 */
export function generateOccupationSchema(post: BlogPost): object | null {
  if (post.pillar !== 'hiring-guides' || !post.role) {
    return null;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "Occupation",
    "name": post.role,
    "description": post.executiveSummary,
    "occupationLocation": post.location ? {
      "@type": "City",
      "name": post.location
    } : undefined,
    "skills": post.requiredSkills || [],
    "qualifications": post.certifications || [],
    ...(post.salaryData && {
      "estimatedSalary": {
        "@type": "MonetaryAmount",
        "currency": post.salaryData.currency || "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": post.salaryData.min,
          "maxValue": post.salaryData.max,
          "medianValue": post.salaryData.median,
          "unitText": "YEAR"
        }
      }
    })
  };
}

/**
 * Generate HowTo schema (for step-by-step guides)
 */
export function generateHowToSchema(post: BlogPost): object | null {
  if (!post.stepByStepBreakdown || post.stepByStepBreakdown.length === 0) {
    return null;
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": post.title,
    "description": post.executiveSummary,
    "step": post.stepByStepBreakdown.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": `Step ${index + 1}`,
      "text": step
    }))
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Applicants.IO",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "description": "Job board and hiring resources for employers"
  };
}

/**
 * Generate all schemas for a blog post
 */
export function generateAllSchemas(post: BlogPost): object[] {
  const schemas: object[] = [
    generateArticleSchema(post),
    generateFAQPageSchema(post),
    generateBreadcrumbSchema(post),
    generateOrganizationSchema()
  ];
  
  const occupationSchema = generateOccupationSchema(post);
  if (occupationSchema) {
    schemas.push(occupationSchema);
  }
  
  const howToSchema = generateHowToSchema(post);
  if (howToSchema) {
    schemas.push(howToSchema);
  }
  
  return schemas.filter(s => Object.keys(s).length > 0);
}

/**
 * Generate meta tags for blog post
 */
export function generateBlogMetaTags(post: BlogPost): Array<{ name?: string; property?: string; content: string }> {
  const url = generateCanonicalUrl(post);
  const title = generateBlogTitle(post);
  const description = generateBlogMetaDescription(post);
  
  return [
    { name: 'title', content: title },
    { name: 'description', content: description },
    { name: 'keywords', content: post.targetKeywords.join(', ') },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: post.author },
    { name: 'article:published_time', content: post.publishedDate },
    { name: 'article:modified_time', content: post.lastUpdated },
    { name: 'article:section', content: post.pillar },
    ...(post.role && [{ name: 'article:tag', content: post.role }]),
    ...(post.industry && [{ name: 'article:tag', content: post.industry }]),
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Applicants.IO' },
    { property: 'og:image', content: `${BASE_URL}/logo.png` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `${BASE_URL}/logo.png` }
  ];
}

/**
 * Get base path for content pillar
 */
export function getPillarBasePath(pillar: ContentPillar): string {
  switch (pillar) {
    case 'hiring-guides':
      return '/how-to-hire';
    case 'interview-questions':
      return '/interview-questions';
    case 'hr-operations':
      return '/hr';
    case 'compliance':
      return '/compliance';
    case 'compensation':
      return '/compensation';
    default:
      return '/blog';
  }
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Validate word count per pillar
 */
export function validateWordCount(post: BlogPost): boolean {
  const wordCount = post.wordCount || countWords(post.content);
  
  switch (post.pillar) {
    case 'hiring-guides':
      return wordCount >= 1200 && wordCount <= 2000;
    case 'interview-questions':
      return wordCount >= 900 && wordCount <= 1400;
    case 'hr-operations':
      return wordCount >= 1000 && wordCount <= 1600;
    case 'compliance':
      return wordCount >= 1200;
    case 'compensation':
      return wordCount >= 1000 && wordCount <= 1500;
    default:
      return wordCount >= 1000;
  }
}

