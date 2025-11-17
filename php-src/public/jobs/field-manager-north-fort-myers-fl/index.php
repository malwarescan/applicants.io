<?php
require __DIR__ . '/../../../app/bootstrap.php';
use App\Renderer;
use App\Data;

// Extract job slug from directory name
$slug = basename(dirname(__FILE__));

// Load jobs and find by identifier.value (slug)
$jobs = Data::readJson('data/jobs.json');
$job = null;
foreach ($jobs as $j) {
    if (($j['identifier']['value'] ?? '') === $slug) {
        $job = $j;
        break;
    }
}

if (!$job) {
    http_response_code(404);
    echo '<h1>Job Not Found</h1>';
    exit;
}

require_once __DIR__ . '/../../../includes/schema_jobposting_unified.php';
$jsonLd = generate_jobposting_schema($job);

[$head, $body] = Renderer::render('job-detail-unified', [
    'job' => $job,
    'canonical' => '/jobs/' . $slug . '/',
], [
    'title' => $job['title'] . ' in ' . $job['location'] . ' | Applicants.io',
    'desc' => substr(strip_tags($job['description']), 0, 160) . '...',
    'canonical' => '/jobs/' . $slug . '/',
    'jsonld' => $jsonLd,
]);

require __DIR__ . '/../../../views/layout.php';
