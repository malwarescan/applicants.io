import React from 'react';
import { useParams } from 'react-router-dom';
import { generateSitemapChunk } from '../data/sitemap';

const SitemapChunk: React.FC = () => {
  const { chunkId } = useParams<{ chunkId: string }>();
  const sitemapXml = chunkId ? generateSitemapChunk(chunkId) : null;

  if (!sitemapXml) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-6">
              Sitemap Chunk Not Found
            </h1>
            <p className="text-gray-600">
              The requested sitemap chunk "{chunkId}" does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Sitemap Chunk: {chunkId}
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page displays the sitemap chunk for <code>{chunkId}</code>. 
              The XML content below is what search engines will see when they access <code>/sitemaps/{chunkId}.xml</code>.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Sitemap Chunk Info:</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Chunk ID: <code>{chunkId}</code></li>
                <li>• URL: <code>https://applicants.io/sitemaps/{chunkId}.xml</code></li>
                <li>• Last Modified: {new Date().toISOString().slice(0, 10)}</li>
                <li>• Change Frequency: Daily</li>
                <li>• Priority: 0.8</li>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation:</h2>
            <div className="flex flex-wrap gap-3">
              <a 
                href="/sitemap" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to Sitemap Index
              </a>
              <a 
                href="/" 
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapChunk;
