// src/data/sitemap.ts
// Hardcode your production origin here (no trailing slash)
export const BASE = 'https://applicants.io'

// ─────────────────────────────────────────────────────────────────────────────
// 1) Put your URLs into these arrays (≤ 50,000 per chunk).
// 2) Duplicate chunks or add new keys as needed (jobs-3, jobs-4, ...).
// 3) Keep them as fully qualified URLs (absolute URLs).
// ─────────────────────────────────────────────────────────────────────────────

export const SITEMAP_URLS: Record<string, string[]> = {
  // Main pages
  'main': [
    `${BASE}/`,
    `${BASE}/jobs`,
    `${BASE}/enhanced-jobs`,
    `${BASE}/enhanced-post-job`,
    `${BASE}/contact`,
    `${BASE}/admin`,
  ],

  // Job categories (from your SEO job service)
  'categories': [
    `${BASE}/jobs/category/software-engineer`,
    `${BASE}/jobs/category/marketing-manager`,
    `${BASE}/jobs/category/registered-nurse`,
    `${BASE}/jobs/category/sales-representative`,
    `${BASE}/jobs/category/data-analyst`,
    `${BASE}/jobs/category/customer-service`,
    `${BASE}/jobs/category/project-manager`,
    `${BASE}/jobs/category/accountant`,
    `${BASE}/jobs/category/human-resources`,
    `${BASE}/jobs/category/operations-manager`,
    `${BASE}/jobs/category/graphic-designer`,
    `${BASE}/jobs/category/content-writer`,
    `${BASE}/jobs/category/software-developer`,
    `${BASE}/jobs/category/business-analyst`,
    `${BASE}/jobs/category/administrative-assistant`,
    `${BASE}/jobs/category/financial-analyst`,
    `${BASE}/jobs/category/quality-assurance`,
    `${BASE}/jobs/category/network-administrator`,
    `${BASE}/jobs/category/digital-marketing`,
    `${BASE}/jobs/category/executive-assistant`,
    `${BASE}/jobs/category/healthcare-administrator`,
  ],

  // State and city hubs (expandable)
  'locations': [
    // Florida hubs
    `${BASE}/jobs/florida/`,
    `${BASE}/jobs/florida/miami/`,
    `${BASE}/jobs/florida/orlando/`,
    `${BASE}/jobs/florida/tampa/`,
    `${BASE}/jobs/florida/jacksonville/`,
    
    // Texas hubs
    `${BASE}/jobs/texas/`,
    `${BASE}/jobs/texas/austin/`,
    `${BASE}/jobs/texas/houston/`,
    `${BASE}/jobs/texas/dallas/`,
    `${BASE}/jobs/texas/san-antonio/`,
    
    // California hubs
    `${BASE}/jobs/california/`,
    `${BASE}/jobs/california/san-francisco/`,
    `${BASE}/jobs/california/los-angeles/`,
    `${BASE}/jobs/california/san-diego/`,
    `${BASE}/jobs/california/sacramento/`,
    
    // New York hubs
    `${BASE}/jobs/new-york/`,
    `${BASE}/jobs/new-york/new-york-city/`,
    `${BASE}/jobs/new-york/albany/`,
    `${BASE}/jobs/new-york/buffalo/`,
    
    // Remote jobs
    `${BASE}/jobs/remote/`,
  ],

  // Combined category + location pages (high-value SEO targets)
  'category-location': [
    // Florida combinations
    `${BASE}/jobs/florida/miami/software-engineer/`,
    `${BASE}/jobs/florida/orlando/marketing-manager/`,
    `${BASE}/jobs/florida/tampa/registered-nurse/`,
    `${BASE}/jobs/florida/jacksonville/sales-representative/`,
    
    // Texas combinations
    `${BASE}/jobs/texas/austin/software-engineer/`,
    `${BASE}/jobs/texas/houston/marketing-manager/`,
    `${BASE}/jobs/texas/dallas/registered-nurse/`,
    `${BASE}/jobs/texas/san-antonio/sales-representative/`,
    
    // California combinations
    `${BASE}/jobs/california/san-francisco/software-engineer/`,
    `${BASE}/jobs/california/los-angeles/marketing-manager/`,
    `${BASE}/jobs/california/san-diego/registered-nurse/`,
    `${BASE}/jobs/california/sacramento/sales-representative/`,
    
    // New York combinations
    `${BASE}/jobs/new-york/new-york-city/software-engineer/`,
    `${BASE}/jobs/new-york/new-york-city/marketing-manager/`,
    `${BASE}/jobs/new-york/new-york-city/registered-nurse/`,
    `${BASE}/jobs/new-york/new-york-city/sales-representative/`,
    
    // Remote combinations
    `${BASE}/jobs/remote/software-engineer/`,
    `${BASE}/jobs/remote/marketing-manager/`,
    `${BASE}/jobs/remote/data-analyst/`,
    `${BASE}/jobs/remote/customer-service/`,
  ],
}

// Optional: tune these defaults if you want
export const DEFAULT_CHANGEFREQ: 'daily' | 'weekly' | 'monthly' = 'daily'
export const DEFAULT_PRIORITY = 0.8

// Utility: ISO date (yyyy-mm-dd) for <lastmod>
export const lastmod = () => new Date().toISOString().slice(0, 10)

// Generate sitemap index XML
export const generateSitemapIndex = (): string => {
  const items = Object.keys(SITEMAP_URLS).map((key) => {
    const loc = `${BASE}/sitemaps/${key}.xml`
    return `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod()}</lastmod>
  </sitemap>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join('\n')}
</sitemapindex>`
}

// Generate individual sitemap XML
export const generateSitemapChunk = (chunkId: string): string | null => {
  const urls = SITEMAP_URLS[chunkId]
  if (!urls || !Array.isArray(urls)) {
    return null
  }

  const nodes = urls.map((loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod()}</lastmod>
    <changefreq>${DEFAULT_CHANGEFREQ}</changefreq>
    <priority>${DEFAULT_PRIORITY}</priority>
  </url>`)

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${nodes.join('\n')}
</urlset>`
}
