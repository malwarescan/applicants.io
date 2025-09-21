import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnhancedJob } from '../types/job';
import JobApplicationForm from './JobApplicationForm';

interface EnhancedJobDetailProps {
  job: EnhancedJob;
}

const EnhancedJobDetail: React.FC<EnhancedJobDetailProps> = ({ job }) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      return `$${job.salaryMin.toLocaleString()}+`;
    } else if (job.compensation) {
      return job.compensation;
    }
    return null;
  };

  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  const handleExternalApply = () => {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    } else if (job.applyEmail) {
      window.location.href = `mailto:${job.applyEmail}?subject=Application for ${job.title}`;
    }
  };

  if (showApplicationForm) {
    return (
      <JobApplicationForm
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company}
        onSuccess={() => setShowApplicationForm(false)}
        onCancel={() => setShowApplicationForm(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Back to job listings
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                {job.company}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-gray-500">
                <span className="flex items-center">
                  📍 {job.location}
                  {job.remote && <span className="text-blue-600 ml-1">• Remote</span>}
                </span>
                {job.employmentType && (
                  <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
                )}
                <span>Posted {job.postedDate}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Apply Button */}
              {(job.applyUrl || job.applyEmail) ? (
                <button
                  onClick={handleExternalApply}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Now
                </button>
              )}
              
              <button
                onClick={handleApplyClick}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Apply via Form
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {job.industry}
            </span>
            {job.employmentType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                {job.employmentType.replace('-', ' ')}
              </span>
            )}
            {job.remote && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Remote
              </span>
            )}
          </div>

          {/* Salary */}
          {formatSalary() && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-1">Compensation</h3>
              <p className="text-green-700 font-medium">{formatSalary()}</p>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <h2 className="text-xl font-headline font-semibold text-gray-900 mb-4">Job Description</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>
        </div>

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-headline font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-headline font-semibold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-headline font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Email</h3>
              <a
                href={`mailto:${job.contactEmail}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {job.contactEmail}
              </a>
            </div>
            {job.contactPhone && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                <a
                  href={`tel:${job.contactPhone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {job.contactPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Application Options */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-xl font-headline font-semibold text-gray-900 mb-4">How to Apply</h2>
          <div className="space-y-4">
            {(job.applyUrl || job.applyEmail) && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">External Application</h3>
                <p className="text-blue-700 mb-3">
                  {job.applyUrl 
                    ? 'Click the "Apply Now" button above to apply through our external application system.'
                    : `Send your application to ${job.applyEmail}`
                  }
                </p>
                <button
                  onClick={handleExternalApply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {job.applyUrl ? 'Apply Externally' : 'Email Application'}
                </button>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Application Form</h3>
              <p className="text-gray-700 mb-3">
                Use our application form to submit your details, cover letter, and resume.
              </p>
              <button
                onClick={handleApplyClick}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Use Application Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobDetail;
