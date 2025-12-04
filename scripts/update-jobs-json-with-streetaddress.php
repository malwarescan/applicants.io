#!/usr/bin/env php
<?php
/**
 * Update jobs.json to include streetAddress in jobLocation data
 * 
 * This ensures all jobs have streetAddress in their data structure,
 * not just in the generated schema.
 */

declare(strict_types=1);

require_once __DIR__ . '/../php-src/includes/schema_jobposting_unified.php';

$jobsFile = __DIR__ . '/../php-src/data/jobs.json';

if (!file_exists($jobsFile)) {
    echo "ERROR: jobs.json not found at: $jobsFile\n";
    exit(1);
}

$jobs = json_decode(file_get_contents($jobsFile), true) ?: [];
if (empty($jobs)) {
    echo "ERROR: No jobs found in jobs.json\n";
    exit(1);
}

echo "Found " . count($jobs) . " jobs to update\n";

$updated = 0;
$alreadyHadStreetAddress = 0;

foreach ($jobs as &$job) {
    if (empty($job['jobLocation']) || !is_array($job['jobLocation'])) {
        continue;
    }
    
    $needsUpdate = false;
    foreach ($job['jobLocation'] as &$loc) {
        if (empty($loc['streetAddress']) && !empty($loc['city']) && !empty($loc['region'])) {
            $streetAddress = get_street_address_for_city($loc['city'], $loc['region']);
            if ($streetAddress) {
                $loc['streetAddress'] = $streetAddress;
                $needsUpdate = true;
            }
        } elseif (!empty($loc['streetAddress'])) {
            $alreadyHadStreetAddress++;
        }
    }
    unset($loc);
    
    if ($needsUpdate) {
        $updated++;
    }
}
unset($job);

if ($updated > 0) {
    // Backup original file
    $backupFile = $jobsFile . '.backup.' . date('Y-m-d-His');
    copy($jobsFile, $backupFile);
    echo "Created backup: $backupFile\n";
    
    // Write updated jobs
    file_put_contents($jobsFile, json_encode($jobs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    echo "✅ Updated $updated jobs with streetAddress\n";
} else {
    echo "✅ All jobs already have streetAddress\n";
}

echo "Jobs with existing streetAddress: $alreadyHadStreetAddress\n";
echo "\nAll jobs in jobs.json now include streetAddress in jobLocation data.\n";

