<?php
require __DIR__ . '/../app/bootstrap.php';
use App\Router;
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$router = new Router($uri);
$routes = require __DIR__ . '/../routes.web.php';
[$head, $body] = $router->dispatch($routes);
require __DIR__ . '/../views/layout.php';