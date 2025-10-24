<?php
use App\Data;

$category = $data['category'];
$industry = str_replace('-', ' ', $category);
$industry = ucwords($industry);

$categoryJobs = Data::getJobsByCategory($category);
?>

<div>
    <div class="mb-6">
        <a href="/" class="text-blue-600 hover:underline">
            Back to all jobs
        </a>
    </div>
    
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-headline font-medium"><?= htmlspecialchars($industry) ?> Jobs</h1>
            <p class="text-gray-600 mt-1">
                <?= count($categoryJobs) ?> <?= count($categoryJobs) === 1 ? 'job' : 'jobs' ?> found in <?= htmlspecialchars($industry) ?>
            </p>
        </div>
    </div>
    
    <div class="border-t border-gray-200">
        <?php if (count($categoryJobs) > 0): ?>
            <?php foreach ($categoryJobs as $job): ?>
                <div class="border-b border-gray-200 py-6">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h3 class="text-lg font-medium text-gray-900">
                                <a href="/jobs/<?= htmlspecialchars($job['id']) ?>" class="hover:text-blue-600">
                                    <?= htmlspecialchars($job['title']) ?>
                                </a>
                            </h3>
                            <div class="mt-1 text-sm text-gray-500">
                                <?= htmlspecialchars($job['company']) ?> • <?= htmlspecialchars($job['location']) ?> • Posted <?= htmlspecialchars($job['postedDate']) ?>
                            </div>
                            <div class="mt-2">
                                <span class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                    <?= htmlspecialchars($job['industry']) ?>
                                </span>
                            </div>
                            <?php if (!empty($job['compensation'])): ?>
                                <div class="mt-2 text-sm text-green-600 font-medium">
                                    <?= htmlspecialchars($job['compensation']) ?>
                                </div>
                            <?php endif; ?>
                            <div class="mt-3 text-sm text-gray-600">
                                <?= htmlspecialchars(substr($job['description'], 0, 200)) ?>...
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="py-8 text-center">
                <p class="text-gray-500 mb-2">No <?= strtolower($industry) ?> jobs found.</p>
                <p class="text-sm text-gray-400">
                    Check back later or browse other categories.
                </p>
            </div>
        <?php endif; ?>
    </div>
</div>
