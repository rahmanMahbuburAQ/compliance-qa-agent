// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: '.',
  pages: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    authSecret: process.env.AUTH_SECRET,
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureClientSecret: process.env.AZURE_CLIENT_SECRET,
    azureTenantId: process.env.AZURE_TENANT_ID,
    databaseUrl: process.env.DATABASE_URL,
    
    public: {
      appName: 'Compliance Q&A Agent',
      companyName: 'Enterprise Corp'
    }
  },

  ssr: true,

  nitro: {
    experimental: {
      wasm: true
    }
  }
})
