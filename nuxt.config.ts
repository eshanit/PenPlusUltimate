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
    },
    server: {
      proxy: {
        '/couchdb': {
          target: process.env.DATA_BASE_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/couchdb/, ''),
          configure: (proxy: any) => {
            proxy.on('error', (err: any, req: any, res: any) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq: any, req: any, res: any) => {
              proxyReq.setHeader('Authorization', 'Basic ' + Buffer.from(process.env.DATA_BASE_USERNAME + ':' + process.env.DATA_BASE_PSWD).toString('base64'));
            });
          }
        }
      }
    }
  },
  ssr: false,
  // Ensure assets are properly built for mobile
  nitro: {
    static: true
  },
  // Allow access from other devices on the network for development
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  css: ['~/assets/css/print.css']
})