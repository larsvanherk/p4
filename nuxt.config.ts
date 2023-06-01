import { readFileSync } from 'fs';
import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/google-fonts', {
      families: {
        Rubik: {
          wght: [400],
          ital: [800]
        },
        'Rubik Mono One': {
          wght: [400]
        }
      }
    }]
  ],
  devServer: {
    host: '0.0.0.0',
    https: {
      key: readFileSync(fileURLToPath(new URL('./ssl/key.pem', import.meta.url))).toString(),
      cert: readFileSync(fileURLToPath(new URL('./ssl/cert.pem', import.meta.url))).toString()
    }
  }
});
