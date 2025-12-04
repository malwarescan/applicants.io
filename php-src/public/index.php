<?php
// Handle sitemap requests FIRST before anything else
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

// Direct sitemap.xml handling - CHECK FIRST BEFORE ANYTHING ELSE
if ($uri === '/sitemap.xml') {
    // Try all possible paths
    $possiblePaths = [
        __DIR__ . '/sitemap.xml',                    // Current directory (public/)
        __DIR__ . '/../public/sitemap.xml',          // php-src/public/
        __DIR__ . '/../dist/sitemap.xml',            // php-src/dist/
        dirname(__DIR__) . '/public/sitemap.xml',    // Alternative
        dirname(__DIR__) . '/dist/sitemap.xml',      // Alternative dist
    ];
    
    foreach ($possiblePaths as $sitemapFile) {
        if (file_exists($sitemapFile) && is_readable($sitemapFile)) {
            header('Content-Type: application/xml; charset=utf-8');
            header('Cache-Control: public, max-age=3600');
            readfile($sitemapFile);
            exit;
        }
    }
    
    // Generate on-the-fly if file not found
    header('Content-Type: application/xml; charset=utf-8');
    http_response_code(200);
    echo '<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://applicants.io/sitemaps/main.xml</loc><lastmod>' . date('Y-m-d') . '</lastmod></sitemap>
  <sitemap><loc>https://applicants.io/sitemaps/categories.xml</loc><lastmod>' . date('Y-m-d') . '</lastmod></sitemap>
  <sitemap><loc>https://applicants.io/sitemaps/locations.xml</loc><lastmod>' . date('Y-m-d') . '</lastmod></sitemap>
  <sitemap><loc>https://applicants.io/sitemaps/category-location.xml</loc><lastmod>' . date('Y-m-d') . '</lastmod></sitemap>
  <sitemap><loc>https://applicants.io/sitemaps/blog.xml</loc><lastmod>' . date('Y-m-d') . '</lastmod></sitemap>
</sitemapindex>';
    exit;
}

// Handle sitemaps/*.xml
if (preg_match('#^/sitemaps/([^/]+\.xml)$#', $uri, $matches)) {
    $file = $matches[1];
    // Try all possible paths
    $possiblePaths = [
        __DIR__ . '/sitemaps/' . $file,
        __DIR__ . '/../public/sitemaps/' . $file,
        __DIR__ . '/../dist/sitemaps/' . $file,
        dirname(__DIR__) . '/public/sitemaps/' . $file,
        dirname(__DIR__) . '/dist/sitemaps/' . $file,
    ];
    
    foreach ($possiblePaths as $sitemapFile) {
        if (file_exists($sitemapFile) && is_readable($sitemapFile)) {
            header('Content-Type: application/xml; charset=utf-8');
            header('Cache-Control: public, max-age=3600');
            readfile($sitemapFile);
            exit;
        }
    }
    
    http_response_code(404);
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?><error><message>Sitemap chunk not found</message></error>';
    exit;
}

require __DIR__ . '/../app/bootstrap.php';
use App\Router;
$router = new Router($uri);
$routes = require __DIR__ . '/../routes.web.php';
[$head, $body] = $router->dispatch($routes);
require __DIR__ . '/../views/layout.php';