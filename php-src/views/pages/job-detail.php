<?php 
use App\Data;

$id = $data['id'] ?? '';
$jobs = Data::readJson('data/jobs.json');
$job = null;

foreach ($jobs as $j) {
    if ($j['id'] === $id) {
        $job = $j;
        break;
    }
}

if (!$job) {
    echo '<div class="py-8"><p>Job not found.</p><a href="/" class="text-blue-600 hover:underline mt-4 inline-block">Back to job listings</a></div>';
    return;
}
?>

<div>
    <div class="mb-6">
        <a href="/" class="text-blue-600 hover:underline">
            Back to job listings
        </a>
    </div>
    
    <div class="border-t border-gray-200 pt-6">
        <h1 class="text-2xl font-headline font-medium"><?= htmlspecialchars($job['title']) ?></h1>
        <div class="mt-2 text-gray-500">
            <?= htmlspecialchars($job['company']) ?> • <?= htmlspecialchars($job['location']) ?> • Posted <?= htmlspecialchars($job['postedDate']) ?>
        </div>
        <div class="mt-2">
            <span class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded">
                <?= htmlspecialchars($job['industry']) ?>
            </span>
        </div>
        
        <?php if (!empty($job['compensation'])): ?>
            <div class="mt-4">
                <span class="font-medium">Compensation:</span> <?= htmlspecialchars($job['compensation']) ?>
            </div>
        <?php endif; ?>
        
        <div class="mt-6">
            <h2 class="text-lg font-headline font-medium mb-2">Description</h2>
            <div class="whitespace-pre-line"><?= htmlspecialchars($job['description']) ?></div>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
            <h2 class="text-xl font-headline font-bold mb-6">How to Apply</h2>
            
            <?php
            // Generate SMS link with prefilled message
            $smsPhone = '+13147746099';
            $emailAddress = 'hr@synaxusinc.com';
            $smsMessage = 'Hi, I\'m interested in applying for the ' . htmlspecialchars($job['title']) . ' position in ' . htmlspecialchars($job['location']) . '.';
            $smsLink = 'sms:' . $smsPhone . '?body=' . urlencode($smsMessage);
            ?>
            
            <div class="space-y-4">
                <!-- Text HR to Apply Button (Primary) -->
                <a href="<?= htmlspecialchars($smsLink) ?>" 
                   class="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-all font-semibold text-base shadow-md hover:shadow-lg">
                    <span class="text-xl">📱</span>
                    <span>Text HR to Apply</span>
                </a>
                
                <!-- Email Resume Button -->
                <a href="mailto:<?= htmlspecialchars($emailAddress) ?>?subject=Application for <?= urlencode($job['title']) ?>&body=Hi,%0D%0A%0D%0AI am interested in applying for the <?= urlencode($job['title']) ?> position in <?= urlencode($job['location']) ?>.%0D%0A%0D%0APlease find my resume attached.%0D%0A%0D%0AThank you," 
                   class="flex items-center justify-center gap-2 w-full bg-white text-blue-600 px-6 py-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all font-semibold text-base shadow-sm hover:shadow-md">
                    <span>✉️</span>
                    <span>Email Resume</span>
                </a>
                
                <!-- Contact Information -->
                <div class="pt-4 mt-4 border-t border-gray-200">
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