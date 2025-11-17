# Unified Job Posting Template Guide

## Overview

This guide documents the unified, Google-compliant job posting template system for Applicants.io. All templates follow Google's JobPosting schema requirements and ensure eligibility for Google Jobs.

## Template Files

### 1. Job Detail Page Template
**File**: `php-src/views/pages/job-detail-unified.php`

Complete job detail page with all required fields visible and matching structured data.

### 2. Schema Generator
**File**: `php-src/includes/schema_jobposting_unified.php`

Generates compliant JobPosting JSON-LD schema with validation.

### 3. Job Listing Card Component
**File**: `php-src/views/components/job-listing-card.php`

Reusable job card component for listing pages.

## Usage

### Rendering a Job Detail Page

```php
use App\Renderer;
use App\Data;

// Load job data
$job = [
    'title' => 'Software Engineer',
    'description' => '<p>We are looking for an experienced software engineer...</p>',
    'datePosted' => '2025-01-15',
    'validThrough' => '2025-02-15T23:59:59-05:00',
    'hiringOrganization' => [
        'name' => 'Tech Company Inc',
        'sameAs' => 'https://www.techcompany.com',
        'logo' => 'https://www.techcompany.com/logo.png',
    ],
    'employmentType' => ['FULL_TIME'],
    'jobLocation' => [
        [
            'city' => 'San Francisco',
            'region' => 'CA',
            'country' => 'US',
        ],
    ],
    'jobLocationType' => 'HYBRID',
    'baseSalary' => [
        'currency' => 'USD',
        'minValue' => 100000,
        'maxValue' => 150000,
        'unitText' => 'YEAR',
    ],
    'identifier' => [
        'name' => 'Applicants.io',
        'value' => 'JOB-12345',
    ],
    'applicationContact' => [
        'email' => 'jobs@techcompany.com',
        'url' => 'https://www.techcompany.com/apply',
    ],
    'qualifications' => '<p>Bachelor\'s degree in Computer Science...</p>',
    'responsibilities' => '<ul><li>Develop web applications...</li></ul>',
    'skills' => '<p>JavaScript, React, Node.js</p>',
    'benefits' => '<p>Health insurance, 401k, remote work</p>',
];

// Render page
[$head, $body] = Renderer::render('job-detail-unified', [
    'job' => $job,
    'canonical' => '/jobs/JOB-12345',
], [
    'title' => $job['title'] . ' at ' . $job['hiringOrganization']['name'],
    'desc' => substr(strip_tags($job['description']), 0, 160) . '...',
    'canonical' => '/jobs/JOB-12345',
    'jsonld' => generate_jobposting_schema($job),
]);

require __DIR__ . '/views/layout.php';
```

### Generating Schema Only

```php
require_once __DIR__ . '/includes/schema_jobposting_unified.php';

$job = [/* job data */];
$schema = generate_jobposting_schema($job);

// Or output directly
output_jobposting_schema($job);
```

### Using Job Listing Card

```php
require_once __DIR__ . '/views/components/job-listing-card.php';

foreach ($jobs as $job) {
    render_job_card($job);
}
```

## Required Fields

### Minimum Required (Google Jobs Eligibility)

1. **title** (string): Job title
2. **description** (string): Full job description
3. **datePosted** (string): ISO 8601 date (YYYY-MM-DD)
4. **hiringOrganization** (array): Company information
   - `name` (string): Company name
   - `sameAs` (string, optional): Company website URL
   - `logo` (string, optional): Company logo URL
5. **jobLocation** (array): Work location(s)
   - Each location must have at least `city` or `region`
   - `country` recommended

### Highly Recommended

6. **validThrough** (string): ISO 8601 datetime (must be future)
7. **employmentType** (array): ['FULL_TIME', 'PART_TIME', etc.]
8. **baseSalary** (array): Salary information
9. **applicationContact** (array): At least one required
   - `email`, `phone`, or `url`
10. **jobLocationType** (string): 'ON_SITE', 'REMOTE', or 'HYBRID'
11. **identifier** (array): Unique job ID
    - `name`: Source name (e.g., 'Applicants.io')
    - `value`: Unique identifier

### Optional but Beneficial

12. **qualifications** (string): Required qualifications
13. **responsibilities** (string): Job responsibilities
14. **skills** (string): Required skills
15. **benefits** (string): Benefits offered

## Google Compliance Rules

### Critical Requirements

1. **All schema fields MUST be visible on the page**
   - If you include `baseSalary` in schema, it must be visible
   - If you include `qualifications`, they must be visible
   - Google cross-checks schema against visible content

2. **validThrough must be in the future**
   - Format: ISO 8601 datetime (e.g., '2025-02-15T23:59:59-05:00')
   - Jobs with past `validThrough` dates are removed from Google Jobs

3. **At least one application method required**
   - Must provide `email`, `phone`, or `url` in `applicationContact`
   - All provided methods must be functional

4. **hiringOrganization must be real and verifiable**
   - Company name must match real business
   - `sameAs` URL should be company's official website
   - Logo should be company's actual logo

5. **jobLocation must be accurate**
   - Address must be real and verifiable
   - For remote jobs, use `jobLocationType: 'REMOTE'`
   - For hybrid, specify both remote and office locations

6. **baseSalary must match visible salary**
   - If salary is shown, schema must match exactly
   - Currency must be correct (USD, EUR, etc.)
   - Unit must be accurate (YEAR, HOUR, etc.)

### Common Violations to Avoid

❌ **Don't**: Include fields in schema that aren't visible  
❌ **Don't**: Use fake or placeholder company information  
❌ **Don't**: Set `validThrough` in the past  
❌ **Don't**: Use misleading job titles or descriptions  
❌ **Don't**: Include multiple conflicting locations  
❌ **Don't**: Use placeholder or test data in production  
❌ **Don't**: Include HTML tags in schema text fields (use `strip_tags()`)  

✅ **Do**: Match schema exactly to visible content  
✅ **Do**: Use real, verifiable company information  
✅ **Do**: Set `validThrough` at least 30 days in future  
✅ **Do**: Use accurate, specific job titles  
✅ **Do**: Provide clear application instructions  
✅ **Do**: Validate all data before generating schema  

## Data Structure Reference

### Complete Job Data Array

```php
$job = [
    // REQUIRED
    'title' => 'Software Engineer',
    'description' => '<p>Full HTML description...</p>',
    'datePosted' => '2025-01-15', // YYYY-MM-DD
    'hiringOrganization' => [
        'name' => 'Company Name',
        'sameAs' => 'https://www.company.com',
        'logo' => 'https://www.company.com/logo.png',
        'description' => 'Company description (optional)',
    ],
    'jobLocation' => [
        [
            'city' => 'San Francisco',
            'region' => 'CA',
            'country' => 'US',
            'postalCode' => '94102', // optional
            'streetAddress' => '123 Main St', // optional
        ],
    ],
    
    // HIGHLY RECOMMENDED
    'validThrough' => '2025-02-15T23:59:59-05:00', // ISO 8601
    'employmentType' => ['FULL_TIME'], // or ['PART_TIME', 'CONTRACTOR']
    'jobLocationType' => 'HYBRID', // 'ON_SITE', 'REMOTE', or 'HYBRID'
    'baseSalary' => [
        'currency' => 'USD',
        'minValue' => 100000,
        'maxValue' => 150000,
        'unitText' => 'YEAR', // 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'
    ],
    'identifier' => [
        'name' => 'Applicants.io',
        'value' => 'JOB-12345',
    ],
    'applicationContact' => [
        'email' => 'jobs@company.com',
        'phone' => '+1-555-123-4567',
        'url' => 'https://www.company.com/apply',
    ],
    
    // OPTIONAL
    'qualifications' => '<p>Required qualifications...</p>',
    'responsibilities' => '<p>Job responsibilities...</p>',
    'skills' => '<p>Required skills...</p>',
    'benefits' => '<p>Benefits offered...</p>',
    'directApply' => true,
    'applicantLocationRequirements' => [
        ['@type' => 'Country', 'name' => 'United States'],
    ],
    'workHours' => '40 hours per week',
];
```

## Integration with Existing System

### Update Routes

```php
// In routes.web.php
'#^/jobs/(?P<id>[^/]+)/?$#' => function($p) {
    $id = $p['id'] ?? '';
    $jobs = Data::readJson('data/jobs.json');
    $job = null;
    foreach ($jobs as $j) {
        if ($j['id'] === $id || ($j['identifier']['value'] ?? '') === $id) {
            $job = $j;
            break;
        }
    }
    if (!$job) {
        return ["<title>Job Not Found</title>", "<h1>404 - Job Not Found</h1>"];
    }
    
    // Transform to unified format if needed
    $unifiedJob = transform_to_unified_format($job);
    
    require_once __DIR__ . '/../includes/schema_jobposting_unified.php';
    $jsonLd = generate_jobposting_schema($unifiedJob);
    
    return Renderer::render('job-detail-unified', [
        'job' => $unifiedJob,
        'canonical' => "/jobs/$id/",
    ], [
        'title' => $unifiedJob['title'] . ' at ' . $unifiedJob['hiringOrganization']['name'],
        'desc' => substr(strip_tags($unifiedJob['description']), 0, 160) . '...',
        'canonical' => "/jobs/$id/",
        'jsonld' => $jsonLd,
    ]);
},
```

## Testing

### Validate Schema

```php
require_once __DIR__ . '/includes/schema_jobposting_unified.php';

$job = [/* test job data */];

try {
    $schema = generate_jobposting_schema($job);
    echo "✓ Schema generated successfully\n";
    echo json_encode($schema, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
```

### Test with Google Rich Results Test

1. Render a job page locally
2. Copy the HTML output
3. Paste into [Google Rich Results Test](https://search.google.com/test/rich-results)
4. Verify no errors or warnings

## Next Steps

1. ✅ Templates created
2. ⏳ Update existing job pages to use unified template
3. ⏳ Add Google policy documentation (when provided)
4. ⏳ Create migration script for existing jobs
5. ⏳ Set up automated validation

## Notes

- This template system will be updated once Google's specific policies are documented
- All templates follow current Google JobPosting schema requirements
- Schema validation ensures compliance before output

