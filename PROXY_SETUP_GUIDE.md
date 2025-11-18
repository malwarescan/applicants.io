# ChatGPT Proxy Setup Guide

This guide explains how to set up a proxy server for ChatGPT integration to avoid third-party permission popups.

## Why Use a Proxy?

When ChatGPT connects directly to Applicants.io API, users see a permission popup asking to connect to a third-party service. By using a proxy on your own domain, ChatGPT treats it as your own API, eliminating the popup.

## Quick Setup (3 Steps)

### Step 1: Deploy the Proxy

The proxy server is in the `proxy/` directory. Deploy it to any hosting service:

**Render (Recommended - Free):**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `cd proxy && npm install`
   - **Start Command:** `cd proxy && npm start`
   - **Environment:** Node
5. Deploy!

**Vercel:**
```bash
cd proxy
vercel
```

**Railway:**
1. Connect GitHub repo
2. Railway auto-detects Node.js
3. Set root directory to `proxy/`

**Your Proxy URL will be:** `https://your-app.onrender.com` (or your domain)

### Step 2: Update OpenAPI Schema

1. Open `proxy/gpt-action-openapi-schema-proxy.json`
2. Update the `servers` URL to your proxy domain:
   ```json
   "servers": [
     {
       "url": "https://your-app.onrender.com",
       "description": "Production proxy server"
     }
   ]
   ```

3. Save the file

### Step 3: Import to ChatGPT

1. Open ChatGPT GPT Builder
2. Go to **Actions** → **Create new action**
3. Click **"Import from URL"** or **"Upload file"**
4. Upload `proxy/gpt-action-openapi-schema-proxy.json`
5. Save!

## Testing

### Test the Proxy Directly

```bash
curl "https://your-app.onrender.com/jobs?location=Fort Myers&limit=5"
```

Should return JSON with job listings.

### Test in ChatGPT

Ask your GPT:
```
Find marketing jobs in Cape Coral
```

Should return results **without** the permission popup!

## Benefits

✅ **No Permission Popup** - ChatGPT treats it as your own API  
✅ **Caching** - Faster responses, less load on Applicants.io  
✅ **Control** - Add rate limiting, authentication, logging  
✅ **Privacy** - Hide Applicants.io API details from users  

## Proxy Features

- **Caching:** 5-minute TTL reduces API calls
- **Error Handling:** Graceful fallbacks if Applicants.io is down
- **CORS:** Enabled for cross-origin requests
- **Health Check:** `/health` endpoint for monitoring

## Optional: Custom Domain

Instead of `your-app.onrender.com`, use your own domain:

1. **Point DNS** to your proxy server
2. **Update OpenAPI schema** with your domain
3. **Re-import** to ChatGPT

Example:
- Proxy: `https://api.applicants.io/jobs`
- Update schema: `"url": "https://api.applicants.io"`

## Troubleshooting

### Proxy returns 500 error

- Check Applicants.io API is accessible
- Check proxy logs for errors
- Verify environment variables

### ChatGPT still shows popup

- Make sure you're using the proxy schema, not the direct one
- Verify the proxy URL in schema matches your deployment
- Re-import the schema to ChatGPT

### Slow responses

- Check cache is working (should be faster on second request)
- Consider upgrading hosting plan
- Check Applicants.io API response times

## Files

- `proxy/server.js` - Express proxy server
- `proxy/package.json` - Dependencies
- `proxy/gpt-action-openapi-schema-proxy.json` - ChatGPT schema
- `proxy/README.md` - Detailed documentation

## Next Steps

1. ✅ Deploy proxy
2. ✅ Update schema with your proxy URL
3. ✅ Import to ChatGPT
4. ✅ Test and verify no popup appears
5. ✅ (Optional) Add custom domain

That's it! Your ChatGPT GPT now connects through your proxy. 🎉

