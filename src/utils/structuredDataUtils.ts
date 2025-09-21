import { SEOEnhancedJob } from '../services/seoJobService';

// Generate JobPosting structured data for individual jobs
export const generateJobPostingSchema = (job: SEOEnhancedJob) => {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.postedDate,
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    "employmentType": job.employmentType?.toUpperCase().replace('-', '_') || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": `https://applicants.io/company/${job.company.toLowerCase().replace(/\s+/g, '-')}`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "US"
      }
    },
    "baseSalary": job.salaryMin && job.salaryMax ? {
      "@type": "MonetaryAmount",
      "currency": job.currency || "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salaryMin,
        "maxValue": job.salaryMax,
        "unitText": "YEAR"
      }
    } : undefined,
    "workHours": job.employmentType === 'full-time' ? "40 hours per week" : undefined,
    "responsibilities": job.responsibilities?.join(". "),
    "qualifications": job.requirements?.join(". "),
    "jobBenefits": [
      "Competitive salary",
      "Growth opportunities",
      "Professional development"
    ],
    "skills": job.requirements || [],
    "url": `https://applicants.io/enhanced-jobs/${job.id}`,
    "applicationInstructions": job.applyUrl || `Apply via email to ${job.contactEmail}`,
    "jobLocationType": job.remote ? "TELECOMMUTE" : "TELECOMMUTE"
  };
};

// Generate CollectionPage structured data for job categories
export const generateCategoryPageSchema = (categoryName: string, jobs: SEOEnhancedJob[], jobType: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} Jobs`,
    "description": `Find ${categoryName.toLowerCase()} jobs with AI-powered matching. Browse available positions and apply today.`,
    "url": `https://applicants.io/jobs/category/${jobType}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": jobs.length,
      "itemListElement": jobs.map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": generateJobPostingSchema(job)
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://applicants.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Jobs",
          "item": "https://applicants.io/enhanced-jobs"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${categoryName} Jobs`,
          "item": `https://applicants.io/jobs/category/${jobType}`
        }
      ]
    }
  };
};

// Generate Organization structured data for the company
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Applicants.io",
    "url": "https://applicants.io",
    "logo": "https://applicants.io/logo.png",
    "description": "AI-powered recruiting platform that showcases applicants' strengths and connects them with employers who value their skills.",
    "foundingDate": "2024",
    "industry": "Human Resources Technology",
    "sameAs": [
      "https://linkedin.com/company/applicants-io",
      "https://twitter.com/applicants_io"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "Customer Service",
      "email": "support@applicants.io",
      "availableLanguage": ["English", "Spanish"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "serviceType": "Job Search and Recruitment"
  };
};

// Generate WebSite structured data with search functionality
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Applicants.io",
    "url": "https://applicants.io",
    "description": "AI-powered job search platform connecting qualified candidates with employers",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://applicants.io/enhanced-jobs?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Applicants.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://applicants.io/logo.png"
      }
    }
  };
};

// Generate FAQ structured data for common questions
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate BreadcrumbList structured data
export const generateBreadcrumbSchema = (breadcrumbs: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// Utility to sanitize and format structured data
export const formatStructuredData = (data: any) => {
  // Remove undefined values to keep JSON-LD clean
  const removeUndefined = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(removeUndefined).filter(item => item !== undefined);
    } else if (obj !== null && typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          const cleanedValue = removeUndefined(value);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
      }
      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }
    return obj;
  };

  return removeUndefined(data);
};

// Generate sitemap data for SEO
export const generateSitemapData = (jobs: SEOEnhancedJob[], jobTypes: string[]) => {
  const baseUrl = 'https://applicants.io';
  const pages = [
    { url: `${baseUrl}/`, priority: 1.0, changefreq: 'daily' },
    { url: `${baseUrl}/enhanced-jobs`, priority: 0.9, changefreq: 'daily' },
    { url: `${baseUrl}/enhanced-post-job`, priority: 0.8, changefreq: 'weekly' },
    { url: `${baseUrl}/contact`, priority: 0.7, changefreq: 'monthly' }
  ];

  // Add job category pages
  jobTypes.forEach(jobType => {
    pages.push({
      url: `${baseUrl}/jobs/category/${jobType}`,
      priority: 0.8,
      changefreq: 'weekly'
    });
  });

  // Add individual job pages
  jobs.forEach(job => {
    pages.push({
      url: `${baseUrl}/enhanced-jobs/${job.id}`,
      priority: 0.7,
      changefreq: 'weekly'
    });
  });

  return pages;
};
