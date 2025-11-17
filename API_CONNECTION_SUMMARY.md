# ChatGPT API Connection - Summary

## ✅ What's Ready

1. **API Endpoint**: `https://www.applicants.io/api/jobs-chatgpt`
2. **OpenAPI Schema**: `https://www.applicants.io/gpt-action-openapi-schema.json`
3. **No Authentication Required** - Public endpoint

---

## 🚀 Quick Connection Steps

### For ChatGPT GPT Team:

1. **Open GPT Builder** → Actions → Create new action
2. **Import Schema**: `https://www.applicants.io/gpt-action-openapi-schema.json`
3. **Done!** The action is configured automatically

---

## 📋 API Details

### Endpoint
```
GET https://www.applicants.io/api/jobs-chatgpt
```

### Query Parameters
- `search` - Search keywords
- `location` - City filter (e.g., "Fort Myers", "Naples")
- `industry` - Industry filter
- `employment_type` - "full-time", "part-time", "contract", etc.
- `limit` - Max results (default: 50, max: 100)
- `offset` - Pagination offset

### Response Format
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
      "salary": "$16.00 - $20.00 per hour",
      "application_sms": "sms:+13147746099?body=...",
      "application_url": "https://www.applicants.io/jobs/..."
    }
  ],
  "pagination": { "total": 208, "limit": 50, "offset": 0 }
}
```

---

## 🔑 Key Fields for ChatGPT

| Field | Description | Usage |
|-------|-------------|-------|
| `application_sms` | **Full SMS link** | **USE THIS for "Text HR to Apply" button** |
| `application_sms_phone` | Phone number | Display if needed |
| `application_sms_message` | Prefilled message | Show user what will be sent |
| `application_url` | Job page URL | Link to full details |
| `title` | Job title | Display prominently |
| `location` | Job location | Show with job |
| `salary` | Salary range | Display compensation |

---

## 📝 GPT Instructions Template

```
You are a job search assistant for Southwest Florida jobs.

RULES:
- ALWAYS use get_jobs action - NEVER make up jobs
- Always show SMS application link: "📱 Text HR to Apply"
- If no jobs found, say "No jobs found" - don't invent jobs

When showing jobs, include:
- Job title, company, location, salary
- SMS link (application_sms field) as clickable button
- Link to full job page (application_url)
```

---

## 🧪 Test the API

### Test URLs:
```
https://www.applicants.io/api/jobs-chatgpt?limit=5
https://www.applicants.io/api/jobs-chatgpt?location=Fort Myers&limit=3
https://www.applicants.io/api/jobs-chatgpt?search=marketing&location=Naples
```

### Expected: JSON response with job listings

---

## 📚 Documentation Files

- **Quick Start**: `CHATGPT_QUICK_START.md` (3-step guide)
- **Setup Guide**: `CHATGPT_SETUP_GUIDE.md` (detailed instructions)
- **Full Integration**: `GPT_ACTION_INTEGRATION_GUIDE.md` (comprehensive)
- **OpenAPI Schema**: `gpt-action-openapi-schema.json`

---

## ✅ Checklist

- [x] API endpoint created (`/api/jobs-chatgpt`)
- [x] OpenAPI schema created (`gpt-action-openapi-schema.json`)
- [x] Schema accessible at public URL
- [x] API returns SMS application links
- [x] Documentation created
- [x] CORS headers configured
- [x] No authentication required (public)

---

## 🎯 Next Steps

1. **Share with GPT Team**: Send them `CHATGPT_QUICK_START.md`
2. **Test Connection**: Have them import schema and test
3. **Verify Results**: Ensure jobs display with SMS links
4. **Monitor Usage**: Check API logs for requests

---

**That's it! The API is ready for ChatGPT integration.** 🚀

