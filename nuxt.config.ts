export default defineNuxtConfig({
  compatibilityDate: '2026-02-03',
  ssr: true,
  components: true,
  nitro: { compressPublicAssets: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
