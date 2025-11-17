<?php
/**
 * Unified Job Listing Card Component
 * 
 * Reusable job card for listing pages
 * 
 * Usage:
 *   include __DIR__ . '/components/job-listing-card.php';
 *   render_job_card($jobData);
 * 
 * @param array $job Job data array
 */
function render_job_card(array $job): void {
    $jobId = $job['id'] ?? $job['identifier']['value'] ?? '';
    $title = htmlspecialchars($job['title'] ?? '');
    $company = htmlspecialchars($job['hiringOrganization']['name'] ?? $job['company'] ?? '');
    
    // Format location
    $locations = [];
    foreach ($job['jobLocation'] ?? [] as $loc) {
        $parts = array_filter([$loc['city'] ?? '', $loc['region'] ?? '']);
        if (!empty($parts)) {
            $locations[] = implode(', ', $parts);
        }
    }
    $location = !empty($locations) ? implode('; ', $locations) : ($job['location'] ?? '');
    
    // Format employment type
    $empTypes = $job['employmentType'] ?? [];
    if (is_string($empTypes)) {
        $empTypes = [$empTypes];
    }
    $empTypeLabels = [
        'FULL_TIME' => 'Full-time',
        'PART_TIME' => 'Part-time',
        'CONTRACTOR' => 'Contract',
        'TEMPORARY' => 'Temp',
        'INTERN' => 'Internship',
    ];
    $empTypeDisplay = array_map(function($type) use ($empTypeLabels) {
        return $empTypeLabels[$type] ?? $type;
    }, array_slice($empTypes, 0, 1)); // Show first type only
    
    // Format salary
    $salaryDisplay = null;
    if (!empty($job['baseSalary'])) {
        $sal = $job['baseSalary'];
        $min = $sal['minValue'] ?? null;
        $max = $sal['maxValue'] ?? null;
        if ($min && $max) {
            $salaryDisplay = '$' . number_format($min / 1000) . 'k - $' . number_format($max / 1000) . 'k';
        } elseif ($min) {
            $salaryDisplay = '$' . number_format($min / 1000) . 'k+';
        }
    }
    
    // Format date
    $datePosted = !empty($job['datePosted']) 
        ? date('M j, Y', strtotime($job['datePosted'])) 
        : '';
    
    // Description preview
    $description = strip_tags($job['description'] ?? '');
    $descriptionPreview = mb_substr($description, 0, 150);
    if (mb_strlen($description) > 150) {
        $descriptionPreview .= '...';
    }
    
    // Job URL
    $jobUrl = '/jobs/' . urlencode($jobId);
    if (!empty($job['identifier']['value'])) {
        $jobUrl = '/jobs/' . urlencode($job['identifier']['value']);
    }
?>

<article class="border-b border-gray-200 py-6 hover:bg-gray-50 transition-colors">
    <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
            <!-- Title and Company -->
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
                <a href="<?= htmlspecialchars($jobUrl) ?>" class="hover:text-blue-600 transition-colors">
                    <?= $title ?>
                </a>
            </h3>
            
            <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                <!-- Company -->
                <?php if ($company): ?>
                    <span class="font-medium"><?= $company ?></span>
                <?php endif; ?>
                
                <!-- Location -->
                <?php if ($location): ?>
                    <span>•</span>
                    <span><?= htmlspecialchars($location) ?></span>
                <?php endif; ?>
                
                <!-- Posted Date -->
                <?php if ($datePosted): ?>
                    <span>•</span>
                    <span><?= htmlspecialchars($datePosted) ?></span>
                <?php endif; ?>
            </div>
            
            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mb-3">
                <?php if (!empty($empTypeDisplay)): ?>
                    <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        <?= htmlspecialchars($empTypeDisplay[0]) ?>
                    </span>
                <?php endif; ?>
                
                <?php if (!empty($job['jobLocationType'])): ?>
                    <?php
                    $locationTypeLabels = [
                        'ON_SITE' => 'On-site',
                        'REMOTE' => 'Remote',
                        'HYBRID' => 'Hybrid'
                    ];
                    $locType = $locationTypeLabels[$job['jobLocationType']] ?? $job['jobLocationType'];
                    ?>
                    <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        <?= htmlspecialchars($locType) ?>
                    </span>
                <?php endif; ?>
                
                <?php if ($salaryDisplay): ?>
                    <span class="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        <?= htmlspecialchars($salaryDisplay) ?>
                    </span>
                <?php endif; ?>
            </div>
            
            <!-- Description Preview -->
            <?php if ($descriptionPreview): ?>
                <p class="text-sm text-gray-600 line-clamp-2">
                    <?= htmlspecialchars($descriptionPreview) ?>
                </p>
            <?php endif; ?>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex-shrink-0 flex flex-col gap-2">
            <?php
            // Generate SMS link with prefilled message
            $smsPhone = '+13147746099';
            $smsMessage = 'Hi, I\'m interested in applying for the ' . $title . ' position in ' . htmlspecialchars($location) . '.';
            $smsLink = 'sms:' . $smsPhone . '?body=' . urlencode($smsMessage);
            ?>
            <a href="<?= htmlspecialchars($smsLink) ?>" 
               class="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap text-center">
                📱 Text to Apply
            </a>
            <a href="<?= htmlspecialchars($jobUrl) ?>" 
               class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap text-center">
                View Details
            </a>
        </div>
    </div>
</article>

<?php
}

