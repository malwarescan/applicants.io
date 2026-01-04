// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: { preset: 'vercel' },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Applicants.io – AI‑Powered Recruiting. Fully Managed.',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Applicants.io runs your entire hiring engine — job boards, career site, CRM, automations, SEO, and employer branding.' },
        { name: 'theme-color', content: '#0F172A' }
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }]
    }
  }
})