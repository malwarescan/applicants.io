import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Update query when URL changes
  useEffect(() => {
    const urlQuery = new URLSearchParams(location.search).get('q') || '';
    setQuery(urlQuery);
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    navigate('/jobs');
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full">
      <input 
        type="text" 
        placeholder="Search jobs by title, company, location, or description..." 
        className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
      />
      <button 
        type="submit" 
        className="px-4 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
      {query && (
        <button 
          type="button" 
          onClick={handleClearSearch}
          className="px-3 py-2 bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
};
export default SearchBar;