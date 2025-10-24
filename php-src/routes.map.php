<?php
use App\Data;

// Static pages to prerender
$routes = [
  ['/', ['pattern'=>'#^/$#']],
  ['/jobs/', ['pattern'=>'#^/jobs/?$#']],
  ['/post-job/', ['pattern'=>'#^/post-job/?$#']],
  ['/contact/', ['pattern'=>'#^/contact/?$#']],
];

// Dynamic generation from jobs data
$jobs = Data::readJson('data/jobs.json');
foreach ($jobs as $job) {
  $routes[] = ["/jobs/{$job['id']}/", ['pattern'=>'#^/jobs/(?P<id>[^/]+)/?$#','params'=>['id'=>$job['id']]]];
}

// Category routes - get all unique industries
$industries = array_unique(array_column($jobs, 'industry'));
foreach ($industries as $industry) {
  $category = strtolower(str_replace(' ', '-', $industry));
  $routes[] = ["/jobs/category/$category/", ['pattern'=>'#^/jobs/category/(?P<slug>[^/]+)/?$#','params'=>['slug'=>$category]]];
}

return $routes;