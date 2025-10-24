<?php
declare(strict_types=1);
/**
 * Minimal importer. Paste CSV lines to append reviews to data/synaxus_reviews.json.
 * Columns (8): rating(1-5), title, body, authorRole, location, date(YYYY-MM-DD), verified(true/false), is_sample(true/false)
 */

$path = __DIR__ . '/../data/synaxus_reviews.json';
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
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Import Synaxus Reviews (Applicants.io)</title>
</head>
<body>
  <main>
    <h1>Import Synaxus Reviews (CSV)</h1>
    <?php if ($msg): ?><p><?php echo htmlspecialchars($msg); ?></p><?php endif; ?>
    <p>Columns: rating, title, body, authorRole, location, date(YYYY-MM-DD), verified(true/false), is_sample(true/false)</p>
    <form method="post">
      <textarea name="csv" rows="12" cols="100" placeholder="5,Great leadership,Clear goals and strong coaching,Sales Associate,Fort Myers,2025-06-01,true,false"></textarea>
      <p><button type="submit">Import</button></p>
    </form>
    <p><small>Note: Only verified, non-sample reviews count toward stars and schema. At least 5 required.</small></p>
  </main>
</body>
</html>
