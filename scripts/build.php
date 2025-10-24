#!/usr/bin/env php
<?php
require __DIR__ . '/../php-src/app/bootstrap.php';
require __DIR__ . '/../php-src/app/Build.php';
App\Build::run();
echo "Built static site in php-src/dist\n";