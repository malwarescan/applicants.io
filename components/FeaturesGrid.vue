<template>
  <section id="features" class="py-20 bg-charcoal">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Everything you need to hire better
        </h2>
        <p class="text-xl text-offwhite/80 max-w-3xl mx-auto">
          From AI-powered matching to automated workflows, we've built the complete hiring solution
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="card p-6 hover:bg-black/30 transition-all duration-300 group"
        >
          <!-- Icon -->
          <div class="w-16 h-16 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl">{{ feature.icon }}</span>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-semibold text-white mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-offwhite/70 mb-4 leading-relaxed">
            {{ feature.description }}
          </p>

          <!-- Stat -->
          <div class="pt-4 border-t border-white/10">
            <p class="text-primary font-semibold text-lg">
              {{ feature.stat }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { features } = useLandingContent()
</script>
