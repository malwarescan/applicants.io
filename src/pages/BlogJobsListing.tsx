/**
 * Blog Jobs Listing Page
 * Shows all jobs connected to the same source as enhanced-jobs
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EnhancedJob } from '../types/job';
import { getAllUnifiedJobs } from '../services/unifiedJobService';
import SEOHead from '../components/SEOHead';

const BlogJobsListing: React.FC = () => {
  const [jobs, setJobs] = useState<EnhancedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = () => {
      setLoading(true);
      try {
        const allJobs = getAllUnifiedJobs();
        setJobs(allJobs.filter(job => job.isActive !== false));
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <>
      <SEOHead
        title="All Jobs - Applicants.IO"
        description="Browse all available job openings across all industries and locations."
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Job Openings
            </h1>
            <p className="text-xl text-gray-600">
              Browse all available positions from our unified job database
            </p>
            <Link
              to="/enhanced-jobs"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
            >
              Use Advanced Search →
            </Link>
          </header>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                No jobs available at this time.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-gray-600">
                Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/enhanced-jobs/${job.id}`}>
                      <div className="p-6">
                        <div className="mb-3">
                          {job.industry && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              {job.industry}
                            </span>
                          )}
                          {job.remote && (
                            <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                              Remote
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                        <p className="text-gray-500 text-sm mb-4">{job.location}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {job.description}
                        </p>
                        {job.compensation && (
                          <p className="text-gray-900 font-semibold text-sm mb-4">
                            {job.compensation}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-500">
                          <time dateTime={job.postedDate}>
                            {job.postedDate}
                          </time>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogJobsListing;

