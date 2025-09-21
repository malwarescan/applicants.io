export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  postedDate: string;
  compensation?: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
}
export const jobs: Job[] = [{
  id: '1',
  title: 'Frontend Developer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  industry: 'Technology',
  postedDate: 'May 15, 2023',
  compensation: '$120,000 - $150,000 per year',
  description: "We're looking for a skilled Frontend Developer to join our team. You'll be responsible for building user interfaces using React and TypeScript. The ideal candidate has 3+ years of experience with modern frontend frameworks.\n\nResponsibilities include implementing responsive designs, collaborating with designers and backend developers, and writing clean, maintainable code.",
  contactEmail: 'jobs@techcorp.com',
  contactPhone: '(555) 123-4567'
}, {
  id: '2',
  title: 'Marketing Manager',
  company: 'GrowthBrand',
  location: 'New York, NY',
  industry: 'Marketing',
  postedDate: 'May 12, 2023',
  compensation: '$90,000 - $110,000 per year',
  description: "GrowthBrand is seeking a Marketing Manager to lead our digital marketing efforts. You'll develop and execute marketing strategies to increase brand awareness and drive customer acquisition.\n\nThe ideal candidate has experience in digital marketing, content strategy, and campaign management.",
  contactEmail: 'careers@growthbrand.com'
}, {
  id: '3',
  title: 'Data Analyst',
  company: 'DataInsights',
  location: 'Remote',
  industry: 'Data Science',
  postedDate: 'May 10, 2023',
  compensation: '$85,000 - $105,000 per year',
  description: "Join our data team to help turn data into actionable insights. You'll analyze large datasets, create visualizations, and provide recommendations to stakeholders.\n\nRequirements include proficiency in SQL, Python, and data visualization tools.",
  contactEmail: 'hiring@datainsights.com',
  contactPhone: '(555) 987-6543'
}, {
  id: '4',
  title: 'Customer Support Specialist',
  company: 'ServiceFirst',
  location: 'Chicago, IL',
  industry: 'Customer Service',
  postedDate: 'May 8, 2023',
  description: "We're looking for a Customer Support Specialist to provide excellent service to our customers. You'll respond to inquiries via phone, email, and chat, and work to resolve customer issues efficiently.\n\nThe ideal candidate is patient, has strong communication skills, and can work in a fast-paced environment.",
  contactEmail: 'support.jobs@servicefirst.com'
}, {
  id: '5',
  title: 'Product Manager',
  company: 'InnovateCo',
  location: 'Austin, TX',
  industry: 'Technology',
  postedDate: 'May 5, 2023',
  compensation: '$130,000 - $160,000 per year',
  description: "InnovateCo is seeking an experienced Product Manager to lead product development initiatives. You'll work closely with engineering, design, and marketing teams to define product strategy and roadmap.\n\nThe ideal candidate has a track record of delivering successful products and strong analytical skills.",
  contactEmail: 'pm.jobs@innovateco.com'
}];
// Helper functions to get unique locations and industries
export const getUniqueLocations = (): string[] => {
  return [...new Set(jobs.map(job => job.location))].sort();
};
export const getUniqueIndustries = (): string[] => {
  return [...new Set(jobs.map(job => job.industry))].sort();
};