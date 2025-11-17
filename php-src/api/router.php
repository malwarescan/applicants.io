<?php
require __DIR__.'/../app/bootstrap.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove /api prefix
$path = substr($uri, 4);

// Route API endpoints
switch ($path) {
    case '/post-job':
        if ($method === 'POST') {
            require __DIR__.'/post-job.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/contact':
        if ($method === 'POST') {
            require __DIR__.'/contact.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/jobs':
        if ($method === 'GET') {
            require __DIR__.'/jobs.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/jobs-chatgpt':
        if ($method === 'GET') {
            require __DIR__.'/jobs-chatgpt.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/apply-job':
        if ($method === 'POST') {
            require __DIR__.'/apply-job.php';
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        break;
}
