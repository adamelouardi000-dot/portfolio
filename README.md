# Adam ELOUARDI — Portfolio cybersécurité

Portfolio personnel bilingue français / anglais, développé avec React, TypeScript, Vite, Tailwind CSS, Motion et Lucide React. Il présente Adam ELOUARDI, étudiant en cinquième année à l’EMSI Rabat, spécialisé en cybersécurité et infrastructures réseaux, à la recherche d’un stage PFE 2027.

Le site existant a été personnalisé à partir du CV, du rapport PFA et des dépôts publics consultés. Le CV et son portrait sont intégrés ; email, GitHub et LinkedIn sont configurés. Les informations encore incomplètes restent signalées. Le site fonctionne sans compte, base de données ni backend.

Consulter [PERSONALISATION.md](PERSONALISATION.md) pour l’audit avant/après, les données restantes et les champs exacts à modifier. Aucun déploiement ni dépôt GitHub distant n’a été créé.

## Lancer dans VS Code

Prérequis : Node.js 24 avec npm et Visual Studio Code.

1. Ouvrir `C:\Users\HP\Desktop\portfolio` avec **Fichier > Ouvrir le dossier**.
2. Ouvrir **Terminal > Nouveau terminal**, à la racine du projet où se trouve `package.json`.
3. Lancer :

   ```powershell
   npm run dev
   ```

4. Ouvrir l’URL affichée par Vite, généralement `http://localhost:5173`. Le port peut changer s’il est occupé.
5. Enregistrer les modifications pour actualiser la page. Garder le terminal ouvert ; arrêter avec `Ctrl+C`.

Les dépendances sont déjà installées dans ce workspace. Pour une nouvelle installation à partir du verrou livré :

```powershell
npm ci
npm run dev
```

Conserver `package-lock.json` pour fixer les versions. Si PowerShell bloque `npm.ps1`, utiliser `npm.cmd ci` et `npm.cmd run dev`, ou un terminal « Invite de commandes ». Aucune modification globale de la politique PowerShell n’est nécessaire.

Si une installation échoue avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE` alors qu’un certificat de l’antivirus/proxy est déjà approuvé par Windows, Node.js 24 peut utiliser les certificats système pour la session PowerShell :

```powershell
$env:NODE_USE_SYSTEM_CA = '1'
npm.cmd ci --prefer-offline
```

Cette option conserve la vérification TLS et suppose un émetteur réellement approuvé sur la machine.

## Commandes et vérification

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de développement et rechargement automatique. |
| `npm run lint` | Analyse ESLint. |
| `npm test` | Tests Vitest, jsdom et Testing Library. |
| `npm run build` | Vérification TypeScript et production dans `dist/`. |
| `npm run preview` | Prévisualisation de `dist/`, après un build. |

Contrôles exécutés après les améliorations visuelles : **lint réussi, 44 tests réussis dans huit fichiers et build de production réussi**. Aucune dépendance n’a été ajoutée ni modifiée pour ces améliorations.

La prévisualisation a répondu HTTP 200 pour la page, le CV, le portrait, les deux figures PFA, le favicon, `robots.txt` et les assets compilés. Le PDF est servi avec le type `application/pdf` et son empreinte correspond à l’original fourni. Le nom et les liens professionnels du JSON-LD ont également été contrôlés.

Après une modification, relancer :

```powershell
npm run lint
npm test
npm run build
npm run preview
```

La prévisualisation est configurée sur `http://localhost:5174` dans `vite.config.ts`. Une recette visuelle sur ordinateur et mobile reste à faire : aucun navigateur n’était disponible dans l’environnement d’automatisation. Les tests DOM ne valident pas à eux seuls le rendu, les recadrages, les contrastes ou les animations.

Contrôler également la navigation au clavier, les filtres, les fiches, le menu mobile, le téléchargement du CV, les liens, le formulaire, FR/EN et la préférence de mouvement réduit. Le formulaire ouvre un brouillon dans la messagerie du visiteur ; l’envoi reste manuel.

Les notes locales `artifacts/documents/verified-facts.md` et `artifacts/documents/github-facts.md` distinguent les faits issus des sources et leurs limites. Les scans du PFA et le code des projets externes n’ont pas été réexécutés pour personnaliser le portfolio. Ces résultats de projets sont distincts des tests du site.

## Où modifier les informations

| Fichier | Contenu |
| --- | --- |
| `src/data/profile.ts` | Identité, formation, PFE, présentation/contact, liens, CV, photo, URL publique ; `skillCategories`, `timeline`, `trainings`, `certifications`. |
| `src/data/projects.ts` | Fiches, catégories, contributions, sources, résultats, limites, captures et dépôts. |
| `src/data/types.ts` | Structures TypeScript et champs bilingues. |
| `src/data/portfolio.ts` | Réexports communs. |
| `public/assets/` | CV, portrait et figures PFA servis par le site. |

Les données personnelles sont centralisées dans `src/data/`. Les libellés d’interface se trouvent dans les sections et composants qui les affichent. Mettre à jour ensemble les variantes `{ fr: '…', en: '…' }`. Le choix de langue est conservé localement lorsque le navigateur le permet.

Coordonnées et ressources configurées :

- `profile.email` : `adamelouardi000@gmail.com`.
- `profile.github` : `https://github.com/adamelouardi000-dot`.
- `profile.linkedin` : `https://www.linkedin.com/in/adam-elouardi-007936375/`.
- `profile.cv` : `/assets/adam-elouardi-cv.pdf`.
- `profile.photo` : `/assets/adam-elouardi-portrait.jpg`.

`profile.siteUrl` reste à `null` en attendant l’URL de publication. Pour une ressource absente, conserver `null` ou omettre le champ facultatif, plutôt qu’utiliser une URL fictive ou `#`.

### CV, portrait et captures

Le PDF livré est une copie non modifiée du CV fourni. Pour une nouvelle version, remplacer `public/assets/adam-elouardi-cv.pdf` ; si le nom change, modifier `profile.cv`.

Le portrait a été extrait du CV sans retouche. Sa résolution de **158 × 216 pixels** convient à un petit affichage ; une photo originale plus grande améliorera la netteté. Remplacer `public/assets/adam-elouardi-portrait.jpg`, ou modifier `profile.photo`. Aucun visage artificiel n’a été généré.

Deux figures du rapport PFA sont intégrées : `pfa-trivy-comparison.png` et `pfa-dockerhub-v1.png`. Le rapport complet n’est pas publié dans `public/`.

Pour ajouter une capture réelle à une fiche :

```ts
screenshots: [
  {
    src: '/assets/nom-de-la-capture.webp',
    alt: {
      fr: 'Description précise de la capture réelle',
      en: 'Accurate description of the actual screenshot',
    },
  },
],
```

Ce nom est un exemple. Les ressources de `public/` sont servies depuis `/`, sans préfixe `/public`. Respecter la casse, préférer des noms sans espaces et optimiser les images. Tout fichier placé dans `public/` sera public après déploiement. Ne pas y ajouter de code, capture ou document interne du stage confidentiel.

### Projets et preuves

Les **13 fiches** actuelles utilisent trois statuts :

- `draft` : sujet à documenter ; RSA et le laboratoire HTTPS/TLS restent provisoires.
- `listed` : mention issue du CV, dont le périmètre personnel et les résultats détaillés restent à compléter.
- `documented` : rapport ou dépôt consulté ; sans présumer une réexécution, un résultat certifié indépendamment ou une application finalisée.

Le PFA DevSecOps, DentalTech et le notebook de classification énergétique disposent de sources détaillées. Les autres fiches couvrent le stage SEPRET, la supervision réseau, Zabbix, Linux, le VPN, la sécurité Web, le restaurant, RSA, HTTPS/TLS et Kasbah de Crise.

Le type `Project` accepte `role`, `period`, `evidence` et `limitations`, en plus des objectifs, méthode, résultats, technologies, captures et lien `github`. Les filtres couvrent DevSecOps, développement/données, cryptographie, réseau, risques/crise et laboratoires. `kind` distingue étude académique, stage, dépôt, simulation et laboratoire.

Précisions à préserver :

- **PFA** : réalisé en binôme ; le rapport consigne Trivy HIGH/CRITICAL **66 → 10**, avec dix vulnérabilités restantes. Le contrôle Django était effectué en mode durci **simulé**, et le CI/CD automatisé n’était pas intégré à la date du rapport. Harmoniser le CV, qui mentionne GitHub Actions, ou fournir la preuve d’une évolution ultérieure.
- **Stage SEPRET / app33** : dépôt confidentiel, avec `repositoryVisibility: 'confidential'` et `github: null`. Aucun lien interne, code ou capture interne à publier.
- **DentalTech** : projet collectif, contribution individuelle à préciser. Le service d’autorisation est incomplet : ne pas annoncer un RBAC finalisé.
- **Classification énergétique** : projet de données complémentaire. Le dataset manque au dépôt ; aucun score ni reproductibilité complète n’est revendiqué.
- **Kasbah de Crise** : événement/simulation ; date, rôle et justificatif à compléter, sans transformation en projet logiciel.

### Compétences, formations et certifications

Chaque catégorie de compétences peut comporter `basis: 'interest' | 'cv' | 'project'` et une note bilingue `evidence`, pour distinguer intérêt, connaissance déclarée et pratique documentée. Aucun pourcentage ni niveau de maîtrise n’est inventé.

Les formations Oracle OCI Security et The Unix Workbench figurent dans `trainings` avec leurs réserves. Elles ne sont pas présentées comme des certifications obtenues et vérifiées. Leurs intitulés exacts, dates, statuts de validation et justificatifs restent à compléter.

Le tableau `certifications` contient le badge fourni **Oracle Cloud Infrastructure Architect — Associate**, édition **2026**. Il est identifié comme « Badge fourni » : l’image ne donne pas de date d’obtention ni de lien de vérification, qui restent absents. L’année de l’édition n’est pas une date d’obtention. Le lien « Voir le badge » ouvre la copie originale de l’image dans `public/assets/`.

Ce badge Architect est distinct de la mention de formation « OCI Security » du CV. Pour compléter une entrée, utiliser `date` uniquement pour une vraie date d’obtention, `edition` pour l’édition du parcours, `verificationUrl` pour une vérification officielle, `evidenceUrl` pour un justificatif public, et `note` pour les précisions FR/EN. `kind: 'badge'` distingue un badge fourni d’une certification renseignée. Aucun statut de vérification indépendante n’est présumé.

## Interactions

- **Contact** : validation, puis brouillon `mailto:` vers l’email configuré. Un logiciel de messagerie est nécessaire ; le visiteur vérifie et envoie le message. Aucun succès d’envoi n’est simulé.
- **Terminal** : simulation locale, avec `help`, `whoami`, `skills`, `projects`, `certifications`, `contact`, `clear`. Aucune commande système, évaluation de code ou transmission à un serveur.
- **Projets** : filtres et détails avec sources, limites et état documentaire.
- **Liens** : URL absentes ou non autorisées rendues indisponibles.
- **Accessibilité** : clavier, focus visible, textes alternatifs, validation et respect de `prefers-reduced-motion`.

Un éventuel service d’envoi nécessitera une intégration réelle et la gestion de ses erreurs. Ne jamais placer de clé privée dans React ni dans une variable `VITE_*`, qui est exposée au navigateur.

## Architecture

```text
public/assets/           # CV, portrait et figures PFA publics
src/
  assets/                # Ressources importées par le code
  components/            # Navigation et composants réutilisables
  sections/              # Hero, profil, projets, parcours, terminal, contact…
  data/                  # Données personnelles et projets bilingues
  hooks/                 # Comportements réutilisables
  lib/                   # Validation, liens et terminal local
  styles/                # Styles et responsive
  App.tsx                # Assemblage
  main.tsx               # Entrée React
index.html               # Modèle des métadonnées
vite.config.ts           # Vite et génération SEO
netlify.toml             # Configuration Netlify
vercel.json              # Configuration Vercel
PERSONALISATION.md        # Audit et données à compléter
```

Une seule page avec ancres, sans React Router. Les animations Motion et CSS sont décoratives et le contenu reste consultable lorsque les mouvements sont réduits.

## Décor et animations

L’accueil associe une scène de circuits, des halos et une grille en perspective à un hologramme AE en plusieurs plans. Sur ordinateur avec un pointeur fin, le déplacement du curseur déplace légèrement les plans et dirige les reflets des cartes. Le survol du nom et son focus clavier déclenchent une courte onde de lettres, un balayage et un tracé de circuits ; le nom reste toujours lisible. Les titres et cartes apparaissent progressivement au défilement.

Le bouton **Animations** en haut de l’accueil permet de mettre les effets en pause. Le choix est conservé localement sous la clé `portfolio-visual-effects`. La préférence système `prefers-reduced-motion` est prioritaire et affiche **Effets calmes**. Les animations de fond sont suspendues lorsque l’accueil sort de l’écran ou lorsque l’onglet est masqué. Le suivi du curseur est désactivé sur les appareils tactiles.

| Fichier | Personnalisation visuelle |
| --- | --- |
| `src/styles/visual-experience.css` | Décor d’accueil, reflets des cartes, boutons et détails des sections. |
| `src/components/CyberBackdrop.tsx` | Circuits SVG de l’arrière-plan. |
| `src/components/SecurityOrbit.tsx` et `src/styles/hologram.css` | Hologramme et orbites. |
| `src/components/InteractiveName.tsx` et `src/styles/name-signature.css` | Signature interactive du nom. |
| `src/components/VisualEffectsProvider.tsx` | Pause persistante et préférence de mouvement réduit. |
| `src/hooks/usePointerLighting.ts` et `src/hooks/useSceneVisibility.ts` | Éclairage au pointeur et suspension du décor hors écran. |

Pour la recette visuelle : déplacer le curseur dans l’accueil et sur les cartes, survoler le nom puis lui donner le focus avec Tab, activer la pause, recharger, et tester la préférence de mouvement réduit du système. Vérifier également les mises en page à 320, 768 et 1440 pixels. Les effets utilisent SVG/CSS et les dépendances déjà présentes.

## Préparation à la mise en ligne

### GitHub Pages

Le dépôt `adamelouardi000-dot/portfolio` est configuré pour `https://adamelouardi000-dot.github.io/portfolio/`. Vite utilise `base: '/portfolio/'` ; les fichiers publics sont résolus à l’affichage avec `import.meta.env.BASE_URL`, tandis que les chemins renseignés dans les données restent `/assets/...`.

Le workflow `.github/workflows/deploy.yml`, basé sur le [guide officiel Vite](https://vite.dev/guide/static-deploy#github-pages), utilise Node.js 24, `npm ci`, `npm run build`, puis publie `dist`. Il se déclenche sur un push vers `main` ou manuellement avec `workflow_dispatch`. Dans **Settings → Pages → Build and deployment → Source**, sélectionner **GitHub Actions** avant le premier déploiement.

Pour tester localement la version compilée : `npm run build`, puis `npm run preview` et ouvrir `http://localhost:5174/portfolio/`. Aucun commit ni push n’est effectué par la préparation locale.

### Métadonnées et autres hébergeurs

Les métadonnées proviennent de `profile.ts`. Le plugin `portfolio-metadata` de `vite.config.ts` génère titre, description et JSON-LD `Person`. Garder les jetons `__PORTFOLIO_*__` de `index.html`. GitHub/LinkedIn alimentent `sameAs` ; `profile.siteUrl` activera l’URL canonique et `og:url` au prochain build. `Seo.tsx` actualise les métadonnées selon FR/EN.

Le contenu React est rendu côté client. Une image de partage ou un prérendu pourront être ajoutés ultérieurement avec des ressources réelles.

Les configurations sont prêtes pour **Node.js 24**, `npm run build` et la sortie `dist` :

| Hébergeur | Configuration prévue |
| --- | --- |
| Vercel | Framework Vite, racine du projet, installation `npm ci`, build `npm run build`, sortie `dist`, réglages dans `vercel.json`. |
| Netlify | Racine du projet, build `npm run build`, sortie `dist`, version Node dans `netlify.toml`. |

Les fichiers Netlify et Vercel ne déclenchent aucun déploiement par eux-mêmes. La configuration Vite actuelle cible le sous-chemin `/portfolio/` ; adapter `base` si un autre hébergeur sert le site à la racine. Aucun dépôt distant n’est requis pour consulter le site localement. Avant la publication, renseigner `profile.siteUrl`, harmoniser le CV avec le rapport PFA et effectuer les contrôles ci-dessus.
