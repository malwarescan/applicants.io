# ChatGPT Integration - Quick Reference Card

## API Endpoints

### Base URL
```
https://www.applicants.io/api
```

## 1. Search Jobs

**GET** `/api/jobs-chatgpt`

**Query Parameters**:
- `q` or `search` - Search keywords
- `location` or `city` - Filter by city (e.g., "Fort Myers", "Naples")
- `industry` or `category` - Filter by industry
- `employment_type` or `type` - Filter by type (`full-time`, `part-time`, `contract`)
- `limit` - Results limit (default: 50, max: 100)
- `offset` - Pagination offset

**Example**:
```
GET /api/jobs-chatgpt?q=marketing&location=Fort Myers&limit=10
```

**Response**: JSON array of jobs with all details

## 2. Submit Application

**POST** `/api/apply-job`

**Required Fields**:
- `job_id` - Job identifier
- `applicant_name` - Full name
- `applicant_email` - Valid email

**Optional Fields**:
- `applicant_phone` - Phone number
- `resume_url` - Resume URL
- `cover_letter` - Cover letter text
- `additional_info` - Additional information

**Example**:
```json
{
  "job_id": "brand-ambassador-fort-myers-fl",
  "applicant_name": "John Doe",
  "applicant_email": "john@example.com",
  "applicant_phone": "+1-555-123-4567"
}
```

## ChatGPT Function Schemas

### Function: search_jobs
```json
{
  "name": "search_jobs",
  "description": "Search for job listings on Applicants.io",
  "parameters": {
    "type": "object",
    "properties": {
      "search": {"type": "string"},
      "location": {"type": "string"},
      "industry": {"type": "string"},
      "employment_type": {"type": "string", "enum": ["full-time", "part-time", "contract"]},
      "limit": {"type": "integer", "default": 10}
    }
  }
}
```

### Function: submit_application
```json
{
  "name": "submit_application",
  "description": "Submit a job application",
  "parameters": {
    "type": "object",
    "properties": {
      "job_id": {"type": "string"},
      "applicant_name": {"type": "string"},
      "applicant_email": {"type": "string"},
      "applicant_phone": {"type": "string"},
      "resume_url": {"type": "string"},
      "cover_letter": {"type": "string"}
    },
    "required": ["job_id", "applicant_name", "applicant_email"]
  }
}
```

## Real-World User Scenarios

### User: "I'm looking for a job in Fort Myers"
→ Call `search_jobs(location="Fort Myers", limit=10)`
→ Show variety, ask what type of work they're interested in

### User: "I need a part-time job"
→ Call `search_jobs(employment_type="part-time", limit=10)`
→ Ask which city, or show options across SWFL

### User: "Are there any sales jobs?"
→ Call `search_jobs(search="sales", limit=10)`
→ Ask about location preference

### User: "Tell me about the Brand Ambassador job in Naples"
→ Find job from previous results or search
→ Show full details, then ask if they want to apply

### User: "I want to apply for that job"
→ **First, offer SMS application** (fastest and preferred):
  - Show: "📱 Text HR to Apply: [application_sms link]"
  - Explain: "Just tap the link - the message is already filled in!"
→ If user prefers other methods:
  - Online: [application_url_external]
  - Email: [application_email]
  - Chat submission: Collect info and call `submit_application()`

## Response Format

Jobs include:
- `id` - Internal ID
- `job_id` - URL slug identifier
- `title` - Job title
- `company` - Company name
- `location` - Location string
- `employment_type` - Array of types
- `salary` - Formatted salary string
- `description` - Job description
- `application_url` - Direct application URL
- `application_email` - Employer email
- `application_phone` - Employer phone
- `application_sms` - **SMS link with prefilled message** (use this!)
- `application_sms_phone` - SMS phone number (+13147746099)
- `application_sms_message` - Prefilled message text

## Error Handling

- **400**: Missing required fields
- **404**: Job not found
- **405**: Method not allowed

Always check `success` field in responses.

