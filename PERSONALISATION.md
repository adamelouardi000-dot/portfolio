# Personnalisation finale — Adam ELOUARDI

Le portfolio existant a été conservé et enrichi à partir du CV, du rapport PFA et des deux dépôts GitHub publics consultés. Aucun site n’a été déployé et aucun dépôt GitHub distant n’a été créé.

## Audit avant / après

| Point | Avant | Maintenant |
| --- | --- | --- |
| Présentation | Profil général d’étudiant et PFE 2027. | Nom, cinquième année EMSI Rabat, cybersécurité et infrastructures réseaux, PFE 2027 ; présentation FR/EN fondée sur le parcours réel. |
| CV | Bouton indisponible. | PDF original intégré, accessible depuis l’accueil et le contact. |
| Photo | Emplacement vide. | Portrait réel extrait du CV, sans retouche ; petite résolution de 158 × 216 pixels. |
| Contact | Email et réseaux absents. | Email, GitHub et LinkedIn réels configurés ; formulaire ouvrant un brouillon email. |
| Compétences | Intérêts et catégories de langages/outils vides. | Connaissances du CV et outils du PFA, avec source et sans niveau inventé. |
| Parcours | Stages et périodes manquants. | Stages SEPRET et DXC Technology, cycle ingénieur et prépa renseignés selon le CV. |
| Projets | Fiches provisoires sans source détaillée. | Treize fiches, filtres conservés, projets du CV et deux dépôts publics ajoutés avec statuts explicites. |
| PFA | Absent. | Travail en binôme, démarche, résultats consignés, limites et deux figures du rapport. |
| app33 | Stage évoqué sans statut du dépôt. | Confidentialité confirmée et respectée : aucun lien interne ni code proposé. |
| Formations et badge | Grille vide. | Deux mentions de formation du CV et le badge Oracle Architect Associate édition 2026, clairement identifié comme badge fourni sans date ni vérification ajoutée. |
| Identité visuelle | Fond bleu nuit, accents cyan, animations. | Scène holographique AE, circuits animés, profondeur au pointeur, signature du nom et reflets des cartes ; pause persistante et mouvement réduit respectés. |

Les fonctions existantes restent présentes : FR/EN, navigation fixe et mobile, filtres et fiches, terminal local, formulaire validé, CV et liens configurables.

## Données déjà configurées

Dans `src/data/profile.ts` :

| Champ | Valeur actuelle |
| --- | --- |
| `profile.name` | Adam ELOUARDI |
| `profile.educationLevel` / `campus` | Cinquième année / Rabat |
| `profile.internshipYear` | 2027 |
| `profile.email` | `adamelouardi000@gmail.com` |
| `profile.github` | `https://github.com/adamelouardi000-dot` |
| `profile.linkedin` | `https://www.linkedin.com/in/adam-elouardi-007936375/` |
| `profile.cv` | `/assets/adam-elouardi-cv.pdf` |
| `profile.photo` | `/assets/adam-elouardi-portrait.jpg` |
| `profile.siteUrl` | `null`, en attente de l’URL de publication |

## Informations restant à ajouter

| Priorité | Information précise | Fichier et champs à modifier |
| --- | --- | --- |
| Avant candidatures | Début exact du PFE 2027, durée souhaitée, villes/pays de mobilité et modalités acceptées. | `src/data/profile.ts` : `profile.availability`, `heroDescription`, `contactDescription` et éventuellement `bio`, dans les variantes `fr` / `en`. |
| Avant candidatures | Tâches réalisées personnellement dans le PFA, répartition du binôme, difficultés et décisions. | `src/data/projects.ts`, fiche `id: 'pfa-devsecops'` : `role`, `methodology`, `results`. |
| Avant candidatures | Harmoniser la mention CI/CD/GitHub Actions du CV avec le rapport. Si une intégration a été faite depuis, fournir une preuve publique autorisée. | Remplacer `public/assets/adam-elouardi-cv.pdf` par le CV corrigé ; fiche `pfa-devsecops` : `methodology`, `limitations`, `evidence`, éventuellement `screenshots` ou `github` si un dépôt public existe. Conserver la limite actuelle sans nouvelle preuve. |
| Avant candidatures | Responsabilités et résultats personnels des stages ; dates exactes si disponibles. Les résultats peuvent être qualitatifs et vérifiables. | `src/data/profile.ts` : `timeline`, entrées `sepret` / `dxc`, champs `period`, `description` ; `src/data/projects.ts` : fiche `app33`, champs `role`, `methodology`, `results`, `limitations`. |
| À compléter | Supervision réseau, Zabbix et Linux : dates, environnement, contribution, méthode de validation et observations. | `src/data/projects.ts`, fiches `network-monitoring`, `zabbix`, `linux-server` : `period`, `role`, `objectives`, `technologies`, `methodology`, `results`, `screenshots` et, si public, `github`. |
| À compléter | VPN : topologie, produit/protocole exact, périmètre du laboratoire, configuration et validation. | Même fichier, fiche `site-to-site-vpn` : `summary`, `technologies`, `methodology`, `results`, `screenshots`, `role`. |
| À compléter | Sécurité Web : cadre autorisé, outils, scénarios, constats et corrections vérifiés. | Même fichier, fiche `web-security` : `technologies`, `methodology`, `results`, `limitations`, `screenshots`, `role`. |
| À compléter | Restaurant : technologies réelles, périmètre, travail personnel, fonctions et résultats. | Même fichier, fiche `restaurant` : `technologies`, `role`, `summary`, `methodology`, `results`, `screenshots`. |
| À compléter | DentalTech : contribution individuelle au travail collectif, captures publiques et validations exécutées. | Même fichier, fiche `dentaltech` : `role`, `methodology`, `results`, `limitations`, `screenshots`, `period`. Ne pas annoncer le RBAC incomplet comme finalisé. |
| À compléter | Classification énergétique : source/droit de diffusion du dataset, préparation reproductible et résultats recalculés si disponibles. | Même fichier, fiche `energy-ml` : `methodology`, `results`, `limitations`, `evidence`, `screenshots`, `role`. Aucun score à inventer. |
| À compléter | RSA et HTTPS/TLS : rapport ou code autorisé, environnement, protocole, observations et captures. | Même fichier, fiches `rsa` / `tls` : `objectives`, `methodology`, `results`, `screenshots`, `github`, `evidence`, `role`. Conserver `status: 'draft'` en attendant. |
| À compléter | Kasbah de Crise : date, rôle, scénario, décisions, enseignements et attestation ou source publique autorisée. | Même fichier, fiche `kasbah` : `period`, `role`, `objectives`, `methodology`, `results`, `evidence`, `screenshots` ; `src/data/profile.ts` : `timeline`, entrée `events`, `period`, `description`, puis retirer `placeholder` quand complété. |
| À compléter | Oracle OCI Security et The Unix Workbench : intitulé exact, type de parcours, date, statut de validation et justificatif. | `src/data/profile.ts` : `trainings`, champs `name`, `issuer`, `note`, `url`. Préciser dates/statuts dans les notes bilingues. |
| À compléter | Badge Oracle Architect Associate : date d’obtention et URL officielle de vérification. L’année 2026 correspond seulement à l’édition du badge. | `src/data/profile.ts`, tableau `certifications`, entrée `oci-architect-associate-2026` : `date`, `verificationUrl`, `note`. L’image fournie est déjà référencée dans `logo` et `evidenceUrl`. |
| À compléter | Autres certifications obtenues : titre exact, organisme, date et, si disponibles, URL de vérification et logo officiel. | Même fichier, tableau `certifications` : `id`, `name`, `issuer`, `date`, `verificationUrl`, `logo`, éventuellement `edition`, `evidenceUrl` et `note`. Ne renseigner que les informations réelles. |
| Facultatif | Portrait original plus grand pour un rendu plus net. | Remplacer `public/assets/adam-elouardi-portrait.jpg` ou modifier `profile.photo`. Aucun faux visage n’est nécessaire. |
| Avant mise en ligne | Domaine ou URL publique finale. | `src/data/profile.ts` : `profile.siteUrl`. Refaire le build pour générer la canonique et `og:url`. |

Pour les autres projets, ajouter uniquement des captures réelles autorisées à être publiques. Les fichiers vont dans `public/assets/`, puis leurs chemins et textes alternatifs français/anglais dans `screenshots`.

**Le dépôt app33 est confidentiel.** Ne renseigner aucun lien interne dans `github`, ne publier ni code ni capture interne. Une description des missions et apprentissages compatible avec la confidentialité suffit.

## Statuts et limites à préserver

Dans `src/data/projects.ts` :

- `draft` : sujet à confirmer et documenter — RSA et HTTPS/TLS.
- `listed` : projet/simulation mentionné dans le CV, avec détails et résultats encore partiels.
- `documented` : source détaillée consultée — PFA, DentalTech, notebook énergétique. Cela ne constitue pas une validation indépendante du fonctionnement.

Compléter les deux langues et ne changer le statut que lorsque les informations le justifient. Un dépôt public ne prouve ni la réussite des tests ni la contribution personnelle à tout le code.

Le rapport PFA consigne **66 → 10 vulnérabilités Trivy HIGH/CRITICAL**, avec dix restantes, ainsi que des contrôles séparés sur dépendances, code et secrets. Les scans n’ont pas été relancés ici. Le contrôle Django était en mode durci simulé ; aucun déploiement de production n’est revendiqué et le rapport ne documente pas de pipeline CI/CD complet.

DentalTech est collectif, avec autorisation/RBAC encore incomplet. Le notebook énergétique ne fournit pas son dataset et aucun score n’a été repris. Les formations du CV ne sont pas transformées en certifications obtenues sans justificatif.

Le badge Oracle Architect Associate fourni est distinct de la formation OCI Security mentionnée au CV. Son année d’édition ne prouve pas une date d’obtention ; aucun nom de titulaire ni lien de vérification ne figure sur l’image. Le PDF joint par erreur a été exclu des ressources publiques.

## Vérifier après personnalisation

Les contrôles après les améliorations visuelles ont réussi : **lint, 44 tests dans huit fichiers et build de production**. Aucune dépendance n’a été modifiée. Les nouveaux tests couvrent la pause persistante, les changements de préférence système, le nettoyage de l’éclairage au pointeur, le mode tactile et la suspension du décor hors écran. La recette visuelle reste à faire, aucun navigateur n’étant disponible dans l’environnement d’automatisation.

La prévisualisation répond HTTP 200 pour la page et les ressources, dont le CV, la photo et les deux figures PFA. Le PDF servi est identique au document fourni ; les métadonnées structurées du nom et des liens professionnels ont été contrôlées.

Après toute modification, exécuter à la racine :

```powershell
npm run lint
npm test
npm run build
npm run preview
```

Ouvrir `http://localhost:5174` pour vérifier ordinateur/mobile, CV, photo, liens, contact, FR/EN, filtres, fiches, terminal, navigation au clavier et réduction des animations. Avec une messagerie configurée, le formulaire ouvre un brouillon ; le visiteur effectue l’envoi.

Pour le développement : `npm run dev`, puis l’URL affichée par Vite, généralement `http://localhost:5173`. Voir [README.md](README.md) pour le lancement et les configurations Vercel/Netlify, sans déploiement automatique.
