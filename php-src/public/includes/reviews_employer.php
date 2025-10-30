<?php
declare(strict_types=1);

/**
 * Minimal review utilities for public, crawlable employer pages.
 * Plain HTML; no classes; compliant EmployerAggregateRating JSON-LD.
 */

function ai_load_reviews(string $path): array {
  if (!file_exists($path)) return ['meta'=>[], 'reviews'=>[]];
  $json = json_decode((string)file_get_contents($path), true);
  if (!is_array($json)) $json = ['meta'=>[], 'reviews'=>[]];

  $out = [];
  foreach (($json['reviews'] ?? []) as $r) {
    $out[] = [
      'id'         => (string)($r['id'] ?? uniqid('R', true)),
      'rating'     => max(1, min(5, (int)($r['rating'] ?? 5))),
      'title'      => trim((string)($r['title'] ?? '')),
      'body'       => trim((string)($r['body'] ?? '')),
      'authorRole' => trim((string)($r['authorRole'] ?? 'Employee')),
      'location'   => trim((string)($r['location'] ?? '')),
      'date'       => preg_match('/^\\d{4}-\\d{2}-\\d{2}$/', (string)($r['date'] ?? '')) ? $r['date'] : date('Y-m-d'),
      'is_sample'  => (bool)($r['is_sample'] ?? false),
      'verified'   => (bool)($r['verified'] ?? false),
    ];
  }
  return ['meta'=>$json['meta'] ?? [], 'reviews'=>$out];
}

/** Count + average for verified, non-sample items */
function ai_verified_reviews(array $data): array {
  $list = array_values(array_filter($data['reviews'] ?? [], fn($r) => $r['verified'] && !$r['is_sample']));
  return $list;
}
function ai_aggregate(array $verified): array {
  $count = count($verified);
  if ($count === 0) return ['avg'=>0.0, 'count'=>0];
  $sum = 0;
  foreach ($verified as $r) $sum += (int)$r['rating'];
  return ['avg'=>round($sum / $count, 1), 'count'=>$count];
}
function ai_stars(int $rating): string {
  $rating = max(1, min(5, $rating));
  $filled = str_repeat("★", $rating);
  $empty  = str_repeat("☆", 5 - $rating);
  return $filled . $empty;
}

/** EmployerAggregateRating JSON-LD (emitted only if ≥ 5 verified)
 * Returns array structure for @graph format with publisher
 */
function ai_schema_employer_agg(string $employerName, string $employerUrl, array $verified, float $avg, int $count, ?string $employerSlug = null): array {
  // Use provided slug or generate from name
  if (empty($employerSlug)) {
    $employerSlug = strtolower(str_replace([' ', ' Inc', ' Inc.', ' LLC', ' Corporation'], '', $employerName));
    $employerSlug = preg_replace('/[^a-z0-9]/', '', $employerSlug);
  }
  
  // Build @graph structure with publisher and reviewed organization
  $graph = [
    // Publisher: Applicants.io (independent reviewer)
    [
      "@type" => "Organization",
      "@id" => "https://www.applicants.io/#publisher",
      "name" => "Applicants.io",
      "url" => "https://www.applicants.io/",
      "description" => "Independent employer review and recruiting platform aggregating verified employee feedback about hiring organizations.",
      "sameAs" => [
        "https://www.linkedin.com/company/applicants-io"
      ],
      "logo" => [
        "@type" => "ImageObject",
        "url" => "https://www.applicants.io/favicon-192.png"
      ]
    ],
    // Reviewed Organization: The employer being rated
    [
      "@type" => "Organization",
      "@id" => "https://www.applicants.io/employers/" . $employerSlug . "#organization",
      "name" => $employerName,
      "url" => !empty($employerUrl) ? $employerUrl : "https://www.applicants.io/employers/" . $employerSlug
    ],
    // EmployerAggregateRating: The rating data
    [
      "@type" => "EmployerAggregateRating",
      "@id" => "https://www.applicants.io/employers/" . $employerSlug . "#employerAggregateRating",
      "itemReviewed" => ["@id" => "https://www.applicants.io/employers/" . $employerSlug . "#organization"],
      "ratingValue" => (string)number_format($avg, 1),
      "bestRating" => "5",
      "worstRating" => "1",
      "reviewCount" => (string)$count,
      "author" => ["@id" => "https://www.applicants.io/#publisher"]
    ]
  ];
  
  // Optionally add representative Review nodes (first 3 verified reviews)
  $representativeReviews = array_slice($verified, 0, 3);
  foreach ($representativeReviews as $review) {
    $graph[] = [
      "@type" => "Review",
      "author" => [
        "@type" => "Person",
        "name" => ($review['authorRole'] ?? 'Employee') . ($review['location'] ? ' (' . $review['location'] . ')' : '')
      ],
      "datePublished" => $review['date'] ?? date('Y-m-d'),
      "reviewBody" => ($review['title'] ?? '') . '. ' . ($review['body'] ?? ''),
      "reviewRating" => [
        "@type" => "Rating",
        "ratingValue" => (string)($review['rating'] ?? 5),
        "bestRating" => "5",
        "worstRating" => "1"
      ],
      "itemReviewed" => ["@id" => "https://www.applicants.io/employers/" . $employerSlug . "#organization"],
      "publisher" => ["@id" => "https://www.applicants.io/#publisher"]
    ];
  }
  
  return [
    "@context" => "https://schema.org",
    "@graph" => $graph
  ];
}

/** Minimal head/footer */
function ai_head(string $title, string $desc, ?string $canonical = null): void {
  echo "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">";
  echo "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
  echo "<title>".htmlspecialchars($title)."</title>";
  echo "<meta name=\"description\" content=\"".htmlspecialchars($desc)."\">";
  if ($canonical) echo "<link rel=\"canonical\" href=\"".htmlspecialchars($canonical)."\">";
  echo "</head><body>";
}
function ai_foot(): void { echo "</body></html>"; }

/** Render page sections with plain HTML only */
function ai_render_summary(float $avg, int $count): void {
  echo "<section>";
  echo "<h2>Overall rating</h2>";
  $stars = ai_stars((int)round($avg ?: 5));
  echo "<p><strong>".number_format((float)$avg, 1)." / 5</strong> &nbsp; ".$stars." &nbsp; (".$count." verified reviews)</p>";
  echo "</section>";
}
function ai_render_reviews(array $reviews): void {
  echo "<section>";
  echo "<h2>Recent verified reviews</h2>";
  if (!$reviews) { echo "<p>No verified reviews published yet.</p>"; echo "</section>"; return; }
  foreach ($reviews as $r) {
    echo "<article>";
    echo "<h3>".htmlspecialchars($r['title'])."</h3>";
    echo "<p>".ai_stars((int)$r['rating'])."</p>";
    echo "<p>".htmlspecialchars($r['body'])."</p>";
    $meta = trim(($r['authorRole'] ?: 'Employee').($r['location'] ? " — ".$r['location'] : '')." — ".$r['date']);
    echo "<p><small>".$meta."</small></p>";
    echo "</article>";
    echo "<hr>";
  }
  echo "</section>";
}
