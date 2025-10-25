# Synaxus Job Pages Schema Verification

## Overview
All 6 Synaxus job pages have been verified to include comprehensive schema markup.

## Schema Types Included

Each page contains **4 main schema types**:

### 1. JobPosting Schema
- **Purpose**: Helps Google show rich results for job listings
- **Required Fields**: ✅ All present
  - `@type`: "JobPosting"
  - `title`: Job title
  - `description`: Job description
  - `datePosted`: Posting date
  - `hiringOrganization`: Company details
  - `employmentType`: FULL_TIME or PART_TIME
  - `jobLocation`: Specific location with address
  - `baseSalary`: Salary range
  - `validThrough`: Application deadline
  - `identifier`: Unique job ID

### 2. FAQPage Schema
- **Purpose**: Shows FAQ rich results in search
- **Questions Included**: 7 FAQs per page
  1. Employment type (full/part time)
  2. Job location
  3. Salary range
  4. How to apply
  5. Required qualifications
  6. Benefits offered
  7. Training provided

### 3. Organization Schema
- **Purpose**: Establishes company credibility
- **Includes**:
  - Company name: Synaxus Inc.
  - Physical address (verified)
  - Contact information
  - Social media profiles (LinkedIn, Google)
  - Aggregate rating (4.8/5 from 25 reviews)
  - Logo URL

### 4. BreadcrumbList Schema
- **Purpose**: Shows breadcrumb navigation in search results
- **Structure**:
  1. Home → /
  2. Synaxus Inc. Careers → /employers/synaxus/
  3. Specific Job → /employers/synaxus/[job-slug]

## Additional Schema Types

Each page also includes nested schema types for enhanced rich results:

- **Answer**: FAQ answers
- **Place**: Job location
- **PostalAddress**: Detailed address
- **MonetaryAmount**: Salary information
- **QuantitativeValue**: Salary min/max values
- **PropertyValue**: Job identifier
- **ContactPoint**: HR contact details
- **AggregateRating**: Company rating

## Verified Pages

All 6 pages have been verified:

1. ✅ Field Marketing Coordinator (Fort Myers, FL)
2. ✅ Brand Ambassador (Naples, FL)
3. ✅ Sales Representative (Cape Coral, FL)
4. ✅ Event Staff (Bonita Springs, FL)
5. ✅ Marketing Specialist (Estero, FL)
6. ✅ Customer Service Representative (Lehigh Acres, FL)

## SEO Benefits

- **Rich Snippets**: Jobs will show in Google Jobs search results
- **FAQ Rich Results**: FAQ sections will appear in search
- **Breadcrumb Navigation**: Improves search result display
- **Knowledge Graph**: Organization schema helps Google understand the company
- **Increased CTR**: Rich results typically get 30% more clicks

## Testing

Test your pages using Google's Rich Results Test:
https://search.google.com/test/rich-results

Example URLs to test:
- https://www.applicants.io/employers/synaxus/field-marketing-coordinator-fort-myers-fl
- https://www.applicants.io/employers/synaxus/brand-ambassador-naples-fl
- https://www.applicants.io/employers/synaxus/sales-representative-cape-coral-fl

## Compliance

✅ All schema follows Schema.org standards
✅ All required fields are present
✅ No schema errors detected
✅ JSON-LD format is properly formatted
✅ Multiple schema types work together harmoniously

