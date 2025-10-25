<?php
/**
 * Synaxus Jobs Transformer
 * 
 * Transforms Synaxus JobPosting schema data to our internal job format
 * for use in generating static pages and API responses
 */

declare(strict_types=1);

class SynaxusJobsTransformer {
    
    /**
     * Transform a Synaxus JobPosting to our EnhancedJob format
     */
    public static function transformToEnhancedJob(array $synaxusJob): array {
        // Extract location information
        $location = $synaxusJob['jobLocation']['address'] ?? [];
        $city = $location['addressLocality'] ?? '';
        $region = $location['addressRegion'] ?? '';
        $country = $location['addressCountry'] ?? 'US';
        
        // Build location string
        $locationParts = array_filter([$city, $region]);
        $locationString = implode(', ', $locationParts);
        if (!$locationString) {
            $locationString = 'See job posting';
        }
        
        // Extract salary information
        $compensation = null;
        if (isset($synaxusJob['baseSalary'])) {
            $baseSalary = $synaxusJob['baseSalary'];
            $value = $baseSalary['value'] ?? [];
            
            $min = $value['minValue'] ?? null;
            $max = $value['maxValue'] ?? null;
            $unit = $value['unitText'] ?? 'HOUR';
            $currency = $baseSalary['currency'] ?? 'USD';
            
            if ($min !== null && $max !== null) {
                $compensation = "$" . number_format($min) . " - $" . number_format($max) . " per " . strtolower($unit);
            } elseif ($min !== null) {
                $compensation = "$" . number_format($min) . "+ per " . strtolower($unit);
            }
        }
        
        // Extract employment type
        $employmentType = $synaxusJob['employmentType'] ?? 'FULL_TIME';
        if (is_string($employmentType)) {
            $employmentType = strtolower(str_replace('_', '-', $employmentType));
        }
        
        // Extract organization info
        $org = $synaxusJob['hiringOrganization'] ?? [];
        
        // Extract contact information
        $contactEmail = $synaxusJob['applicationContact']['email'] ?? 'careers@synaxusinc.com';
        $contactPhone = $synaxusJob['applicationContact']['telephone'] ?? null;
        
        // Parse ID from URL or identifier
        $jobId = null;
        if (isset($synaxusJob['identifier']['value'])) {
            $jobId = 'synaxus-' . $synaxusJob['identifier']['value'];
        } elseif (isset($synaxusJob['url'])) {
            $parts = explode('/', trim($synaxusJob['url'], '/'));
            $jobId = 'synaxus-' . end($parts);
        }
        
        if (!$jobId) {
            $jobId = 'synaxus-' . uniqid();
        }
        
        // Build our enhanced job format
        $job = [
            'id' => $jobId,
            'title' => $synaxusJob['title'] ?? 'Position Available',
            'company' => $org['name'] ?? 'Synaxus Inc.',
            'location' => $locationString,
            'industry' => $synaxusJob['industry'] ?? 'Marketing Services',
            'postedDate' => $synaxusJob['datePosted'] ?? date('Y-m-d'),
            'compensation' => $compensation,
            'description' => $synaxusJob['description'] ?? '',
            'contactEmail' => $contactEmail,
            'contactPhone' => $contactPhone,
            'remote' => ($synaxusJob['jobLocationType'] ?? '') === 'TELECOMMUTE',
            'employmentType' => $employmentType,
            'applyUrl' => $synaxusJob['url'] ?? '',
            'isActive' => true,
            'createdAt' => $synaxusJob['datePosted'] ?? date('c'),
            'source' => 'Synaxus Inc.',
            'sourceUrl' => $synaxusJob['url'] ?? '',
            'responsibilities' => is_string($synaxusJob['responsibilities'] ?? null) 
                ? explode(', ', $synaxusJob['responsibilities']) 
                : ($synaxusJob['responsibilities'] ?? []),
            'requirements' => $synaxusJob['qualifications'] ?? [],
            'jobBenefits' => $synaxusJob['jobBenefits'] ?? [],
            'skills' => is_string($synaxusJob['skills'] ?? null)
                ? explode(', ', $synaxusJob['skills'])
                : ($synaxusJob['skills'] ?? []),
        ];
        
        // Add salary range if available
        if (isset($synaxusJob['baseSalary'])) {
            $baseSalary = $synaxusJob['baseSalary'];
            $value = $baseSalary['value'] ?? [];
            
            if (isset($value['minValue'])) {
                $job['salaryMin'] = (float)$value['minValue'];
            }
            if (isset($value['maxValue'])) {
                $job['salaryMax'] = (float)$value['maxValue'];
            }
            $job['currency'] = $baseSalary['currency'] ?? 'USD';
        }
        
        return $job;
    }
    
    /**
     * Transform multiple Synaxus JobPostings
     */
    public static function transformMultiple(array $synaxusJobs): array {
        return array_map([self::class, 'transformToEnhancedJob'], $synaxusJobs);
    }
    
    /**
     * Load and transform Synaxus jobs from JSON file
     */
    public static function loadFromFile(string $filePath): array {
        if (!file_exists($filePath)) {
            return [];
        }
        
        $data = json_decode(file_get_contents($filePath), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [];
        }
        
        $jobs = $data['jobs'] ?? [];
        return self::transformMultiple($jobs);
    }
}
