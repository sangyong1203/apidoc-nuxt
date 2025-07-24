// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.scss',
    'element-plus/dist/index.css',
    'element-plus/theme-chalk/dark/css-vars.css', // element plus에  다크모드 
  ],
  build: {
    transpile: ['element-plus'],
  },
  alias: {
    '@': resolve(__dirname, 'app')
  },
  modules: [
    // ...
    '@pinia/nuxt',
    '@element-plus/nuxt'
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  vite: {
    define: {
      global: 'globalThis'
    }
  },
  plugins: ['~/plugins/piniaPersist.client.ts']
})