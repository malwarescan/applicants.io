/**
 * Blog Category Page
 * Shows posts for a specific content pillar
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostsByPillar } from '../data/blogPosts';
import { generateBlogUrl, getPillarBasePath } from '../utils/blogUtils';
import { ContentPillar } from '../types/blog';
import SEOHead from '../components/SEOHead';

const pillarNames: Record<ContentPillar, string> = {
  'hiring-guides': 'Hiring Guides',
  'interview-questions': 'Interview Questions',
  'hr-operations': 'HR Operations',
  'compliance': 'Compliance',
  'compensation': 'Compensation'
};

const pillarDescriptions: Record<ContentPillar, string> = {
  'hiring-guides': 'Complete guides on how to hire for specific roles, including salary data, interview questions, and best practices.',
  'interview-questions': 'Role-specific interview question frameworks to help you evaluate candidates effectively.',
  'hr-operations': 'HR best practices, management strategies, onboarding processes, and performance management.',
  'compliance': 'Workplace policies, reporting requirements, labor law compliance, and legal best practices.',
  'compensation': 'Salary guidance, benefits structures, incentive programs, and competitive compensation data.'
};

const BlogCategory: React.FC = () => {
  const { pillar } = useParams<{ pillar: string }>();
  
  if (!pillar || !Object.keys(pillarNames).includes(pillar)) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const pillarKey = pillar as ContentPillar;
  const posts = getPostsByPillar(pillarKey);

  return (
    <>
      <SEOHead
        title={`${pillarNames[pillarKey]} - Applicants.IO Blog`}
        description={pillarDescriptions[pillarKey]}
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="mb-8 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-gray-900">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{pillarNames[pillarKey]}</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {pillarNames[pillarKey]}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              {pillarDescriptions[pillarKey]}
            </p>
          </header>

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                No posts available in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={generateBlogUrl(post)}>
                    <div className="p-6">
                      <div className="mb-3">
                        {post.role && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                            {post.role}
                          </span>
                        )}
                        {post.industry && (
                          <span className="ml-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                            {post.industry}
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
          )}
        </div>
      </div>
    </>
  );
};

export default BlogCategory;

