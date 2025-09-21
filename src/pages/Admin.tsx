import React from 'react';
import JobIntegrationPanel from '../components/JobIntegrationPanel';
import { generateSitemapIndex, SITEMAP_URLS } from '../data/sitemap';

const Admin = () => {
  const sitemapEntries = Object.keys(SITEMAP_URLS);
  
  const handleDownloadSitemap = () => {
    // Generate sitemap index
    const sitemapXml = generateSitemapIndex();
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadRobots = () => {
    // Generate robots.txt content
    const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://applicants.io/sitemap.xml
Sitemap: https://applicants.io/sitemaps/main.xml
Sitemap: https://applicants.io/sitemaps/categories.xml
Sitemap: https://applicants.io/sitemaps/locations.xml
Sitemap: https://applicants.io/sitemaps/category-location.xml

# Crawl delay (optional)
Crawl-delay: 1`;
    
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-headline font-medium mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage your job board settings and integrations.</p>
      </div>

      <div className="space-y-8">
        {/* Job Integration Section */}
        <section>
          <JobIntegrationPanel />
        </section>

        {/* Additional Admin Sections */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-headline font-medium mb-4">Site Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-blue-800">Total Jobs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-green-800">External Jobs</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1</div>
              <div className="text-sm text-purple-800">Active Integrations</div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-headline font-medium mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Refresh All Jobs
            </button>
            <button className="w-full md:w-auto ml-0 md:ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Clear Cache
            </button>
            <button className="w-full md:w-auto ml-0 md:ml-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Export Job Data
            </button>
          </div>
        </section>

        {/* SEO Tools */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-headline font-medium mb-4">SEO Tools</h3>
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-3">
              Generate SEO files for better search engine visibility:
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleDownloadSitemap}
                className="w-full md:w-auto px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Download Sitemap ({sitemapEntries.length} URLs)
              </button>
              <button 
                onClick={handleDownloadRobots}
                className="w-full md:w-auto ml-0 md:ml-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Download Robots.txt
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <strong>SEO Status:</strong> {sitemapEntries.length} pages indexed • All job pages have structured data • SEO-friendly URLs enabled
          </div>
        </section>

        {/* Integration Status */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-headline font-medium mb-4">Integration Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">Synaxus Inc. Integration</div>
                <div className="text-sm text-gray-600">Direct API connection to synaxusinc.com</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
