#!/usr/bin/env node

/**
 * Generate sitemap files for production deployment
 * Usage: node scripts/generate-sitemap-simple.js
 */

import fs from 'fs';
import path from 'path';

// Configuration
const BASE = 'https://applicants.io';
const DEFAULT_CHANGEFREQ = 'daily';
const DEFAULT_PRIORITY = 0.8;

// Sitemap URLs configuration
const SITEMAP_URLS = {
  'main': [
    `${BASE}/`,
    `${BASE}/jobs`,
    `${BASE}/enhanced-jobs`,
    `${BASE}/enhanced-post-job`,
    `${BASE}/contact`,
    `${BASE}/admin`,
  ],

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
};

// Utility functions
const lastmod = () => new Date().toISOString().slice(0, 10);

// Generate sitemap index XML
const generateSitemapIndex = () => {
  const items = Object.keys(SITEMAP_URLS).map((key) => {
    const loc = `${BASE}/sitemaps/${key}.xml`;
    return `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod()}</lastmod>
  </sitemap>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join('\n')}
</sitemapindex>`;
};

// Generate individual sitemap XML
const generateSitemapChunk = (chunkId) => {
  const urls = SITEMAP_URLS[chunkId];
  if (!urls || !Array.isArray(urls)) {
    return null;
  }

  const nodes = urls.map((loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod()}</lastmod>
    <changefreq>${DEFAULT_CHANGEFREQ}</changefreq>
    <priority>${DEFAULT_PRIORITY}</priority>
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${nodes.join('\n')}
</urlset>`;
};

// Generate sitemap files
const generateSitemapFiles = (outputDir = 'public') => {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create sitemaps directory
    const sitemapsDir = path.join(outputDir, 'sitemaps');
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

    // Generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://applicants.io/sitemap.xml
Sitemap: https://applicants.io/sitemaps/main.xml
Sitemap: https://applicants.io/sitemaps/categories.xml
Sitemap: https://applicants.io/sitemaps/locations.xml
Sitemap: https://applicants.io/sitemaps/category-location.xml

# Crawl delay (optional)
Crawl-delay: 1`;
    
    fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsTxt, 'utf8');
    console.log('✅ Generated robots.txt');

    console.log('\n🎉 All sitemap files generated successfully!');
    console.log('\n📁 Generated files:');
    console.log(`   ${outputDir}/sitemap.xml`);
    console.log(`   ${outputDir}/robots.txt`);
    console.log(`   ${outputDir}/sitemaps/main.xml`);
    console.log(`   ${outputDir}/sitemaps/categories.xml`);
    console.log(`   ${outputDir}/sitemaps/locations.xml`);
    console.log(`   ${outputDir}/sitemaps/category-location.xml`);
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Deploy these files to your production server');
    console.log('   2. Submit https://applicants.io/sitemap.xml to Google Search Console');
    console.log('   3. Verify robots.txt is accessible at https://applicants.io/robots.txt');

  } catch (error) {
    console.error('❌ Error generating sitemap files:', error);
    throw error;
  }
};

// Run the generator
console.log('🔧 Generating sitemap files...\n');
generateSitemapFiles('public');
