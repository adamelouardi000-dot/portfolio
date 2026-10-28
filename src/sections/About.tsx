import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ProfilePortrait } from '../components/ProfilePortrait'
import { ScrollSignal } from '../components/ScrollSignal'
import { profile, timeline } from '../data/profile'
import { localize, type Locale } from '../data/types'
import '../styles/profile-sections.css'

const copy = {
  fr: {
    eyebrow: 'Derrière le terminal',
    title: 'Un parcours d’ingénieur, une ambition en cybersécurité.',
    intro: 'Comprendre les systèmes pour mieux les protéger.',
    education: 'Mon parcours',
    opportunity: 'Construisons la suite',
    contact: 'Échangeons',
  },
  en: {
    eyebrow: 'Behind the terminal',
    title: 'An engineering background. A focus on cybersecurity.',
    intro: 'Understanding systems to make them more secure.',
    education: 'My background',
    opportunity: 'Let’s build what comes next',
    contact: 'Get in touch',
  },
}

export function About({ locale }: { locale: Locale }) {
  const text = copy[locale]
  const education = timeline.find((item) => item.kind === 'education')

  return (
    <section id="about" className="section profile-about">
      <ScrollSignal />
      <div className="container">
        <SectionHeading index="01" eyebrow={text.eyebrow} title={text.title} />
        <div className="profile-about-grid">
          <Reveal className="profile-portrait-wrap">
            <ProfilePortrait src={profile.photo} name={profile.name} locale={locale} />
          </Reveal>
          <Reveal className="profile-about-copy" delay={0.1}>
            <p className="profile-small-label">{localize(profile.role, locale)}</p>
            <h3>{text.intro}</h3>
            {localize(profile.bio, locale).split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {education && (
              <div className="profile-education-note">
                <GraduationCap size={23} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <span>{text.education}</span>
                  <p>{education.organization}</p>
                  <small>{localize(education.period, locale)}</small>
                </div>
              </div>
            )}
            <a href="#contact" className="profile-about-contact">
              <span><small>{text.opportunity}</small>{text.contact}</span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
