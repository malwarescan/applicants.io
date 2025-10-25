#!/usr/bin/env php
<?php
/**
 * Generate Individual Synaxus Job Pages
 * 
 * Creates SEO-friendly PHP pages for each Synaxus job with:
 * - Proper JobPosting schema
 * - FAQ schema
 * - Clean URLs based on job title and location
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/schema_core.php';
require_once __DIR__ . '/../includes/schema_jobposting.php';

class SynaxusJobPageGenerator {
    private $jobsFile;
    private $outputDir;
    private $site;
    
    public function __construct() {
        $this->jobsFile = __DIR__ . '/../data/synaxus_jobs.json';
        $this->outputDir = __DIR__ . '/../employers/synaxus';
        $this->site = require __DIR__ . '/../config/site.php';
    }
    
    /**
     * Generate SEO-friendly URL slug from text
     */
    private function generateSlug(string $text): string {
        $slug = strtolower($text);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');
        return $slug;
    }
    
    /**
     * Generate URL slug for a job
     */
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
     * Generate FAQ schema for a job
     */
    private function generateFAQSchema(array $job): array {
        $faqs = [];
        
        // Employment type FAQ
        $empType = is_array($job['employmentType']) ? $job['employmentType'][0] : $job['employmentType'];
        $empTypeFormatted = str_replace('_', ' ', strtolower($empType));
        
        $faqs[] = [
            '@type' => 'Question',
            'name' => "Is this a {$empTypeFormatted} position?",
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => "Yes, this is a {$empTypeFormatted} position at Synaxus Inc."
            ]
        ];
        
        // Location FAQ
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
                        'text' => "This position is located in {$location}."
                    ]
                ];
            }
        }
        
        // Salary FAQ
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
                        'text' => "The salary range for this position is \${$min} - \${$max} per {$unit}."
                    ]
                ];
            }
        }
        
        // Application FAQ
        $faqs[] = [
            '@type' => 'Question',
            'name' => "How do I apply for this position?",
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => "You can apply directly on the Synaxus Inc. website. Click the 'Apply Now' button or email your resume to careers@synaxusinc.com."
            ]
        ];
        
        // Qualification FAQ
        if (!empty($job['qualifications']) && is_array($job['qualifications'])) {
            $qualCount = count($job['qualifications']);
            $faqs[] = [
                '@type' => 'Question',
                'name' => "What qualifications are required?",
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => "This position requires: " . implode(', ', array_slice($job['qualifications'], 0, 3)) . "."
                ]
            ];
        }
        
        // Benefits FAQ
        if (!empty($job['jobBenefits']) && is_array($job['jobBenefits'])) {
            $benefits = implode(', ', array_slice($job['jobBenefits'], 0, 3));
            $faqs[] = [
                '@type' => 'Question',
                'name' => "What benefits are offered?",
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => "Benefits include: {$benefits}."
                ]
            ];
        }
        
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
     * Render a complete job page
     */
    private function renderJobPage(array $job, string $slug): string {
        ob_start();
        
        $url = $this->site['siteUrl'] . '/employers/synaxus/' . $slug;
        $title = $job['title'] . ' at Synaxus Inc. — ' . $this->site['siteName'];
        $description = substr($job['description'], 0, 155) . '...';
        
        // Render page head
        sx_head($title, $description, $url);
        
        // Add JobPosting schema
        sx_schema_jobposting($job);
        
        // Add FAQ schema
        $faqSchema = $this->generateFAQSchema($job);
        if ($faqSchema) {
            sx_jsonld($faqSchema);
        }
        
        // Render visible content
        echo "<header><h1>" . sx_h($job['title']) . "</h1>";
        echo "<p class='subtitle'>Synaxus Inc.</p></header>";
        
        // Job details section
        echo "<section class='job-details'>";
        echo "<h2>Job Details</h2>";
        echo "<ul>";
        
        if (!empty($job['jobLocation'])) {
            $loc = $job['jobLocation'][0] ?? [];
            $location = implode(', ', array_filter([$loc['city'] ?? '', $loc['region'] ?? '']));
            if ($location) {
                echo "<li><strong>Location:</strong> " . sx_h($location) . "</li>";
            }
        }
        
        if (!empty($job['employmentType'])) {
            $empType = is_array($job['employmentType']) ? implode(', ', $job['employmentType']) : $job['employmentType'];
            echo "<li><strong>Employment Type:</strong> " . sx_h($empType) . "</li>";
        }
        
        if (!empty($job['jobLocationType'])) {
            echo "<li><strong>Work Setup:</strong> " . sx_h($job['jobLocationType']) . "</li>";
        }
        
        if (!empty($job['salary'])) {
            $salary = $job['salary'];
            $min = $salary['min'] ?? null;
            $max = $salary['max'] ?? null;
            $unit = strtolower($salary['unit'] ?? 'hour');
            
            if ($min !== null && $max !== null) {
                echo "<li><strong>Compensation:</strong> \${$min} - \${$max} per {$unit}</li>";
            } elseif ($min !== null) {
                echo "<li><strong>Compensation:</strong> \${$min}+ per {$unit}</li>";
            }
        }
        
        if (!empty($job['datePosted'])) {
            echo "<li><strong>Posted:</strong> " . sx_h($job['datePosted']) . "</li>";
        }
        
        if (!empty($job['validThrough'])) {
            echo "<li><strong>Apply by:</strong> " . sx_h($job['validThrough']) . "</li>";
        }
        
        echo "</ul>";
        echo "</section>";
        
        // Description section
        echo "<section class='job-description'>";
        echo "<h2>About the Role</h2>";
        echo "<p>" . sx_h($job['description']) . "</p>";
        echo "</section>";
        
        // Responsibilities section
        if (!empty($job['responsibilities'])) {
            echo "<section class='responsibilities'>";
            echo "<h2>Responsibilities</h2>";
            if (is_array($job['responsibilities'])) {
                echo "<ul>";
                foreach ($job['responsibilities'] as $resp) {
                    echo "<li>" . sx_h($resp) . "</li>";
                }
                echo "</ul>";
            } else {
                echo "<p>" . sx_h($job['responsibilities']) . "</p>";
            }
            echo "</section>";
        }
        
        // Qualifications section
        if (!empty($job['qualifications']) && is_array($job['qualifications'])) {
            echo "<section class='qualifications'>";
            echo "<h2>Qualifications</h2>";
            echo "<ul>";
            foreach ($job['qualifications'] as $qual) {
                echo "<li>" . sx_h($qual) . "</li>";
            }
            echo "</ul>";
            echo "</section>";
        }
        
        // Skills section
        if (!empty($job['skills'])) {
            echo "<section class='skills'>";
            echo "<h2>Required Skills</h2>";
            echo "<p>" . sx_h($job['skills']) . "</p>";
            echo "</section>";
        }
        
        // Benefits section
        if (!empty($job['jobBenefits']) && is_array($job['jobBenefits'])) {
            echo "<section class='benefits'>";
            echo "<h2>Benefits</h2>";
            echo "<ul>";
            foreach ($job['jobBenefits'] as $benefit) {
                echo "<li>" . sx_h($benefit) . "</li>";
            }
            echo "</ul>";
            echo "</section>";
        }
        
        // Application section
        echo "<section class='application'>";
        echo "<h2>How to Apply</h2>";
        echo "<p>To apply for this position with Synaxus Inc., please use one of the following methods:</p>";
        echo "<div class='apply-buttons'>";
        
        if (!empty($job['url'])) {
            echo "<a href='" . htmlspecialchars($job['url']) . "' target='_blank' rel='noopener noreferrer' class='btn btn-primary'>Apply on Synaxus Website</a>";
        }
        
        if (!empty($job['contactEmail'])) {
            echo "<a href='mailto:" . htmlspecialchars($job['contactEmail']) . "' class='btn btn-secondary'>Email Resume</a>";
        }
        
        echo "</div>";
        
        if (!empty($job['contactPhone'])) {
            echo "<p><strong>Phone:</strong> " . sx_h($job['contactPhone']) . "</p>";
        }
        
        echo "</section>";
        
        // Company info section
        echo "<section class='company-info'>";
        echo "<h2>About Synaxus Inc.</h2>";
        echo "<p>Synaxus Inc. is Southwest Florida's premier experiential marketing agency, working with Fortune 500 brands to deliver exceptional customer experiences.</p>";
        echo "<p><a href='https://synaxusinc.com' target='_blank' rel='noopener noreferrer'>Visit Synaxus Inc. Website</a></p>";
        echo "</section>";
        
        sx_foot();
        
        return ob_get_clean();
    }
    
    /**
     * Generate all job pages
     */
    public function generate(): void {
        if (!file_exists($this->jobsFile)) {
            throw new Exception("Jobs file not found: {$this->jobsFile}");
        }
        
        $data = json_decode(file_get_contents($this->jobsFile), true);
        $jobs = $data['jobs'] ?? [];
        
        echo "Generating pages for " . count($jobs) . " Synaxus jobs...\n";
        
        // Create output directory
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
        
        // Create index file listing all jobs
        $this->createIndexFile($generated);
        
        echo "\nSuccessfully generated " . count($generated) . " job pages!\n";
        echo "\nGenerated URLs:\n";
        foreach ($generated as $job) {
            echo "  - {$job['url']}\n";
        }
    }
    
    /**
     * Create index file listing all jobs
     */
    private function createIndexFile(array $jobs): void {
        ob_start();
        
        sx_head(
            'Synaxus Inc. Careers — ' . $this->site['siteName'],
            'View all available positions at Synaxus Inc.',
            $this->site['siteUrl'] . '/employers/synaxus/'
        );
        
        echo "<header><h1>Synaxus Inc. Career Opportunities</h1></header>";
        echo "<section class='job-listings'>";
        echo "<p>Synaxus Inc. is seeking talented individuals to join our team. Browse our current openings below:</p>";
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

// Run generator
if (php_sapi_name() === 'cli') {
    try {
        $generator = new SynaxusJobPageGenerator();
        $generator->generate();
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}
