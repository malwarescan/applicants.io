# ✅ ChatGPT API Connection - READY TO USE

## 🎯 What You Need

**API Endpoint:**
```
https://www.applicants.io/api/jobs-chatgpt
```

**OpenAPI Schema URL (for ChatGPT import):**
```
https://www.applicants.io/gpt-action-openapi-schema.json
```

**No API Key Required** - Public endpoint ✅

---

## 🚀 Connect ChatGPT in 3 Steps

### Step 1: Open ChatGPT GPT Builder
- Go to [chat.openai.com/gpts](https://chat.openai.com/gpts)
- Create new GPT or edit existing one

### Step 2: Add Action
- Click **"Actions"** → **"Create new action"**
- Click **"Import from URL"**
- Paste: `https://www.applicants.io/gpt-action-openapi-schema.json`
- Click **Import**

### Step 3: Add Instructions
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

**Done!** Your ChatGPT GPT is now connected to live job data.

---

## 📋 API Response Fields

Each job includes these fields:

| Field | Description | For ChatGPT |
|-------|-------------|-------------|
| `application_sms` | **Full SMS link with prefilled message** | **USE THIS for "Text HR to Apply" button** |
| `application_sms_phone` | Phone number (+13147746099) | Display if needed |
| `application_sms_message` | Prefilled message text | Show user what will be sent |
| `application_url` | Direct job page URL | Link to full job details |
| `title` | Job title | Display prominently |
| `company` | Company name | Show with job |
| `location` | Job location | Show with job |
| `salary` | Formatted salary range | Display compensation |
| `employment_type` | Array of types | Show work schedule options |
| `description` | Job description | Show full details |

---

## 🧪 Test It

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

## 📚 Documentation Files

- **Quick Start** (3 steps): `CHATGPT_QUICK_START.md`
- **Detailed Setup**: `CHATGPT_SETUP_GUIDE.md`
- **Full Integration Guide**: `GPT_ACTION_INTEGRATION_GUIDE.md`
- **API Summary**: `API_CONNECTION_SUMMARY.md`
- **OpenAPI Schema**: `gpt-action-openapi-schema.json`

---

## ✅ Checklist

- [x] API endpoint created and tested
- [x] OpenAPI schema created and accessible
- [x] No authentication required (public)
- [x] SMS application links included in all jobs
- [x] CORS headers configured
- [x] Documentation created
- [x] Tested and working ✅

---

## 🆘 Troubleshooting

**GPT not calling the action?**
- Verify action is enabled in GPT configuration
- Check action name matches: `get_jobs`
- Test action manually in GPT Builder

**No jobs returned?**
- Try broader search (remove location filter)
- Verify API endpoint is accessible
- Check API response for error messages

**SMS links not working?**
- Verify link format: `sms:+13147746099?body=...`
- Check URL encoding
- Test link on actual mobile device

---

## 🎉 Ready to Go!

Your ChatGPT GPT can now:
- ✅ Fetch real job listings from Applicants.io
- ✅ Display jobs with SMS application links
- ✅ Filter by location, industry, employment type
- ✅ Link to full job pages
- ✅ Never generate fake jobs (always uses API)

**Share this with your ChatGPT team and they can connect in minutes!** 🚀

