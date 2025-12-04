# Google Search Console Action Plan
## Post-Deployment Checklist

**Date**: After Content Authority Kernel deployment  
**Priority**: High - Do this immediately after deployment

---

## 🎯 Immediate Actions (Do First)

### 1. Submit Sitemap
**Location**: Sitemaps → Add new sitemap

**Action**:
1. Go to Google Search Console
2. Navigate to **Sitemaps** in the left sidebar
3. Enter: `https://applicants.io/sitemap.xml`
4. Click **Submit**

**What this does**:
- Tells Google about all your pages
- Includes all 5 sitemap chunks (main, categories, locations, category-location, blog)
- Automatically discovers all 24 blog posts
- Helps Google index your new content faster

**Expected Result**:
- Status: "Success"
- Google will discover all chunks automatically
- Blog sitemap will show 24 URLs

---

### 2. Request Indexing for Key Pages
**Location**: URL Inspection → Request Indexing

**Priority Pages to Request Indexing**:

1. **Home Page**
   - URL: `https://applicants.io/`
   - Why: Main entry point

2. **Blog Hub**
   - URL: `https://applicants.io/blog`
   - Why: Central blog landing page

3. **Pillar Hub Pages** (4 pages)
   - `https://applicants.io/roles/retail-cashier`
   - `https://applicants.io/roles/software-developer`
   - `https://applicants.io/roles/registered-nurse`
   - `https://applicants.io/roles/customer-service-representative`
   - Why: Authority cluster hubs

4. **Top Blog Posts** (5-10 posts)
   - `https://applicants.io/how-to-hire/retail-cashier`
   - `https://applicants.io/how-to-hire/software-developer`
   - `https://applicants.io/compensation/retail-cashier-salary`
   - `https://applicants.io/interview-questions/retail-cashier`
   - Why: High-value content

**How to Request**:
1. Use URL Inspection tool
2. Paste each URL
3. Click **Request Indexing**
4. Wait for "URL is on Google" confirmation

**Note**: Don't request all 24 posts at once - Google limits requests. Do 5-10 per day.

---

## 📊 Monitoring & Verification

### 3. Verify Sitemap Status
**Location**: Sitemaps

**Check**:
- ✅ Sitemap index submitted successfully
- ✅ All 5 chunks discovered
- ✅ Blog sitemap shows 24 URLs
- ✅ No errors reported

**Timeline**: Check back in 24-48 hours

---

### 4. Check Coverage Report
**Location**: Coverage

**What to Look For**:
- **Valid**: Should show all your pages
- **Excluded**: Check for any unexpected exclusions
- **Errors**: Fix any 404s or crawl errors
- **Warnings**: Review and address

**Key Metrics**:
- Total valid pages should include:
  - Main pages (6)
  - Categories (21)
  - Locations (~20)
  - Category-location combinations (~20)
  - Blog posts (24)
  - **Total: ~90+ pages**

---

### 5. Verify Structured Data
**Location**: Enhancements → Structured Data

**What to Check**:

1. **Article Schema** (Blog Posts)
   - Should see 24 articles
   - Check for any errors
   - Verify all required fields present

2. **FAQPage Schema** (Blog Posts + Jobs)
   - Should see FAQs from blog posts
   - Check job description FAQs
   - Verify no errors

3. **JobPosting Schema** (Job Pages)
   - Verify job pages have proper schema
   - Check for any errors

4. **BreadcrumbList Schema**
   - Verify breadcrumbs working
   - Check for errors

**Action if Errors Found**:
- Use Rich Results Test tool
- Fix schema issues
- Re-request indexing

---

### 6. Monitor Performance
**Location**: Performance

**Key Metrics to Track**:

1. **Impressions**
   - Should increase as pages get indexed
   - Monitor blog post impressions

2. **Clicks**
   - Track clicks to blog posts
   - Monitor job description clicks

3. **CTR (Click-Through Rate)**
   - Aim for 2-5% CTR
   - Optimize meta descriptions if low

4. **Average Position**
   - Track ranking improvements
   - Monitor long-tail keyword positions

**Queries to Monitor**:
- "how to hire [role]"
- "[role] interview questions"
- "[role] salary"
- "[role] job description"

---

## 🔍 Ongoing Tasks

### 7. Monitor Search Appearance
**Location**: Enhancements

**Check**:
- ✅ Rich results showing correctly
- ✅ FAQs appearing in search
- ✅ Breadcrumbs displaying
- ✅ Job postings showing rich results

---

### 8. Check Mobile Usability
**Location**: Mobile Usability

**Verify**:
- All pages mobile-friendly
- No mobile usability errors
- Fast loading times

---

### 9. Monitor Core Web Vitals
**Location**: Core Web Vitals

**Track**:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**Target**: All metrics in "Good" range

---

### 10. Set Up Alerts
**Location**: Settings → Users and permissions

**Action**:
- Enable email notifications for:
  - Coverage errors
  - Security issues
  - Manual actions
  - Mobile usability issues

---

## 📈 Content-Specific Actions

### 11. Monitor Blog Post Indexing
**Location**: Coverage → Valid pages

**Check**:
- All 24 blog posts indexed
- Pillar hub pages indexed
- Category pages indexed

**If Not Indexed**:
- Wait 1-2 weeks (normal indexing time)
- If still not indexed after 2 weeks, request indexing
- Check for crawl errors

---

### 12. Track Long-Tail Keywords
**Location**: Performance → Queries

**Monitor**:
- "how to hire [role]" queries
- "[role] interview questions" queries
- "[role] salary" queries
- "[role] job description" queries

**Action**:
- Track which queries are ranking
- Optimize content for high-impression, low-CTR queries
- Create more content for high-opportunity queries

---

### 13. Verify Internal Linking
**Location**: Links

**Check**:
- Internal links are being discovered
- Blog posts linking to job descriptions
- Job descriptions linking to blog posts
- No broken internal links

---

## 🚨 Troubleshooting

### If Sitemap Shows Errors:
1. Check sitemap XML is valid
2. Verify all URLs are accessible
3. Check for 404 errors
4. Fix and resubmit

### If Pages Not Indexing:
1. Check robots.txt (should allow crawling)
2. Verify no noindex tags
3. Check for crawl errors
4. Request indexing manually

### If Structured Data Errors:
1. Use Rich Results Test
2. Fix schema issues
3. Re-request indexing
4. Wait 24-48 hours

---

## 📅 Timeline

### Day 1 (Today)
- ✅ Submit sitemap
- ✅ Request indexing for 5-10 key pages
- ✅ Verify sitemap status

### Week 1
- Monitor coverage report
- Check for indexing progress
- Verify structured data
- Fix any errors

### Week 2-4
- Monitor performance metrics
- Track keyword rankings
- Optimize based on data
- Request indexing for remaining pages

### Ongoing
- Weekly performance review
- Monthly content audit
- Track keyword improvements
- Monitor for errors

---

## 🎯 Success Metrics

**After 1 Month, You Should See**:
- ✅ All 24 blog posts indexed
- ✅ Sitemap showing 90+ valid pages
- ✅ Impressions increasing
- ✅ Clicks to blog posts
- ✅ Long-tail keywords ranking
- ✅ Rich results appearing

**After 3 Months**:
- Significant increase in organic traffic
- Blog posts ranking for target keywords
- Job descriptions ranking for role-specific queries
- Authority building (backlinks, mentions)

---

## 📝 Quick Reference

**GSC URLs**:
- Sitemaps: `https://search.google.com/search-console/sitemaps`
- URL Inspection: `https://search.google.com/search-console/inspect`
- Coverage: `https://search.google.com/search-console/index?resource_id=...`
- Performance: `https://search.google.com/search-console/performance`

**Your Sitemap**: `https://applicants.io/sitemap.xml`

**Priority Pages**:
1. Home: `https://applicants.io/`
2. Blog: `https://applicants.io/blog`
3. Pillar Hubs: `/roles/:role`
4. Top Blog Posts: `/how-to-hire/:slug`

---

## ✅ Checklist

- [ ] Submit sitemap (`https://applicants.io/sitemap.xml`)
- [ ] Request indexing for home page
- [ ] Request indexing for blog hub
- [ ] Request indexing for 4 pillar hub pages
- [ ] Request indexing for 5-10 top blog posts
- [ ] Verify sitemap status (24-48 hours)
- [ ] Check coverage report
- [ ] Verify structured data
- [ ] Monitor performance metrics
- [ ] Set up email alerts
- [ ] Track keyword rankings
- [ ] Monitor for errors weekly

---

**Next Steps**: Start with sitemap submission and key page indexing requests. This is the highest priority action.

