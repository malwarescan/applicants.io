<?php
require __DIR__ . '/../../../../app/bootstrap.php';
use App\Renderer;
use App\Data;

$jobId = 'SWFL-00103';
$jobs = Data::readJson('data/jobs.json');
$job = null;
foreach ($jobs as $j) {
    if ($j['id'] === $jobId) {
        $job = $j;
        break;
    }
}
if (!$job) {
    http_response_code(404);
    echo '<h1>Job Not Found</h1>';
    exit;
}

require_once __DIR__ . '/../../../../includes/schema_jobposting_unified.php';
$jsonLd = generate_jobposting_schema($job);

[$head, $body] = Renderer::render('job-detail-unified', [
    'job' => $job,
    'canonical' => '/jobs/retail-product-demonstrator-labelle-fl/',
], [
    'title' => $job['title'] . ' in ' . $job['location'] . ' | Applicants.io',
    'desc' => substr(strip_tags($job['description']), 0, 160) . '...',
    'canonical' => '/jobs/retail-product-demonstrator-labelle-fl/',
    'jsonld' => $jsonLd,
]);

require __DIR__ . '/../../../../views/layout.php';
