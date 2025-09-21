import React, { useState } from 'react';
import { EnhancedJobService } from '../services/enhancedJobService';
import { ApplicationData } from '../types/job';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  jobTitle,
  companyName,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<ApplicationData, 'jobId'>>({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    coverLetter: '',
    resumeUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    experience: '',
    availability: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.candidateName.trim() || !formData.candidateEmail.trim()) {
        throw new Error('Name and email are required');
      }

      const applicationData: ApplicationData = {
        jobId,
        ...formData
      };

      EnhancedJobService.submitApplication(applicationData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        candidateName: '',
        candidateEmail: '',
        candidatePhone: '',
        coverLetter: '',
        resumeUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        experience: '',
        availability: ''
      });

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-headline font-semibold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to <strong>{jobTitle}</strong> at <strong>{companyName}</strong>.
            We'll review your application and get back to you soon.
          </p>
          <div className="space-y-3">
            <button
              onClick={onCancel}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-headline font-semibold text-gray-900 mb-2">
          Apply for {jobTitle}
        </h2>
        <p className="text-gray-600">at {companyName}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="candidateName"
              value={formData.candidateName}
              onChange={(e) => updateFormData({ candidateName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="candidateEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="candidateEmail"
              value={formData.candidateEmail}
              onChange={(e) => updateFormData({ candidateEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="candidatePhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="candidatePhone"
            value={formData.candidatePhone}
            onChange={(e) => updateFormData({ candidatePhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Professional Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => updateFormData({ linkedinUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio/Website
            </label>
            <input
              type="url"
              id="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Resume/CV URL
          </label>
          <input
            type="url"
            id="resumeUrl"
            value={formData.resumeUrl}
            onChange={(e) => updateFormData({ resumeUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://drive.google.com/file/your-resume.pdf"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload your resume to Google Drive, Dropbox, or similar service and share the link
          </p>
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Relevant Experience
          </label>
          <textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => updateFormData({ experience: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Briefly describe your relevant experience and skills..."
          />
        </div>

        {/* Cover Letter */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            value={formData.coverLetter}
            onChange={(e) => updateFormData({ coverLetter: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us why you're interested in this role and what makes you a great fit..."
          />
        </div>

        {/* Availability */}
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
            Availability
          </label>
          <textarea
            id="availability"
            value={formData.availability}
            onChange={(e) => updateFormData({ availability: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="When are you available to start? Any scheduling preferences?"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
