import React, { useState } from 'react';
import { getFormattedLocations } from '../data/locations';
import { getAllIndustries, getJobTitlesByIndustry } from '../data/industries';
const PostJob = () => {
  const [location, setLocation] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [industry, setIndustry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [showJobTitles, setShowJobTitles] = useState(false);
  const industries = getAllIndustries();
  const locations = getFormattedLocations();
  const jobTitles = industry ? getJobTitlesByIndustry(industries.find(ind => ind.name === industry)?.id || '') : [];
  const filteredLocations = locationSearch ? locations.filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase())).slice(0, 10) : [];
  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    setLocationSearch('');
    setShowLocationDropdown(false);
  };
  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value);
    setJobTitle('');
  };
  const handleJobTitleSelect = (title: string) => {
    setJobTitle(title);
    setShowJobTitles(false);
  };
  return <div>
      <h1 className="text-2xl font-headline font-medium mb-6">Post a Job</h1>
      <form className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">
            Job Title
          </label>
          <div className="relative">
            <input type="text" id="title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} onFocus={() => industry && setShowJobTitles(true)} placeholder="Enter job title" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
            {showJobTitles && jobTitles.length > 0 && <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                {jobTitles.map((job, index) => <div key={index} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleJobTitleSelect(job.title)}>
                    {job.title}
                  </div>)}
              </div>}
          </div>
          {industry && <p className="text-xs text-gray-500 mt-1">
              Select from common titles in {industry} or enter your own
            </p>}
        </div>
        <div className="mb-4">
          <label htmlFor="company" className="block mb-1">
            Company
          </label>
          <input type="text" id="company" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block mb-1">
            Location
          </label>
          <div className="relative">
            <input type="text" id="location" value={locationSearch} onChange={e => {
            setLocationSearch(e.target.value);
            setShowLocationDropdown(true);
          }} onFocus={() => setShowLocationDropdown(true)} placeholder={location || 'Search for a location...'} className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
            {showLocationDropdown && filteredLocations.length > 0 && <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                {filteredLocations.map(loc => <div key={loc} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLocationSelect(loc)}>
                    {loc}
                  </div>)}
              </div>}
          </div>
          {location && <div className="mt-2 flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                {location}
                <button type="button" className="ml-1 text-blue-500 hover:text-blue-700" onClick={() => setLocation('')}>
                  ×
                </button>
              </span>
            </div>}
        </div>
        <div className="mb-4">
          <label htmlFor="industry" className="block mb-1">
            Industry
          </label>
          <select id="industry" value={industry} onChange={handleIndustryChange} className="w-full px-3 py-2 border border-gray-300 focus:outline-none">
            <option value="">Select an industry</option>
            {industries.map(ind => <option key={ind.id} value={ind.name}>
                {ind.name}
              </option>)}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="compensation" className="block mb-1">
            Compensation (optional)
          </label>
          <input type="text" id="compensation" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">
            Job Description
          </label>
          <textarea id="description" rows={6} className="w-full px-3 py-2 border border-gray-300 focus:outline-none"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Contact Email
          </label>
          <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
        </div>
        <div className="mb-6">
          <label htmlFor="phone" className="block mb-1">
            Contact Phone (optional)
          </label>
          <input type="tel" id="phone" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white border border-blue-600">
          Post Job
        </button>
      </form>
    </div>;
};
export default PostJob;