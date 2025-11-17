<?php
/**
 * Job Application Submission API
 * 
 * Accepts job applications submitted through ChatGPT or other integrations
 */

require __DIR__.'/../app/bootstrap.php';
use App\Data;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

// Validate required fields
$requiredFields = ['job_id', 'applicant_name', 'applicant_email'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Validate email
if (!filter_var($input['applicant_email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Verify job exists
$jobs = Data::readJson('data/jobs.json');
$job = null;
foreach ($jobs as $j) {
    if (($j['id'] ?? '') === $input['job_id'] || 
        ($j['identifier']['value'] ?? '') === $input['job_id']) {
        $job = $j;
        break;
    }
}

if (!$job) {
    http_response_code(404);
    echo json_encode(['error' => 'Job not found']);
    exit;
}

// Prepare application data
$application = [
    'job_id' => $input['job_id'],
    'job_title' => $job['title'] ?? '',
    'applicant_name' => $input['applicant_name'],
    'applicant_email' => $input['applicant_email'],
    'applicant_phone' => $input['applicant_phone'] ?? '',
    'resume_url' => $input['resume_url'] ?? '',
    'cover_letter' => $input['cover_letter'] ?? '',
    'additional_info' => $input['additional_info'] ?? '',
    'source' => $input['source'] ?? 'chatgpt',
    'submitted_at' => date('Y-m-d H:i:s'),
    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
];

// Save application (you can customize this to save to database, send email, etc.)
$applicationsFile = __DIR__ . '/../data/applications.json';
$applications = [];
if (file_exists($applicationsFile)) {
    $applications = json_decode(file_get_contents($applicationsFile), true) ?: [];
}
$applications[] = $application;
file_put_contents($applicationsFile, json_encode($applications, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Get application contact info from job
$appContact = $job['applicationContact'] ?? [];
$applicationEmail = $appContact['email'] ?? $job['contactEmail'] ?? 'careers@synaxusinc.com';
$applicationPhone = $appContact['phone'] ?? $job['contactPhone'] ?? '';
$applicationUrl = $appContact['url'] ?? 'https://www.synaxusinc.com/apply.php';

// TODO: Send email notification (implement email sending here)
// TODO: Forward to employer's application system if needed

echo json_encode([
    'success' => true,
    'message' => 'Application submitted successfully',
    'application_id' => uniqid('APP-', true),
    'application' => [
        'job_title' => $application['job_title'],
        'applicant_name' => $application['applicant_name'],
        'submitted_at' => $application['submitted_at'],
    ],
    'next_steps' => [
        'message' => 'Your application has been received. The employer will contact you directly.',
        'employer_email' => $applicationEmail,
        'employer_phone' => $applicationPhone,
        'application_url' => $applicationUrl,
    ],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

