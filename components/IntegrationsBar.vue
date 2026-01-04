<template>
  <section class="py-16 bg-charcoal/50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h3 class="text-2xl font-semibold text-white mb-4">
          Plays nicely with your stack
        </h3>
        <p class="text-offwhite/60">
          Seamlessly integrate with your existing tools and workflows
        </p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
        <div 
          v-for="integration in integrations" 
          :key="integration.name"
          class="group text-center"
        >
          <!-- Integration logo placeholder -->
          <div class="w-16 h-16 md:w-20 md:h-20 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:scale-110">
            <span class="text-offwhite/80 font-medium text-xs md:text-sm">{{ integration.name }}</span>
          </div>
          <p class="text-offwhite/60 text-xs mt-2">{{ integration.name }}</p>
        </div>
      </div>

      <!-- Additional integrations note -->
      <div class="text-center mt-8">
        <p class="text-offwhite/50 text-sm">
          +50 more integrations available • Custom integrations on request
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const { integrations } = useLandingContent()
</script>
