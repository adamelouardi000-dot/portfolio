import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Info, LockKeyhole, X } from 'lucide-react'
import { Github } from '../components/BrandIcons'
import { projects, projectCategories, localize } from '../data/portfolio'
import type { Locale, Project, ProjectCategory } from '../data/types'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { ProjectVisual } from '../components/ProjectVisual'
import { ConfigLink } from '../components/ConfigLink'
import { ScrollSignal } from '../components/ScrollSignal'
import { publicAssetUrl } from '../lib/assets'
import '../styles/project-evidence.css'

const kindLabel = { academic: { fr: 'Projet académique', en: 'Academic project' }, simulation: { fr: 'Simulation de crise', en: 'Crisis simulation' }, lab: { fr: 'Laboratoire pratique', en: 'Practical lab' }, internship: { fr: 'Projet de stage', en: 'Internship project' }, repository: { fr: 'Projet GitHub', en: 'GitHub project' } }
const statusLabel = { draft: { fr: 'À documenter', en: 'To document' }, listed: { fr: 'Mention au CV', en: 'CV-listed' }, documented: { fr: 'Documenté', en: 'Documented' } }
const initialCount = 6

export function Projects({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const [expanded, setExpanded] = useState(false)
  const matching = projects.filter(project => filter === 'all' || project.category === filter)
  const visible = expanded ? matching : matching.slice(0, initialCount)
  const fr = locale === 'fr'
  return <section id="projects" className="section projects-section">
    <ScrollSignal tone="amber" />
    <div className="container">
      <SectionHeading index="03" eyebrow={fr ? 'Projets & réalisations' : 'Projects & practical work'} title={fr ? 'La pratique, avec ses preuves.' : 'Practical work, with evidence.'} description={fr ? 'PFA DevSecOps, projet de stage confidentiel et réalisations académiques. Chaque fiche distingue ses sources, ses résultats et les éléments à compléter.' : 'A DevSecOps PFA, a confidential internship project and academic work. Each entry distinguishes its sources, outcomes and details still to be added.'} />
      <div className="projects-topbar">
        <div className="project-filters" role="group" aria-label={fr ? 'Filtrer les projets' : 'Filter projects'}>{projectCategories.map(category => <button key={category.id} type="button" aria-pressed={filter === category.id} onClick={() => { setFilter(category.id); setExpanded(false) }}>{localize(category.label, locale)}{category.id === 'all' && <span>{projects.length.toString().padStart(2, '0')}</span>}</button>)}</div>
        <span className="project-count mono" role="status">{matching.length.toString().padStart(2, '0')} {fr ? 'FICHES' : 'ENTRIES'}</span>
      </div>
      {visible.some(project => project.status === 'draft') && <p className="draft-notice"><Info size={14} /><span>{fr ? 'Fiches provisoires : contexte, participation et résultats restent à confirmer.' : 'Draft entries: context, participation and results still need to be confirmed.'}</span></p>}
      {visible.some(project => project.status === 'listed') && <p className="project-source-note"><Info size={14} /><span>{fr ? '« Mention au CV » : sujet renseigné dans le CV, résultats et preuves complémentaires à détailler.' : '“CV-listed”: included in the CV, with outcomes and further evidence still to be detailed.'}</span></p>}
      <div className="projects-grid" id="project-cards">
        {visible.map(project => <Reveal key={project.id}><article className="project-card">
          <button type="button" className="project-image-button" onClick={() => setSelected(project)} aria-label={`${fr ? 'Voir les détails' : 'View details'} — ${localize(project.title, locale)}`}><ProjectVisual category={project.category} locale={locale} /><span className="project-image-open"><ArrowUpRight size={20} /></span></button>
          <div className="project-card-content">
            <div className="project-meta mono"><span>{localize(kindLabel[project.kind], locale)}</span><span className={`project-status ${project.status}`}>{localize(statusLabel[project.status], locale)}</span></div>
            <h3>{localize(project.title, locale)}</h3><p>{localize(project.summary, locale)}</p>
            <div className="project-tags">{project.technologies.map(tech => <span className="tag" key={tech}>{tech}</span>)}{!project.technologies.length && <span className="project-pending mono">{fr ? 'TECHNOLOGIES À PRÉCISER' : 'TECHNOLOGIES TO ADD'}</span>}</div>
            {project.evidence && <p className="project-evidence">{localize(project.evidence, locale)}</p>}
            {project.repositoryVisibility === 'confidential' && <span className="project-confidential"><LockKeyhole size={12} />{fr ? 'Code confidentiel' : 'Confidential source code'}</span>}
            <div className="project-card-footer"><span className="mono">CASE / {String(projects.indexOf(project) + 1).padStart(2, '0')}</span><button type="button" onClick={() => setSelected(project)}>{fr ? 'Voir la fiche' : 'Explore the entry'}<ArrowUpRight size={17} /></button></div>
          </div>
        </article></Reveal>)}
      </div>
      {matching.length > initialCount && <div className="projects-expand"><button type="button" className="button button-secondary" aria-expanded={expanded} aria-controls="project-cards" onClick={() => setExpanded(!expanded)}>{expanded ? (fr ? 'Réduire la liste' : 'Show fewer entries') : (fr ? `Voir les ${matching.length - initialCount} autres fiches` : `View ${matching.length - initialCount} more entries`)}<ArrowDown size={16} className={expanded ? 'is-expanded' : undefined} /></button><span className="mono">{visible.length} / {matching.length} {fr ? 'fiches affichées' : 'entries shown'}</span></div>}
      {selected && <ProjectDialog project={selected} locale={locale} onClose={() => setSelected(null)} />}
    </div>
  </section>
}

function ProjectDialog({ project, locale, onClose }: { project: Project; locale: Locale; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const fr = locale === 'fr'
  useEffect(() => {
    const dialog = ref.current
    const focused = document.activeElement
    const oldOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = oldOverflow
      if (focused instanceof HTMLElement) focused.focus()
    }
  }, [])
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="project-dialog-inner">
      <div className="dialog-topline"><span className="eyebrow">{localize(kindLabel[project.kind], locale)}</span><button type="button" className="icon-button" onClick={onClose} aria-label={fr ? 'Fermer la fiche' : 'Close project details'}><X size={21} /></button></div>
      <h2 id="project-dialog-title">{localize(project.title, locale)}</h2>
      {project.period && <p className="project-period mono">{localize(project.period, locale)}</p>}
      {project.evidence && <p className="project-evidence dialog-evidence"><Info size={14} />{localize(project.evidence, locale)}</p>}
      {project.status === 'draft' && <p className="dialog-draft"><Info size={16} />{fr ? 'Contenu provisoire — réalisations et résultats à confirmer.' : 'Draft content — work and results to be confirmed.'}</p>}
      {project.status === 'listed' && <p className="dialog-draft"><Info size={16} />{fr ? 'Sujet décrit au CV. Les résultats détaillés et justificatifs restent à compléter.' : 'Topic described in the CV. Detailed outcomes and supporting material remain to be added.'}</p>}
      {project.role && <div className="dialog-block"><h3>{fr ? 'Rôle & cadre' : 'Role & context'}</h3><p>{localize(project.role, locale)}</p></div>}
      <div className="dialog-block"><h3>{fr ? 'Contexte & problématique' : 'Context & problem'}</h3><p>{localize(project.summary, locale)}</p></div>
      <div className="dialog-block"><h3>{fr ? 'Objectifs' : 'Objectives'}</h3><ul>{project.objectives.map((objective, i) => <li key={i}>{localize(objective, locale)}</li>)}</ul></div>
      <div className="dialog-block"><h3>{fr ? 'Méthodologie' : 'Methodology'}</h3><ul>{project.methodology.map((step, i) => <li key={i}>{localize(step, locale)}</li>)}</ul></div>
      <div className="dialog-block dialog-results"><h3>{fr ? 'Résultats & enseignements' : 'Results & lessons'}</h3><p>{localize(project.results, locale)}</p></div>
      {!!project.limitations?.length && <div className="dialog-block dialog-limitations"><h3>{fr ? 'Limites & perspectives' : 'Limitations & next steps'}</h3><ul>{project.limitations.map((limitation, i) => <li key={i}>{localize(limitation, locale)}</li>)}</ul></div>}
      <div className="dialog-block"><h3>{fr ? 'Technologies & concepts' : 'Technologies & concepts'}</h3><div className="project-tags">{project.technologies.map(tech => <span className="tag" key={tech}>{tech}</span>)}{!project.technologies.length && <p>{fr ? 'À renseigner.' : 'To be added.'}</p>}</div></div>
      <div className="dialog-block"><h3>{fr ? 'Captures & pièces jointes' : 'Screenshots & supporting material'}</h3>{project.screenshots.some(item => publicAssetUrl(item.src)) ? project.screenshots.filter(item => publicAssetUrl(item.src)).map((item, i) => <img key={i} src={publicAssetUrl(item.src)} alt={localize(item.alt, locale)} className="project-screenshot" loading="lazy" />) : <p className="screenshot-placeholder">{fr ? 'Aucune capture fournie pour le moment.' : 'No screenshots supplied yet.'}</p>}</div>
      {project.repositoryVisibility === 'confidential'
        ? <p className="confidential-repository"><LockKeyhole size={17} /><span>{fr ? 'Dépôt confidentiel — le code et les documents internes ne sont pas diffusés.' : 'Confidential repository — source code and internal documents are not shared.'}</span></p>
        : <ConfigLink href={project.github} className="button button-secondary" missingLabel={fr ? 'Dépôt GitHub à renseigner' : 'GitHub repository to be added'}><Github size={16} />{project.github ? (fr ? 'Consulter le dépôt' : 'View repository') : (fr ? 'Dépôt à renseigner' : 'Repository to be added')}</ConfigLink>}
    </div>
  </dialog>
}
