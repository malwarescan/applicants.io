/**
 * Blog FAQ Component
 * Implements NewFAQ integration per APPLICANTS_BLOG_SEO_CONTENT_KERNEL
 */

import React from 'react';
import { FAQItem } from '../types/blog';

interface BlogFAQProps {
  faqs: FAQItem[];
  role?: string;
  industry?: string;
}

const BlogFAQ: React.FC<BlogFAQProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 py-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {faq.question}
            </h3>
            <div className="text-gray-700 leading-relaxed">
              {faq.answer}
            </div>
            {(faq.role || faq.industry) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  {faq.role && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {faq.role}
                    </span>
                  )}
                  {faq.industry && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {faq.industry}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogFAQ;

