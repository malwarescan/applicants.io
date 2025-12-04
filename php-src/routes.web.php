<?php
use App\Renderer;
use App\Data;

// Load redirect system
require_once __DIR__ . '/includes/redirects.php';

return [
  // Sitemap routes - MUST come FIRST to ensure proper XML serving
  // Try multiple possible paths to find sitemap files
  '#^/sitemap\.xml$#' => function() {
    // Try all possible locations
    $possiblePaths = [
      __DIR__ . '/public/sitemap.xml',           // Development
      __DIR__ . '/dist/sitemap.xml',              // Production build
      dirname(__DIR__) . '/public/sitemap.xml',   // Alternative path
      dirname(__DIR__) . '/dist/sitemap.xml',     // Alternative production
      $_SERVER['DOCUMENT_ROOT'] . '/sitemap.xml', // Server root
      $_SERVER['DOCUMENT_ROOT'] . '/public/sitemap.xml',
      $_SERVER['DOCUMENT_ROOT'] . '/dist/sitemap.xml',
    ];
    
    foreach ($possiblePaths as $sitemapFile) {
      if (file_exists($sitemapFile) && is_readable($sitemapFile)) {
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        readfile($sitemapFile);
        exit;
      }
    }
    
    // If not found, generate on-the-fly as last resort
    header('Content-Type: application/xml; charset=utf-8');
    http_response_code(200);
    echo '<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://applicants.io/sitemaps/main.xml</loc>
    <lastmod>' . date('Y-m-d') . '</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://applicants.io/sitemaps/categories.xml</loc>
    <lastmod>' . date('Y-m-d') . '</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://applicants.io/sitemaps/locations.xml</loc>
    <lastmod>' . date('Y-m-d') . '</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://applicants.io/sitemaps/category-location.xml</loc>
    <lastmod>' . date('Y-m-d') . '</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://applicants.io/sitemaps/blog.xml</loc>
    <lastmod>' . date('Y-m-d') . '</lastmod>
  </sitemap>
</sitemapindex>';
    exit;
  },
  
  '#^/sitemaps/(?P<file>[^/]+\.xml)$#' => function($p) {
    $file = $p['file'] ?? '';
    // Try all possible locations
    $possiblePaths = [
      __DIR__ . '/public/sitemaps/' . $file,
      __DIR__ . '/dist/sitemaps/' . $file,
      dirname(__DIR__) . '/public/sitemaps/' . $file,
      dirname(__DIR__) . '/dist/sitemaps/' . $file,
      $_SERVER['DOCUMENT_ROOT'] . '/sitemaps/' . $file,
      $_SERVER['DOCUMENT_ROOT'] . '/public/sitemaps/' . $file,
      $_SERVER['DOCUMENT_ROOT'] . '/dist/sitemaps/' . $file,
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
    echo '<?xml version="1.0" encoding="UTF-8"?><error><message>Sitemap chunk not found: ' . htmlspecialchars($file) . '</message></error>';
    exit;
  },
  
  // Category routes - must come before redirect routes
  '#^/jobs/category/(?P<slug>[^/]+)/?$#' => function($p) {
    $slug = $p['slug'] ?? '';
    $industry = str_replace('-', ' ', $slug);
    $industry = ucwords($industry);
    $jobs = Data::readJson('data/jobs.json');
    $categoryJobs = array_filter($jobs, function($job) use ($industry) {
      return strtolower($job['industry']) === strtolower($industry);
    });
    return Renderer::render('jobs-category', ['slug'=>$slug], [
      'title'=> $industry . ' Jobs - Find ' . $industry . ' Careers',
      'desc'=> 'Browse ' . count($categoryJobs) . '+ ' . $industry . ' jobs and careers. Find your next ' . $industry . ' position with top companies.',
      'canonical'=>"/jobs/category/$slug/"
    ]);
  },
  
  // Handle old URL redirects - must come before other routes
  '#^/([a-z0-9-]+)\.php$#' => function($p) {
    $file = $p[1] ?? '';
    $redirect = find_redirect($file . '.php');
    if ($redirect) {
      perform_redirect($redirect);
    }
    // If no redirect found, let it fall through to 404
    http_response_code(404);
    return ["<title>Page Not Found - Applicants.IO</title>", "<h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p>"];
  },
  
  // Handle old company/job-slug pattern: /jobs/company/job-slug
  '#^/jobs/(?P<company>[^/]+)/(?P<job>[^/]+)/?$#' => function($p) {
    $company = $p['company'] ?? '';
    $job = $p['job'] ?? '';
    
    // Skip if it's actually a category or other valid route
    if ($company === 'category') {
      // Let category route handle it
      return null;
    }
    
    $path = "jobs/$company/$job";
    $redirect = find_redirect($path);
    if ($redirect) {
      perform_redirect($redirect);
    }
    
    // If no redirect found, try to find job by slug
    $jobs = Data::readJson('data/jobs.json');
    foreach ($jobs as $j) {
      $slug = $j['identifier']['value'] ?? '';
      if (strpos($slug, $job) !== false || strpos($job, $slug) !== false) {
        perform_redirect("/jobs/$slug/");
      }
    }
    
    // Not found
    http_response_code(404);
    return ["<title>Job Not Found - Applicants.IO</title>", "<h1>404 - Job Not Found</h1><p>The job you're looking for doesn't exist.</p>"];
  },
  
  // Handle old state/city/job-title pattern: /jobs/state/city/job-title/
  '#^/jobs/(?P<state>[^/]+)/(?P<city>[^/]+)/(?P<job>[^/]+)/?$#' => function($p) {
    $state = $p['state'] ?? '';
    $city = $p['city'] ?? '';
    $job = $p['job'] ?? '';
    
    // Skip if it's actually a category route
    if ($state === 'category') {
      return null;
    }
    
    $path = "jobs/$state/$city/$job";
    $redirect = find_redirect($path);
    if ($redirect) {
      perform_redirect($redirect);
    }
    
    // Fallback: redirect to jobs with location filter
    perform_redirect("/jobs/?location=" . urlencode("$city, " . ucwords(str_replace('-', ' ', $state))));
  },
  
  // Handle state/city pages: /jobs/state/city/ -> redirect to jobs with location filter
  '#^/jobs/(?P<state>[^/]+)/(?P<city>[^/]+)/?$#' => function($p) {
    $state = $p['state'] ?? '';
    $city = $p['city'] ?? '';
    
    // Skip if it's actually a category route
    if ($state === 'category') {
      return null;
    }
    
    // Redirect location pages to jobs index with filter
    perform_redirect("/jobs/?location=" . urlencode("$city, " . ucwords(str_replace('-', ' ', $state))));
  },
  
  // Handle state-only pages: /jobs/state/ -> redirect to jobs index
  '#^/jobs/(?P<state>texas|california|florida|new-york|remote)/?$#' => function($p) {
    $state = $p['state'] ?? '';
    perform_redirect("/jobs/?location=" . urlencode(ucwords(str_replace('-', ' ', $state))));
  },
  
  // Handle old enhanced pages
  '#^/enhanced-post-job/?$#' => function() {
    perform_redirect('/post-job/');
  },
  
  '#^/enhanced-jobs/?$#' => function() {
    perform_redirect('/jobs/');
  },
  
  // Serve favicon files - must be first to catch before other routes
  '#^/favicon\.ico$#' => function() {
    $faviconFile = __DIR__ . '/public/favicon.ico';
    if (file_exists($faviconFile)) {
      header('Content-Type: image/x-icon');
      header('Cache-Control: public, max-age=31536000');
      readfile($faviconFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  '#^/favicon\.svg$#' => function() {
    $faviconFile = __DIR__ . '/public/favicon.svg';
    if (file_exists($faviconFile)) {
      header('Content-Type: image/svg+xml');
      header('Cache-Control: public, max-age=31536000');
      readfile($faviconFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  '#^/favicon-16x16\.png$#' => function() {
    $faviconFile = __DIR__ . '/public/favicon-16x16.png';
    if (file_exists($faviconFile)) {
      header('Content-Type: image/png');
      header('Cache-Control: public, max-age=31536000');
      readfile($faviconFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  '#^/favicon-32x32\.png$#' => function() {
    $faviconFile = __DIR__ . '/public/favicon-32x32.png';
    if (file_exists($faviconFile)) {
      header('Content-Type: image/png');
      header('Cache-Control: public, max-age=31536000');
      readfile($faviconFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  '#^/favicon-192\.png$#' => function() {
    $faviconFile = __DIR__ . '/public/favicon-192.png';
    if (file_exists($faviconFile)) {
      header('Content-Type: image/png');
      header('Cache-Control: public, max-age=31536000');
      readfile($faviconFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  '#^/apple-touch-icon\.png$#' => function() {
    $faviconFile = __DIR__ . '/public/apple-touch-icon.png';
    if (file_exists($faviconFile)) {
      header('Content-Type: image/png');
      header('Cache-Control: public, max-age=31536000');
      readfile($faviconFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  '#^/site\.webmanifest$#' => function() {
    $manifestFile = __DIR__ . '/public/site.webmanifest';
    if (file_exists($manifestFile)) {
      header('Content-Type: application/manifest+json');
      header('Cache-Control: public, max-age=86400');
      readfile($manifestFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  '#^/logo\.png$#' => function() {
    $logoFile = __DIR__ . '/public/logo.png';
    if (file_exists($logoFile)) {
      header('Content-Type: image/png');
      header('Cache-Control: public, max-age=31536000');
      readfile($logoFile);
      exit;
    }
    http_response_code(404);
    exit;
  },
  
  // API routes - must come before other routes
  '#^/api/#' => function() {
    require __DIR__ . '/api/router.php';
    exit;
  },
  
  // Serve OpenAPI schema for ChatGPT - must come before other routes
  '#^/gpt-action-openapi-schema\.json$#' => function() {
    // Try multiple possible locations (Railway runs from php-src/public/)
    $possiblePaths = [
      __DIR__ . '/public/gpt-action-openapi-schema.json',  // Public directory (Railway)
      __DIR__ . '/../gpt-action-openapi-schema.json',  // Root directory
      __DIR__ . '/../public/gpt-action-openapi-schema.json',  // Public from routes dir
      dirname(__DIR__) . '/gpt-action-openapi-schema.json',  // Absolute root
    ];
    
    $schemaFile = null;
    foreach ($possiblePaths as $path) {
      $realPath = realpath($path);
      if ($realPath && file_exists($realPath)) {
        $schemaFile = $realPath;
        break;
      }
    }
    
    if ($schemaFile && file_exists($schemaFile)) {
      header('Content-Type: application/json');
      header('Access-Control-Allow-Origin: *');
      header('Cache-Control: public, max-age=3600');
      readfile($schemaFile);
      exit;
    }
    
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
      'error' => 'Schema not found',
      'routes_dir' => __DIR__,
      'root_dir' => dirname(__DIR__),
      'cwd' => getcwd()
    ]);
    exit;
  },
  
  '#^/$#' => function() {
    return Renderer::render('home', [], ['title'=>'Job Listings - Applicants.IO','desc'=>'Find your next career opportunity with our comprehensive job listings.','canonical'=>'/']);
  },
  '#^/jobs/?$#' => function() {
    return Renderer::render('jobs-index', [], ['title'=>'Job Listings - Applicants.IO','desc'=>'Find your next career opportunity with our comprehensive job listings.','canonical'=>'/jobs/']);
  },
  
  '#^/jobs/(?P<slug>[^/]+)/?$#' => function($p) {
    $slug = $p['slug'] ?? '';
    
    // Load jobs database first
    $jobs = Data::readJson('data/jobs.json');
    $job = null;
    
    // Try to find by identifier value (slug) first, then by ID
    foreach ($jobs as $j) {
      if (($j['identifier']['value'] ?? '') === $slug || $j['id'] === $slug) {
        $job = $j;
        break;
      }
    }
    
    // If found in database, render it (preferred method)
    if ($job) {
      // If accessed via numeric ID but has a slug, redirect to slug-based URL
      if (is_numeric($slug) && isset($job['identifier']['value']) && $job['identifier']['value'] !== $slug) {
        perform_redirect("/jobs/" . $job['identifier']['value'] . "/");
      }
      
      // Use unified template if available, otherwise fallback
      $schemaFile = __DIR__ . '/includes/schema_jobposting_unified.php';
      if (file_exists($schemaFile)) {
        require_once $schemaFile;
      }
      
      try {
        $jsonLd = generate_jobposting_schema($job);
        // Use the job's slug for canonical URL, not the request slug
        $canonicalSlug = $job['identifier']['value'] ?? $job['id'];
        return Renderer::render('job-detail-unified', [
          'job' => $job,
          'canonical' => "/jobs/$canonicalSlug/",
        ], [
          'title' => $job['title'] . ' in ' . ($job['location'] ?? '') . ' | Applicants.io',
          'desc' => substr(strip_tags($job['description'] ?? ''), 0, 160) . '...',
          'canonical' => "/jobs/$canonicalSlug/",
          'jsonld' => $jsonLd,
        ]);
      } catch (Exception $e) {
        // Fallback to old template if schema generation fails
        $canonicalSlug = $job['identifier']['value'] ?? $job['id'];
        return Renderer::render('job-detail', ['id'=>$job['id']], [
          'title'=> $job['title'] . ' at ' . ($job['company'] ?? '') . ' in ' . ($job['location'] ?? ''),
          'desc'=> substr($job['description'] ?? '', 0, 160) . '...',
          'canonical'=>"/jobs/$canonicalSlug/",
        ]);
      }
    }
    
    // Fallback: check if there's a static PHP file for this slug
    // routes.web.php is in php-src/, public/ is also in php-src/
    $staticFile = __DIR__ . '/public/jobs/' . $slug . '/index.php';
    if (file_exists($staticFile)) {
      include $staticFile;
      exit;
    }
    
    // Job not found - try redirect lookup
    $redirect = find_redirect("jobs/$slug");
    if ($redirect) {
      perform_redirect($redirect);
    }
    
    // Still not found
    http_response_code(404);
    return ["<title>Job Not Found - Applicants.IO</title>", "<h1>404 - Job Not Found</h1><p>The job you're looking for doesn't exist.</p>"];
  },
  '#^/post-job/?$#' => function() {
    return Renderer::render('post-job', [], ['title'=>'Post a Job - Applicants.IO','desc'=>'Post your job listing and reach qualified candidates.','canonical'=>'/post-job/']);
  },
  '#^/contact/?$#' => function() {
    return Renderer::render('contact', [], ['title'=>'Contact Us - Applicants.IO','desc'=>'Get in touch with us for support or questions.','canonical'=>'/contact/']);
  },
  '#^/privacy-policy/?$#' => function() {
    return Renderer::render('privacy-policy', [], ['title'=>'Privacy Policy - Applicants.IO','desc'=>'Learn how Applicants.io collects, uses, and protects your personal information.','canonical'=>'/privacy-policy/']);
  },
  // Handle /employer-reviews without trailing slash - redirect to trailing slash version
  '#^/employer-reviews$#' => function() {
    perform_redirect('/employer-reviews/');
  },
  
  '#^/employer-reviews/?$#' => function() {
    // List of available employers
    $employers = [
      [
        'name' => 'Synaxus Inc',
        'slug' => 'synaxus',
        'url' => 'https://www.synaxusinc.com/',
        'description' => 'Technology and consulting services company'
      ]
    ];
    
    return Renderer::render('employers-index', ['employers' => $employers], [
      'title' => 'Employer Reviews - Applicants.io',
      'desc' => 'Browse verified employee reviews and ratings for top companies.',
      'canonical' => '/employer-reviews/'
    ]);
  },
  '#^/employers/?$#' => function() {
    // List of available employers
    $employers = [
      [
        'name' => 'Synaxus Inc',
        'slug' => 'synaxus',
        'url' => 'https://www.synaxusinc.com/',
        'description' => 'Technology and consulting services company'
      ]
    ];
    
    return Renderer::render('employers-index', ['employers' => $employers], [
      'title' => 'Employer Reviews - Applicants.io',
      'desc' => 'Browse verified employee reviews and ratings for top companies.',
      'canonical' => '/employers/'
    ]);
  },
  
  // Synaxus employer pages - serve static PHP files
  '#^/employers/synaxus/(?P<page>[^/]+)/?$#' => function($p) {
    $page = $p['page'] ?? '';
    
    // First, try to find matching job and redirect to main job page (canonical)
    // This handles URLs without -fl suffix like /employers/synaxus/brand-ambassador-naples
    $jobs = Data::readJson('data/jobs.json');
    foreach ($jobs as $job) {
      $slug = $job['identifier']['value'] ?? '';
      if (empty($slug)) continue;
      
      // Check if page matches job slug without -fl suffix
      $slugWithoutFl = preg_replace('/-fl$/', '', $slug);
      if ($slugWithoutFl === $page) {
        // Redirect to main job page (preferred canonical URL)
        perform_redirect("/jobs/$slug/");
      }
      
      // Also check if it matches the full slug
      if ($slug === $page) {
        // Redirect employer page to main job page for consistency
        perform_redirect("/jobs/$slug/");
      }
    }
    
    // Files are in php-src/public/employers/synaxus/
    $file = __DIR__ . '/../public/employers/synaxus/' . $page . '.php';
    
    // If file doesn't exist, try with -fl suffix
    if (!file_exists($file)) {
      $fileWithFl = __DIR__ . '/../public/employers/synaxus/' . $page . '-fl.php';
      if (file_exists($fileWithFl)) {
        // Check if there's a matching job and redirect to main job page
        foreach ($jobs as $job) {
          $slug = $job['identifier']['value'] ?? '';
          if ($slug === $page . '-fl') {
            perform_redirect("/jobs/$slug/");
          }
        }
        // If no job match, redirect to -fl version
        perform_redirect("/employers/synaxus/$page-fl");
      }
    }
    
    if (file_exists($file)) {
      // Check if this page should redirect to main job page
      foreach ($jobs as $job) {
        $slug = $job['identifier']['value'] ?? '';
        if ($slug === $page) {
          perform_redirect("/jobs/$slug/");
        }
      }
      include $file;
      exit;
    }
    
    // Fallback to reviews if page not found
    return Renderer::render('employers-index', ['employers' => [
      ['name' => 'Synaxus Inc', 'slug' => 'synaxus', 'url' => 'https://www.synaxusinc.com/']
    ]], [
      'title' => 'Synaxus Inc - Employer Reviews',
      'desc' => 'Browse Synaxus Inc employee reviews and job openings.',
      'canonical' => '/employers/synaxus/'
    ]);
  },
  
  // Synaxus employer index
  '#^/employers/synaxus/?$#' => function() {
    $file = __DIR__ . '/../public/employers/synaxus/index.php';
    if (file_exists($file)) {
      include $file;
      exit;
    }
    return ["", "<h1>404 - Not Found</h1>"];
  },
  
  // Serve robots.txt
  '#^/robots\.txt$#' => function() {
    $robotsFile = __DIR__ . '/public/robots.txt';
    if (file_exists($robotsFile)) {
      header('Content-Type: text/plain');
      echo file_get_contents($robotsFile);
      exit;
    }
    return ["", ""];
  },
];