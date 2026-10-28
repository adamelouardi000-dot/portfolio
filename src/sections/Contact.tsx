import { useRef, useState, type FormEvent } from 'react'
import { ArrowDownToLine, ArrowUpRight, Mail, Send, Info, Check } from 'lucide-react'
import { Github, Linkedin } from '../components/BrandIcons'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { ConfigLink } from '../components/ConfigLink'
import { profile } from '../data/portfolio'
import { localize, type Locale } from '../data/types'
import { createContactMailto, validateContact, type ContactErrors, type ContactValues } from '../lib/contact'
import '../styles/interactive-sections.css'

const emptyValues: ContactValues = { name: '', email: '', message: '' }

export function Contact({ locale }: { locale: Locale }) {
  const fr = locale === 'fr'
  const [values, setValues] = useState<ContactValues>(emptyValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'missing-email' | 'draft'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  function update(field: keyof ContactValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateContact(values, locale)
    setErrors(nextErrors)
    setStatus('idle')
    const firstInvalid = (['name', 'email', 'message'] as const).find((field) => nextErrors[field])
    if (firstInvalid) {
      const field = formRef.current?.elements.namedItem(firstInvalid)
      if (field instanceof HTMLElement) field.focus()
      return
    }
    if (!profile.email) {
      setStatus('missing-email')
      return
    }
    window.location.href = createContactMailto(profile.email, values, locale)
    setStatus('draft')
  }

  const localizedErrors = validateContact(values, locale)
  const nameError = errors.name ? localizedErrors.name : undefined
  const emailError = errors.email ? localizedErrors.email : undefined
  const messageError = errors.message ? localizedErrors.message : undefined

  return (
    <section id="contact" className="section contact-section" aria-label="Contact">
      <div className="container">
        <SectionHeading index="07" eyebrow={fr ? 'Construisons la suite' : 'Let’s build what comes next'} title={fr ? 'Entrons en contact.' : 'Let’s connect.'} />
        <div className="contact-grid">
          <Reveal className="contact-intro">
            <p className="contact-lead">{localize(profile.contactLead, locale)}</p>
            <p className="contact-description">{localize(profile.contactDescription, locale)}</p>
            <div className="contact-availability"><span className="contact-status-dot" /><span>{localize(profile.availability, locale)}</span></div>
            <div className="contact-channel-list">
              {profile.email ? <a href={`mailto:${encodeURIComponent(profile.email)}`} className="contact-channel">
                <span className="contact-channel-icon"><Mail size={19} aria-hidden="true" /></span><span><span className="contact-channel-name">Email</span><span className="contact-channel-value">{profile.email}</span></span><ArrowUpRight size={17} aria-hidden="true" />
              </a> : <span className="contact-channel unavailable-link" aria-disabled="true">
                <span className="contact-channel-icon"><Mail size={19} aria-hidden="true" /></span><span><span className="contact-channel-name">Email</span><span className="contact-channel-value">{fr ? 'Adresse à renseigner' : 'Email to be added'}</span></span><ArrowUpRight size={17} aria-hidden="true" />
              </span>}
              <div className="contact-social-row">
                <ConfigLink href={profile.linkedin} className="contact-social-link" missingLabel={fr ? 'LinkedIn à renseigner' : 'LinkedIn to be added'}><Linkedin size={17} aria-hidden="true" />{profile.linkedin ? 'LinkedIn' : (fr ? 'LinkedIn · à renseigner' : 'LinkedIn · to be added')}<ArrowUpRight size={14} aria-hidden="true" /></ConfigLink>
                <ConfigLink href={profile.github} className="contact-social-link" missingLabel={fr ? 'GitHub à renseigner' : 'GitHub to be added'}><Github size={17} aria-hidden="true" />{profile.github ? 'GitHub' : (fr ? 'GitHub · à renseigner' : 'GitHub · to be added')}<ArrowUpRight size={14} aria-hidden="true" /></ConfigLink>
              </div>
            </div>
            <ConfigLink href={profile.cv} className="contact-cv-link" missingLabel={fr ? 'CV à ajouter' : 'CV to be added'} download><ArrowDownToLine size={16} aria-hidden="true" />{profile.cv ? (fr ? 'Télécharger mon CV' : 'Download my CV') : (fr ? 'CV · à ajouter' : 'CV · to be added')}</ConfigLink>
          </Reveal>
          <Reveal delay={0.1}>
            <form className="contact-form" ref={formRef} onSubmit={submit} noValidate aria-describedby="contact-form-note">
              <div className="contact-form-heading"><Mail size={17} aria-hidden="true" /><h3>{fr ? 'Parlons de votre opportunité' : 'Tell me about your opportunity'}</h3></div>
              <p className="contact-required-note">{fr ? 'Tous les champs sont obligatoires.' : 'All fields are required.'}</p>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">{fr ? 'Votre nom' : 'Your name'} <span aria-hidden="true">*</span></label>
                  <input id="contact-name" name="name" autoComplete="name" required maxLength={80} value={values.name} onChange={(event) => update('name', event.target.value)} placeholder={fr ? 'Nom complet' : 'Full name'} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? 'contact-name-error' : undefined} />
                  {nameError && <p className="contact-field-error" id="contact-name-error">{nameError}</p>}
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email">{fr ? 'Votre email' : 'Your email'} <span aria-hidden="true">*</span></label>
                  <input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} value={values.email} onChange={(event) => update('email', event.target.value)} placeholder={fr ? 'vous@entreprise.com' : 'you@company.com'} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'contact-email-error' : undefined} />
                  {emailError && <p className="contact-field-error" id="contact-email-error">{emailError}</p>}
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">{fr ? 'Votre message' : 'Your message'} <span aria-hidden="true">*</span></label>
                <textarea id="contact-message" name="message" required minLength={20} maxLength={3000} rows={5} value={values.message} onChange={(event) => update('message', event.target.value)} placeholder={fr ? 'Présentez votre équipe, votre projet ou votre proposition de stage…' : 'Tell me about your team, project or internship opportunity…'} aria-invalid={Boolean(messageError)} aria-describedby={messageError ? 'contact-message-error contact-message-hint' : 'contact-message-hint'} />
                <div className="contact-message-meta"><span id="contact-message-hint">{fr ? '20 caractères minimum' : '20 characters minimum'}</span><span>{values.message.length}/3000</span></div>
                {messageError && <p className="contact-field-error" id="contact-message-error">{messageError}</p>}
              </div>
              <p className={`contact-form-note${!profile.email ? ' contact-form-note-pending' : ''}`} id="contact-form-note"><Info size={15} aria-hidden="true" /><span>{!profile.email
                ? (fr ? 'Adresse de destination à configurer. Le formulaire est prêt ; aucun message ne peut encore être préparé.' : 'The destination email needs to be configured. The form is ready; messages cannot be prepared yet.')
                : (fr ? 'Ce formulaire ouvre un brouillon dans votre messagerie. Vous pourrez le vérifier et l’envoyer vous-même.' : 'This form opens a draft in your email app. You can review and send it yourself.')}</span></p>
              <button className="contact-send-button" type="submit">{fr ? 'Préparer mon email' : 'Prepare my email'}<Send size={16} aria-hidden="true" /></button>
              <div className={`contact-form-status${status === 'missing-email' ? ' contact-form-status-error' : ''}`} role="status" aria-live="polite" aria-atomic="true">
                {status === 'missing-email' && <><Info size={15} aria-hidden="true" /><span>{fr ? 'L’adresse de contact n’a pas encore été renseignée. Aucun email n’a été envoyé.' : 'The contact email has not been added yet. No email has been sent.'}</span></>}
                {status === 'draft' && <><Check size={15} aria-hidden="true" /><span>{fr ? 'Votre messagerie a été sollicitée. Si elle s’ouvre, vérifiez le brouillon puis envoyez-le. Aucun envoi automatique n’a lieu.' : 'Your email app was requested. If it opens, review the draft and send it. Nothing is sent automatically.'}</span></>}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
