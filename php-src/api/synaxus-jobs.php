<?php
/**
 * Synaxus Jobs API Endpoint
 * 
 * Provides access to Synaxus job postings scraped from synaxusinc.com
 * Returns jobs in both our internal format and raw JobPosting schema format
 */

declare(strict_types=1);

require_once __DIR__ . '/../app/bootstrap.php';

// Only set headers if running as web request
if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Path to the scraped jobs data
$jobsFile = __DIR__ . '/../../data/synaxus_jobs.json';

// Load jobs from JSON file
function loadSynaxusJobs(): array {
    global $jobsFile;
    
    if (!file_exists($jobsFile)) {
        return ['success' => false, 'error' => 'Jobs data not found. Please run the scraper first.'];
    }
    
    $data = json_decode(file_get_contents($jobsFile), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['success' => false, 'error' => 'Failed to parse jobs data'];
    }
    
    return [
        'success' => true,
        'jobs' => $data['jobs'] ?? [],
        'meta' => $data['meta'] ?? [],
        'lastUpdated' => $data['meta']['lastUpdated'] ?? null,
        'totalJobs' => count($data['jobs'] ?? [])
    ];
}

// Handle GET request or CLI execution
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($requestMethod === 'GET' || php_sapi_name() === 'cli') {
    $response = loadSynaxusJobs();
    
    // If there's an error and it's because the file doesn't exist, try to run the scraper
    if (!$response['success'] && isset($response['error']) && strpos($response['error'], 'not found') !== false) {
        // Try to run the scraper
        $scraperPath = __DIR__ . '/../../scripts/scrape-synaxus-jobs.php';
        if (file_exists($scraperPath)) {
            exec("php " . escapeshellarg($scraperPath) . " --save 2>&1", $output, $returnCode);
            
            if ($returnCode === 0) {
                // Retry loading jobs
                $response = loadSynaxusJobs();
            }
        }
    }
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} else {
    if (php_sapi_name() !== 'cli') {
        http_response_code(405);
    }
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
