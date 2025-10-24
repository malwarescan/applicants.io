<?php
spl_autoload_register(function($c){
  $prefix = 'App\\';
  $base = __DIR__ . '/';
  if (str_starts_with($c, $prefix)) {
    $rel = substr($c, strlen($prefix));
    $file = $base . str_replace('\\','/',$rel) . '.php';
    if (is_file($file)) require $file;
  }
});
if (is_file(__DIR__ . '/../config.php')) require __DIR__ . '/../config.php';