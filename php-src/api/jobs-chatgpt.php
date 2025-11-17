<?php
/**
 * ChatGPT-Optimized Jobs API
 * 
 * Returns job listings in a format optimized for ChatGPT consumption
 * Includes all necessary fields for job search and application
 */

require __DIR__.'/../app/bootstrap.php';
use App\Data;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$jobs = Data::readJson('data/jobs.json');

// Apply filters
$searchQuery = $_GET['q'] ?? $_GET['search'] ?? '';
$location = $_GET['location'] ?? $_GET['city'] ?? '';
$industry = $_GET['industry'] ?? $_GET['category'] ?? '';
$employmentType = $_GET['employment_type'] ?? $_GET['type'] ?? '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// Filter jobs
$filteredJobs = array_filter($jobs, function($job) use ($searchQuery, $location, $industry, $employmentType) {
    // Text search
    if (!empty($searchQuery)) {
        $searchFields = [
            $job['title'] ?? '',
            $job['company'] ?? '',
            $job['location'] ?? '',
            $job['industry'] ?? '',
            strip_tags($job['description'] ?? ''),
        ];
        $matchesSearch = false;
        foreach ($searchFields as $field) {
            if (stripos($field, $searchQuery) !== false) {
                $matchesSearch = true;
                break;
            }
        }
        if (!$matchesSearch) return false;
    }
    
    // Location filter
    if (!empty($location)) {
        $jobLocation = strtolower($job['location'] ?? '');
        if (stripos($jobLocation, strtolower($location)) === false) {
            return false;
        }
    }
    
    // Industry filter
    if (!empty($industry)) {
        $jobIndustry = strtolower($job['industry'] ?? '');
        if (stripos($jobIndustry, strtolower($industry)) === false) {
            return false;
        }
    }
    
    // Employment type filter
    if (!empty($employmentType)) {
        $jobTypes = $job['employmentType'] ?? [];
        if (is_string($jobTypes)) {
            $jobTypes = [$jobTypes];
        }
        $typeMap = [
            'full-time' => 'FULL_TIME',
            'part-time' => 'PART_TIME',
            'contract' => 'CONTRACTOR',
            'contractor' => 'CONTRACTOR',
            'temporary' => 'TEMPORARY',
            'intern' => 'INTERN',
        ];
        $searchType = $typeMap[strtolower($employmentType)] ?? strtoupper($employmentType);
        if (!in_array($searchType, $jobTypes)) {
            return false;
        }
    }
    
    return true;
});

// Sort by date posted (newest first)
usort($filteredJobs, function($a, $b) {
    $dateA = strtotime($a['datePosted'] ?? $a['postedDate'] ?? '1970-01-01');
    $dateB = strtotime($b['datePosted'] ?? $b['postedDate'] ?? '1970-01-01');
    return $dateB - $dateA;
});

// Apply pagination
$total = count($filteredJobs);
$paginatedJobs = array_slice($filteredJobs, $offset, $limit);

// Format jobs for ChatGPT
$formattedJobs = array_map(function($job) {
    // Format employment type
    $empTypes = $job['employmentType'] ?? [];
    if (is_string($empTypes)) {
        $empTypes = [$empTypes];
    }
    $empTypeLabels = [
        'FULL_TIME' => 'Full-time',
        'PART_TIME' => 'Part-time',
        'CONTRACTOR' => 'Contractor',
        'TEMPORARY' => 'Temporary',
        'INTERN' => 'Internship',
    ];
    $employmentTypeDisplay = array_map(function($type) use ($empTypeLabels) {
        return $empTypeLabels[$type] ?? $type;
    }, $empTypes);
    
    // Format salary
    $salaryDisplay = null;
    if (!empty($job['baseSalary'])) {
        $sal = $job['baseSalary'];
        $currency = $sal['currency'] ?? 'USD';
        $unit = $sal['unitText'] ?? 'YEAR';
        $min = $sal['minValue'] ?? null;
        $max = $sal['maxValue'] ?? null;
        
        if ($min && $max) {
            if ($unit === 'HOUR') {
                $salaryDisplay = '$' . number_format($min, 2) . ' - $' . number_format($max, 2) . ' per hour';
            } else {
                $salaryDisplay = '$' . number_format($min) . ' - $' . number_format($max) . ' per ' . strtolower($unit);
            }
        } elseif ($min) {
            if ($unit === 'HOUR') {
                $salaryDisplay = 'Starting at $' . number_format($min, 2) . ' per hour';
            } else {
                $salaryDisplay = 'Starting at $' . number_format($min) . ' per ' . strtolower($unit);
            }
        }
    } elseif (!empty($job['compensation'])) {
        $salaryDisplay = $job['compensation'];
    }
    
    // Format location
    $locationDisplay = $job['location'] ?? '';
    if (!empty($job['jobLocation'])) {
        $locations = [];
        foreach ($job['jobLocation'] as $loc) {
            $parts = array_filter([$loc['city'] ?? '', $loc['region'] ?? '']);
            if (!empty($parts)) {
                $locations[] = implode(', ', $parts);
            }
        }
        if (!empty($locations)) {
            $locationDisplay = implode('; ', $locations);
        }
    }
    
    // Build application URL
    $jobId = $job['identifier']['value'] ?? $job['id'] ?? '';
    $applicationUrl = 'https://www.applicants.io/jobs/' . urlencode($jobId) . '/';
    
    // Get application contact
    $appContact = $job['applicationContact'] ?? [];
    $applicationEmail = $appContact['email'] ?? $job['contactEmail'] ?? '';
    $applicationPhone = $appContact['phone'] ?? $job['contactPhone'] ?? '';
    $applicationUrlExternal = $appContact['url'] ?? '';
    
    // Generate SMS link with prefilled message
    $smsPhone = '+13147746099';
    $jobTitle = $job['title'] ?? '';
    $smsMessage = 'Hi, I\'m interested in applying for the ' . $jobTitle . ' position in ' . $locationDisplay . '.';
    $smsLink = 'sms:' . $smsPhone . '?body=' . urlencode($smsMessage);
    
    return [
        'id' => $job['id'] ?? '',
        'job_id' => $jobId,
        'title' => $jobTitle,
        'company' => $job['hiringOrganization']['name'] ?? $job['company'] ?? '',
        'location' => $locationDisplay,
        'employment_type' => $employmentTypeDisplay,
        'job_location_type' => $job['jobLocationType'] ?? null, // 'ON_SITE', 'REMOTE', 'HYBRID'
        'salary' => $salaryDisplay,
        'salary_details' => $job['baseSalary'] ?? null,
        'description' => strip_tags($job['description'] ?? ''),
        'description_html' => $job['description'] ?? '',
        'qualifications' => strip_tags($job['qualifications'] ?? ''),
        'responsibilities' => strip_tags($job['responsibilities'] ?? ''),
        'skills' => $job['skills'] ?? '',
        'benefits' => strip_tags($job['benefits'] ?? ''),
        'industry' => $job['industry'] ?? '',
        'category' => $job['industry'] ?? '',
        'date_posted' => $job['datePosted'] ?? $job['postedDate'] ?? '',
        'valid_through' => $job['validThrough'] ?? null,
        'application_url' => $applicationUrl,
        'application_email' => $applicationEmail,
        'application_phone' => $applicationPhone,
        'application_url_external' => $applicationUrlExternal,
        'application_sms' => $smsLink,
        'application_sms_phone' => $smsPhone,
        'application_sms_message' => $smsMessage,
        'direct_apply' => $job['directApply'] ?? false,
        'company_url' => $job['hiringOrganization']['sameAs'] ?? '',
        'company_logo' => $job['hiringOrganization']['logo'] ?? '',
    ];
}, $paginatedJobs);

echo json_encode([
    'success' => true,
    'jobs' => $formattedJobs,
    'pagination' => [
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset,
        'has_more' => ($offset + $limit) < $total,
    ],
    'filters_applied' => [
        'search' => $searchQuery,
        'location' => $location,
        'industry' => $industry,
        'employment_type' => $employmentType,
    ],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

