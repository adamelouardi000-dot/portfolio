// @vitest-environment jsdom

import { readFileSync } from 'node:fs'
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Seo } from '../src/components/Seo'
import { getSeo, personJsonLd, seo } from '../src/data/seo'
import { profile } from '../src/data/profile'

const canonical = 'https://adamelouardi000-dot.github.io/portfolio/'
const description = "Portfolio d'Adam ELOUARDI, étudiant ingénieur en cybersécurité à l'EMSI Rabat. Projets en DevSecOps, Ethical Hacking et sécurité informatique. Recherche PFE 2027."
const originalHead = document.head.innerHTML
const template = readFileSync('index.html', 'utf8')

function content(selector: string) {
  return document.querySelector(selector)?.getAttribute('content')
}

beforeEach(() => {
  document.head.innerHTML = new DOMParser().parseFromString(template, 'text/html').head.innerHTML
})

afterEach(() => {
  cleanup()
  document.head.innerHTML = originalHead
})

describe('portfolio SEO and static sharing data', () => {
  it('ships a real static PNG cover at exactly 1200 by 630 pixels', () => {
    const png = readFileSync('public/og-cover.png')
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    expect(png.toString('ascii', 12, 16)).toBe('IHDR')
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
  })

  it('uses the requested canonical URL, title and French description', () => {
    expect(seo.canonical).toBe(canonical)
    expect(seo.image).toBe(`${canonical}og-cover.png`)
    expect(seo.imageAlt.trim().length).toBeGreaterThan(0)
    expect(getSeo('fr')).toMatchObject({
      title: 'Adam ELOUARDI | Cybersecurity & DevSecOps',
      ogTitle: 'Adam ELOUARDI | Cybersecurity Portfolio',
      description,
    })
    expect(new URL(seo.image).pathname).toBe('/portfolio/og-cover.png')
    expect(seo.robots).toMatch(/index/)
    expect(seo.robots).toMatch(/follow/)
    expect(seo.robots).not.toMatch(/noindex|nofollow/)
  })

  it('limits Person structured data to confirmed public professional facts', () => {
    const person = JSON.parse(JSON.stringify(personJsonLd))
    expect(person).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      url: canonical,
    })
    expect(person.sameAs).toEqual([profile.github, profile.linkedin])
    for (const field of ['email', 'telephone', 'address', 'birthDate', 'birthPlace', 'gender', 'nationality', 'hasCredential', 'award']) {
      expect(person).not.toHaveProperty(field)
    }
    expect(JSON.stringify(person)).not.toContain(profile.email)
    if (person.givenName) expect(person.givenName).toBe(profile.firstName)
    if (person.familyName) expect(person.familyName).toBe(profile.lastName)
    if (person.jobTitle) expect(person.jobTitle).toMatch(/student|étudiant/i)
  })

  it('preserves public sharing URLs and one canonical across FR/EN changes', () => {
    const view = render(<Seo locale="fr" />)
    expect(document.title).toBe('Adam ELOUARDI | Cybersecurity & DevSecOps')
    expect(content('meta[name="description"]')).toBe(description)
    expect(content('meta[property="og:title"]')).toBe('Adam ELOUARDI | Cybersecurity Portfolio')
    expect(content('meta[property="og:description"]')).toBe(description)
    expect(content('meta[property="og:locale"]')).toBe('fr_FR')
    expect(content('meta[name="twitter:description"]')).toBe(description)

    for (const locale of ['en', 'fr', 'en'] as const) {
      view.rerender(<Seo locale={locale} />)
      expect(document.title).toBe(getSeo(locale).title)
      expect(content('meta[name="description"]')).toBe(getSeo(locale).description)
      expect(content('meta[property="og:title"]')).toBe(getSeo(locale).ogTitle)
      expect(content('meta[name="twitter:title"]')).toBe(getSeo(locale).ogTitle)
      expect(content('meta[name="twitter:description"]')).toBe(getSeo(locale).description)
      expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(canonical)
      expect(content('meta[property="og:url"]')).toBe(canonical)
      expect(content('meta[property="og:image"]')).toBe(`${canonical}og-cover.png`)
      expect(content('meta[name="twitter:image"]')).toBe(`${canonical}og-cover.png`)
    }
    expect(content('meta[property="og:locale"]')).toBe('en_US')
    expect(content('meta[property="og:type"]')).toBe('website')
    expect(content('meta[name="twitter:card"]')).toBe('summary_large_image')
    expect(document.querySelector('meta[name="robots"]')).not.toBeNull()
  })
})
