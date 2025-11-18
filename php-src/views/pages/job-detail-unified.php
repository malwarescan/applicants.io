<?php
/**
 * Unified Job Detail Page Template
 * 
 * Google JobPosting Schema Compliant
 * 
 * This template ensures all visible content matches structured data
 * and includes all required fields for Google Jobs eligibility.
 * 
 * Usage:
 *   Renderer::render('job-detail-unified', ['job' => $jobData], $seoOptions)
 * 
 * Required $jobData structure:
 *   - title (string): Job title
 *   - description (string): Full job description (HTML allowed)
 *   - datePosted (string): ISO 8601 date (YYYY-MM-DD)
 *   - validThrough (string): ISO 8601 datetime (must be future)
 *   - hiringOrganization (array): {name, sameAs, logo}
 *   - employmentType (array): ['FULL_TIME', 'PART_TIME', etc.]
 *   - jobLocation (array): [{city, region, country}]
 *   - jobLocationType (string): 'ON_SITE', 'REMOTE', or 'HYBRID'
 *   - baseSalary (array): {currency, minValue, maxValue, unitText}
 *   - identifier (array): {name, value} - Unique job ID
 *   - applicationContact (array): {email, phone, url} - At least one required
 *   - qualifications (string): Required qualifications
 *   - responsibilities (string): Job responsibilities
 *   - benefits (string): Benefits offered
 *   - skills (string): Required skills
 */

$job = $data['job'] ?? [];
$canonical = $data['canonical'] ?? '/';

// Validate required fields
$requiredFields = ['title', 'description', 'datePosted', 'hiringOrganization', 'jobLocation'];
foreach ($requiredFields as $field) {
    if (empty($job[$field])) {
        echo '<div class="py-8"><p class="text-red-600">Error: Missing required field: ' . htmlspecialchars($field) . '</p></div>';
        return;
    }
}

// Format dates
$datePosted = date('F j, Y', strtotime($job['datePosted'] ?? 'now'));
$validThrough = !empty($job['validThrough']) ? date('F j, Y', strtotime($job['validThrough'])) : null;

// Format employment type
$employmentTypes = $job['employmentType'] ?? [];
if (is_string($employmentTypes)) {
    $employmentTypes = [$employmentTypes];
}
$employmentTypeLabels = [
    'FULL_TIME' => 'Full-time',
    'PART_TIME' => 'Part-time',
    'CONTRACTOR' => 'Contractor',
    'TEMPORARY' => 'Temporary',
    'INTERN' => 'Internship',
    'VOLUNTEER' => 'Volunteer',
    'PER_DIEM' => 'Per Diem',
    'OTHER' => 'Other'
];
$employmentTypeDisplay = array_map(function($type) use ($employmentTypeLabels) {
    return $employmentTypeLabels[$type] ?? $type;
}, $employmentTypes);

// Format location
$locations = [];
foreach ($job['jobLocation'] ?? [] as $loc) {
    $parts = array_filter([$loc['city'] ?? '', $loc['region'] ?? '', $loc['country'] ?? '']);
    $locations[] = implode(', ', $parts);
}
$locationDisplay = implode('; ', $locations);

// Format salary
$salaryDisplay = null;
if (!empty($job['baseSalary'])) {
    $sal = $job['baseSalary'];
    $currency = $sal['currency'] ?? 'USD';
    $unit = $sal['unitText'] ?? 'YEAR';
    $min = $sal['minValue'] ?? null;
    $max = $sal['maxValue'] ?? null;
    
    if ($min && $max) {
        $salaryDisplay = '$' . number_format($min) . ' - $' . number_format($max);
    } elseif ($min) {
        $salaryDisplay = 'Starting at $' . number_format($min);
    } elseif ($max) {
        $salaryDisplay = 'Up to $' . number_format($max);
    }
    
    if ($salaryDisplay) {
        $unitLabels = ['YEAR' => 'per year', 'MONTH' => 'per month', 'WEEK' => 'per week', 'HOUR' => 'per hour', 'DAY' => 'per day'];
        $salaryDisplay .= ' ' . ($unitLabels[$unit] ?? strtolower($unit));
    }
}

// Job location type display
$locationTypeLabels = [
    'ON_SITE' => 'On-site',
    'REMOTE' => 'Remote',
    'HYBRID' => 'Hybrid'
];
$locationTypeDisplay = $locationTypeLabels[$job['jobLocationType'] ?? ''] ?? ($job['jobLocationType'] ?? '');
?>

<div class="max-w-4xl mx-auto">
    <!-- Breadcrumb Navigation -->
    <nav class="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
        <a href="/" class="hover:text-blue-600 transition-colors">Home</a>
        <span class="mx-2">›</span>
        <a href="/jobs/" class="hover:text-blue-600 transition-colors">Jobs</a>
        <span class="mx-2">›</span>
        <span class="text-gray-900 font-medium"><?= htmlspecialchars($job['title']) ?></span>
    </nav>

    <!-- Job Header -->
    <header class="mb-8">
        <h1 class="text-4xl font-headline font-bold text-gray-900 mb-3">
            <?= htmlspecialchars($job['title']) ?>
        </h1>
        
        <div class="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            <!-- Company -->
            <?php if (!empty($job['hiringOrganization']['name'])): ?>
                <div class="flex items-center">
                    <span class="font-medium"><?= htmlspecialchars($job['hiringOrganization']['name']) ?></span>
                    <?php if (!empty($job['hiringOrganization']['sameAs'])): ?>
                        <a href="<?= htmlspecialchars($job['hiringOrganization']['sameAs']) ?>" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="ml-2 text-blue-600 hover:underline text-sm">
                            Visit Company Website
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <!-- Location -->
            <?php if ($locationDisplay): ?>
                <span class="hidden sm:inline">•</span>
                <span><?= htmlspecialchars($locationDisplay) ?></span>
            <?php endif; ?>
            
            <!-- Posted Date -->
            <span class="hidden sm:inline">•</span>
            <span>Posted <?= htmlspecialchars($datePosted) ?></span>
        </div>

        <!-- Quick Info Badges -->
        <div class="flex flex-wrap gap-2 mb-6">
            <?php if ($employmentTypeDisplay): ?>
                <?php foreach ($employmentTypeDisplay as $type): ?>
                    <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        <?= htmlspecialchars($type) ?>
                    </span>
                <?php endforeach; ?>
            <?php endif; ?>
            
            <?php if ($locationTypeDisplay): ?>
                <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <?= htmlspecialchars($locationTypeDisplay) ?>
                </span>
            <?php endif; ?>
            
            <?php if ($salaryDisplay): ?>
                <span class="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    <?= htmlspecialchars($salaryDisplay) ?>
                </span>
            <?php endif; ?>
            
            <?php if ($validThrough): ?>
                <span class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Apply by <?= htmlspecialchars($validThrough) ?>
                </span>
            <?php endif; ?>
        </div>
    </header>

    <!-- Job Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Main Content -->
        <div class="md:col-span-2 space-y-6">
            <!-- Job Description -->
            <section class="bg-white rounded-lg p-6 border border-gray-200">
                <h2 class="text-2xl font-headline font-semibold mb-4 text-gray-900">Job Description</h2>
                <div class="prose prose-gray max-w-none">
                    <?= $job['description'] ?>
                </div>
            </section>

            <!-- Responsibilities -->
            <?php if (!empty($job['responsibilities'])): ?>
                <section class="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 class="text-2xl font-headline font-semibold mb-4 text-gray-900">Key Responsibilities</h2>
                    <div class="prose prose-gray max-w-none">
                        <?= $job['responsibilities'] ?>
                    </div>
                </section>
            <?php endif; ?>

            <!-- Qualifications -->
            <?php if (!empty($job['qualifications'])): ?>
                <section class="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 class="text-2xl font-headline font-semibold mb-4 text-gray-900">Required Qualifications</h2>
                    <div class="prose prose-gray max-w-none">
                        <?= $job['qualifications'] ?>
                    </div>
                </section>
            <?php endif; ?>

            <!-- Required Skills -->
            <?php if (!empty($job['skills'])): ?>
                <section class="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 class="text-2xl font-headline font-semibold mb-4 text-gray-900">Required Skills</h2>
                    <div class="prose prose-gray max-w-none">
                        <?= $job['skills'] ?>
                    </div>
                </section>
            <?php endif; ?>

            <!-- Benefits -->
            <?php if (!empty($job['benefits'])): ?>
                <section class="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 class="text-2xl font-headline font-semibold mb-4 text-gray-900">Benefits & Perks</h2>
                    <div class="prose prose-gray max-w-none">
                        <?= $job['benefits'] ?>
                    </div>
                </section>
            <?php endif; ?>
        </div>

        <!-- Sidebar -->
        <div class="md:col-span-1">
            <!-- Quick Facts Card -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6 sticky top-4">
                <h3 class="text-lg font-headline font-semibold mb-4 text-gray-900">Quick Facts</h3>
                <dl class="space-y-3">
                    <?php if ($employmentTypeDisplay): ?>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Employment Type</dt>
                            <dd class="text-sm text-gray-900"><?= htmlspecialchars(implode(', ', $employmentTypeDisplay)) ?></dd>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($locationTypeDisplay): ?>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Work Setup</dt>
                            <dd class="text-sm text-gray-900"><?= htmlspecialchars($locationTypeDisplay) ?></dd>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($locationDisplay): ?>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Location</dt>
                            <dd class="text-sm text-gray-900"><?= htmlspecialchars($locationDisplay) ?></dd>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($salaryDisplay): ?>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Compensation</dt>
                            <dd class="text-sm text-gray-900 font-medium"><?= htmlspecialchars($salaryDisplay) ?></dd>
                        </div>
                    <?php endif; ?>
                    
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Posted</dt>
                        <dd class="text-sm text-gray-900"><?= htmlspecialchars($datePosted) ?></dd>
                    </div>
                    
                    <?php if ($validThrough): ?>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Apply By</dt>
                            <dd class="text-sm text-gray-900"><?= htmlspecialchars($validThrough) ?></dd>
                        </div>
                    <?php endif; ?>
                </dl>
            </div>

            <!-- Apply Section -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 shadow-sm">
                <h3 class="text-xl font-headline font-bold mb-6 text-gray-900">How to Apply</h3>
                
                <div class="space-y-4">
                    <?php
                    // Generate SMS link with prefilled message
                    $smsPhone = '+13147746099';
                    $smsMessage = 'Hi, I\'m interested in applying for the ' . htmlspecialchars($job['title']) . ' position in ' . htmlspecialchars($locationDisplay) . '.';
                    $smsLink = 'sms:' . $smsPhone . '?body=' . urlencode($smsMessage);
                    $emailAddress = 'hr@synaxusinc.com';
                    ?>
                    
                    <!-- Text HR to Apply Button (Primary) -->
                    <a href="<?= htmlspecialchars($smsLink) ?>" 
                       class="flex items-center justify-center gap-2 w-full bg-green-600 text-white text-center px-6 py-4 rounded-lg hover:bg-green-700 transition-all font-semibold text-base shadow-md hover:shadow-lg">
                        <span class="text-xl">📱</span>
                        <span>Text HR to Apply</span>
                    </a>
                    
                    <!-- Apply Online Button -->
                    <?php if (!empty($job['applicationContact']['url'])): ?>
                        <a href="<?= htmlspecialchars($job['applicationContact']['url']) ?>" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="flex items-center justify-center gap-2 w-full bg-blue-600 text-white text-center px-6 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold text-base shadow-md hover:shadow-lg">
                            <span>🌐</span>
                            <span>Apply Online</span>
                        </a>
                    <?php endif; ?>
                    
                    <!-- Email Resume Button -->
                    <a href="mailto:<?= htmlspecialchars($emailAddress) ?>?subject=Application for <?= urlencode($job['title']) ?>&body=Hi,%0D%0A%0D%0AI am interested in applying for the <?= urlencode($job['title']) ?> position in <?= urlencode($locationDisplay) ?>.%0D%0A%0D%0APlease find my resume attached.%0D%0A%0D%0AThank you," 
                       class="flex items-center justify-center gap-2 w-full bg-white text-blue-600 text-center px-6 py-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all font-semibold text-base shadow-sm hover:shadow-md">
                        <span>✉️</span>
                        <span>Email Resume</span>
                    </a>
                    
                    <!-- Contact Information -->
                    <div class="pt-4 mt-4 border-t border-blue-200">
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center gap-2 text-gray-700">
                                <span class="font-semibold text-gray-900">Phone:</span>
                                <a href="tel:<?= htmlspecialchars($smsPhone) ?>" 
                                   class="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                    <?= htmlspecialchars($smsPhone) ?>
                                </a>
                            </div>
                            <div class="flex items-center gap-2 text-gray-700">
                                <span class="font-semibold text-gray-900">Email:</span>
                                <a href="mailto:<?= htmlspecialchars($emailAddress) ?>" 
                                   class="text-blue-600 hover:text-blue-800 hover:underline font-medium break-all">
                                    <?= htmlspecialchars($emailAddress) ?>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Company Information -->
    <?php if (!empty($job['hiringOrganization'])): ?>
        <section class="bg-white rounded-lg p-6 border border-gray-200 mb-8">
            <h2 class="text-2xl font-headline font-semibold mb-4 text-gray-900">
                About <?= htmlspecialchars($job['hiringOrganization']['name']) ?>
            </h2>
            <?php if (!empty($job['hiringOrganization']['description'])): ?>
                <div class="prose prose-gray max-w-none">
                    <?= $job['hiringOrganization']['description'] ?>
                </div>
            <?php endif; ?>
            <?php if (!empty($job['hiringOrganization']['sameAs'])): ?>
                <a href="<?= htmlspecialchars($job['hiringOrganization']['sameAs']) ?>" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="inline-block mt-4 text-blue-600 hover:underline">
                    Visit Company Website →
                </a>
            <?php endif; ?>
        </section>
    <?php endif; ?>
</div>

