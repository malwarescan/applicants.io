#!/usr/bin/env php
<?php
/**
 * Generate Southwest Florida Job Listings
 * 
 * Creates job listings for all specified job titles across all SWFL cities
 * Generates individual job pages and updates jobs.json
 */

require __DIR__ . '/../php-src/app/bootstrap.php';
require __DIR__ . '/../php-src/includes/schema_jobposting_unified.php';
use App\Renderer;
use App\Data;

// Southwest Florida Cities
$swflCities = [
    'Fort Myers',
    'Naples',
    'Cape Coral',
    'Bonita Springs',
    'Estero',
    'Lehigh Acres',
    'Punta Gorda',
    'Port Charlotte',
    'Sanibel',
    'Marco Island',
    'North Fort Myers',
    'Labelle',
    'Immokalee',
];

// Job Titles by Category
$jobTitles = [
    // Retail & Field Marketing
    'Brand Ambassador' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['PART_TIME', 'FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 16, 'maxValue' => 20, 'unitText' => 'HOUR'],
        'description' => 'Represent brands at retail locations and events, engage with customers, and promote products effectively. Perfect opportunity for those looking to start in marketing.',
        'responsibilities' => '<ul><li>Engage customers at retail locations and events</li><li>Demonstrate product features and benefits</li><li>Build brand awareness through face-to-face interactions</li><li>Collect customer feedback and insights</li><li>Maintain professional appearance and brand standards</li></ul>',
        'qualifications' => '<ul><li>Excellent communication skills</li><li>Customer service experience preferred</li><li>Professional appearance</li><li>Reliable transportation</li><li>Flexible availability including weekends</li></ul>',
        'skills' => 'Customer Service, Sales, Marketing, Communication, Teamwork',
        'benefits' => '<ul><li>Competitive hourly pay</li><li>Flexible scheduling</li><li>Professional development opportunities</li><li>Performance bonuses</li></ul>',
    ],
    'Retail Sales Associate' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['PART_TIME', 'FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 15, 'maxValue' => 19, 'unitText' => 'HOUR'],
        'description' => 'Drive sales and provide exceptional customer service in retail environments. Work with leading brands to achieve sales targets and customer satisfaction goals.',
        'responsibilities' => '<ul><li>Assist customers with product selection and purchases</li><li>Process transactions and handle payments</li><li>Maintain store appearance and product displays</li><li>Achieve daily and weekly sales targets</li><li>Build relationships with repeat customers</li></ul>',
        'qualifications' => '<ul><li>Previous retail or sales experience</li><li>Strong customer service skills</li><li>Ability to work in fast-paced environment</li><li>Basic math and cash handling skills</li></ul>',
        'skills' => 'Sales, Customer Service, Cash Handling, Product Knowledge, Communication',
        'benefits' => '<ul><li>Hourly wage plus commission</li><li>Employee discounts</li><li>Flexible scheduling</li><li>Career advancement opportunities</li></ul>',
    ],
    'In-Store Sales Representative' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 18, 'maxValue' => 25, 'unitText' => 'HOUR'],
        'description' => 'Represent brands within retail partner locations, drive sales through direct customer engagement, and build lasting relationships with both customers and store staff.',
        'responsibilities' => '<ul><li>Engage customers to promote brand products</li><li>Train retail staff on product features</li><li>Monitor inventory and product placement</li><li>Report sales data and customer feedback</li><li>Execute in-store marketing campaigns</li></ul>',
        'qualifications' => '<ul><li>2+ years sales experience</li><li>Retail or brand ambassador background</li><li>Strong presentation skills</li><li>Self-motivated and goal-oriented</li></ul>',
        'skills' => 'Sales, Brand Representation, Training, Relationship Building, Data Reporting',
        'benefits' => '<ul><li>Competitive base salary plus commission</li><li>Mileage reimbursement</li><li>Health benefits for full-time</li><li>Professional development</li></ul>',
    ],
    'Experiential Marketing Rep' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['PART_TIME', 'FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 17, 'maxValue' => 22, 'unitText' => 'HOUR'],
        'description' => 'Create memorable brand experiences at events, festivals, and activations. Engage consumers through interactive demonstrations and build brand loyalty.',
        'responsibilities' => '<ul><li>Set up and manage brand activations at events</li><li>Conduct product demonstrations and sampling</li><li>Capture consumer data and leads</li><li>Create engaging social media content</li><li>Ensure brand standards are maintained</li></ul>',
        'qualifications' => '<ul><li>Event marketing or brand ambassador experience</li><li>Outgoing personality and energy</li><li>Social media savvy</li><li>Ability to work weekends and evenings</li></ul>',
        'skills' => 'Event Marketing, Brand Activation, Social Media, Customer Engagement, Event Setup',
        'benefits' => '<ul><li>Hourly pay plus event bonuses</li><li>Travel opportunities</li><li>Flexible event-based schedule</li><li>Networking opportunities</li></ul>',
    ],
    'Kiosk Sales Representative' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['PART_TIME', 'FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 16, 'maxValue' => 21, 'unitText' => 'HOUR'],
        'description' => 'Operate brand kiosks in high-traffic retail locations, engage shoppers, and drive product sales through direct customer interaction.',
        'responsibilities' => '<ul><li>Operate brand kiosk and product displays</li><li>Approach and engage shoppers</li><li>Process sales transactions</li><li>Maintain kiosk inventory and appearance</li><li>Track daily sales and customer interactions</li></ul>',
        'qualifications' => '<ul><li>Retail or kiosk sales experience</li><li>Comfortable approaching customers</li><li>Point-of-sale system experience</li><li>Reliable and punctual</li></ul>',
        'skills' => 'Kiosk Operations, Sales, Customer Engagement, Inventory Management, POS Systems',
        'benefits' => '<ul><li>Base hourly rate plus commission</li><li>Consistent schedule</li><li>Indoor work environment</li><li>Product training provided</li></ul>',
    ],
    'Retail Activation Specialist' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 40000, 'maxValue' => 55000, 'unitText' => 'YEAR'],
        'description' => 'Plan and execute retail activations, manage brand presence in stores, and coordinate with retail partners to maximize brand visibility and sales.',
        'responsibilities' => '<ul><li>Plan and coordinate retail activation events</li><li>Manage brand displays and merchandising</li><li>Train and supervise brand ambassador teams</li><li>Analyze activation performance and ROI</li><li>Build relationships with retail partners</li></ul>',
        'qualifications' => '<ul><li>3+ years retail marketing or activation experience</li><li>Project management skills</li><li>Strong analytical abilities</li><li>Excellent communication skills</li></ul>',
        'skills' => 'Retail Activation, Project Management, Team Leadership, Data Analysis, Vendor Relations',
        'benefits' => '<ul><li>Salary plus performance bonuses</li><li>Health and dental insurance</li><li>401k with company match</li><li>Professional development budget</li></ul>',
    ],
    'Event Marketing Specialist' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['PART_TIME', 'FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 19, 'maxValue' => 24, 'unitText' => 'HOUR'],
        'description' => 'Specialize in event-based marketing activations, coordinate event logistics, and ensure successful brand experiences at festivals, trade shows, and community events.',
        'responsibilities' => '<ul><li>Coordinate event logistics and setup</li><li>Manage event staff and brand ambassadors</li><li>Execute marketing campaigns at events</li><li>Capture leads and consumer data</li><li>Post-event reporting and analysis</li></ul>',
        'qualifications' => '<ul><li>Event planning or marketing experience</li><li>Strong organizational skills</li><li>Ability to work under pressure</li><li>Weekend and evening availability</li></ul>',
        'skills' => 'Event Planning, Marketing, Logistics, Team Management, Data Collection',
        'benefits' => '<ul><li>Hourly pay plus event bonuses</li><li>Flexible schedule</li><li>Travel opportunities</li><li>Event industry networking</li></ul>',
    ],
    'Retail Product Demonstrator' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['PART_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 15, 'maxValue' => 18, 'unitText' => 'HOUR'],
        'description' => 'Demonstrate products to customers in retail settings, provide product education, and drive sales through engaging product presentations.',
        'responsibilities' => '<ul><li>Conduct product demonstrations for customers</li><li>Educate customers on product features</li><li>Answer product questions and provide recommendations</li><li>Maintain product display areas</li><li>Track demonstration effectiveness</li></ul>',
        'qualifications' => '<ul><li>Previous demonstration or retail experience</li><li>Comfortable speaking to groups</li><li>Product knowledge or willingness to learn</li><li>Friendly and approachable demeanor</li></ul>',
        'skills' => 'Product Demonstration, Public Speaking, Customer Education, Product Knowledge',
        'benefits' => '<ul><li>Flexible part-time schedule</li><li>Product training provided</li><li>Hourly wage</li><li>Indoor work environment</li></ul>',
    ],
    'Customer Engagement Representative' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 35000, 'maxValue' => 45000, 'unitText' => 'YEAR'],
        'description' => 'Focus on building customer relationships, handling inquiries, and ensuring exceptional customer experiences across all brand touchpoints.',
        'responsibilities' => '<ul><li>Respond to customer inquiries and concerns</li><li>Build long-term customer relationships</li><li>Process orders and handle customer accounts</li><li>Gather customer feedback and insights</li><li>Resolve customer issues effectively</li></ul>',
        'qualifications' => '<ul><li>2+ years customer service experience</li><li>Strong problem-solving skills</li><li>Excellent communication abilities</li><li>CRM system experience preferred</li></ul>',
        'skills' => 'Customer Service, Relationship Building, Problem Solving, CRM, Communication',
        'benefits' => '<ul><li>Salary plus performance bonuses</li><li>Health insurance</li><li>Paid time off</li><li>Career growth opportunities</li></ul>',
    ],
    'Lead Generator (Retail)' => [
        'category' => 'Retail & Field Marketing',
        'employmentType' => ['PART_TIME', 'FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 16, 'maxValue' => 20, 'unitText' => 'HOUR'],
        'description' => 'Generate qualified leads in retail environments, engage potential customers, and capture contact information for follow-up sales opportunities.',
        'responsibilities' => '<ul><li>Approach customers in retail settings</li><li>Qualify leads and capture contact information</li><li>Schedule follow-up appointments</li><li>Maintain lead database</li><li>Meet daily lead generation targets</li></ul>',
        'qualifications' => '<ul><li>Sales or lead generation experience</li><li>Comfortable approaching strangers</li><li>Strong communication skills</li><li>Goal-oriented mindset</li></ul>',
        'skills' => 'Lead Generation, Sales, Customer Engagement, Data Entry, Goal Achievement',
        'benefits' => '<ul><li>Base hourly rate plus lead bonuses</li><li>Flexible schedule</li><li>Performance incentives</li><li>Sales training provided</li></ul>',
    ],
    
    // Management & Leadership
    'Field Manager' => [
        'category' => 'Management & Leadership',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 50000, 'maxValue' => 65000, 'unitText' => 'YEAR'],
        'description' => 'Manage field marketing teams, oversee campaign execution, and ensure brand standards are maintained across all field activations.',
        'responsibilities' => '<ul><li>Recruit, train, and manage field marketing teams</li><li>Oversee campaign execution and quality</li><li>Conduct field visits and performance reviews</li><li>Analyze team performance and provide coaching</li><li>Ensure compliance with brand guidelines</li></ul>',
        'qualifications' => '<ul><li>3+ years field marketing or team management experience</li><li>Strong leadership and coaching skills</li><li>Ability to travel within region</li><li>Results-driven mindset</li></ul>',
        'skills' => 'Team Management, Field Marketing, Coaching, Performance Analysis, Brand Compliance',
        'benefits' => '<ul><li>Competitive salary</li><li>Health, dental, and vision insurance</li><li>401k with match</li><li>Company vehicle or mileage reimbursement</li><li>Professional development opportunities</li></ul>',
    ],
    'District Manager' => [
        'category' => 'Management & Leadership',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 60000, 'maxValue' => 80000, 'unitText' => 'YEAR'],
        'description' => 'Lead multiple field teams across a district, develop strategic plans, and drive business results through effective team management and campaign optimization.',
        'responsibilities' => '<ul><li>Manage multiple field managers and teams</li><li>Develop district-level marketing strategies</li><li>Analyze market trends and performance data</li><li>Build relationships with key retail partners</li><li>Drive revenue and market share growth</li></ul>',
        'qualifications' => '<ul><li>5+ years field marketing management experience</li><li>Proven track record of team leadership</li><li>Strategic thinking and planning abilities</li><li>Strong analytical and reporting skills</li></ul>',
        'skills' => 'Strategic Planning, Multi-Team Management, Data Analysis, Retail Partnerships, Revenue Growth',
        'benefits' => '<ul><li>Competitive salary plus performance bonuses</li><li>Comprehensive benefits package</li><li>Company vehicle</li><li>Expense account</li><li>Executive development program</li></ul>',
    ],
    'Regional Manager' => [
        'category' => 'Management & Leadership',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 75000, 'maxValue' => 100000, 'unitText' => 'YEAR'],
        'description' => 'Oversee regional operations, develop market strategies, and lead a team of district managers to achieve regional business objectives.',
        'responsibilities' => '<ul><li>Lead regional team of district managers</li><li>Develop and execute regional business strategies</li><li>Analyze regional performance and market trends</li><li>Build strategic partnerships with major retailers</li><li>Drive regional revenue and profitability</li></ul>',
        'qualifications' => '<ul><li>7+ years progressive field marketing leadership</li><li>Regional or multi-market management experience</li><li>Strong business acumen</li><li>Excellent communication and presentation skills</li></ul>',
        'skills' => 'Regional Leadership, Strategic Planning, Business Development, Market Analysis, Executive Communication',
        'benefits' => '<ul><li>Competitive executive salary</li><li>Performance-based bonuses and equity</li><li>Comprehensive executive benefits</li><li>Company vehicle and expense account</li><li>Executive leadership development</li></ul>',
    ],
    'Retail Program Manager' => [
        'category' => 'Management & Leadership',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 55000, 'maxValue' => 70000, 'unitText' => 'YEAR'],
        'description' => 'Manage retail program execution, coordinate with retail partners, and ensure program objectives are met across all retail locations.',
        'responsibilities' => '<ul><li>Develop and manage retail program strategies</li><li>Coordinate with retail partners on program execution</li><li>Monitor program performance and KPIs</li><li>Manage program budgets and resources</li><li>Report on program results and ROI</li></ul>',
        'qualifications' => '<ul><li>4+ years retail program or account management</li><li>Strong project management skills</li><li>Retail industry knowledge</li><li>Excellent relationship building abilities</li></ul>',
        'skills' => 'Program Management, Retail Partnerships, Project Management, Budget Management, ROI Analysis',
        'benefits' => '<ul><li>Competitive salary</li><li>Health and dental insurance</li><li>401k with match</li><li>Professional development</li><li>Flexible work arrangements</li></ul>',
    ],
    'Activation Manager' => [
        'category' => 'Management & Leadership',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 52000, 'maxValue' => 68000, 'unitText' => 'YEAR'],
        'description' => 'Lead brand activation campaigns, manage event execution, and ensure successful brand experiences that drive engagement and sales.',
        'responsibilities' => '<ul><li>Plan and execute brand activation campaigns</li><li>Manage activation teams and event staff</li><li>Coordinate logistics and vendor relationships</li><li>Measure activation effectiveness and ROI</li><li>Develop innovative activation concepts</li></ul>',
        'qualifications' => '<ul><li>4+ years activation or event marketing experience</li><li>Strong project management and logistics skills</li><li>Creative problem-solving abilities</li><li>Budget management experience</li></ul>',
        'skills' => 'Activation Management, Event Planning, Team Leadership, Vendor Management, ROI Measurement',
        'benefits' => '<ul><li>Competitive salary plus bonuses</li><li>Health insurance</li><li>401k</li><li>Creative development opportunities</li><li>Travel opportunities</li></ul>',
    ],
    'Team Lead (Retail)' => [
        'category' => 'Management & Leadership',
        'employmentType' => ['FULL_TIME'],
        'baseSalary' => ['currency' => 'USD', 'minValue' => 42000, 'maxValue' => 52000, 'unitText' => 'YEAR'],
        'description' => 'Lead a team of retail associates, ensure daily operations run smoothly, and drive team performance to achieve sales and service goals.',
        'responsibilities' => '<ul><li>Supervise daily retail team operations</li><li>Train and develop team members</li><li>Monitor team performance and provide feedback</li><li>Handle customer escalations</li><li>Ensure store standards are maintained</li></ul>',
        'qualifications' => '<ul><li>2+ years retail experience with leadership responsibilities</li><li>Strong coaching and development skills</li><li>Ability to motivate and inspire teams</li><li>Customer service excellence</li></ul>',
        'skills' => 'Team Leadership, Retail Operations, Coaching, Performance Management, Customer Service',
        'benefits' => '<ul><li>Competitive salary</li><li>Health insurance</li><li>Paid time off</li><li>Career advancement opportunities</li><li>Employee discounts</li></ul>',
    ],
];

// Company Information
$company = [
    'name' => 'Synaxus Inc',
    'sameAs' => 'https://www.synaxusinc.com/',
    'logo' => 'https://www.synaxusinc.com/synaxus-logo.png',
    'description' => 'Southwest Florida\'s premier experiential marketing agency with established Fortune 500 partnerships.',
];

// Generate all job combinations
$allJobs = [];
$jobIdCounter = 1;

foreach ($jobTitles as $title => $jobData) {
    foreach ($swflCities as $city) {
        $jobId = 'SWFL-' . str_pad($jobIdCounter++, 5, '0', STR_PAD_LEFT);
        $slug = strtolower(str_replace([' ', '(', ')'], ['-', '', ''], $title)) . '-' . strtolower(str_replace(' ', '-', $city)) . '-fl';
        
        // Create job location array
        // Google REQUIRES postalCode - lookup by city
        $postalCodes = [
            'Fort Myers' => '33901',
            'Naples' => '34101',
            'Cape Coral' => '33904',
            'Bonita Springs' => '34134',
            'Estero' => '33928',
            'Lehigh Acres' => '33936',
            'Punta Gorda' => '33950',
            'Port Charlotte' => '33948',
            'Marco Island' => '34145',
            'Sanibel' => '33957',
            'Immokalee' => '34142',
            'Labelle' => '33935',
            'North Fort Myers' => '33903',
        ];
        $postalCode = $postalCodes[$city] ?? '33901'; // Default to Fort Myers
        
        $jobLocation = [[
            'city' => $city,
            'region' => 'FL',
            'country' => 'US',
            'postalCode' => $postalCode,
        ]];
        
        // Determine job location type based on title
        $jobLocationType = 'ON_SITE';
        if (strpos($title, 'Remote') !== false || strpos($title, 'Field') !== false) {
            $jobLocationType = 'HYBRID';
        }
        
        // Build unified job data structure
        $job = [
            'id' => $jobId,
            'title' => $title,
            'description' => $jobData['description'],
            'datePosted' => date('Y-m-d'),
            'validThrough' => date('Y-m-d\T23:59:59-05:00', strtotime('+60 days')),
            'hiringOrganization' => $company,
            'employmentType' => $jobData['employmentType'],
            'jobLocation' => $jobLocation,
            'jobLocationType' => $jobLocationType,
            'baseSalary' => $jobData['baseSalary'],
            'identifier' => [
                'name' => 'Applicants.io',
                'value' => $slug,
            ],
            'applicationContact' => [
                'email' => 'careers@synaxusinc.com',
                'phone' => '+1-941-564-9169',
                'url' => 'https://www.synaxusinc.com/apply.php',
            ],
            'qualifications' => $jobData['qualifications'],
            'responsibilities' => $jobData['responsibilities'],
            'skills' => $jobData['skills'],
            'benefits' => $jobData['benefits'],
            'directApply' => true,
            'applicantLocationRequirements' => [
                ['@type' => 'Country', 'name' => 'United States'],
            ],
        ];
        
        // Add legacy format fields for compatibility
        $job['company'] = $company['name'];
        $job['location'] = $city . ', FL';
        $job['industry'] = $jobData['category'];
        $job['postedDate'] = date('F j, Y');
        
        // Format compensation for display
        if (isset($jobData['baseSalary']['unitText']) && $jobData['baseSalary']['unitText'] === 'HOUR') {
            $min = $jobData['baseSalary']['minValue'];
            $max = $jobData['baseSalary']['maxValue'];
            $job['compensation'] = '$' . $min . ' - $' . $max . ' per hour';
        } else {
            $min = number_format($jobData['baseSalary']['minValue']);
            $max = number_format($jobData['baseSalary']['maxValue']);
            $job['compensation'] = '$' . $min . ' - $' . $max . ' per year';
        }
        
        $job['contactEmail'] = 'careers@synaxusinc.com';
        $job['contactPhone'] = '+1-941-564-9169';
        
        $allJobs[] = $job;
    }
}

// Save to jobs.json
$jobsFile = __DIR__ . '/../php-src/data/jobs.json';
$existingJobs = [];
if (file_exists($jobsFile)) {
    $existingJobs = json_decode(file_get_contents($jobsFile), true) ?: [];
}

// Merge with existing jobs (avoid duplicates)
$existingIds = array_column($existingJobs, 'id');
$newJobs = array_filter($allJobs, function($job) use ($existingIds) {
    return !in_array($job['id'], $existingIds);
});

$allJobsFinal = array_merge($existingJobs, $newJobs);
file_put_contents($jobsFile, json_encode($allJobsFinal, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo "Generated " . count($newJobs) . " new job listings\n";
echo "Total jobs in database: " . count($allJobsFinal) . "\n";

// Generate individual job pages
$pagesDir = __DIR__ . '/../php-src/public/jobs/';
@mkdir($pagesDir, 0777, true);

// Regenerate ALL job pages (not just new ones) to ensure they use slugs
$allJobsToGenerate = array_filter($allJobsFinal, function($job) {
    return !empty($job['identifier']['value']);
});

$generatedPages = 0;
foreach ($allJobsToGenerate as $job) {
    $jobSlug = $job['identifier']['value'];
    $jobPageDir = $pagesDir . $jobSlug . '/';
    @mkdir($jobPageDir, 0777, true);
    
    // Generate schema
    try {
        $jsonLd = generate_jobposting_schema($job);
    } catch (Exception $e) {
        echo "Error generating schema for {$job['title']}: " . $e->getMessage() . "\n";
        continue;
    }
    
    // Extract slug from directory path
    // Path: php-src/public/jobs/{slug}/index.php
    // Bootstrap: php-src/app/bootstrap.php (go up 3 levels: ../../
    $pageContent = "<?php\nrequire __DIR__ . '/../../../app/bootstrap.php';\nuse App\\Renderer;\nuse App\\Data;\n\n// Extract job slug from directory name\n\$slug = basename(dirname(__FILE__));\n\n// Load jobs and find by identifier.value (slug)\n\$jobs = Data::readJson('data/jobs.json');\n\$job = null;\nforeach (\$jobs as \$j) {\n    if ((\$j['identifier']['value'] ?? '') === \$slug) {\n        \$job = \$j;\n        break;\n    }\n}\n\nif (!\$job) {\n    http_response_code(404);\n    echo '<h1>Job Not Found</h1>';\n    exit;\n}\n\nrequire_once __DIR__ . '/../../../includes/schema_jobposting_unified.php';\n\$jsonLd = generate_jobposting_schema(\$job);\n\n[\$head, \$body] = Renderer::render('job-detail-unified', [\n    'job' => \$job,\n    'canonical' => '/jobs/' . \$slug . '/',\n], [\n    'title' => \$job['title'] . ' in ' . \$job['location'] . ' | Applicants.io',\n    'desc' => substr(strip_tags(\$job['description']), 0, 160) . '...',\n    'canonical' => '/jobs/' . \$slug . '/',\n    'jsonld' => \$jsonLd,\n]);\n\nrequire __DIR__ . '/../../../views/layout.php';\n";
    
    file_put_contents($jobPageDir . 'index.php', $pageContent);
    
    $generatedPages++;
}

echo "Generated {$generatedPages} individual job pages\n";
echo "Job listings are now available on the home page\n";
echo "Next: Update sitemap to include all job pages\n";

