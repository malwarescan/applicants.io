/**
 * Sitemap Generator for SEO
 * Generates XML sitemaps for better search engine indexing
 */

import { jobs } from '../data/jobs';
import { generateJobUrl, generateCategoryUrl, generateLocationUrl, generateCompanyUrl, generateSlug } from './seoUtils';

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate all sitemap entries
 */
export function generateSitemapEntries(baseUrl: string = 'https://applicants.io'): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString().split('T')[0];

  // Static pages
  entries.push(
    {
      url: `${baseUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/jobs`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/post-job`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    }
  );

  // Job pages
  jobs.forEach(job => {
    entries.push({
      url: `${baseUrl}${generateJobUrl(job)}`,
      lastmod: job.postedDate,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // Category pages
  const industries = [...new Set(jobs.map(job => job.industry))];
  industries.forEach(industry => {
    entries.push({
      url: `${baseUrl}${generateCategoryUrl(industry)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Location pages
  const locations = [...new Set(jobs.map(job => job.location))];
  locations.forEach(location => {
    entries.push({
      url: `${baseUrl}${generateLocationUrl(location)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Company pages
  const companies = [...new Set(jobs.map(job => job.company))];
  companies.forEach(company => {
    entries.push({
      url: `${baseUrl}${generateCompanyUrl(company)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  return entries;
}

/**
 * Generate XML sitemap
 */
export function generateSitemapXML(baseUrl: string = 'https://applicants.io'): string {
  const entries = generateSitemapEntries(baseUrl);
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  entries.forEach(entry => {
    xml += '  <url>\n';
    xml += `    <loc>${entry.url}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(baseUrl: string = 'https://applicants.io'): string {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow all job pages
Allow: /jobs/

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
}

/**
 * Download sitemap as file (for development)
 */
export function downloadSitemap(baseUrl?: string) {
  const sitemap = generateSitemapXML(baseUrl);
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download robots.txt as file (for development)
 */
export function downloadRobotsTxt(baseUrl?: string) {
  const robots = generateRobotsTxt(baseUrl);
  const blob = new Blob([robots], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'robots.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
