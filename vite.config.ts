import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
const pkg = require('./package.json');
const dependencies = pkg.dependencies;
const keys = Object.keys(dependencies);
const port = 8000;

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
      alias: {
        "@pjblog/control-hooks": resolve(__dirname, 'src/components'),
      }
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
          vonder: keys.filter(key => !key.startsWith('@types/')),
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
        "/-": {
          changeOrigin: true,
          target: "http://127.0.0.1:" + port,
        },
        "/~": {
          changeOrigin: true,
          target: "http://127.0.0.1:" + port,
        },
        "/socket.io": {
          changeOrigin: true,
          target: "http://127.0.0.1:" + port,
        }
      }
    }
  }
})
