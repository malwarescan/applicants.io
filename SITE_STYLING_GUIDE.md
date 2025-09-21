# Applicants.IO - Site Styling Guide

## Overview
This document provides a comprehensive front-end audit of the Applicants.IO job board application. The site is built with React 18.3.1, TypeScript, and Vite 5.2.0, utilizing Tailwind CSS 3.4.17 for styling. The design system emphasizes a clean, professional aesthetic with a light theme preference, focusing on usability and accessibility. This audit was conducted in read-only mode, examining the actual codebase without modifying any existing files or configurations.

**Tech Stack Confirmed:**
- React 18.3.1 with TypeScript
- Vite 5.2.0 (build tool)
- Tailwind CSS 3.4.17
- PostCSS with Autoprefixer
- React Router DOM 6.26.2

## Typography

### Font Families

#### Primary Font: Inter
- **Source**: `tailwind.config.js` (fontFamily.sans) and `src/index.css` (body selector)
- **Usage**: Main body text, navigation, and general UI elements
- **Font Stack**: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`
- **Features**: 
  - Font feature settings: `'cv02', 'cv03', 'cv04', 'cv11'` (see `src/index.css`)
  - Optimized text rendering: `text-rendering: optimizeLegibility`
  - Antialiased font smoothing: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`

#### Headline Font: Alan Sans
- **Source**: `tailwind.config.js` (fontFamily.headline)
- **Usage**: Headers, titles, and prominent text elements
- **Font Stack**: `'Alan Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`
- **Applied to**: 
  - Site logo/brand name (`src/components/Navbar.tsx` - line 16)
  - Page headings (`src/pages/Home.tsx` - lines 69, 82, 95)
  - Job titles (`src/components/JobListing.tsx` - line 28)
  - Filter section headers (`src/components/FilterSection.tsx` - lines 46, 148)

### Font Weights
- **Light**: `font-light` (300)
- **Normal**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)
- **Bold**: `font-bold` (700)

### Text Sizes
- **xs**: `text-xs` (0.75rem / 12px)
- **sm**: `text-sm` (0.875rem / 14px)
- **base**: `text-base` (1rem / 16px)
- **lg**: `text-lg` (1.125rem / 18px)
- **xl**: `text-xl` (1.25rem / 20px)
- **2xl**: `text-2xl` (1.5rem / 24px)

## Color System

### Standard Tailwind Colors (No Custom Brand Tokens)
**Note**: The application uses standard Tailwind CSS colors without custom brand tokens. No custom color extensions were found in `tailwind.config.js`.

### Color Usage Patterns (Observed in Components)

#### Blue Theme (Primary Interactive Color)
- **Blue 600**: `#2563eb` - Primary buttons, links, and active states
  - Used in: `src/components/Navbar.tsx` (lines 23, 26, 29, 32, 35), `src/components/SearchBar.tsx` (line 40), `src/components/JobListing.tsx` (line 28)
- **Blue 700**: `#1d4ed8` - Button hover states  
  - Used in: `src/components/SearchBar.tsx` (line 40)
- **Blue 500**: `#3b82f6` - Focus rings and accents
  - Used in: `src/components/SearchBar.tsx` (line 34), `src/components/FilterSection.tsx` (line 64)
- **Blue 100**: `#dbeafe` - Light backgrounds for tags and badges
  - Used in: `src/pages/Home.tsx` (lines 107, 112), `src/components/FilterSection.tsx` (lines 48, 118, 150, 187)
- **Blue 800**: `#1e40af` - Text on light blue backgrounds
  - Used in: `src/pages/Home.tsx` (lines 107, 112), `src/components/FilterSection.tsx` (lines 48, 118, 150, 187)

#### Gray Scale (Text Hierarchy & Structure)
- **White**: `#ffffff` - Main background color (`src/App.tsx` - line 13)
- **Gray 50**: `#f9fafb` - Subtle hover backgrounds
  - Used in: `src/components/JobListing.tsx` (line 27), `src/components/FilterSection.tsx` (lines 42, 144)
- **Gray 100**: `#f3f4f6` - Light borders and tag backgrounds
  - Used in: `src/components/JobListing.tsx` (line 35)
- **Gray 200**: `#e5e7eb` - Borders and dividers
  - Used in: `src/components/Navbar.tsx` (line 5), `src/pages/Home.tsx` (line 140), `src/components/FilterSection.tsx` (lines 40, 59, 142), `src/components/SearchBar.tsx` (line 48)
- **Gray 300**: `#d1d5db` - Input borders
  - Used in: `src/components/SearchBar.tsx` (line 34), `src/components/FilterSection.tsx` (lines 64, 71)
- **Gray 400**: `#9ca3af` - Muted text
  - Used in: `src/pages/Home.tsx` (line 146), `src/components/FilterSection.tsx` (lines 88, 109, 179)
- **Gray 500**: `#6b7280` - Secondary text
  - Used in: `src/components/JobListing.tsx` (line 31), `src/components/FilterSection.tsx` (lines 53, 156)
- **Gray 600**: `#4b5563` - Primary text (standard Tailwind default)
- **Gray 700**: `#374151` - Dark text (standard Tailwind default)

#### Accent Colors

##### Green (Success/Compensation)
- **Green 600**: `#16a34a` - Compensation/salary text
  - Used in: `src/components/JobListing.tsx` (line 45)
- **Green 100**: `#d1fae5` - Success state backgrounds (standard Tailwind)
- **Green 800**: `#166534` - Text on green backgrounds (standard Tailwind)

##### Red (Errors/Alerts)
- **Red 500**: `#ef4444` - Error states (standard Tailwind)
- **Red 100**: `#fee2e2` - Error backgrounds (standard Tailwind)

## Backgrounds & Effects

### Standard Backgrounds (No Custom Utilities)
**Note**: No custom background utilities like `.mesh-surface`, `.glass`, or `.card` were found in the codebase. The application uses standard Tailwind background classes.

### Background Usage Patterns
- **White Background**: Primary application background (`src/App.tsx` - line 13: `bg-white`)
- **Gray Hover Effects**: Subtle interaction feedback
  - Used in: `src/components/JobListing.tsx` (line 27: `hover:bg-gray-50`)
  - Used in: `src/components/FilterSection.tsx` (lines 42, 144: `hover:bg-gray-50`)
- **No Gradient Backgrounds**: No AI mesh gradients or custom background effects found
- **No Glassmorphism**: No backdrop-blur or glass-like effects implemented

## Layout & Spacing

### Container System
- **Main Container**: `container mx-auto px-4` (`src/App.tsx` - line 16)
- **Responsive Padding**: `py-4`, `py-6` for vertical spacing
  - Used in: `src/components/Navbar.tsx` (line 7: `py-4`), `src/App.tsx` (line 16: `py-6`)
- **Grid Layouts**: 
  - Mobile: Single column (default)
  - Desktop: 4-column grid (1 for filters, 3 for content) (`src/pages/Home.tsx` - line 80: `grid-cols-1 md:grid-cols-4`)

### Spacing Scale
- **xs**: `space-x-1`, `space-y-1` (0.25rem / 4px)
- **sm**: `space-x-2`, `space-y-2` (0.5rem / 8px)
- **base**: `space-x-3`, `space-y-3` (0.75rem / 12px)
- **md**: `space-x-4`, `space-y-4` (1rem / 16px)
- **lg**: `space-x-6`, `space-y-6` (1.5rem / 24px)
- **xl**: `space-x-8`, `space-y-8` (2rem / 32px)

## Component Styling

### Navigation Bar
- **Background**: White with bottom border (`border-b border-gray-200`)
- **Logo**: 32px height (`h-8`)
- **Links**: Blue 600 with hover underline
- **Layout**: Responsive flex layout (column on mobile, row on desktop)

### Search Bar
- **Input Field**: 
  - Full width with gray border
  - Blue focus ring (`focus:ring-2 focus:ring-blue-500`)
  - Placeholder text for guidance
- **Search Button**: 
  - Blue background (`bg-blue-600`)
  - White text
  - Hover state (`hover:bg-blue-700`)
- **Clear Button**: 
  - Gray background (`bg-gray-200`)
  - Appears when search has content

### Job Listings
- **Card Style**: Border-bottom separators with hover effects
- **Hover State**: Light gray background (`hover:bg-gray-50`)
- **Job Title**: 
  - Large, headline font
  - Blue link color
  - Hover underline
- **Metadata**: 
  - Small gray text
  - Company • Location • Date format
- **Industry Tags**: 
  - Gray background (`bg-gray-100`)
  - Rounded corners
  - Small padding
- **Compensation**: 
  - Green text (`text-green-600`)
  - Medium font weight

### Filter Section
- **Container**: Rounded borders (`border border-gray-200 rounded-lg`)
- **Toggle Button**: 
  - Full width with hover effects
  - Expand/collapse functionality
  - Active filter count badges
- **Filter Tags**: 
  - Blue background (`bg-blue-100`)
  - Blue text (`text-blue-800`)
  - Rounded pill shape
  - Remove buttons with hover effects

### Interactive Elements

#### Buttons
- **Primary**: Blue background, white text, hover states
- **Secondary**: Gray background, dark text
- **Text Links**: Blue color with hover underline

#### Form Elements
- **Input Fields**: 
  - Gray borders
  - Blue focus rings
  - Consistent padding
- **Checkboxes**: Standard browser styling
- **Labels**: Small text, proper spacing

#### Hover Effects
- **Transitions**: `transition-colors` for smooth state changes
- **Background Changes**: Subtle gray backgrounds on hover
- **Link Underlines**: Appear on hover for better UX

## Responsive Design

### Breakpoints
- **Mobile**: Default (up to 768px)
- **Tablet**: `md:` prefix (768px and up)
- **Desktop**: `lg:` prefix (1024px and up)

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Collapsible navigation and filters on mobile
- Responsive grid layouts

### Responsive Typography
- Smaller text sizes on mobile
- Larger headings on desktop
- Adjusted spacing for different screen sizes

## Accessibility Features

### Focus Management
- Visible focus rings on interactive elements
- Keyboard navigation support
- Proper tab order

### Color Contrast
- High contrast text colors
- Accessible color combinations
- Clear visual hierarchy

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy
- Descriptive alt text for images

## Performance Optimizations

### Font Loading
- System font fallbacks
- Optimized font rendering
- Antialiased text smoothing

### CSS Architecture
- Tailwind CSS for utility-first styling
- Minimal custom CSS
- Efficient class-based styling

## Accessibility & Motion

### Focus Management
- **Focus Rings**: Blue focus rings on interactive elements
  - Used in: `src/components/SearchBar.tsx` (line 34: `focus:ring-2 focus:ring-blue-500`), `src/components/FilterSection.tsx` (line 64: `focus:ring-2 focus:ring-blue-500`)
- **Keyboard Navigation**: Standard browser focus behavior maintained
- **Tab Order**: Logical tab progression through interface elements

### Color Contrast
- **High Contrast**: Charcoal text on white backgrounds for optimal readability
- **Accessible Combinations**: Blue links on white backgrounds meet WCAG guidelines
- **Clear Hierarchy**: Distinct color usage for different text levels (gray-400 for muted, gray-600 for primary)

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Alt Text**: Logo includes descriptive alt text (`src/components/Navbar.tsx` - line 13: `alt="Applicants.IO Logo"`)
- **Form Labels**: Proper label associations for form inputs

### Motion & Transitions
- **Smooth Transitions**: `transition-colors` for hover effects
  - Used in: `src/components/JobListing.tsx` (line 27), `src/components/FilterSection.tsx` (lines 42, 144)
- **No Custom Animations**: No complex animations or motion effects found
- **Reduced Motion**: No explicit `prefers-reduced-motion` handling detected

## Performance Optimizations

### Font Loading
- **System Font Fallbacks**: Comprehensive fallback stack for reliable rendering
- **Optimized Rendering**: Font feature settings and antialiasing for crisp text
- **No Web Fonts**: Uses system fonts to avoid loading delays

### CSS Architecture
- **Tailwind CSS**: Utility-first approach for efficient styling
- **Minimal Custom CSS**: Only 15 lines of custom CSS in `src/index.css`
- **PostCSS Processing**: Autoprefixer for cross-browser compatibility

## Token Snapshot (Quick Reference)

### Color Hex Values
| Color | Hex | Usage |
|-------|-----|-------|
| Blue 600 | #2563eb | Primary buttons, links |
| Blue 700 | #1d4ed8 | Button hover states |
| Blue 500 | #3b82f6 | Focus rings |
| Blue 100 | #dbeafe | Tag backgrounds |
| Blue 800 | #1e40af | Text on blue backgrounds |
| Green 600 | #16a34a | Compensation text |
| Gray 200 | #e5e7eb | Borders, dividers |
| Gray 300 | #d1d5db | Input borders |
| Gray 400 | #9ca3af | Muted text |
| Gray 500 | #6b7280 | Secondary text |

### Key Utilities
- `font-headline`: Alan Sans font family
- `font-sans`: Inter font family  
- `transition-colors`: Smooth hover transitions
- `focus:ring-2 focus:ring-blue-500`: Blue focus rings
- `hover:bg-gray-50`: Subtle hover backgrounds

### Tailwind Version Confirmation
- **Tailwind CSS**: v3.4.17 (confirmed in `package.json`)
- **CSS Injection**: Through Vite build process, not Nuxt
- **No Custom Plugins**: Standard Tailwind installation

## File & Source Map

### Configuration Files
- **`tailwind.config.js`**: Font family extensions (sans, headline)
- **`postcss.config.js`**: Tailwind CSS and Autoprefixer plugins
- **`vite.config.ts`**: React plugin configuration
- **`package.json`**: Dependency versions and scripts

### Styling Files
- **`src/index.css`**: Global font settings and Tailwind imports
- **`src/App.tsx`**: Main layout container and background
- **`src/components/Navbar.tsx`**: Navigation styling and logo
- **`src/components/SearchBar.tsx`**: Search input and button styling
- **`src/components/JobListing.tsx`**: Job card styling and hover effects
- **`src/components/FilterSection.tsx`**: Filter component styling and interactions
- **`src/pages/Home.tsx`**: Home page layout and grid system

### Component Usage Patterns
- **Typography**: `font-headline` for titles, `font-sans` for body text
- **Colors**: Blue theme for interactions, gray scale for hierarchy
- **Layout**: Responsive grid with mobile-first approach
- **Interactions**: Consistent hover states and focus management

This styling guide ensures consistency across the Applicants.IO platform while maintaining a clean, professional appearance that aligns with modern web design standards and user preferences for light themes.
