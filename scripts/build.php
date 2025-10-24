#!/usr/bin/env php
<?php
require __DIR__ . '/../php-src/app/bootstrap.php';
require __DIR__ . '/../php-src/app/Build.php';

// Change to output to root /dist directory for deployment
$originalDist = __DIR__ . '/../php-src/dist';
$deployDist = __DIR__ . '/../dist';

App\Build::run();

// Copy from php-src/dist to root /dist for deployment
if (is_dir($originalDist)) {
    // Remove existing dist if it exists
    if (is_dir($deployDist)) {
        exec("rm -rf " . escapeshellarg($deployDist));
    }
    // Copy to root dist
    exec("cp -r " . escapeshellarg($originalDist) . " " . escapeshellarg($deployDist));
    echo "Built static site in /dist for deployment\n";
} else {
    echo "ERROR: php-src/dist directory not found\n";
    exit(1);
}