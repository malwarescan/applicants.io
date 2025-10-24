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
            <h2 class="text-lg font-headline font-medium mb-2">Contact Information</h2>
            <p>
                Email: <a href="mailto:<?= htmlspecialchars($job['contactEmail']) ?>" class="text-blue-600 hover:underline">
                    <?= htmlspecialchars($job['contactEmail']) ?>
                </a>
            </p>
            <?php if (!empty($job['contactPhone'])): ?>
                <p class="mt-1">Phone: <?= htmlspecialchars($job['contactPhone']) ?></p>
            <?php endif; ?>
        </div>
    </div>
</div>