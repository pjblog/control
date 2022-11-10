import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const pkg = require('./package.json');
const dependencies = pkg.dependencies;
const keys = Object.keys(dependencies);

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const { default: codixServer } = await import('@codixjs/vite');
  return {
    base: '/control/',
    resolve: {
      extensions: [
        '.tsx', 
        '.ts', 
        '.jsx', 
        '.js', 
        '.json', 
        '.less', 
        '.css'
      ],
    },
    css: {
      devSourcemap: false,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@table-font-size': '12px',
          }
        },
      }
    },
    build: {
      rollupOptions: {
        manualChunks: {
          vonder: keys,
        }
      }
    },
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
    plugins: [
      react({
        babel: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
          ],
        }
      }),
      codixServer(pkg.config)
    ],
    server: {
      proxy: {
        "/api": {
          changeOrigin: true,
          target: "http://127.0.0.1:8000",
        },
        "/socket.io": {
          changeOrigin: true,
          target: "http://127.0.0.1:8000",
        }
      }
    }
  }
})
