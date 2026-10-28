import type { Certification, SkillCategory, TimelineItem, Training } from './types.ts'

/**
 * Source unique des informations personnelles.
 * Remplacer les valeurs null uniquement par des liens et fichiers réels.
 * Les centres d'intérêt ci-dessous ne constituent pas des niveaux de maîtrise.
 */
export const profile = {
  name: 'Adam ELOUARDI',
  firstName: 'Adam',
  lastName: 'ELOUARDI',
  internshipYear: '2027',
  schoolShort: 'EMSI',
  educationLevel: { fr: '5e année', en: 'Year 5' },
  campus: 'Rabat',
  educationLabel: { fr: 'Cycle ingénieur', en: 'Engineering' },
  discipline: { fr: 'Cybersécurité & infrastructures réseaux', en: 'Cybersecurity & network infrastructure' },
  heroDescription: {
    fr: 'Étudiant ingénieur en 5e année à l’EMSI Rabat, spécialisé en cybersécurité et infrastructures réseaux. Mes stages et mon PFA DevSecOps relient sécurité applicative, Linux et conteneurisation. Je recherche un stage PFE en 2027.',
    en: 'Fifth-year engineering student at EMSI Rabat, specializing in cybersecurity and network infrastructure. My internships and DevSecOps project connect application security, Linux and containerization. Seeking a final-year internship in 2027.',
  },
  role: {
    fr: 'Étudiant ingénieur en cybersécurité',
    en: 'Cybersecurity Engineering Student',
  },
  availability: {
    fr: 'À la recherche d’un stage PFE 2027',
    en: 'Seeking a final-year internship in 2027',
  },
  bio: {
    fr: 'Étudiant en 5e année du cycle ingénieur à l’EMSI Rabat, je me spécialise en cybersécurité et infrastructures réseaux. Mes stages chez SEPRET et DXC Technology m’ont amené à travailler sur le durcissement applicatif, le contrôle d’accès et l’administration Linux.\n\nMon PFA, réalisé en binôme, porte sur la sécurisation de la chaîne de conteneurisation d’une application Django : Docker, scans du code et des dépendances, recherche de secrets et analyse des images. Cette démarche progressive — comprendre, tester, corriger et documenter — guide ma recherche d’un PFE 2027 en cybersécurité, SOC, défense réseau ou sécurité des infrastructures.',
    en: 'I am a fifth-year engineering student at EMSI Rabat, specializing in cybersecurity and network infrastructure. My internships at SEPRET and DXC Technology involved application hardening, access control and Linux administration.\n\nMy end-of-year engineering project (PFA), completed in a team of two, focuses on securing the containerization chain of a Django application: Docker, code and dependency scans, secret detection and image analysis. This iterative approach — understand, test, improve and document — guides my search for a 2027 final-year internship in cybersecurity, SOC, network defense or infrastructure security.',
  },
  contactLead: {
    fr: 'Un PFE pour contribuer à la sécurité de vos applications et infrastructures.',
    en: 'A final-year internship contributing to the security of your applications and infrastructure.',
  },
  contactDescription: {
    fr: 'Je recherche un stage PFE en cybersécurité pour 2027. Échangeons sur vos besoins en sécurité applicative, SOC, défense réseau ou DevSecOps, et sur la manière dont mes expériences et projets peuvent y contribuer.',
    en: 'I am seeking a cybersecurity final-year internship for 2027. Let’s discuss your needs in application security, SOC, network defense or DevSecOps, and how my experience and projects could contribute.',
  },
  email: 'adamelouardi000@gmail.com' as string | null,
  github: 'https://github.com/adamelouardi000-dot' as string | null,
  linkedin: 'https://www.linkedin.com/in/adam-elouardi-007936375/' as string | null,
  cv: '/assets/adam-elouardi-cv.pdf' as string | null,
  photo: '/assets/adam-elouardi-portrait.jpg' as string | null,
  siteUrl: 'https://adamelouardi000-dot.github.io/portfolio/',
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'offensive',
    title: { fr: 'Offensive Security', en: 'Offensive Security' },
    description: {
      fr: 'Comprendre les vulnérabilités et les approches d’audit autorisé.',
      en: 'Understanding vulnerabilities and approaches to authorized security assessments.',
    },
    topics: ['Pentesting', 'SQLi / XSS', 'API security'],
    basis: 'cv',
    evidence: { fr: 'CV : tests d’intrusion, SQLi, XSS et sécurité des API ; pratique à détailler.', en: 'CV: penetration testing, SQLi, XSS and API security; practical evidence to expand.' },
  },
  {
    id: 'defensive',
    title: { fr: 'Defensive Security', en: 'Defensive Security' },
    description: {
      fr: 'Explorer la détection, la surveillance et la réponse aux incidents.',
      en: 'Exploring detection, monitoring, and incident response.',
    },
    topics: ['Hardening', 'RBAC', 'Firestore rules', 'SOC / Blue Team'],
    basis: 'cv',
    evidence: { fr: 'CV : audit et durcissement en stage ; SOC et Blue Team restent des axes d’intérêt.', en: 'CV: security assessment and hardening during internships; SOC and Blue Team remain areas of interest.' },
  },
  {
    id: 'grc',
    title: { fr: 'Risk Management & GRC', en: 'Risk Management & GRC' },
    description: {
      fr: 'Relier les enjeux techniques à la gouvernance et à l’analyse des risques.',
      en: 'Connecting technical challenges with governance and risk analysis.',
    },
    topics: ['GRC', 'Risk Analysis', 'Governance'],
    basis: 'cv',
    evidence: { fr: 'CV : simulation Kasbah de Crise, analyse des risques et gestion de crise.', en: 'CV: Kasbah de Crise simulation, risk analysis and crisis management.' },
  },
  {
    id: 'network',
    title: { fr: 'Network Security', en: 'Network Security' },
    description: {
      fr: 'S’intéresser aux protocoles et à la protection des échanges réseau.',
      en: 'Investigating protocols and the protection of network communications.',
    },
    topics: ['TCP/IP', 'SSL / TLS', 'VPN', 'Linux / SSH'],
    basis: 'cv',
    evidence: { fr: 'CV : projets de VPN, supervision et administration Linux ; stage DXC Technology.', en: 'CV: VPN, monitoring and Linux administration projects; DXC Technology internship.' },
  },
  {
    id: 'cryptography',
    title: { fr: 'Cryptography', en: 'Cryptography' },
    description: {
      fr: 'Comprendre les mécanismes cryptographiques et leurs limites.',
      en: 'Understanding cryptographic mechanisms and their limitations.',
    },
    topics: ['Cryptography', 'Cryptanalysis', 'RSA'],
    basis: 'interest',
    evidence: { fr: 'Cryptographie mentionnée au CV ; étude RSA Fermat/Pollard Rho encore à documenter.', en: 'Cryptography listed in the CV; RSA Fermat/Pollard Rho study still needs supporting material.' },
  },
  {
    id: 'cloud',
    title: { fr: 'Cloud & DevSecOps', en: 'Cloud & DevSecOps' },
    description: {
      fr: 'Sécuriser progressivement une chaîne de conteneurisation et ses contrôles.',
      en: 'Incrementally securing a containerization chain and its security checks.',
    },
    topics: ['Docker', 'Docker Compose', 'Django', 'PostgreSQL', 'Trivy'],
    basis: 'project',
    evidence: { fr: 'Rapport PFA : conteneurisation, durcissement non-root et scans locaux. CI/CD complet en perspective.', en: 'PFA report: containerization, non-root hardening and local scans. Full CI/CD remains future work.' },
  },
  {
    id: 'programming',
    title: { fr: 'Programming & Scripting', en: 'Programming & Scripting' },
    description: {
      fr: 'Développement applicatif et scripts au service des systèmes et de la sécurité.',
      en: 'Application development and scripting supporting systems and security work.',
    },
    topics: ['Python', 'JavaScript', 'Java', 'PHP', 'React', 'Django'],
    basis: 'cv',
    evidence: { fr: 'Langages et frameworks déclarés au CV ; Python/Django documentés dans le PFA.', en: 'Languages and frameworks listed in the CV; Python/Django documented in the PFA.' },
  },
  {
    id: 'tools',
    title: { fr: 'Security Tools', en: 'Security Tools' },
    description: {
      fr: 'Choisir des contrôles complémentaires et conserver leurs résultats.',
      en: 'Selecting complementary security checks and recording their results.',
    },
    topics: ['Trivy', 'pip-audit', 'Bandit', 'Gitleaks', 'Wireshark', 'Nmap'],
    basis: 'project',
    evidence: { fr: 'PFA : Trivy, pip-audit, Bandit et Gitleaks. Wireshark et Nmap sont déclarés au CV.', en: 'PFA: Trivy, pip-audit, Bandit and Gitleaks. Wireshark and Nmap are listed in the CV.' },
  },
]

export const timeline: TimelineItem[] = [
  {
    id: 'emsi',
    kind: 'education',
    period: { fr: '2024–2027 · 5e année en cours', en: '2024–2027 · Currently in year 5' },
    title: { fr: 'Cycle ingénieur · Informatique, cybersécurité & infrastructures réseaux', en: 'Engineering degree program · Computing, cybersecurity & network infrastructure' },
    organization: 'École Marocaine des Sciences de l’Ingénieur — EMSI Rabat',
    description: {
      fr: 'Spécialité Cybersécurité et Infrastructures Réseaux. Le PFA 2025–2026 porte sur la sécurisation d’une chaîne de conteneurisation Django/Docker.',
      en: 'Specializing in Cybersecurity and Network Infrastructure. The 2025–2026 PFA focuses on securing a Django/Docker containerization chain.',
    },
  },
  {
    id: 'sepret',
    kind: 'experience',
    period: { fr: 'Été 2026 · 8 semaines · Rabat', en: 'Summer 2026 · 8 weeks · Rabat' },
    title: { fr: 'Stage cybersécurité / DevSecOps', en: 'Cybersecurity / DevSecOps internship' },
    organization: 'SEPRET',
    description: {
      fr: 'Selon le CV : audit et durcissement d’une application aéronautique React ; Firebase Authentication, RBAC Admin/Pilote et règles Firestore ; Docker, Nginx et Trivy.',
      en: 'As described in the CV: assessment and hardening of a React aviation application; Firebase Authentication, Admin/Pilot RBAC and Firestore rules; Docker, Nginx and Trivy.',
    },
  },
  {
    id: 'dxc', kind: 'experience',
    period: { fr: 'Été 2025 · 6 semaines · Hybride', en: 'Summer 2025 · 6 weeks · Hybrid' },
    title: { fr: 'Stage DevOps', en: 'DevOps internship' },
    organization: 'DXC Technology',
    description: { fr: 'Selon le CV : administration et sécurisation Linux, SSH, Apache et gestion des accès ; évaluation des vulnérabilités Web ; automatisation avec Git et pipelines CI/CD.', en: 'As described in the CV: Linux administration and hardening, SSH, Apache and access management; web vulnerability assessment; automation using Git and CI/CD pipelines.' },
  },
  {
    id: 'prepa', kind: 'education',
    period: { fr: '2022–2024', en: '2022–2024' },
    title: { fr: 'Classes préparatoires intégrées', en: 'Integrated preparatory program' },
    organization: 'EMSI Rabat',
    description: { fr: 'Formation préparatoire précédant le cycle ingénieur, indiquée dans le CV.', en: 'Preparatory education preceding the engineering degree program, as listed in the CV.' },
  },
  {
    id: 'events',
    kind: 'event',
    period: { fr: 'Date à préciser', en: 'Date to be added' },
    title: { fr: 'Kasbah de Crise · simulation cyber', en: 'Kasbah de Crise · cyber crisis simulation' },
    organization: 'EMSI · CyberSup Paris',
    description: {
      fr: 'Simulation et formation mentionnées au CV : analyse des risques, impacts et réponse à une crise cyber. Date, rôle personnel et justificatif restent à préciser.',
      en: 'Simulation and training listed in the CV: risk analysis, impact assessment and cyber crisis response. Date, individual role and supporting material remain to be added.',
    },
    placeholder: true,
  },
]

/** Les badges fournis sont distingués des certifications avec date et vérification. */
export const certifications: Certification[] = [
  {
    id: 'oci-architect-associate-2026',
    name: 'Oracle Cloud Infrastructure Architect — Associate',
    issuer: 'Oracle',
    kind: 'badge',
    edition: '2026',
    logo: '/assets/oracle-oci-architect-associate-2026.jpg',
    evidenceUrl: '/assets/oracle-oci-architect-associate-2026.jpg',
    note: {
      fr: 'Badge fourni. L’année 2026 désigne l’édition affichée ; la date d’obtention et le lien de vérification restent à ajouter.',
      en: 'Supplied badge. The year 2026 identifies the displayed edition; the date earned and verification link still need to be added.',
    },
  },
]

/** Le CV regroupe formations et certifications : aucun titre obtenu n’est présumé. */
export const trainings: Training[] = [
  { id: 'oci-security', name: 'Oracle Cloud Infrastructure (OCI) Security', issuer: 'Oracle', note: { fr: 'Mention au CV. Intitulé exact du parcours, date et justificatif à ajouter.', en: 'Listed in the CV. Exact course title, date and supporting credential to be added.' } },
  { id: 'unix-workbench', name: 'The Unix Workbench', issuer: 'Johns Hopkins University', note: { fr: 'Mention au CV. Date, statut de validation et justificatif à ajouter.', en: 'Listed in the CV. Date, completion status and supporting credential to be added.' } },
]
