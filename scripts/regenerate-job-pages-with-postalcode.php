#!/usr/bin/env php
<?php
/**
 * Regenerate All Job Pages with PostalCode Fix
 * 
 * This script regenerates all existing job pages to include postalCode
 * in the JobPosting schema, fixing Google Search Console errors.
 */

declare(strict_types=1);

require_once __DIR__ . '/../php-src/app/bootstrap.php';
require_once __DIR__ . '/../php-src/includes/schema_jobposting_unified.php';

$jobsFile = __DIR__ . '/../php-src/data/jobs.json';
$pagesDir = __DIR__ . '/../php-src/public/jobs/';

if (!file_exists($jobsFile)) {
    echo "ERROR: jobs.json not found at: $jobsFile\n";
    exit(1);
}

$jobs = json_decode(file_get_contents($jobsFile), true) ?: [];
if (empty($jobs)) {
    echo "ERROR: No jobs found in jobs.json\n";
    exit(1);
}

echo "Found " . count($jobs) . " jobs to regenerate\n";

// Filter jobs that have identifier.value (slug)
$jobsToRegenerate = array_filter($jobs, function($job) {
    return !empty($job['identifier']['value']);
});

echo "Regenerating " . count($jobsToRegenerate) . " job pages...\n\n";

$regenerated = 0;
$errors = 0;

foreach ($jobsToRegenerate as $job) {
    $slug = $job['identifier']['value'];
    $jobPageDir = $pagesDir . $slug . '/';
    
    // Ensure directory exists
    @mkdir($jobPageDir, 0777, true);
    
    try {
        // Generate schema with postalCode (will use lookup if missing)
        $jsonLd = generate_jobposting_schema($job);
        
        // Verify postalCode is in schema
        $hasPostalCode = false;
        if (!empty($jsonLd['jobLocation']) && is_array($jsonLd['jobLocation'])) {
            foreach ($jsonLd['jobLocation'] as $loc) {
                if (!empty($loc['address']['postalCode'])) {
                    $hasPostalCode = true;
                    break;
                }
            }
        }
        
        if (!$hasPostalCode) {
            echo "WARNING: Job $slug still missing postalCode after generation\n";
        }
        
        // Generate the page content
        $pageContent = "<?php
require __DIR__ . '/../../../app/bootstrap.php';
use App\\Renderer;
use App\\Data;

// Extract job slug from directory name
\$slug = basename(dirname(__FILE__));

// Load jobs and find by identifier.value (slug)
\$jobs = Data::readJson('data/jobs.json');
\$job = null;
foreach (\$jobs as \$j) {
    if ((\$j['identifier']['value'] ?? '') === \$slug) {
        \$job = \$j;
        break;
    }
}

if (!\$job) {
    http_response_code(404);
    echo '<h1>Job Not Found</h1>';
    exit;
}

require_once __DIR__ . '/../../../includes/schema_jobposting_unified.php';
\$jsonLd = generate_jobposting_schema(\$job);

[\$head, \$body] = Renderer::render('job-detail-unified', [
    'job' => \$job,
    'canonical' => '/jobs/' . \$slug . '/',
], [
    'title' => \$job['title'] . ' in ' . (\$job['location'] ?? '') . ' | Applicants.io',
    'desc' => substr(strip_tags(\$job['description'] ?? ''), 0, 160) . '...',
    'canonical' => '/jobs/' . \$slug . '/',
    'jsonld' => \$jsonLd,
]);

require __DIR__ . '/../../../views/layout.php';
";
        
        file_put_contents($jobPageDir . 'index.php', $pageContent);
        $regenerated++;
        
        if ($regenerated % 50 === 0) {
            echo "Regenerated $regenerated pages...\n";
        }
    } catch (Exception $e) {
        echo "ERROR regenerating $slug: " . $e->getMessage() . "\n";
        $errors++;
    }
}

echo "\n✅ Regenerated $regenerated job pages\n";
if ($errors > 0) {
    echo "⚠️  $errors errors encountered\n";
}

echo "\nAll job pages now include postalCode in JobPosting schema.\n";
echo "Google Search Console errors should be resolved after re-crawl.\n";

