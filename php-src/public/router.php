<?php
/**
 * Router script for PHP built-in server
 * This ensures all requests go through index.php
 */

// CRITICAL: Handle sitemap requests FIRST - BEFORE ANYTHING ELSE
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestPath = parse_url($requestUri, PHP_URL_PATH);

if ($requestPath === '/sitemap.xml' || preg_match('#^/sitemaps/.*\.xml$#', $requestPath)) {
    // Route directly to index.php - it will generate on-the-fly
    $_SERVER['REQUEST_URI'] = $requestPath; // Ensure URI is set
    require __DIR__ . '/index.php';
    exit;
}

// Handle www redirects (ensure consistency)
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($host === 'applicants.io' && strpos($host, 'www.') === false) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $path = $_SERVER['REQUEST_URI'] ?? '/';
    header("Location: $protocol://www.applicants.io$path", true, 301);
    exit;
}

// If the requested file exists and is not index.php, serve it directly

// Serve static files directly if they exist (BUT NOT sitemap XML files - handled above)
$filePath = __DIR__ . $requestPath;
if ($requestPath !== '/' && file_exists($filePath) && is_file($filePath)) {
    // Don't serve PHP files directly (except index.php)
    if (pathinfo($filePath, PATHINFO_EXTENSION) === 'php' && basename($filePath) !== 'index.php') {
        // Let index.php handle it
    } else {
        // Don't serve sitemap XML files here - they're handled above
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        if ($extension === 'xml' && (strpos($requestPath, '/sitemap') === 0 || strpos($requestPath, '/sitemaps/') === 0)) {
            // This should never happen due to check above, but just in case
            require __DIR__ . '/index.php';
            exit;
        }
        // Serve other static files (images, CSS, JS, etc.)
        return false;
    }
}

// All other requests go through index.php
require __DIR__ . '/index.php';

