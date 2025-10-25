<?php
/**
 * Synaxus Job Renderer
 * 
 * Renders individual job detail pages with proper JobPosting schema
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/schema_core.php';
require_once __DIR__ . '/../../includes/schema_jobposting.php';

class SynaxusJobRenderer {
    
    /**
     * Render a job detail page with schema
     */
    public static function render(array $job, array $site): string {
        ob_start();
        
        // Generate page head with schema
        sx_head(
            $job['title'] . ' — ' . $site['siteName'],
            $job['description'],
            $site['siteUrl'] . '/jobs/synaxus/' . ($job['identifier']['value'] ?? 'unknown')
        );
        
        // Output the JobPosting schema
        sx_schema_jobposting($job);
        
        // Render visible job content
        sx_render_job_visible($job);
        
        // Additional job details
        echo "<section><h2>How to Apply</h2>";
        echo "<p>To apply for this position, please visit our careers page:</p>";
        echo "<p><a href=\"" . htmlspecialchars($job['url']) . "\" target=\"_blank\" rel=\"noopener noreferrer\">Apply on Synaxus Inc. Website</a></p>";
        
        if (!empty($job['contactEmail'])) {
            echo "<p>Email: <a href=\"mailto:" . htmlspecialchars($job['contactEmail']) . "\">" . htmlspecialchars($job['contactEmail']) . "</a></p>";
        }
        
        if (!empty($job['contactPhone'])) {
            echo "<p>Phone: " . htmlspecialchars($job['contactPhone']) . "</p>";
        }
        echo "</section>";
        
        // Skills section
        if (!empty($job['skills'])) {
            echo "<section><h2>Required Skills</h2>";
            echo "<p>" . htmlspecialchars($job['skills']) . "</p>";
            echo "</section>";
        }
        
        // Responsibilities section
        if (!empty($job['responsibilities'])) {
            echo "<section><h2>Responsibilities</h2>";
            echo "<p>" . htmlspecialchars($job['responsibilities']) . "</p>";
            echo "</section>";
        }
        
        // Qualifications section
        if (!empty($job['qualifications']) && is_array($job['qualifications'])) {
            echo "<section><h2>Qualifications</h2>";
            echo "<ul>";
            foreach ($job['qualifications'] as $qual) {
                echo "<li>" . htmlspecialchars($qual) . "</li>";
            }
            echo "</ul>";
            echo "</section>";
        }
        
        // Benefits section
        if (!empty($job['jobBenefits']) && is_array($job['jobBenefits'])) {
            echo "<section><h2>Benefits</h2>";
            echo "<ul>";
            foreach ($job['jobBenefits'] as $benefit) {
                echo "<li>" . htmlspecialchars($benefit) . "</li>";
            }
            echo "</ul>";
            echo "</section>";
        }
        
        sx_foot();
        
        return ob_get_clean();
    }
    
    /**
     * Generate all Synaxus job pages
     */
    public static function generateAll(string $outputDir, array $site): void {
        $jobsFile = __DIR__ . '/../../data/synaxus_jobs.json';
        
        if (!file_exists($jobsFile)) {
            throw new Exception("Synaxus jobs file not found. Run the scraper first.");
        }
        
        $data = json_decode(file_get_contents($jobsFile), true);
        $jobs = $data['jobs'] ?? [];
        
        // Create output directory
        $synaxusJobsDir = $outputDir . '/jobs/synaxus';
        if (!is_dir($synaxusJobsDir)) {
            mkdir($synaxusJobsDir, 0777, true);
        }
        
        foreach ($jobs as $job) {
            $jobId = $job['identifier']['value'] ?? 'unknown';
            $html = self::render($job, $site);
            
            $jobDir = $synaxusJobsDir . '/' . $jobId;
            if (!is_dir($jobDir)) {
                mkdir($jobDir, 0777, true);
            }
            
            file_put_contents($jobDir . '/index.html', $html);
            echo "Generated job page: {$jobId}\n";
        }
        
        echo "Generated " . count($jobs) . " Synaxus job pages\n";
    }
}
