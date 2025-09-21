import React from 'react';
import { Link } from 'react-router-dom';

const HeroDither: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200"
      aria-label="Applicants.io — AI-Powered Recruiting"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-16 md:py-20">
        {/* Very subtle dither layer */}
        <div className="absolute inset-0 dither-bg dither-drift motion-ok"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl/tight md:text-4xl/tight font-headline font-semibold text-gray-900 mb-4">
            AI-Powered Recruiting. Fully Managed.
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We use AI to showcase applicants' strengths, not to keep them buried in filters or hidden from employers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3
                       bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Book a Demo
            </Link>

            <Link 
              to="/jobs"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3
                       border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Trusted by teams hiring across sales, support, operations, and more.
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDither;
