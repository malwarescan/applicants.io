<template>
  <section class="py-20 bg-charcoal">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          What our customers say
        </h2>
        <p class="text-xl text-offwhite/80 max-w-3xl mx-auto">
          Join hundreds of companies already transforming their hiring with Applicants.io
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="review in reviews" 
          :key="review.author"
          class="card p-8 hover:bg-black/30 transition-all duration-300 group"
        >
          <!-- Quote -->
          <div class="mb-6">
            <svg class="w-8 h-8 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <p class="text-offwhite/90 text-lg leading-relaxed italic">
              "{{ review.quote }}"
            </p>
          </div>

          <!-- Author -->
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center mr-4">
              <span class="text-white font-semibold text-lg">
                {{ review.author.charAt(0) }}
              </span>
            </div>
            <div>
              <p class="text-white font-semibold">{{ review.author }}</p>
              <p class="text-offwhite/60 text-sm">{{ review.title }}</p>
              <p class="text-primary text-sm font-medium">{{ review.company }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust indicators -->
      <div class="text-center mt-16">
        <div class="inline-flex items-center space-x-8 text-offwhite/60">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>4.9/5 rating</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>500+ companies</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>98% retention</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { reviews } = useLandingContent()
</script>
