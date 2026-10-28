import { describe, expect, it } from 'vitest'
import { createContactMailto, validateContact } from '../src/lib/contact'
import { getTerminalResponse, terminalCommands } from '../src/lib/terminal'
import { certifications } from '../src/data/portfolio'

describe('local terminal command boundary', () => {
  it('rejects shell syntax, JavaScript and arguments instead of interpreting input', () => {
    const commands = ['whoami; rm -rf /', 'help && whoami', 'skills | cat', 'projects --all', 'eval(1)', '$(whoami)', '<script>alert(1)</script>']
    for (const command of commands) expect(getTerminalResponse(command, 'fr').kind).toBe('error')
  })

  it('accepts only the documented commands, with optional whitespace and casing', () => {
    for (const command of terminalCommands) expect(getTerminalResponse(`  ${command.toUpperCase()}  `, 'en').kind).not.toBe('error')
    expect(getTerminalResponse('clear', 'en')).toEqual({ kind: 'clear', lines: [] })
  })

  it('provides localized guidance for unknown input', () => {
    expect(getTerminalResponse('sudo', 'fr').lines.join(' ')).toContain('Commande inconnue')
    expect(getTerminalResponse('sudo', 'en').lines.join(' ')).toContain('Unknown command')
  })

  it('keeps a badge edition separate from a missing date earned in both languages', () => {
    const originalLength = certifications.length
    certifications.push({ id: 'test-badge', name: 'Test badge', issuer: 'Test issuer', kind: 'badge', edition: '2099' })
    try {
      const french = getTerminalResponse('certifications', 'fr').lines.find(line => line.startsWith('Test badge'))!
      const english = getTerminalResponse('certifications', 'en').lines.find(line => line.startsWith('Test badge'))!
      expect(french).toContain('Badge fourni · Édition 2099 · Date d’obtention à préciser')
      expect(english).toContain('Supplied badge · Edition 2099 · Date earned to be added')
      expect(`${french} ${english}`).not.toContain('undefined')
    } finally {
      certifications.splice(originalLength)
    }
  })
})

describe('contact validation and email draft', () => {
  const values = { name: 'Équipe R&D', email: 'recruiter@example.com', message: 'Bonjour Adam, discutons de notre opportunité de stage.' }

  it('reports all invalid fields and accepts a complete contact request', () => {
    expect(Object.keys(validateContact({ name: ' ', email: 'invalid', message: 'court' }, 'fr'))).toEqual(['name', 'email', 'message'])
    expect(validateContact(values, 'fr')).toEqual({})
    expect(validateContact({ ...values, email: 'name@example.com\r\nBcc:other@example.com' }, 'en').email).toBeDefined()
    expect(validateContact({ ...values, message: 'a'.repeat(3001) }, 'en').message).toBeDefined()
  })

  it('encodes special characters as mailto query values without adding query fields', () => {
    const draft = createContactMailto('adam@example.com', { ...values, message: 'Un projet & une question ? #sécurité\nMerci de me répondre.' }, 'fr')
    expect(draft.startsWith('mailto:adam%40example.com?subject=')).toBe(true)
    const params = new URLSearchParams(draft.split('?')[1])
    expect([...params.keys()]).toEqual(['subject', 'body'])
    expect(params.get('subject')).toBe('Contact portfolio — Équipe R&D')
    expect(params.get('body')).toContain('Un projet & une question ? #sécurité\nMerci de me répondre.')
    expect(params.get('body')).toContain('Email : recruiter@example.com')
  })

  it('creates an English draft when English is selected', () => {
    const params = new URLSearchParams(createContactMailto('adam@example.com', values, 'en').split('?')[1])
    expect(params.get('subject')).toContain('Portfolio enquiry')
    expect(params.get('body')).toContain('Name : Équipe R&D')
  })
})
