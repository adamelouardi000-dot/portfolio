export type Locale = 'fr' | 'en'
export type Localized = { fr: string; en: string }
export const localize = (value: Localized, locale: Locale): string => value[locale]

export interface SkillCategory {
  id: string
  title: Localized
  description: Localized
  topics: string[]
  basis?: 'interest' | 'cv' | 'project'
  evidence?: Localized
}

export interface TimelineItem {
  id: string
  kind: 'education' | 'experience' | 'event'
  period: Localized
  title: Localized
  organization: string
  description: Localized
  placeholder?: boolean
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date?: string
  verificationUrl?: string
  logo?: string
  kind?: 'certification' | 'badge'
  edition?: string
  evidenceUrl?: string
  note?: Localized
}

export interface Training {
  id: string
  name: string
  issuer: string
  note: Localized
  url?: string
}

export type ProjectCategory = 'devsecops' | 'development' | 'cryptography' | 'network' | 'grc' | 'lab'
export interface Project {
  id: string
  title: Localized
  category: ProjectCategory
  kind: 'academic' | 'simulation' | 'lab' | 'internship' | 'repository'
  summary: Localized
  objectives: Localized[]
  technologies: string[]
  methodology: Localized[]
  results: Localized
  screenshots: { src: string; alt: Localized }[]
  github: string | null
  status: 'draft' | 'listed' | 'documented'
  repositoryVisibility?: 'public' | 'confidential'
  evidence?: Localized
  role?: Localized
  period?: Localized
  limitations?: Localized[]
}
