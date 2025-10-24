# PHP Static Conversion

This document explains how to run the converted PHP site locally and deploy it to Vercel as a static site.

## Project Structure

The original React/Vite application has been converted to a PHP-based static site generator with the following structure:

```
php-src/
├── public/
│   ├── index.php          # Front controller
│   └── .htaccess         # Apache rewrites
├── app/
│   ├── bootstrap.php      # Autoloader and config
│   ├── Router.php         # URL routing
│   ├── Renderer.php       # View rendering
│   ├── Data.php          # Data loaders
│   ├── Seo.php           # SEO helpers
│   └── Build.php         # Static site generator
├── views/
│   ├── layout.php        # Main layout template
│   └── pages/           # Page templates
├── data/
│   └── jobs.json        # Job data
├── config.example.php    # Configuration template
└── routes.web.php       # Route definitions
```

## Local Development

### Prerequisites

- PHP 8.1 or higher
- No external dependencies required

### Running Locally

1. **Start the development server:**
   ```bash
   bash scripts/local-server.sh
   ```
   
   Or manually:
   ```bash
   cd php-src/public
   php -S localhost:8000
   ```

2. **Access the site:**
   - Open http://localhost:8000 in your browser
   - The site will work exactly like the original React version

### Configuration

1. **Copy the example config:**
   ```bash
   cp php-src/config.example.php php-src/config.php
   ```

2. **Edit `php-src/config.php`** to set your base URL and other environment variables:
   ```php
   $_ENV['BASE_URL'] = 'https://your-domain.com';
   ```

## Static Build for Vercel

### Building the Static Site

1. **Generate static files:**
   ```bash
   php scripts/build.php
   ```

   This will create a `/dist` folder with all static HTML files.

2. **Verify the build:**
   ```bash
   ls -la php-src/dist/
   ```
   
   You should see:
   - `index.html` (home page)
   - `jobs/index.html` (jobs page)
   - `jobs/[id]/index.html` (individual job pages)
   - `jobs/category/[category]/index.html` (category pages)
   - `post-job/index.html` (post job page)
   - `contact/index.html` (contact page)
   - `sitemap.xml` (generated sitemap)
   - Static assets (CSS, images, etc.)

### Deploying to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy the static site:**
   ```bash
   # From the project root
   vercel --prod
   ```

3. **Configure Vercel settings:**
   - Framework Preset: **Other**
   - Output Directory: **php-src/dist**
   - Build Command: `php scripts/build.php`
   - Install Command: (leave empty)

4. **Alternative: Manual deployment:**
   - Upload the contents of `php-src/dist` to any static hosting service
   - The site will work as a completely static site

## Features Converted

### Pages Converted
- ✅ Home page (`/`) - Job listings with filters
- ✅ Job detail page (`/jobs/{id}`) - Individual job pages  
- ✅ Category page (`/jobs/category/{category}`) - Industry-specific job listings
- ✅ Post job page (`/post-job`) - Job posting form
- ✅ Contact page (`/contact`) - Contact form

### Features Preserved
- ✅ Responsive design with Tailwind CSS
- ✅ Job filtering by location and industry
- ✅ Search functionality
- ✅ SEO meta tags and structured data
- ✅ Form validation and submission
- ✅ Static asset handling

## URL Structure

The PHP version maintains the same URL structure as the original:

- `/` - Home page with job listings
- `/jobs/` - Same as home page
- `/jobs/{id}/` - Individual job details
- `/jobs/category/{category}/` - Category-specific listings
- `/post-job/` - Job posting form
- `/contact/` - Contact form

## Data Sources

The PHP version uses the same data sources as the original:

- **Static JSON files** - Job data stored in `php-src/data/jobs.json`
- **No database required** - All data is loaded from JSON files
- **Environment variables** - Configuration via `config.php`

## Build Process

The build process:

1. **Reads routes** from `routes.map.php`
2. **Generates static HTML** for each route
3. **Copies static assets** from the original project
4. **Creates sitemap.xml** automatically
5. **Outputs to `php-src/dist`** directory

## Customization

### Adding New Pages

1. Create a new view in `php-src/views/pages/`
2. Add a route in `php-src/routes.web.php`
3. Add the route to `php-src/routes.map.php` for static generation

### Modifying Data Sources

Edit `php-src/app/Data.php` to:
- Add database connections
- Integrate with external APIs
- Modify data loading logic

## Troubleshooting

### Common Issues

1. **Build fails:**
   - Ensure PHP 8.1+ is installed
   - Check file permissions
   - Verify all required files exist

2. **Routes not working:**
   - Check `routes.web.php` syntax
   - Verify regex patterns
   - Test with local server first

3. **Static assets missing:**
   - Ensure original project assets exist
   - Check `Build.php` asset copying logic
   - Verify file paths

## Performance

The static build generates:
- **Fully static HTML** - No server-side processing required
- **Optimized assets** - All CSS/JS/images copied and optimized
- **SEO-friendly URLs** - Clean, indexable URLs
- **Fast loading** - No database queries or server processing

## Migration Notes

### What Changed
- React components → PHP templates
- React Router → PHP Router class
- JavaScript state → PHP variables
- Build process → PHP static generator

### What Stayed the Same
- URL structure
- Visual design
- Functionality
- SEO optimization
- Static asset handling

The converted site maintains 100% feature parity with the original React application while being deployable as a static site to Vercel or any static hosting service.