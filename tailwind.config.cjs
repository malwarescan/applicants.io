/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app.vue',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3A86FF',
        purple: '#8C1EFF',
        magenta: '#FF4D6D',
        charcoal: '#0F172A',
        offwhite: '#F9FAFB'
      },
      backgroundImage: {
        'ai-mesh': `radial-gradient(900px 500px at 8% 10%, #3A86FF 0%, transparent 60%),
                    radial-gradient(800px 400px at 60% 35%, #8C1EFF 0%, transparent 60%),
                    radial-gradient(900px 600px at 95% 90%, #FF4D6D 0%, transparent 60%)`
      }
    }
  },
  plugins: []
}
