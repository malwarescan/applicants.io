# GPT Action Integration Guide - Job Applier GPT

## 🎯 Goal

Enable **Job Applier – by Applicants.io** GPT to fetch real job listings and SMS application links directly from Applicants.io API, ensuring ChatGPT displays only live job data (not generated examples).

---

## 1. Add GPT Action Definition

### Step 1: Open GPT Configuration
1. Go to ChatGPT GPT Builder
2. Navigate to **Actions** → **Add Action**
3. Click **Import from URL** or **Create manually**

### Step 2: Action Schema

**Action Name**: `get_jobs`

**Description**: Fetch live job listings from Applicants.io for Southwest Florida

**Method**: `GET`

**URL**: `https://www.applicants.io/api/jobs-chatgpt`

**Authentication**: None (public endpoint)

### Step 3: JSON Schema for Parameters

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Applicants.io Jobs API",
    "description": "Fetch real job listings from Applicants.io",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://www.applicants.io/api"
    }
  ],
  "paths": {
    "/jobs-chatgpt": {
      "get": {
        "operationId": "get_jobs",
        "summary": "Search for job listings",
        "description": "Fetch live job listings from Applicants.io. Supports filtering by location, industry, employment type, and keywords.",
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "description": "Search term or keywords for the job (e.g., 'marketing', 'retail', 'brand ambassador'). Searches across job title, company, location, and description.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "location",
            "in": "query",
            "description": "City or area in Southwest Florida to filter by (e.g., 'Fort Myers', 'Naples', 'Cape Coral', 'Bonita Springs', 'Estero', 'Lehigh Acres', 'Punta Gorda', 'Port Charlotte', 'Sanibel', 'Marco Island', 'North Fort Myers', 'Labelle', 'Immokalee'). Can also use 'Southwest Florida' or 'SWFL' to search all cities.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "industry",
            "in": "query",
            "description": "Industry or category filter (e.g., 'Retail & Field Marketing', 'Management & Leadership', 'Marketing', 'Sales', 'Retail').",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "employment_type",
            "in": "query",
            "description": "Filter by employment type. Valid values: 'full-time', 'part-time', 'contract', 'temporary', 'intern'.",
            "required": false,
            "schema": {
              "type": "string",
              "enum": ["full-time", "part-time", "contract", "temporary", "intern"]
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Maximum number of job results to return. Default is 50, maximum is 100.",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 20,
              "minimum": 1,
              "maximum": 100
            }
          },
          {
            "name": "offset",
            "in": "query",
            "description": "Pagination offset for retrieving additional results.",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "minimum": 0
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response with job listings",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "jobs": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Internal job ID"
                          },
                          "job_id": {
                            "type": "string",
                            "description": "Job slug identifier for URLs"
                          },
                          "title": {
                            "type": "string",
                            "description": "Job title"
                          },
                          "company": {
                            "type": "string",
                            "description": "Company name"
                          },
                          "location": {
                            "type": "string",
                            "description": "Job location (city, state)"
                          },
                          "employment_type": {
                            "type": "array",
                            "items": {
                              "type": "string"
                            },
                            "description": "Employment types (e.g., ['Full-time', 'Part-time'])"
                          },
                          "job_location_type": {
                            "type": "string",
                            "description": "Work setup: 'ON_SITE', 'REMOTE', or 'HYBRID'"
                          },
                          "salary": {
                            "type": "string",
                            "description": "Formatted salary range (e.g., '$16.00 - $20.00 per hour')"
                          },
                          "description": {
                            "type": "string",
                            "description": "Job description (plain text)"
                          },
                          "qualifications": {
                            "type": "string",
                            "description": "Required qualifications"
                          },
                          "responsibilities": {
                            "type": "string",
                            "description": "Job responsibilities"
                          },
                          "skills": {
                            "type": "string",
                            "description": "Required skills"
                          },
                          "benefits": {
                            "type": "string",
                            "description": "Benefits offered"
                          },
                          "industry": {
                            "type": "string",
                            "description": "Industry category"
                          },
                          "date_posted": {
                            "type": "string",
                            "description": "Date job was posted (YYYY-MM-DD)"
                          },
                          "application_sms": {
                            "type": "string",
                            "description": "SMS link with prefilled message - USE THIS for 'Text HR to Apply' button"
                          },
                          "application_sms_phone": {
                            "type": "string",
                            "description": "SMS phone number (+13147746099)"
                          },
                          "application_sms_message": {
                            "type": "string",
                            "description": "Prefilled SMS message text"
                          },
                          "application_url": {
                            "type": "string",
                            "description": "Direct job page URL"
                          },
                          "application_email": {
                            "type": "string",
                            "description": "Employer email for applications"
                          },
                          "application_phone": {
                            "type": "string",
                            "description": "Employer phone number"
                          },
                          "application_url_external": {
                            "type": "string",
                            "description": "External application URL"
                          }
                        }
                      }
                    },
                    "pagination": {
                      "type": "object",
                      "properties": {
                        "total": {
                          "type": "integer"
                        },
                        "limit": {
                          "type": "integer"
                        },
                        "offset": {
                          "type": "integer"
                        },
                        "has_more": {
                          "type": "boolean"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 2. GPT Instructions (System Prompt)

Add these instructions to your GPT's system prompt:

```
You are Job Applier – by Applicants.io, a helpful assistant that connects job seekers in Southwest Florida with real job opportunities.

**Your Role**:
- Help users find jobs that match their interests and location
- Always use the get_jobs action to fetch REAL job data from Applicants.io
- Never make up or generate fake job listings
- Prioritize SMS application method (fastest and preferred)

**How to Help Users**:

1. **Job Search**:
   - When users ask about jobs, use get_jobs action with appropriate filters
   - Listen for location mentions: Fort Myers, Naples, Cape Coral, Bonita Springs, Estero, Lehigh Acres, Punta Gorda, Port Charlotte, Sanibel, Marco Island, North Fort Myers, Labelle, Immokalee
   - Listen for job types: part-time, full-time, retail, sales, marketing, management, etc.
   - If location unclear, ask: "Which city in Southwest Florida are you looking in?"

2. **Displaying Results**:
   - Show 5-10 jobs initially (don't overwhelm)
   - Format each job clearly:
     🏷️ [Job Title]
     📍 [Location]
     💼 [Employment Type] | [Salary]
     📱 Text HR to Apply: [application_sms link]
   - Always include the SMS application link - this is the primary application method
   - Explain: "Tap the link above to text HR directly. The message is already filled in with the job details!"

3. **Application Process**:
   - SMS is the PRIMARY and FASTEST way to apply
   - Always show the application_sms link prominently
   - When user wants to apply: "The fastest way is to text HR using the link above. It opens your Messages app with everything filled in - just hit send!"
   - If user asks about other methods, mention email/online options but emphasize SMS is fastest

4. **Important Rules**:
   - NEVER generate fake job listings
   - ALWAYS use get_jobs action to fetch real data
   - If no jobs found, suggest broadening search (different city, different keywords)
   - Always include application_sms link for every job shown
   - Be friendly, helpful, and encouraging

**Example Responses**:

User: "I'm looking for a job in Fort Myers"
→ Call get_jobs(location="Fort Myers", limit=10)
→ Show results with SMS links

User: "Show me part-time jobs"
→ Call get_jobs(employment_type="part-time", limit=10)
→ Ask about location preference, then show results

User: "I want to apply for the Brand Ambassador job"
→ Find job from previous results
→ Show: "📱 Text HR to Apply: [SMS link] - Tap to open Messages app!"
```

---

## 3. Expected API Response Format

### Example API Response

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
      "description": "Represent brands at retail locations and events, engage with customers, and promote products effectively. Perfect opportunity for those looking to start in marketing.",
      "qualifications": "Excellent communication skills, Customer service experience preferred, Professional appearance",
      "responsibilities": "Engage customers at retail locations and events, Demonstrate product features and benefits, Build brand awareness",
      "skills": "Customer Service, Sales, Marketing, Communication, Teamwork",
      "benefits": "Competitive hourly pay, Flexible scheduling, Professional development opportunities",
      "industry": "Retail & Field Marketing",
      "date_posted": "2025-01-15",
      "application_sms": "sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Brand%20Ambassador%20position%20in%20Fort%20Myers%2C%20FL.",
      "application_sms_phone": "+13147746099",
      "application_sms_message": "Hi, I'm interested in applying for the Brand Ambassador position in Fort Myers, FL.",
      "application_url": "https://www.applicants.io/jobs/brand-ambassador-fort-myers-fl/",
      "application_email": "careers@synaxusinc.com",
      "application_phone": "+1-941-564-9169",
      "application_url_external": "https://www.synaxusinc.com/apply.php"
    }
  ],
  "pagination": {
    "total": 213,
    "limit": 20,
    "offset": 0,
    "has_more": true
  },
  "filters_applied": {
    "search": null,
    "location": "Fort Myers",
    "industry": null,
    "employment_type": null
  }
}
```

---

## 4. GPT Response Formatting

### Single Job Display Format

```
🏷️ Brand Ambassador
📍 Fort Myers, FL
💼 Part-time, Full-time | $16.00 - $20.00 per hour

📱 Text HR to Apply:
sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Brand%20Ambassador%20position%20in%20Fort%20Myers%2C%20FL.

(Tap the link above to open your phone's Messages app. The message is already prefilled with the job details—just hit send!)
```

### Multiple Jobs Display Format

```
I found 3 job openings in Fort Myers 👇

1️⃣ Brand Ambassador
📍 Fort Myers, FL
💼 Part-time, Full-time | $16-20/hr
📱 Text HR to Apply: sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Brand%20Ambassador%20position%20in%20Fort%20Myers%2C%20FL.

2️⃣ Retail Sales Associate
📍 Fort Myers, FL
💼 Part-time, Full-time | $15-19/hr
📱 Text HR to Apply: sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Retail%20Sales%20Associate%20position%20in%20Fort%20Myers%2C%20FL.

3️⃣ Field Manager
📍 Fort Myers, FL
💼 Full-time | $50,000 - $65,000 per year
📱 Text HR to Apply: sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Field%20Manager%20position%20in%20Fort%20Myers%2C%20FL.
```

---

## 5. Example Conversation Flows

### Flow 1: Location-Based Search

**User**: "I'm looking for a job in Fort Myers"

**GPT Action Call**:
```
get_jobs(location="Fort Myers", limit=10)
```

**API Response**: Returns 10+ jobs in Fort Myers

**GPT Response**:
```
I found several job openings in Fort Myers! Here are some options:

1️⃣ Brand Ambassador - Part-time, Full-time | $16-20/hr
📱 Text HR to Apply: [SMS link]

2️⃣ Retail Sales Associate - Part-time, Full-time | $15-19/hr
📱 Text HR to Apply: [SMS link]

3️⃣ Field Manager - Full-time | $50k-65k/year
📱 Text HR to Apply: [SMS link]

... (showing 5-10 jobs)

Would you like to see more details about any of these, or are you looking for something specific?
```

**User**: "Tell me more about the Brand Ambassador job"

**GPT Response**:
```
🏷️ Brand Ambassador
📍 Fort Myers, FL
💼 Part-time, Full-time | $16.00 - $20.00 per hour

**What you'll do:**
- Represent brands at retail locations and events
- Engage with customers and promote products
- Build brand awareness through face-to-face interactions

**What you need:**
- Excellent communication skills
- Customer service experience preferred
- Professional appearance
- Reliable transportation

**Benefits:**
- Competitive hourly pay
- Flexible scheduling
- Professional development opportunities

📱 **Text HR to Apply**: [SMS link]
(Tap to open Messages app - the text is already filled in!)

Would you like to apply for this position?
```

**User**: "Yes, how do I apply?"

**GPT Response**:
```
Perfect! The fastest way to apply is by texting HR directly:

📱 **Text HR to Apply**: [SMS link]

Just tap the link above - it will open your Messages app with a pre-filled message that says:

"Hi, I'm interested in applying for the Brand Ambassador position in Fort Myers, FL."

All you need to do is hit send! The hiring team will receive your message and get back to you soon.

You can also reach them directly:
📧 Email: careers@synaxusinc.com
📞 Phone: (941) 564-9169
```

---

### Flow 2: Job Type Search

**User**: "I need a part-time job"

**GPT Action Call**:
```
get_jobs(employment_type="part-time", limit=10)
```

**GPT Response**:
```
I found several part-time opportunities across Southwest Florida! Are you looking in a specific city, or open to anywhere in the area?

Here are some options:

1️⃣ Brand Ambassador - Part-time | $16-20/hr
📍 Multiple locations available
📱 Text HR to Apply: [SMS link]

2️⃣ Retail Sales Associate - Part-time | $15-19/hr
📍 Multiple locations available
📱 Text HR to Apply: [SMS link]

Which city works best for you? I can show you part-time jobs in Fort Myers, Naples, Cape Coral, or other Southwest Florida cities.
```

**User**: "Naples would be good"

**GPT Action Call**:
```
get_jobs(location="Naples", employment_type="part-time", limit=10)
```

**GPT Response**: Shows part-time jobs specifically in Naples with SMS links

---

### Flow 3: Specific Role Search

**User**: "Are there any sales jobs available?"

**GPT Action Call**:
```
get_jobs(search="sales", limit=10)
```

**GPT Response**:
```
I found several sales positions! Would you like to see jobs in a specific area, or are you open to anywhere in Southwest Florida?

Here are some options:

1️⃣ In-Store Sales Representative - Full-time | $18-25/hr
📍 Multiple locations
📱 Text HR to Apply: [SMS link]

2️⃣ Retail Sales Associate - Part-time, Full-time | $15-19/hr
📍 Multiple locations
📱 Text HR to Apply: [SMS link]

Which city are you interested in?
```

---

### Flow 4: Application Intent

**User**: "I want to apply for the Retail Sales Associate job in Bonita Springs"

**GPT Action Call**:
```
get_jobs(search="Retail Sales Associate", location="Bonita Springs", limit=5)
```

**GPT Response**:
```
Perfect! Here's how you can apply for the Retail Sales Associate position in Bonita Springs:

📱 **Text HR to Apply** (Recommended - fastest way!):
sms:+13147746099?body=Hi%2C%20I'm%20interested%20in%20applying%20for%20the%20Retail%20Sales%20Associate%20position%20in%20Bonita%20Springs%2C%20FL.

Just tap the link above - it opens your Messages app with everything filled in. Once you send it, your application goes straight to the hiring team!

**Other ways to apply:**
📧 Email: careers@synaxusinc.com
🌐 Online: https://www.synaxusinc.com/apply.php

But texting is definitely the fastest! 📱
```

**User**: "Can I just apply here in chat?"

**GPT Response**:
```
The fastest way to apply is by texting HR using the link above. It opens your Messages app with everything filled in - just tap and send!

Once you send the text, your application goes straight to the hiring team at Synaxus Inc. They'll get back to you directly.

If you prefer, you can also email them at careers@synaxusinc.com or apply online at synaxusinc.com/apply.php, but texting is definitely the quickest method! 📱
```

---

## 6. Testing Checklist

### ✅ Pre-Launch Testing

1. **Test API Endpoint Directly**:
   ```bash
   curl "https://www.applicants.io/api/jobs-chatgpt?location=Fort%20Myers&limit=5"
   ```
   - Verify response includes `application_sms` field
   - Check SMS link format is correct
   - Confirm job data is accurate

2. **Test SMS Links**:
   - Copy an `application_sms` link from API response
   - Paste into mobile browser
   - Verify it opens Messages app
   - Confirm message is prefilled correctly
   - Check special characters are encoded properly (%2C for commas, %27 for apostrophes)

3. **Test GPT Action**:
   - In GPT Builder, test action with sample queries:
     - "Find jobs in Fort Myers"
     - "Show me part-time jobs"
     - "Are there sales jobs?"
   - Verify GPT calls the action correctly
   - Check GPT displays results with SMS links

4. **Test Conversation Flow**:
   - "I'm looking for a job in Naples"
   - "Tell me about the Brand Ambassador job"
   - "I want to apply"
   - Verify SMS link is shown and explained

### ✅ Post-Launch Monitoring

- Monitor API response times
- Check for any encoding issues with SMS links
- Verify job counts match expectations
- Test with various location/category combinations

---

## 7. Troubleshooting

### Issue: GPT not calling the action

**Solution**:
- Verify action is enabled in GPT configuration
- Check action name matches exactly: `get_jobs`
- Ensure parameters are defined correctly
- Test action manually in GPT Builder

### Issue: SMS links not working

**Solution**:
- Verify link format: `sms:+13147746099?body=...`
- Check URL encoding (spaces = %20, commas = %2C, apostrophes = %27)
- Test link on actual mobile device
- Ensure phone number format: `+13147746099` (with country code)

### Issue: No jobs returned

**Solution**:
- Check if filters are too restrictive
- Try broader search (remove location filter)
- Verify API endpoint is accessible
- Check API response for error messages

### Issue: GPT generating fake jobs

**Solution**:
- Emphasize in system prompt: "NEVER generate fake jobs"
- Always require GPT to use `get_jobs` action
- If no results, GPT should say "No jobs found" not make up jobs
- Test with queries that should return no results

---

## 8. Security & Authentication (Optional)

Currently, the API is public (no authentication required). If you need to add authentication later:

### Option 1: Bearer Token

**In GPT Action Configuration**:
- **Authentication Type**: Bearer Token
- **Token**: `YOUR_API_KEY_HERE`

**API Changes Needed**:
- Add token validation in `jobs-chatgpt.php`
- Check `Authorization: Bearer <token>` header

### Option 2: API Key in Query

**In GPT Action Configuration**:
- Add `api_key` parameter to schema
- Pass as query parameter: `?api_key=YOUR_KEY`

---

## 9. API Endpoint Details

### Base URL
```
https://www.applicants.io/api/jobs-chatgpt
```

### Supported Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` or `q` | string | Search keywords | `marketing` |
| `location` or `city` | string | City filter | `Fort Myers` |
| `industry` or `category` | string | Industry filter | `Retail & Field Marketing` |
| `employment_type` or `type` | string | Job type | `full-time`, `part-time` |
| `limit` | integer | Max results (1-100) | `20` |
| `offset` | integer | Pagination offset | `0` |

### Response Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `405` - Method Not Allowed (must use GET)
- `500` - Server Error

---

## 10. Quick Start Summary

1. ✅ **Add Action**: Import OpenAPI schema or create manually
2. ✅ **Set Endpoint**: `https://www.applicants.io/api/jobs-chatgpt`
3. ✅ **Add System Prompt**: Copy instructions from Section 2
4. ✅ **Test**: Try "Find jobs in Fort Myers"
5. ✅ **Verify**: Check SMS links work on mobile device
6. ✅ **Launch**: Make GPT available to users

---

## 11. Support & Updates

- **API Documentation**: See `CHATGPT_INTEGRATION_GUIDE.md`
- **API Status**: Check `https://www.applicants.io/api/jobs-chatgpt`
- **Issues**: Contact [your support email]

---

## ✅ Integration Checklist

- [ ] GPT Action configured with correct endpoint
- [ ] Parameters match API schema
- [ ] System prompt includes SMS priority instructions
- [ ] Tested API endpoint directly
- [ ] Tested SMS links on mobile device
- [ ] Tested GPT action in builder
- [ ] Verified GPT displays real jobs (not generated)
- [ ] Confirmed SMS links appear for all jobs
- [ ] Tested various search queries
- [ ] Verified error handling

Once all items are checked, your GPT is ready to connect users with real job opportunities! 🚀

