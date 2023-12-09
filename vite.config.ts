import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
/*  export default defineConfig({
   plugins: [react()],
   server: {
     proxy: {
       '/': {
         target: 'http://localhost:5100',
         changeOrigin: true,
       },
     },
   },
 });  */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5100/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}); 