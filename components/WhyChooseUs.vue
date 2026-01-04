<template>
  <section class="py-20 bg-charcoal">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Why choose Applicants.io?
        </h2>
        <p class="text-xl text-offwhite/80 max-w-3xl mx-auto">
          We're not just another ATS — we're your complete hiring partner
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="reason in whyChooseUs" 
          :key="reason.title"
          class="text-center group"
        >
          <!-- Icon -->
          <div class="w-20 h-20 bg-gradient-to-br from-purple to-magenta rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <span class="text-3xl">{{ reason.icon }}</span>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-semibold text-white mb-3">
            {{ reason.title }}
          </h3>
          <p class="text-offwhite/70 leading-relaxed">
            {{ reason.description }}
          </p>
        </div>
      </div>

      <!-- Trust indicators -->
      <div class="mt-16 text-center">
        <div class="inline-flex items-center space-x-8 text-offwhite/60">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>SOC2 Type II Compliant</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>99.9% Uptime SLA</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { whyChooseUs } = useLandingContent()
</script>
