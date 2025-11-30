# Connect New GPT to Applicants.io API

## Quick Setup (3 Steps)

### Step 1: Get the API Endpoint

**API URL:**
```
https://www.applicants.io/api/jobs-chatgpt
```

**OpenAPI Schema URL:**
```
https://www.applicants.io/gpt-action-openapi-schema.json
```

---

### Step 2: Add Action to ChatGPT GPT

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
   - Click **Import**

4. **Verify Configuration**
   - **Server URL**: `https://www.applicants.io/api`
   - **Path**: `/jobs-chatgpt`
   - **Method**: `GET`
   - **Authentication**: None (leave blank)

---

### Step 3: Add GPT Instructions

Copy this into your GPT's **Instructions** field:

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

## API Endpoint Details

### Base URL
```
https://www.applicants.io/api/jobs-chatgpt
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search keywords | `marketing` |
| `location` | string | City filter | `Fort Myers` |
| `industry` | string | Industry filter | `Retail & Field Marketing` |
| `employment_type` | string | Employment type | `full-time`, `part-time`, `contract` |
| `limit` | integer | Max results (default: 50, max: 100) | `10` |
| `offset` | integer | Pagination offset | `0` |

### Example Requests

```
GET https://www.applicants.io/api/jobs-chatgpt?location=Fort Myers&limit=5
GET https://www.applicants.io/api/jobs-chatgpt?search=brand ambassador&location=Naples
GET https://www.applicants.io/api/jobs-chatgpt?employment_type=full-time&limit=10
```

---

## Response Format

Each job includes:

- `id` - Job ID
- `job_id` - Job slug for URLs
- `title` - Job title
- `company` - Company name
- `location` - Job location
- `salary` - Formatted salary range
- `description` - Job description
- `application_sms` - **SMS link (USE THIS for "Text HR to Apply")**
- `application_sms_phone` - Phone number (+13147746099)
- `application_sms_message` - Prefilled message
- `application_url` - Direct job page URL
- `application_email` - Email address
- `application_phone` - Phone number

---

## Test It

Ask your GPT:
```
Find marketing jobs in Fort Myers
```

Expected: GPT calls `get_jobs` action and displays real jobs with SMS links.

---

## Troubleshooting

**GPT not calling action?**
- Check action is enabled
- Verify action name: `get_jobs`
- Test action manually in GPT Builder

**No jobs returned?**
- Try broader search (remove location filter)
- Check: `https://www.applicants.io/api/jobs-chatgpt?limit=5`

**SMS links not working?**
- Format: `sms:+13147746099?body=...`
- Test on mobile device

---

## Files Reference

- **OpenAPI Schema**: `gpt-action-openapi-schema.json`
- **Quick Start**: `CHATGPT_QUICK_START.md`
- **Full Guide**: `CHATGPT_SETUP_GUIDE.md`
- **API Summary**: `API_CONNECTION_SUMMARY.md`

---

**That's it! Your new GPT is now connected to Applicants.io API.** 🚀

