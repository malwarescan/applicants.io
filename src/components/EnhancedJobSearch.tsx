import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllIndustries } from '../data/industries';
import { EnhancedJobService } from '../services/enhancedJobService';
import { getAllUnifiedJobs, searchUnifiedJobs } from '../services/unifiedJobService';
import { EnhancedJob, EmploymentType } from '../types/job';

const EnhancedJobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<EnhancedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    search: '',
    employmentType: '' as EmploymentType | '',
    location: '',
    remote: false,
    industry: ''
  });

  const industries = getAllIndustries();

  // Load jobs when component mounts or search params change
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        // Use unified job service to get all jobs from all sources
        const results = searchUnifiedJobs({
          search: searchParams.search || undefined,
          location: searchParams.location || undefined,
          remote: searchParams.remote || undefined,
          industry: searchParams.industry || undefined
        });
        
        // Filter by employment type if specified
        let filteredResults = results;
        if (searchParams.employmentType) {
          filteredResults = results.filter(job => job.employmentType === searchParams.employmentType);
        }
        
        setJobs(filteredResults);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(loadJobs, 300);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const updateSearchParams = (updates: Partial<typeof searchParams>) => {
    setSearchParams(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setSearchParams({
      search: '',
      employmentType: '',
      location: '',
      remote: false,
      industry: ''
    });
  };

  const hasActiveFilters = Object.values(searchParams).some(value => 
    value !== '' && value !== false
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-600">Discover jobs that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search job title, company, keywords..."
              value={searchParams.search}
              onChange={(e) => updateSearchParams({ search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Employment Type */}
          <div>
            <select
              value={searchParams.employmentType}
              onChange={(e) => updateSearchParams({ employmentType: e.target.value as EmploymentType | '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <select
              value={searchParams.industry}
              onChange={(e) => updateSearchParams({ industry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Industry</option>
              {industries.map(industry => (
                <option key={industry.id} value={industry.name}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center justify-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.remote}
                onChange={(e) => updateSearchParams({ remote: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Remote</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Location (optional)"
            value={searchParams.location}
            onChange={(e) => updateSearchParams({ location: e.target.value })}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {searchParams.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: "{searchParams.search}"
                  <button
                    onClick={() => updateSearchParams({ search: '' })}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchParams.employmentType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {searchParams.employmentType}
                  <button
                    onClick={() => updateSearchParams({ employmentType: '' })}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchParams.industry && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {searchParams.industry}
                  <button
                    onClick={() => updateSearchParams({ industry: '' })}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchParams.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  {searchParams.location}
                  <button
                    onClick={() => updateSearchParams({ location: '' })}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchParams.remote && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
                  Remote
                  <button
                    onClick={() => updateSearchParams({ remote: false })}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
              </p>
              <Link
                to="/employers/post"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Post a job →
              </Link>
            </div>

            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Job Card Component
const JobCard: React.FC<{ job: EnhancedJob }> = ({ job }) => {
  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      return `$${job.salaryMin.toLocaleString()}+`;
    } else if (job.compensation) {
      return job.compensation;
    }
    return null;
  };

  const salary = formatSalary();

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-headline font-semibold text-gray-900 hover:text-blue-600">
              {job.title}
            </h3>
            {job.employmentType && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {job.employmentType.replace('-', ' ')}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-2">
            {job.company} • {job.location}
            {job.remote && <span className="text-blue-600"> • Remote</span>}
          </p>
          
          <p className="text-gray-700 text-sm line-clamp-2 mb-3">
            {job.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {job.industry}
            </span>
            {salary && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                {salary}
              </span>
            )}
            <span className="text-gray-500">
              Posted {job.postedDate}
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-blue-600 hover:text-blue-800 font-medium">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EnhancedJobSearch;
