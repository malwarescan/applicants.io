#!/usr/bin/env php
<?php
/**
 * Update Sitemap with All Job Listings
 * 
 * Adds all job pages to the sitemap.xml
 */

require __DIR__ . '/../php-src/app/bootstrap.php';
use App\Data;

$jobs = Data::readJson('data/jobs.json');
$baseUrl = 'https://www.applicants.io';

// Read existing sitemap or create new
$sitemapFile = __DIR__ . '/../public/sitemap.xml';
$sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
';

// Add main pages
$mainPages = [
    '/',
    '/jobs/',
    '/post-job/',
    '/contact/',
    '/employer-reviews/',
    '/employers/',
];

foreach ($mainPages as $page) {
    $sitemapContent .= "  <url>\n";
    $sitemapContent .= "    <loc>{$baseUrl}{$page}</loc>\n";
    $sitemapContent .= "    <changefreq>daily</changefreq>\n";
    $sitemapContent .= "    <priority>0.8</priority>\n";
    $sitemapContent .= "  </url>\n";
}

// Add all job pages
foreach ($jobs as $job) {
    $jobId = $job['identifier']['value'] ?? $job['id'] ?? '';
    if (empty($jobId)) continue;
    
    $jobUrl = $baseUrl . '/jobs/' . urlencode($jobId) . '/';
    $lastmod = !empty($job['datePosted']) ? date('Y-m-d', strtotime($job['datePosted'])) : date('Y-m-d');
    
    $sitemapContent .= "  <url>\n";
    $sitemapContent .= "    <loc>{$jobUrl}</loc>\n";
    $sitemapContent .= "    <lastmod>{$lastmod}</lastmod>\n";
    $sitemapContent .= "    <changefreq>weekly</changefreq>\n";
    $sitemapContent .= "    <priority>0.7</priority>\n";
    $sitemapContent .= "  </url>\n";
}

$sitemapContent .= '</urlset>';

// Write sitemap
file_put_contents($sitemapFile, $sitemapContent);

echo "Sitemap updated with " . count($jobs) . " job listings\n";
echo "Sitemap saved to: {$sitemapFile}\n";

