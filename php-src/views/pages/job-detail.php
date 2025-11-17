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
            <h2 class="text-lg font-headline font-medium mb-4">How to Apply</h2>
            
            <?php
            // Generate SMS link with prefilled message
            $smsPhone = '+13147746099';
            $smsMessage = 'Hi, I\'m interested in applying for the ' . htmlspecialchars($job['title']) . ' position in ' . htmlspecialchars($job['location']) . '.';
            $smsLink = 'sms:' . $smsPhone . '?body=' . urlencode($smsMessage);
            ?>
            
            <div class="space-y-3">
                <a href="<?= htmlspecialchars($smsLink) ?>" 
                   class="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium">
                    📱 Text HR to Apply
                </a>
                
                <?php if (!empty($job['contactEmail'])): ?>
                    <div class="mt-3">
                        <p class="mb-2">
                            <strong>Email:</strong> 
                            <a href="mailto:<?= htmlspecialchars($job['contactEmail']) ?>" class="text-blue-600 hover:underline">
                                <?= htmlspecialchars($job['contactEmail']) ?>
                            </a>
                        </p>
                    </div>
                <?php endif; ?>
                
                <?php if (!empty($job['contactPhone'])): ?>
                    <p>
                        <strong>Phone:</strong> 
                        <a href="tel:<?= htmlspecialchars($job['contactPhone']) ?>" class="text-blue-600 hover:underline">
                            <?= htmlspecialchars($job['contactPhone']) ?>
                        </a>
                    </p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>