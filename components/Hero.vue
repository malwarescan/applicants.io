<template>
  <section class="relative overflow-hidden bg-ai-mesh bg-cover bg-center py-20 lg:py-32">
    <!-- Dark overlay for text readability -->
    <div class="absolute inset-0 bg-charcoal/80"></div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="text-center lg:text-left">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {{ hero.title }}
          </h1>
          <p class="text-xl md:text-2xl text-offwhite/90 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            {{ hero.subtitle }}
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <NuxtLink
              :to="hero.primaryCTA.href"
              class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              aria-label="Book a Demo"
            >
              {{ hero.primaryCTA.text }}
            </NuxtLink>
            <NuxtLink
              :to="hero.secondaryCTA.href"
              class="border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white/5"
              aria-label="See Pricing"
            >
              {{ hero.secondaryCTA.text }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right Visual -->
        <div class="flex justify-center lg:justify-end">
          <div class="relative">
            <!-- Gradient A Mark -->
            <div class="w-64 h-64 lg:w-80 lg:h-80 relative">
              <div class="absolute inset-0 bg-gradient-to-br from-primary via-purple to-magenta rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div class="absolute inset-4 bg-gradient-to-br from-primary via-purple to-magenta rounded-full flex items-center justify-center">
                <span class="text-6xl lg:text-8xl font-bold text-white">A</span>
              </div>
            </div>
            
            <!-- Floating elements -->
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-purple/20 rounded-full blur-xl animate-bounce"></div>
            <div class="absolute -bottom-4 -left-4 w-20 h-20 bg-magenta/20 rounded-full blur-xl animate-bounce" style="animation-delay: 1s;"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { hero } = useLandingContent()
</script>
