<?php
$employerName = $data['employerName'] ?? 'Synaxus Inc';
$employerUrl = $data['employerUrl'] ?? '';
$verified = $data['verified'] ?? [];
$agg = $data['agg'] ?? ['avg' => 0.0, 'count' => 0];
$structuredData = $data['structuredData'] ?? null;
?>

<div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-600 mb-8">
        <a href="/" class="hover:text-blue-600 transition-colors">Home</a> › 
        <a href="/employers/" class="hover:text-blue-600 transition-colors">Employers</a> › 
        <span class="text-gray-900 font-medium"><?= htmlspecialchars($employerName) ?></span>
    </nav>

    <!-- Header -->
    <header class="mb-8">
        <h1 class="text-4xl font-headline font-bold text-gray-900 mb-3">
            <?= htmlspecialchars($employerName) ?> — Employee Reviews
        </h1>
        <p class="text-lg text-gray-600">Public, verified reviews hosted by Applicants.io.</p>
    </header>

    <!-- Overall Rating -->
    <section class="bg-white rounded-lg p-8 mb-8">
        <h2 class="text-2xl font-headline font-semibold mb-6 text-gray-900">Overall Rating</h2>
        <div class="text-center">
            <div class="text-6xl font-bold text-gray-900 mb-4">
                <?= number_format((float)$agg['avg'], 1) ?>/5
            </div>
            <div class="text-center mb-4">
                <span class="text-4xl text-yellow-400"><?php 
                $rating = (float)($agg['avg'] ?: 5);
                for ($i = 1; $i <= 5; $i++) {
                    if ($i <= floor($rating)) {
                        echo '★';
                    } elseif ($i == ceil($rating) && $rating != floor($rating)) {
                        echo '★';
                    } else {
                        echo '☆';
                    }
                }
                ?></span>
            </div>
            <p class="text-lg text-gray-600">
                Based on <strong><?= $agg['count'] ?></strong> verified reviews
            </p>
        </div>
    </section>

    <!-- Reviews List -->
    <section>
        <h2 class="text-xl font-headline font-semibold mb-4">Recent Verified Reviews</h2>
        
        <?php if (empty($verified)): ?>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-gray-600">No verified reviews published yet.</p>
                <p class="text-sm text-gray-500 mt-2">
                    Only verified, non-sample reviews are displayed here.
                </p>
            </div>
        <?php else: ?>
            <div class="space-y-6">
                <?php foreach ($verified as $review): ?>
                    <article class="bg-white rounded-lg p-12 border border-gray-200 shadow-sm">
                        <div class="flex items-start justify-between mb-3">
                            <h3 class="text-lg font-medium text-gray-900">
                                <?= htmlspecialchars($review['title']) ?>
                            </h3>
                            <div class="flex items-center space-x-1">
                                <?php 
                                $rating = (int)$review['rating'];
                                $filled = str_repeat("★", $rating);
                                $empty = str_repeat("☆", 5 - $rating);
                                ?>
                                <span class="text-yellow-400"><?= $filled ?></span>
                                <span class="text-gray-300"><?= $empty ?></span>
                            </div>
                        </div>
                        
                        <p class="text-gray-700 mb-4 leading-relaxed">
                            <?= htmlspecialchars($review['body']) ?>
                        </p>
                        
                        <div class="flex items-center text-sm text-gray-500">
                            <span class="font-medium"><?= htmlspecialchars($review['authorRole'] ?: 'Employee') ?></span>
                            <?php if ($review['location']): ?>
                                <span class="mx-2">•</span>
                                <span><?= htmlspecialchars($review['location']) ?></span>
                            <?php endif; ?>
                            <span class="mx-2">•</span>
                            <span><?= htmlspecialchars($review['date']) ?></span>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </section>

    <!-- About Section -->
    <section class="bg-blue-50 rounded-lg p-6">
        <h2 class="text-lg font-headline font-semibold mb-3 text-blue-900">About This Page</h2>
        <p class="text-blue-800">
            This page shows employee reviews for <strong><?= htmlspecialchars($employerName) ?></strong> 
            collected by Applicants.io. Only verified, non-sample submissions are counted toward the 
            rating displayed above and the structured data visible to search engines.
        </p>
    </section>
</div>
