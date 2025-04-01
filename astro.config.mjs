// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import astroI18next from "astro-i18next";
import sitemap from '@astrojs/sitemap'
import aiRobotsTxt from 'astro-ai-robots-txt';

// https://astro.build/config
export default defineConfig({
  site: 'https://amofexpo.igeco.mx',
  integrations: [react(), astroI18next(), sitemap(), aiRobotsTxt()],
  vite: {
    plugins: [tailwindcss()]
  }
});