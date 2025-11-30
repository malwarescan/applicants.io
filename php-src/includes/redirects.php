<?php
/**
 * URL Redirect System for SEO
 * Handles 301 redirects for old URL patterns to new slug-based structure
 */

use App\Data;

/**
 * Get redirect mapping for old URLs
 * Returns array of [old_pattern => new_url] mappings
 */
function get_redirect_mappings(): array {
    $mappings = [];
    
    // Load jobs to build mappings
    $jobs = Data::readJson('data/jobs.json');
    
    // Build mappings from jobs data
    foreach ($jobs as $job) {
        $slug = $job['identifier']['value'] ?? null;
        if (!$slug) continue;
        
        $newUrl = "/jobs/$slug/";
        
        // Map old PHP file names to new slugs
        // Pattern: job-title-location.php -> /jobs/job-title-location-fl/
        $oldPhpFile = str_replace('-fl', '', $slug) . '.php';
        $mappings[$oldPhpFile] = $newUrl;
        
        // Map company/job-slug pattern (if we can extract it)
        if (isset($job['company'])) {
            $companySlug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $job['company']));
            $companySlug = trim($companySlug, '-');
            
            // Try to match old company/job patterns
            // Extract job part from slug (remove location)
            $jobPart = preg_replace('/-[a-z]+-fl$/', '', $slug);
            $oldCompanyUrl = "/jobs/$companySlug/$jobPart";
            $mappings[$oldCompanyUrl] = $newUrl;
        }
    }
    
    // Static redirects for known old patterns
    $staticRedirects = [
        // Old PHP files in root
        'sales-representative-cape-coral-fl.php' => '/jobs/sales-representative-cape-coral-fl/',
        'brand-ambassador-naples-fl.php' => '/jobs/brand-ambassador-naples-fl/',
        'marketing-specialist-estero-fl.php' => '/jobs/marketing-specialist-estero-fl/',
        'field-marketing-coordinator-fort-myers-fl.php' => '/jobs/field-marketing-coordinator-fort-myers-fl/',
        'event-staff-bonita-springs-fl.php' => '/jobs/event-staff-bonita-springs-fl/',
        'customer-service-representative-lehigh-acres-fl.php' => '/jobs/customer-service-representative-lehigh-acres-fl/',
        
        // Old enhanced pages
        'enhanced-post-job' => '/post-job/',
        'enhanced-jobs' => '/jobs/',
        
        // Admin (should be 404 or removed from sitemap)
        'admin' => '/',
    ];
    
    return array_merge($mappings, $staticRedirects);
}

/**
 * Find redirect for a given URL path
 * Returns new URL or null if no redirect found
 */
function find_redirect(string $path): ?string {
    // Remove leading/trailing slashes and query strings
    $path = trim(parse_url($path, PHP_URL_PATH), '/');
    
    // Check exact matches first
    $mappings = get_redirect_mappings();
    if (isset($mappings[$path])) {
        return $mappings[$path];
    }
    
    // Check if it's an old PHP file
    if (preg_match('/^([a-z0-9-]+)\.php$/', $path, $matches)) {
        $fileBase = $matches[1];
        // Try to find matching job slug
        $jobs = Data::readJson('data/jobs.json');
        foreach ($jobs as $job) {
            $slug = $job['identifier']['value'] ?? '';
            // Remove -fl suffix for comparison
            $slugBase = preg_replace('/-fl$/', '', $slug);
            if ($slugBase === $fileBase || $slug === $fileBase) {
                return "/jobs/$slug/";
            }
        }
    }
    
    // Handle old company/job-slug pattern: /jobs/company/job-slug
    if (preg_match('#^jobs/([^/]+)/([^/]+)$#', $path, $matches)) {
        $companySlug = $matches[1];
        $jobSlug = $matches[2];
        
        // Try to find job by matching slug parts
        $jobs = Data::readJson('data/jobs.json');
        foreach ($jobs as $job) {
            $slug = $job['identifier']['value'] ?? '';
            // Check if job slug matches
            if (strpos($slug, $jobSlug) !== false || strpos($jobSlug, $slug) !== false) {
                return "/jobs/$slug/";
            }
            // Also check by company
            if (isset($job['company'])) {
                $companyMatch = strtolower(preg_replace('/[^a-z0-9]+/', '-', $job['company']));
                $companyMatch = trim($companyMatch, '-');
                if ($companyMatch === $companySlug) {
                    // Try to match job part
                    $jobPart = preg_replace('/-[a-z]+-fl$/', '', $slug);
                    if (strpos($jobSlug, $jobPart) !== false) {
                        return "/jobs/$slug/";
                    }
                }
            }
        }
    }
    
    // Handle old state/city/job-title pattern: /jobs/state/city/job-title/
    if (preg_match('#^jobs/([^/]+)/([^/]+)/([^/]+)/?$#', $path, $matches)) {
        $state = $matches[1];
        $city = $matches[2];
        $jobTitle = $matches[3];
        
        // Try to find matching job
        $jobs = Data::readJson('data/jobs.json');
        foreach ($jobs as $job) {
            $slug = $job['identifier']['value'] ?? '';
            $location = strtolower($job['location'] ?? '');
            $title = strtolower($job['title'] ?? '');
            
            // Check if location matches state/city
            $locationMatch = (
                strpos($location, strtolower($city)) !== false ||
                strpos($location, strtolower($state)) !== false
            );
            
            // Check if title matches
            $titleMatch = (
                strpos($slug, strtolower(str_replace(' ', '-', $jobTitle))) !== false ||
                strpos($title, strtolower($jobTitle)) !== false
            );
            
            if ($locationMatch && $titleMatch) {
                return "/jobs/$slug/";
            }
        }
        
        // If no exact match, redirect to jobs index with location filter
        return "/jobs/?location=" . urlencode("$city, $state");
    }
    
    // Handle state/city pages: /jobs/state/city/ -> redirect to jobs with location filter
    if (preg_match('#^jobs/([^/]+)/([^/]+)/?$#', $path, $matches)) {
        $state = $matches[1];
        $city = $matches[2];
        
        // Check if it's actually a category (like /jobs/category/...)
        if ($state === 'category') {
            // Category pages exist, don't redirect
            return null;
        }
        
        // Redirect location pages to jobs index with filter
        return "/jobs/?location=" . urlencode("$city, $state");
    }
    
    // Handle state-only pages: /jobs/state/ -> redirect to jobs index
    $states = ['texas', 'california', 'florida', 'new-york', 'remote'];
    if (preg_match('#^jobs/([^/]+)/?$#', $path, $matches)) {
        $segment = strtolower($matches[1]);
        if (in_array($segment, $states) && $segment !== 'category') {
            return "/jobs/?location=" . urlencode(ucwords(str_replace('-', ' ', $segment)));
        }
    }
    
    return null;
}

/**
 * Perform 301 redirect
 */
function perform_redirect(string $newUrl, int $code = 301): void {
    // Ensure URL is absolute if needed
    if (!preg_match('/^https?:\/\//', $newUrl)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'www.applicants.io';
        $newUrl = "$protocol://$host$newUrl";
    }
    
    http_response_code($code);
    header("Location: $newUrl", true, $code);
    exit;
}

