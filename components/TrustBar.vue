<template>
  <section class="py-16 bg-charcoal/50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <p class="text-offwhite/60 text-lg">Trusted by leading companies worldwide</p>
      </div>
      
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
        <div 
          v-for="logo in trustLogos" 
          :key="logo.name"
          class="group"
        >
          <!-- Placeholder logo box -->
          <div class="w-24 h-16 md:w-32 md:h-20 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:opacity-100 opacity-70">
            <span class="text-offwhite/80 font-medium text-sm md:text-base">{{ logo.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { trustLogos } = useLandingContent()
</script>
