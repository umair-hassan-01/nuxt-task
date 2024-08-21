// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  app:{
    head:{
      link:[
        {
          rel:"stylesheet",
          href:"https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css"
        }
      ],
      script:[
        {
          src:"https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"
        }
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@ant-design-vue/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  runtimeConfig:{
    userName:"umair hassan 02",
    public:{
      publicName:"umair hassan",
      publicId:"3902"
    }
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})