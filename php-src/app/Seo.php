<?php namespace App;
class Seo {
  public static function head(array $c): string {
    $t = htmlspecialchars($c['title'] ?? 'Site', ENT_QUOTES);
    $d = htmlspecialchars($c['desc'] ?? '', ENT_QUOTES);
    $canon = htmlspecialchars($c['canonical'] ?? '/', ENT_QUOTES);
    $json = $c['jsonld'] ?? null;
    $tags = [
      "<title>$t</title>",
      "<meta name=\"description\" content=\"$d\">",
      "<link rel=\"canonical\" href=\"$canon\">",
      "<meta property=\"og:title\" content=\"$t\">",
      "<meta property=\"og:description\" content=\"$d\">",
      "<meta name=\"twitter:card\" content=\"summary_large_image\">",
    ];
    if ($json) $tags[] = '<script type="application/ld+json">'.json_encode($json, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).'</script>';
    return implode("\n", $tags);
  }
}