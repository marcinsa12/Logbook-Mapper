import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vuetify from 'vite-plugin-vuetify';


// https://vitejs.dev/config/
export default ({mode} : any) => {
  const env = loadEnv(
    mode, 
    process.cwd(),
    '' 
  )
    const processEnvValues = {
      'process.env': Object.entries(env).reduce(
        (prev, [key, val]) => {
          return {
            ...prev,
            [key]: val,
          }
        },
        {},
      )
    }
  return defineConfig({
    plugins: [
      vue(),
      vuetify({autoImport: true}),
      vueJsx()
    ],
    define: processEnvValues,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true
    }
  })
}