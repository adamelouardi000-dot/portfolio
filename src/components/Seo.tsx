import { useEffect } from 'react'
import { profile } from '../data/portfolio'
import type { Locale } from '../data/types'
import { safeHref } from '../lib/links'

export function Seo({ locale }: { locale: Locale }) {
  useEffect(() => {
    const title = `${profile.name} — ${profile.role[locale]} · PFE ${profile.internshipYear}`
    const description = profile.bio[locale].replace(/\n/g, ' ').slice(0, 185)
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locale === 'fr' ? 'fr_FR' : 'en_US')
    const url = safeHref(profile.siteUrl)
    if (url && /^https?:/.test(url)) {
      const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = url
      document.head.appendChild(canonical)
    }
  }, [locale])
  return null
}
