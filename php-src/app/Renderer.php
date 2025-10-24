<?php namespace App;
class Renderer {
  public static function render(string $view, array $data=[], array $seo=[]): array {
    $head = Seo::head($seo);
    ob_start(); 
    extract($data); // Extract variables so they're available in the view
    include __DIR__ . '/../views/pages/' . $view . '.php'; 
    $body = ob_get_clean();
    return [$head, $body];
  }
}