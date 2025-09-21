import React from 'react';
import { Link } from 'react-router-dom';
import { seoJobService } from '../services/seoJobService';

interface JobCategoryNavProps {
  className?: string;
  showStats?: boolean;
}

const JobCategoryNav: React.FC<JobCategoryNavProps> = ({ className = '', showStats = false }) => {
  const jobTypes = seoJobService.getJobTypes();
  const seoJobs = seoJobService.getAllSEOJobs();

  // Calculate stats for each category
  const getCategoryStats = (jobType: string) => {
    const categoryJobs = seoJobs.filter(job => job.job_type === jobType);
    return {
      total: categoryJobs.length,
      highVolume: categoryJobs.filter(job => job.search_volume === 'high').length,
      lowCompetition: categoryJobs.filter(job => job.competition_level === 'low').length
    };
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <h2 className="text-xl font-headline font-semibold text-gray-900 mb-4">
          Job Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobTypes.map(jobType => {
            const displayName = seoJobService.getJobTypeDisplayName(jobType);
            const stats = getCategoryStats(jobType);
            const primaryJob = seoJobs.find(job => job.job_type === jobType);
            
            return (
              <Link
                key={jobType}
                to={`/jobs/category/${jobType}`}
                className="group block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {displayName}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {stats.total} jobs
                  </div>
                </div>
                
                {primaryJob && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {primaryJob.meta_description.substring(0, 100)}...
                  </p>
                )}
                
                {showStats && (
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {stats.highVolume} high volume
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {stats.lowCompetition} low competition
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            to="/enhanced-jobs"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Jobs
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCategoryNav;
