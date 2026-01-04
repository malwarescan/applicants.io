# TailwindCSS Fix for Nuxt 4

## Problem
The TailwindCSS styles weren't loading - the site was showing unstyled HTML. This was caused by:
1. **Tailwind v4 installed** but using v3 syntax
2. **Missing proper CSS imports** in nuxt.config.ts
3. **Incorrect PostCSS configuration** for the version mismatch

## Solution Implemented

### 1. Downgraded to Tailwind v3
```bash
npm uninstall @tailwindcss/postcss tailwindcss
npm install -D tailwindcss@^3.4.0
```

### 2. Updated `assets/css/main.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.mesh-surface { @apply bg-ai-mesh blur-2xl opacity-70; }
.glass { @apply backdrop-blur-md bg-white/5 border border-white/10; }
.card { @apply rounded-xl border border-white/10 bg-black/20; }
```

### 3. Updated `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  nitro: { preset: 'vercel' },
  css: ['~/assets/css/main.css']
})
```

### 4. Updated `postcss.config.cjs`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

### 5. Updated `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    'app.vue',
    'layouts/**/*.{vue,ts}',
    'pages/**/*.{vue,ts}',
    'components/**/*.{vue,ts}',
    'composables/**/*.{ts,js}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3A86FF',
        purple: '#8C1EFF',
        magenta: '#FF4D6D',
        charcoal: '#0F172A',
        offwhite: '#F9FAFB'
      },
      backgroundImage: {
        'ai-mesh': `radial-gradient(900px 500px at 8% 10%, #3A86FF 0%, transparent 60%),
                    radial-gradient(800px 400px at 60% 35%, #8C1EFF 0%, transparent 60%),
                    radial-gradient(900px 600px at 95% 90%, #FF4D6D 0%, transparent 60%)`
      }
    }
  }
}
```

### 6. Cleared Cache and Restarted
```bash
rm -rf .nuxt node_modules/.cache
npm run dev
```

## Result
- TailwindCSS utilities now load properly
- Custom `bg-ai-mesh` background works
- `@apply` directives function correctly
- All custom utility classes (`.mesh-surface`, `.glass`, `.card`) work
- Brand colors (`bg-primary`, `text-charcoal`, etc.) are available

## Key Learning
**Tailwind v4 vs v3**: 
- v4 uses `@import "tailwindcss/preflight"` and `@import "tailwindcss/utilities"`
- v3 uses `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- v3 supports `@apply` directives for custom CSS classes
- v4 has a different approach to custom utilities

For Nuxt 4 projects, Tailwind v3 provides better compatibility and the `@apply` directive support needed for custom utility classes.
