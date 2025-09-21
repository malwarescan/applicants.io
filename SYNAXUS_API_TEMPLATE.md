# Synaxus Inc. API Template

Since you own both sites, here's a template for creating an API endpoint on your synaxusinc.com site to provide job data to your Applicants.IO platform.

## API Endpoint: `/api/jobs`

### Endpoint Structure
```
GET https://synaxusinc.com/api/jobs
```

### Response Format
```json
{
  "success": true,
  "jobs": [
    {
      "id": "synaxus-001",
      "title": "Senior Software Engineer",
      "company": "Synaxus Inc.",
      "location": "San Francisco, CA",
      "industry": "Technology",
      "postedDate": "2024-01-15",
      "compensation": "$120,000 - $150,000 per year",
      "description": "We're looking for a Senior Software Engineer to join our growing team...",
      "url": "https://synaxusinc.com/careers/senior-software-engineer",
      "contactEmail": "careers@synaxusinc.com",
      "contactPhone": "(555) 123-4567",
      "requirements": [
        "5+ years of software development experience",
        "Proficiency in React and Node.js",
        "Experience with cloud platforms (AWS, Azure, GCP)"
      ],
      "benefits": [
        "Competitive salary and equity",
        "Health, dental, and vision insurance",
        "Flexible work arrangements",
        "Professional development budget"
      ]
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00Z",
  "totalJobs": 1
}
```

## Implementation Examples

### PHP (WordPress)
```php
<?php
// Add this to your WordPress theme's functions.php or create a custom plugin

function synaxus_api_jobs_endpoint() {
    register_rest_route('synaxus/v1', '/jobs', array(
        'methods' => 'GET',
        'callback' => 'get_synaxus_jobs',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'synaxus_api_jobs_endpoint');

function get_synaxus_jobs($request) {
    // Get jobs from your database, CMS, or other source
    $jobs = get_posts(array(
        'post_type' => 'job_listing',
        'post_status' => 'publish',
        'numberposts' => 50
    ));
    
    $formatted_jobs = array();
    foreach ($jobs as $job) {
        $formatted_jobs[] = array(
            'id' => 'synaxus-' . $job->ID,
            'title' => $job->post_title,
            'company' => 'Synaxus Inc.',
            'location' => get_post_meta($job->ID, 'location', true),
            'industry' => get_post_meta($job->ID, 'industry', true),
            'postedDate' => $job->post_date,
            'compensation' => get_post_meta($job->ID, 'compensation', true),
            'description' => $job->post_content,
            'url' => get_permalink($job->ID),
            'contactEmail' => get_post_meta($job->ID, 'contact_email', true),
            'contactPhone' => get_post_meta($job->ID, 'contact_phone', true)
        );
    }
    
    return array(
        'success' => true,
        'jobs' => $formatted_jobs,
        'lastUpdated' => current_time('c'),
        'totalJobs' => count($formatted_jobs)
    );
}
?>
```

### Node.js/Express
```javascript
const express = require('express');
const app = express();

// Mock job data - replace with your actual data source
const jobs = [
  {
    id: 'synaxus-001',
    title: 'Senior Software Engineer',
    company: 'Synaxus Inc.',
    location: 'San Francisco, CA',
    industry: 'Technology',
    postedDate: '2024-01-15',
    compensation: '$120,000 - $150,000 per year',
    description: 'We are seeking a Senior Software Engineer...',
    url: 'https://synaxusinc.com/careers/senior-software-engineer',
    contactEmail: 'careers@synaxusinc.com',
    contactPhone: '(555) 123-4567'
  }
  // Add more jobs as needed
];

app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    jobs: jobs,
    lastUpdated: new Date().toISOString(),
    totalJobs: jobs.length
  });
});

app.listen(3000, () => {
  console.log('Synaxus API server running on port 3000');
});
```

### Static JSON File
If you prefer a simple approach, create a static JSON file:

```json
// Create file: https://synaxusinc.com/api/jobs.json
{
  "success": true,
  "jobs": [
    {
      "id": "synaxus-001",
      "title": "Senior Software Engineer",
      "company": "Synaxus Inc.",
      "location": "San Francisco, CA",
      "industry": "Technology",
      "postedDate": "2024-01-15",
      "compensation": "$120,000 - $150,000 per year",
      "description": "We are seeking a Senior Software Engineer to join our team...",
      "url": "https://synaxusinc.com/careers/senior-software-engineer",
      "contactEmail": "careers@synaxusinc.com",
      "contactPhone": "(555) 123-4567"
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00Z",
  "totalJobs": 1
}
```

## CORS Configuration

Make sure to enable CORS for your Applicants.IO domain:

### PHP
```php
header('Access-Control-Allow-Origin: https://applicants.io');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### Node.js
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://applicants.io');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting to prevent abuse
2. **Authentication**: Consider adding API keys for additional security
3. **Input Validation**: Validate all incoming requests
4. **Error Handling**: Provide meaningful error messages
5. **Logging**: Log API usage for monitoring

## Testing

Test your API endpoint:
```bash
curl https://synaxusinc.com/api/jobs
```

Or visit it directly in your browser to see the JSON response.

## Next Steps

1. **Implement the API** on your synaxusinc.com site
2. **Test the endpoint** to ensure it returns proper JSON
3. **Enable the integration** in your Applicants.IO admin panel
4. **Monitor the integration** for any issues
5. **Update job data** regularly to keep listings fresh
