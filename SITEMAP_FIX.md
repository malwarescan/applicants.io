# Sitemap Fix for Google Search Console

## Problem
Google Search Console was showing "URL is not available to Google" for `/sitemap.xml` because:
- React routes were returning HTML instead of XML
- No proper Content-Type headers
- Static XML files weren't being generated

## Solution

### 1. Generate Static XML Files
Created `scripts/generate-sitemap-with-blog.js` that:
- Generates static XML files in `php-src/public/` and `dist/`
- Includes all 24 blog posts in blog sitemap
- Creates proper sitemap index and chunks

### 2. Build Integration
Updated `package.json`:
- Added `prebuild` script to generate sitemaps before build
- Updated `generate-sitemap` script to use new generator

### 3. PHP Routes (Already Exist)
The PHP routes in `php-src/routes.web.php` serve the static XML files:
```php
'#^/sitemap\.xml$#' => function() {
  $sitemapFile = __DIR__ . '/public/sitemap.xml';
  if (file_exists($sitemapFile)) {
    header('Content-Type: application/xml');
    echo file_get_contents($sitemapFile);
    exit;
  }
}
```

## How to Deploy

1. **Generate Sitemaps**:
   ```bash
   npm run generate-sitemap
   ```

2. **Build**:
   ```bash
   npm run build
   ```
   (This automatically runs generate-sitemap first)

3. **Verify Files Exist**:
   - `php-src/public/sitemap.xml`
   - `php-src/public/sitemaps/blog.xml`
   - `php-src/public/sitemaps/main.xml`
   - `php-src/public/sitemaps/categories.xml`
   - `php-src/public/sitemaps/locations.xml`
   - `php-src/public/sitemaps/category-location.xml`

4. **Deploy** - The PHP routes will serve these files with proper headers

## Testing

After deployment, verify:
1. `https://applicants.io/sitemap.xml` returns XML (not HTML)
2. Content-Type header is `application/xml`
3. All sitemap chunks are accessible
4. Blog sitemap includes all 24 posts

## Google Search Console

After deployment:
1. Wait 5-10 minutes for changes to propagate
2. Use URL Inspection tool to test `https://applicants.io/sitemap.xml`
3. Should show "URL is on Google" or at least "URL is available to Google"
4. Submit sitemap in GSC

