# ChatGPT Quick Start - Connect in 3 Steps

## ✅ Step 1: Get API Endpoint

**API URL:**
```
https://www.applicants.io/api/jobs-chatgpt
```

**No API key needed** - it's public!

---

## ✅ Step 2: Add to ChatGPT GPT

1. Open ChatGPT GPT Builder
2. Go to **Actions** → **Create new action**
3. Click **"Import from URL"**
4. Paste: `https://www.applicants.io/gpt-action-openapi-schema.json`
5. Click **Import**

Done! The action is now configured.

---

## ✅ Step 3: Add GPT Instructions

Copy this into your GPT's **Instructions**:

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

## 🧪 Test It

Ask your GPT: **"Show me marketing jobs in Fort Myers"**

Expected: Real jobs with SMS application links appear.

---

## 📋 What You Get

Each job includes:
- ✅ Job title, company, location
- ✅ Salary range
- ✅ Full description
- ✅ **SMS application link** (`application_sms`) - USE THIS!
- ✅ Direct job page URL

---

## 🔗 Files

- **Setup Guide**: `CHATGPT_SETUP_GUIDE.md` (detailed)
- **OpenAPI Schema**: `gpt-action-openapi-schema.json`
- **Full Docs**: `GPT_ACTION_INTEGRATION_GUIDE.md`

---

## 🆘 Troubleshooting

**GPT not calling action?**
- Check action is enabled
- Verify action name: `get_jobs`

**No jobs returned?**
- Try broader search (remove location filter)
- Check: `https://www.applicants.io/api/jobs-chatgpt?limit=5`

**SMS links not working?**
- Format: `sms:+13147746099?body=...`
- Test on mobile device

---

That's it! Your ChatGPT GPT is now connected to live job data from Applicants.io 🎉

