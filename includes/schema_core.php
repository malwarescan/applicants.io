<?php
declare(strict_types=1);

/** Escape for HTML text nodes */
function sx_h(string $t): string { return htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** Emit JSON-LD safely */
function sx_jsonld(array $doc): void {
  echo '<script type="application/ld+json">'.json_encode($doc, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).'</script>';
}

/** Minimal page shell (no classes) */
function sx_head(string $title, string $desc, ?string $canonical=null): void {
  echo "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
  echo "<title>".sx_h($title)."</title>";
  echo "<meta name=\"description\" content=\"".sx_h($desc)."\">";
  if ($canonical) echo "<link rel=\"canonical\" href=\"".sx_h($canonical)."\">";
  echo "</head><body>";
}
function sx_foot(): void { echo "</body></html>"; }

/** Breadcrumbs (visible + JSON-LD) */
function sx_breadcrumbs(array $items): void {
  echo "<nav>";
  $list = [];
  foreach ($items as $i => $it) {
    $pos = $i + 1;
    if (!empty($it['url'])) {
      echo "<a href=\"".sx_h($it['url'])."\">".sx_h($it['name'])."</a>";
    } else {
      echo "<span>".sx_h($it['name'])."</span>";
    }
    if ($pos < count($items)) echo " › ";
    $list[] = [
      "@type" => "ListItem",
      "position" => $pos,
      "name" => $it['name'],
      "item" => $it['url'] ?? null
    ];
  }
  echo "</nav>";
  $doc = [
    "@context" => "https://schema.org",
    "@type" => "BreadcrumbList",
    "itemListElement" => array_map(function($x){
      if ($x['item'] === null) { unset($x['item']); }
      return $x;
    }, $list)
  ];
  sx_jsonld($doc);
}

/** Site Organization (Applicants.io) — include once sitewide, e.g., in layout */
function sx_schema_site_org(array $site): void {
  $doc = [
    "@context" => "https://schema.org",
    "@type" => "Organization",
    "name" => $site['siteName'],
    "url"  => $site['siteUrl'],
    "logo" => $site['logoUrl'],
    "sameAs" => $site['orgSameAs'] ?? []
  ];
  sx_jsonld($doc);
}

/** Website + sitelinks searchbox (optional but harmless) */
function sx_schema_website(array $site): void {
  $doc = [
    "@context" => "https://schema.org",
    "@type" => "WebSite",
    "name" => $site['siteName'],
    "url"  => $site['siteUrl'],
    "potentialAction" => [
      "@type" => "SearchAction",
      "target" => $site['siteUrl'] . $site['siteSearch'] . "{search_term_string}",
      "query-input" => "required name=search_term_string"
    ]
  ];
  sx_jsonld($doc);
}

/** FAQPage — pass visible Q&A array = [ ['q'=>'','a'=>''], ... ] */
function sx_schema_faq(array $qa): void {
  if (!$qa) return;
  echo "<section><h2>Frequently Asked Questions</h2>";
  foreach ($qa as $row) {
    echo "<article><h3>".sx_h($row['q'])."</h3><p>".sx_h($row['a'])."</p></article>";
  }
  echo "</section>";
  $doc = [
    "@context" => "https://schema.org",
    "@type" => "FAQPage",
    "mainEntity" => array_map(function($row){
      return [
        "@type" => "Question",
        "name" => $row['q'],
        "acceptedAnswer" => ["@type"=>"Answer","text"=>$row['a']]
      ];
    }, $qa)
  ];
  sx_jsonld($doc);
}
