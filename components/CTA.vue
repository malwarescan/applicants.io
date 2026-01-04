<template>
  <section class="relative overflow-hidden bg-ai-mesh bg-cover bg-center py-20">
    <!-- Dark overlay for text readability -->
    <div class="absolute inset-0 bg-charcoal/80"></div>
    
    <div class="container mx-auto px-4 relative z-10 text-center">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
        {{ cta.title }}
      </h2>
      <p class="text-xl text-offwhite/90 mb-8 max-w-3xl mx-auto">
        {{ cta.subtitle }}
      </p>
      
      <NuxtLink
        :to="cta.primaryCTA.href"
        class="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-lg font-semibold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
        aria-label="Book a Demo"
      >
        {{ cta.primaryCTA.text }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const { cta } = useLandingContent()
</script>
