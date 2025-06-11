// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/mdc',
  ],
  tailwindcss: {
    config: {
      darkMode: 'class',
      plugins: []
    }
  },
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme: 'github-dark',
          langs: [
            'c',
            'cpp',
            'java',
            'python',
            'javascript',
            'typescript',
            'vue',
            'html',
            'css',
            'bash',
            'json',
            'yaml',
            'markdown',
          ]
        }
      }
    }
  }
})