// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  build: {
    transpile: ['vee-validate'],
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2025-01-02',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'shadcn-nuxt',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxt/content',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    classPrefix: '',
    storageKey: 'nuxt-color-mode',
  },
  googleFonts: {
    download: true,
    display: 'swap',
    prefetch: true,
    preconnect: true,
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'jpeg'],
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
})
