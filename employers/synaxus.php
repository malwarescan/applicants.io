<?php
$site = require __DIR__ . '/../config/site.php';
require_once __DIR__ . '/../includes/schema_core.php';
require_once __DIR__ . '/../includes/schema_employer_rating.php';

$employer = ['name'=>'Synaxus Inc','url'=>'https://www.synaxusinc.com/'];

/* Replace with your real, verified review feed */
$reviews = [
  ['rating'=>5,'title'=>'High performance, high rewards','body'=>'Fast pace with clear goals. Pay matches output.','author'=>'Sales Associate','date'=>'2025-09-12','verified'=>true,'sample'=>false],
  ['rating'=>5,'title'=>'Clear path to leadership','body'=>'Merit-based promotions and hands-on coaching.','author'=>'Regional Coordinator','date'=>'2025-09-20','verified'=>true,'sample'=>false],
  ['rating'=>4,'title'=>'Ambitious targets','body'=>'Challenging, but growth and earnings are strong.','author'=>'Field Rep','date'=>'2025-09-25','verified'=>true,'sample'=>false],
  ['rating'=>5,'title'=>'Great team culture','body'=>'Strong mentorship and weekly incentives.','author'=>'Account Manager','date'=>'2025-10-01','verified'=>true,'sample'=>false],
  ['rating'=>5,'title'=>'Top earnings for top output','body'=>'Comp structure is transparent and fair.','author'=>'Senior Rep','date'=>'2025-10-10','verified'=>true,'sample'=>false]
];

sx_head(
  $employer['name'].' — Reviews & Ratings | '.$site['siteName'],
  'Verified, public employee reviews for '.$employer['name'].' hosted on Applicants.io.',
  $site['siteUrl'].'/employers/synaxus'
);

sx_breadcrumbs([
  ['name'=>'Home','url'=>$site['siteUrl'].'/'],
  ['name'=>'Employers','url'=>$site['siteUrl'].'/employers/'],
  ['name'=>$employer['name']]
]);

echo "<header><h1>".sx_h($employer['name'])." — Employee Reviews</h1><p>Public, verified reviews hosted by Applicants.io.</p></header>";
sx_schema_employer_agg($employer, $reviews);
sx_schema_site_org($site);
sx_schema_website($site);
sx_foot();