/**
 * Blog Feed Page
 * Serves NDJSON feeds for AI ingestion (ChatGPT, Claude, Perplexity)
 */

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublishedPosts } from '../data/blogPosts';
import {
  generateArticlesFeed,
  generateHiringGuidesFeed,
  generateFAQsFeed,
  generatePillarFeed,
  generateSalariesFeed,
  generateRolesFeed
} from '../utils/blogFeedUtils';
import {
  generateJobsFeed,
  generateIndustryJobsFeed,
  generateRoleJobsFeed,
  generateRemoteJobsFeed
} from '../utils/jobFeedUtils';
import { ContentPillar } from '../types/blog';

const BlogFeed: React.FC = () => {
  const { feedType } = useParams<{ feedType: string }>();
  const allPosts = getPublishedPosts();

  useEffect(() => {
    let feedContent = '';

    switch (feedType) {
      case 'articles':
        feedContent = generateArticlesFeed(allPosts);
        break;
      case 'hiring-guides':
        feedContent = generateHiringGuidesFeed(allPosts);
        break;
      case 'faqs':
        feedContent = generateFAQsFeed(allPosts);
        break;
      case 'salaries':
        feedContent = generateSalariesFeed(allPosts);
        break;
      case 'roles':
        feedContent = generateRolesFeed(allPosts);
        break;
      case 'job-descriptions':
        feedContent = generateJobsFeed();
        break;
      case 'interview-questions':
        feedContent = generatePillarFeed(allPosts, 'interview-questions');
        break;
      case 'hr-operations':
        feedContent = generatePillarFeed(allPosts, 'hr-operations');
        break;
      case 'compliance':
        feedContent = generatePillarFeed(allPosts, 'compliance');
        break;
      case 'compensation':
        feedContent = generatePillarFeed(allPosts, 'compensation');
        break;
      // Job feeds
      case 'jobs':
        feedContent = generateJobsFeed();
        break;
      case 'jobs-remote':
        feedContent = generateRemoteJobsFeed();
        break;
      default:
        // Check if it's an industry feed (jobs-{industry})
        if (feedType?.startsWith('jobs-')) {
          const industry = feedType.replace('jobs-', '');
          feedContent = generateIndustryJobsFeed(industry);
        } else {
          feedContent = generateArticlesFeed(allPosts);
        }
    }

    // Set content type and return feed
    const blob = new Blob([feedContent], { type: 'application/x-ndjson' });
    const url = URL.createObjectURL(blob);
    
    // For server-side rendering, we'd return this differently
    // For now, we'll just display it (in production, this should be a server route)
    console.log('Feed content:', feedContent);
  }, [feedType, allPosts]);

  // In a real implementation, this would be a server route that returns the NDJSON
  // For now, we'll return a simple message
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Blog Feed: {feedType}
        </h1>
        <p className="text-gray-600">
          This feed is available at /feeds/{feedType}.ndjson
        </p>
        <p className="text-gray-600 mt-4">
          In production, this should be served as a server route that returns the NDJSON content directly.
        </p>
      </div>
    </div>
  );
};

export default BlogFeed;

