import { Binary, Cloud, Code2, Network, ScanLine, ShieldCheck, ShieldEllipsis, Terminal } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { skillCategories } from '../data/profile'
import { localize, type Locale } from '../data/types'
import '../styles/profile-sections.css'
import '../styles/evidence-sections.css'

const icons = {
  offensive: ScanLine,
  defensive: ShieldCheck,
  grc: ShieldEllipsis,
  network: Network,
  cryptography: Binary,
  cloud: Cloud,
  programming: Code2,
  tools: Terminal,
}

const copy = {
  fr: {
    eyebrow: 'Compétences & axes cyber',
    title: 'Comprendre les systèmes. Intégrer la sécurité.',
    description: 'Des axes de spécialisation en cybersécurité, complétés par les connaissances de mon CV et les pratiques présentées dans mes projets.',
    status: 'Centres d’intérêt · connaissances déclarées · pratique documentée, sans niveau de maîtrise présumé',
    pending: 'Pratique à documenter',
    interest: 'Centre d’intérêt',
    cv: 'Déclaré dans le CV',
    project: 'Pratique documentée',
  },
  en: {
    eyebrow: 'Skills & security focus',
    title: 'Understand systems. Build in security.',
    description: 'My cybersecurity focus areas, alongside knowledge listed in my CV and practices demonstrated in my projects.',
    status: 'Areas of interest · CV-listed knowledge · documented practice, with no proficiency level assumed',
    pending: 'Practice to be documented',
    interest: 'Area of interest',
    cv: 'Listed in my CV',
    project: 'Documented practice',
  },
}

export function Skills({ locale }: { locale: Locale }) {
  const text = copy[locale]

  return (
    <section id="skills" className="section profile-skills">
      <div className="container">
        <SectionHeading index="02" eyebrow={text.eyebrow} title={text.title} description={text.description} />
        <Reveal className="profile-skills-status"><span aria-hidden="true" />{text.status}</Reveal>
        <div className="profile-skills-grid">
          {skillCategories.map((category, index) => {
            const Icon = icons[category.id as keyof typeof icons] ?? ShieldCheck
            return (
              <Reveal key={category.id} delay={(index % 4) * 0.045} className="profile-skill-card">
                <div className="profile-skill-top"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
                <h3>{localize(category.title, locale)}</h3>
                <p>{localize(category.description, locale)}</p>
                {category.topics.length > 0 ? (
                  <ul className="profile-skill-topics" aria-label={localize(category.title, locale)}>
                    {category.topics.map((topic) => <li key={topic}>{topic}</li>)}
                  </ul>
                ) : <span className="profile-pending-note">{text.pending}</span>}
                {category.evidence && (
                  <div className={`skill-evidence skill-evidence-${category.basis ?? 'interest'}`}>
                    <span className="evidence-label">{text[category.basis ?? 'interest']}</span>
                    <p>{localize(category.evidence, locale)}</p>
                  </div>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
