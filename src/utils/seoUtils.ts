/**
 * SEO Utilities for Job Board
 * Handles URL generation, meta tags, and structured data
 */

export interface SEOJob extends Job {
  slug: string;
  categorySlug: string;
  locationSlug: string;
  companySlug: string;
}

export interface Job extends Job {
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
}

/**
 * Generate SEO-friendly slugs from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate SEO-friendly job URLs
 */
export function generateJobUrl(job: Job): string {
  const titleSlug = generateSlug(job.title);
  const companySlug = generateSlug(job.company);
  const locationSlug = generateSlug(job.location);
  
  // Format: /jobs/company-slug/title-slug-location-slug-id
  return `/jobs/${companySlug}/${titleSlug}-${locationSlug}-${job.id}`;
}

/**
 * Generate category URLs
 */
export function generateCategoryUrl(industry: string): string {
  const industrySlug = generateSlug(industry);
  return `/jobs/category/${industrySlug}`;
}

/**
 * Generate location URLs
 */
export function generateLocationUrl(location: string): string {
  const locationSlug = generateSlug(location);
  return `/jobs/location/${locationSlug}`;
}

/**
 * Generate company URLs
 */
export function generateCompanyUrl(company: string): string {
  const companySlug = generateSlug(company);
  return `/jobs/company/${companySlug}`;
}

/**
 * Parse job URL to extract components
 */
export function parseJobUrl(url: string): { company: string; title: string; location: string; id: string } | null {
  const match = url.match(/^\/jobs\/([^\/]+)\/(.+)-(.+)-(\d+)$/);
  if (!match) return null;
  
  const [, companySlug, titleSlug, locationSlug, id] = match;
  return {
    company: companySlug.replace(/-/g, ' '),
    title: titleSlug.replace(/-/g, ' '),
    location: locationSlug.replace(/-/g, ' '),
    id
  };
}

/**
 * Generate JobPosting schema markup
 */
export function generateJobSchema(job: Job): object {
  const baseSalary = job.compensation ? extractSalary(job.compensation) : undefined;
  
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.postedDate,
    "validThrough": getValidThroughDate(job.postedDate),
    "employmentType": "FULL_TIME", // Could be dynamic based on job type
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": getCompanyWebsite(job.company)
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": extractCity(job.location),
        "addressRegion": extractState(job.location),
        "addressCountry": "US"
      }
    },
    ...(baseSalary && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": baseSalary.min,
          "maxValue": baseSalary.max,
          "unitText": "YEAR"
        }
      }
    }),
    "url": `${window.location.origin}${generateJobUrl(job)}`,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": job.id
    }
  };
}

/**
 * Generate Organization schema markup
 */
export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Applicants.IO",
    "description": "Find your dream job with our comprehensive job board platform",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "sameAs": [
      // Add your social media URLs here
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@applicants.io"
    }
  };
}

/**
 * Generate Website schema markup
 */
export function generateWebsiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Applicants.IO",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/jobs?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Generate meta tags for job pages
 */
export function generateJobMetaTags(job: Job): Array<{ name: string; content: string }> {
  const description = truncateText(job.description, 160);
  const title = `${job.title} at ${job.company} in ${job.location}`;
  
  return [
    { name: 'title', content: title },
    { name: 'description', content: description },
    { name: 'keywords', content: `${job.title}, ${job.company}, ${job.industry}, jobs, careers, ${job.location}` },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: job.company },
    { name: 'article:published_time', content: job.postedDate },
    { name: 'article:section', content: job.industry },
    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `${window.location.origin}${generateJobUrl(job)}` },
    { property: 'og:site_name', content: 'Applicants.IO' },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ];
}

/**
 * Generate meta tags for category pages
 */
export function generateCategoryMetaTags(industry: string, jobCount: number): Array<{ name: string; content: string }> {
  const title = `${industry} Jobs - Find ${industry} Careers`;
  const description = `Browse ${jobCount}+ ${industry} jobs and careers. Find your next ${industry} position with top companies.`;
  
  return [
    { name: 'title', content: title },
    { name: 'description', content: description },
    { name: 'keywords', content: `${industry}, jobs, careers, employment, ${industry} positions` },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
  ];
}

/**
 * Utility functions
 */
function extractSalary(compensation: string): { min: number; max: number } | undefined {
  const match = compensation.match(/\$([0-9,]+)\s*-\s*\$([0-9,]+)/);
  if (match) {
    return {
      min: parseInt(match[1].replace(/,/g, '')),
      max: parseInt(match[2].replace(/,/g, ''))
    };
  }
  return undefined;
}

function getValidThroughDate(postedDate: string): string {
  const date = new Date(postedDate);
  date.setDate(date.getDate() + 30); // Jobs valid for 30 days
  return date.toISOString().split('T')[0];
}

function getCompanyWebsite(company: string): string {
  // Map company names to their websites
  const companyWebsites: { [key: string]: string } = {
    'TechCorp': 'https://techcorp.com',
    'GrowthBrand': 'https://growthbrand.com',
    'DataInsights': 'https://datainsights.com',
    'ServiceFirst': 'https://servicefirst.com',
    'InnovateCo': 'https://innovateco.com',
    'Synaxus Inc.': 'https://synaxusinc.com'
  };
  return companyWebsites[company] || '#';
}

function extractCity(location: string): string {
  return location.split(',')[0].trim();
}

function extractState(location: string): string {
  const parts = location.split(',');
  return parts.length > 1 ? parts[1].trim() : location;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
