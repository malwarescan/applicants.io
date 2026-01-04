export default defineNuxtPlugin(() => {
  const script = (type: string, data: Record<string, any>) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': type, ...data })
  })
  const content = useLandingContent()
  useHead({
    script: [
      script('Organization', content.org),
      script('WebSite', { name: content.org.name, url: content.org.url }),
    ]
  })
})
