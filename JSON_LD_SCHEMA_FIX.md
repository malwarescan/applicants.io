# JSON-LD Schema Fix for Employer Reviews Pages

## Problem
The Synaxus employer review page was missing server-rendered JSON-LD structured data in the HTML. Google requires structured data to be present in the initial HTML (SSR), not injected client-side.

## Solution Implemented

### 1. Updated Schema Generation Function
**File**: `php-src/public/includes/reviews_employer.php`

- Changed `ai_schema_employer_agg()` to return an array (not a string with script tags)
- Implemented compliant `@graph` structure as specified
- Added Applicants.io as the independent publisher/reviewer
- Added proper `@id` references for entities
- Included representative Review nodes (first 3 verified reviews)

### 2. Updated Synaxus Index Page
**File**: `php-src/public/employers/synaxus/index.php`

- Changed to pass JSON-LD array directly to `Seo::head()` via `jsonld` parameter
- Removed string manipulation/decoding logic
- Passes `'synaxus'` slug explicitly to ensure correct URLs

### 3. Updated Generate Script
**File**: `generate-synaxus.php`

- Updated to use new function signature
- Passes JSON-LD array correctly to renderer

## Schema Structure

The generated JSON-LD follows this structure:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.applicants.io/#publisher",
      "name": "Applicants.io",
      ...
    },
    {
      "@type": "Organization",
      "@id": "https://www.applicants.io/employers/synaxus#organization",
      "name": "Synaxus Inc",
      ...
    },
    {
      "@type": "EmployerAggregateRating",
      "@id": "https://www.applicants.io/employers/synaxus#employerAggregateRating",
      "itemReviewed": {"@id": "https://www.applicants.io/employers/synaxus#organization"},
      "ratingValue": "4.8",
      "reviewCount": "20",
      "author": {"@id": "https://www.applicants.io/#publisher"}
    },
    // ... representative Review nodes
  ]
}
```

## Key Features

✅ **Server-Side Rendered**: JSON-LD is in the initial HTML, not injected client-side  
✅ **Publisher Identity**: Applicants.io clearly identified as independent publisher  
✅ **Proper @graph Structure**: Uses @graph format with @id references  
✅ **Representative Reviews**: Includes first 3 verified reviews as Review nodes  
✅ **Automatic Calculation**: Rating and review count calculated from actual verified review data  

## Verification

- JSON-LD outputs correctly in `<head>` section via `Seo::head()`
- Schema validates with proper structure
- Rating (4.8) and review count (20) match actual data
- Publisher and reviewed organization properly separated

## Next Steps

1. ✅ Deploy changes to Railway
2. Test with Google Rich Results Test tool
3. Request re-indexing in Google Search Console
4. Monitor for star ratings appearing in search results

## Files Modified

- `php-src/public/includes/reviews_employer.php` - Schema generation function
- `php-src/public/employers/synaxus/index.php` - Main employer page
- `generate-synaxus.php` - Static generation script

## Testing

To verify JSON-LD output:
```bash
# View the page source or use:
curl https://www.applicants.io/employers/synaxus | grep -A 50 "application/ld+json"
```

The JSON-LD script tag should appear in the `<head>` section with the complete @graph structure.



