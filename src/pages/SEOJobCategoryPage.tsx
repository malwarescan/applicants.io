import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { seoJobService } from '../services/seoJobService';
import { SEOEnhancedJob } from '../services/seoJobService';
import SEOHead from '../components/SEOHead';
import JobListing from '../components/JobListing';

const SEOJobCategoryPage: React.FC = () => {
  const { jobType } = useParams<{ jobType: string }>();
  const [jobs, setJobs] = useState<SEOEnhancedJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Get SEO job data for this category
  const seoJobData = useMemo(() => {
    if (!jobType) return null;
    return seoJobService.getJobsByType(jobType);
  }, [jobType]);

  // Get enhanced jobs for this category
  useEffect(() => {
    if (!jobType) return;

    const categoryJobs = seoJobService.getEnhancedJobs().filter(job => job.industry === jobType);
    setJobs(categoryJobs);
    setLoading(false);
  }, [jobType]);

  if (!jobType || !seoJobData || seoJobData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-headline font-medium text-gray-900 mb-4">
              Job Category Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The job category you're looking for doesn't exist.
            </p>
            <Link 
              to="/enhanced-jobs" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = seoJobService.getJobTypeDisplayName(jobType);
  const primarySEOJob = seoJobData[0]; // Use first job for SEO meta data
  const highVolumeCount = seoJobData.filter(job => job.search_volume === 'high').length;
  const lowCompetitionCount = seoJobData.filter(job => job.competition_level === 'low').length;

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${displayName} Jobs`,
    "description": primarySEOJob.meta_description,
    "url": `https://applicants.io/jobs/category/${jobType}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": jobs.length,
      "itemListElement": jobs.map((job, index) => ({
        "@type": "JobPosting",
        "position": index + 1,
        "item": {
          "@type": "JobPosting",
          "title": job.title,
          "description": job.description,
          "datePosted": job.postedDate,
          "employmentType": job.employmentType || "FULL_TIME",
          "hiringOrganization": {
            "@type": "Organization",
            "name": job.company
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location
            }
          },
          "baseSalary": job.salaryMin && job.salaryMax ? {
            "@type": "MonetaryAmount",
            "currency": job.currency || "USD",
            "value": {
              "@type": "QuantitativeValue",
              "minValue": job.salaryMin,
              "maxValue": job.salaryMax,
              "unitText": "YEAR"
            }
          } : undefined
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={primarySEOJob.seo_title}
        description={primarySEOJob.meta_description}
        keywords={`${displayName.toLowerCase()} jobs, ${primarySEOJob.job_title.toLowerCase()}, employment, careers, hiring`}
        canonicalUrl={`/jobs/category/${jobType}`}
        structuredData={structuredData}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-headline font-semibold text-gray-900 mb-2">
                {displayName} Jobs
              </h1>
              <p className="text-lg text-gray-600">
                {jobs.length} {jobs.length === 1 ? 'position' : 'positions'} available
              </p>
            </div>
            <div className="text-right">
              <Link 
                to="/enhanced-jobs" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Jobs
              </Link>
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
              <div className="text-sm text-blue-800">Total Positions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{highVolumeCount}</div>
              <div className="text-sm text-green-800">High Search Volume</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{lowCompetitionCount}</div>
              <div className="text-sm text-yellow-800">Low Competition</div>
            </div>
          </div>

          {/* Category Description */}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {primarySEOJob.meta_description}
            </p>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-medium text-gray-900">
              Available {displayName} Positions
            </h2>
            <div className="text-sm text-gray-500">
              Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link 
                        to={`/enhanced-jobs/${job.id}`}
                        className="text-xl font-headline font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <div className="text-lg text-gray-600 mt-1">{job.company}</div>
                      <div className="text-sm text-gray-500 mt-2">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {job.location}
                        </span>
                        {job.remote && (
                          <span className="ml-4 inline-flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Remote
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {job.salaryMin && job.salaryMax && (
                        <div className="text-lg font-medium text-green-600">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        {job.employmentType?.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.searchVolume} volume
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.competitionLevel === 'low' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.competitionLevel} competition
                      </span>
                    </div>
                    <Link 
                      to={`/enhanced-jobs/${job.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {displayName} jobs found
              </h3>
              <p className="text-gray-500 mb-6">
                We don't have any {displayName.toLowerCase()} positions available at the moment.
              </p>
              <Link 
                to="/enhanced-jobs" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOJobCategoryPage;
