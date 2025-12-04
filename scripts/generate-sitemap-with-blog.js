/**
 * Generate Sitemap with Blog Posts
 * This script generates static XML sitemap files that can be served directly
 * Run this before deployment: node scripts/generate-sitemap-with-blog.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the sitemap generation functions
// Note: This requires the TypeScript files to be compiled or we use a workaround
const BASE = 'https://applicants.io';

// Blog posts data (simplified - in production, import from compiled JS)
const blogPosts = [
  { canonical: '/how-to-hire/retail-cashier', lastUpdated: '2025-01-15' },
  { canonical: '/how-to-hire/software-developer', lastUpdated: '2025-01-10' },
  { canonical: '/how-to-hire/registered-nurse', lastUpdated: '2025-01-08' },
  { canonical: '/how-to-hire/customer-service-representative', lastUpdated: '2025-01-12' },
  { canonical: '/hr/what-does-retail-cashier-do', lastUpdated: '2025-01-20' },
  { canonical: '/hr/what-does-software-developer-do', lastUpdated: '2025-01-19' },
  { canonical: '/hr/what-does-registered-nurse-do', lastUpdated: '2025-01-21' },
  { canonical: '/hr/what-does-customer-service-representative-do', lastUpdated: '2025-01-22' },
  { canonical: '/compensation/retail-cashier-salary', lastUpdated: '2025-01-18' },
  { canonical: '/compensation/software-developer-salary', lastUpdated: '2025-01-17' },
  { canonical: '/compensation/registered-nurse-salary', lastUpdated: '2025-01-19' },
  { canonical: '/compensation/customer-service-representative-salary', lastUpdated: '2025-01-20' },
  { canonical: '/interview-questions/retail-cashier', lastUpdated: '2025-01-16' },
  { canonical: '/interview-questions/software-developer', lastUpdated: '2025-01-15' },
  { canonical: '/interview-questions/registered-nurse', lastUpdated: '2025-01-17' },
  { canonical: '/interview-questions/customer-service-representative', lastUpdated: '2025-01-18' },
  { canonical: '/hr/how-to-write-retail-cashier-job-description', lastUpdated: '2025-01-14' },
  { canonical: '/hr/how-to-write-software-developer-job-description', lastUpdated: '2025-01-13' },
  { canonical: '/hr/how-to-write-registered-nurse-job-description', lastUpdated: '2025-01-15' },
  { canonical: '/hr/how-to-write-customer-service-representative-job-description', lastUpdated: '2025-01-16' },
];

// Sitemap URLs
const SITEMAP_URLS = {
  main: [
    `${BASE}/`,
    `${BASE}/jobs`,
    `${BASE}/enhanced-jobs`,
    `${BASE}/enhanced-post-job`,
    `${BASE}/contact`,
    `${BASE}/blog`,
  ],
  categories: [
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
  locations: [
    `${BASE}/jobs/florida/`,
    `${BASE}/jobs/florida/miami/`,
    `${BASE}/jobs/florida/orlando/`,
    `${BASE}/jobs/florida/tampa/`,
    `${BASE}/jobs/florida/jacksonville/`,
    `${BASE}/jobs/texas/`,
    `${BASE}/jobs/texas/austin/`,
    `${BASE}/jobs/texas/houston/`,
    `${BASE}/jobs/texas/dallas/`,
    `${BASE}/jobs/texas/san-antonio/`,
    `${BASE}/jobs/california/`,
    `${BASE}/jobs/california/san-francisco/`,
    `${BASE}/jobs/california/los-angeles/`,
    `${BASE}/jobs/california/san-diego/`,
    `${BASE}/jobs/california/sacramento/`,
    `${BASE}/jobs/new-york/`,
    `${BASE}/jobs/new-york/new-york-city/`,
    `${BASE}/jobs/new-york/albany/`,
    `${BASE}/jobs/new-york/buffalo/`,
    `${BASE}/jobs/remote/`,
  ],
  'category-location': [
    `${BASE}/jobs/florida/miami/software-engineer/`,
    `${BASE}/jobs/florida/orlando/marketing-manager/`,
    `${BASE}/jobs/florida/tampa/registered-nurse/`,
    `${BASE}/jobs/florida/jacksonville/sales-representative/`,
    `${BASE}/jobs/texas/austin/software-engineer/`,
    `${BASE}/jobs/texas/houston/marketing-manager/`,
    `${BASE}/jobs/texas/dallas/registered-nurse/`,
    `${BASE}/jobs/texas/san-antonio/sales-representative/`,
    `${BASE}/jobs/california/san-francisco/software-engineer/`,
    `${BASE}/jobs/california/los-angeles/marketing-manager/`,
    `${BASE}/jobs/california/san-diego/registered-nurse/`,
    `${BASE}/jobs/california/sacramento/sales-representative/`,
    `${BASE}/jobs/new-york/new-york-city/software-engineer/`,
    `${BASE}/jobs/new-york/new-york-city/marketing-manager/`,
    `${BASE}/jobs/new-york/new-york-city/registered-nurse/`,
    `${BASE}/jobs/new-york/new-york-city/sales-representative/`,
    `${BASE}/jobs/remote/software-engineer/`,
    `${BASE}/jobs/remote/marketing-manager/`,
    `${BASE}/jobs/remote/data-analyst/`,
    `${BASE}/jobs/remote/customer-service/`,
  ],
};

const lastmod = () => new Date().toISOString().slice(0, 10);

function generateBlogSitemapUrls() {
  return blogPosts.map(post => 
    post.canonical.startsWith('http') ? post.canonical : `${BASE}${post.canonical}`
  );
}

function generateSitemapIndex() {
  const items = Object.keys(SITEMAP_URLS).map((key) => {
    const loc = `${BASE}/sitemaps/${key}.xml`;
    return `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod()}</lastmod>
  </sitemap>`;
  });

  // Add blog sitemap
  items.push(`  <sitemap>
    <loc>${BASE}/sitemaps/blog.xml</loc>
    <lastmod>${lastmod()}</lastmod>
  </sitemap>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join('\n')}
</sitemapindex>`;
}

function generateSitemapChunk(chunkId, blogPostsData = null) {
  let urls = SITEMAP_URLS[chunkId];
  
  if (chunkId === 'blog' && blogPostsData) {
    urls = generateBlogSitemapUrls();
  }
  
  if (!urls || !Array.isArray(urls)) {
    return null;
  }

  const nodes = urls.map((loc) => {
    let postLastmod = lastmod();
    if (chunkId === 'blog' && blogPostsData) {
      const post = blogPostsData.find(p => {
        const postUrl = p.canonical.startsWith('http') ? p.canonical : `${BASE}${p.canonical}`;
        return postUrl === loc;
      });
      if (post) {
        postLastmod = post.lastUpdated.split('T')[0];
      }
    }
    
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${postLastmod}</lastmod>
    <changefreq>${chunkId === 'blog' ? 'weekly' : 'daily'}</changefreq>
    <priority>${chunkId === 'blog' ? '0.7' : '0.8'}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${nodes.join('\n')}
</urlset>`;
}

// Generate sitemap files
function generateSitemapFiles() {
  const outputDir = path.join(__dirname, '..', 'php-src', 'public');
  const sitemapsDir = path.join(outputDir, 'sitemaps');

  // Create directories
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  // Generate main sitemap index
  const sitemapIndex = generateSitemapIndex();
  fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapIndex, 'utf8');
  console.log('✅ Generated sitemap.xml');

  // Generate individual sitemap chunks
  Object.keys(SITEMAP_URLS).forEach((chunkId) => {
    const chunkXml = generateSitemapChunk(chunkId);
    if (chunkXml) {
      const filePath = path.join(sitemapsDir, `${chunkId}.xml`);
      fs.writeFileSync(filePath, chunkXml, 'utf8');
      console.log(`✅ Generated sitemaps/${chunkId}.xml`);
    }
  });

  // Generate blog sitemap
  const blogSitemap = generateSitemapChunk('blog', blogPosts);
  if (blogSitemap) {
    const blogPath = path.join(sitemapsDir, 'blog.xml');
    fs.writeFileSync(blogPath, blogSitemap, 'utf8');
    console.log(`✅ Generated sitemaps/blog.xml (${blogPosts.length} posts)`);
  }

  // Also generate in dist for React build
  const distDir = path.join(__dirname, '..', 'dist');
  const distSitemapsDir = path.join(distDir, 'sitemaps');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  if (!fs.existsSync(distSitemapsDir)) {
    fs.mkdirSync(distSitemapsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapIndex, 'utf8');
  Object.keys(SITEMAP_URLS).forEach((chunkId) => {
    const chunkXml = generateSitemapChunk(chunkId);
    if (chunkXml) {
      const filePath = path.join(distSitemapsDir, `${chunkId}.xml`);
      fs.writeFileSync(filePath, chunkXml, 'utf8');
    }
  });
  if (blogSitemap) {
    fs.writeFileSync(path.join(distSitemapsDir, 'blog.xml'), blogSitemap, 'utf8');
  }

  console.log('\n🎉 All sitemap files generated successfully!');
  console.log(`\n📁 Generated in: ${outputDir}`);
  console.log(`📁 Also generated in: ${distDir}`);
}

generateSitemapFiles();

