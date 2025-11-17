<?php
// Jobs index page (same as home)
use App\Data;

$jobs = Data::readJson('data/jobs.json');
$searchQuery = $_GET['q'] ?? '';
$selectedLocations = $_GET['locations'] ?? [];
$selectedIndustries = $_GET['industries'] ?? [];

// Filter jobs based on search and filters
$filteredJobs = array_filter($jobs, function($job) use ($searchQuery, $selectedLocations, $selectedIndustries) {
    // Text search filter
    $matchesSearch = empty($searchQuery) || 
        stripos($job['title'], $searchQuery) !== false || 
        stripos($job['company'], $searchQuery) !== false || 
        stripos($job['location'], $searchQuery) !== false || 
        stripos($job['industry'], $searchQuery) !== false ||
        stripos($job['description'], $searchQuery) !== false;
    
    // Location filter
    $matchesLocation = empty($selectedLocations) || in_array($job['location'], $selectedLocations);
    
    // Industry filter
    $matchesIndustry = empty($selectedIndustries) || in_array($job['industry'], $selectedIndustries);
    
    return $matchesSearch && $matchesLocation && $matchesIndustry;
});

// Get unique locations and industries for filters
$availableLocations = array_unique(array_column($jobs, 'location'));
sort($availableLocations);

$availableIndustries = array_unique(array_column($jobs, 'industry'));
sort($availableIndustries);
?>

<div class="space-y-6 md:space-y-0">
    <div class="md:hidden">
        <h2 class="text-lg font-headline font-medium mb-3">Filters</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
            <form method="GET" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" 
                           placeholder="Search jobs..." 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select name="locations[]" multiple class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <?php foreach ($availableLocations as $location): ?>
                            <option value="<?= htmlspecialchars($location) ?>" 
                                    <?= in_array($location, $selectedLocations) ? 'selected' : '' ?>>
                                <?= htmlspecialchars($location) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select name="industries[]" multiple class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <?php foreach ($availableIndustries as $industry): ?>
                            <option value="<?= htmlspecialchars($industry) ?>" 
                                    <?= in_array($industry, $selectedIndustries) ? 'selected' : '' ?>>
                                <?= htmlspecialchars($industry) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Apply Filters
                </button>
            </form>
        </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="hidden md:block md:col-span-1">
            <h2 class="text-xl font-headline font-medium mb-4">Filters</h2>
            <div class="bg-gray-50 p-4 rounded-lg">
                <form method="GET" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" 
                               placeholder="Search jobs..." 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select name="locations[]" multiple class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <?php foreach ($availableLocations as $location): ?>
                                <option value="<?= htmlspecialchars($location) ?>" 
                                        <?= in_array($location, $selectedLocations) ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($location) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                        <select name="industries[]" multiple class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <?php foreach ($availableIndustries as $industry): ?>
                                <option value="<?= htmlspecialchars($industry) ?>" 
                                        <?= in_array($industry, $selectedIndustries) ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($industry) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Apply Filters
                    </button>
                </form>
            </div>
        </div>
        
        <div class="md:col-span-3">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-headline font-medium">Job Listings</h1>
                    <?php if (!empty($selectedLocations) || !empty($selectedIndustries)): ?>
                        <div class="flex items-center justify-between mt-2">
                            <div class="flex items-center flex-wrap gap-1 md:gap-2">
                                <span class="text-sm text-gray-600 hidden sm:inline">Active filters:</span>
                                <span class="text-sm text-gray-600 sm:hidden">Filters:</span>
                                <?php if (!empty($selectedLocations)): ?>
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                                        <?= count($selectedLocations) ?> loc<?= count($selectedLocations) > 1 ? 's' : '' ?>
                                    </span>
                                <?php endif; ?>
                                <?php if (!empty($selectedIndustries)): ?>
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
                                        <?= count($selectedIndustries) ?> ind<?= count($selectedIndustries) > 1 ? 's' : '' ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                            <a href="/" class="text-xs text-gray-500 hover:text-gray-700 underline">
                                Clear all filters
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
                <?php if (count($filteredJobs) > 0): ?>
                    <div class="text-sm text-gray-600">
                        <?= count($filteredJobs) ?> <?= count($filteredJobs) === 1 ? 'job' : 'jobs' ?> found
                        <?php if (count($jobs) !== count($filteredJobs)): ?>
                            <span class="text-gray-400 ml-1">
                                (of <?= count($jobs) ?> total)
                            </span>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="border-t border-gray-200">
                <?php if (count($filteredJobs) > 0): ?>
                    <?php foreach ($filteredJobs as $job): ?>
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
                                    
                                    <!-- Quick Apply Actions -->
                                    <div class="mt-4 flex gap-2">
                                        <?php
                                        // Generate SMS link with prefilled message
                                        $smsPhone = '+13147746099';
                                        $smsMessage = 'Hi, I\'m interested in applying for the ' . htmlspecialchars($job['title']) . ' position in ' . htmlspecialchars($job['location']) . '.';
                                        $smsLink = 'sms:' . $smsPhone . '?body=' . urlencode($smsMessage);
                                        ?>
                                        <a href="<?= htmlspecialchars($smsLink) ?>" 
                                           class="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                                            📱 Text to Apply
                                        </a>
                                        <a href="/jobs/<?= htmlspecialchars($job['id']) ?>" 
                                           class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                            View Details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="py-8 text-center">
                        <p class="text-gray-500 mb-2">No job listings found matching your search.</p>
                        <p class="text-sm text-gray-400">
                            Try adjusting your search terms or filters to find more opportunities.
                        </p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
