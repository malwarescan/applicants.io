import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobs } from '../data/jobs';
import JobListing from '../components/JobListing';
import SEOHead from '../components/SEOHead';
import { generateCategoryMetaTags } from '../utils/seoUtils';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  if (!category) {
    return (
      <SEOHead 
        title="Category Not Found - Applicants.IO"
        description="The requested job category could not be found."
      />
    );
  }
  
  // Convert URL slug back to industry name
  const industry = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Filter jobs by industry
  const categoryJobs = jobs.filter(job => 
    job.industry.toLowerCase() === industry.toLowerCase()
  );
  
  const metaTags = generateCategoryMetaTags(industry, categoryJobs.length);
  
  return (
    <>
      <SEOHead 
        title={`${industry} Jobs - Find ${industry} Careers`}
        description={`Browse ${categoryJobs.length}+ ${industry} jobs and careers. Find your next ${industry} position with top companies.`}
        keywords={`${industry}, jobs, careers, employment, ${industry} positions`}
      />
      
      <div>
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to all jobs
          </Link>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-headline font-medium">{industry} Jobs</h1>
            <p className="text-gray-600 mt-1">
              {categoryJobs.length} {categoryJobs.length === 1 ? 'job' : 'jobs'} found in {industry}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          {categoryJobs.length > 0 ? (
            categoryJobs.map(job => <JobListing key={job.id} job={job} />)
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-2">No {industry.toLowerCase()} jobs found.</p>
              <p className="text-sm text-gray-400">
                Check back later or browse other categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
