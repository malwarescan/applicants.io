/**
 * Role Pillar Hub Page
 * Implements APPLICANTS_CONTENT_AUTHORITY_KERNEL pillar page directives
 * Master hub page for each role category with all cluster content
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAuthorityCluster } from '../services/authorityClusterService';
import { generateBlogUrl } from '../utils/blogUtils';
import SEOHead from '../components/SEOHead';

const RolePillarHub: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  
  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Role Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const roleDisplay = role.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const cluster = getAuthorityCluster(roleDisplay);
  const hasContent = cluster.blogPosts.howToHire || cluster.jobDescriptions.length > 0;

  return (
    <>
      <SEOHead
        title={`${roleDisplay} Jobs & Resources - Complete Guide | Applicants.IO`}
        description={`Complete ${roleDisplay} resource hub: job descriptions, hiring guides, salary data, interview questions, and career information.`}
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center">
              <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
              <li><span className="mx-2">/</span></li>
              <li><Link to="/blog" className="hover:text-gray-900">Blog</Link></li>
              <li><span className="mx-2">/</span></li>
              <li><Link to="/blog/jobs" className="hover:text-gray-900">Jobs</Link></li>
              <li><span className="mx-2">/</span></li>
              <li><span className="text-gray-900 font-medium">{roleDisplay}</span></li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {roleDisplay} - Complete Resource Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Everything you need to know about {roleDisplay} positions: job descriptions, hiring guides, salary information, interview questions, and career resources.
            </p>
          </header>

          {!hasContent ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                Content for {roleDisplay} is coming soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Blog Posts Section */}
                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {roleDisplay} Resources & Guides
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* What Does Role Do */}
                    {cluster.blogPosts.whatDoes ? (
                      <Link
                        to={generateBlogUrl(cluster.blogPosts.whatDoes)}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                            Career Guide
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          What Does a {roleDisplay} Do?
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {cluster.blogPosts.whatDoes.executiveSummary}
                        </p>
                      </Link>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">Coming soon: What does a {roleDisplay} do?</p>
                      </div>
                    )}

                    {/* Salary Guide */}
                    {cluster.blogPosts.salaryGuide ? (
                      <Link
                        to={generateBlogUrl(cluster.blogPosts.salaryGuide)}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            Salary Guide
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {roleDisplay} Salary Guide
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {cluster.blogPosts.salaryGuide.executiveSummary}
                        </p>
                      </Link>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">Coming soon: {roleDisplay} salary guide</p>
                      </div>
                    )}

                    {/* Interview Questions */}
                    {cluster.blogPosts.interviewQuestions ? (
                      <Link
                        to={generateBlogUrl(cluster.blogPosts.interviewQuestions)}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                            Interview Guide
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {roleDisplay} Interview Questions
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {cluster.blogPosts.interviewQuestions.executiveSummary}
                        </p>
                      </Link>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">Coming soon: {roleDisplay} interview questions</p>
                      </div>
                    )}

                    {/* How to Hire */}
                    {cluster.blogPosts.howToHire ? (
                      <Link
                        to={generateBlogUrl(cluster.blogPosts.howToHire)}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                            Hiring Guide
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          How to Hire a {roleDisplay}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {cluster.blogPosts.howToHire.executiveSummary}
                        </p>
                      </Link>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">Coming soon: How to hire a {roleDisplay}</p>
                      </div>
                    )}

                    {/* Job Description Guide */}
                    {cluster.blogPosts.jobDescriptionGuide ? (
                      <Link
                        to={generateBlogUrl(cluster.blogPosts.jobDescriptionGuide)}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded">
                            HR Guide
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          How to Write a {roleDisplay} Job Description
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {cluster.blogPosts.jobDescriptionGuide.executiveSummary}
                        </p>
                      </Link>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">Coming soon: How to write a {roleDisplay} job description</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Job Descriptions Section */}
                {cluster.jobDescriptions.length > 0 && (
                  <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Available {roleDisplay} Positions
                    </h2>
                    <div className="space-y-4">
                      {cluster.jobDescriptions.slice(0, 10).map(job => (
                        <Link
                          key={job.id}
                          to={`/enhanced-jobs/${job.id}`}
                          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 mb-2">{job.company}</p>
                              <p className="text-gray-500 text-sm">{job.location}</p>
                              {job.compensation && (
                                <p className="text-gray-900 font-semibold mt-2">
                                  {job.compensation}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {cluster.jobDescriptions.length > 10 && (
                      <div className="mt-6 text-center">
                        <Link
                          to={`/enhanced-jobs?search=${encodeURIComponent(roleDisplay)}`}
                          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          View All {roleDisplay} Jobs ({cluster.jobDescriptions.length})
                        </Link>
                      </div>
                    )}
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Blog Posts</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.values(cluster.blogPosts).filter(Boolean).length} / 5
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Job Listings</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {cluster.jobDescriptions.length}
                      </div>
                    </div>
                    {cluster.industry && (
                      <div>
                        <div className="text-sm text-gray-600">Industry</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {cluster.industry}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Related Roles */}
                {cluster.relatedRoles.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Related Roles</h3>
                    <ul className="space-y-2">
                      {cluster.relatedRoles.map(relatedRole => (
                        <li key={relatedRole}>
                          <Link
                            to={`/roles/${relatedRole.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {relatedRole}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Category Links */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Browse Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/blog/hiring-guides"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Hiring Guides →
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog/interview-questions"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Interview Questions →
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog/compensation"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Compensation →
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog/hr-operations"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        HR Operations →
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Related Roles Navigation */}
                {cluster.relatedRoles.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Explore Related Roles</h3>
                    <ul className="space-y-2">
                      {cluster.relatedRoles.map(relatedRole => (
                        <li key={relatedRole}>
                          <Link
                            to={`/roles/${relatedRole.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                          >
                            {relatedRole}
                            <span className="ml-1">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RolePillarHub;

