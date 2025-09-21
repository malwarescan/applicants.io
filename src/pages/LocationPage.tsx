import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobs } from '../data/jobs';
import JobListing from '../components/JobListing';
import SEOHead from '../components/SEOHead';

const LocationPage = () => {
  const { location } = useParams<{ location: string }>();
  
  if (!location) {
    return (
      <SEOHead 
        title="Location Not Found - Applicants.IO"
        description="The requested job location could not be found."
      />
    );
  }
  
  // Convert URL slug back to location name
  const locationName = location.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Filter jobs by location
  const locationJobs = jobs.filter(job => 
    job.location.toLowerCase() === locationName.toLowerCase()
  );
  
  return (
    <>
      <SEOHead 
        title={`Jobs in ${locationName} - Find Careers in ${locationName}`}
        description={`Browse ${locationJobs.length}+ jobs in ${locationName}. Find your next career opportunity in ${locationName} with top companies.`}
        keywords={`jobs in ${locationName}, careers ${locationName}, employment ${locationName}, ${locationName} jobs`}
      />
      
      <div>
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to all jobs
          </Link>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-headline font-medium">Jobs in {locationName}</h1>
            <p className="text-gray-600 mt-1">
              {locationJobs.length} {locationJobs.length === 1 ? 'job' : 'jobs'} found in {locationName}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          {locationJobs.length > 0 ? (
            locationJobs.map(job => <JobListing key={job.id} job={job} />)
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-2">No jobs found in {locationName}.</p>
              <p className="text-sm text-gray-400">
                Check back later or browse other locations.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LocationPage;
