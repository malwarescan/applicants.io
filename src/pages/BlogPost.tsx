/**
 * Blog Post Page
 * Implements APPLICANTS_BLOG_SEO_CONTENT_KERNEL structural directives
 */

import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostBySlug, blogPosts } from '../data/blogPosts';
import { generateAllSchemas, generateBlogMetaTags, generateBlogTitle, generateCanonicalUrl } from '../utils/blogUtils';
import { generateInternalLinks, getFirstSectionLinks, getFAQSectionLinks, getConclusionLinks } from '../utils/blogLinkingUtils';
import SEOHead from '../components/SEOHead';
import BlogFAQ from '../components/BlogFAQ';
import BlogInternalLinks from '../components/BlogInternalLinks';
import BlogRelatedJobs from '../components/BlogRelatedJobs';
import { getBlogPostToJobLinks } from '../services/authorityClusterService';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const schemas = generateAllSchemas(post);
  const metaTags = generateBlogMetaTags(post);
  const allInternalLinks = generateInternalLinks(post, blogPosts);
  const firstSectionLinks = getFirstSectionLinks(post, blogPosts);
  const faqSectionLinks = getFAQSectionLinks(post, blogPosts);
  const conclusionLinks = getConclusionLinks(post, blogPosts);
  const jobLinks = getBlogPostToJobLinks(post);

  return (
    <>
      <SEOHead
        title={generateBlogTitle(post)}
        description={post.metaDescription || post.executiveSummary}
        canonical={generateCanonicalUrl(post)}
        metaTags={metaTags}
      />
      
      {/* Schema Markup */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <article className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-gray-900">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                {post.pillar.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              {post.role && (
                <span className="ml-2 inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded">
                  {post.role}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.lastUpdated !== post.publishedDate && (
                <>
                  <span className="mx-2">•</span>
                  <span>Updated {new Date(post.lastUpdated).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </header>

          {/* Executive Summary */}
          <section className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed">{post.executiveSummary}</p>
          </section>

          {/* Key Insights */}
          {post.keyInsights && post.keyInsights.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h2>
              <ul className="space-y-2">
                {post.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Primary Answer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Primary Answer</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{post.primaryAnswer}</p>
          </section>

          {/* First Section Internal Links */}
          {firstSectionLinks.length > 0 && (
            <BlogInternalLinks links={firstSectionLinks} section="first" />
          )}

          {/* Step-by-Step Breakdown */}
          {post.stepByStepBreakdown && post.stepByStepBreakdown.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step Guide</h2>
              <ol className="space-y-4">
                {post.stepByStepBreakdown.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Main Content */}
          <section className="mb-8 prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </section>

          {/* Salary Data */}
          {post.salaryData && (
            <section className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Salary Information</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Minimum</div>
                  <div className="text-xl font-semibold text-gray-900">
                    ${post.salaryData.min.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Median</div>
                  <div className="text-xl font-semibold text-gray-900">
                    ${post.salaryData.median.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Maximum</div>
                  <div className="text-xl font-semibold text-gray-900">
                    ${post.salaryData.max.toLocaleString()}
                  </div>
                </div>
              </div>
              {post.salaryData.location && (
                <div className="mt-4 text-sm text-gray-600">
                  Location: {post.salaryData.location}
                </div>
              )}
            </section>
          )}

          {/* Required Skills */}
          {post.requiredSkills && post.requiredSkills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {post.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Red Flags */}
          {post.redFlags && post.redFlags.length > 0 && (
            <section className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Red Flags to Watch For</h2>
              <ul className="space-y-2">
                {post.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-600 mr-2">⚠</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ Section with Internal Links */}
          {faqSectionLinks.length > 0 && (
            <BlogInternalLinks links={faqSectionLinks} section="faq" />
          )}

          <BlogFAQ faqs={post.faqs} role={post.role} industry={post.industry} />

          {/* Conclusion with Internal Links */}
          {conclusionLinks.length > 0 && (
            <BlogInternalLinks links={conclusionLinks} section="conclusion" />
          )}

          {/* Related Jobs - Direct Links from Authority Cluster */}
          {jobLinks.length > 0 && (
            <section className="mt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available {post.role} Positions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.url}
                    className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{link.text}</h3>
                    <p className="text-gray-600 text-sm">{link.job.location}</p>
                    {link.job.compensation && (
                      <p className="text-gray-900 font-semibold text-sm mt-2">{link.job.compensation}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Jobs - Component */}
          <BlogRelatedJobs role={post.role} industry={post.industry} />

          {/* Related Resources */}
          {allInternalLinks.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Resources</h2>
              <BlogInternalLinks links={allInternalLinks} section="all" />
            </section>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPost;

