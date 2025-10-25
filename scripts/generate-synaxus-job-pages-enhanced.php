#!/usr/bin/env php
<?php
/**
 * Enhanced Synaxus Job Pages Generator
 * 
 * Creates SEO-optimized pages with:
 * - Deep content for better SEO
 * - E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)
 * - Enhanced schema markup
 * - Rich content sections
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/schema_core.php';
require_once __DIR__ . '/../includes/schema_jobposting.php';

class EnhancedSynaxusPageGenerator {
    private $jobsFile;
    private $outputDir;
    private $site;
    
    public function __construct() {
        $this->jobsFile = __DIR__ . '/../data/synaxus_jobs.json';
        $this->outputDir = __DIR__ . '/../employers/synaxus';
        $this->site = require __DIR__ . '/../config/site.php';
    }
    
    private function generateSlug(string $text): string {
        $slug = strtolower($text);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');
        return $slug;
    }
    
    private function generateJobSlug(array $job): string {
        $title = $job['title'] ?? '';
        $location = '';
        
        if (!empty($job['jobLocation']) && is_array($job['jobLocation'])) {
            $loc = $job['jobLocation'][0] ?? [];
            $parts = array_filter([$loc['city'] ?? '', $loc['region'] ?? '']);
            $location = implode('-', $parts);
        }
        
        $titleSlug = $this->generateSlug($title);
        $locationSlug = $location ? '-' . $this->generateSlug($location) : '';
        
        return $titleSlug . $locationSlug;
    }
    
    /**
     * Generate comprehensive FAQ schema with E-E-A-T content
     */
    private function generateFAQSchema(array $job): array {
        $faqs = [];
        
        $empType = is_array($job['employmentType']) ? $job['employmentType'][0] : $job['employmentType'];
        $empTypeFormatted = str_replace('_', ' ', strtolower($empType));
        
        $faqs[] = [
            '@type' => 'Question',
            'name' => "Is this a {$empTypeFormatted} position?",
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => "Yes, this is a {$empTypeFormatted} position at Synaxus Inc., Southwest Florida's premier experiential marketing agency with established Fortune 500 partnerships."
            ]
        ];
        
        if (!empty($job['jobLocation'])) {
            $loc = $job['jobLocation'][0] ?? [];
            $city = $loc['city'] ?? '';
            $region = $loc['region'] ?? '';
            
            if ($city || $region) {
                $location = implode(', ', array_filter([$city, $region]));
                $faqs[] = [
                    '@type' => 'Question',
                    'name' => "Where is this job located?",
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => "This position is located in {$location}. Synaxus Inc. serves all of Southwest Florida including Fort Myers, Naples, Cape Coral, Bonita Springs, Estero, Lehigh Acres, Punta Gorda, and Port Charlotte."
                    ]
                ];
            }
        }
        
        if (!empty($job['salary'])) {
            $salary = $job['salary'];
            $min = $salary['min'] ?? null;
            $max = $salary['max'] ?? null;
            $unit = strtolower($salary['unit'] ?? 'hour');
            
            if ($min !== null && $max !== null) {
                $faqs[] = [
                    '@type' => 'Question',
                    'name' => "What is the salary range for this position?",
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => "The salary range for this position is \${$min} - \${$max} per {$unit}. Full-time positions offer salary potential up to \$68,000 annually with performance-based opportunities."
                    ]
                ];
            }
        }
        
        $faqs[] = [
            '@type' => 'Question',
            'name' => "How do I apply for this position?",
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => "Apply online through the Synaxus Inc. careers page. Our application process is simple: 1) Apply online with resume upload, 2) Receive a response within 24 hours, 3) Complete a friendly interview, 4) Begin your journey with comprehensive training. Email: careers@synaxusinc.com, Phone: (941) 564-9169."
            ]
        ];
        
        if (!empty($job['qualifications']) && is_array($job['qualifications'])) {
            $qualCount = count($job['qualifications']);
            $faqs[] = [
                '@type' => 'Question',
                'name' => "What qualifications are required?",
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => "This position requires: " . implode(', ', array_slice($job['qualifications'], 0, 3)) . ". No prior experience required - we provide comprehensive training and mentorship programs."
                ]
            ];
        }
        
        if (!empty($job['jobBenefits']) && is_array($job['jobBenefits'])) {
            $benefits = implode(', ', array_slice($job['jobBenefits'], 0, 3));
            $faqs[] = [
                '@type' => 'Question',
                'name' => "What benefits are offered?",
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => "Benefits include: {$benefits}. Synaxus Inc. offers a 31-68% promotion rate by month 6 with clear career advancement paths."
                ]
            ];
        }
        
        $faqs[] = [
            '@type' => 'Question',
            'name' => "Is training provided?",
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => "Yes, Synaxus Inc. provides comprehensive training and development programs for all team members. This includes initial onboarding, ongoing professional development, mentorship opportunities, and hands-on coaching to help you excel in your role."
            ]
        ];
        
        if (empty($faqs)) {
            return null;
        }
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $faqs
        ];
    }
    
    /**
     * Render enhanced job page with E-E-A-T signals
     */
    private function renderJobPage(array $job, string $slug): string {
        ob_start();
        
        $url = $this->site['siteUrl'] . '/employers/synaxus/' . $slug;
        $locationStr = '';
        if (!empty($job['jobLocation'])) {
            $loc = $job['jobLocation'][0] ?? [];
            $locationStr = implode(', ', array_filter([$loc['city'] ?? '', $loc['region'] ?? '']));
        }
        
        $title = $job['title'] . ' in ' . $locationStr . ' at Synaxus Inc. — ' . $this->site['siteName'];
        $description = $job['description'] . ' Join Synaxus Inc., Southwest Florida\'s premier experiential marketing agency. Work with Fortune 500 brands in ' . $locationStr . '. Competitive compensation, training provided.';
        
        // Enhanced meta tags
        echo "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
        echo "<meta charset=\"utf-8\">\n";
        echo "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n";
        echo "<title>" . htmlspecialchars($title) . "</title>\n";
        echo "<meta name=\"description\" content=\"" . htmlspecialchars(substr($description, 0, 160)) . "\">\n";
        echo "<meta name=\"keywords\" content=\"" . htmlspecialchars("{$job['title']}, Synaxus Inc, {$locationStr}, jobs, careers, marketing, experiential marketing, Southwest Florida, Fortune 500") . "\">\n";
        echo "<meta name=\"author\" content=\"Synaxus Inc.\">\n";
        echo "<meta name=\"robots\" content=\"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1\">\n";
        echo "<link rel=\"canonical\" href=\"" . htmlspecialchars($url) . "\">\n";
        
        // Open Graph tags
        echo "<meta property=\"og:title\" content=\"" . htmlspecialchars($title) . "\">\n";
        echo "<meta property=\"og:description\" content=\"" . htmlspecialchars(substr($description, 0, 200)) . "\">\n";
        echo "<meta property=\"og:url\" content=\"" . htmlspecialchars($url) . "\">\n";
        echo "<meta property=\"og:type\" content=\"website\">\n";
        echo "<meta property=\"og:image\" content=\"https://synaxusinc.com/synaxus-logo.png\">\n";
        
        // Twitter Card tags
        echo "<meta name=\"twitter:card\" content=\"summary_large_image\">\n";
        echo "<meta name=\"twitter:title\" content=\"" . htmlspecialchars($title) . "\">\n";
        echo "<meta name=\"twitter:description\" content=\"" . htmlspecialchars(substr($description, 0, 200)) . "\">\n";
        
        echo "<link rel=\"stylesheet\" href=\"/assets/styles.css\">\n";
        echo "<link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\">\n";
        echo "<link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/favicon-192.png\">\n";
        echo "<link rel=\"shortcut icon\" href=\"/favicon.ico\">\n";
        echo "</head>\n<body>\n";
        echo "<div class=\"min-h-screen bg-white\">\n";
        echo "<header class=\"border-b border-gray-200\">\n";
        echo "<div class=\"container mx-auto px-4\">\n";
        echo "<div class=\"py-4\">\n";
        echo "<nav class=\"flex flex-col md:flex-row md:items-center md:justify-between\">\n";
        echo "<div class=\"flex items-center justify-between\">\n";
        echo "<a href=\"/\" class=\"flex items-center space-x-2\">\n";
        echo "<img src=\"/logo.png\" alt=\"Applicants.IO Logo\" class=\"h-8 w-auto\">\n";
        echo "<span class=\"text-xl font-headline font-semibold\">Applicants.IO</span>\n";
        echo "</a>\n";
        echo "</div>\n";
        echo "<div class=\"hidden md:flex items-center space-x-6 mt-4 md:mt-0\">\n";
        echo "<a href=\"/\" class=\"text-gray-700 hover:text-blue-600\">Jobs</a>\n";
        echo "<a href=\"/employer-reviews\" class=\"bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors\">Employer Reviews</a>\n";
        echo "</div>\n";
        echo "</nav>\n";
        echo "</div>\n";
        echo "</div>\n";
        echo "</header>\n";
        echo "<main class=\"container mx-auto px-4 py-6\">\n";
        
        // Add JobPosting schema
        sx_schema_jobposting($job);
        
        // Add FAQ schema
        $faqSchema = $this->generateFAQSchema($job);
        if ($faqSchema) {
            sx_jsonld($faqSchema);
        }
        
        // Organization schema for E-E-A-T
        sx_jsonld([
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'Synaxus Inc.',
            'url' => 'https://synaxusinc.com',
            'logo' => 'https://synaxusinc.com/synaxus-logo.png',
            'sameAs' => [
                'https://www.linkedin.com/company/synaxus-inc',
                'https://g.co/kgs/EP6p5de'
            ],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => '5272 Summerlin Commons Way #601',
                'addressLocality' => 'Fort Myers',
                'addressRegion' => 'FL',
                'postalCode' => '33907',
                'addressCountry' => 'US'
            ],
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'contactType' => 'HR',
                'telephone' => '+1-941-564-9169',
                'email' => 'careers@synaxusinc.com'
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => '4.8',
                'reviewCount' => '25',
                'bestRating' => '5',
                'worstRating' => '1'
            ]
        ]);
        
        // Breadcrumb schema
        sx_jsonld([
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Home',
                    'item' => $this->site['siteUrl']
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => 'Synaxus Inc. Careers',
                    'item' => $this->site['siteUrl'] . '/employers/synaxus/'
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 3,
                    'name' => $job['title'],
                    'item' => $url
                ]
            ]
        ]);
        
        // Header
        echo "<div class=\"mb-6\">\n";
        echo "<h1 class=\"text-2xl font-headline font-medium\">" . htmlspecialchars($job['title']) . "</h1>\n";
        echo "<div class=\"mt-2 text-gray-500\">\n";
        echo "<span><strong>Synaxus Inc.</strong> — Verified Employer</span>\n";
        echo "<span class=\"mx-2\">•</span>\n";
        echo "<span>" . htmlspecialchars($locationStr) . "</span>\n";
        echo "</div>\n";
        echo "</div>\n";
        
        // Quick facts box (E-E-A-T signal)
        echo "<div class=\"bg-gray-50 p-4 rounded-lg mb-6\">\n";
        echo "<h2 class=\"text-lg font-headline font-medium mb-3\">Quick Facts</h2>\n";
        echo "<ul class=\"space-y-2\">\n";
        
        if (!empty($job['employmentType'])) {
            $empType = is_array($job['employmentType']) ? implode(', ', $job['employmentType']) : $job['employmentType'];
            echo "<li><strong>Employment Type:</strong> " . htmlspecialchars($empType) . "</li>\n";
        }
        
        if (!empty($job['jobLocationType'])) {
            echo "<li><strong>Work Setup:</strong> " . htmlspecialchars($job['jobLocationType']) . "</li>\n";
        }
        
        if (!empty($job['salary'])) {
            $salary = $job['salary'];
            $min = $salary['min'] ?? null;
            $max = $salary['max'] ?? null;
            $unit = strtolower($salary['unit'] ?? 'hour');
            
            if ($min !== null && $max !== null) {
                echo "<li><strong>Compensation:</strong> \${$min} - \${$max} per {$unit}</li>\n";
            } elseif ($min !== null) {
                echo "<li><strong>Compensation:</strong> \${$min}+ per {$unit}</li>\n";
            }
        }
        
        if (!empty($job['datePosted'])) {
            echo "<li><strong>Posted:</strong> " . htmlspecialchars($job['datePosted']) . "</li>\n";
        }
        
        if (!empty($job['validThrough'])) {
            echo "<li><strong>Apply by:</strong> " . htmlspecialchars($job['validThrough']) . "</li>\n";
        }
        
        echo "</ul>\n";
        echo "</div>\n";
        
        // About the role (enhanced with depth)
        echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
        echo "<h2 class=\"text-lg font-headline font-medium mb-2\">About the Role</h2>\n";
        echo "<p>" . htmlspecialchars($job['description']) . "</p>\n";
        echo "<p class=\"text-gray-600 leading-relaxed\">At Synaxus Inc., we're committed to providing our team members with opportunities for growth and advancement. Our team enjoys a collaborative environment where each member's contributions are valued and recognized. We've maintained strong partnerships with Fortune 500 brands for over a decade, providing stable and rewarding career opportunities throughout Southwest Florida.</p>\n";
        echo "</div>\n";
        
        // Detailed responsibilities
        if (!empty($job['responsibilities'])) {
            echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
            echo "<h2 class=\"text-lg font-headline font-medium mb-2\">Key Responsibilities</h2>\n";
            if (is_array($job['responsibilities'])) {
                echo "<ul class=\"list-disc list-inside space-y-1 text-gray-600\">\n";
                foreach ($job['responsibilities'] as $resp) {
                    echo "<li>" . htmlspecialchars($resp) . "</li>\n";
                }
                echo "</ul>\n";
            } else {
                echo "<p class=\"text-gray-600\">" . htmlspecialchars($job['responsibilities']) . "</p>\n";
            }
            echo "</div>\n";
        }
        
        // Qualifications
        if (!empty($job['qualifications']) && is_array($job['qualifications'])) {
            echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
            echo "<h2 class=\"text-lg font-headline font-medium mb-2\">Required Qualifications</h2>\n";
            echo "<ul class=\"list-disc list-inside space-y-1 text-gray-600\">\n";
            foreach ($job['qualifications'] as $qual) {
                echo "<li>" . htmlspecialchars($qual) . "</li>\n";
            }
            echo "</ul>\n";
            echo "<p class=\"mt-3 text-sm text-gray-500 italic\"><strong>Note:</strong> No prior experience required for entry-level positions. Comprehensive training and mentorship provided.</p>\n";
            echo "</div>\n";
        }
        
        // Skills
        if (!empty($job['skills'])) {
            echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
            echo "<h2 class=\"text-lg font-headline font-medium mb-2\">Required Skills</h2>\n";
            echo "<p class=\"text-gray-600\">" . htmlspecialchars($job['skills']) . "</p>\n";
            echo "</div>\n";
        }
        
        // Benefits (enhanced)
        if (!empty($job['jobBenefits']) && is_array($job['jobBenefits'])) {
            echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
            echo "<h2 class=\"text-lg font-headline font-medium mb-2\">Benefits & Perks</h2>\n";
            echo "<ul class=\"list-disc list-inside space-y-1 text-gray-600\">\n";
            foreach ($job['jobBenefits'] as $benefit) {
                echo "<li>" . htmlspecialchars($benefit) . "</li>\n";
            }
            echo "</ul>\n";
            echo "<p class=\"mt-3 text-gray-600\">Synaxus Inc. prides itself on offering competitive compensation packages with merit-based opportunities for advancement. Our team members benefit from flexible scheduling, comprehensive training programs, and access to exclusive professional development resources.</p>\n";
            echo "</div>\n";
        }
        
        // Application section
        echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
        echo "<h2 class=\"text-lg font-headline font-medium mb-2\">How to Apply</h2>\n";
        echo "<p class=\"text-gray-600 mb-4\">Ready to join the Synaxus Inc. team? Our application process is simple and straightforward:</p>\n";
        echo "<ol class=\"list-decimal list-inside space-y-2 text-gray-600 mb-4\">\n";
        echo "<li>Apply online through our careers page</li>\n";
        echo "<li>Receive a response within 24 hours</li>\n";
        echo "<li>Complete a friendly interview</li>\n";
        echo "<li>Begin your journey with comprehensive training</li>\n";
        echo "</ol>\n";
        echo "<div class=\"flex flex-wrap gap-3 mb-4\">\n";
        
        // Always link to the Synaxus general application page
        echo "<a href='https://synaxusinc.com/pages/apply-now' target='_blank' rel='noopener noreferrer' class='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block'>Apply Now on Synaxus Website</a>\n";
        
        if (!empty($job['contactEmail'])) {
            echo "<a href='mailto:" . htmlspecialchars($job['contactEmail']) . "' class='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors inline-block'>Email Resume</a>\n";
        }
        
        echo "</div>\n";
        
        if (!empty($job['contactPhone'])) {
            echo "<p class=\"text-gray-600\"><strong>Phone:</strong> <a href='tel:" . htmlspecialchars($job['contactPhone']) . "' class='text-blue-600 hover:underline'>" . htmlspecialchars($job['contactPhone']) . "</a></p>\n";
        }
        
        echo "</div>\n";
        
        // Company info (E-E-A-T enhanced)
        echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
        echo "<h2 class=\"text-lg font-headline font-medium mb-2\">About Synaxus Inc.</h2>\n";
        echo "<p class=\"text-gray-600 mb-4\"><strong>Synaxus Inc.</strong> is Southwest Florida's premier experiential marketing agency, serving the region since our founding. We specialize in connecting Fortune 500 brands with local communities through strategic experiential marketing campaigns.</p>\n";
        echo "<h3 class=\"text-md font-medium mb-2\">Why Work With Us?</h3>\n";
        echo "<ul class=\"list-disc list-inside space-y-1 text-gray-600 mb-4\">\n";
        echo "<li><strong>Established Reputation:</strong> Over a decade of experience in experiential marketing</li>\n";
        echo "<li><strong>Fortune 500 Partnerships:</strong> Work with nationally recognized brands</li>\n";
        echo "<li><strong>Career Growth:</strong> 31-68% promotion rate by month 6</li>\n";
        echo "<li><strong>Comprehensive Training:</strong> Professional development and mentorship programs</li>\n";
        echo "<li><strong>Competitive Compensation:</strong> Salary potential up to \$68,000 for full-time positions</li>\n";
        echo "<li><strong>Verified Employer:</strong> 4.8/5 rating from team members</li>\n";
        echo "</ul>\n";
        echo "<p class=\"text-gray-600 mb-2\"><strong>Headquarters:</strong> 5272 Summerlin Commons Way #601, Fort Myers, FL 33907</p>\n";
        echo "<p class=\"mb-4\"><a href='https://synaxusinc.com' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:underline'>Visit Synaxus Inc. Website</a> | <a href='https://www.linkedin.com/company/synaxus-inc' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:underline'>LinkedIn Profile</a></p>\n";
        echo "</div>\n";
        
        // E-E-A-T Trust signals
        echo "<div class=\"border-t border-gray-200 pt-6 mb-6\">\n";
        echo "<h2 class=\"text-lg font-headline font-medium mb-2\">Verified Information</h2>\n";
        echo "<ul class=\"list-disc list-inside space-y-1 text-gray-600\">\n";
        echo "<li>✓ Verified employer with established business operations</li>\n";
        echo "<li>✓ Licensed and insured in Florida</li>\n";
        echo "<li>✓ Direct contact information provided</li>\n";
        echo "<li>✓ Physical business address verified</li>\n";
        echo "<li>✓ Active corporate presence since founding</li>\n";
        echo "</ul>\n";
        echo "</div>\n";
        
        echo "</main>\n";
        echo "<footer class=\"border-t border-gray-200 mt-12 py-6\">\n";
        echo "<div class=\"container mx-auto px-4 text-center text-gray-600\">\n";
        echo "&copy; " . date('Y') . " Applicants.IO. All rights reserved.\n";
        echo "</div>\n";
        echo "</footer>\n";
        echo "</div>\n";
        echo "</body>\n</html>\n";
        
        return ob_get_clean();
    }
    
    public function generate(): void {
        if (!file_exists($this->jobsFile)) {
            throw new Exception("Jobs file not found: {$this->jobsFile}");
        }
        
        $data = json_decode(file_get_contents($this->jobsFile), true);
        $jobs = $data['jobs'] ?? [];
        
        echo "Generating enhanced pages for " . count($jobs) . " Synaxus jobs...\n";
        
        if (!is_dir($this->outputDir)) {
            mkdir($this->outputDir, 0777, true);
        }
        
        $generated = [];
        
        foreach ($jobs as $job) {
            $slug = $this->generateJobSlug($job);
            $html = $this->renderJobPage($job, $slug);
            
            $outputFile = $this->outputDir . '/' . $slug . '.php';
            file_put_contents($outputFile, $html);
            
            $generated[] = [
                'slug' => $slug,
                'title' => $job['title'],
                'url' => $this->site['siteUrl'] . '/employers/synaxus/' . $slug
            ];
            
            echo "Generated: {$slug}.php\n";
        }
        
        $this->createIndexFile($generated);
        
        echo "\nSuccessfully generated " . count($generated) . " enhanced job pages!\n";
        echo "\nE-E-A-T Features Added:\n";
        echo "  ✓ Experience signals (company history, years in business)\n";
        echo "  ✓ Expertise indicators (Fortune 500 partnerships, industry credentials)\n";
        echo "  ✓ Authoritativeness (verified employer, third-party recognition)\n";
        echo "  ✓ Trustworthiness (contact info, physical address, licenses)\n";
        echo "\nSEO Enhancements:\n";
        echo "  ✓ Rich meta tags (title, description, keywords)\n";
        echo "  ✓ Open Graph tags\n";
        echo "  ✓ Twitter Card tags\n";
        echo "  ✓ Enhanced schema markup\n";
        echo "  ✓ Breadcrumb navigation\n";
        echo "  ✓ Content depth increased\n";
    }
    
    private function createIndexFile(array $jobs): void {
        ob_start();
        
        sx_head(
            'Synaxus Inc. Careers — ' . $this->site['siteName'],
            'Join Synaxus Inc., Southwest Florida\'s premier experiential marketing agency. Work with Fortune 500 brands in Fort Myers, Naples, Cape Coral, and more.',
            $this->site['siteUrl'] . '/employers/synaxus/'
        );
        
        echo "<header><h1>Synaxus Inc. Career Opportunities</h1></header>";
        echo "<section class='intro'>";
        echo "<p>Synaxus Inc. is Southwest Florida's premier experiential marketing agency, established for over a decade. We partner with Fortune 500 brands to deliver exceptional customer experiences across the region.</p>";
        echo "</section>";
        echo "<section class='job-listings'>";
        echo "<h2>Current Openings</h2>";
        echo "<ul class='job-links'>";
        
        foreach ($jobs as $job) {
            echo "<li><a href='/{$job['slug']}.php'>{$job['title']}</a></li>";
        }
        
        echo "</ul>";
        echo "</section>";
        
        sx_foot();
        
        file_put_contents($this->outputDir . '/index.php', ob_get_clean());
        echo "Generated index.php\n";
    }
}

if (php_sapi_name() === 'cli') {
    try {
        $generator = new EnhancedSynaxusPageGenerator();
        $generator->generate();
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}
