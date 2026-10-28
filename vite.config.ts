import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { profile } from './src/data/profile.ts'
import { safeHref } from './src/lib/links.ts'

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// https://vite.dev/config/
export default defineConfig({
  preview: { port: 5174 },
  plugins: [react(), tailwindcss(), {
    name: 'portfolio-metadata',
    transformIndexHtml(html) {
      const title = `${profile.name} — ${profile.role.fr} · PFE ${profile.internshipYear}`
      const description = profile.heroDescription.fr
      const siteUrl = safeHref(profile.siteUrl)
      return {
        html: html.replaceAll('__PORTFOLIO_TITLE__', escapeHtml(title))
          .replaceAll('__PORTFOLIO_DESCRIPTION__', escapeHtml(description))
          .replaceAll('__PORTFOLIO_NAME__', escapeHtml(profile.name)),
        tags: [
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
            description: profile.heroDescription.fr, ...(siteUrl ? { url: siteUrl } : {}),
            sameAs: [safeHref(profile.github), safeHref(profile.linkedin)].filter(Boolean),
          }).replaceAll('<', '\\u003c') },
          ...(siteUrl && /^https?:/.test(siteUrl) ? [
            { tag: 'link', attrs: { rel: 'canonical', href: siteUrl } },
            { tag: 'meta', attrs: { property: 'og:url', content: siteUrl } },
          ] : []),
        ],
      }
    },
  }],
})
