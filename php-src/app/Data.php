<?php namespace App;
class Data {
  public static function readJson(string $path): array {
    $full = __DIR__ . '/../' . ltrim($path, '/');
    if (!is_file($full)) return [];
    $j = file_get_contents($full);
    return json_decode($j, true) ?: [];
  }
  public static function fetchJson(string $url, array $opts=[]): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => 10,
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode((string)$res, true) ?: [];
  }
}