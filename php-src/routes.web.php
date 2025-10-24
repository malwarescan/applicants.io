<?php
use App\Renderer;
use App\Data;

return [
  '#^/$#' => function() {
    return Renderer::render('home', [], ['title'=>'Job Listings - Applicants.IO','desc'=>'Find your next career opportunity with our comprehensive job listings.','canonical'=>'/']);
  },
  '#^/jobs/?$#' => function() {
    return Renderer::render('jobs-index', [], ['title'=>'Job Listings - Applicants.IO','desc'=>'Find your next career opportunity with our comprehensive job listings.','canonical'=>'/jobs/']);
  },
  '#^/jobs/(?P<id>[^/]+)/?$#' => function($p) {
    $id = $p['id'] ?? '';
    $jobs = Data::readJson('data/jobs.json');
    $job = null;
    foreach ($jobs as $j) {
      if ($j['id'] === $id) {
        $job = $j;
        break;
      }
    }
    if (!$job) {
      return ["<title>Job Not Found - Applicants.IO</title>", "<h1>404 - Job Not Found</h1>"];
    }
    return Renderer::render('job-detail', ['id'=>$id], [
      'title'=> $job['title'] . ' at ' . $job['company'] . ' in ' . $job['location'],
      'desc'=> substr($job['description'], 0, 160) . '...',
      'canonical'=>"/jobs/$id/",
      'jsonld'=> [
        '@context' => 'https://schema.org',
        '@type' => 'JobPosting',
        'title' => $job['title'],
        'description' => $job['description'],
        'hiringOrganization' => [
          '@type' => 'Organization',
          'name' => $job['company']
        ],
        'jobLocation' => [
          '@type' => 'Place',
          'address' => $job['location']
        ],
        'datePosted' => $job['postedDate']
      ]
    ]);
  },
  '#^/jobs/category/(?P<slug>[^/]+)/?$#' => function($p) {
    $slug = $p['slug'] ?? '';
    $industry = str_replace('-', ' ', $slug);
    $industry = ucwords($industry);
    $jobs = Data::readJson('data/jobs.json');
    $categoryJobs = array_filter($jobs, function($job) use ($industry) {
      return strtolower($job['industry']) === strtolower($industry);
    });
    return Renderer::render('jobs-category', ['slug'=>$slug], [
      'title'=> $industry . ' Jobs - Find ' . $industry . ' Careers',
      'desc'=> 'Browse ' . count($categoryJobs) . '+ ' . $industry . ' jobs and careers. Find your next ' . $industry . ' position with top companies.',
      'canonical'=>"/jobs/category/$slug/"
    ]);
  },
  '#^/post-job/?$#' => function() {
    return Renderer::render('post-job', [], ['title'=>'Post a Job - Applicants.IO','desc'=>'Post your job listing and reach qualified candidates.','canonical'=>'/post-job/']);
  },
  '#^/contact/?$#' => function() {
    return Renderer::render('contact', [], ['title'=>'Contact Us - Applicants.IO','desc'=>'Get in touch with us for support or questions.','canonical'=>'/contact/']);
  },
  '#^/employer-reviews/?$#' => function() {
    // List of available employers
    $employers = [
      [
        'name' => 'Synaxus Inc',
        'slug' => 'synaxus',
        'url' => 'https://www.synaxusinc.com/',
        'description' => 'Technology and consulting services company'
      ]
    ];
    
    return Renderer::render('employers-index', ['employers' => $employers], [
      'title' => 'Employer Reviews - Applicants.io',
      'desc' => 'Browse verified employee reviews and ratings for top companies.',
      'canonical' => '/employer-reviews/'
    ]);
  },
  '#^/employers/?$#' => function() {
    // List of available employers
    $employers = [
      [
        'name' => 'Synaxus Inc',
        'slug' => 'synaxus',
        'url' => 'https://www.synaxusinc.com/',
        'description' => 'Technology and consulting services company'
      ]
    ];
    
    return Renderer::render('employers-index', ['employers' => $employers], [
      'title' => 'Employer Reviews - Applicants.io',
      'desc' => 'Browse verified employee reviews and ratings for top companies.',
      'canonical' => '/employers/'
    ]);
  },
];