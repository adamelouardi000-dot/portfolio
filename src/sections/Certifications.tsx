import { ArrowUpRight, Award, BadgeCheck, BookOpen, FileCheck2 } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { certifications, trainings } from '../data/profile'
import { localize, type Locale } from '../data/types'
import { safeHref } from '../lib/links'
import { publicAssetUrl } from '../lib/assets'
import '../styles/profile-sections.css'
import '../styles/evidence-sections.css'
import '../styles/certification-evidence.css'

const copy = {
  fr: {
    eyebrow: 'Formation continue & certifications',
    title: 'Apprendre et documenter ses acquis.',
    description: 'Badges et certifications avec leurs éléments disponibles, puis formations mentionnées dans mon CV.',
    trainingTitle: 'Formations mentionnées dans mon CV',
    trainingDescription: 'Ces mentions de formation ne constituent pas une vérification de certification. Les justificatifs et dates restent à compléter.',
    trainingLabel: 'Mention dans le CV',
    trainingLink: 'Consulter la formation',
    emptyTitle: 'La suite s’écrit ici.',
    emptyDescription: 'Aucune certification n’est renseignée pour le moment. Les titres obtenus seront présentés avec leur organisme, leur date et un lien de vérification lorsqu’il est disponible.',
    status: 'Certifications à renseigner',
    badgeStatus: 'Badge fourni',
    certificationStatus: 'Certification renseignée',
    badgeAlt: 'Badge',
    issuer: 'Organisme',
    date: 'Obtention',
    missingDate: 'Date à compléter',
    edition: 'Édition',
    proof: 'Justificatif',
    viewBadge: 'Voir le badge',
    viewEvidence: 'Voir le justificatif',
    verify: 'Vérifier la certification',
    unavailable: 'Vérification non renseignée',
  },
  en: {
    eyebrow: 'Continuing education & certifications',
    title: 'Learn and document the progress.',
    description: 'Badges and certifications with available supporting material, followed by training listed in my CV.',
    trainingTitle: 'Training listed in my CV',
    trainingDescription: 'These training entries do not verify a certification. Supporting credentials and dates still need to be added.',
    trainingLabel: 'Listed in my CV',
    trainingLink: 'View training',
    emptyTitle: 'The next chapter belongs here.',
    emptyDescription: 'No certifications are listed yet. Earned credentials will include their issuer, date, and a verification link when available.',
    status: 'Certifications to be added',
    badgeStatus: 'Badge provided',
    certificationStatus: 'Certification listed',
    badgeAlt: 'Badge',
    issuer: 'Issuer',
    date: 'Date earned',
    missingDate: 'Date to be added',
    edition: 'Edition',
    proof: 'Credential',
    viewBadge: 'View badge',
    viewEvidence: 'View supporting document',
    verify: 'Verify certification',
    unavailable: 'Verification not provided',
  },
}

export function Certifications({ locale }: { locale: Locale }) {
  const text = copy[locale]

  return (
    <section id="certifications" className="section profile-certifications">
      <div className="container">
        <SectionHeading index="05" eyebrow={text.eyebrow} title={text.title} description={text.description} />
        {certifications.length === 0 ? (
          <Reveal className="profile-cert-empty">
            <div className="profile-cert-emblem" aria-hidden="true"><span /><Award size={48} strokeWidth={1.15} /></div>
            <div className="profile-cert-empty-copy">
              <span className="profile-small-label">{text.status}</span>
              <h3>{text.emptyTitle}</h3>
              <p>{text.emptyDescription}</p>
            </div>
            <div className="profile-cert-fields" aria-hidden="true">
              <span><BadgeCheck size={15} />{text.issuer}</span>
              <span><FileCheck2 size={15} />{text.date}</span>
              <span><ArrowUpRight size={15} />{text.proof}</span>
            </div>
          </Reveal>
        ) : (
          <div className="profile-cert-grid">
            {certifications.map((certification, index) => {
              const url = safeHref(certification.verificationUrl)
              const logo = publicAssetUrl(certification.logo)
              const evidence = publicAssetUrl(certification.evidenceUrl)
              const isBadge = certification.kind === 'badge'
              return (
                <Reveal key={certification.id} className="profile-cert-card" delay={(index % 3) * 0.05}>
                  <span className="evidence-label profile-cert-status">{isBadge ? text.badgeStatus : text.certificationStatus}</span>
                  <div className={isBadge ? 'profile-cert-badge-art' : 'profile-cert-logo'}>
                    {logo ? <img src={logo} alt={isBadge ? `${text.badgeAlt} ${certification.name}` : certification.issuer} loading="lazy" width={isBadge ? 560 : 48} height={isBadge ? 280 : 48} /> : <Award size={27} aria-hidden="true" />}
                  </div>
                  <p className="profile-cert-issuer">{certification.issuer}</p>
                  <h3>{certification.name}</h3>
                  <dl className="profile-cert-metadata">
                    {certification.edition && <div><dt>{text.edition}</dt><dd>{certification.edition}</dd></div>}
                    <div><dt>{text.date}</dt><dd>{certification.date?.trim() || text.missingDate}</dd></div>
                  </dl>
                  {certification.note && <p className="profile-cert-note">{localize(certification.note, locale)}</p>}
                  <div className="profile-cert-actions">
                    {evidence && <a href={evidence} target="_blank" rel="noopener noreferrer">{isBadge ? text.viewBadge : text.viewEvidence}<ArrowUpRight size={16} aria-hidden="true" /></a>}
                    {url ? <a href={url} target="_blank" rel="noopener noreferrer">{text.verify}<ArrowUpRight size={16} aria-hidden="true" /></a> : <span className="profile-pending-note">{text.unavailable}</span>}
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
        {trainings.length > 0 && (
          <div className="profile-trainings" aria-labelledby="training-title">
            <div className="profile-training-heading">
              <h3 id="training-title">{text.trainingTitle}</h3>
              <p>{text.trainingDescription}</p>
            </div>
            <div className="profile-training-grid">
              {trainings.map((training, index) => {
                const url = safeHref(training.url)
                return (
                  <Reveal key={training.id} className="profile-training-card" delay={(index % 3) * 0.05}>
                    <div className="profile-training-top"><BookOpen size={22} strokeWidth={1.5} aria-hidden="true" /><span className="evidence-label">{text.trainingLabel}</span></div>
                    <p className="profile-training-issuer">{training.issuer}</p>
                    <h4>{training.name}</h4>
                    <p className="profile-training-note">{localize(training.note, locale)}</p>
                    {url && <a href={url} target="_blank" rel="noopener noreferrer">{text.trainingLink}<ArrowUpRight size={15} aria-hidden="true" /></a>}
                  </Reveal>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
