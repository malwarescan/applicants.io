<?php
/**
 * Regenerate Clean Sitemap - Only Valid URLs
 * Creates a new sitemap with only valid, non-404 URLs
 */

require __DIR__ . '/../php-src/app/bootstrap.php';
use App\Data;

$outputFile = __DIR__ . '/../php-src/public/sitemap.xml';

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
    ['url' => 'https://www.applicants.io/', 'priority' => '0.8', 'changefreq' => 'daily'],
    ['url' => 'https://www.applicants.io/jobs/', 'priority' => '0.8', 'changefreq' => 'daily'],
    ['url' => 'https://www.applicants.io/post-job/', 'priority' => '0.8', 'changefreq' => 'daily'],
    ['url' => 'https://www.applicants.io/contact/', 'priority' => '0.8', 'changefreq' => 'daily'],
    ['url' => 'https://www.applicants.io/privacy-policy/', 'priority' => '0.8', 'changefreq' => 'monthly'],
    ['url' => 'https://www.applicants.io/employer-reviews/', 'priority' => '0.7', 'changefreq' => 'weekly'],
    ['url' => 'https://www.applicants.io/employers/', 'priority' => '0.7', 'changefreq' => 'weekly'],
    ['url' => 'https://www.applicants.io/employers/synaxus/', 'priority' => '0.7', 'changefreq' => 'weekly'],
];

// Valid category pages
$validCategories = [];
$industries = array_unique(array_column($jobs, 'industry'));
foreach ($industries as $industry) {
    $category = strtolower(str_replace(' ', '-', $industry));
    $validCategories[] = [
        'url' => "https://www.applicants.io/jobs/category/$category/",
        'priority' => '0.7',
        'changefreq' => 'weekly'
    ];
}

// Generate job URLs
$jobUrls = [];
foreach ($validJobSlugs as $slug) {
    $jobUrls[] = [
        'url' => "https://www.applicants.io/jobs/$slug/",
        'priority' => '0.7',
        'changefreq' => 'weekly',
        'lastmod' => date('Y-m-d')
    ];
}

// Build XML
$xml = new DOMDocument('1.0', 'UTF-8');
$xml->formatOutput = true;

$urlset = $xml->createElement('urlset');
$urlset->setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
$xml->appendChild($urlset);

// Add static pages
foreach ($validPages as $page) {
    $url = $xml->createElement('url');
    $loc = $xml->createElement('loc', $page['url']);
    $priority = $xml->createElement('priority', $page['priority']);
    $changefreq = $xml->createElement('changefreq', $page['changefreq']);
    
    $url->appendChild($loc);
    $url->appendChild($priority);
    $url->appendChild($changefreq);
    $urlset->appendChild($url);
}

// Add category pages
foreach ($validCategories as $category) {
    $url = $xml->createElement('url');
    // Escape special characters in URL
    $locUrl = htmlspecialchars($category['url'], ENT_XML1, 'UTF-8');
    $loc = $xml->createElement('loc', $locUrl);
    $priority = $xml->createElement('priority', $category['priority']);
    $changefreq = $xml->createElement('changefreq', $category['changefreq']);
    
    $url->appendChild($loc);
    $url->appendChild($priority);
    $url->appendChild($changefreq);
    $urlset->appendChild($url);
}

// Add job URLs
foreach ($jobUrls as $jobUrl) {
    $url = $xml->createElement('url');
    // Escape special characters in URL
    $locUrl = htmlspecialchars($jobUrl['url'], ENT_XML1, 'UTF-8');
    $loc = $xml->createElement('loc', $locUrl);
    $priority = $xml->createElement('priority', $jobUrl['priority']);
    $changefreq = $xml->createElement('changefreq', $jobUrl['changefreq']);
    
    if (isset($jobUrl['lastmod'])) {
        $lastmod = $xml->createElement('lastmod', $jobUrl['lastmod']);
        $url->appendChild($lastmod);
    }
    
    $url->appendChild($loc);
    $url->appendChild($priority);
    $url->appendChild($changefreq);
    $urlset->appendChild($url);
}

// Save sitemap
$xmlContent = $xml->saveXML();
file_put_contents($outputFile, $xmlContent);

// Also update public sitemap
$publicSitemapFile = __DIR__ . '/../public/sitemap.xml';
file_put_contents($publicSitemapFile, $xmlContent);

$totalUrls = count($validPages) + count($validCategories) + count($jobUrls);
echo "Sitemap regenerated!\n";
echo "Total URLs: $totalUrls\n";
echo "  - Static pages: " . count($validPages) . "\n";
echo "  - Category pages: " . count($validCategories) . "\n";
echo "  - Job pages: " . count($jobUrls) . "\n";
echo "Saved to: $outputFile\n";

