# Content Generation Guide

## Overview

This guide explains how to use the content generation templates to scale blog content production following the **APPLICANTS_CONTENT_AUTHORITY_KERNEL**.

## Quick Start

### Generate a Single Blog Post

```typescript
import { generateBlogPostFromTemplate } from './templates/blogPostTemplate';

const template = {
  role: 'Marketing Manager',
  industry: 'Marketing',
  location: 'Chicago, IL',
  pillar: 'hiring-guides',
  contentAudience: 'employer',
  seniority: 'mid-level'
};

const post = generateBlogPostFromTemplate(template, 'how-to-hire');
// Returns: Partial<BlogPost> with all required fields
```

### Generate Complete Role Cluster

```typescript
import { generateRoleCluster } from './templates/blogPostTemplate';

const template = {
  role: 'Marketing Manager',
  industry: 'Marketing',
  location: 'Chicago, IL',
  pillar: 'hiring-guides',
  contentAudience: 'employer',
  seniority: 'mid-level'
};

const cluster = generateRoleCluster(template);
// Returns: Array of 5 blog posts (complete cluster)
```

### PSEO Expansion (Role × Industry × Location)

```typescript
import { generatePSEOExpansion } from './templates/blogPostTemplate';

const posts = generatePSEOExpansion(
  'Software Developer',
  ['Technology', 'Finance', 'Healthcare'],
  ['San Francisco, CA', 'New York, NY', 'Austin, TX']
);
// Returns: 9 posts (3 industries × 3 locations)
```

## Post Types

### 1. "What Does" Post
- **Purpose**: Job-seeker focused career guide
- **Pillar**: `hr-operations`
- **Audience**: `job-seeker`
- **Content**: Daily responsibilities, work environment, career path

### 2. Salary Guide
- **Purpose**: Compensation information
- **Pillar**: `compensation`
- **Audience**: `job-seeker`
- **Content**: Salary ranges, benefits, negotiation tips

### 3. Interview Questions
- **Purpose**: Interview preparation
- **Pillar**: `interview-questions`
- **Audience**: `job-seeker`
- **Content**: Common questions, sample answers, tips

### 4. How to Hire
- **Purpose**: Employer hiring guide
- **Pillar**: `hiring-guides`
- **Audience**: `employer`
- **Content**: Hiring process, requirements, best practices

### 5. Job Description Writing
- **Purpose**: HR operations guide
- **Pillar**: `hr-operations`
- **Audience**: `employer`
- **Content**: Template, best practices, examples

## Content Customization

After generating a post, customize:

1. **Executive Summary**: Replace placeholders with actual content
2. **Key Insights**: Add real data (salary, growth rates, etc.)
3. **Content Body**: Write full article content (1,200-2,000 words)
4. **FAQs**: Add 3-5 relevant FAQs
5. **Salary Data**: Add actual salary ranges
6. **Responsibilities**: List specific role responsibilities
7. **Required Skills**: List actual required skills

## Workflow

1. **Generate Template**: Use `generateBlogPostFromTemplate()`
2. **Customize Content**: Fill in placeholders with real data
3. **Add Full Content**: Write complete article body
4. **Review**: Ensure compliance with kernel directives
5. **Publish**: Set `status: 'published'` and add to `blogPosts.ts`

## Scaling Strategy

### Phase 1: Complete Existing Clusters
- Generate missing posts for roles with partial clusters
- Target: 20 complete clusters (100 posts)

### Phase 2: New Role Clusters
- Generate complete clusters for new roles
- Target: 10 new roles (50 posts)

### Phase 3: PSEO Expansion
- Generate location/industry variations
- Target: 50 variations (50 posts)

### Total Target: 200 posts

## Quality Checklist

Before publishing, ensure:
- ✅ Word count meets requirements (1,200-2,000 for hiring guides)
- ✅ All placeholders replaced with real content
- ✅ FAQs added (3-5 per post)
- ✅ Salary data included (if applicable)
- ✅ Internal links added (2-3 per post)
- ✅ Schema markup correct
- ✅ Meta tags optimized
- ✅ Content audience tagged correctly
- ✅ No orphan pages (all posts linked)

## Automation Opportunities

1. **Data Sources**: Pull salary data from APIs
2. **Content Enrichment**: Use AI to expand templates
3. **Link Generation**: Auto-generate internal links
4. **Schema Generation**: Auto-generate structured data
5. **Validation**: Auto-validate kernel compliance

## Next Steps

1. Use templates to generate 20 more role clusters
2. Implement PSEO expansion for top 10 roles
3. Create automation scripts for bulk generation
4. Set up content review workflow
5. Track content production metrics

