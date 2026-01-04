<template>
  <section id="pricing" class="py-20 bg-charcoal/80">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Simple, transparent pricing
        </h2>
        <p class="text-xl text-offwhite/80 max-w-3xl mx-auto">
          No hidden fees, no surprises. Choose the plan that fits your hiring needs
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div 
          v-for="plan in pricing" 
          :key="plan.name"
          class="card p-8 relative"
          :class="{ 'ring-2 ring-primary': plan.popular }"
        >
          <!-- Popular badge -->
          <div v-if="plan.popular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>

          <!-- Plan header -->
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
            <div class="mb-4">
              <span class="text-4xl font-bold text-white">{{ plan.price }}</span>
              <span class="text-offwhite/60 ml-2">{{ plan.period }}</span>
            </div>
            <p class="text-offwhite/70">{{ plan.description }}</p>
          </div>

          <!-- Features -->
          <ul class="space-y-4 mb-8">
            <li 
              v-for="feature in plan.features" 
              :key="feature"
              class="flex items-start"
            >
              <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-offwhite/80">{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA Buttons -->
          <div class="space-y-3">
            <NuxtLink
              :to="plan.primaryCTA.href"
              class="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 block text-center"
              :aria-label="plan.primaryCTA.text"
            >
              {{ plan.primaryCTA.text }}
            </NuxtLink>
            
            <NuxtLink
              v-if="plan.secondaryCTA"
              :to="plan.secondaryCTA.href"
              class="w-full border border-white/20 hover:border-white/40 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 block text-center hover:bg-white/5"
              :aria-label="plan.secondaryCTA.text"
            >
              {{ plan.secondaryCTA.text }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Additional info -->
      <div class="text-center mt-16">
        <p class="text-offwhite/60 mb-4">
          All plans include a 7-day free trial • No credit card required to start
        </p>
        <p class="text-offwhite/40 text-sm">
          Need a custom plan? <NuxtLink to="/contact" class="text-primary hover:underline">Contact our sales team</NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const { pricing } = useLandingContent()
</script>
