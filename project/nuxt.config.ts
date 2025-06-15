export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  nitro: {
    preset: 'node-server',
    serveStatic: true,
    externals: {
      inline: ['element-closest'] // Пример полифилла
    }
  },
  runtimeConfig: {
      public: {
        apiUrl: process.env.API_URL || 'https://cinemaguide.skillbox.cc'
      }
    },
    features: {
      inlineStyles: true
    },
  css: [
    '~/assets/styles/main.css',
    '~/assets/styles/header.css',
    '~/assets/styles/search.css',
    '~/assets/styles/auth.css',
    '~/assets/styles/account.css',
    '~/assets/styles/movie.css',
    '~/assets/styles/moviegrid.css',
    '~/assets/styles/genres.css',
    '~/assets/styles/trailer.css',
    '~/assets/styles/skeletons.css'

    // './assets/styles/main.css',
    // './assets/styles/header.css',
    // './assets/styles/search.css',
    // './assets/styles/auth.css',
    // './assets/styles/account.css',
    // './assets/styles/movie.css',
    // './assets/styles/moviegrid.css',
    // './assets/styles/genres.css',
    // './assets/styles/trailer.css',
    // './assets/styles/skeletons.css'
  ],

  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/test-utils'],
  

  routeRules: {
      '/**': { cors: true }
    },

  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    // Плавный переход между SSR и SPA
    layoutTransition: { name: 'fade', mode: 'out-in' },
    pageTransition: { name: 'fade', mode: 'out-in' }
  },

  experimental: {
    polyfillVueUseHead: true
  //   viewTransition: true,
  //   componentIslands: true
  },

  compatibilityDate: '2025-04-05'
})