import React, { useState } from 'react';

interface FilterSectionProps {
  selectedLocations: string[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIndustries: string[];
  setSelectedIndustries: React.Dispatch<React.SetStateAction<string[]>>;
  availableLocations: string[];
  availableIndustries: string[];
}
const FilterSection: React.FC<FilterSectionProps> = ({
  selectedLocations,
  setSelectedLocations,
  selectedIndustries,
  setSelectedIndustries,
  availableLocations,
  availableIndustries
}) => {
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationFilters, setShowLocationFilters] = useState(false);
  const [showIndustryFilters, setShowIndustryFilters] = useState(false);
  const filteredLocations = locationSearch ? availableLocations.filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase())) : availableLocations;
  const handleLocationChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(loc => loc !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };
  const handleIndustryChange = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(ind => ind !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Location Filters */}
      <div className="border border-gray-200 rounded-lg">
        <button
          className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => setShowLocationFilters(!showLocationFilters)}
        >
          <div className="flex items-center space-x-2">
            <h3 className="text-base md:text-lg font-headline font-medium">Filter by Location</h3>
            {selectedLocations.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {selectedLocations.length}
              </span>
            )}
          </div>
          <span className="text-gray-500 text-lg">
            {showLocationFilters ? '−' : '+'}
          </span>
        </button>
        
        {showLocationFilters && (
          <div className="px-3 md:px-4 pb-3 md:pb-4 border-t border-gray-200">
            <div className="mt-3">
              <input 
                type="text" 
                placeholder="Search locations..." 
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={locationSearch} 
                onChange={e => setLocationSearch(e.target.value)} 
              />
            </div>
            
            {locationSearch ? (
              <div className="max-h-40 md:max-h-60 overflow-y-auto border border-gray-200 rounded mt-2 p-2">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map(location => (
                    <div key={location} className="flex items-center py-1">
                      <input 
                        type="checkbox" 
                        id={`location-${location}`} 
                        checked={selectedLocations.includes(location)} 
                        onChange={() => handleLocationChange(location)} 
                        className="mr-2" 
                      />
                      <label htmlFor={`location-${location}`} className="text-sm">
                        {location}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-1">No locations found</p>
                )}
              </div>
            ) : (
              <div className="max-h-40 md:max-h-60 overflow-y-auto border border-gray-200 rounded mt-2 p-2">
                {availableLocations.length > 0 ? (
                  availableLocations.map(location => (
                    <div key={location} className="flex items-center py-1">
                      <input 
                        type="checkbox" 
                        id={`location-${location}`} 
                        checked={selectedLocations.includes(location)} 
                        onChange={() => handleLocationChange(location)} 
                        className="mr-2" 
                      />
                      <label htmlFor={`location-${location}`} className="text-sm">
                        {location}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-1">No locations available</p>
                )}
              </div>
            )}
            
            {selectedLocations.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {selectedLocations.map(location => (
                    <div key={location} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <span className="truncate max-w-24 md:max-w-none">{location}</span>
                      <button 
                        className="ml-1 text-blue-500 hover:text-blue-700" 
                        onClick={() => handleLocationChange(location)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  className="text-sm text-blue-600 hover:underline mt-2" 
                  onClick={() => setSelectedLocations([])}
                >
                  Clear all locations
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Industry Filters */}
      <div className="border border-gray-200 rounded-lg">
        <button
          className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => setShowIndustryFilters(!showIndustryFilters)}
        >
          <div className="flex items-center space-x-2">
            <h3 className="text-base md:text-lg font-headline font-medium">Filter by Industry</h3>
            {selectedIndustries.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {selectedIndustries.length}
              </span>
            )}
          </div>
          <span className="text-gray-500 text-lg">
            {showIndustryFilters ? '−' : '+'}
          </span>
        </button>
        
        {showIndustryFilters && (
          <div className="px-3 md:px-4 pb-3 md:pb-4 border-t border-gray-200">
            <div className="max-h-40 md:max-h-60 overflow-y-auto border border-gray-200 rounded mt-3 p-2">
              {availableIndustries.length > 0 ? (
                availableIndustries.map(industry => (
                  <div key={industry} className="flex items-center py-1">
                    <input 
                      type="checkbox" 
                      id={`industry-${industry}`} 
                      checked={selectedIndustries.includes(industry)} 
                      onChange={() => handleIndustryChange(industry)} 
                      className="mr-2" 
                    />
                    <label htmlFor={`industry-${industry}`} className="text-sm">
                      {industry}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-1">No industries available</p>
              )}
            </div>
            
            {selectedIndustries.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {selectedIndustries.map(industry => (
                    <div key={industry} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <span className="truncate max-w-24 md:max-w-none">{industry}</span>
                      <button 
                        className="ml-1 text-blue-500 hover:text-blue-700" 
                        onClick={() => handleIndustryChange(industry)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  className="text-sm text-blue-600 hover:underline mt-2" 
                  onClick={() => setSelectedIndustries([])}
                >
                  Clear all industries
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default FilterSection;