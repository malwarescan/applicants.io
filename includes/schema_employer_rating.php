<?php
declare(strict_types=1);
require_once __DIR__ . '/schema_core.php';

/**
 * Build EmployerAggregateRating JSON-LD for an employer page on Applicants.io,
 * ONLY when you visibly show the same reviews and have ≥5 verified, non-sample entries.
 *
 * $employer = ['name'=>'Synaxus Inc','url'=>'https://www.synaxusinc.com/'];
 * $reviews = [
 *   ['rating'=>5,'title'=>'Great leadership','body'=>'…','author'=>'Sales Associate','date'=>'2025-09-12','verified'=>true,'sample'=>false],
 *   ...
 * ];
 */
function sx_schema_employer_agg(array $employer, array $reviews): void {
  $verified = array_values(array_filter($reviews, fn($r) => !empty($r['verified']) && empty($r['sample'])));
  if (count($verified) < 5) return; // guard

  $count = count($verified);
  $sum = 0; foreach ($verified as $r) $sum += (int)$r['rating'];
  $avg = round($sum / $count, 1);

  // visible block
  echo "<section><h2>Overall rating</h2><p><strong>".number_format($avg,1)." / 5</strong> — ".$count." verified reviews</p></section>";
  echo "<section><h2>Recent reviews</h2>";
  foreach ($verified as $r) {
    echo "<article><h3>".sx_h($r['title'])."</h3>";
    echo "<p>".str_repeat("★",(int)$r['rating']).str_repeat("☆",5-(int)$r['rating'])."</p>";
    echo "<p>".sx_h($r['body'])."</p>";
    echo "<p><small>".sx_h($r['author'])." — ".sx_h($r['date'])."</small></p>";
    echo "</article><hr>";
  }
  echo "</section>";

  $doc = [
    "@context" => "https://schema.org",
    "@type" => "EmployerAggregateRating",
    "itemReviewed" => [
      "@type" => "Organization",
      "name" => (string)($employer['name'] ?? ''),
      "url"  => (string)($employer['url'] ?? '')
    ],
    "ratingValue" => (string)$avg,
    "bestRating"  => "5",
    "ratingCount" => (string)$count,
    "review" => array_map(function($r){
      return [
        "@type" => "Review",
        "author" => (string)($r['author'] ?? 'Employee'),
        "datePublished" => (string)$r['date'],
        "name" => (string)$r['title'],
        "reviewBody" => (string)$r['body'],
        "reviewRating" => ["@type"=>"Rating","ratingValue"=>(string)$r['rating'],"bestRating"=>"5"]
      ];
    }, array_slice($verified, 0, 20))
  ];
  sx_jsonld($doc);
}
