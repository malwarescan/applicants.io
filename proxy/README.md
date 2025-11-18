# Applicants.io Proxy Server

Proxy server for ChatGPT integration with Applicants.io API. This proxy allows ChatGPT to connect to your own domain instead of directly to Applicants.io, avoiding third-party permission popups.

## Features

- ✅ Proxies requests to Applicants.io API
- ✅ In-memory caching (5-minute TTL)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Health check endpoint
- ✅ Ready for deployment (Render, Vercel, Railway, etc.)

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

3. **Test the endpoint:**
   ```bash
   curl http://localhost:3000/jobs?location=Fort%20Myers&limit=5
   ```

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Deployment

### Option 1: Render

1. Connect your GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Set environment: `Node`
5. Your proxy will be available at: `https://your-app.onrender.com/jobs`

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Your proxy will be available at: `https://your-app.vercel.app/jobs`

### Option 3: Railway

1. Connect your GitHub repo
2. Railway will auto-detect Node.js
3. Your proxy will be available at: `https://your-app.up.railway.app/jobs`

### Option 4: AWS/Your VPS

1. Clone repo and install dependencies
2. Use PM2 or systemd to run: `pm2 start server.js`
3. Set up reverse proxy (nginx) if needed

## ChatGPT Integration

1. **Deploy the proxy** to get your proxy URL (e.g., `https://api.applicants.io/jobs`)

2. **Update OpenAPI Schema:**
   - Use `gpt-action-openapi-schema-proxy.json`
   - Update the `servers` URL to your proxy domain
   - Import into ChatGPT GPT Builder → Actions

3. **Test in ChatGPT:**
   - Ask: "Find marketing jobs in Fort Myers"
   - Should return results without permission popup

## API Endpoints

### GET /jobs

Fetch job listings from Applicants.io.

**Query Parameters:**
- `search` - Search keywords
- `location` - City filter
- `industry` - Industry filter
- `employment_type` - Employment type filter
- `limit` - Max results (default: 50, max: 100)
- `offset` - Pagination offset

**Example:**
```
GET /jobs?location=Fort Myers&limit=10
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T04:00:00.000Z",
  "cache_size": 5
}
```

## Caching

The proxy uses in-memory caching with a 5-minute TTL. This reduces load on Applicants.io API and improves response times.

Cache is automatically cleaned when it exceeds 100 entries.

## Error Handling

If Applicants.io API is unavailable, the proxy returns:
```json
{
  "success": false,
  "error": "Failed to fetch jobs from Applicants.io",
  "details": "Error message"
}
```

## Security

- CORS enabled for cross-origin requests
- No authentication required (can be added if needed)
- Input validation on query parameters
- Error messages don't expose sensitive information

## Optional Enhancements

### Add API Key Authentication

```javascript
const API_KEY = process.env.API_KEY;

app.get("/jobs", async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // ... rest of code
});
```

### Add Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/jobs', limiter);
```

### Use Redis for Caching

Replace in-memory cache with Redis for distributed caching.

## License

MIT

