<?php namespace App;
class Router {
  public function __construct(private string $uri) {}
  public function dispatch(array $map): array {
    foreach ($map as $pattern => $controller) {
      if (preg_match($pattern, $this->uri, $m)) {
        $params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
        return $controller($params);
      }
    }
    http_response_code(404);
    return ["<title>Not found</title>", "<h1>404 Not Found</h1>"];
  }
}