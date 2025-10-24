<?php
declare(strict_types=1);
require_once __DIR__ . '/schema_core.php';

/**
 * Build + emit JobPosting JSON-LD.
 * RULES:
 * - The job is PUBLISHED on Applicants.io (this site). Use hiringOrganization for the employer.
 * - All fields used below MUST be visible on the job detail page.
 * - validThrough must be in the future (ISO8601) to stay eligible.
 *
 * $job = [
 *   'title'        => 'Account Manager — Cape Coral, FL',
 *   'description'  => '<p>Visible HTML summary…</p>',
 *   'datePosted'   => '2025-10-24',
 *   'validThrough' => '2025-11-30T23:59:59-05:00',
 *   'employmentType' => ['FULL_TIME'],
 *   'directApply'  => true,
 *   'jobLocationType' => 'HYBRID', // or 'ON_SITE'|'REMOTE'
 *   'applicantLocationRequirements' => [ ['@type'=>'Country','name'=>'US'] ],
 *   'jobLocation'  => [ ['city'=>'Cape Coral','region'=>'FL','country'=>'US'] ],
 *   'salary'       => [ 'currency'=>'USD', 'min'=>60000, 'max'=>110000, 'unit'=>'YEAR' ],
 *   'identifier'   => [ 'name'=>'Applicants.io', 'value'=>'JOB-12345' ],
 *   'hiringOrganization' => [
 *      'name'=>'Synaxus Inc',
 *      'sameAs'=>'https://www.synaxusinc.com/',
 *      'logo'=>'https://www.applicants.io/static/synaxus-logo.png'
 *   ]
 * ];
 */
function sx_schema_jobposting(array $job): void {
  // minimal sanitation
  $title = (string)($job['title'] ?? '');
  $desc  = (string)($job['description'] ?? '');
  $datePosted = (string)($job['datePosted'] ?? '');
  $validThrough = (string)($job['validThrough'] ?? '');
  $empTypes = $job['employmentType'] ?? [];
  if (is_string($empTypes)) $empTypes = [$empTypes];
  $directApply = (bool)($job['directApply'] ?? false);

  $jobLocationType = $job['jobLocationType'] ?? null; // 'ON_SITE'|'HYBRID'|'REMOTE'
  $alr = $job['applicantLocationRequirements'] ?? [];
  $jloc = $job['jobLocation'] ?? [];

  $salary = $job['salary'] ?? null;
  $identifier = $job['identifier'] ?? null;
  $org = $job['hiringOrganization'] ?? [];

  // Build jobLocation array
  $jobLocation = [];
  foreach ($jloc as $p) {
    $jobLocation[] = [
      "@type" => "Place",
      "address" => [
        "@type" => "PostalAddress",
        "addressLocality" => (string)($p['city'] ?? ''),
        "addressRegion"   => (string)($p['region'] ?? ''),
        "addressCountry"  => (string)($p['country'] ?? '')
      ]
    ];
  }

  $doc = [
    "@context" => "https://schema.org",
    "@type" => "JobPosting",
    "title" => $title,
    "description" => $desc,
    "datePosted" => $datePosted,
    "hiringOrganization" => [
      "@type" => "Organization",
      "name" => (string)($org['name'] ?? ''),
      "sameAs" => (string)($org['sameAs'] ?? ''),
      "logo" => (string)($org['logo'] ?? '')
    ],
    "employmentType" => $empTypes ?: null,
    "directApply" => $directApply
  ];

  if ($identifier && !empty($identifier['value'])) {
    $doc['identifier'] = [
      "@type" => "PropertyValue",
      "name"  => (string)($identifier['name'] ?? 'Applicants.io'),
      "value" => (string)$identifier['value']
    ];
  }

  if ($jobLocationType) $doc['jobLocationType'] = $jobLocationType;
  if ($alr) $doc['applicantLocationRequirements'] = $alr;
  if ($jobLocation) $doc['jobLocation'] = $jobLocation;

  if ($salary && isset($salary['currency'], $salary['unit'])) {
    $doc['baseSalary'] = [
      "@type" => "MonetaryAmount",
      "currency" => (string)$salary['currency'],
      "value" => [
        "@type" => "QuantitativeValue",
        "unitText" => (string)$salary['unit'],
        "minValue" => isset($salary['min']) ? (float)$salary['min'] : null,
        "maxValue" => isset($salary['max']) ? (float)$salary['max'] : null
      ]
    ];
  }

  if ($validThrough) $doc['validThrough'] = $validThrough;

  // Clean nulls
  $doc = array_filter($doc, function($v){ return $v !== null && $v !== []; });

  sx_jsonld($doc);
}

/** Visible job summary block to keep JSON-LD consistent with what users see */
function sx_render_job_visible(array $job): void {
  echo "<header><h1>".sx_h($job['title'])."</h1></header>";
  echo "<section>";
  echo "<h2>Role details</h2>";
  echo "<p>Posted: ".sx_h($job['datePosted'])."</p>";
  if (!empty($job['hiringOrganization']['name'])) {
    echo "<p>Employer: ".sx_h($job['hiringOrganization']['name'])."</p>";
  }
  if (!empty($job['employmentType'])) {
    $et = is_array($job['employmentType']) ? implode(', ', $job['employmentType']) : $job['employmentType'];
    echo "<p>Employment type: ".sx_h($et)."</p>";
  }
  if (!empty($job['jobLocationType'])) {
    echo "<p>Work setup: ".sx_h($job['jobLocationType'])."</p>";
  }
  if (!empty($job['salary'])) {
    $s = $job['salary'];
    $range = '';
    if (isset($s['min']) && isset($s['max'])) $range = $s['min']."–".$s['max']." ".$s['currency']." per ".$s['unit'];
    echo "<p>Compensation: ".sx_h($range)."</p>";
  }
  if (!empty($job['validThrough'])) echo "<p>Apply by: ".sx_h($job['validThrough'])."</p>";
  echo "</section>";
  echo "<section><h2>About the role</h2>".$job['description']."</section>";
}
