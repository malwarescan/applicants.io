import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Contact from './pages/Contact';
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
import BlogListing from './pages/BlogListing';
import BlogCategory from './pages/BlogCategory';
import BlogPost from './pages/BlogPost';
import BlogFeed from './pages/BlogFeed';
import BlogJobsListing from './pages/BlogJobsListing';
import RolePillarHub from './pages/RolePillarHub';

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
            {/* Enhanced job flow routes */}
            <Route path="/enhanced-jobs" element={<EnhancedJobSearchPage />} />
            <Route path="/enhanced-post-job" element={<EnhancedPostJobPage />} />
            <Route path="/enhanced-jobs/:id" element={<EnhancedJobDetailPage />} />
            {/* Sitemap routes */}
            <Route path="/sitemap" element={<SitemapIndex />} />
            <Route path="/sitemap.xml" element={<SitemapIndex />} />
            <Route path="/sitemaps/:chunkId.xml" element={<SitemapChunk />} />
            {/* Blog routes */}
            <Route path="/blog" element={<BlogListing />} />
            <Route path="/blog/jobs" element={<BlogJobsListing />} />
            <Route path="/blog/:pillar" element={<BlogCategory />} />
            {/* Role pillar hub pages */}
            <Route path="/roles/:role" element={<RolePillarHub />} />
            <Route path="/how-to-hire/:slug" element={<BlogPost />} />
            <Route path="/interview-questions/:slug" element={<BlogPost />} />
            <Route path="/hr/:slug" element={<BlogPost />} />
            <Route path="/compliance/:slug" element={<BlogPost />} />
            <Route path="/compensation/:slug" element={<BlogPost />} />
            {/* Blog feed routes */}
            <Route path="/feeds/:feedType.ndjson" element={<BlogFeed />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>;
}