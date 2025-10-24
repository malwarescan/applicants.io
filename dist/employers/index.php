<?php
require_once __DIR__ . '/../../app/bootstrap.php';
use App\Renderer;

// List of available employers
$employers = [
    [
        'name' => 'Synaxus Inc',
        'slug' => 'synaxus',
        'url' => 'https://www.synaxusinc.com/',
        'description' => 'Technology and consulting services company'
    ]
];

[$head, $body] = Renderer::render('employers-index', [
    'employers' => $employers
], [
    'title' => 'Employer Reviews - Applicants.io',
    'desc' => 'Browse verified employee reviews and ratings for top companies.',
    'canonical' => 'https://www.applicants.io/employers/'
]);

require __DIR__ . '/../../views/layout.php';
