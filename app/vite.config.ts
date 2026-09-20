import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  define: { __HF_DESIGN_INSPECTOR__: 'false' },
  resolve: {
    tsconfigPaths: true,
    alias: [{ find: /^@higgsfield-ai\/icons(\/.*)?$/, replacement: fileURLToPath(new URL('./src/lib/quanta-icons.ts', import.meta.url)) }],
  },
  plugins: [
    svgr({ svgrOptions: { icon: true, svgProps: { fill: 'currentColor' } } }),
    tanstackStart({ server: { entry: 'server' } }),
    nitro({ preset: 'vercel' }),
    react(),
    tailwindcss(),
  ],
});
