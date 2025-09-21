import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobs } from '../data/jobs';
import JobListing from '../components/JobListing';
import SEOHead from '../components/SEOHead';

const CompanyPage = () => {
  const { company } = useParams<{ company: string }>();
  
  if (!company) {
    return (
      <SEOHead 
        title="Company Not Found - Applicants.IO"
        description="The requested company could not be found."
      />
    );
  }
  
  // Convert URL slug back to company name
  const companyName = company.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Filter jobs by company
  const companyJobs = jobs.filter(job => 
    job.company.toLowerCase() === companyName.toLowerCase()
  );
  
  return (
    <>
      <SEOHead 
        title={`${companyName} Jobs - Careers at ${companyName}`}
        description={`Browse ${companyJobs.length}+ job openings at ${companyName}. Join the team and advance your career with ${companyName}.`}
        keywords={`${companyName} jobs, careers at ${companyName}, ${companyName} careers, ${companyName} employment`}
      />
      
      <div>
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to all jobs
          </Link>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-headline font-medium">Careers at {companyName}</h1>
            <p className="text-gray-600 mt-1">
              {companyJobs.length} {companyJobs.length === 1 ? 'job' : 'jobs'} available at {companyName}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          {companyJobs.length > 0 ? (
            companyJobs.map(job => <JobListing key={job.id} job={job} />)
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-2">No jobs found for {companyName}.</p>
              <p className="text-sm text-gray-400">
                Check back later or browse other companies.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyPage;
