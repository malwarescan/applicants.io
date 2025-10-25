#!/usr/bin/env php
<?php
/**
 * Synaxus Jobs Scraper
 * 
 * Scrapes JobPosting schema data from synaxusinc.com/careers
 * Since synaxusinc.com already implements JobPosting schema, we extract
 * the JSON-LD structured data for maximum accuracy.
 * 
 * USAGE: php scripts/scrape-synaxus-jobs.php [--save]
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/schema_core.php';

class SynaxusJobsScraper {
    private const CAREERS_URL = 'https://synaxusinc.com/careers';
    private const OUTPUT_FILE = __DIR__ . '/../data/synaxus_jobs.json';
    
    /**
     * Fetch HTML from Synaxus careers page
     */
    private function fetchHTML(): string {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => self::CAREERS_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => 'Applicants.IO Job Scraper/1.0',
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        
        $html = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Failed to fetch careers page. HTTP {$httpCode}");
        }
        
        return $html;
    }
    
    /**
     * Extract all JSON-LD script tags from HTML
     */
    private function extractJSONLD(string $html): array {
        $jsonLdArray = [];
        
        // Match all <script type="application/ld+json">...</script> tags
        preg_match_all(
            '/<script\s+type=["\']application\/ld\+json["\']\s*>(.*?)<\/script>/is',
            $html,
            $matches
        );
        
        foreach ($matches[1] as $jsonString) {
            $json = json_decode(trim($jsonString), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $jsonLdArray[] = $json;
            }
        }
        
        return $jsonLdArray;
    }
    
    /**
     * Extract JobPosting objects from JSON-LD array
     */
    private function extractJobPostings(array $jsonLdArray): array {
        $jobPostings = [];
        
        foreach ($jsonLdArray as $json) {
            // Handle @graph structure
            if (isset($json['@graph']) && is_array($json['@graph'])) {
                foreach ($json['@graph'] as $item) {
                    if (isset($item['@type']) && $item['@type'] === 'JobPosting') {
                        $jobPostings[] = $item;
                    }
                }
            }
            
            // Handle direct JobPosting objects
            if (isset($json['@type']) && $json['@type'] === 'JobPosting') {
                $jobPostings[] = $json;
            }
            
            // Handle ItemList containing JobPostings
            if (isset($json['mainEntity']['@type']) && $json['mainEntity']['@type'] === 'ItemList') {
                $items = $json['mainEntity']['itemListElement'] ?? [];
                foreach ($items as $listItem) {
                    if (isset($listItem['item']['@type']) && $listItem['item']['@type'] === 'JobPosting') {
                        $jobPostings[] = $listItem['item'];
                    }
                }
            }
        }
        
        return $jobPostings;
    }
    
    /**
     * Transform Synaxus JobPosting to our internal format
     */
    private function transformJobPosting(array $synaxusJob): array {
        // Extract location information
        $location = $synaxusJob['jobLocation']['address'] ?? [];
        $city = $location['addressLocality'] ?? '';
        $region = $location['addressRegion'] ?? '';
        $country = $location['addressCountry'] ?? 'US';
        
        // Extract salary information
        $salary = null;
        if (isset($synaxusJob['baseSalary'])) {
            $baseSalary = $synaxusJob['baseSalary'];
            $value = $baseSalary['value'] ?? [];
            
            $salary = [
                'currency' => $baseSalary['currency'] ?? 'USD',
                'min' => $value['minValue'] ?? null,
                'max' => $value['maxValue'] ?? null,
                'unit' => $value['unitText'] ?? 'HOUR'
            ];
        }
        
        // Extract employment type
        $employmentType = $synaxusJob['employmentType'] ?? 'FULL_TIME';
        if (is_string($employmentType)) {
            $employmentType = [$employmentType];
        }
        
        // Extract organization info
        $org = $synaxusJob['hiringOrganization'] ?? [];
        
        // Build job location array
        $jobLocation = [];
        if ($city || $region) {
            $jobLocation[] = [
                'city' => $city,
                'region' => $region,
                'country' => $country
            ];
        }
        
        // Extract contact information
        $contactEmail = $synaxusJob['applicationContact']['email'] ?? 'careers@synaxusinc.com';
        $contactPhone = $synaxusJob['applicationContact']['telephone'] ?? null;
        
        // Calculate valid through date (default to 90 days from now if not specified)
        $validThrough = $synaxusJob['validThrough'] ?? null;
        if (!$validThrough) {
            $date = new DateTime();
            $date->modify('+90 days');
            $validThrough = $date->format('Y-m-d\TH:i:sP');
        }
        
        // Build our internal job format
        $job = [
            'title' => $synaxusJob['title'] ?? 'Position Available',
            'description' => $synaxusJob['description'] ?? '',
            'datePosted' => $synaxusJob['datePosted'] ?? date('Y-m-d'),
            'validThrough' => $validThrough,
            'employmentType' => $employmentType,
            'directApply' => isset($synaxusJob['potentialAction']),
            'jobLocationType' => $synaxusJob['jobLocationType'] ?? 'ON_SITE',
            'applicantLocationRequirements' => [
                ['@type' => 'Country', 'name' => $synaxusJob['applicantLocationRequirements']['name'] ?? 'United States']
            ],
            'jobLocation' => $jobLocation,
            'salary' => $salary,
            'identifier' => [
                'name' => 'Synaxus Inc.',
                'value' => $synaxusJob['identifier']['value'] ?? uniqid('synaxus-')
            ],
            'hiringOrganization' => [
                'name' => $org['name'] ?? 'Synaxus Inc.',
                'sameAs' => $org['sameAs'] ?? 'https://synaxusinc.com',
                'logo' => $org['logo'] ?? 'https://synaxusinc.com/synaxus-logo.png'
            ],
            'url' => $synaxusJob['url'] ?? '',
            'contactEmail' => $contactEmail,
            'contactPhone' => $contactPhone,
            'industry' => $synaxusJob['industry'] ?? 'Marketing Services',
            'skills' => $synaxusJob['skills'] ?? null,
            'responsibilities' => $synaxusJob['responsibilities'] ?? null,
            'jobBenefits' => $synaxusJob['jobBenefits'] ?? null,
            'qualifications' => $synaxusJob['qualifications'] ?? null,
        ];
        
        return $job;
    }
    
    /**
     * Main scraping method
     */
    public function scrape(): array {
        echo "Fetching Synaxus careers page...\n";
        $html = $this->fetchHTML();
        
        echo "Extracting JSON-LD data...\n";
        $jsonLdArray = $this->extractJSONLD($html);
        
        echo "Extracting JobPosting objects...\n";
        $jobPostings = $this->extractJobPostings($jsonLdArray);
        
        echo "Found " . count($jobPostings) . " job postings\n";
        
        echo "Transforming to internal format...\n";
        $transformedJobs = [];
        foreach ($jobPostings as $jobPosting) {
            $transformedJobs[] = $this->transformJobPosting($jobPosting);
        }
        
        return $transformedJobs;
    }
    
    /**
     * Save jobs to JSON file
     */
    public function saveJobs(array $jobs): void {
        $data = [
            'meta' => [
                'lastUpdated' => date('c'),
                'source' => 'synaxusinc.com',
                'totalJobs' => count($jobs)
            ],
            'jobs' => $jobs
        ];
        
        file_put_contents(self::OUTPUT_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        echo "Saved " . count($jobs) . " jobs to " . self::OUTPUT_FILE . "\n";
    }
}

// Main execution
if (php_sapi_name() === 'cli') {
    try {
        $scraper = new SynaxusJobsScraper();
        $jobs = $scraper->scrape();
        
        // If --save flag is provided, save to file
        if (in_array('--save', $argv)) {
            $scraper->saveJobs($jobs);
        } else {
            // Otherwise, just output the jobs
            echo "\nJob Postings:\n";
            echo json_encode($jobs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
        }
        
        echo "\nScraping completed successfully!\n";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}
