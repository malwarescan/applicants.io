import React, { useEffect } from 'react';
import { generateSitemapIndex } from '../data/sitemap';

const SitemapIndex: React.FC = () => {
  const sitemapXml = generateSitemapIndex();

  // If this is a direct request for XML (not HTML), return raw XML
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/sitemap.xml' || path.endsWith('.xml')) {
      // Set content type to XML
      document.contentType = 'application/xml';
      
      // Replace entire document with XML
      document.open();
      document.write(sitemapXml);
      document.close();
      return;
    }
  }, [sitemapXml]);

  // For HTML view (when accessing /sitemap)
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Sitemap Index
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page displays the sitemap index for Applicants.io. 
              The XML content below is what search engines will see when they access <code>/sitemap.xml</code>.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Submit <code>https://applicants.io/sitemap.xml</code> to Google Search Console</li>
                <li>• The sitemap index points to individual sitemap chunks</li>
                <li>• Each chunk contains up to 50,000 URLs (Google's limit)</li>
                <li>• URLs are organized by category, location, and page type</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Sitemap XML:</h2>
            <pre className="text-sm text-gray-800 overflow-x-auto">
              <code>{sitemapXml}</code>
            </pre>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Individual Sitemap Chunks:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Main Pages</h3>
                <p className="text-sm text-gray-600 mb-2">Core site pages and navigation</p>
                <a 
                  href="/sitemaps/main.xml" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View /sitemaps/main.xml →
                </a>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Job Categories</h3>
                <p className="text-sm text-gray-600 mb-2">All job category pages</p>
                <a 
                  href="/sitemaps/categories.xml" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View /sitemaps/categories.xml →
                </a>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Locations</h3>
                <p className="text-sm text-gray-600 mb-2">State and city job hubs</p>
                <a 
                  href="/sitemaps/locations.xml" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View /sitemaps/locations.xml →
                </a>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Category + Location</h3>
                <p className="text-sm text-gray-600 mb-2">Combined category and location pages</p>
                <a 
                  href="/sitemaps/category-location.xml" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View /sitemaps/category-location.xml →
                </a>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Blog Posts</h3>
                <p className="text-sm text-gray-600 mb-2">All blog articles and hiring guides</p>
                <a 
                  href="/sitemaps/blog.xml" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View /sitemaps/blog.xml →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Next Steps:</h3>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Set up server-side routing to serve these as actual XML files</li>
              <li>• Add individual job URLs as you create more job listings</li>
              <li>• Implement dynamic lastmod dates based on content updates</li>
              <li>• Add priority and changefreq based on content importance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapIndex;
