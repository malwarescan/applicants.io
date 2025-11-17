<?php
/**
 * Unified JobPosting Schema Generator
 * 
 * Google Jobs Compliant - All fields must match visible content
 * 
 * This function generates compliant JobPosting JSON-LD schema
 * that matches Google's requirements for job posting eligibility.
 * 
 * CRITICAL RULES:
 * 1. All schema fields MUST be visible on the page
 * 2. validThrough must be in the future (ISO 8601 format)
 * 3. At least one application method required (email, phone, or url)
 * 4. hiringOrganization must be a real, verifiable company
 * 5. jobLocation must be accurate and specific
 * 6. baseSalary must match visible salary information
 * 
 * @param array $job Job data array with all required fields
 * @return array JSON-LD schema array ready for json_encode
 */
function generate_jobposting_schema(array $job): array {
    // Validate required fields
    $required = ['title', 'description', 'datePosted', 'hiringOrganization', 'jobLocation'];
    foreach ($required as $field) {
        if (empty($job[$field])) {
            throw new InvalidArgumentException("Missing required field: $field");
        }
    }

    // Validate validThrough is in the future
    if (!empty($job['validThrough'])) {
        $validThrough = new DateTime($job['validThrough']);
        $now = new DateTime();
        if ($validThrough <= $now) {
            throw new InvalidArgumentException("validThrough must be in the future");
        }
    }

    // Validate at least one application method
    $appContact = $job['applicationContact'] ?? [];
    if (empty($appContact['email']) && empty($appContact['phone']) && empty($appContact['url'])) {
        throw new InvalidArgumentException("At least one application method required (email, phone, or url)");
    }

    // Build base schema
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'JobPosting',
        'title' => (string)$job['title'],
        'description' => strip_tags((string)$job['description']), // Plain text for schema
        'datePosted' => (string)$job['datePosted'],
    ];

    // Hiring Organization (REQUIRED)
    $org = $job['hiringOrganization'];
    $schema['hiringOrganization'] = [
        '@type' => 'Organization',
        'name' => (string)$org['name'],
    ];
    
    if (!empty($org['sameAs'])) {
        $schema['hiringOrganization']['sameAs'] = (string)$org['sameAs'];
    }
    
    if (!empty($org['logo'])) {
        $schema['hiringOrganization']['logo'] = (string)$org['logo'];
    }

    // Employment Type (REQUIRED for Google Jobs)
    $empTypes = $job['employmentType'] ?? [];
    if (is_string($empTypes)) {
        $empTypes = [$empTypes];
    }
    if (!empty($empTypes)) {
        $schema['employmentType'] = $empTypes;
    }

    // Job Location (REQUIRED)
    $jobLocations = [];
    foreach ($job['jobLocation'] as $loc) {
        $address = [
            '@type' => 'PostalAddress',
        ];
        
        if (!empty($loc['city'])) {
            $address['addressLocality'] = (string)$loc['city'];
        }
        if (!empty($loc['region'])) {
            $address['addressRegion'] = (string)$loc['region'];
        }
        if (!empty($loc['country'])) {
            $address['addressCountry'] = (string)$loc['country'];
        }
        if (!empty($loc['postalCode'])) {
            $address['postalCode'] = (string)$loc['postalCode'];
        }
        if (!empty($loc['streetAddress'])) {
            $address['streetAddress'] = (string)$loc['streetAddress'];
        }

        $jobLocations[] = [
            '@type' => 'Place',
            'address' => $address,
        ];
    }
    $schema['jobLocation'] = $jobLocations;

    // Job Location Type (RECOMMENDED)
    if (!empty($job['jobLocationType'])) {
        $validTypes = ['ON_SITE', 'REMOTE', 'HYBRID'];
        if (in_array($job['jobLocationType'], $validTypes)) {
            $schema['jobLocationType'] = $job['jobLocationType'];
        }
    }

    // Applicant Location Requirements (if remote/hybrid)
    if (!empty($job['applicantLocationRequirements'])) {
        $schema['applicantLocationRequirements'] = $job['applicantLocationRequirements'];
    }

    // Base Salary (RECOMMENDED - improves visibility)
    if (!empty($job['baseSalary'])) {
        $salary = $job['baseSalary'];
        $baseSalary = [
            '@type' => 'MonetaryAmount',
            'currency' => (string)($salary['currency'] ?? 'USD'),
            'value' => [
                '@type' => 'QuantitativeValue',
            ],
        ];

        $unit = $salary['unitText'] ?? 'YEAR';
        $validUnits = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'];
        if (in_array(strtoupper($unit), $validUnits)) {
            $baseSalary['value']['unitText'] = strtoupper($unit);
        }

        if (isset($salary['minValue'])) {
            $baseSalary['value']['minValue'] = (float)$salary['minValue'];
        }
        if (isset($salary['maxValue'])) {
            $baseSalary['value']['maxValue'] = (float)$salary['maxValue'];
        }
        if (isset($salary['value'])) {
            $baseSalary['value']['value'] = (float)$salary['value'];
        }

        $schema['baseSalary'] = $baseSalary;
    }

    // Valid Through (REQUIRED for expiration)
    if (!empty($job['validThrough'])) {
        $schema['validThrough'] = (string)$job['validThrough'];
    }

    // Identifier (RECOMMENDED - unique job ID)
    if (!empty($job['identifier'])) {
        $schema['identifier'] = [
            '@type' => 'PropertyValue',
            'name' => (string)($job['identifier']['name'] ?? 'Applicants.io'),
            'value' => (string)$job['identifier']['value'],
        ];
    }

    // Application Contact (REQUIRED - at least one method)
    $appContact = $job['applicationContact'] ?? [];
    $contactPoints = [];

    if (!empty($appContact['email'])) {
        $contactPoints[] = [
            '@type' => 'ContactPoint',
            'contactType' => 'HR',
            'email' => (string)$appContact['email'],
        ];
    }

    if (!empty($appContact['phone'])) {
        $contactPoints[] = [
            '@type' => 'ContactPoint',
            'contactType' => 'HR',
            'telephone' => (string)$appContact['phone'],
        ];
    }

    if (!empty($appContact['url'])) {
        $schema['jobLocation'] = $schema['jobLocation'] ?? [];
        // Add application URL
        $schema['applicationContact'] = [
            '@type' => 'ContactPoint',
            'contactType' => 'HR',
            'url' => (string)$appContact['url'],
        ];
    }

    if (!empty($contactPoints)) {
        $schema['applicationContact'] = $contactPoints[0]; // Use first contact method
        if (count($contactPoints) > 1) {
            // If multiple, use the one with URL if available, otherwise first
            foreach ($contactPoints as $cp) {
                if (!empty($cp['url'])) {
                    $schema['applicationContact'] = $cp;
                    break;
                }
            }
        }
    }

    // Direct Apply (if applicable)
    if (isset($job['directApply'])) {
        $schema['directApply'] = (bool)$job['directApply'];
    }

    // Qualifications (RECOMMENDED)
    if (!empty($job['qualifications'])) {
        $schema['qualifications'] = strip_tags((string)$job['qualifications']);
    }

    // Skills (RECOMMENDED)
    if (!empty($job['skills'])) {
        $schema['skills'] = strip_tags((string)$job['skills']);
    }

    // Benefits (RECOMMENDED)
    if (!empty($job['benefits'])) {
        $schema['jobBenefits'] = strip_tags((string)$job['benefits']);
    }

    // Work Hours (if available)
    if (!empty($job['workHours'])) {
        $schema['workHours'] = (string)$job['workHours'];
    }

    // Remove null/empty values
    $schema = array_filter($schema, function($value) {
        return $value !== null && $value !== '' && $value !== [];
    });

    return $schema;
}

/**
 * Output JobPosting schema as JSON-LD script tag
 * 
 * @param array $job Job data array
 */
function output_jobposting_schema(array $job): void {
    try {
        $schema = generate_jobposting_schema($job);
        echo '<script type="application/ld+json">';
        echo json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        echo '</script>';
    } catch (Exception $e) {
        error_log("JobPosting schema error: " . $e->getMessage());
        // Don't output broken schema
    }
}

