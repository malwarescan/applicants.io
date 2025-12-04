/**
 * Job Description Authority Page Component
 * Implements APPLICANTS_CONTENT_AUTHORITY_KERNEL job description directives
 * Creates engagement-optimized, schema-complete authority pages
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { EnhancedJob } from '../types/job';
import { getJobDescriptionInternalLinks } from '../services/authorityClusterService';
import { generateJobSchema, generateOrganizationSchema } from '../utils/seoUtils';

interface JobDescriptionAuthorityProps {
  job: EnhancedJob;
}

const JobDescriptionAuthority: React.FC<JobDescriptionAuthorityProps> = ({ job }) => {
  const internalLinks = getJobDescriptionInternalLinks(job);
  
  // Generate FAQ items for this job (NewFAQ-ready)
  // TODO: Integrate with NewFAQ system when available
  const faqs = [
    {
      question: `What does a ${job.title} do?`,
      answer: job.description.length > 200 
        ? job.description.substring(0, 200) + '...' 
        : job.description
    },
    {
      question: `What qualifications are required for a ${job.title}?`,
      answer: job.requirements && job.requirements.length > 0
        ? `Required qualifications include: ${job.requirements.join(', ')}. See the requirements section above for complete details.`
        : 'Qualifications vary by position. See the job description above for specific requirements.'
    },
    {
      question: `What is the salary range for a ${job.title}?`,
      answer: job.compensation 
        ? `The compensation for this position is ${job.compensation}. ${job.salaryMin && job.salaryMax ? `Salary range: $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.currency || 'USD'} annually.` : ''}`
        : 'Salary information is available upon application. Compensation is competitive and based on experience and qualifications.'
    },
    {
      question: `What skills are needed for a ${job.title}?`,
      answer: job.requirements && job.requirements.length > 0
        ? `Essential skills include: ${job.requirements.slice(0, 5).join(', ')}. See the skills and qualifications section above for complete requirements.`
        : 'Required skills are detailed in the job description above. Review the responsibilities and requirements sections for specific skill requirements.'
    },
    {
      question: `What is the work environment like for a ${job.title}?`,
      answer: job.remote 
        ? `This is a remote position, allowing you to work from home.`
        : `This position is located at ${job.location}. The work environment is ${job.industry || 'professional'} and requires ${job.employmentType === 'full-time' ? 'full-time' : job.employmentType || 'standard'} commitment.`
    }
  ];

  return (
    <article className="max-w-4xl mx-auto">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJobSchema(job as any))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema())
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      {/* What the Role Is */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a {job.title}?</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {job.description}
          </p>
        </div>
      </section>

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
          <ul className="space-y-3">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <span className="text-gray-700 leading-relaxed">{responsibility}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills & Qualifications */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills & Qualifications</h2>
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Required Skills</h3>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Experience Requirements */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience Requirements</h2>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-gray-700 leading-relaxed">
            {job.description.includes('experience') 
              ? job.description 
              : 'Experience requirements vary by position. See job description for specific requirements.'}
          </p>
        </div>
      </section>

      {/* Education Requirements */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Education Requirements</h2>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-gray-700 leading-relaxed">
            Education requirements are specified in the job description above. 
            Some positions may accept equivalent experience in lieu of formal education.
          </p>
        </div>
      </section>

      {/* Salary Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Salary & Compensation</h2>
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          {job.compensation ? (
            <div>
              <p className="text-green-800 font-semibold text-lg mb-2">
                {job.compensation}
              </p>
              {job.salaryMin && job.salaryMax && (
                <p className="text-green-700 text-sm">
                  Salary range: ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} {job.currency || 'USD'}
                </p>
              )}
            </div>
          ) : (
            <p className="text-green-700">
              Competitive salary based on experience. Compensation details available during interview process.
            </p>
          )}
        </div>
      </section>

      {/* Internal Links to Blog */}
      {internalLinks.filter(l => l.type === 'blog').length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internalLinks
              .filter(link => link.type === 'blog')
              .map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <h3 className="font-semibold text-blue-900 mb-1">{link.text}</h3>
                  <p className="text-blue-700 text-sm">Learn more about this role</p>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Similar Jobs / Related Roles */}
      {internalLinks.filter(l => l.type === 'similar-job').length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Jobs</h2>
          <div className="space-y-4">
            {internalLinks
              .filter(link => link.type === 'similar-job')
              .map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{link.text}</h3>
                  <p className="text-gray-600 text-sm">View job details</p>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Category Link */}
      {internalLinks.filter(l => l.type === 'category').length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse More Jobs</h2>
          <div className="space-y-2">
            {internalLinks
              .filter(link => link.type === 'category')
              .map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="inline-block px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  {link.text} →
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default JobDescriptionAuthority;

