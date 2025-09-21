import React from 'react';
import EnhancedJobSearch from '../components/EnhancedJobSearch';

const EnhancedJobSearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <EnhancedJobSearch />
      </div>
    </div>
  );
};

export default EnhancedJobSearchPage;
