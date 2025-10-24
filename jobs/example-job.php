<?php
$site = require __DIR__ . '/../config/site.php';
require_once __DIR__ . '/../includes/schema_core.php';
require_once __DIR__ . '/../includes/schema_jobposting.php';

$job = [
  'title' => 'Account Manager — Cape Coral, FL',
  'description' => '<p>Own local territory, build relationships, and drive growth. Clear goals, strong coaching.</p>',
  'datePosted' => date('Y-m-d'),
  'validThrough' => date('Y-m-d\\T23:59:59P', strtotime('+37 days')),
  'employmentType' => ['FULL_TIME'],
  'directApply' => true,
  'jobLocationType' => 'HYBRID',
  'applicantLocationRequirements' => [
    ['@type'=>'Country','name'=>'US']
  ],
  'jobLocation' => [
    ['city'=>'Cape Coral','region'=>'FL','country'=>'US']
  ],
  'salary' => ['currency'=>'USD','min'=>60000,'max'=>110000,'unit'=>'YEAR'],
  'identifier' => ['name'=>'Applicants.io','value'=>'JOB-EXAMPLE-001'],
  'hiringOrganization' => [
    'name' => 'Synaxus Inc',
    'sameAs' => 'https://www.synaxusinc.com/',
    'logo' => $site['siteUrl'].'/static/synaxus-logo.png'
  ]
];

sx_head(
  $job['title'].' | '.$site['siteName'],
  'Apply fast via Applicants.io. '.$job['title'].' at '.$job['hiringOrganization']['name'],
  $site['siteUrl'].'/jobs/example-job'
);

sx_breadcrumbs([
  ['name'=>'Home','url'=>$site['siteUrl'].'/'],
  ['name'=>'Jobs','url'=>$site['siteUrl'].'/jobs/'],
  ['name'=>$job['title']]
]);

sx_render_job_visible($job);
sx_schema_jobposting($job);
sx_schema_site_org($site);
sx_schema_website($site);

/* Optional, per-page FAQs — must be visible to users */
$faq = [
  ['q'=>'Is this a direct-apply job?','a'=>'Yes, you can apply directly on Applicants.io.'],
  ['q'=>'Is training provided?','a'=>'Yes, full onboarding and field training are provided.']
];
sx_schema_faq($faq);

sx_foot();
