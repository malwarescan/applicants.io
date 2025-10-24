<?php
// Force cache busting
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

require_once __DIR__ . '/../../../app/bootstrap.php';
require_once __DIR__ . '/../../includes/reviews_employer.php';
use App\Renderer;

$path = __DIR__ . '/../../data/synaxus_reviews.json';
$data = ai_load_reviews($path);

$employerName = (string)($data['meta']['employerName'] ?? 'Synaxus Inc');
$employerUrl  = (string)($data['meta']['employerUrl'] ?? '');
$verified = ai_verified_reviews($data);
$agg = ai_aggregate($verified);

// Generate structured data if we have enough reviews
$structuredData = null;
if ($agg['count'] >= 5) {
  $structuredData = ai_schema_employer_agg($employerName, $employerUrl, $verified, (float)$agg['avg'], (int)$agg['count']);
}

// Use the main site's renderer
[$head, $body] = Renderer::render('employer-reviews', [
  'employerName' => $employerName,
  'employerUrl' => $employerUrl,
  'verified' => $verified,
  'agg' => $agg,
  'structuredData' => $structuredData
], [
  'title' => $employerName . " — Employee Reviews & Ratings | Applicants.io",
  'desc' => "Read verified, public employee reviews and ratings for " . $employerName . " hosted by Applicants.io.",
  'canonical' => "https://www.applicants.io/employers/synaxus",
  'jsonld' => $structuredData ? json_decode(str_replace(['<script type="application/ld+json">', '</script>'], '', $structuredData), true) : null
]);

require __DIR__ . '/../../../views/layout.php';
