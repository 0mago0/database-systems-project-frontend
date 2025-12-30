import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/shopwebsite/',
  resolve: {
    alias: {
      '@Layouts': path.resolve(__dirname, 'src/components/Layouts/'),
      '@Inputs': path.resolve(__dirname, 'src/components/Input/'),
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  server: {
    port: 8080,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
