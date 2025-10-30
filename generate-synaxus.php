#!/usr/bin/env php
<?php
// Generate static HTML for Synaxus employer reviews page
require __DIR__ . '/php-src/app/bootstrap.php';
require __DIR__ . '/php-src/public/includes/reviews_employer.php';
use App\Renderer;

$path = __DIR__ . '/php-src/public/data/synaxus_reviews.json';
$data = ai_load_reviews($path);

$employerName = (string)($data['meta']['employerName'] ?? 'Synaxus Inc');
$employerUrl  = (string)($data['meta']['employerUrl'] ?? '');
$verified = ai_verified_reviews($data);
$agg = ai_aggregate($verified);

// Generate structured data if we have enough reviews
$jsonLd = null;
if ($agg['count'] >= 5) {
  $jsonLd = ai_schema_employer_agg($employerName, $employerUrl, $verified, (float)$agg['avg'], (int)$agg['count'], 'synaxus');
}

// Use the main site's renderer
[$head, $body] = Renderer::render('employer-reviews', [
    'employerName' => $employerName,
    'employerUrl' => $employerName,
    'verified' => $verified,
    'agg' => $agg,
    'structuredData' => $jsonLd // Keep for backward compatibility
], [
    'title' => $employerName . ' — Employee Reviews & Ratings | Applicants.io',
    'desc' => 'Read verified, public employee reviews and ratings for ' . $employerName . ' hosted by Applicants.io.',
    'canonical' => 'https://www.applicants.io/employers/synaxus',
    'jsonld' => $jsonLd // Pass array directly to Seo::head()
]);

// Generate full HTML using the layout
ob_start();
require __DIR__ . '/php-src/views/layout.php';
$html = ob_get_clean();

// Create directory and write file
$dir = __DIR__ . '/dist/employers/synaxus/';
@mkdir($dir, 0777, true);
file_put_contents($dir . 'index.html', $html);

echo "Generated static HTML for Synaxus employer reviews\n";
