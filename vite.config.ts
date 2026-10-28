import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { profile } from './src/data/profile.ts'
import { getSeo, personJsonLd } from './src/data/seo.ts'

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/',
  preview: { port: 5174 },
  plugins: [react(), tailwindcss(), {
    name: 'portfolio-metadata',
    transformIndexHtml(html) {
      const metadata = getSeo('fr')
      const replacements: Record<string, string> = {
        TITLE: metadata.title,
        DESCRIPTION: metadata.description,
        NAME: profile.name,
        ROBOTS: metadata.robots,
        CANONICAL: metadata.canonical,
        SITE_NAME: metadata.siteName,
        OG_TITLE: metadata.ogTitle,
        IMAGE: metadata.image,
        IMAGE_ALT: metadata.imageAlt,
      }
      return {
        html: Object.entries(replacements).reduce((result, [key, value]) => result.replaceAll(`__PORTFOLIO_${key}__`, escapeHtml(value)), html),
        tags: [
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(personJsonLd).replaceAll('<', '\\u003c'), injectTo: 'head' },
        ],
      }
    },
  }],
})
