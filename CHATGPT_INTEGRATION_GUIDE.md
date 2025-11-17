# ChatGPT Integration Guide for Applicants.io

## Overview
This guide provides instructions for integrating Applicants.io job listings with ChatGPT, allowing users to search for jobs and apply directly through ChatGPT conversations.

## API Endpoints

### Base URL
```
https://www.applicants.io/api
```

### 1. Get Job Listings (ChatGPT-Optimized)

**Endpoint**: `GET /api/jobs-chatgpt`

**Description**: Returns job listings in a format optimized for ChatGPT consumption.

**Query Parameters**:
- `q` or `search` (string, optional): Search query to filter jobs by title, company, location, or description
- `location` or `city` (string, optional): Filter by location/city
- `industry` or `category` (string, optional): Filter by industry/category
- `employment_type` or `type` (string, optional): Filter by employment type (`full-time`, `part-time`, `contract`, etc.)
- `limit` (integer, optional): Number of results to return (default: 50, max: 100)
- `offset` (integer, optional): Pagination offset (default: 0)

**Example Requests**:
```
GET /api/jobs-chatgpt?q=marketing&location=Fort Myers&limit=10
GET /api/jobs-chatgpt?employment_type=full-time&industry=Retail
GET /api/jobs-chatgpt?search=brand ambassador&location=Naples
```

**Response Format**:
```json
{
  "success": true,
  "jobs": [
    {
      "id": "SWFL-00001",
      "job_id": "brand-ambassador-fort-myers-fl",
      "title": "Brand Ambassador",
      "company": "Synaxus Inc",
      "location": "Fort Myers, FL",
      "employment_type": ["Part-time", "Full-time"],
      "job_location_type": "ON_SITE",
      "salary": "$16.00 - $20.00 per hour",
      "salary_details": {
        "currency": "USD",
        "minValue": 16,
        "maxValue": 20,
        "unitText": "HOUR"
      },
      "description": "Represent brands at retail locations...",
      "description_html": "<p>Represent brands...</p>",
      "qualifications": "Excellent communication skills...",
      "responsibilities": "Engage customers at retail locations...",
      "skills": "Customer Service, Sales, Marketing",
      "benefits": "Competitive hourly pay, Flexible scheduling...",
      "industry": "Retail & Field Marketing",
      "category": "Retail & Field Marketing",
      "date_posted": "2025-01-15",
      "valid_through": "2025-03-16T23:59:59-05:00",
      "application_url": "https://www.applicants.io/jobs/brand-ambassador-fort-myers-fl/",
      "application_email": "careers@synaxusinc.com",
      "application_phone": "+1-941-564-9169",
      "application_url_external": "https://www.synaxusinc.com/apply.php",
      "application_sms": "sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Brand%20Ambassador%20position%20in%20Fort%20Myers%2C%20FL.",
      "application_sms_phone": "+13147746099",
      "application_sms_message": "Hi, I'm interested in applying for the Brand Ambassador position in Fort Myers, FL.",
      "direct_apply": true,
      "company_url": "https://www.synaxusinc.com/",
      "company_logo": "https://www.synaxusinc.com/synaxus-logo.png"
    }
  ],
  "pagination": {
    "total": 213,
    "limit": 50,
    "offset": 0,
    "has_more": true
  },
  "filters_applied": {
    "search": "marketing",
    "location": "Fort Myers",
    "industry": null,
    "employment_type": null
  }
}
```

### 2. Submit Job Application

**Endpoint**: `POST /api/apply-job`

**Description**: Submits a job application through the API.

**Request Body**:
```json
{
  "job_id": "brand-ambassador-fort-myers-fl",
  "applicant_name": "John Doe",
  "applicant_email": "john.doe@example.com",
  "applicant_phone": "+1-555-123-4567",
  "resume_url": "https://example.com/resume.pdf",
  "cover_letter": "I am interested in this position...",
  "additional_info": "Available to start immediately",
  "source": "chatgpt"
}
```

**Required Fields**:
- `job_id` (string): Job identifier (can be job ID or slug)
- `applicant_name` (string): Full name of applicant
- `applicant_email` (string): Valid email address

**Optional Fields**:
- `applicant_phone` (string): Phone number
- `resume_url` (string): URL to resume/CV
- `cover_letter` (string): Cover letter text
- `additional_info` (string): Additional information
- `source` (string): Source of application (default: "chatgpt")

**Response Format**:
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "application_id": "APP-67890abcdef",
  "application": {
    "job_title": "Brand Ambassador",
    "applicant_name": "John Doe",
    "submitted_at": "2025-01-15 14:30:00"
  },
  "next_steps": {
    "message": "Your application has been received. The employer will contact you directly.",
    "employer_email": "careers@synaxusinc.com",
    "employer_phone": "+1-941-564-9169",
    "application_url": "https://www.synaxusinc.com/apply.php"
  }
}
```

## ChatGPT Function Calling Schema

### Function 1: Search Jobs

```json
{
  "name": "search_jobs",
  "description": "Search for job listings on Applicants.io. Can filter by location, industry, employment type, and keywords.",
  "parameters": {
    "type": "object",
    "properties": {
      "search": {
        "type": "string",
        "description": "Search keywords to find jobs by title, company, or description"
      },
      "location": {
        "type": "string",
        "description": "City or location to filter jobs (e.g., 'Fort Myers', 'Naples', 'Cape Coral')"
      },
      "industry": {
        "type": "string",
        "description": "Industry or category to filter jobs (e.g., 'Retail & Field Marketing', 'Management & Leadership')"
      },
      "employment_type": {
        "type": "string",
        "enum": ["full-time", "part-time", "contract", "temporary", "intern"],
        "description": "Employment type filter"
      },
      "limit": {
        "type": "integer",
        "description": "Maximum number of jobs to return (default: 10, max: 50)",
        "default": 10
      }
    }
  }
}
```

### Function 2: Get Job Details

```json
{
  "name": "get_job_details",
  "description": "Get detailed information about a specific job by its ID or title.",
  "parameters": {
    "type": "object",
    "properties": {
      "job_id": {
        "type": "string",
        "description": "Job ID or job slug identifier"
      }
    },
    "required": ["job_id"]
  }
}
```

### Function 3: Submit Application

```json
{
  "name": "submit_job_application",
  "description": "Submit a job application for a specific job posting. Requires applicant name and email.",
  "parameters": {
    "type": "object",
    "properties": {
      "job_id": {
        "type": "string",
        "description": "Job ID or job slug identifier"
      },
      "applicant_name": {
        "type": "string",
        "description": "Full name of the applicant"
      },
      "applicant_email": {
        "type": "string",
        "description": "Email address of the applicant"
      },
      "applicant_phone": {
        "type": "string",
        "description": "Phone number of the applicant (optional)"
      },
      "resume_url": {
        "type": "string",
        "description": "URL to applicant's resume or CV (optional)"
      },
      "cover_letter": {
        "type": "string",
        "description": "Cover letter text (optional)"
      },
      "additional_info": {
        "type": "string",
        "description": "Any additional information the applicant wants to include (optional)"
      }
    },
    "required": ["job_id", "applicant_name", "applicant_email"]
  }
}
```

## Implementation Instructions for GPT Team

### Step 1: Configure API Base URL

Set the base URL for all API calls:
```
BASE_URL = "https://www.applicants.io/api"
```

### Step 2: Implement Search Jobs Function

```python
def search_jobs(search=None, location=None, industry=None, employment_type=None, limit=10):
    """
    Search for jobs on Applicants.io
    
    Args:
        search: Search keywords
        location: City or location filter
        industry: Industry/category filter
        employment_type: Employment type (full-time, part-time, etc.)
        limit: Maximum results (default: 10)
    
    Returns:
        List of job listings
    """
    params = {}
    if search:
        params['q'] = search
    if location:
        params['location'] = location
    if industry:
        params['industry'] = industry
    if employment_type:
        params['employment_type'] = employment_type
    if limit:
        params['limit'] = min(limit, 50)  # Cap at 50
    
    response = requests.get(f"{BASE_URL}/jobs-chatgpt", params=params)
    response.raise_for_status()
    data = response.json()
    
    return data['jobs']
```

### Step 3: Implement Get Job Details Function

```python
def get_job_details(job_id):
    """
    Get detailed information about a specific job
    
    Args:
        job_id: Job ID or slug
    
    Returns:
        Job details dictionary
    """
    # Search for the specific job
    jobs = search_jobs(limit=100)  # Get all jobs to find the one
    
    for job in jobs:
        if job['id'] == job_id or job['job_id'] == job_id:
            return job
    
    # If not found, try direct API call with search
    response = requests.get(f"{BASE_URL}/jobs-chatgpt", params={'q': job_id, 'limit': 1})
    response.raise_for_status()
    data = response.json()
    
    if data['jobs']:
        return data['jobs'][0]
    
    raise ValueError(f"Job not found: {job_id}")
```

### Step 4: Implement Submit Application Function

```python
def submit_application(job_id, applicant_name, applicant_email, 
                      applicant_phone=None, resume_url=None, 
                      cover_letter=None, additional_info=None):
    """
    Submit a job application
    
    Args:
        job_id: Job ID or slug
        applicant_name: Full name
        applicant_email: Email address
        applicant_phone: Phone number (optional)
        resume_url: URL to resume (optional)
        cover_letter: Cover letter text (optional)
        additional_info: Additional information (optional)
    
    Returns:
        Application submission result
    """
    payload = {
        'job_id': job_id,
        'applicant_name': applicant_name,
        'applicant_email': applicant_email,
        'source': 'chatgpt'
    }
    
    if applicant_phone:
        payload['applicant_phone'] = applicant_phone
    if resume_url:
        payload['resume_url'] = resume_url
    if cover_letter:
        payload['cover_letter'] = cover_letter
    if additional_info:
        payload['additional_info'] = additional_info
    
    response = requests.post(f"{BASE_URL}/apply-job", json=payload)
    response.raise_for_status()
    
    return response.json()
```

### Step 5: ChatGPT Assistant Instructions

Provide these instructions to your ChatGPT assistant:

```
You are a friendly, helpful job search assistant for Applicants.io, specializing in jobs throughout Southwest Florida. Your goal is to help people find and apply for jobs in a natural, conversational way.

**Your Personality**:
- Friendly and approachable
- Helpful and patient
- Clear and concise
- Focused on helping users find the right job fit

**How to Help Users**:

1. **Understanding What They Want**:
   - Listen for location mentions: Fort Myers, Naples, Cape Coral, Bonita Springs, Estero, Lehigh Acres, Punta Gorda, Port Charlotte, Sanibel, Marco Island, North Fort Myers, Labelle, Immokalee, or "Southwest Florida"
   - Listen for job types: part-time, full-time, retail, sales, marketing, management, etc.
   - Listen for specific roles: brand ambassador, sales associate, manager, etc.
   - If location is unclear, ask: "Which city in Southwest Florida are you looking in?"

2. **Searching for Jobs**:
   - Use search_jobs function with natural parameters
   - Always show 5-10 results initially (don't overwhelm)
   - Format results clearly: Job Title | Company | Location | Pay | Type
   - Highlight key info: salary, employment type, location
   - If no results, suggest broadening search (different city, different keywords)

3. **Showing Job Details**:
   - When user asks about a specific job, show:
     * What the job involves (description)
     * What they need to qualify (qualifications)
     * What they'll be doing (responsibilities)
     * How much it pays (salary)
     * Benefits offered
     * How to apply
   - Be enthusiastic but honest about requirements

4. **Helping with Applications**:
   - **Text to Apply** (Preferred): Always offer the SMS application option first
     * Use the `application_sms` link from job data
     * Message is prefilled with job title and location
     * User just needs to click/tap to send text
     * Say: "You can text HR directly to apply! Just tap this link: [SMS link]"
   - **Online Application**: If user prefers online, use `application_url_external`
   - **Email Application**: Use `application_email` for email option
   - **API Submission**: When user wants to apply through chat:
     * Ask for: Full name, Email address, Phone number (optional)
     * Confirm details before submitting
     * After submission, provide confirmation and next steps

**Common User Scenarios**:

- "I need a job" → Ask what type and where
- "Jobs in [city]" → Search that city, show variety
- "Part-time work" → Filter to part-time, ask location
- "What's available?" → Show recent jobs, ask what interests them
- "Tell me about [job]" → Show full details
- "I want to apply" → Collect info and submit

**Important Guidelines**:
- Never make up job information - always use real data from the API
- If a job doesn't exist, say so and suggest alternatives
- Always confirm application details before submitting
- Be encouraging but realistic about job requirements
- Focus on Southwest Florida - if they ask about other areas, politely redirect
- When showing multiple jobs, help them narrow down by asking follow-up questions
- Make the process feel personal and helpful, not robotic
```

## Real-World User Conversation Examples

### Example 1: Location-Based Search

**User**: "I'm looking for a job in Fort Myers"

**Assistant Response**:
1. Calls `search_jobs(location="Fort Myers", limit=10)`
2. Shows results like:
   - "I found several job openings in Fort Myers. Here are some options:"
   - Lists 5-10 jobs with titles, companies, and brief info
   - "Would you like to see more details about any of these, or are you looking for something specific?"

**User**: "What about retail jobs?"

**Assistant Response**:
1. Calls `search_jobs(location="Fort Myers", industry="Retail", limit=10)`
2. Filters to retail-specific jobs
3. Shows relevant positions

**User**: "Tell me about the Brand Ambassador job"

**Assistant Response**:
1. Finds the Brand Ambassador job from previous results
2. Shows full details:
   - What the job involves
   - Pay rate ($16-20/hour)
   - Requirements
   - Benefits
   - How to apply
3. Asks: "Would you like to apply for this position?"

**User**: "Yes, how do I apply?"

**Assistant Response**:
1. Shows application options:
   - "You have a few ways to apply:"
   - "📱 **Text HR** (Fastest!): [SMS link with prefilled message]"
   - "🌐 **Apply Online**: [application_url_external]"
   - "📧 **Email**: [application_email]"
   - "Or I can submit your application through this chat - just give me your name and email."
2. If user chooses SMS: "Perfect! Just tap the link above to send a text to HR. The message is already filled in with the job details."
3. If user wants chat submission: Collects info and calls `submit_application()`

---

### Example 2: Job Type Search

**User**: "I need a part-time job"

**Assistant Response**:
1. Calls `search_jobs(employment_type="part-time", limit=10)`
2. Shows part-time opportunities across SWFL
3. "I found several part-time positions available. Are you looking in a specific city, or open to anywhere in Southwest Florida?"

**User**: "Naples would be good"

**Assistant Response**:
1. Calls `search_jobs(location="Naples", employment_type="part-time", limit=10)`
2. Shows part-time jobs in Naples
3. "Here are part-time opportunities in Naples. Which one interests you?"

---

### Example 3: Specific Role Search

**User**: "Are there any sales jobs available?"

**Assistant Response**:
1. Calls `search_jobs(search="sales", limit=10)`
2. Shows sales-related positions
3. "I found several sales positions. Would you like to see jobs in a specific area, or are you open to anywhere in Southwest Florida?"

**User**: "Cape Coral"

**Assistant Response**:
1. Calls `search_jobs(search="sales", location="Cape Coral", limit=10)`
2. Shows sales jobs in Cape Coral
3. Provides details and application options

---

### Example 4: General Southwest Florida Search

**User**: "What jobs are available in Southwest Florida?"

**Assistant Response**:
1. Calls `search_jobs(limit=20)` (shows variety)
2. "I found many opportunities across Southwest Florida! We have jobs in Fort Myers, Naples, Cape Coral, and other areas. What type of work are you interested in?"

**User**: "Something in marketing"

**Assistant Response**:
1. Calls `search_jobs(industry="Marketing", limit=10)`
2. Shows marketing jobs across SWFL cities
3. "Here are marketing positions available. Which city works best for you?"

---

### Example 5: Salary-Focused Search

**User**: "Show me jobs that pay at least $18 an hour"

**Assistant Response**:
1. Calls `search_jobs(limit=50)` to get all jobs
2. Filters results client-side to show only jobs with salary >= $18/hour
3. "I found several positions paying $18/hour or more. Here are the best options:"
4. Lists jobs with salary information prominently displayed

---

### Example 6: Application Flow

**User**: "I want to apply for the Retail Sales Associate job in Bonita Springs"

**Assistant Response**:
1. Finds the specific job from context or searches
2. Shows job details
3. "Here's how you can apply for the Retail Sales Associate position in Bonita Springs:"
   - "📱 **Text HR** (Recommended - fastest way!): [SMS link]"
   - "The text message is already filled in with your job details - just tap to send!"
   - "🌐 **Apply Online**: [application_url_external]"
   - "📧 **Email Resume**: [application_email]"
   - "Or I can help you apply through this chat if you prefer."
4. If user chooses SMS: "Great choice! Just tap the link above to text HR directly. They'll get back to you soon!"
5. If user wants chat submission: Collects info, calls `submit_application()`, confirms submission

---

## Natural Language Patterns to Handle

### Location Variations
Users might say:
- "Fort Myers" → `location="Fort Myers"`
- "I'm in Naples" → `location="Naples"`
- "Cape Coral area" → `location="Cape Coral"`
- "Southwest Florida" → Search all SWFL cities
- "Near me" → Ask for their city or use location if available

### Job Type Variations
Users might say:
- "Part-time" → `employment_type="part-time"`
- "Full-time work" → `employment_type="full-time"`
- "I need flexible hours" → Show part-time and flexible positions
- "Something temporary" → `employment_type="temporary"`

### Role Variations
Users might say:
- "Sales jobs" → `search="sales"`
- "Marketing positions" → `industry="Marketing"`
- "Retail work" → `industry="Retail"`
- "Management roles" → `industry="Management"`
- "I want to be a brand ambassador" → `search="brand ambassador"`

### Application Intent
Users might say:
- "I want to apply" → Start application process
- "How do I apply?" → Show application steps
- "Sign me up" → Collect info and submit
- "I'm interested" → Ask if they want to apply

## Error Handling

### Common Error Responses

**400 Bad Request**:
```json
{
  "error": "Missing required field: applicant_email"
}
```

**404 Not Found**:
```json
{
  "error": "Job not found"
}
```

**405 Method Not Allowed**:
```json
{
  "error": "Method not allowed"
}
```

Always handle these errors gracefully and provide helpful messages to users.

## Testing

### Test Endpoints

1. **Search Test**:
   ```bash
   curl "https://www.applicants.io/api/jobs-chatgpt?location=Fort%20Myers&limit=5"
   ```

2. **Application Test**:
   ```bash
   curl -X POST "https://www.applicants.io/api/apply-job" \
     -H "Content-Type: application/json" \
     -d '{
       "job_id": "brand-ambassador-fort-myers-fl",
       "applicant_name": "Test User",
       "applicant_email": "test@example.com"
     }'
   ```

## Security Considerations

1. **Rate Limiting**: Consider implementing rate limiting on API endpoints
2. **Input Validation**: All inputs are validated server-side
3. **CORS**: Currently allows all origins - restrict in production if needed
4. **Email Validation**: Email addresses are validated before processing
5. **Spam Prevention**: Consider adding CAPTCHA or other spam prevention for applications

## Support

For questions or issues with the API:
- Check API documentation: `https://www.applicants.io/api/jobs-chatgpt`
- Review error responses for specific issues
- Contact: [Your support email]

## Updates

This API is actively maintained. Check for updates regularly to ensure compatibility with new features.

