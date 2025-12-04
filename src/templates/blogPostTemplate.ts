/**
 * Blog Post Content Generation Template
 * Implements APPLICANTS_CONTENT_AUTHORITY_KERNEL structure
 * Use this template to generate new blog posts programmatically
 */

import { BlogPost } from '../types/blog';

export interface BlogPostTemplate {
  role: string;
  industry: string;
  location: string;
  pillar: BlogPost['pillar'];
  contentAudience: 'job-seeker' | 'employer';
  seniority: 'entry-level' | 'mid-level' | 'senior';
}

/**
 * Generate blog post data from template
 * This function creates a complete blog post following the kernel structure
 */
export function generateBlogPostFromTemplate(
  template: BlogPostTemplate,
  postType: 'what-does' | 'salary' | 'interview' | 'how-to-hire' | 'job-description'
): Partial<BlogPost> {
  const { role, industry, location, pillar, contentAudience, seniority } = template;
  
  const baseSlug = role.toLowerCase().replace(/\s+/g, '-');
  
  const templates = {
    'what-does': {
      slug: `what-does-${baseSlug}-do`,
      title: `What Does a ${role} Do? Complete Job Description Guide`,
      metaDescription: `Learn what a ${role} does, including daily responsibilities, required skills, work environment, and career path opportunities in ${industry}.`,
      canonical: `/hr/what-does-${baseSlug}-do`,
      pillar: 'hr-operations' as const,
      contentAudience: 'job-seeker' as const,
      executiveSummary: `A ${role} is responsible for [primary responsibilities]. This role requires [key skills] and offers opportunities for [career advancement].`,
      keyInsights: [
        `Primary responsibility: [main duty]`,
        `Work environment: [typical settings]`,
        `Typical schedule: [schedule type]`,
        `Career advancement: [advancement paths]`
      ],
      primaryAnswer: `A ${role} [primary function]. They work in [environment] and are responsible for [key duties].`,
      stepByStepBreakdown: [
        '[Step 1]',
        '[Step 2]',
        '[Step 3]',
        '[Step 4]',
        '[Step 5]'
      ]
    },
    'salary': {
      slug: `${baseSlug}-salary`,
      title: `${role} Salary Guide: 2025 Compensation Data`,
      metaDescription: `Complete ${role} salary guide with compensation data by location, experience level, and ${industry}. Includes benefits and career advancement information.`,
      canonical: `/compensation/${baseSlug}-salary`,
      pillar: 'compensation' as const,
      contentAudience: 'job-seeker' as const,
      executiveSummary: `${role}s earn an average salary of $[X] to $[Y] annually, with entry-level positions starting around $[X] and experienced ${role}s earning $[Y]+. Salary varies by location, ${industry}, and experience level.`,
      keyInsights: [
        `Average salary: $[X] - $[Y] annually`,
        `Entry-level: $[X] - $[Y]`,
        `Experienced: $[X] - $[Y]`,
        `Senior: $[X] - $[Y]+`,
        `Hourly rate: $[X] - $[Y] per hour`
      ],
      primaryAnswer: `${role}s earn between $[X] and $[Y] annually on average, with hourly rates typically ranging from $[X] to $[Y]. Salary varies significantly by location, with [high-cost areas] offering the highest compensation.`,
      stepByStepBreakdown: [
        'Research salary ranges for your location and industry',
        'Consider experience level and specialized skills',
        'Factor in benefits package value',
        'Negotiate based on market rates and your skills',
        'Evaluate advancement opportunities'
      ]
    },
    'interview': {
      slug: `${baseSlug}-interview-questions`,
      title: `${role} Interview Questions: Complete Guide for 2025`,
      metaDescription: `Prepare for your ${role} interview with these common questions, sample answers, and tips. Includes questions for both job seekers and employers.`,
      canonical: `/interview-questions/${baseSlug}`,
      pillar: 'interview-questions' as const,
      contentAudience: 'job-seeker' as const,
      executiveSummary: `${role} interviews typically include questions about [key topics]. This guide provides common questions, sample answers, and preparation tips for both candidates and employers.`,
      keyInsights: [
        `Common topics: [topic 1], [topic 2], [topic 3]`,
        `Interview format: [format type]`,
        `Key qualities: [quality 1], [quality 2], [quality 3]`,
        `Preparation: Review common questions and practice answers`
      ],
      primaryAnswer: `${role} interviews focus on [focus areas]. Employers want to assess your [assessment criteria] and fit for the role.`,
      stepByStepBreakdown: [
        'Research the company and role',
        'Prepare examples of relevant experience',
        'Practice common interview questions',
        'Prepare questions about the position',
        'Dress professionally',
        'Arrive early and bring required documents'
      ]
    },
    'how-to-hire': {
      slug: baseSlug,
      title: `How to Hire a ${role}: Complete Guide for 2025`,
      metaDescription: `Learn how to hire a ${role}. Steps, salary data, interview questions, compliance notes, and employer FAQs.`,
      canonical: `/how-to-hire/${baseSlug}`,
      pillar: 'hiring-guides' as const,
      contentAudience: 'employer' as const,
      executiveSummary: `Hiring a ${role} requires understanding [key requirements]. This guide provides step-by-step instructions for finding, evaluating, and hiring the right candidate.`,
      keyInsights: [
        `Average salary: $[X] - $[Y] annually`,
        `High demand: [X]% growth projected`,
        `Critical skills: [skill 1], [skill 2], [skill 3]`,
        `Common certifications: [cert 1], [cert 2]`
      ],
      primaryAnswer: `To hire a ${role}, start by [step 1], [step 2], and [step 3]. The process typically takes [X] weeks.`,
      stepByStepBreakdown: [
        'Write a detailed job description',
        'Post the job on relevant platforms',
        'Screen resumes for relevant experience',
        'Conduct interviews',
        'Check references',
        'Make an offer and begin onboarding'
      ]
    },
    'job-description': {
      slug: `how-to-write-${baseSlug}-job-description`,
      title: `How to Write a ${role} Job Description: Complete Template`,
      metaDescription: `Learn how to write an effective ${role} job description. Includes template, best practices, required sections, and examples for attracting qualified candidates.`,
      canonical: `/hr/how-to-write-${baseSlug}-job-description`,
      pillar: 'hr-operations' as const,
      contentAudience: 'employer' as const,
      executiveSummary: `Writing an effective ${role} job description requires clear [requirements]. This guide provides a complete template and best practices for attracting qualified candidates.`,
      keyInsights: [
        'Include: [requirement 1], [requirement 2], [requirement 3]',
        'Be specific about [specificity area]',
        'Highlight [highlight area]',
        'Use clear, engaging language',
        'Include [include item]'
      ],
      primaryAnswer: `To write an effective ${role} job description, include [components]. Be specific about [specificity] and highlight [highlights].`,
      stepByStepBreakdown: [
        'Write a clear, specific job title',
        'Include company overview',
        'List detailed responsibilities',
        'Specify required skills',
        'Include compensation information',
        'Add application instructions',
        'Review and optimize for clarity'
      ]
    }
  };

  return {
    ...templates[postType],
    role,
    industry,
    location,
    seniority,
    publishedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    author: 'Applicants.IO Team',
    status: 'draft', // Set to 'published' when ready
    targetKeywords: [
      `${postType === 'what-does' ? `what does a ${role.toLowerCase()}` : postType === 'salary' ? `${role.toLowerCase()} salary` : postType === 'interview' ? `${role.toLowerCase()} interview questions` : postType === 'how-to-hire' ? `how to hire a ${role.toLowerCase()}` : `how to write ${role.toLowerCase()} job description`}`,
      `${role.toLowerCase()} ${postType === 'what-does' ? 'job description' : postType === 'salary' ? 'pay rate' : postType === 'interview' ? 'interview tips' : postType === 'how-to-hire' ? 'hiring guide' : 'job posting'}`
    ],
    longTailKeywords: [
      `${postType === 'what-does' ? `what does a ${role.toLowerCase()} do daily` : postType === 'salary' ? `${role.toLowerCase()} salary ${location.toLowerCase()}` : postType === 'interview' ? `how to prepare for ${role.toLowerCase()} interview` : postType === 'how-to-hire' ? `how to hire a ${role.toLowerCase()} in ${location.toLowerCase()}` : `${role.toLowerCase()} job description example`}`
    ],
    entities: {
      occupation: role,
      industry,
      location
    }
  };
}

/**
 * Generate all 5 blog posts for a role cluster
 */
export function generateRoleCluster(template: BlogPostTemplate): Partial<BlogPost>[] {
  return [
    generateBlogPostFromTemplate(template, 'what-does'),
    generateBlogPostFromTemplate(template, 'salary'),
    generateBlogPostFromTemplate(template, 'interview'),
    generateBlogPostFromTemplate(template, 'how-to-hire'),
    generateBlogPostFromTemplate(template, 'job-description')
  ];
}

/**
 * PSEO Expansion: Generate posts for Role × Industry × Location
 */
export function generatePSEOExpansion(
  role: string,
  industries: string[],
  locations: string[]
): Partial<BlogPost>[] {
  const posts: Partial<BlogPost>[] = [];
  
  industries.forEach(industry => {
    locations.forEach(location => {
      const template: BlogPostTemplate = {
        role,
        industry,
        location,
        pillar: 'hiring-guides',
        contentAudience: 'employer',
        seniority: 'mid-level'
      };
      
      // Generate "How to Hire" post with location/industry variation
      posts.push(generateBlogPostFromTemplate(template, 'how-to-hire'));
    });
  });
  
  return posts;
}


