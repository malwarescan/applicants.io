# Synaxus Jobs Scraping Implementation Summary

## What Was Implemented

A complete system to scrape job postings from synaxusinc.com and display them on applicants.io while maintaining proper JobPosting schema for Google rich results.

## Files Created

### 1. Core Scraper
- **`scripts/scrape-synaxus-jobs.php`**: Main scraper that extracts JobPosting schema JSON-LD from synaxusinc.com/careers
  - Fetches HTML from careers page
  - Extracts all JSON-LD script tags
  - Identifies JobPosting objects
  - Transforms to internal format
  - Saves to `data/synaxus_jobs.json`

### 2. API Endpoint
- **`php-src/api/synaxus-jobs.php`**: REST API endpoint serving scraped jobs
  - Returns jobs in JSON format
  - Auto-scrapes if data file doesn't exist
  - Handles both web and CLI requests

### 3. Data Transformation
- **`php-src/app/SynaxusJobsTransformer.php`**: Transforms Synaxus JobPosting schema to EnhancedJob format
  - Converts schema.org format to application format
  - Handles location, salary, and employment type mapping
  - Creates unique job IDs

### 4. Job Renderer
- **`php-src/app/SynaxusJobRenderer.php`**: Generates static HTML pages for each job
  - Creates pages with proper JobPosting schema markup
  - Renders visible job content
  - Generates SEO-friendly URLs

### 5. Automated Updates
- **`scripts/update-synaxus-jobs.sh`**: Cron-ready script for scheduled updates
  - Runs scraper
  - Logs activity
  - Can trigger site rebuild

### 6. React Integration
- **Updated `src/services/jobIntegrationService.ts`**: Fetches jobs from PHP API
  - Calls `/api/synaxus-jobs.php` endpoint
  - Transforms to ExternalJob format
  - Integrates with existing job listings

### 7. Documentation
- **`SYNAXUS_JOBS_INTEGRATION.md`**: Complete integration guide
- **`SYNAXUS_IMPLEMENTATION_SUMMARY.md`**: This summary document

## How It Works

1. **Scraping**: PHP script extracts JobPosting schema JSON-LD from synaxusinc.com
2. **Storage**: Jobs saved to `data/synaxus_jobs.json`
3. **API**: PHP endpoint serves jobs to React app
4. **Display**: React components fetch and display jobs
5. **Schema**: Each job rendered with proper JobPosting schema markup

## Testing Results

- Successfully scraped 6 jobs from synaxusinc.com
- JobPosting schema properly extracted and transformed
- API endpoint returns valid JSON
- No linter errors in TypeScript code

## Usage

### Run Scraper Manually
```bash
php scripts/scrape-synaxus-jobs.php --save
```

### Access via API
```bash
curl http://localhost/api/synaxus-jobs.php
```

### Enable in React
```typescript
jobIntegrationService.setEnabled(true);
```

### Schedule Updates
```bash
# Add to crontab
0 */6 * * * /path/to/scripts/update-synaxus-jobs.sh
```

## Key Features

1. **Schema-Aware**: Extracts and preserves JobPosting schema from synaxusinc.com
2. **Automatic**: Can be scheduled to update regularly
3. **Flexible**: Works as API endpoint or CLI tool
4. **SEO-Friendly**: Meets Google JobPosting requirements
5. **Legal**: Ethical scraping since you own both sites

## Next Steps

1. Set up cron job for automatic updates
2. Integrate Synaxus jobs into main job listings
3. Generate static HTML pages for each job
4. Monitor scraping logs for issues
5. Add job filtering/search integration

## Data Format

Jobs are stored with all required JobPosting schema fields:
- Title, description, dates
- Location (city, region, country)
- Salary (currency, min, max, unit)
- Organization (name, logo, URL)
- Contact information
- Skills, qualifications, benefits

This ensures rich results in Google Search and maintains SEO value.
