<template>
  <section class="py-20 bg-charcoal/80">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          How it works
        </h2>
        <p class="text-xl text-offwhite/80 max-w-3xl mx-auto">
          Get up and running in under 7 days with our simple 3-step process
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div 
          v-for="step in howItWorks" 
          :key="step.number"
          class="text-center group"
        >
          <!-- Step Number -->
          <div class="relative mb-8">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <span class="text-2xl font-bold text-white">{{ step.number }}</span>
            </div>
            
            <!-- Connector Line -->
            <div v-if="step.number < 3" class="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-purple opacity-30"></div>
          </div>

          <!-- Content -->
          <div class="card p-6 h-full">
            <div class="text-4xl mb-4">{{ step.icon }}</div>
            <h3 class="text-xl font-semibold text-white mb-3">
              {{ step.title }}
            </h3>
            <p class="text-offwhite/70 leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-16">
        <NuxtLink
          to="/contact"
          class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
          aria-label="Get Started"
        >
          Get Started Today
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const { howItWorks } = useLandingContent()
</script>
