import React, { useEffect } from 'react';
import { generateJobSchema, generateOrganizationSchema, generateWebsiteSchema } from '../utils/seoUtils';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  structuredData?: object;
  ogImage?: string;
  metaTags?: Array<{ name?: string; property?: string; content: string }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Applicants.IO - Find Your Dream Job',
  description = 'Discover thousands of job opportunities across various industries. Find your next career move with our comprehensive job board platform.',
  keywords = 'jobs, careers, employment, job search, hiring, recruitment',
  canonical,
  structuredData,
  ogImage,
  metaTags
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // If metaTags array is provided, use it (for blog posts)
    if (metaTags && metaTags.length > 0) {
      metaTags.forEach(tag => {
        if (tag.name) {
          updateMetaTag(tag.name, tag.content, 'name');
        }
        if (tag.property) {
          updateMetaTag(tag.property, tag.content, 'property');
        }
      });
    } else {
      // Otherwise use individual props (for regular pages)
      // Update meta description
      updateMetaTag('description', description);
      updateMetaTag('keywords', keywords);

      // Update canonical URL
      if (canonical) {
        updateCanonical(canonical);
      }

      // Update Open Graph tags
      updateMetaTag('og:title', title, 'property');
      updateMetaTag('og:description', description, 'property');
      updateMetaTag('og:url', window.location.href, 'property');
      updateMetaTag('og:image', ogImage || `${window.location.origin}/logo.png`, 'property');

      // Update Twitter Card tags
      updateMetaTag('twitter:title', title);
      updateMetaTag('twitter:description', description);
      updateMetaTag('twitter:image', ogImage || `${window.location.origin}/logo.png`);
    }

    // Add structured data
    if (structuredData) {
      addStructuredData(structuredData);
    }

    // Add default organization and website schemas
    addStructuredData(generateOrganizationSchema());
    addStructuredData(generateWebsiteSchema());

  }, [title, description, keywords, canonical, structuredData, ogImage, metaTags]);

  return null; // This component doesn't render anything
};

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
}

function updateCanonical(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  
  canonical.href = url;
}

function addStructuredData(data: object) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

export default SEOHead;
