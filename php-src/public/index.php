<?php
// Handle sitemap requests FIRST before anything else
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

// Direct sitemap.xml handling
if ($uri === '/sitemap.xml') {
    $sitemapFile = __DIR__ . '/sitemap.xml';
    if (file_exists($sitemapFile)) {
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        readfile($sitemapFile);
        exit;
    }
    // Try dist/ as fallback
    $sitemapFile = __DIR__ . '/../dist/sitemap.xml';
    if (file_exists($sitemapFile)) {
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        readfile($sitemapFile);
        exit;
    }
}

// Handle sitemaps/*.xml
if (preg_match('#^/sitemaps/([^/]+\.xml)$#', $uri, $matches)) {
    $file = $matches[1];
    $sitemapFile = __DIR__ . '/sitemaps/' . $file;
    if (file_exists($sitemapFile)) {
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        readfile($sitemapFile);
        exit;
    }
    // Try dist/ as fallback
    $sitemapFile = __DIR__ . '/../dist/sitemaps/' . $file;
    if (file_exists($sitemapFile)) {
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        readfile($sitemapFile);
        exit;
    }
}

require __DIR__ . '/../app/bootstrap.php';
use App\Router;
$router = new Router($uri);
$routes = require __DIR__ . '/../routes.web.php';
[$head, $body] = $router->dispatch($routes);
require __DIR__ . '/../views/layout.php';