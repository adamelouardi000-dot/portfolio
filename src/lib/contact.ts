import type { Locale } from '../data/types'

export type ContactValues = { name: string; email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactValues, string>>

export function validateContact(values: ContactValues, locale: Locale): ContactErrors {
  const fr = locale === 'fr'
  const errors: ContactErrors = {}

  if (values.name.trim().length < 2) {
    errors.name = fr ? 'Indiquez votre nom (2 caractères minimum).' : 'Enter your name (at least 2 characters).'
  } else if (values.name.trim().length > 80) {
    errors.name = fr ? 'Votre nom doit contenir au maximum 80 caractères.' : 'Your name must contain no more than 80 characters.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.trim().length > 254) {
    errors.email = fr ? 'Indiquez une adresse email valide.' : 'Enter a valid email address.'
  }
  if (values.message.trim().length < 20) {
    errors.message = fr ? 'Ajoutez quelques précisions (20 caractères minimum).' : 'Add a little more detail (at least 20 characters).'
  } else if (values.message.trim().length > 3000) {
    errors.message = fr ? 'Votre message doit contenir au maximum 3 000 caractères.' : 'Your message must contain no more than 3,000 characters.'
  }

  return errors
}

/** Generates an email draft. This does not send a message or report delivery. */
export function createContactMailto(recipient: string, values: ContactValues, locale: Locale): string {
  const subject = `${locale === 'fr' ? 'Contact portfolio' : 'Portfolio enquiry'} — ${values.name.trim()}`
  const body = [
    values.message.trim(),
    '',
    '—',
    `${locale === 'fr' ? 'Nom' : 'Name'} : ${values.name.trim()}`,
    `Email : ${values.email.trim()}`,
  ].join('\r\n')
  return `mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
