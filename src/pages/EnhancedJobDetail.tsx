import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { EnhancedJobService } from '../services/enhancedJobService';
import EnhancedJobDetail from '../components/EnhancedJobDetail';

const EnhancedJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/jobs" replace />;
  }

  const job = EnhancedJobService.getJobById(id);
  
  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <EnhancedJobDetail job={job} />
      </div>
    </div>
  );
};

export default EnhancedJobDetailPage;
