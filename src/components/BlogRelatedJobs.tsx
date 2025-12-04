/**
 * Blog Related Jobs Component
 * Shows jobs related to the blog post using unified job service
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EnhancedJob } from '../types/job';
import { getRelatedJobsForBlogPost } from '../services/unifiedJobService';

interface BlogRelatedJobsProps {
  role?: string;
  industry?: string;
}

const BlogRelatedJobs: React.FC<BlogRelatedJobsProps> = ({ role, industry }) => {
  const [jobs, setJobs] = useState<EnhancedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = () => {
      setLoading(true);
      try {
        const relatedJobs = getRelatedJobsForBlogPost(role, industry);
        setJobs(relatedJobs);
      } catch (error) {
        console.error('Error loading related jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [role, industry]);

  if (loading) {
    return (
      <section className="mt-12 py-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Job Openings</h2>
        <p className="text-gray-600">Loading jobs...</p>
      </section>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 py-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Related Job Openings</h2>
        <Link
          to="/enhanced-jobs"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
        >
          View All Jobs →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map(job => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  <Link
                    to={`/enhanced-jobs/${job.id}`}
                    className="hover:text-blue-600"
                  >
                    {job.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">{job.company}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {job.location}
              </span>
              {job.industry && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {job.industry}
                </span>
              )}
              {job.remote && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  Remote
                </span>
              )}
            </div>
            
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>
            
            {job.compensation && (
              <p className="text-gray-900 font-semibold text-sm mb-4">
                {job.compensation}
              </p>
            )}
            
            <Link
              to={`/enhanced-jobs/${job.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              View Job
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogRelatedJobs;


