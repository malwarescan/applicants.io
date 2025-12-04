/**
 * Blog Listing Page
 * Shows all blog posts organized by pillar
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { getPublishedPosts } from '../data/blogPosts';
import { generateBlogUrl } from '../utils/blogUtils';
import { ContentPillar } from '../types/blog';
import { getContentAudienceStats } from '../utils/contentAudienceUtils';
import SEOHead from '../components/SEOHead';

const pillarNames: Record<ContentPillar, string> = {
  'hiring-guides': 'Hiring Guides',
  'interview-questions': 'Interview Questions',
  'hr-operations': 'HR Operations',
  'compliance': 'Compliance',
  'compensation': 'Compensation'
};

const BlogListing: React.FC = () => {
  const allPosts = getPublishedPosts();
  const audienceStats = getContentAudienceStats();
  
  const postsByPillar: Record<ContentPillar, typeof allPosts> = {
    'hiring-guides': [],
    'interview-questions': [],
    'hr-operations': [],
    'compliance': [],
    'compensation': []
  };

  allPosts.forEach(post => {
    postsByPillar[post.pillar].push(post);
  });

  return (
    <>
      <SEOHead
        title="Blog - Hiring Guides, Interview Questions & HR Resources | Applicants.IO"
        description="Expert hiring guides, interview questions, HR best practices, compliance resources, and compensation data for employers."
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Applicants.IO Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert hiring guides, interview questions, HR best practices, compliance resources, and compensation data to help you build better teams.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link
                to="/blog/jobs"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View All Jobs
              </Link>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600 mr-2">Content Split:</span>
                <span className="text-sm font-semibold text-green-600">{audienceStats.jobSeekerPercentage}% Job Seeker</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-semibold text-blue-600">{audienceStats.employerPercentage}% Employer</span>
              </div>
            </div>
          </header>

          {/* Content Pillars */}
          {Object.entries(postsByPillar).map(([pillar, posts]) => {
            if (posts.length === 0) return null;
            
            return (
              <section key={pillar} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {pillarNames[pillar as ContentPillar]}
                  </h2>
                  <Link
                    to={`/blog/${pillar}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(0, 6).map(post => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <Link to={generateBlogUrl(post)}>
                        <div className="p-6">
                          <div className="mb-3">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              {pillarNames[post.pillar]}
                            </span>
                            {post.role && (
                              <span className="ml-2 inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                                {post.role}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {post.executiveSummary}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <time dateTime={post.publishedDate}>
                              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            <span className="mx-2">•</span>
                            <span>{post.wordCount} words</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BlogListing;

