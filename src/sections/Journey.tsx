import { BriefcaseBusiness, Flag, GraduationCap } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ScrollSignal } from '../components/ScrollSignal'
import { profile, timeline } from '../data/profile'
import { localize, type Locale } from '../data/types'
import '../styles/profile-sections.css'

const copy = {
  fr: {
    eyebrow: 'Parcours & expériences',
    title: 'Une formation, des expériences concrètes.',
    description: 'Mon parcours d’ingénieur et mes stages en cybersécurité et DevOps.',
    provisional: 'Contenu à compléter',
    next: 'La prochaine étape',
    contact: 'Parlons de votre équipe',
  },
  en: {
    eyebrow: 'Education & experience',
    title: 'An engineering education. Practical experience.',
    description: 'My engineering education and internships in cybersecurity and DevOps.',
    provisional: 'Details to be added',
    next: 'The next chapter',
    contact: 'Let’s talk about your team',
  },
}

const icons = { education: GraduationCap, experience: BriefcaseBusiness, event: Flag }

export function Journey({ locale }: { locale: Locale }) {
  const text = copy[locale]

  return (
    <section id="journey" className="section profile-journey">
      <ScrollSignal side="left" />
      <div className="container">
        <SectionHeading index="04" eyebrow={text.eyebrow} title={text.title} description={text.description} />
        <div className="profile-journey-layout">
          <ol className="profile-timeline">
            {timeline.map((item, index) => {
              const Icon = icons[item.kind]
              return (
                <li key={item.id} className={item.placeholder ? 'profile-timeline-item is-placeholder' : 'profile-timeline-item'}>
                  <span className="profile-timeline-node" aria-hidden="true"><Icon size={18} strokeWidth={1.5} /></span>
                  <Reveal className="profile-timeline-content" delay={index * 0.05}>
                    <div className="profile-timeline-meta"><span>{localize(item.period, locale)}</span>{item.placeholder && <small>{text.provisional}</small>}</div>
                    <h3>{localize(item.title, locale)}</h3>
                    {item.organization && <p className="profile-timeline-organization">{item.organization}</p>}
                    <p>{localize(item.description, locale)}</p>
                  </Reveal>
                </li>
              )
            })}
          </ol>
          <Reveal className="profile-next-chapter" delay={0.1}>
            <span className="profile-small-label">{text.next}</span>
            <span className="profile-next-year" aria-hidden="true">{profile.internshipYear}<span>_</span></span>
            <h3>{localize(profile.availability, locale)}</h3>
            <a href="#contact">{text.contact}<span aria-hidden="true">↗</span></a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
