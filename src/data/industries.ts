export interface JobTitle {
  title: string;
}
export interface Industry {
  id: string;
  name: string;
  jobTitles: JobTitle[];
}
export const industries: Industry[] = [{
  id: 'healthcare',
  name: 'Healthcare & Social Assistance',
  jobTitles: [{
    title: 'Registered Nurse (RN)'
  }, {
    title: 'Licensed Practical Nurse (LPN)'
  }, {
    title: 'Certified Nursing Assistant (CNA)'
  }, {
    title: 'Home Health Aide / Caregiver'
  }, {
    title: 'Medical Assistant'
  }, {
    title: 'Physician Assistant'
  }, {
    title: 'Social Worker'
  }, {
    title: 'Medical Biller / Coder'
  }, {
    title: 'Physical Therapist / Occupational Therapist'
  }]
}, {
  id: 'technology',
  name: 'Technology / Information Technology',
  jobTitles: [{
    title: 'Software Developer / Engineer (frontend, backend, full-stack)'
  }, {
    title: 'Data Analyst / Data Scientist'
  }, {
    title: 'IT Support Specialist'
  }, {
    title: 'Cybersecurity Analyst'
  }, {
    title: 'Cloud Engineer (AWS, Azure, GCP)'
  }, {
    title: 'Systems Administrator'
  }, {
    title: 'DevOps Engineer'
  }, {
    title: 'Web Developer'
  }, {
    title: 'Product Manager'
  }]
}, {
  id: 'finance',
  name: 'Finance, Accounting, Business Services',
  jobTitles: [{
    title: 'Accountant (CPA, Staff, Senior)'
  }, {
    title: 'Financial Analyst'
  }, {
    title: 'Bookkeeper'
  }, {
    title: 'Payroll Specialist'
  }, {
    title: 'Auditor'
  }, {
    title: 'Investment Banking Analyst'
  }, {
    title: 'Loan Officer / Mortgage Specialist'
  }, {
    title: 'Insurance Underwriter'
  }, {
    title: 'Business Consultant'
  }]
}, {
  id: 'administrative',
  name: 'Administrative / Customer Support / Office',
  jobTitles: [{
    title: 'Administrative Assistant'
  }, {
    title: 'Executive Assistant'
  }, {
    title: 'Office Manager'
  }, {
    title: 'Receptionist'
  }, {
    title: 'Data Entry Clerk'
  }, {
    title: 'Call Center Agent'
  }, {
    title: 'Customer Service Representative'
  }, {
    title: 'HR Assistant'
  }, {
    title: 'Virtual Assistant'
  }]
}, {
  id: 'education',
  name: 'Education Services',
  jobTitles: [{
    title: 'Teacher (Elementary, Secondary, Special Education)'
  }, {
    title: 'Teaching Assistant / Paraprofessional'
  }, {
    title: 'Substitute Teacher'
  }, {
    title: 'Academic Advisor'
  }, {
    title: 'School Counselor'
  }, {
    title: 'Admissions Coordinator'
  }, {
    title: 'Librarian'
  }, {
    title: 'Instructional Designer'
  }, {
    title: 'Tutor (online / in person)'
  }]
}, {
  id: 'manufacturing',
  name: 'Manufacturing',
  jobTitles: [{
    title: 'Production Worker'
  }, {
    title: 'Machine Operator'
  }, {
    title: 'Quality Control Inspector'
  }, {
    title: 'Assembly Line Worker'
  }, {
    title: 'Maintenance Technician'
  }, {
    title: 'Supply Chain Coordinator'
  }, {
    title: 'CNC Machinist'
  }, {
    title: 'Mechanical Engineer'
  }, {
    title: 'Industrial Designer'
  }]
}, {
  id: 'construction',
  name: 'Construction / Utilities / Skilled Trades',
  jobTitles: [{
    title: 'General Laborer'
  }, {
    title: 'Carpenter'
  }, {
    title: 'Electrician'
  }, {
    title: 'Plumber'
  }, {
    title: 'HVAC Technician'
  }, {
    title: 'Welder'
  }, {
    title: 'Heavy Equipment Operator'
  }, {
    title: 'Project Manager (Construction)'
  }, {
    title: 'Safety Coordinator'
  }]
}, {
  id: 'hospitality',
  name: 'Leisure & Hospitality (Food, Beverage, Travel)',
  jobTitles: [{
    title: 'Restaurant Server / Waiter'
  }, {
    title: 'Bartender'
  }, {
    title: 'Cook / Line Cook / Chef'
  }, {
    title: 'Hotel Front Desk Clerk'
  }, {
    title: 'Housekeeper'
  }, {
    title: 'Event Coordinator'
  }, {
    title: 'Tour Guide'
  }, {
    title: 'Flight Attendant'
  }, {
    title: 'Travel Agent'
  }]
}, {
  id: 'realestate',
  name: 'Real Estate, Rental, Leasing',
  jobTitles: [{
    title: 'Real Estate Agent / Broker'
  }, {
    title: 'Leasing Consultant'
  }, {
    title: 'Property Manager'
  }, {
    title: 'Real Estate Appraiser'
  }, {
    title: 'Maintenance Technician (apartments, rentals)'
  }, {
    title: 'Mortgage Loan Processor'
  }, {
    title: 'Title Examiner'
  }, {
    title: 'Real Estate Marketing Coordinator'
  }]
}, {
  id: 'government',
  name: 'Government / Public Sector',
  jobTitles: [{
    title: 'Administrative Clerk (City/County)'
  }, {
    title: 'Police Officer'
  }, {
    title: 'Firefighter'
  }, {
    title: 'Public Works Laborer'
  }, {
    title: 'Correctional Officer'
  }, {
    title: 'Case Manager'
  }, {
    title: 'Policy Analyst'
  }, {
    title: 'Public Health Worker'
  }, {
    title: 'Postal Worker'
  }]
}];
// Helper functions
export const getAllIndustries = (): Industry[] => {
  return industries;
};
export const getIndustryNames = (): string[] => {
  return industries.map(industry => industry.name);
};
export const getJobTitlesByIndustry = (industryId: string): JobTitle[] => {
  const industry = industries.find(ind => ind.id === industryId);
  return industry ? industry.jobTitles : [];
};
export const getIndustryById = (id: string): Industry | undefined => {
  return industries.find(industry => industry.id === id);
};
export const getIndustryByName = (name: string): Industry | undefined => {
  return industries.find(industry => industry.name === name);
};