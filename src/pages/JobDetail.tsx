import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobs } from '../data/jobs';
import SEOHead from '../components/SEOHead';
import { generateJobSchema, generateJobMetaTags, parseJobUrl, generateJobUrl } from '../utils/seoUtils';
const JobDetail = () => {
  const { id, company, titleLocationId } = useParams<{
    id?: string;
    company?: string;
    titleLocationId?: string;
  }>();
  
  // Handle both URL formats: legacy (/jobs/1) and SEO-friendly (/jobs/company/title-location-id)
  let job;
  if (titleLocationId && company) {
    // Parse SEO-friendly URL
    const parsed = parseJobUrl(`/jobs/${company}/${titleLocationId}`);
    job = parsed ? jobs.find(j => j.id === parsed.id) : null;
  } else {
    // Legacy URL format
    job = jobs.find(j => j.id === id);
  }
  
  if (!job) {
    return (
      <>
        <SEOHead 
          title="Job Not Found - Applicants.IO"
          description="The requested job listing could not be found."
        />
        <div className="py-8">
          <p>Job not found.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to job listings
          </Link>
        </div>
      </>
    );
  }
  const metaTags = generateJobMetaTags(job);
  const jobSchema = generateJobSchema(job);
  
  return (
    <>
      <SEOHead 
        title={`${job.title} at ${job.company} in ${job.location}`}
        description={job.description.substring(0, 160) + '...'}
        keywords={`${job.title}, ${job.company}, ${job.industry}, jobs, careers, ${job.location}`}
        canonical={`${window.location.origin}${generateJobUrl(job)}`}
        structuredData={jobSchema}
      />
      
      <div>
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to job listings
          </Link>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h1 className="text-2xl font-headline font-medium">{job.title}</h1>
          <div className="mt-2 text-gray-500">
            {job.company} • {job.location} • Posted {job.postedDate}
          </div>
          <div className="mt-2">
            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {job.industry}
            </span>
          </div>
          {job.compensation && <div className="mt-4">
              <span className="font-medium">Compensation:</span>{' '}
              {job.compensation}
            </div>}
          <div className="mt-6">
            <h2 className="text-lg font-headline font-medium mb-2">Description</h2>
            <div className="whitespace-pre-line">{job.description}</div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-headline font-medium mb-2">Contact Information</h2>
            <p>
              Email:{' '}
              <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline">
                {job.contactEmail}
              </a>
            </p>
            {job.contactPhone && <p className="mt-1">Phone: {job.contactPhone}</p>}
          </div>
        </div>
      </div>
    </>
  );
};
export default JobDetail;