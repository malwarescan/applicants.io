<template>
  <nav class="sticky top-0 z-50 glass backdrop-blur-md">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-primary">
            Applicants.io
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="#features" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
          >
            Features
          </NuxtLink>
          <NuxtLink 
            to="#pricing" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
          >
            Pricing
          </NuxtLink>
          <NuxtLink 
            to="#faq" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
          >
            FAQ
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
          >
            Contact
          </NuxtLink>
        </div>

        <!-- CTA Button -->
        <div class="flex items-center">
          <NuxtLink
            to="/contact"
            class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            aria-label="Book a Demo"
          >
            Book a Demo
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="text-offwhite hover:text-primary transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t border-white/10">
        <div class="flex flex-col space-y-4">
          <NuxtLink 
            to="#features" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Features
          </NuxtLink>
          <NuxtLink 
            to="#pricing" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Pricing
          </NuxtLink>
          <NuxtLink 
            to="#faq" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            FAQ
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="text-offwhite hover:text-primary transition-colors duration-200"
            @click="isMobileMenuOpen = false"
          >
            Contact
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const isMobileMenuOpen = ref(false)
</script>
