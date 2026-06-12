import { defineConfig } from 'vite';

// base './' so the static build serves from any subpath (e.g. /prism-defense/).
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
  },
});
