export interface Hero {
  title: string
  subtitle: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA: {
    text: string
    href: string
  }
}

export interface TrustLogo {
  name: string
  src: string
  alt: string
}

export interface Feature {
  title: string
  description: string
  stat: string
  icon: string
}

export interface HowItWorksStep {
  number: number
  title: string
  description: string
  icon: string
}

export interface WhyChooseUs {
  title: string
  description: string
  icon: string
}

export interface Integration {
  name: string
  src: string
  alt: string
}

export interface Review {
  quote: string
  author: string
  title: string
  company: string
  avatar: string
}

export interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  popular?: boolean
}

export interface FAQ {
  question: string
  answer: string
}

export interface CTA {
  title: string
  subtitle: string
  primaryCTA: {
    text: string
    href: string
  }
}

export interface Organization {
  name: string
  url: string
  logo: string
  sameAs: string[]
}

export const useLandingContent = () => {
  const hero: Hero = {
    title: "Company Reviews & Employer Intelligence",
    subtitle: "Research companies, verify recruiting practices, and identify exploitative hiring patterns. Evidence-first reviews aligned with DevilCorpWiki.",
    primaryCTA: {
      text: "Submit Review",
      href: "/submit-review"
    },
    secondaryCTA: {
      text: "Browse Companies",
      href: "/companies"
    }
  }

  const trustLogos: TrustLogo[] = [
    { name: "Indeed", src: "/logos/indeed.svg", alt: "Indeed" },
    { name: "LinkedIn", src: "/logos/linkedin.svg", alt: "LinkedIn" },
    { name: "Google", src: "/logos/google.svg", alt: "Google" },
    { name: "GMB", src: "/logos/gmb.svg", alt: "Google My Business" },
    { name: "Stripe", src: "/logos/stripe.svg", alt: "Stripe" }
  ]

  const features: Feature[] = [
    {
      title: "Verified company reviews",
      description: "Evidence-backed reviews with citations, timestamps, and moderation",
      stat: "Evidence-first reviews",
      icon: ""
    },
    {
      title: "DevilCorp pattern matching",
      description: "Taxonomy-aligned classification of exploitative recruiting patterns",
      stat: "DevilCorpWiki-aligned",
      icon: ""
    },
    {
      title: "Company intelligence",
      description: "Structured data on networks, aliases, locations, and related entities",
      stat: "Network mapping",
      icon: ""
    },
    {
      title: "Search-first discovery",
      description: "Optimized for Google and AI answer engines to surface company insights",
      stat: "Search-optimized",
      icon: ""
    }
  ]

  const howItWorks: HowItWorksStep[] = [
    {
      number: 1,
      title: "Research companies",
      description: "Search company profiles with aggregated reviews and pattern classifications",
      icon: ""
    },
    {
      number: 2,
      title: "Submit verified reviews",
      description: "Share your experience with evidence, timestamps, and structured details",
      icon: ""
    },
    {
      number: 3,
      title: "Access intelligence",
      description: "Explore network maps, aliases, patterns, and structured company data",
      icon: ""
    }
  ]

  const whyChooseUs: WhyChooseUs[] = [
    {
      title: "Evidence-first",
      description: "All reviews require citations, timestamps, and moderation for accuracy",
      icon: ""
    },
    {
      title: "DevilCorpWiki-aligned",
      description: "Shared taxonomy and pattern classification with DevilCorpWiki",
      icon: ""
    },
    {
      title: "Privacy-respecting",
      description: "Minimal PII collection, focused on review verification and moderation",
      icon: ""
    },
    {
      title: "Defamation-safe",
      description: "Careful framing separates verified facts, reported experiences, and analysis",
      icon: ""
    }
  ]

  const integrations: Integration[] = [
    { name: "DevilCorpWiki", src: "/logos/devilcorpwiki.svg", alt: "DevilCorpWiki" },
    { name: "Google Search", src: "/logos/google.svg", alt: "Google Search" },
    { name: "Structured Data", src: "/logos/schema.svg", alt: "Schema.org" }
  ]

  const reviews: Review[] = [
    {
      quote: "This platform helped me avoid a commission-only trap. The pattern matching showed exactly what I needed to know before wasting my time.",
      author: "Alex M.",
      title: "Job Seeker",
      company: "Verified Reviewer",
      avatar: "/avatars/alex.jpg"
    },
    {
      quote: "The network mapping feature revealed multiple aliases for the same company. Saved me from applying to the same exploitative structure three times.",
      author: "Jordan K.",
      title: "Researcher",
      company: "Verified Reviewer",
      avatar: "/avatars/jordan.jpg"
    },
    {
      quote: "Finally, a review site that prioritizes evidence over hearsay. The citation requirements make this trustworthy.",
      author: "Taylor R.",
      title: "Reviewer",
      company: "Verified Reviewer",
      avatar: "/avatars/taylor.jpg"
    }
  ]

  // Pricing removed - Applicants.io is a free review platform, not a paid service
  const pricing: PricingPlan[] = []

  const faq: FAQ[] = [
    {
      question: "How do you verify reviews?",
      answer: "All reviews require timestamps, role details, location, and timeframe. Optional evidence attachments are encouraged. Our moderation team reviews submissions to ensure accuracy and compliance with our policies."
    },
    {
      question: "What is DevilCorpWiki alignment?",
      answer: "Applicants.io shares the same pattern taxonomy as DevilCorpWiki, classifying exploitative recruiting behaviors like commission-only traps, misleading onboarding, churn offices, and management training pyramids."
    },
    {
      question: "Can companies dispute reviews?",
      answer: "Yes. Company representatives can request corrections for factual errors, submit counter-evidence, or appeal moderation decisions. However, companies cannot pay to remove reviews or suppress categories."
    },
    {
      question: "How is this different from Glassdoor?",
      answer: "Applicants.io focuses specifically on recruiting practices and DevilCorp patterns, with evidence-first verification and DevilCorpWiki taxonomy alignment. We prioritize structured intelligence over general workplace reviews."
    },
    {
      question: "Is this a job board or application portal?",
      answer: "No. Applicants.io is explicitly not a job board, application portal, or candidate management system. We are a review and employer intelligence platform only. Any job-application functionality is prohibited by our kernel."
    }
  ]

  const cta: CTA = {
    title: "Research companies. Verify patterns. Share evidence.",
    subtitle: "Join reviewers documenting exploitative recruiting practices and building company intelligence",
    primaryCTA: {
      text: "Submit Review",
      href: "/submit-review"
    }
  }

  const org: Organization = {
    name: 'Applicants.io',
    url: 'https://applicants.io',
    logo: '/logo.png',
    sameAs: ['https://www.linkedin.com/company/applicants-io']
  }

  return {
    hero,
    trustLogos,
    features,
    howItWorks,
    whyChooseUs,
    integrations,
    reviews,
    pricing,
    faq,
    cta,
    org
  }
}
