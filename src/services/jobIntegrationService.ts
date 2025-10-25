/**
 * Job Integration Service
 * Handles integration with external job boards and APIs
 * 
 * IMPORTANT: Always check terms of service and get permission before integration
 */

export interface ExternalJob {
  id: string;
  title: string;
  company: string;
  location: string;
  industry?: string;
  postedDate: string;
  compensation?: string;
  description: string;
  source: string;
  sourceUrl: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface JobIntegrationConfig {
  enabled: boolean;
  rateLimit: number; // requests per minute
  maxJobs: number;
  allowedDomains: string[];
}

class JobIntegrationService {
  private config: JobIntegrationConfig = {
    enabled: false,
    rateLimit: 10, // 10 requests per minute
    maxJobs: 50,
    allowedDomains: ['synaxusinc.com'] // Only allow approved domains
  };

  private requestQueue: Array<() => Promise<any>> = [];
  private lastRequestTime = 0;

  /**
   * Check if a domain is allowed for integration
   */
  private isDomainAllowed(domain: string): boolean {
    return this.config.allowedDomains.includes(domain);
  }

  /**
   * Rate limiting helper
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = (60 * 1000) / this.config.rateLimit; // Convert to ms

    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Fetch jobs from synaxusinc.com
   * Uses our own PHP API endpoint that scrapes and caches Synaxus JobPosting schema data
   */
  async fetchSynaxusJobs(): Promise<ExternalJob[]> {
    if (!this.config.enabled) {
      throw new Error('Job integration is not enabled');
    }

    if (!this.isDomainAllowed('synaxusinc.com')) {
      throw new Error('Domain not allowed for integration');
    }

    try {
      await this.rateLimit();

      // Fetch from our PHP API endpoint that serves scraped Synaxus jobs
      const apiUrl = typeof window !== 'undefined' 
        ? '/api/synaxus-jobs.php'  // Relative URL for client-side
        : 'http://localhost/api/synaxus-jobs.php';  // Full URL for server-side

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch jobs');
      }

      // Transform our internal format to ExternalJob format
      return this.transformSynaxusJobsToExternal(data.jobs || []);
    } catch (error) {
      console.error('Error fetching Synaxus jobs via API:', error);
      throw new Error('Failed to fetch Synaxus jobs');
    }
  }

  /**
   * Transform Synaxus job data to ExternalJob format
   */
  private transformSynaxusJobsToExternal(jobs: any[]): ExternalJob[] {
    return jobs.map((job) => ({
      id: job.identifier?.value || `synaxus-${Date.now()}`,
      title: job.title || 'Untitled Position',
      company: job.hiringOrganization?.name || 'Synaxus Inc.',
      location: this.formatLocation(job.jobLocation),
      industry: job.industry || 'Marketing Services',
      postedDate: job.datePosted || new Date().toISOString().split('T')[0],
      compensation: this.formatCompensation(job.salary),
      description: job.description || 'No description available',
      source: 'Synaxus Inc.',
      sourceUrl: job.url || 'https://synaxusinc.com',
      contactEmail: job.contactEmail,
      contactPhone: job.contactPhone,
    }));
  }

  /**
   * Format job location from jobLocation array
   */
  private formatLocation(jobLocation: any[]): string {
    if (!jobLocation || jobLocation.length === 0) {
      return 'Location TBD';
    }

    const loc = jobLocation[0];
    const parts = [];
    if (loc.city) parts.push(loc.city);
    if (loc.region) parts.push(loc.region);
    
    return parts.length > 0 ? parts.join(', ') : 'Location TBD';
  }

  /**
   * Format compensation from salary object
   */
  private formatCompensation(salary: any): string | undefined {
    if (!salary) return undefined;

    const { min, max, currency, unit } = salary;
    const currencySymbol = currency === 'USD' ? '$' : currency;

    if (min !== null && max !== null) {
      return `${currencySymbol}${min} - ${currencySymbol}${max} per ${unit.toLowerCase()}`;
    } else if (min !== null) {
      return `${currencySymbol}${min}+ per ${unit.toLowerCase()}`;
    }

    return undefined;
  }

  /**
   * Fallback method: Scrape jobs from synaxusinc.com careers page
   * Since you own the site, this is perfectly legal and ethical
   */
  private async scrapeSynaxusJobs(): Promise<ExternalJob[]> {
    try {
      await this.rateLimit();

      // Fetch the careers page
      const response = await fetch('https://synaxusinc.com/careers', {
        method: 'GET',
        headers: {
          'User-Agent': 'Applicants.IO Integration Bot/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch careers page: ${response.status}`);
      }

      const html = await response.text();
      
      // Parse the HTML to extract job information
      // This is a simplified parser - you may need to adjust based on your site's structure
      const jobs = this.parseJobsFromHTML(html);
      
      return this.validateAndTransformJobs(jobs);
    } catch (error) {
      console.error('Error scraping Synaxus jobs:', error);
      throw error;
    }
  }

  /**
   * Parse job information from HTML content
   * Adjust this method based on your synaxusinc.com site structure
   */
  private parseJobsFromHTML(html: string): any[] {
    const jobs: any[] = [];
    
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Look for job listings - adjust selectors based on your site's structure
    const jobElements = doc.querySelectorAll('.job-listing, .career-item, [data-job], .job-card');
    
    jobElements.forEach((element, index) => {
      try {
        const job = {
          id: `synaxus-${index}`,
          title: this.extractText(element, '.job-title, .title, h3, h2') || 'Position Available',
          company: 'Synaxus Inc.',
          location: this.extractText(element, '.location, .job-location, .address') || 'Location TBD',
          industry: this.extractText(element, '.department, .category') || 'Technology',
          postedDate: this.extractText(element, '.posted-date, .date') || new Date().toISOString().split('T')[0],
          compensation: this.extractText(element, '.salary, .compensation, .pay'),
          description: this.extractText(element, '.description, .job-description, .summary') || 'See full description on our careers page.',
          url: this.extractHref(element, 'a') || 'https://synaxusinc.com/careers',
        };
        
        jobs.push(job);
      } catch (error) {
        console.warn('Error parsing job element:', error);
      }
    });
    
    // If no specific job elements found, try to extract from general content
    if (jobs.length === 0) {
      const titleElements = doc.querySelectorAll('h1, h2, h3, h4');
      titleElements.forEach((element, index) => {
        const text = element.textContent?.trim() || '';
        if (text.toLowerCase().includes('engineer') || 
            text.toLowerCase().includes('developer') || 
            text.toLowerCase().includes('manager') ||
            text.toLowerCase().includes('analyst')) {
          jobs.push({
            id: `synaxus-${index}`,
            title: text,
            company: 'Synaxus Inc.',
            location: 'See job posting',
            industry: 'Technology',
            postedDate: new Date().toISOString().split('T')[0],
            description: 'Visit our careers page for full details.',
            url: 'https://synaxusinc.com/careers',
          });
        }
      });
    }
    
    return jobs;
  }

  /**
   * Helper method to extract text content from an element
   */
  private extractText(element: Element, selector: string): string | null {
    const found = element.querySelector(selector);
    return found?.textContent?.trim() || null;
  }

  /**
   * Helper method to extract href from an element
   */
  private extractHref(element: Element, selector: string): string | null {
    const found = element.querySelector(selector) as HTMLAnchorElement;
    return found?.href || null;
  }

  /**
   * Validate and transform external job data
   */
  private validateAndTransformJobs(rawJobs: any[]): ExternalJob[] {
    return rawJobs
      .slice(0, this.config.maxJobs)
      .map((job, index) => ({
        id: `synaxus-${job.id || index}`,
        title: job.title || 'Untitled Position',
        company: job.company || 'Synaxus Inc.',
        location: job.location || 'Location Not Specified',
        industry: job.industry || 'Technology',
        postedDate: job.postedDate || new Date().toISOString().split('T')[0],
        compensation: job.compensation,
        description: job.description || 'No description available',
        source: 'Synaxus Inc.',
        sourceUrl: job.url || 'https://synaxusinc.com',
        contactEmail: job.contactEmail, // Only include if explicitly provided
        contactPhone: job.contactPhone, // Only include if explicitly provided
      }))
      .filter(job => job.title !== 'Untitled Position'); // Filter out invalid jobs
  }

  /**
   * Merge external jobs with existing job data
   */
  mergeJobs(existingJobs: any[], externalJobs: ExternalJob[]): any[] {
    // Remove duplicates based on title and company
    const existingJobKeys = new Set(
      existingJobs.map(job => `${job.title}-${job.company}`.toLowerCase())
    );

    const newJobs = externalJobs.filter(
      job => !existingJobKeys.has(`${job.title}-${job.company}`.toLowerCase())
    );

    return [...existingJobs, ...newJobs];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<JobIntegrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): JobIntegrationConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable integration
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }
}

// Export singleton instance
export const jobIntegrationService = new JobIntegrationService();

/**
 * Utility function to check robots.txt compliance
 * This should be called before any scraping activity
 */
export async function checkRobotsTxt(url: string): Promise<boolean> {
  try {
    const robotsUrl = new URL('/robots.txt', url).toString();
    const response = await fetch(robotsUrl);
    
    if (!response.ok) {
      return false; // If no robots.txt, assume scraping is not allowed
    }

    const robotsText = await response.text();
    
    // Simple check - in production, use a proper robots.txt parser
    const userAgentMatch = robotsText.match(/User-agent:\s*\*/i);
    const disallowMatch = robotsText.match(/Disallow:\s*(.+)/i);
    
    if (userAgentMatch && disallowMatch) {
      const disallowPath = disallowMatch[1].trim();
      return disallowPath === '' || disallowPath === '/'; // Empty or root means all allowed
    }

    return true; // If unclear, assume allowed
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    return false; // On error, assume not allowed
  }
}

/**
 * Utility function to sanitize job descriptions
 */
export function sanitizeJobDescription(description: string): string {
  // Remove HTML tags
  let sanitized = description.replace(/<[^>]*>/g, '');
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Limit length
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '...';
  }
  
  return sanitized;
}
