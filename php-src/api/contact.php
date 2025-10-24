<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Validate required fields
$required = ['name', 'email', 'subject', 'message'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input
$contactData = [
    'name' => htmlspecialchars($_POST['name']),
    'email' => htmlspecialchars($_POST['email']),
    'subject' => htmlspecialchars($_POST['subject']),
    'message' => htmlspecialchars($_POST['message']),
    'timestamp' => date('Y-m-d H:i:s')
];

// In a real application, you would save this to a database or send an email
// For now, we'll just return success
echo json_encode([
    'success' => true,
    'message' => 'Message sent successfully',
    'data' => $contactData
]);
