import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
          .replace(/^[ \t]+/gm, '')
          .replace(/[ \t]+$/gm, '')
          .replace(/\n\s*\n/g, '\n');
      }
    }
  ],
  base: '/',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
