<?php
require_once __DIR__ . '/../../../../app/bootstrap.php';
require_once __DIR__ . '/../../../includes/reviews_employer.php';

$path = __DIR__ . '/data/synaxus_reviews.json';
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $csv = trim($_POST['csv'] ?? '');
  if ($csv !== '') {
    $db = file_exists($path) ? json_decode((string)file_get_contents($path), true) : ['meta'=>[
      'employerName' => 'Synaxus Inc',
      'employerUrl'  => 'https://www.synaxusinc.com/',
      'source'       => 'Applicants.io employer reviews',
      'lastUpdated'  => date('Y-m-d')
    ], 'reviews'=>[]];
    if (!is_array($db)) $db = ['meta'=>['lastUpdated'=>date('Y-m-d')],'reviews'=>[]];

    $lines = preg_split('/\r\n|\r|\n/', $csv);
    foreach ($lines as $i => $line) {
      if (trim($line) === '') continue;
      $cols = str_getcsv($line);
      if (count($cols) < 8) continue;
      [$rating,$title,$body,$authorRole,$location,$date,$verified,$is_sample] = $cols;

      $db['reviews'][] = [
        'id'         => 'R'.time().$i,
        'rating'     => max(1, min(5, (int)$rating)),
        'title'      => trim($title),
        'body'       => trim($body),
        'authorRole' => trim($authorRole) ?: 'Employee',
        'location'   => trim($location),
        'date'       => preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? $date : date('Y-m-d'),
        'verified'   => filter_var($verified, FILTER_VALIDATE_BOOLEAN),
        'is_sample'  => filter_var($is_sample, FILTER_VALIDATE_BOOLEAN)
      ];
    }
    $db['meta']['lastUpdated'] = date('Y-m-d');
    file_put_contents($path, json_encode($db, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE));
    $msg = "Imported successfully. Total reviews: " . count($db['reviews']);
  }
}

// Load current data for display
$data = ai_load_reviews($path);
$verified = ai_verified_reviews($data);
$agg = ai_aggregate($verified);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Synaxus Reviews Admin - Applicants.io</title>
  <link rel="stylesheet" href="/assets/styles.css?v=<?= filemtime(__DIR__ . '/../../../../assets/styles.css') ?>">
</head>
<body>
  <div class="min-h-screen bg-white">
    <header class="border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="py-4">
          <nav class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <a href="/" class="text-xl font-bold text-gray-900">Applicants.io</a>
              <span class="text-gray-400">›</span>
              <a href="/employers/synaxus/" class="text-blue-600 hover:text-blue-800">Synaxus Reviews</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-headline font-bold mb-6">Synaxus Reviews Admin</h1>
        
        <?php if ($msg): ?>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p class="text-green-800"><?= htmlspecialchars($msg) ?></p>
          </div>
        <?php endif; ?>
        
        <!-- Current Stats -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 class="text-lg font-semibold mb-4">Current Statistics</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900"><?= count($data['reviews']) ?></div>
              <div class="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900"><?= count($verified) ?></div>
              <div class="text-sm text-gray-600">Verified Reviews</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900"><?= number_format($agg['avg'], 1) ?></div>
              <div class="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
        
        <!-- Import Form -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold mb-4">Import Reviews (CSV)</h2>
          <p class="text-sm text-gray-600 mb-4">
            Columns: rating, title, body, authorRole, location, date(YYYY-MM-DD), verified(true/false), is_sample(true/false)
          </p>
          <form method="post">
            <textarea name="csv" rows="12" cols="100" 
                      placeholder="5,Great leadership,Clear goals and strong coaching,Sales Associate,Fort Myers,2025-06-01,true,false"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <div class="mt-4">
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Import Reviews
              </button>
            </div>
          </form>
          <p class="text-xs text-gray-500 mt-2">
            Note: Only verified, non-sample reviews count toward stars and schema. At least 5 required.
          </p>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
