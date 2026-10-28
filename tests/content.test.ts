import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { profile, projects } from '../src/data/portfolio'
import { safeHref } from '../src/lib/links'

const publicDirectory = path.resolve('public')

function publicAsset(source: string) {
  expect(source.startsWith('/assets/')).toBe(true)
  expect(safeHref(source)).toBe(source)
  const target = path.resolve(publicDirectory, `.${source}`)
  const relative = path.relative(publicDirectory, target)
  expect(relative.startsWith('..') || path.isAbsolute(relative)).toBe(false)
  expect(statSync(target).isFile()).toBe(true)
  expect(statSync(target).size).toBeGreaterThan(0)
  return target
}

function expectRasterImage(source: string) {
  const bytes = readFileSync(publicAsset(source))
  const isJpeg = bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
  const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const isWebp = bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  expect(isJpeg || isPng || isWebp).toBe(true)
}

describe('configured personal content', () => {
  it('ships the real CV and portrait referenced by the central profile', () => {
    expect(profile.cv).toBeTruthy()
    expect(profile.photo).toBeTruthy()
    const cv = publicAsset(profile.cv!)
    expect(readFileSync(cv).subarray(0, 5).toString('ascii')).toBe('%PDF-')
    expectRasterImage(profile.photo!)
  })

  it('uses real professional destinations while allowing future missing links', () => {
    for (const destination of [profile.github, profile.linkedin]) {
      if (destination === null) continue
      expect(safeHref(destination)).toBeTruthy()
      const url = new URL(destination)
      expect(url.protocol).toBe('https:')
      expect(['github.com', 'www.github.com', 'linkedin.com', 'www.linkedin.com']).toContain(url.hostname)
      expect(url.pathname.replaceAll('/', '')).not.toBe('')
      expect(url.pathname.toLowerCase()).not.toMatch(/example|your[-_]?name|username|placeholder/)
    }
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(profile.email).not.toMatch(/@example\.(com|org|net)$/i)
  })

  it('ships valid PFA screenshot assets with useful alternatives in both languages', () => {
    const pfa = projects.find((entry) => entry.id === 'pfa-devsecops')!
    expect(pfa).toBeTruthy()
    expect(pfa.screenshots.length).toBeGreaterThan(0)
    for (const screenshot of pfa.screenshots) {
      expectRasterImage(screenshot.src)
      expect(screenshot.alt.fr.trim().length).toBeGreaterThan(0)
      expect(screenshot.alt.en.trim().length).toBeGreaterThan(0)
    }
  })

  it('does not publish confidential repository addresses in project data', () => {
    for (const project of projects.filter((entry) => entry.repositoryVisibility === 'confidential')) {
      expect(project.github).toBeNull()
    }
  })
})
