<?php
/**
 * Fix Job Location Types in jobs.json
 * Updates invalid enum values to valid schema.org values
 */

require __DIR__ . '/../php-src/app/bootstrap.php';
use App\Data;

$jobsFile = __DIR__ . '/../php-src/data/jobs.json';
$jobs = Data::readJson('data/jobs.json');

$updated = 0;
$skipped = 0;

foreach ($jobs as &$job) {
    if (empty($job['jobLocationType'])) {
        $skipped++;
        continue;
    }
    
    $locType = strtoupper(trim($job['jobLocationType']));
    
    // Map invalid values to valid ones or remove
    if ($locType === 'REMOTE') {
        $job['jobLocationType'] = 'TELECOMMUTE';
        $updated++;
    } elseif ($locType === 'ON_SITE') {
        // Remove ON_SITE - it's not a valid schema.org enum value
        // On-site is implied by having jobLocation with address
        unset($job['jobLocationType']);
        $updated++;
    } elseif ($locType === 'HYBRID') {
        // Remove HYBRID - it's not a valid schema.org enum value
        unset($job['jobLocationType']);
        $updated++;
    } elseif ($locType === 'TELECOMMUTE') {
        // Already correct
        $skipped++;
    } else {
        // Unknown value - remove it
        unset($job['jobLocationType']);
        $updated++;
    }
}

// Save updated jobs
file_put_contents($jobsFile, json_encode($jobs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

echo "Job location types fixed!\n";
echo "Updated: $updated jobs\n";
echo "Skipped (already correct): $skipped jobs\n";
echo "Total jobs: " . count($jobs) . "\n";

