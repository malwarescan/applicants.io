<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<?= $head ?>
<meta name="viewport" content="width=device-width,initial-scale=1">
<?php
  $cssPath = __DIR__ . "/../public/assets/styles.css";
  $cssUrl  = "/assets/styles.css";
  $ver     = is_file($cssPath) ? filemtime($cssPath) : time();
?>
<link rel="stylesheet" href="<?= $cssUrl ?>?v=<?= time() ?>">
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=<?= time() ?>">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=<?= time() ?>">
<link rel="shortcut icon" href="/favicon.ico?v=<?= time() ?>">
</head>
<body>
<div class="min-h-screen bg-white">
  <header class="border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="py-4">
        <nav class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center justify-between">
            <a href="/" class="flex items-center space-x-2">
              <img src="/logo.png" alt="Applicants.IO Logo" class="h-8 w-auto">
              <span class="text-xl font-headline font-semibold">Applicants.IO</span>
            </a>
          </div>
          <div class="hidden md:flex items-center space-x-6 mt-4 md:mt-0">
            <a href="/" class="text-gray-700 hover:text-blue-600">Jobs</a>
            <a href="/employer-reviews" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Employer Reviews</a>
          </div>
        </nav>
      </div>
    </div>
  </header>
  <main class="container mx-auto px-4 py-6">
    <?= $body ?>
  </main>
  <footer class="border-t border-gray-200 mt-12 py-6">
    <div class="container mx-auto px-4 text-center text-gray-600">
      &copy; <?= date('Y') ?> Applicants.IO. All rights reserved.
    </div>
  </footer>
</div>
</body>
</html>