import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Добавляем alias @
    },
  },
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Если нужно убрать /api из запроса, можно раскомментировать следующую строку:
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
