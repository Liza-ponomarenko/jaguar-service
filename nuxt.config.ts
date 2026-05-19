export default defineNuxtConfig({
  compatibilityDate: '2026-02-03',
  ssr: true,
  components: true,
  nitro: { 
    compressPublicAssets: true 
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils'
  ],
  typescript: {
    typeCheck: false,
    shim: false
  },
  vite: {
    plugins: []
  },
  runtimeConfig: {
    sessionSecret: process.env.NUXT_SESSION_SECRET
  }
})