import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Simple in-memory cache (optional - can be replaced with Redis)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to get cache key
function getCacheKey(query) {
  return JSON.stringify(query);
}

// Helper function to check if cache entry is valid
function isCacheValid(entry) {
  return entry && (Date.now() - entry.timestamp) < CACHE_TTL;
}

/**
 * GET /jobs
 * Proxy endpoint for ChatGPT to fetch job listings from Applicants.io
 */
app.get("/jobs", async (req, res) => {
  try {
    const { search, location, industry, employment_type, limit, offset } = req.query;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    if (industry) params.append('industry', industry);
    if (employment_type) params.append('employment_type', employment_type);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    
    // Check cache first
    const cacheKey = getCacheKey({ search, location, industry, employment_type, limit, offset });
    const cached = cache.get(cacheKey);
    
    if (isCacheValid(cached)) {
      console.log(`Cache hit for: ${cacheKey}`);
      return res.json(cached.data);
    }
    
    // Build Applicants.io API URL
    const apiUrl = `https://www.applicants.io/api/jobs-chatgpt?${params.toString()}`;
    
    console.log(`Fetching from Applicants.io: ${apiUrl}`);
    
    // Fetch from Applicants.io API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Applicants.io-Proxy/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Applicants.io API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries (keep cache size reasonable)
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch jobs from Applicants.io", 
      details: err.message 
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    cache_size: cache.size
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Applicants.io Proxy Server listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

