// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { InteractiveName } from '../src/components/InteractiveName'
import { ProfilePortrait } from '../src/components/ProfilePortrait'
import { Hero } from '../src/sections/Hero'
import { profile } from '../src/data/profile'

const configuredLinks = { cv: profile.cv, github: profile.github, linkedin: profile.linkedin }

beforeEach(() => {
  profile.cv = null
  profile.github = null
  profile.linkedin = null
})

afterEach(() => {
  cleanup()
  Object.assign(profile, configuredLinks)
})

describe('personal identity and professional links', () => {
  it('keeps one exact accessible name and makes the effect reachable with a keyboard', () => {
    render(<InteractiveName name={profile.name} firstName={profile.firstName} lastName={profile.lastName} />)
    const headings = screen.getAllByRole('heading', { level: 1, name: profile.name })
    expect(headings).toHaveLength(1)
    const heading = headings[0]
    expect(heading.tabIndex).toBe(0)
    heading.focus()
    expect(document.activeElement).toBe(heading)
    fireEvent.mouseEnter(heading)
    fireEvent.mouseLeave(heading)
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBe(heading)
  })

  it('offers no fake CV or social destinations while retaining working section links', () => {
    render(<Hero locale="fr" />)
    expect(screen.queryByRole('link', { name: /Télécharger mon CV/ })).toBeNull()
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).toBeNull()
    expect(screen.getByRole('link', { name: /Explorer mes projets/ }).getAttribute('href')).toBe('#projects')
    expect(screen.getByRole('link', { name: /Me contacter/ }).getAttribute('href')).toBe('#contact')
    expect(screen.getByText(profile.availability.fr)).toBeTruthy()
  })

  it('uses the configured CV and safe external professional destinations', () => {
    profile.cv = '/assets/cv.pdf'
    profile.github = 'https://github.com/example'
    profile.linkedin = 'https://www.linkedin.com/in/example/'
    render(<Hero locale="en" />)
    const cv = screen.getByRole('link', { name: 'Download CV' })
    expect(cv.getAttribute('href')).toBe(`${import.meta.env.BASE_URL}${profile.cv!.slice(1)}`)
    expect(cv.hasAttribute('download')).toBe(true)
    for (const [label, href] of [['GitHub', profile.github], ['LinkedIn', profile.linkedin]]) {
      const link = screen.getByRole('link', { name: label! })
      expect(link.getAttribute('href')).toBe(href)
      expect(link.getAttribute('rel')).toContain('noopener')
    }
  })
})

describe('professional portrait fallback', () => {
  it('shows an honest placeholder when no photo is configured', () => {
    render(<ProfilePortrait src={null} name={profile.name} locale="fr" />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('Photo professionnelle à ajouter')).toBeTruthy()
    expect(screen.getByText('portrait / à personnaliser')).toBeTruthy()
  })

  it('replaces a failed photo and retries when its configured source changes', () => {
    const { rerender } = render(<ProfilePortrait src="/assets/first.jpg" name={profile.name} locale="fr" />)
    const portrait = screen.getByRole('img', { name: `Portrait professionnel de ${profile.name}` })
    expect(portrait.getAttribute('width')).toBe('158')
    expect(screen.getByText(`portrait / ${profile.name}`)).toBeTruthy()
    fireEvent.error(portrait)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('Photo momentanément indisponible')).toBeTruthy()
    expect(screen.queryByText(`portrait / ${profile.name}`)).toBeNull()

    rerender(<ProfilePortrait src="/assets/replacement.jpg" name={profile.name} locale="en" />)
    expect(screen.getByRole('img', { name: `Professional portrait of ${profile.name}` }).getAttribute('src')).toBe(`${import.meta.env.BASE_URL}assets/replacement.jpg`)
    expect(screen.queryByText('Photo momentanément indisponible')).toBeNull()
  })
})
