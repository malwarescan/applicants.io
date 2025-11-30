<?php
/**
 * Clean Sitemap - Remove Invalid URLs
 * Removes URLs that return 404s and ensures only valid URLs are in sitemap
 */

require __DIR__ . '/../php-src/app/bootstrap.php';
use App\Data;

$sitemapFile = __DIR__ . '/../php-src/public/sitemap.xml';
if (!file_exists($sitemapFile)) {
    echo "Sitemap file not found: $sitemapFile\n";
    exit(1);
}
$sitemapContent = file_get_contents($sitemapFile);
if (empty($sitemapContent)) {
    echo "Sitemap file is empty: $sitemapFile\n";
    exit(1);
}
echo "Loading sitemap from: $sitemapFile\n";
echo "Sitemap size: " . strlen($sitemapContent) . " bytes\n";

// Load jobs to get valid slugs
$jobs = Data::readJson('data/jobs.json');
$validJobSlugs = [];
foreach ($jobs as $job) {
    $slug = $job['identifier']['value'] ?? $job['id'] ?? null;
    if ($slug) {
        $validJobSlugs[] = $slug;
    }
}

// Valid static pages
$validPages = [
    '/',
    '/jobs/',
    '/post-job/',
    '/contact/',
    '/privacy-policy/',
    '/employer-reviews/',
    '/employers/',
    '/employers/synaxus/',
];

// Valid category slugs (extract from jobs)
$validCategories = [];
$industries = array_unique(array_column($jobs, 'industry'));
foreach ($industries as $industry) {
    $category = strtolower(str_replace(' ', '-', $industry));
    $validCategories[] = "/jobs/category/$category/";
}

// Parse XML
$xml = new DOMDocument();
$xml->preserveWhiteSpace = false;
$xml->formatOutput = true;
$xml->loadXML($sitemapContent);
$xpath = new DOMXPath($xml);
$xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');

// Find all URL nodes (try with and without namespace)
$urlNodes = $xpath->query('//s:url');
if ($urlNodes->length === 0) {
    // Try without namespace
    $urlNodes = $xpath->query('//url');
}

$removed = 0;
$kept = 0;

foreach ($urlNodes as $urlNode) {
    $locNode = $xpath->query('./s:loc', $urlNode)->item(0);
    if (!$locNode) {
        $locNode = $xpath->query('./loc', $urlNode)->item(0);
    }
    if (!$locNode) continue;
    
    $url = trim($locNode->nodeValue);
    
    // Extract path from full URL
    $path = parse_url($url, PHP_URL_PATH);
    if (!$path) continue;
    
    // Ensure trailing slash for consistency
    if ($path !== '/' && substr($path, -1) !== '/') {
        $path .= '/';
    }
    
    $isValid = false;
    
    // Check if it's a valid static page
    if (in_array($path, $validPages)) {
        $isValid = true;
    }
    
    // Check if it's a valid category page
    if (in_array($path, $validCategories)) {
        $isValid = true;
    }
    
    // Check if it's a valid job page
    if (preg_match('#^/jobs/([^/]+)/?$#', $path, $matches)) {
        $slug = $matches[1];
        // Remove numeric IDs (old format)
        if (is_numeric($slug)) {
            // Try to find matching job by ID
            $jobFound = false;
            foreach ($jobs as $job) {
                if ($job['id'] === $slug) {
                    $newSlug = $job['identifier']['value'] ?? $slug;
                    // Update URL to new slug
                    $locNode->nodeValue = str_replace("/jobs/$slug/", "/jobs/$newSlug/", $url);
                    $isValid = true;
                    $jobFound = true;
                    break;
                }
            }
            if (!$jobFound) {
                $isValid = false; // Remove old numeric IDs
            }
        } elseif (in_array($slug, $validJobSlugs)) {
            $isValid = true;
        } else {
            $isValid = false; // Invalid slug
        }
    }
    
    // Remove invalid URLs
    if (!$isValid) {
        $urlNode->parentNode->removeChild($urlNode);
        $removed++;
        echo "Removed: $url\n";
    } else {
        $kept++;
    }
}

// Save cleaned sitemap
$cleanedSitemap = $xml->saveXML();
file_put_contents($sitemapFile, $cleanedSitemap);

// Also update public sitemap
$publicSitemapFile = __DIR__ . '/../public/sitemap.xml';
if (file_exists($publicSitemapFile)) {
    file_put_contents($publicSitemapFile, $cleanedSitemap);
}

echo "\n";
echo "Sitemap cleaned!\n";
echo "Kept: $kept URLs\n";
echo "Removed: $removed URLs\n";

