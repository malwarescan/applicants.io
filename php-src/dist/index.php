<?php
// Handle sitemap requests FIRST before anything else
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

// Direct sitemap.xml handling - CHECK FIRST BEFORE ANYTHING ELSE
if ($uri === '/sitemap.xml') {
    // Try all possible paths
    $possiblePaths = [
        __DIR__ . '/sitemap.xml',                    // Current directory (dist/)
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
    $chunkId = str_replace('.xml', '', $file);
    
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
    
    // Generate on-the-fly if file not found
    header('Content-Type: application/xml; charset=utf-8');
    http_response_code(200);
    
    // Generate basic sitemap chunk based on chunkId
    $base = 'https://applicants.io';
    $now = date('Y-m-d');
    
    // Define URLs for each chunk type
    $chunkUrls = [
        'main' => [
            $base . '/',
            $base . '/jobs',
            $base . '/enhanced-jobs',
            $base . '/enhanced-post-job',
            $base . '/contact',
            $base . '/blog',
        ],
        'categories' => [
            $base . '/jobs/category/software-engineer',
            $base . '/jobs/category/marketing-manager',
            $base . '/jobs/category/registered-nurse',
            $base . '/jobs/category/sales-representative',
            $base . '/jobs/category/data-analyst',
            $base . '/jobs/category/customer-service',
            $base . '/jobs/category/project-manager',
            $base . '/jobs/category/accountant',
            $base . '/jobs/category/human-resources',
            $base . '/jobs/category/operations-manager',
        ],
        'locations' => [
            $base . '/jobs/florida/',
            $base . '/jobs/florida/miami/',
            $base . '/jobs/florida/orlando/',
            $base . '/jobs/florida/tampa/',
            $base . '/jobs/texas/',
            $base . '/jobs/texas/austin/',
            $base . '/jobs/texas/houston/',
            $base . '/jobs/texas/dallas/',
            $base . '/jobs/california/',
            $base . '/jobs/california/san-francisco/',
            $base . '/jobs/california/los-angeles/',
            $base . '/jobs/new-york/',
            $base . '/jobs/new-york/new-york-city/',
            $base . '/jobs/remote/',
        ],
        'category-location' => [
            $base . '/jobs/florida/miami/software-engineer/',
            $base . '/jobs/texas/austin/software-engineer/',
            $base . '/jobs/california/san-francisco/software-engineer/',
            $base . '/jobs/new-york/new-york-city/software-engineer/',
            $base . '/jobs/remote/software-engineer/',
        ],
        'blog' => [
            $base . '/how-to-hire/retail-cashier',
            $base . '/how-to-hire/software-developer',
            $base . '/how-to-hire/registered-nurse',
            $base . '/how-to-hire/customer-service-representative',
            $base . '/compensation/retail-cashier-salary',
            $base . '/compensation/software-developer-salary',
            $base . '/compensation/registered-nurse-salary',
            $base . '/compensation/customer-service-representative-salary',
            $base . '/interview-questions/retail-cashier',
            $base . '/interview-questions/software-developer',
            $base . '/interview-questions/registered-nurse',
            $base . '/interview-questions/customer-service-representative',
            $base . '/hr/what-does-retail-cashier-do',
            $base . '/hr/what-does-software-developer-do',
            $base . '/hr/what-does-registered-nurse-do',
            $base . '/hr/what-does-customer-service-representative-do',
            $base . '/hr/how-to-write-retail-cashier-job-description',
            $base . '/hr/how-to-write-software-developer-job-description',
            $base . '/hr/how-to-write-registered-nurse-job-description',
            $base . '/hr/how-to-write-customer-service-representative-job-description',
        ],
    ];
    
    $urls = $chunkUrls[$chunkId] ?? [];
    
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($urls as $url) {
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars($url, ENT_XML1) . "</loc>\n";
        echo "    <lastmod>$now</lastmod>\n";
        echo "    <changefreq>" . ($chunkId === 'blog' ? 'weekly' : 'daily') . "</changefreq>\n";
        echo "    <priority>" . ($chunkId === 'blog' ? '0.7' : '0.8') . "</priority>\n";
        echo "  </url>\n";
    }
    echo '</urlset>';
    exit;
}

require __DIR__ . '/../app/bootstrap.php';
use App\Router;
$router = new Router($uri);
$routes = require __DIR__ . '/../routes.web.php';
[$head, $body] = $router->dispatch($routes);
require __DIR__ . '/../views/layout.php';