import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import JobListing from '../components/JobListing';
import FilterSection from '../components/FilterSection';
import { jobs } from '../data/jobs';
import { useExternalJobs } from '../hooks/useExternalJobs';
import { jobIntegrationService } from '../services/jobIntegrationService';
import { seoJobService } from '../services/seoJobService';

/*
  Optional: Use the new dither hero.
  To try it safely, uncomment the import below and replace your current content with <HeroDither/>,
  or place <HeroDither/> above the fold for an A/B test.
*/
// import HeroDither from '../components/HeroDither';
const Home = () => {
  const location = useLocation();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  
  // External jobs integration
  const { externalJobs, isEnabled } = useExternalJobs();
  
  // Merge external jobs with existing jobs and SEO jobs (memoized to prevent infinite loops)
  const allJobs = useMemo(() => {
    const seoJobs = seoJobService.getEnhancedJobs();
    const mergedJobs = jobIntegrationService.mergeJobs(jobs, externalJobs);
    
    // Convert SEO jobs to match the original Job interface for display
    const convertedSeoJobs = seoJobs.map(seoJob => ({
      id: seoJob.id,
      title: seoJob.title,
      company: seoJob.company,
      location: seoJob.location,
      industry: seoJob.industry,
      postedDate: new Date(seoJob.postedDate).toLocaleDateString(),
      compensation: seoJob.salaryMin && seoJob.salaryMax 
        ? `$${seoJob.salaryMin.toLocaleString()} - $${seoJob.salaryMax.toLocaleString()} per year`
        : undefined,
      description: seoJob.description,
      contactEmail: seoJob.contactEmail || 'jobs@applicants.io',
      contactPhone: seoJob.contactPhone
    }));
    
    return [...mergedJobs, ...convertedSeoJobs];
  }, [externalJobs]);
  
  // Generate filter options dynamically from actual job data
  const availableLocations = useMemo(() => {
    const locations = [...new Set(allJobs.map(job => job.location))];
    return locations.sort();
  }, [allJobs]);
  
  const availableIndustries = useMemo(() => {
    const industries = [...new Set(allJobs.map(job => job.industry))];
    return industries.sort();
  }, [allJobs]);
  
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  
  // Single effect to handle all filtering logic
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q') || '';
    const filtered = allJobs.filter(job => {
      // Text search filter - search across multiple fields
      const searchTerm = query.toLowerCase().trim();
      const matchesSearch = query === '' || 
        job.title.toLowerCase().includes(searchTerm) || 
        job.company.toLowerCase().includes(searchTerm) || 
        job.location.toLowerCase().includes(searchTerm) || 
        job.industry.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm);
      
      // Location filter
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(job.location);
      
      // Industry filter
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(job.industry);
      
      return matchesSearch && matchesLocation && matchesIndustry;
    });
    
    // Debug logging (remove in production)
    console.log('Filtering jobs:', {
      totalJobs: allJobs.length,
      selectedLocations,
      selectedIndustries,
      searchQuery: query,
      filteredCount: filtered.length
    });
    
    setFilteredJobs(filtered);
  }, [location.search, selectedLocations, selectedIndustries, allJobs]);
  return <div className="space-y-6 md:space-y-0">
      <div className="md:hidden">
        <h2 className="text-lg font-headline font-medium mb-3">Filters</h2>
        <FilterSection 
          selectedLocations={selectedLocations} 
          setSelectedLocations={setSelectedLocations} 
          selectedIndustries={selectedIndustries} 
          setSelectedIndustries={setSelectedIndustries}
          availableLocations={availableLocations}
          availableIndustries={availableIndustries}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="hidden md:block md:col-span-1">
          <h2 className="text-xl font-headline font-medium mb-4">Filters</h2>
          <FilterSection 
          selectedLocations={selectedLocations} 
          setSelectedLocations={setSelectedLocations} 
          selectedIndustries={selectedIndustries} 
          setSelectedIndustries={setSelectedIndustries}
          availableLocations={availableLocations}
          availableIndustries={availableIndustries}
        />
        </div>
        <div className="md:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-headline font-medium">Job Listings</h1>
            {isEnabled && externalJobs.length > 0 && (
              <p className="text-sm text-blue-600 mt-1">
                Including {externalJobs.length} jobs from Synaxus Inc.
              </p>
            )}
            {(selectedLocations.length > 0 || selectedIndustries.length > 0) && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center flex-wrap gap-1 md:gap-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">Active filters:</span>
                  <span className="text-sm text-gray-600 sm:hidden">Filters:</span>
                  {selectedLocations.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                      {selectedLocations.length} loc{selectedLocations.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {selectedIndustries.length > 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
                      {selectedIndustries.length} ind{selectedIndustries.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedLocations([]);
                    setSelectedIndustries([]);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          {filteredJobs.length > 0 && (
            <div className="text-sm text-gray-600">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
              {allJobs.length !== filteredJobs.length && (
                <span className="text-gray-400 ml-1">
                  (of {allJobs.length} total)
                </span>
              )}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => <JobListing key={job.id} job={job} />)
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-2">No job listings found matching your search.</p>
              <p className="text-sm text-gray-400">
                Try adjusting your search terms or filters to find more opportunities.
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>;
};
export default Home;