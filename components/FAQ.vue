<template>
  <section id="faq" class="py-20 bg-charcoal">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Frequently Asked Questions
        </h2>
        <p class="text-xl text-offwhite/80 max-w-3xl mx-auto">
          Everything you need to know about Applicants.io
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-4">
        <div 
          v-for="(item, index) in faq" 
          :key="index"
          class="card"
        >
          <button
            @click="toggleFAQ(index)"
            class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-black/20 transition-colors duration-200"
            :aria-expanded="openFAQ === index"
            :aria-controls="`faq-answer-${index}`"
          >
            <h3 class="text-lg font-semibold text-white">
              {{ item.question }}
            </h3>
            <svg 
              class="w-5 h-5 text-primary transition-transform duration-200"
              :class="{ 'rotate-180': openFAQ === index }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div 
            :id="`faq-answer-${index}`"
            class="px-6 pb-4"
            :class="{ 'hidden': openFAQ !== index }"
          >
            <p class="text-offwhite/70 leading-relaxed">
              {{ item.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- Still have questions -->
      <div class="text-center mt-16">
        <p class="text-offwhite/60 mb-4">
          Still have questions? We're here to help.
        </p>
        <NuxtLink
          to="/contact"
          class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
          aria-label="Contact Support"
        >
          Contact Support
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const { faq } = useLandingContent()

const openFAQ = ref(null)

const toggleFAQ = (index) => {
  openFAQ.value = openFAQ.value === index ? null : index
}
</script>
