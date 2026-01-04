# Applicants.io Landing Page

A production-ready Nuxt 3 landing page for Applicants.io, built with TailwindCSS and following high-converting SaaS landing page best practices.

## Features

- **Modern Tech Stack**: Nuxt 3, TailwindCSS, TypeScript
- **High-Converting Design**: Follows proven SaaS landing page anatomy
- **Mobile-First**: Responsive design from 320px to 1440px+
- **SEO Optimized**: Meta tags, JSON-LD structured data, semantic HTML
- **Accessible**: WCAG AA compliant with proper ARIA labels
- **Performance**: Optimized images, minimal dependencies
- **Content-Driven**: All copy managed through `content/landing.ts`

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd applicants-io-landing

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
applicants-io-landing/
├── components/           # Vue components
│   ├── NavBar.vue       # Navigation with CTA
│   ├── Hero.vue         # Hero section with mesh background
│   ├── TrustBar.vue     # Trust logos
│   ├── FeaturesGrid.vue # 4 key features
│   ├── HowItWorks.vue   # 3-step process
│   ├── WhyChooseUs.vue  # 4 pillars
│   ├── IntegrationsBar.vue # Integration logos
│   ├── ReviewsStrip.vue # Customer testimonials
│   ├── Pricing.vue      # 3-tier pricing
│   ├── FAQ.vue          # Accordion FAQ
│   ├── CTA.vue          # Bottom CTA section
│   └── Footer.vue       # Footer with links
├── content/
│   └── landing.ts       # All landing page content
├── layouts/
│   └── default.vue      # Main layout
├── pages/
│   └── index.vue        # Landing page
├── assets/
│   ├── css/
│   │   └── main.css     # Tailwind + custom utilities
│   └── logo/
│       └── A-mark.svg   # Logo
├── directives/
│   └── intersect.ts     # Scroll animations
├── nuxt.config.ts       # Nuxt configuration
└── tailwind.config.ts   # Tailwind configuration
```

## Content Management

All landing page content is managed through `content/landing.ts`. Marketing teams can update copy without touching components:

```typescript
// Example: Update hero section
export const hero: Hero = {
  title: "Your New Headline",
  subtitle: "Your new subtext here...",
  // ... rest of content
}
```

### Content Sections

- **Hero**: Main headline, subtext, CTAs
- **Trust**: Company logos
- **Features**: 4 key features with stats
- **How It Works**: 3-step process
- **Why Choose Us**: 4 key differentiators
- **Integrations**: Tool logos
- **Reviews**: Customer testimonials
- **Pricing**: 3-tier pricing plans
- **FAQ**: Frequently asked questions
- **CTA**: Bottom call-to-action

## Brand Tokens

The design system uses these brand colors:

```css
--primary: #3A86FF    /* Blue */
--purple: #8C1EFF     /* Purple */
--magenta: #FF4D6D    /* Magenta */
--charcoal: #0F172A   /* Dark */
--offwhite: #F9FAFB   /* Light */
```

## Customization

### Adding New Sections

1. Create component in `components/`
2. Add content to `content/landing.ts`
3. Import and add to `pages/index.vue`

### Styling

- Use TailwindCSS classes for styling
- Custom utilities in `assets/css/main.css`
- Glass effect: `.glass` class
- Card effect: `.card` class

### Animations

- Scroll animations via `v-intersect` directive
- Hover effects with Tailwind transitions
- No heavy animation libraries

## Deployment

### Vercel (Recommended)

1. Push to GitHub/GitLab
2. Import repository in Vercel
3. Deploy automatically

Vercel configuration is already set in `nuxt.config.ts`:

```typescript
nitro: {
  preset: 'vercel'
}
```

### Other Platforms

The app is compatible with any Node.js hosting platform:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## SEO & Performance

### SEO Features

- Meta tags for all social platforms
- JSON-LD structured data
- Semantic HTML structure
- Proper heading hierarchy (H1 → H3)

### Performance Optimizations

- Image optimization with @nuxt/image
- Minimal JavaScript bundle
- CSS purging with TailwindCSS
- Lazy loading for images

## Accessibility

- WCAG AA compliance
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Create feature branch: `git checkout -b feature/description`
2. Make changes
3. Test locally: `npm run dev`
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/description`
6. Create pull request

## Support

For technical issues:
- Check the [Nuxt 3 documentation](https://nuxt.com/docs)
- Review [TailwindCSS docs](https://tailwindcss.com/docs)

For content updates:
- Edit `content/landing.ts`
- No technical knowledge required

## License

Proprietary - All rights reserved by Applicants.io
