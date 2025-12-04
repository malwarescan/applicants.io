/**
 * Blog Internal Links Component
 * Implements APPLICANTS_BLOG_SEO_CONTENT_KERNEL internal linking directives
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { InternalLink } from '../utils/blogLinkingUtils';

interface BlogInternalLinksProps {
  links: InternalLink[];
  section?: 'first' | 'faq' | 'conclusion' | 'all';
}

const BlogInternalLinks: React.FC<BlogInternalLinksProps> = ({ links, section = 'all' }) => {
  if (!links || links.length === 0) {
    return null;
  }

  let displayLinks = links;
  
  if (section === 'first') {
    displayLinks = links.filter(link => link.type === 'parent' || link.type === 'sibling').slice(0, 2);
  } else if (section === 'faq') {
    displayLinks = links.filter(link => link.type === 'interview' || link.type === 'template').slice(0, 2);
  } else if (section === 'conclusion') {
    displayLinks = links.filter(link => link.type === 'parent' || link.type === 'category').slice(0, 2);
  }

  if (displayLinks.length === 0) {
    return null;
  }

  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
      <ul className="space-y-2">
        {displayLinks.map((link, index) => (
          <li key={index}>
            <Link
              to={link.url.replace('https://applicants.io', '')}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogInternalLinks;


