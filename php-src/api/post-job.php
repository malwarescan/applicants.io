<?php
use App\Data;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Validate required fields
$required = ['title', 'company', 'location', 'industry', 'description', 'email'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input
$jobData = [
    'id' => uniqid(),
    'title' => htmlspecialchars($_POST['title']),
    'company' => htmlspecialchars($_POST['company']),
    'location' => htmlspecialchars($_POST['location']),
    'industry' => htmlspecialchars($_POST['industry']),
    'description' => htmlspecialchars($_POST['description']),
    'contactEmail' => htmlspecialchars($_POST['email']),
    'contactPhone' => htmlspecialchars($_POST['phone'] ?? ''),
    'compensation' => htmlspecialchars($_POST['compensation'] ?? ''),
    'postedDate' => date('M j, Y')
];

// In a real application, you would save this to a database
// For now, we'll just return success
echo json_encode([
    'success' => true,
    'message' => 'Job posted successfully',
    'job' => $jobData
]);
