// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    "@vee-validate/nuxt",
    "nuxt-icons",
    '@nuxt/image'
  ],
  runtimeConfig: {
    // Do not put secret information here
    public: {
      // db Url
      couchDBUrl: process.env.DATA_BASE_URL,
      couchDBUsername: process.env.DATA_BASE_USERNAME,
      couchDBPassword: process.env.DATA_BASE_PSWD,
    },
  },
  vite: {
    define: {
      global: 'window' ,
    }
  },
  ssr: false
})