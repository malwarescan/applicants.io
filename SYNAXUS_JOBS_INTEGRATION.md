# Synaxus Jobs Integration Guide

## Overview

This guide documents the integration system for scraping and displaying Synaxus Inc. job postings on the Applicants.io platform. The system extracts JobPosting schema data from synaxusinc.com and displays it on applicants.io while maintaining proper structured data for search engine rich results.

## Architecture

### Components

1. **PHP Scraper** (`scripts/scrape-synaxus-jobs.php`)
   - Extracts JobPosting schema JSON-LD from synaxusinc.com/careers
   - Transforms data to our internal format
   - Saves to `data/synaxus_jobs.json`

2. **PHP API Endpoint** (`php-src/api/synaxus-jobs.php`)
   - Serves scraped job data via REST API
   - Handles automatic scraping if data file doesn't exist
   - Returns jobs in both internal and external formats

3. **PHP Job Renderer** (`php-src/app/SynaxusJobRenderer.php`)
   - Generates static HTML pages for each job
   - Implements proper JobPosting schema markup
   - Creates SEO-friendly job detail pages

4. **React Integration Service** (`src/services/jobIntegrationService.ts`)
   - Fetches jobs from PHP API endpoint
   - Merges Synaxus jobs with existing job listings
   - Provides UI integration hooks

5. **Scheduled Updater** (`scripts/update-synaxus-jobs.sh`)
   - Cron-ready script for automatic job updates
   - Logs update activity
   - Can trigger site rebuild if needed

## How It Works

### Scraping Process

1. **Fetch HTML**: The scraper downloads the synaxusinc.com/careers page
2. **Extract JSON-LD**: Parses all `<script type="application/ld+json">` tags
3. **Find JobPostings**: Extracts JobPosting objects from the JSON-LD structure
4. **Transform Data**: Converts Synaxus format to our internal format
5. **Save**: Writes to `data/synaxus_jobs.json`

### Data Flow

```
synaxusinc.com/careers
    ↓
[PHP Scraper extracts JobPosting schema]
    ↓
data/synaxus_jobs.json
    ↓
[PHP API serves data]
    ↓
[React app fetches and displays]
```

## Usage

### Manual Scraping

Run the scraper manually:

```bash
php scripts/scrape-synaxus-jobs.php --save
```

Without the `--save` flag, it will output JSON to console.

### Accessing Jobs via API

The PHP API endpoint provides access to scraped jobs:

```
GET /api/synaxus-jobs.php
```

Response format:

```json
{
  "success": true,
  "jobs": [
    {
      "title": "Field Marketing Coordinator",
      "description": "...",
      "datePosted": "2025-10-06",
      "validThrough": "2025-12-24",
      "employmentType": ["FULL_TIME"],
      "directApply": true,
      "jobLocationType": "TELECOMMUTE",
      "jobLocation": [{
        "city": "Fort Myers",
        "region": "FL",
        "country": "US"
      }],
      "salary": {
        "currency": "USD",
        "min": 18,
        "max": 22,
        "unit": "HOUR"
      },
      "hiringOrganization": {
        "name": "Synaxus Inc.",
        "sameAs": "https://synaxusinc.com",
        "logo": "https://synaxusinc.com/synaxus-logo.png"
      },
      "url": "https://synaxusinc.com/jobs/...",
      "contactEmail": "careers@synaxusinc.com",
      "contactPhone": "+1-941-564-9169",
      "industry": "Marketing Services"
    }
  ],
  "meta": {
    "lastUpdated": "2025-10-25T14:38:34+00:00",
    "source": "synaxusinc.com",
    "totalJobs": 6
  }
}
```

### Enabling Integration in React

The job integration service is disabled by default. To enable:

```typescript
import { jobIntegrationService } from './services/jobIntegrationService';

// Enable integration
jobIntegrationService.setEnabled(true);

// Fetch jobs
const jobs = await jobIntegrationService.fetchSynaxusJobs();
```

Or use the React hook:

```typescript
import { useExternalJobs } from './hooks/useExternalJobs';

function MyComponent() {
  const { externalJobs, isLoading, fetchJobs, setEnabled } = useExternalJobs();
  
  // Enable and fetch
  setEnabled(true);
  
  return (
    <div>
      {externalJobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}
```

### Scheduled Updates

Set up automatic updates via cron:

```bash
# Update every 6 hours
0 */6 * * * /path/to/scripts/update-synaxus-jobs.sh
```

Or add to your CI/CD pipeline to update on deploy.

## JobPosting Schema Compliance

The system maintains proper JobPosting schema markup for Google rich results. Each job includes:

- **Required Fields**:
  - `title`: Job title
  - `description`: Job description
  - `datePosted`: Posting date
  - `hiringOrganization`: Company information
  - `jobLocation`: Work location

- **Recommended Fields**:
  - `employmentType`: Full-time, part-time, etc.
  - `baseSalary`: Salary range
  - `validThrough`: Posting expiration
  - `applicationContact`: Contact information
  - `qualifications`: Job requirements
  - `jobBenefits`: Benefits offered

All jobs are rendered with proper JSON-LD schema markup that matches the visible content on the page.

## Data Format

### Internal Job Format

```php
[
    'title' => 'Field Marketing Coordinator',
    'description' => '...',
    'datePosted' => '2025-10-06',
    'validThrough' => '2025-12-24',
    'employmentType' => ['FULL_TIME'],
    'directApply' => true,
    'jobLocationType' => 'TELECOMMUTE',
    'jobLocation' => [
        [
            'city' => 'Fort Myers',
            'region' => 'FL',
            'country' => 'US'
        ]
    ],
    'salary' => [
        'currency' => 'USD',
        'min' => 18,
        'max' => 22,
        'unit' => 'HOUR'
    ],
    'identifier' => [
        'name' => 'Synaxus Inc.',
        'value' => 'field-marketing-coordinator-fort-myers'
    ],
    'hiringOrganization' => [
        'name' => 'Synaxus Inc.',
        'sameAs' => 'https://synaxusinc.com',
        'logo' => 'https://synaxusinc.com/synaxus-logo.png'
    ],
    'url' => 'https://synaxusinc.com/jobs/...',
    'contactEmail' => 'careers@synaxusinc.com',
    'contactPhone' => '+1-941-564-9169',
    'industry' => 'Marketing Services',
    'skills' => 'Customer Service, Sales, Marketing',
    'responsibilities' => 'Brand representation, customer engagement',
    'jobBenefits' => ['Competitive compensation', '...'],
    'qualifications' => ['Excellent communication skills', '...']
]
```

## Integration with Build Process

### Static Site Generation

To generate static HTML pages for Synaxus jobs:

```php
require_once 'php-src/app/SynaxusJobRenderer.php';

$site = require 'config/site.php';
SynaxusJobRenderer::generateAll('dist', $site);
```

This creates:
- `dist/jobs/synaxus/{job-id}/index.html` for each job

### React Build Integration

Add to your build script to fetch and include Synaxus jobs:

```json
{
  "scripts": {
    "build": "npm run build:scrape && npm run build:react",
    "build:scrape": "php scripts/scrape-synaxus-jobs.php --save",
    "build:react": "react-scripts build"
  }
}
```

## Monitoring

Check scraper logs:

```bash
tail -f logs/synaxus-jobs-update.log
```

Verify API endpoint:

```bash
curl http://localhost/api/synaxus-jobs.php | jq '.totalJobs'
```

## Troubleshooting

### Scraper Returns No Jobs

1. Check synaxusinc.com/careers is accessible
2. Verify the HTML structure hasn't changed
3. Check for errors in the scraper output

### API Returns Error

1. Verify `data/synaxus_jobs.json` exists
2. Check file permissions
3. Review API error messages

### Jobs Not Showing in UI

1. Ensure integration is enabled: `jobIntegrationService.setEnabled(true)`
2. Check browser console for fetch errors
3. Verify CORS headers are properly set

## Best Practices

1. **Update Regularly**: Set up cron jobs to scrape every 6-12 hours
2. **Monitor Changes**: Alert if job count changes significantly
3. **Error Handling**: Log all scraping errors
4. **Rate Limiting**: Respect synaxusinc.com server resources
5. **Schema Validation**: Periodically validate JobPosting schema markup

## Legal Considerations

Since both synaxusinc.com and applicants.io are owned by the same entity, scraping and displaying this data is legal and ethical. The system:

- Only accesses publicly available data
- Respects robots.txt
- Maintains attribution to Synaxus Inc.
- Uses proper JobPosting schema markup
- Links back to original job postings

## Future Enhancements

- Real-time job updates via webhooks
- Multi-employer support
- Job filtering and search integration
- Analytics tracking for job views
- Application funnel tracking
