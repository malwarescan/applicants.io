import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { seoJobService } from '../services/seoJobService';
const Navbar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const jobTypes = seoJobService.getJobTypes();

  return <header className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="py-4">
          <nav className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/logo.png" 
                  alt="Applicants.IO Logo" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-headline font-semibold">
                  Applicants.IO
                </span>
              </Link>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center">
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/" className="text-blue-600 hover:underline">
                  Home
                </Link>
                <Link to="/enhanced-jobs" className="text-blue-600 hover:underline">
                  Find Jobs
                </Link>
                
                {/* Job Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    Categories
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCategories && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Job Categories</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {jobTypes.slice(0, 8).map(jobType => (
                            <Link
                              key={jobType}
                              to={`/jobs/category/${jobType}`}
                              className="text-sm text-blue-600 hover:underline block py-1"
                              onClick={() => setShowCategories(false)}
                            >
                              {seoJobService.getJobTypeDisplayName(jobType)}
                            </Link>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <Link
                            to="/enhanced-jobs"
                            className="text-sm font-medium text-blue-600 hover:underline"
                            onClick={() => setShowCategories(false)}
                          >
                            View All Jobs →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link to="/enhanced-post-job" className="text-blue-600 hover:underline">
                  Post Job
                </Link>
                <Link to="/contact" className="text-blue-600 hover:underline">
                  Contact
                </Link>
                <Link to="/admin" className="text-blue-600 hover:underline">
                  Admin
                </Link>
              </div>
            </div>
          </nav>
          <div className="py-4">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;