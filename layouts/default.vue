<template>
  <div class="min-h-screen flex flex-col">
    <header class="px-6 py-4 border-b border-white/10 sticky top-0 bg-charcoal/70 backdrop-blur-md z-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="font-semibold tracking-tight text-xl">Applicants<span class="text-primary">.io</span></NuxtLink>
        <nav class="hidden md:flex items-center gap-6">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <NuxtLink to="/contact" class="px-3 py-1 rounded bg-primary text-black font-medium">Book a Demo</NuxtLink>
        </nav>
      </div>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="px-6 py-10 border-t border-white/10">
      <div class="max-w-7xl mx-auto text-sm opacity-70">© {{ new Date().getFullYear() }} Applicants.io</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Layout will automatically import components
</script>
