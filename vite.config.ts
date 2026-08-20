import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { SITEMAP_ROUTES } from './src/lib/siteData';

const now = new Date().toISOString().split('T')[0];
const envRoot = process.cwd();

const getSiteUrl = (mode: string) => {
  const env = loadEnv(mode, envRoot, '');
  return (env.VITE_PUBLIC_SITE_URL || 'https://trinity-express.com').replace(/\/$/, '');
};

const getRuntimeConfig = (mode: string) => {
  const env = loadEnv(mode, envRoot, '');
  return {
    VITE_GA_MEASUREMENT_ID: env.VITE_GA_MEASUREMENT_ID ?? '',
    PAYMENT_KENYA_PROVIDER: env.PAYMENT_KENYA_PROVIDER ?? '',
    PAYMENT_INTERNATIONAL_PROVIDER: env.PAYMENT_INTERNATIONAL_PROVIDER ?? '',
    PAYMENT_FALLBACK_PROVIDER: env.PAYMENT_FALLBACK_PROVIDER ?? '',
    WHATSAPP_NUMBER: env.WHATSAPP_NUMBER ?? '',
    WHATSAPP_DEFAULT_MESSAGE: env.WHATSAPP_DEFAULT_MESSAGE ?? '',
  };
};

const buildSitemap = (baseUrl: string) => {
  const urlset = SITEMAP_ROUTES.map((route) => {
    const loc = `${baseUrl}${route}`;
    const priority = route === '/' ? '1.0' : route === '/routes' ? '0.9' : route === '/news' || route === '/faq' ? '0.6' : '0.7';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;
};

const buildRobots = (baseUrl: string, isProd: boolean) =>
  isProd
    ? `User-agent: *\nAllow: /\nHost: ${baseUrl}\nSitemap: ${baseUrl}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\nNoindex: /\nHost: ${baseUrl}\n`;

const SeoAssetsPlugin = (mode: string): Plugin => ({
  name: 'seo-assets-generator',
  apply: 'build',
  closeBundle() {
    const siteUrl = getSiteUrl(mode);
    const distPath = path.resolve(process.cwd(), 'dist');
    fs.mkdirSync(distPath, { recursive: true });
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), buildSitemap(siteUrl), 'utf-8');
    fs.writeFileSync(path.join(distPath, 'robots.txt'), buildRobots(siteUrl, mode === 'production'), 'utf-8');
  },
});

const RuntimeConfigPlugin = (mode: string): Plugin => ({
  name: 'runtime-config-generator',
  apply: 'build',
  closeBundle() {
    const runtimeConfig = getRuntimeConfig(mode);
    const content = `window.__APP_CONFIG__ = window.__APP_CONFIG__ || ${JSON.stringify(runtimeConfig, null, 2)};\n`;

    const distPath = path.resolve(process.cwd(), 'dist');
    fs.mkdirSync(distPath, { recursive: true });
    fs.writeFileSync(path.join(distPath, 'runtime-config.js'), content, 'utf-8');
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), SeoAssetsPlugin(mode), RuntimeConfigPlugin(mode)],
  envPrefix: [
    'VITE_',
    'WHATSAPP_',
    'PAYMENT_KENYA_PROVIDER',
    'PAYMENT_INTERNATIONAL_PROVIDER',
    'PAYMENT_FALLBACK_PROVIDER',
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
