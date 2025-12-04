<?php namespace App;
class Build {
  public static function run(): void {
    $web = require __DIR__ . '/../routes.web.php';
    $map = require __DIR__ . '/../routes.map.php';
    foreach ($map as $entry) {
      [$path, $ctx] = $entry;
      $pattern = $ctx['pattern'];
      $params = $ctx['params'] ?? [];
      if (!isset($web[$pattern])) continue;
      [$head, $body] = $web[$pattern]($params);
      
      // Use the full layout with CSS
      ob_start();
      require __DIR__ . '/../views/layout.php';
      $html = ob_get_clean();
      $dir = __DIR__ . '/../dist' . rtrim($path, '/'); $dir .= '/';
      @mkdir($dir, 0777, true);
      file_put_contents($dir . 'index.html', $html);
    }
    // Copy /public assets (excluding PHP files and JSON files)
    self::copyDir(__DIR__ . '/../public', __DIR__ . '/../dist', ['.php', '.json']);
    
    // Copy sitemap files - use generated sitemap if it exists, otherwise create basic one
    $generatedSitemap = __DIR__ . '/../public/sitemap.xml';
    if (file_exists($generatedSitemap)) {
      // Use our generated sitemap (from npm run generate-sitemap)
      copy($generatedSitemap, __DIR__ . '/../dist/sitemap.xml');
    } else {
      // Fallback: write a basic sitemap
      $urls = array_map(fn($e) => $e[0], $map);
      $sitemap = self::sitemap($urls);
      file_put_contents(__DIR__ . '/../dist/sitemap.xml', $sitemap);
    }
    
    // Copy sitemaps directory if it exists
    $sitemapsDir = __DIR__ . '/../public/sitemaps';
    if (is_dir($sitemapsDir)) {
      self::copyDir($sitemapsDir, __DIR__ . '/../dist/sitemaps', ['.php', '.json']);
    }
  }
  private static function copyDir(string $src, string $dst, array $exclude = []): void {
    if (!is_dir($src)) return;
    @mkdir($dst, 0777, true);
    $it = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($src, \FilesystemIterator::SKIP_DOTS));
    foreach ($it as $file) {
      $target = $dst . '/' . $it->getSubPathName();
      if ($file->isDir()) { @mkdir($target, 0777, true); } else {
        // Skip files with excluded extensions
        $shouldExclude = false;
        foreach ($exclude as $ext) {
          if (str_ends_with($file->getPathname(), $ext)) {
            $shouldExclude = true;
            break;
          }
        }
        if (!$shouldExclude) {
          @mkdir(dirname($target), 0777, true);
          copy($file->getPathname(), $target);
        }
      }
    }
  }
  private static function sitemap(array $paths): string {
    $base = 'https://example.com'; // replace in config or at deploy
    $now = date('c');
    $out = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
    foreach (array_unique($paths) as $p) {
      $loc = htmlspecialchars(rtrim($base, '/') . $p, ENT_QUOTES);
      $out[] = "<url><loc>$loc</loc><lastmod>$now</lastmod></url>";
    }
    $out[]='</urlset>'; return implode("", $out);
  }
}
if (php_sapi_name()==='cli') { Build::run(); }