<template>
  <footer class="bg-charcoal/90 border-t border-white/10">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div class="md:col-span-2">
          <h3 class="text-2xl font-bold text-primary mb-4">Applicants.io</h3>
          <p class="text-offwhite/70 mb-4 max-w-md">
            AI-powered recruiting platform that runs your entire hiring engine from job boards to career sites.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-offwhite/60 hover:text-primary transition-colors duration-200" aria-label="Twitter">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="text-offwhite/60 hover:text-primary transition-colors duration-200" aria-label="LinkedIn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">Product</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="#features" class="text-offwhite/60 hover:text-primary transition-colors duration-200">Features</NuxtLink></li>
            <li><NuxtLink to="#pricing" class="text-offwhite/60 hover:text-primary transition-colors duration-200">Pricing</NuxtLink></li>
            <li><NuxtLink to="/integrations" class="text-offwhite/60 hover:text-primary transition-colors duration-200">Integrations</NuxtLink></li>
            <li><NuxtLink to="/api" class="text-offwhite/60 hover:text-primary transition-colors duration-200">API</NuxtLink></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">Company</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/about" class="text-offwhite/60 hover:text-primary transition-colors duration-200">About</NuxtLink></li>
            <li><NuxtLink to="/careers" class="text-offwhite/60 hover:text-primary transition-colors duration-200">Careers</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-offwhite/60 hover:text-primary transition-colors duration-200">Contact</NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-offwhite/60 hover:text-primary transition-colors duration-200">Blog</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
        <p class="text-offwhite/40 text-sm">
          © {{ currentYear }} Applicants.io. All rights reserved.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <NuxtLink to="/privacy" class="text-offwhite/40 hover:text-primary text-sm transition-colors duration-200">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="/terms" class="text-offwhite/40 hover:text-primary text-sm transition-colors duration-200">
            Terms of Service
          </NuxtLink>
          <NuxtLink to="/security" class="text-offwhite/40 hover:text-primary text-sm transition-colors duration-200">
            Security
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
