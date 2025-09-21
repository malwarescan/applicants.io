import { useState, useEffect, useCallback } from 'react';
import { jobIntegrationService, ExternalJob, checkRobotsTxt } from '../services/jobIntegrationService';

interface UseExternalJobsReturn {
  externalJobs: ExternalJob[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchJobs: () => Promise<void>;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const useExternalJobs = (): UseExternalJobsReturn => {
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!isEnabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check robots.txt compliance first
      const isRobotsCompliant = await checkRobotsTxt('https://synaxusinc.com');
      
      if (!isRobotsCompliant) {
        throw new Error('Robots.txt check failed - scraping may not be allowed');
      }

      // Fetch jobs from external source
      const jobs = await jobIntegrationService.fetchSynaxusJobs();
      
      setExternalJobs(jobs);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch external jobs';
      setError(errorMessage);
      console.error('Error fetching external jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled]);

  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    jobIntegrationService.setEnabled(enabled);
    
    if (enabled) {
      fetchJobs();
    } else {
      setExternalJobs([]);
      setError(null);
    }
  }, [fetchJobs]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    const config = jobIntegrationService.getConfig();
    setIsEnabled(config.enabled);
    
    if (config.enabled) {
      fetchJobs();
    }
  }, [fetchJobs]);

  return {
    externalJobs,
    isLoading,
    error,
    lastUpdated,
    fetchJobs,
    isEnabled,
    setEnabled,
  };
};
