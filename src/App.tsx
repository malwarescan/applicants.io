import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import CategoryPage from './pages/CategoryPage';
import LocationPage from './pages/LocationPage';
import CompanyPage from './pages/CompanyPage';
import Navbar from './components/Navbar';
import EnhancedJobSearchPage from './pages/EnhancedJobSearch';
import EnhancedPostJobPage from './pages/EnhancedPostJob';
import EnhancedJobDetailPage from './pages/EnhancedJobDetail';
import SEOJobCategoryPage from './pages/SEOJobCategoryPage';
import SitemapIndex from './pages/SitemapIndex';
import SitemapChunk from './pages/SitemapChunk';

export function App() {
  return <div className="min-h-screen bg-white">
      <BrowserRouter>
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Home />} />
            {/* SEO-friendly job URLs */}
            <Route path="/jobs/:company/:titleLocationId" element={<JobDetail />} />
            {/* Legacy job URLs for backwards compatibility */}
            <Route path="/jobs/:id" element={<JobDetail />} />
            {/* Category pages */}
            <Route path="/jobs/category/:category" element={<CategoryPage />} />
            {/* SEO-optimized category pages */}
            <Route path="/jobs/category/:jobType" element={<SEOJobCategoryPage />} />
            {/* Location pages */}
            <Route path="/jobs/location/:location" element={<LocationPage />} />
            {/* Company pages */}
            <Route path="/jobs/company/:company" element={<CompanyPage />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* Enhanced job flow routes */}
            <Route path="/enhanced-jobs" element={<EnhancedJobSearchPage />} />
            <Route path="/enhanced-post-job" element={<EnhancedPostJobPage />} />
            <Route path="/enhanced-jobs/:id" element={<EnhancedJobDetailPage />} />
            {/* Sitemap routes */}
            <Route path="/sitemap" element={<SitemapIndex />} />
            <Route path="/sitemap.xml" element={<SitemapIndex />} />
            <Route path="/sitemaps/:chunkId.xml" element={<SitemapChunk />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>;
}