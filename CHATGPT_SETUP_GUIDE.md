# ChatGPT Connection Setup Guide

## 🚀 Quick Start: Connect ChatGPT to Applicants.io API

### Step 1: Get Your API Endpoint

**API Base URL:**
```
https://www.applicants.io/api/jobs-chatgpt
```

**Full Endpoint:**
```
https://www.applicants.io/api/jobs-chatgpt
```

**No API Key Required** (currently public endpoint)

---

## Step 2: Add Action to ChatGPT GPT

### Option A: Import OpenAPI Schema (Recommended)

1. **Open ChatGPT GPT Builder**
   - Go to [chat.openai.com/gpts](https://chat.openai.com/gpts)
   - Create new GPT or edit existing one

2. **Add Action**
   - Click **"Actions"** in the left sidebar
   - Click **"Create new action"**
   - Click **"Import from URL"**

3. **Import Schema**
   - Paste this URL:
     ```
     https://www.applicants.io/gpt-action-openapi-schema.json
     ```
   - Or upload the file: `gpt-action-openapi-schema.json` from this repo

4. **Verify Configuration**
   - **Server URL**: `https://www.applicants.io/api`
   - **Path**: `/jobs-chatgpt`
   - **Method**: `GET`
   - **Authentication**: None (leave blank)

### Option B: Manual Configuration

1. **Action Name**: `get_jobs`

2. **Description**: 
   ```
   Fetch live job listings from Applicants.io for Southwest Florida. All jobs include SMS application links for instant application.
   ```

3. **Method**: `GET`

4. **URL**: `https://www.applicants.io/api/jobs-chatgpt`

5. **Parameters** (add these in GPT Builder):
   - `search` (string, optional) - Search keywords
   - `location` (string, optional) - City filter (e.g., "Fort Myers", "Naples")
   - `industry` (string, optional) - Industry filter
   - `employment_type` (string, optional) - "full-time", "part-time", "contract", "temporary", "intern"
   - `limit` (integer, optional) - Max results (default: 50, max: 100)
   - `offset` (integer, optional) - Pagination offset

---

## Step 3: Test the Connection

### Test Query Examples:

1. **Search by location:**
   ```
   GET https://www.applicants.io/api/jobs-chatgpt?location=Fort Myers&limit=5
   ```

2. **Search by job type:**
   ```
   GET https://www.applicants.io/api/jobs-chatgpt?search=brand ambassador&location=Naples
   ```

3. **Filter by employment type:**
   ```
   GET https://www.applicants.io/api/jobs-chatgpt?employment_type=full-time&limit=10
   ```

### Expected Response:
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
      "employment_type": ["Full-time", "Part-time"],
      "salary": "$16.00 - $20.00 per hour",
      "description": "Represent brands at retail locations...",
      "application_sms": "sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Brand%20Ambassador%20position%20in%20Fort%20Myers%2C%20FL.",
      "application_sms_phone": "+13147746099",
      "application_sms_message": "Hi, I'm interested in applying for the Brand Ambassador position in Fort Myers, FL.",
      "application_url": "https://www.applicants.io/jobs/brand-ambassador-fort-myers-fl/"
    }
  ],
  "pagination": {
    "total": 208,
    "limit": 5,
    "offset": 0,
    "has_more": true
  }
}
```

---

## Step 4: Configure GPT Instructions

Add these instructions to your GPT's **Instructions** field:

```
You are a job search assistant for Southwest Florida jobs on Applicants.io.

CRITICAL RULES:
1. ALWAYS use the get_jobs action to fetch real jobs - NEVER make up or generate fake jobs
2. When displaying jobs, ALWAYS include the SMS application link (application_sms field)
3. Format SMS links as clickable buttons: "📱 Text HR to Apply"
4. If no jobs found, say "No jobs found matching your criteria" - don't invent jobs
5. Prioritize SMS application method - it's the fastest way to apply

When users ask about jobs:
- Use get_jobs action with appropriate filters (location, search, employment_type)
- Display job title, company, location, salary, and description
- Always show the SMS application link prominently
- Link to full job page using application_url

Example response format:
"Found 5 jobs in Fort Myers:

1. **Brand Ambassador** at Synaxus Inc
   - Location: Fort Myers, FL
   - Salary: $16-20/hour
   - Type: Full-time, Part-time
   - [📱 Text HR to Apply](sms:+13147746099?body=...)
   - [View Full Details](https://www.applicants.io/jobs/...)"
```

---

## Step 5: Verify It's Working

### Test in ChatGPT:

1. **Ask**: "Show me marketing jobs in Fort Myers"
2. **Expected**: GPT calls `get_jobs` action and displays real jobs with SMS links
3. **Verify**: Jobs are real (not generated), SMS links work, links go to actual job pages

### Common Issues:

**Issue**: GPT not calling the action
- **Fix**: Check action is enabled, verify action name is `get_jobs`

**Issue**: No jobs returned
- **Fix**: Try broader search (remove location filter), check API endpoint is accessible

**Issue**: SMS links not working
- **Fix**: Verify link format includes `sms:` protocol and proper URL encoding

---

## API Response Fields Explained

| Field | Description | Usage |
|-------|-------------|-------|
| `application_sms` | Full SMS link with prefilled message | **Use this for "Text HR to Apply" button** |
| `application_sms_phone` | Phone number (+13147746099) | Display if needed |
| `application_sms_message` | Prefilled message text | Show user what will be sent |
| `application_url` | Direct job page URL | Link to full job details |
| `title` | Job title | Display prominently |
| `location` | Job location | Show with job |
| `salary` | Formatted salary range | Display compensation |
| `employment_type` | Array of types | Show work schedule options |

---

## Next Steps

1. ✅ **Test the API** - Verify endpoint returns jobs
2. ✅ **Add Action to GPT** - Import schema or configure manually
3. ✅ **Set GPT Instructions** - Add the instructions above
4. ✅ **Test in ChatGPT** - Try various job searches
5. ✅ **Monitor Usage** - Check API logs for requests

---

## Support

- **API Endpoint**: `https://www.applicants.io/api/jobs-chatgpt`
- **Documentation**: See `GPT_ACTION_INTEGRATION_GUIDE.md` for detailed docs
- **OpenAPI Schema**: `gpt-action-openapi-schema.json`

---

## Optional: Add API Key Authentication

If you want to add authentication later:

1. **Generate API Key** - Create a secure random key
2. **Update API** - Add key validation in `php-src/api/jobs-chatgpt.php`
3. **Configure GPT** - Add Bearer Token authentication in GPT Builder
4. **Update Schema** - Add security scheme to OpenAPI schema

See `GPT_ACTION_INTEGRATION_GUIDE.md` section 8 for implementation details.

