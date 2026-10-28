import { certifications, profile, projects, skillCategories } from '../data/portfolio'
import { localize, type Locale } from '../data/types'

export const terminalCommands = [
  'help',
  'whoami',
  'skills',
  'projects',
  'certifications',
  'contact',
  'clear',
] as const

export type TerminalCommand = (typeof terminalCommands)[number]
export type TerminalResponse = {
  kind: 'output' | 'error' | 'clear'
  lines: string[]
}

export const terminalCommandDescriptions: Record<TerminalCommand, { fr: string; en: string }> = {
  help: { fr: 'Afficher les commandes disponibles', en: 'Show available commands' },
  whoami: { fr: 'Découvrir mon profil', en: 'Discover my profile' },
  skills: { fr: 'Explorer mes domaines d’intérêt', en: 'Explore my areas of interest' },
  projects: { fr: 'Parcourir les projets', en: 'Browse projects' },
  certifications: { fr: 'Consulter les certifications', en: 'View certifications' },
  contact: { fr: 'Trouver mes coordonnées', en: 'Find my contact details' },
  clear: { fr: 'Effacer le terminal', en: 'Clear the terminal' },
}

/** Exact allowlist only: input is never evaluated or passed to a shell. */
export function getTerminalResponse(input: string, locale: Locale): TerminalResponse {
  const command = input.trim().toLowerCase()
  const fr = locale === 'fr'

  if (!terminalCommands.some((allowed) => allowed === command)) {
    return {
      kind: 'error',
      lines: [fr
        ? 'Commande inconnue. Tapez help pour consulter les commandes disponibles.'
        : 'Unknown command. Type help to see the available commands.'],
    }
  }

  switch (command as TerminalCommand) {
    case 'help':
      return {
        kind: 'output',
        lines: terminalCommands.map((item) => `${item.padEnd(16)} ${localize(terminalCommandDescriptions[item], locale)}`),
      }
    case 'whoami':
      return {
        kind: 'output',
        lines: [profile.name, localize(profile.role, locale), localize(profile.bio, locale), localize(profile.availability, locale)],
      }
    case 'skills':
      return {
        kind: 'output',
        lines: [
          fr ? 'Domaines techniques · sources et pratique indiquées, sans niveau chiffré' : 'Technical areas · sources and practice indicated, without proficiency scores',
          ...skillCategories.map((category) => `${localize(category.title, locale)} → ${category.topics.length ? category.topics.join(', ') : (fr ? 'À documenter' : 'To document')}${category.evidence ? `\n  ${localize(category.evidence, locale)}` : ''}`),
        ],
      }
    case 'projects':
      return {
        kind: 'output',
        lines: projects.length > 0
          ? projects.map((project) => `${localize(project.title, locale)}${project.status === 'draft' ? (fr ? ' [À documenter]' : ' [To document]') : project.status === 'listed' ? (fr ? ' [Mention au CV]' : ' [CV-listed]') : ''}${project.repositoryVisibility === 'confidential' ? (fr ? ' [Dépôt confidentiel]' : ' [Confidential repository]') : ''}`)
          : [fr ? 'Les projets seront ajoutés ici.' : 'Projects will be added here.'],
      }
    case 'certifications':
      return {
        kind: 'output',
        lines: certifications.length > 0
          ? certifications.map((certificate) => [
            certificate.name,
            certificate.issuer,
            certificate.kind === 'badge' ? (fr ? 'Badge fourni' : 'Supplied badge') : (fr ? 'Certification renseignée' : 'Listed certification'),
            ...(certificate.edition ? [`${fr ? 'Édition' : 'Edition'} ${certificate.edition}`] : []),
            certificate.date ?? (fr ? 'Date d’obtention à préciser' : 'Date earned to be added'),
          ].join(' · '))
          : [fr ? 'Aucune certification renseignée pour le moment.' : 'No certifications have been added yet.'],
      }
    case 'contact':
      return {
        kind: 'output',
        lines: [
          `Email    ${profile.email ?? (fr ? 'À renseigner' : 'To be added')}`,
          `GitHub   ${profile.github ?? (fr ? 'À renseigner' : 'To be added')}`,
          `LinkedIn ${profile.linkedin ?? (fr ? 'À renseigner' : 'To be added')}`,
          fr ? 'Retrouvez le formulaire dans la section Contact.' : 'Find the contact form in the Contact section.',
        ],
      }
    case 'clear':
      return { kind: 'clear', lines: [] }
  }
}
