<?php
/**
 * Router script for PHP built-in server
 * This ensures all requests go through index.php
 */

// Handle www redirects (ensure consistency)
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($host === 'applicants.io' && strpos($host, 'www.') === false) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $path = $_SERVER['REQUEST_URI'] ?? '/';
    header("Location: $protocol://www.applicants.io$path", true, 301);
    exit;
}

// If the requested file exists and is not index.php, serve it directly
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Serve static files directly if they exist
$filePath = __DIR__ . $requestPath;
if ($requestPath !== '/' && file_exists($filePath) && is_file($filePath)) {
    // Don't serve PHP files directly (except index.php)
    if (pathinfo($filePath, PATHINFO_EXTENSION) === 'php' && basename($filePath) !== 'index.php') {
        // Let index.php handle it
    } else {
        // Handle XML files with proper Content-Type
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        if ($extension === 'xml') {
            header('Content-Type: application/xml; charset=utf-8');
            readfile($filePath);
            exit;
        }
        // Serve other static files (images, CSS, JS, etc.)
        return false;
    }
}

// All other requests go through index.php
require __DIR__ . '/index.php';

