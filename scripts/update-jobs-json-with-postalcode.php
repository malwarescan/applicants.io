#!/usr/bin/env php
<?php
/**
 * Update jobs.json to include postalCode in jobLocation data
 * 
 * This ensures all jobs have postalCode in their data structure,
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
$alreadyHadPostalCode = 0;

foreach ($jobs as &$job) {
    if (empty($job['jobLocation']) || !is_array($job['jobLocation'])) {
        continue;
    }
    
    $needsUpdate = false;
    foreach ($job['jobLocation'] as &$loc) {
        if (empty($loc['postalCode']) && !empty($loc['city']) && !empty($loc['region'])) {
            $postalCode = get_postal_code_for_city($loc['city'], $loc['region']);
            if ($postalCode) {
                $loc['postalCode'] = $postalCode;
                $needsUpdate = true;
            }
        } elseif (!empty($loc['postalCode'])) {
            $alreadyHadPostalCode++;
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
    echo "✅ Updated $updated jobs with postalCode\n";
} else {
    echo "✅ All jobs already have postalCode\n";
}

echo "Jobs with existing postalCode: $alreadyHadPostalCode\n";
echo "\nAll jobs in jobs.json now include postalCode in jobLocation data.\n";

