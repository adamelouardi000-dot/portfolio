// @vitest-environment jsdom

import type { ReactNode } from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Contact } from '../src/sections/Contact'
import { CyberTerminal } from '../src/sections/CyberTerminal'
import { Projects } from '../src/sections/Projects'
import { profile, projectCategories, projects } from '../src/data/portfolio'
import { localize } from '../src/data/types'

vi.mock('../src/components/Reveal', () => ({
  Reveal: ({ children, className }: { children: ReactNode; className?: string }) => <div className={className}>{children}</div>,
}))

// JSDOM does not provide native modal behavior. These methods only reflect the
// open attribute; they do not attempt to reproduce the browser's focus trap.
const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
const configuredEmail = profile.email

beforeEach(() => { profile.email = null })

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) { this.setAttribute('open', '') },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) { this.removeAttribute('open') },
  })
})

afterEach(() => {
  cleanup()
  profile.email = configuredEmail
})

afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

describe('contact form interactions', () => {
  it('identifies invalid fields accessibly and focuses the first field', () => {
    render(<Contact locale="fr" />)
    const name = screen.getByRole('textbox', { name: /Votre nom/ })
    const email = screen.getByRole('textbox', { name: /Votre email/ })
    const message = screen.getByRole('textbox', { name: /Votre message/ })

    fireEvent.click(screen.getByRole('button', { name: 'Préparer mon email' }))

    expect(name.getAttribute('aria-invalid')).toBe('true')
    expect(email.getAttribute('aria-invalid')).toBe('true')
    expect(message.getAttribute('aria-invalid')).toBe('true')
    expect(name.getAttribute('aria-describedby')).toBe('contact-name-error')
    expect(screen.getByText('Indiquez votre nom (2 caractères minimum).')).toBeTruthy()
    expect(screen.getByText('Indiquez une adresse email valide.')).toBeTruthy()
    expect(document.activeElement).toBe(name)

    fireEvent.change(name, { target: { value: 'Équipe recrutement' } })
    expect(name.getAttribute('aria-invalid')).toBe('false')
    expect(screen.queryByText('Indiquez votre nom (2 caractères minimum).')).toBeNull()
  })

  it('explains a missing destination after a valid request without reporting success', () => {
    expect(profile.email).toBeNull()
    render(<Contact locale="fr" />)
    const originalLocation = window.location.href
    fireEvent.change(screen.getByRole('textbox', { name: /Votre nom/ }), { target: { value: 'Équipe recrutement' } })
    fireEvent.change(screen.getByRole('textbox', { name: /Votre email/ }), { target: { value: 'recruiter@example.com' } })
    fireEvent.change(screen.getByRole('textbox', { name: /Votre message/ }), { target: { value: 'Bonjour, échangeons sur une opportunité de stage dans notre équipe.' } })

    fireEvent.click(screen.getByRole('button', { name: 'Préparer mon email' }))

    const status = screen.getByRole('status')
    expect(status.textContent).toContain('Aucun email n’a été envoyé.')
    expect(status.textContent).toContain('n’a pas encore été renseignée')
    expect(screen.queryByText(/Votre messagerie a été sollicitée/)).toBeNull()
    expect(window.location.href).toBe(originalLocation)
    expect(screen.queryAllByRole('link').some((link) => link.getAttribute('href')?.startsWith('mailto:'))).toBe(false)
  })

  it('uses English labels and validation in a fresh English render', () => {
    render(<Contact locale="en" />)
    fireEvent.click(screen.getByRole('button', { name: 'Prepare my email' }))

    expect(screen.getByRole('textbox', { name: /Your name/ }).getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy()
    expect(screen.getByText('Add a little more detail (at least 20 characters).')).toBeTruthy()
    expect(screen.queryByText('Indiquez une adresse email valide.')).toBeNull()
  })

  it('exposes the configured email and CV without claiming an automatic message send', () => {
    profile.email = configuredEmail
    render(<Contact locale="fr" />)
    expect(configuredEmail).toBeTruthy()
    const email = screen.getByRole('link', { name: (name) => name.startsWith('Email') && name.includes(configuredEmail!) })
    expect(email.getAttribute('href')).toBe(`mailto:${encodeURIComponent(configuredEmail!)}`)
    const cv = screen.getByRole('link', { name: 'Télécharger mon CV' })
    expect(cv.getAttribute('href')).toBe(profile.cv)
    expect(cv.hasAttribute('download')).toBe(true)
    expect(screen.getByText('Ce formulaire ouvre un brouillon dans votre messagerie. Vous pourrez le vérifier et l’envoyer vous-même.')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe('')
  })
})

describe('simulated terminal interactions', () => {
  it('rejects a compound command and presents it as text', () => {
    render(<CyberTerminal locale="fr" />)
    const input = screen.getByRole('textbox', { name: 'Saisir une commande du terminal' })
    fireEvent.change(input, { target: { value: 'whoami && <script>alert(1)</script>' } })
    fireEvent.submit(input.closest('form')!)

    const output = screen.getByRole('region', { name: 'Historique du terminal' })
    expect(within(output).getByText(/Commande inconnue/)).toBeTruthy()
    expect(within(output).queryByText(profile.name)).toBeNull()
    expect(output.querySelector('script')).toBeNull()
    expect(output.textContent).toContain('whoami && <script>alert(1)</script>')
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('runs the whoami shortcut and returns focus to the command input', () => {
    render(<CyberTerminal locale="fr" />)
    fireEvent.click(screen.getByRole('button', { name: 'whoami' }))

    const output = screen.getByRole('region', { name: 'Historique du terminal' })
    expect(within(output).getByText(profile.name)).toBeTruthy()
    expect(within(output).getByText(localize(profile.role, 'fr'))).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Saisir une commande du terminal' }))
  })

  it('navigates command history with arrow keys and restores the unfinished draft', () => {
    render(<CyberTerminal locale="en" />)
    const input = screen.getByRole('textbox', { name: 'Enter a terminal command' }) as HTMLInputElement
    fireEvent.click(screen.getByRole('button', { name: 'whoami' }))
    fireEvent.click(screen.getByRole('button', { name: 'skills' }))
    fireEvent.change(input, { target: { value: 'projects' } })

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input.value).toBe('skills')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input.value).toBe('whoami')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input.value).toBe('whoami')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.value).toBe('skills')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.value).toBe('projects')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.value).toBe('projects')
  })

  it('clears previous output and announces the action', () => {
    render(<CyberTerminal locale="fr" />)
    fireEvent.click(screen.getByRole('button', { name: 'whoami' }))
    fireEvent.click(screen.getByRole('button', { name: 'clear' }))

    const output = screen.getByRole('region', { name: 'Historique du terminal' })
    expect(within(output).queryByText(profile.name)).toBeNull()
    expect(output.querySelectorAll('.terminal-entry').length).toBe(0)
    expect(within(output).getByText('Bienvenue dans mon espace cyber.')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe('Terminal effacé.')
  })

  it('translates the existing transcript when the language changes', () => {
    const { rerender } = render(<CyberTerminal locale="fr" />)
    fireEvent.click(screen.getByRole('button', { name: 'skills' }))
    rerender(<CyberTerminal locale="en" />)

    const output = screen.getByRole('region', { name: 'Terminal history' })
    expect(within(output).getByText('Technical areas · sources and practice indicated, without proficiency scores')).toBeTruthy()
    expect(within(output).queryByText('Domaines techniques · sources et pratique indiquées, sans niveau chiffré')).toBeNull()
    expect(screen.getByRole('textbox', { name: 'Enter a terminal command' })).toBeTruthy()
  })

  it('distinguishes CV-listed, draft and confidential work in both languages', () => {
    const listed = projects.find((entry) => entry.status === 'listed' && entry.repositoryVisibility !== 'confidential')!
    const draft = projects.find((entry) => entry.status === 'draft')!
    const confidential = projects.find((entry) => entry.repositoryVisibility === 'confidential')!
    const { rerender } = render(<CyberTerminal locale="fr" />)
    fireEvent.click(screen.getByRole('button', { name: 'projects' }))
    const french = screen.getByRole('region', { name: 'Historique du terminal' })
    expect(within(french).getByText(`${listed.title.fr} [Mention au CV]`)).toBeTruthy()
    expect(within(french).getByText(`${draft.title.fr} [À documenter]`)).toBeTruthy()
    expect(french.textContent).toContain(`${confidential.title.fr} [Mention au CV] [Dépôt confidentiel]`)

    rerender(<CyberTerminal locale="en" />)
    const english = screen.getByRole('region', { name: 'Terminal history' })
    expect(within(english).getByText(`${listed.title.en} [CV-listed]`)).toBeTruthy()
    expect(within(english).getByText(`${draft.title.en} [To document]`)).toBeTruthy()
    expect(english.textContent).toContain(`${confidential.title.en} [CV-listed] [Confidential repository]`)
    expect(english.textContent).not.toContain('[Dépôt confidentiel]')
  })
})

describe('project filters and detail dialog', () => {
  it('expands and reduces the list, then resets expansion when filtering', () => {
    render(<Projects locale="fr" />)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getByRole('status').textContent).toBe(`${String(projects.length).padStart(2, '0')} FICHES`)
    const expand = screen.getByRole('button', { name: `Voir les ${projects.length - 6} autres fiches` })
    expect(expand.getAttribute('aria-expanded')).toBe('false')
    expect(document.getElementById(expand.getAttribute('aria-controls')!)).toBeTruthy()
    fireEvent.click(expand)
    expect(screen.getAllByRole('article')).toHaveLength(projects.length)
    const reduce = screen.getByRole('button', { name: 'Réduire la liste' })
    expect(reduce.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(reduce)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    fireEvent.click(screen.getByRole('button', { name: `Voir les ${projects.length - 6} autres fiches` }))

    const filters = screen.getByRole('group', { name: 'Filtrer les projets' })
    const category = projectCategories.find((item) => item.id === 'network')!
    const filter = within(filters).getByRole('button', { name: localize(category.label, 'fr') })
    fireEvent.click(filter)

    const matching = projects.filter((project) => project.category === 'network')
    expect(screen.getAllByRole('article').length).toBe(matching.length)
    expect(screen.getByRole('status').textContent).toBe(`${String(matching.length).padStart(2, '0')} FICHES`)
    expect(filter.getAttribute('aria-pressed')).toBe('true')
    for (const project of matching) expect(screen.getByRole('heading', { name: localize(project.title, 'fr') })).toBeTruthy()

    const all = within(filters).getByRole('button', { name: /^Tous/ })
    fireEvent.click(all)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getByRole('status').textContent).toBe(`${String(projects.length).padStart(2, '0')} FICHES`)
    expect(screen.getByRole('button', { name: `Voir les ${projects.length - 6} autres fiches` }).getAttribute('aria-expanded')).toBe('false')
    expect(all.getAttribute('aria-pressed')).toBe('true')
    expect(filter.getAttribute('aria-pressed')).toBe('false')
  })

  it('shows the PFA evidence, screenshots and limitations without losing modal cleanup', () => {
    render(<Projects locale="fr" />)
    const entry = projects.find((project) => project.id === 'pfa-devsecops')!
    const firstCard = screen.getByRole('heading', { name: entry.title.fr }).closest('article')!
    const previousOverflow = document.body.style.overflow
    fireEvent.click(within(firstCard).getByRole('button', { name: 'Voir la fiche' }))

    const dialog = screen.getByRole('dialog', { name: localize(entry.title, 'fr') })
    expect((dialog as HTMLDialogElement).open).toBe(true)
    expect(within(dialog).getByText(localize(entry.results, 'fr'))).toBeTruthy()
    expect(within(dialog).getByText(entry.evidence!.fr)).toBeTruthy()
    expect(within(dialog).getByText(entry.role!.fr)).toBeTruthy()
    expect(within(dialog).getByText(entry.period!.fr)).toBeTruthy()
    expect(within(dialog).getByRole('heading', { name: 'Limites & perspectives' })).toBeTruthy()
    for (const limitation of entry.limitations!) expect(within(dialog).getByText(limitation.fr)).toBeTruthy()
    expect(within(dialog).getAllByRole('img')).toHaveLength(entry.screenshots.length)
    for (const screenshot of entry.screenshots) {
      expect(within(dialog).getByRole('img', { name: screenshot.alt.fr }).getAttribute('src')).toBe(screenshot.src)
    }
    expect(within(dialog).queryByText('Aucune capture fournie pour le moment.')).toBeNull()
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.click(within(dialog).getByRole('button', { name: 'Fermer la fiche' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe(previousOverflow)
  })

  it('handles the dialog cancel event with English content', () => {
    render(<Projects locale="en" />)
    fireEvent.click(within(screen.getAllByRole('article')[0]).getByRole('button', { name: 'Explore the entry' }))
    const dialog = screen.getByRole('dialog', { name: localize(projects[0].title, 'en') })
    expect(within(dialog).getByRole('heading', { name: 'Results & lessons' })).toBeTruthy()

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('keeps a confidential repository private even when a URL is configured accidentally', () => {
    const confidential = projects.find((entry) => entry.repositoryVisibility === 'confidential')!
    const originalUrl = confidential.github
    const accidentalUrl = 'https://github.com/example/internal-project'
    confidential.github = accidentalUrl
    try {
      const { rerender } = render(<Projects locale="fr" />)
      const card = screen.getByRole('heading', { name: confidential.title.fr }).closest('article')!
      expect(within(card).getByText('Code confidentiel')).toBeTruthy()
      fireEvent.click(within(card).getByRole('button', { name: 'Voir la fiche' }))
      const dialog = screen.getByRole('dialog', { name: confidential.title.fr })
      expect(within(dialog).getByText('Dépôt confidentiel — le code et les documents internes ne sont pas diffusés.')).toBeTruthy()
      expect(within(dialog).queryByRole('link', { name: /Consulter le dépôt/ })).toBeNull()
      expect(within(dialog).queryAllByRole('link').some((link) => link.getAttribute('href') === accidentalUrl)).toBe(false)

      rerender(<Projects locale="en" />)
      const englishDialog = screen.getByRole('dialog', { name: confidential.title.en })
      expect(within(englishDialog).getByText('Confidential repository — source code and internal documents are not shared.')).toBeTruthy()
      expect(within(englishDialog).queryByRole('link', { name: /View repository/ })).toBeNull()
    } finally {
      confidential.github = originalUrl
    }
  })
})
