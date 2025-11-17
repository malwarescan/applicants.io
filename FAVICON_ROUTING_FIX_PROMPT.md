# Favicon Routing Fix Prompt Template

Use this prompt for any website where favicons aren't loading properly due to routing issues (PHP, Railway, Vercel, etc.)

---

## Problem
The favicon and related icon files are not appearing on the website. This is likely because:
- Static files aren't being served correctly through the routing system
- Favicon requests are being caught by the main router instead of being served as static files
- Files exist but routes don't handle them explicitly

## Task
Fix the favicon routing so that all favicon files load correctly. Ensure:
1. `/favicon.ico` loads with correct content type
2. All favicon variants load (`.svg`, `.png` sizes, `apple-touch-icon`, `site.webmanifest`)
3. Files are served with proper headers and caching
4. Routes are placed at the top of the routing configuration to catch requests first

## Solution Steps

### 1. Identify the routing system
- **PHP applications**: Routes are typically in a routes file (e.g., `routes.web.php`, `router.php`)
- **Node.js/Express**: Routes in `app.js`, `server.js`, or route files
- **Static site generators**: May need middleware or server configuration
- **Railway/Vercel**: Check deployment config and routing setup

### 2. Locate favicon files
- Find where favicon files are stored (typically `public/`, `static/`, or root directory)
- Ensure all necessary files exist:
  - `favicon.ico`
  - `favicon.svg`
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `favicon-192.png` (or `favicon-180x180.png`)
  - `apple-touch-icon.png`
  - `site.webmanifest`

### 3. Copy files to the served directory
If the app serves from a specific directory (e.g., `php-src/public/`, `dist/`), ensure favicon files are copied there.

### 4. Add explicit routes
Add routes at the **TOP** of your routing configuration (before other routes) to serve favicon files:

**For PHP applications:**
```php
// Add to routes.web.php or main router file - MUST be first
'#^/favicon\.ico$#' => function() {
  $file = __DIR__ . '/public/favicon.ico';
  if (file_exists($file)) {
    header('Content-Type: image/x-icon');
    header('Cache-Control: public, max-age=31536000');
    readfile($file);
    exit;
  }
  http_response_code(404);
  exit;
},

'#^/favicon\.svg$#' => function() {
  $file = __DIR__ . '/public/favicon.svg';
  if (file_exists($file)) {
    header('Content-Type: image/svg+xml');
    header('Cache-Control: public, max-age=31536000');
    readfile($file);
    exit;
  }
  http_response_code(404);
  exit;
},

'#^/favicon-16x16\.png$#' => function() {
  $file = __DIR__ . '/public/favicon-16x16.png';
  if (file_exists($file)) {
    header('Content-Type: image/png');
    header('Cache-Control: public, max-age=31536000');
    readfile($file);
    exit;
  }
  http_response_code(404);
  exit;
},

'#^/favicon-32x32\.png$#' => function() {
  $file = __DIR__ . '/public/favicon-32x32.png';
  if (file_exists($file)) {
    header('Content-Type: image/png');
    header('Cache-Control: public, max-age=31536000');
    readfile($file);
    exit;
  }
  http_response_code(404);
  exit;
},

'#^/favicon-192\.png$#' => function() {
  $file = __DIR__ . '/public/favicon-192.png';
  if (file_exists($file)) {
    header('Content-Type: image/png');
    header('Cache-Control: public, max-age=31536000');
    readfile($file);
    exit;
  }
  http_response_code(404);
  exit;
},

'#^/apple-touch-icon\.png$#' => function() {
  $file = __DIR__ . '/public/apple-touch-icon.png';
  if (file_exists($file)) {
    header('Content-Type: image/png');
    header('Cache-Control: public, max-age=31536000');
    readfile($file);
    exit;
  }
  http_response_code(404);
  exit;
},

'#^/site\.webmanifest$#' => function() {
  $file = __DIR__ . '/public/site.webmanifest';
  if (file_exists($file)) {
    header('Content-Type: application/manifest+json');
    header('Cache-Control: public, max-age=86400');
    readfile($file);
    exit;
  }
  http_response_code(404);
  exit;
},
```

**For Express.js/Node.js:**
```javascript
// Add BEFORE other routes in app.js or main server file
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'), {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
});

app.get('/favicon.svg', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.svg'), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
});

// Repeat for other favicon files...
```

**For Next.js:**
- Place favicon files in `public/` directory
- Next.js automatically serves files from `public/` at the root
- Ensure files are named correctly: `favicon.ico`, `favicon.svg`, etc.

**For Vite/React:**
- Place favicon files in `public/` directory
- Vite automatically serves files from `public/` at the root
- Add proper `<link>` tags in `index.html`

### 5. Verify HTML references
Ensure your HTML includes proper favicon links:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

### 6. Test
- Visit `https://your-domain.com/favicon.ico` directly in browser
- Check browser DevTools → Network tab for favicon requests
- Verify status codes are 200, not 404
- Clear browser cache and test again

### 7. Deploy
- Commit changes to git
- Push to deployment platform
- Wait for deployment to complete
- Test on live site

## Key Points to Remember

1. **Route order matters**: Favicon routes MUST be checked before other routes
2. **Content-Type headers**: Set correct MIME types for each file type
3. **Caching**: Add Cache-Control headers for performance
4. **File paths**: Use absolute paths relative to the routing file location
5. **Exit early**: Use `exit` in PHP or `return` in Node.js after serving the file

## Common Issues

- **404 errors**: File doesn't exist in the served directory path
- **Wrong content type**: Browser displays broken image or downloads file
- **Routes intercepted**: Favicon routes placed after catch-all routes
- **Path mismatch**: HTML references don't match actual file locations
- **Cache issues**: Browser cached 404 response - hard refresh needed

## Example Prompt for AI Assistant

```
My website's favicon is not appearing. The favicon files exist in the project but 
they're not being served correctly. I'm using [PHP/Node.js/Next.js/etc] and hosting 
on [Railway/Vercel/etc]. 

Please:
1. Identify where the routing is configured
2. Check where favicon files are located
3. Add explicit routes to serve all favicon files (favicon.ico, favicon.svg, 
   favicon-16x16.png, favicon-32x32.png, favicon-192.png, apple-touch-icon.png, 
   site.webmanifest) with proper content-type headers
4. Ensure routes are placed at the top of the routing configuration
5. Verify HTML has proper favicon link tags
6. Test that favicons load correctly
```

---

**Template created**: Use this as a reference when fixing favicon issues across multiple websites.





