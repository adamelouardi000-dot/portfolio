import { profile } from './profile.ts'
import { safeHref } from '../lib/links.ts'
import type { Locale } from './types.ts'

/** Shared by the HTML build and FR/EN metadata updates; never relies on browser rendering. */
export const seo = {
  canonical: profile.siteUrl,
  title: 'Adam ELOUARDI | Cybersecurity & DevSecOps',
  ogTitle: 'Adam ELOUARDI | Cybersecurity Portfolio',
  siteName: 'Adam ELOUARDI — Portfolio',
  image: new URL('og-cover.png', profile.siteUrl).href,
  imageAlt: 'Adam ELOUARDI — Cybersecurity Engineer Student · EMSI Rabat · PFE 2027',
  robots: 'index, follow, max-image-preview:large',
  descriptions: {
    fr: "Portfolio d'Adam ELOUARDI, étudiant ingénieur en cybersécurité à l'EMSI Rabat. Projets en DevSecOps, Ethical Hacking et sécurité informatique. Recherche PFE 2027.",
    en: "Adam ELOUARDI's portfolio, a cybersecurity engineering student at EMSI Rabat. Projects in DevSecOps, Ethical Hacking and IT security. Seeking a 2027 final-year internship.",
  },
}

export function getSeo(locale: Locale) {
  return { ...seo, description: seo.descriptions[locale], locale: locale === 'fr' ? 'fr_FR' : 'en_US' }
}

// Public professional facts only: no private contact details or unverified qualifications.
export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${seo.canonical}#person`,
  name: profile.name,
  givenName: profile.firstName,
  familyName: profile.lastName,
  url: seo.canonical,
  description: profile.heroDescription.fr,
  affiliation: { '@type': 'EducationalOrganization', name: `${profile.schoolShort} ${profile.campus}` },
  sameAs: [safeHref(profile.github), safeHref(profile.linkedin)].filter((url): url is string => Boolean(url && /^https?:/.test(url))),
}
