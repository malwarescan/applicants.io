import { EnhancedJobService } from '../services/enhancedJobService';
import { JobFormData } from '../types/job';

export const seedSampleJobs = () => {
  const sampleJobs: JobFormData[] = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      industry: 'Technology',
      remote: true,
      employmentType: 'full-time',
      description: `We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building beautiful, responsive user interfaces using React, TypeScript, and modern web technologies.

You'll work closely with our design and backend teams to create exceptional user experiences that delight our customers and drive business growth. This is an exciting opportunity to shape the future of our product and work with cutting-edge technologies.

We offer competitive compensation, comprehensive benefits, and a flexible work environment that values work-life balance.`,
      responsibilities: `Develop and maintain responsive web applications using React and TypeScript
Collaborate with designers to implement pixel-perfect UI components
Optimize applications for maximum speed and scalability
Write clean, maintainable, and well-tested code
Mentor junior developers and conduct code reviews
Participate in architectural decisions and technical planning`,
      requirements: `5+ years of experience with React and TypeScript
Strong understanding of modern JavaScript (ES6+)
Experience with state management libraries (Redux, Zustand, etc.)
Proficiency with CSS preprocessors and responsive design
Experience with testing frameworks (Jest, React Testing Library)
Strong communication and collaboration skills`,
      compensation: '$120,000 - $160,000 per year + equity + benefits',
      salaryMin: 120000,
      salaryMax: 160000,
      currency: 'USD',
      contactEmail: 'careers@techcorp.com',
      contactPhone: '(555) 123-4567',
      applyUrl: 'https://techcorp.com/careers/frontend-dev',
      applyEmail: 'jobs@techcorp.com'
    },
    {
      title: 'Marketing Manager',
      company: 'GrowthBrand Inc.',
      location: 'New York, NY',
      industry: 'Marketing',
      remote: false,
      employmentType: 'full-time',
      description: `GrowthBrand is seeking a Marketing Manager to lead our digital marketing efforts and drive customer acquisition. You'll develop and execute marketing strategies that increase brand awareness and generate qualified leads.

This role offers the opportunity to work with a dynamic team in a fast-paced environment where your ideas can make a real impact on our growth trajectory.`,
      responsibilities: `Develop and execute comprehensive digital marketing strategies
Manage social media campaigns across multiple platforms
Create compelling content for blogs, emails, and social media
Analyze campaign performance and optimize for better results
Collaborate with sales team to align marketing and sales efforts
Manage marketing budget and track ROI`,
      requirements: `3+ years of experience in digital marketing
Proficiency with marketing automation tools (HubSpot, Marketo, etc.)
Strong analytical skills and data-driven mindset
Excellent written and verbal communication skills
Experience with SEO and SEM strategies
Bachelor's degree in Marketing or related field`,
      compensation: '$80,000 - $100,000 per year + performance bonus',
      salaryMin: 80000,
      salaryMax: 100000,
      currency: 'USD',
      contactEmail: 'hr@growthbrand.com',
      applyUrl: 'https://growthbrand.com/careers/marketing-manager'
    },
    {
      title: 'Data Analyst',
      company: 'DataInsights Corp',
      location: 'Remote',
      industry: 'Data Science',
      remote: true,
      employmentType: 'contract',
      description: `Join our data team to help turn data into actionable insights that drive business decisions. You'll work with large datasets, create visualizations, and provide recommendations to stakeholders across the organization.

This is a 6-month contract position with the possibility of extension or conversion to full-time.`,
      responsibilities: `Analyze large datasets to identify trends and patterns
Create interactive dashboards and data visualizations
Develop automated reporting solutions
Collaborate with stakeholders to understand business requirements
Present findings and recommendations to leadership
Maintain data quality and integrity`,
      requirements: `2+ years of experience in data analysis
Proficiency in SQL and Python
Experience with data visualization tools (Tableau, Power BI, etc.)
Strong statistical and analytical skills
Experience with cloud platforms (AWS, GCP, Azure)
Bachelor's degree in Data Science, Statistics, or related field`,
      compensation: '$70 - $90 per hour',
      salaryMin: 70000,
      salaryMax: 90000,
      currency: 'USD',
      contactEmail: 'data-jobs@datainsights.com',
      applyEmail: 'contractor@datainsights.com'
    }
  ];

  // Add sample jobs
  sampleJobs.forEach(jobData => {
    try {
      EnhancedJobService.saveJob(jobData);
      console.log(`Seeded job: ${jobData.title} at ${jobData.company}`);
    } catch (error) {
      console.error(`Failed to seed job: ${jobData.title}`, error);
    }
  });

  console.log(`Successfully seeded ${sampleJobs.length} sample jobs`);
};

// Function to clear all enhanced jobs (for testing)
export const clearEnhancedJobs = () => {
  localStorage.removeItem('enhanced_jobs');
  console.log('Cleared all enhanced jobs');
};
