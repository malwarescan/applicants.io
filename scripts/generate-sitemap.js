#!/usr/bin/env node

/**
 * Generate sitemap files for production deployment
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Import the sitemap configuration
const { BASE, SITEMAP_URLS, lastmod, DEFAULT_CHANGEFREQ, DEFAULT_PRIORITY } = require('../src/data/sitemap.ts');

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
if (require.main === module) {
  console.log('🔧 Generating sitemap files...\n');
  generateSitemapFiles('public');
}
