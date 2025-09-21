import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFormattedLocations } from '../data/locations';
import { getAllIndustries } from '../data/industries';
import { EnhancedJobService } from '../services/enhancedJobService';
import { JobFormData, EmploymentType } from '../types/job';

const EnhancedPostJob: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    industry: '',
    remote: false,
    employmentType: 'full-time',
    description: '',
    responsibilities: '',
    requirements: '',
    compensation: '',
    salaryMin: undefined,
    salaryMax: undefined,
    currency: 'USD',
    contactEmail: '',
    contactPhone: '',
    applyUrl: '',
    applyEmail: ''
  });

  const industries = getAllIndustries();
  const locations = getFormattedLocations();

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('job-post-draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load draft');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('job-post-draft', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.title || !formData.company || !formData.location || !formData.industry || !formData.description || !formData.contactEmail) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.applyUrl && !formData.applyEmail) {
        throw new Error('Please provide either an Apply URL or Apply Email');
      }

      const job = EnhancedJobService.saveJob(formData);
      localStorage.removeItem('job-post-draft');
      navigate(`/jobs/${job.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-gray-900 mb-2">Post a Job</h1>
        <p className="text-gray-600">Three quick steps to get your job listing live</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= stepNum 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-12 h-0.5 ${
                  step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-semibold">Basic Information</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => updateFormData({ company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., TechCorp Inc."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type *
                </label>
                <select
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={(e) => updateFormData({ employmentType: e.target.value as EmploymentType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => updateFormData({ industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an industry</option>
                  {industries.map(industry => (
                    <option key={industry.id} value={industry.name}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="remote"
                  checked={formData.remote}
                  onChange={(e) => updateFormData({ remote: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remote" className="text-sm font-medium text-gray-700">
                  Remote work available
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-semibold">Job Details</h2>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                  Key Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => updateFormData({ responsibilities: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each responsibility on a new line..."
                />
              </div>
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => updateFormData({ requirements: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each requirement on a new line..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Salary
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  value={formData.salaryMin || ''}
                  onChange={(e) => updateFormData({ salaryMin: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Salary
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  value={formData.salaryMax || ''}
                  onChange={(e) => updateFormData({ salaryMax: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="75000"
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => updateFormData({ currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="compensation" className="block text-sm font-medium text-gray-700 mb-1">
                Compensation Summary (Optional)
              </label>
              <input
                type="text"
                id="compensation"
                value={formData.compensation}
                onChange={(e) => updateFormData({ compensation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., $60,000 - $80,000 per year + benefits"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact & Application */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-semibold">Contact & Application</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="jobs@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="applyUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Application URL
                </label>
                <input
                  type="url"
                  id="applyUrl"
                  value={formData.applyUrl}
                  onChange={(e) => updateFormData({ applyUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com/apply"
                />
              </div>
              <div>
                <label htmlFor="applyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Email (if no URL)
                </label>
                <input
                  type="email"
                  id="applyEmail"
                  value={formData.applyEmail}
                  onChange={(e) => updateFormData({ applyEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="apply@company.com"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>* Provide either an Application URL or Application Email (or both)</p>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-headline font-semibold mb-4">Preview</h3>
              <div className="space-y-2">
                <h4 className="text-xl font-medium">{formData.title}</h4>
                <p className="text-gray-600">{formData.company} • {formData.location} {formData.remote && '• Remote'}</p>
                <p className="text-gray-600 capitalize">{formData.employmentType}</p>
                {formData.compensation && <p className="text-green-600 font-medium">{formData.compensation}</p>}
                <p className="text-gray-700 mt-4">{formData.description.substring(0, 200)}...</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Job'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-gray-500 text-center">
        We use AI to showcase applicants' strengths, not to keep them buried in filters or hidden from employers.
      </p>
    </div>
  );
};

export default EnhancedPostJob;
