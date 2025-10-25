#!/usr/bin/env php
<?php
/**
 * Generate Sitemap for Synaxus Job Pages
 * 
 * Creates/updates sitemap.xml to include all Synaxus job pages
 */

declare(strict_types=1);

$jobsFile = __DIR__ . '/../data/synaxus_jobs.json';
$sitemapFile = __DIR__ . '/../public/sitemaps/synaxus-jobs.xml';
$baseUrl = 'https://www.applicants.io';

// Load jobs
if (!file_exists($jobsFile)) {
    echo "Error: Jobs file not found\n";
    exit(1);
}

$data = json_decode(file_get_contents($jobsFile), true);
$jobs = $data['jobs'] ?? [];

// Generate slug for each job (match the actual file names)
function generateSlug(array $job): string {
    $identifier = $job['identifier']['value'] ?? '';
    
    if ($identifier) {
        return $identifier;
    }
    
    // Fallback to generating from title and location
    $title = $job['title'] ?? '';
    $location = '';
    
    if (!empty($job['jobLocation']) && is_array($job['jobLocation'])) {
        $loc = $job['jobLocation'][0] ?? [];
        $parts = array_filter([$loc['city'] ?? '', $loc['region'] ?? '']);
        $location = strtolower(implode('-', $parts));
    }
    
    $titleSlug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $title));
    $locationSlug = $location ? '-' . $location : '';
    
    return trim($titleSlug . $locationSlug, '-');
}

// Generate sitemap XML
$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

// Add index page
$xml .= "  <url>\n";
$xml .= "    <loc>{$baseUrl}/employers/synaxus/</loc>\n";
$xml .= "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
$xml .= "    <changefreq>daily</changefreq>\n";
$xml .= "    <priority>0.8</priority>\n";
$xml .= "  </url>\n";

// Add each job page
foreach ($jobs as $job) {
    $slug = generateSlug($job);
    $url = "{$baseUrl}/employers/synaxus/{$slug}";
    $lastmod = $job['datePosted'] ?? date('Y-m-d');
    
    $xml .= "  <url>\n";
    $xml .= "    <loc>" . htmlspecialchars($url) . "</loc>\n";
    $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
    $xml .= "    <changefreq>weekly</changefreq>\n";
    $xml .= "    <priority>0.7</priority>\n";
    $xml .= "  </url>\n";
}

$xml .= '</urlset>';

// Ensure directory exists
$sitemapsDir = dirname($sitemapFile);
if (!is_dir($sitemapsDir)) {
    mkdir($sitemapsDir, 0777, true);
}

// Write sitemap file
file_put_contents($sitemapFile, $xml);

echo "Generated Synaxus jobs sitemap: {$sitemapFile}\n";
echo "Added " . (count($jobs) + 1) . " URLs\n";

// Update main sitemap index
$mainSitemapFile = __DIR__ . '/../public/sitemap.xml';
$synaxusSitemapUrl = "{$baseUrl}/sitemaps/synaxus-jobs.xml";

if (file_exists($mainSitemapFile)) {
    $mainSitemap = file_get_contents($mainSitemapFile);
    
    // Check if synaxus-jobs sitemap is already included
    if (strpos($mainSitemap, 'synaxus-jobs.xml') === false) {
        // Add synaxus-jobs sitemap before closing tag
        $mainSitemap = str_replace(
            '</sitemapindex>',
            "  <sitemap>\n    <loc>{$synaxusSitemapUrl}</loc>\n    <lastmod>" . date('Y-m-d') . "</lastmod>\n  </sitemap>\n</sitemapindex>",
            $mainSitemap
        );
        
        file_put_contents($mainSitemapFile, $mainSitemap);
        echo "Updated main sitemap index\n";
    } else {
        echo "Main sitemap already includes Synaxus jobs\n";
    }
}

echo "\nDone!\n";
