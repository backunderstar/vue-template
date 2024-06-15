import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  /* // 跨域，后端配置好了就不需要
  server: {
    proxy: {
      '/api': {
        // 需要代理的路径
        target: 'http://localhost:3000',
        // 是否跨域
        changeOrigin: true,
        // websocket代理
        ws: true,
        // 路径重写
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  } */

  build: {
    outDir: './dist',
    assetsInlineLimit: 8 * 1024,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      output: {
        comments: false,
        beautify: false
      }
    },

    rollupOptions: {
      output: {
        /* manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
          } */
        manualChunks(id) {
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/vue-router') ||
            id.includes('node_modules/pinia')
          ) {
            return 'vendor'
          }
        },
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|gif|webp)$/i.test(assetInfo.name!)) {
            return 'assets/img/[name].[hash].[extname]'
          } else if (/\.(woff2?|ttf|eot|otf)$/i.test(assetInfo.name!)) {
            return 'assets/font/[name].[hash].[extname]'
          } else if (/\.(css)$/i.test(assetInfo.name!)) {
            return 'assets/css/[name].[hash].css'
          } else {
            return 'assets/other/[name].[hash].[extname]'
          }
        }
      }
    }
  }
})
