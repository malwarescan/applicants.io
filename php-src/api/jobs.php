<?php
use App\Data;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$jobs = Data::getJobs();

// Apply filters if provided
$searchQuery = $_GET['q'] ?? '';
$locations = $_GET['locations'] ?? [];
$industries = $_GET['industries'] ?? [];

if (!empty($searchQuery) || !empty($locations) || !empty($industries)) {
    $jobs = array_filter($jobs, function($job) use ($searchQuery, $locations, $industries) {
        // Text search filter
        $matchesSearch = empty($searchQuery) || 
            stripos($job['title'], $searchQuery) !== false || 
            stripos($job['company'], $searchQuery) !== false || 
            stripos($job['location'], $searchQuery) !== false || 
            stripos($job['industry'], $searchQuery) !== false ||
            stripos($job['description'], $searchQuery) !== false;
        
        // Location filter
        $matchesLocation = empty($locations) || in_array($job['location'], $locations);
        
        // Industry filter
        $matchesIndustry = empty($industries) || in_array($job['industry'], $industries);
        
        return $matchesSearch && $matchesLocation && $matchesIndustry;
    });
}

echo json_encode([
    'success' => true,
    'jobs' => array_values($jobs),
    'total' => count($jobs)
]);
