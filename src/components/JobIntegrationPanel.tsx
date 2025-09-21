import React, { useState } from 'react';
import { useExternalJobs } from '../hooks/useExternalJobs';
import { jobIntegrationService } from '../services/jobIntegrationService';

interface JobIntegrationPanelProps {
  onJobsUpdate?: (jobs: any[]) => void;
}

const JobIntegrationPanel: React.FC<JobIntegrationPanelProps> = ({ onJobsUpdate }) => {
  const { 
    externalJobs, 
    isLoading, 
    error, 
    lastUpdated, 
    fetchJobs, 
    isEnabled, 
    setEnabled 
  } = useExternalJobs();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState(jobIntegrationService.getConfig());

  const handleConfigUpdate = (key: keyof typeof config, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    jobIntegrationService.updateConfig(newConfig);
  };

  const handleManualRefresh = async () => {
    await fetchJobs();
    if (onJobsUpdate) {
      // This would need to be implemented based on your job data structure
      onJobsUpdate(externalJobs);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-headline font-medium">External Job Integration</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Integration Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-400">ℹ️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Direct Integration:</strong> This connects to your synaxusinc.com site to automatically pull job listings. The integration will:
            </p>
            <ul className="mt-1 text-xs text-blue-600 list-disc list-inside">
              <li>Try to fetch jobs via API endpoint first</li>
              <li>Fallback to scraping the careers page if needed</li>
              <li>Automatically merge jobs with your existing listings</li>
              <li>Respect rate limits to avoid overloading servers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium">Enable Synaxus Inc. Job Integration</span>
        </label>
      </div>

      {/* Status Information */}
      {isEnabled && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>External Jobs Loaded:</span>
            <span className="font-medium">{externalJobs.length}</span>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center justify-between text-sm">
              <span>Last Updated:</span>
              <span className="text-gray-600">{lastUpdated.toLocaleString()}</span>
            </div>
          )}

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      )}

      {/* Manual Refresh */}
      {isEnabled && (
        <div className="mb-4">
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Jobs'}
          </button>
        </div>
      )}

      {/* Advanced Settings */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Rate Limit (requests per minute)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={config.rateLimit}
                onChange={(e) => handleConfigUpdate('rateLimit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Maximum Jobs to Fetch
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={config.maxJobs}
                onChange={(e) => handleConfigUpdate('maxJobs', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Allowed Domains
              </label>
              <div className="space-y-1">
                {config.allowedDomains.map((domain, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => {
                        const newDomains = [...config.allowedDomains];
                        newDomains[index] = e.target.value;
                        handleConfigUpdate('allowedDomains', newDomains);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const newDomains = config.allowedDomains.filter((_, i) => i !== index);
                        handleConfigUpdate('allowedDomains', newDomains);
                      }}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newDomains = [...config.allowedDomains, ''];
                    handleConfigUpdate('allowedDomains', newDomains);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Add Domain
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sample Job Preview */}
      {externalJobs.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium mb-2">Sample External Job</h4>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <div className="font-medium">{externalJobs[0].title}</div>
            <div className="text-gray-600">{externalJobs[0].company} • {externalJobs[0].location}</div>
            <div className="text-xs text-gray-500 mt-1">Source: {externalJobs[0].source}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobIntegrationPanel;
