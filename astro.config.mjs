import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.nishagoswami.com', //  Hostinger domain
  base: process.env.BASE_PATH,
  outDir: 'dist',
  integrations: [react(), tailwind()],
});
