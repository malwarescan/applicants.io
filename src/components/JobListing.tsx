import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Job } from '../data/jobs';
import { highlightSearchTerm, getSearchSnippet } from '../utils/searchUtils';
import { generateJobUrl } from '../utils/seoUtils';

interface JobListingProps {
  job: Job;
}

const JobListing: React.FC<JobListingProps> = ({
  job
}) => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  const highlightedTitle = searchQuery ? highlightSearchTerm(job.title, searchQuery) : job.title;
  const highlightedCompany = searchQuery ? highlightSearchTerm(job.company, searchQuery) : job.company;
  const highlightedLocation = searchQuery ? highlightSearchTerm(job.location, searchQuery) : job.location;
  const highlightedIndustry = searchQuery ? highlightSearchTerm(job.industry, searchQuery) : job.industry;
  
  // Get a snippet of the description that includes the search term
  const descriptionSnippet = getSearchSnippet(job.description, searchQuery, 200);
  const highlightedDescription = searchQuery ? highlightSearchTerm(descriptionSnippet, searchQuery) : descriptionSnippet;

  return (
    <div className="py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-white hover:via-blue-50 hover:to-white transition-all duration-300 ease-in-out">
      <Link to={generateJobUrl(job)} className="text-blue-600 hover:underline text-lg font-headline font-medium">
        <span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
      </Link>
      <div className="mt-1 text-sm text-gray-500">
        <span dangerouslySetInnerHTML={{ __html: highlightedCompany }} /> • <span dangerouslySetInnerHTML={{ __html: highlightedLocation }} /> • Posted {job.postedDate}
      </div>
      <div className="mt-1 mb-2">
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
          <span dangerouslySetInnerHTML={{ __html: highlightedIndustry }} />
        </span>
      </div>
      {job.description && (
        <div className="mt-2 text-sm text-gray-600">
          <span dangerouslySetInnerHTML={{ __html: highlightedDescription }} />
        </div>
      )}
      {job.compensation && (
        <div className="mt-2 text-sm font-medium text-green-600">
          {job.compensation}
        </div>
      )}
    </div>
  );
};
export default JobListing;